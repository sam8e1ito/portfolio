import { useState, type FormEvent } from 'react';
import { usePortfolioData } from '@/app/providers/usePortfolioData';
import { formatDisplayDate, formatInputDate, parseCommaSeparatedList } from '@/shared/lib/formatters';
import type { ProjectInput, TimelineEventInput } from '@/shared/types/content';

const getInitialProjectForm = (): ProjectInput => ({
  title: '',
  date: Date.now(),
  image: '',
  description: '',
  techStack: [],
  githubUrl: '',
  liveUrl: '',
});

const getInitialTimelineForm = (): TimelineEventInput => ({
  title: '',
  date: Date.now(),
  description: '',
  image: '',
});

export const AdminPanel = () => {
  const {
    mode,
    projects,
    timelineEvents,
    isAdmin,
    isAuthReady,
    currentUser,
    signInAsAdmin,
    signOutAdmin,
    addProject,
    updateProject,
    deleteProject,
    addTimelineEvent,
    updateTimelineEvent,
    deleteTimelineEvent,
  } = usePortfolioData();
  const [projectForm, setProjectForm] = useState<ProjectInput>(getInitialProjectForm);
  const [timelineForm, setTimelineForm] = useState<TimelineEventInput>(getInitialTimelineForm);
  const [techStackInput, setTechStackInput] = useState('');
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [editingTimelineId, setEditingTimelineId] = useState<string | null>(null);
  const [demoPassword, setDemoPassword] = useState('');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleProjectSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setStatusMessage(null);

    try {
      const payload: ProjectInput = {
        ...projectForm,
        techStack: parseCommaSeparatedList(techStackInput),
      };

      if (editingProjectId) {
        await updateProject(editingProjectId, payload);
      } else {
        await addProject(payload);
      }

      setProjectForm(getInitialProjectForm());
      setTechStackInput('');
      setEditingProjectId(null);
      setStatusMessage(editingProjectId ? 'Project updated successfully.' : 'Project saved successfully.');
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : 'Failed to save the project.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTimelineSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setStatusMessage(null);

    try {
      if (editingTimelineId) {
        await updateTimelineEvent(editingTimelineId, timelineForm);
      } else {
        await addTimelineEvent(timelineForm);
      }

      setTimelineForm(getInitialTimelineForm());
      setEditingTimelineId(null);
      setStatusMessage(
        editingTimelineId ? 'Timeline event updated successfully.' : 'Timeline event saved successfully.',
      );
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : 'Failed to save the timeline event.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAdminUnlock = async () => {
    setStatusMessage(null);

    try {
      await signInAsAdmin(mode === 'demo' ? demoPassword : undefined);
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : 'Failed to unlock the admin panel.');
    }
  };

  const handleDeleteProject = async (id: string) => {
    setStatusMessage(null);

    try {
      await deleteProject(id);
      setStatusMessage('Project removed.');
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : 'Failed to remove the project.');
    }
  };

  const handleDeleteTimelineEvent = async (id: string) => {
    setStatusMessage(null);

    try {
      await deleteTimelineEvent(id);
      setStatusMessage('Timeline event removed.');
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : 'Failed to remove the timeline event.');
    }
  };

  const handleSignOut = async () => {
    await signOutAdmin();
    setStatusMessage('Signed out of admin mode.');
  };

  const handleProjectEdit = (projectId: string) => {
    const selectedProject = projects.find((project) => project.id === projectId);
    if (!selectedProject) {
      return;
    }

    setEditingProjectId(projectId);
    setProjectForm({
      title: selectedProject.title,
      date: selectedProject.date,
      image: selectedProject.image,
      description: selectedProject.description,
      techStack: selectedProject.techStack,
      githubUrl: selectedProject.githubUrl ?? '',
      liveUrl: selectedProject.liveUrl ?? '',
    });
    setTechStackInput(selectedProject.techStack.join(', '));
  };

  const handleTimelineEdit = (timelineId: string) => {
    const selectedTimelineEvent = timelineEvents.find((event) => event.id === timelineId);
    if (!selectedTimelineEvent) {
      return;
    }

    setEditingTimelineId(timelineId);
    setTimelineForm({
      title: selectedTimelineEvent.title,
      date: selectedTimelineEvent.date,
      description: selectedTimelineEvent.description,
      image: selectedTimelineEvent.image ?? '',
    });
  };

  const resetProjectEditor = () => {
    setEditingProjectId(null);
    setProjectForm(getInitialProjectForm());
    setTechStackInput('');
  };

  const resetTimelineEditor = () => {
    setEditingTimelineId(null);
    setTimelineForm(getInitialTimelineForm());
  };

  return (
    <div className="admin-layout">
      <section className="surface-card">
        <h1>Admin Panel</h1>
        <div className="status-row">
          <span className="status-pill">{mode === 'firebase' ? 'Firebase mode' : 'Demo mode'}</span>
          <span className="status-pill">{isAdmin ? 'Admin unlocked' : 'Read-only visitor'}</span>
        </div>
        {statusMessage ? <p className="info-text">{statusMessage}</p> : null}

        {!isAdmin ? (
          <div className="auth-panel">
            {mode === 'demo' ? (
              <>
                <label>
                  Demo admin password
                  <input
                    type="password"
                    value={demoPassword}
                    onChange={(event) => setDemoPassword(event.target.value)}
                    placeholder="Enter local admin password"
                  />
                </label>
                <button type="button" className="primary-button" onClick={handleAdminUnlock}>
                  Unlock demo admin
                </button>
              </>
            ) : (
              <>
                <p>
                  {isAuthReady && currentUser
                    ? 'You are signed in, but your account is not marked as an admin in Firestore.'
                    : 'Sign in with Google, then allow your uid in the Firestore admins collection.'}
                </p>
                <button type="button" className="primary-button" onClick={handleAdminUnlock}>
                  Sign in with Google
                </button>
              </>
            )}
          </div>
        ) : (
          <div className="admin-user-row">
            <p>{currentUser?.email ?? 'Demo admin session active'}</p>
            <button type="button" className="ghost-button" onClick={handleSignOut}>
              Sign out
            </button>
          </div>
        )}
      </section>

      {isAdmin ? (
        <div className="admin-grid">
          <section className="surface-card">
            <p className="meta-label">{editingProjectId ? 'Edit project' : 'Add project'}</p>
            <form className="admin-form" onSubmit={handleProjectSubmit}>
              <label>
                Title
                <input
                  required
                  value={projectForm.title}
                  onChange={(event) =>
                    setProjectForm((currentValue) => ({
                      ...currentValue,
                      title: event.target.value,
                    }))
                  }
                />
              </label>
              <label>
                Date
                <input
                  required
                  type="date"
                  value={formatInputDate(projectForm.date)}
                  onChange={(event) =>
                    setProjectForm((currentValue) => ({
                      ...currentValue,
                      date: new Date(event.target.value).getTime(),
                    }))
                  }
                />
              </label>
              <label>
                Image URL
                <input
                  required
                  type="url"
                  value={projectForm.image}
                  onChange={(event) =>
                    setProjectForm((currentValue) => ({
                      ...currentValue,
                      image: event.target.value,
                    }))
                  }
                />
              </label>
              <label>
                Description
                <textarea
                  required
                  rows={5}
                  value={projectForm.description}
                  onChange={(event) =>
                    setProjectForm((currentValue) => ({
                      ...currentValue,
                      description: event.target.value,
                    }))
                  }
                />
              </label>
              <label>
                Tech stack
                <input
                  value={techStackInput}
                  onChange={(event) => setTechStackInput(event.target.value)}
                  placeholder="React, TypeScript, Firebase"
                />
              </label>
              <label>
                GitHub URL
                <input
                  type="url"
                  value={projectForm.githubUrl ?? ''}
                  onChange={(event) =>
                    setProjectForm((currentValue) => ({
                      ...currentValue,
                      githubUrl: event.target.value,
                    }))
                  }
                  placeholder="https://github.com/your-username/project"
                />
              </label>
              <label>
                Live URL
                <input
                  type="url"
                  value={projectForm.liveUrl ?? ''}
                  onChange={(event) =>
                    setProjectForm((currentValue) => ({
                      ...currentValue,
                      liveUrl: event.target.value,
                    }))
                  }
                  placeholder="https://your-project.example.com"
                />
              </label>
              <div className="admin-actions">
                <button type="submit" className="primary-button" disabled={isSubmitting}>
                  {editingProjectId ? 'Update project' : 'Save project'}
                </button>
                {editingProjectId ? (
                  <button type="button" className="ghost-button" onClick={resetProjectEditor}>
                    Cancel
                  </button>
                ) : null}
              </div>
            </form>
          </section>

          <section className="surface-card">
            <p className="meta-label">{editingTimelineId ? 'Edit timeline event' : 'Add timeline event'}</p>
            <form className="admin-form" onSubmit={handleTimelineSubmit}>
              <label>
                Title
                <input
                  required
                  value={timelineForm.title}
                  onChange={(event) =>
                    setTimelineForm((currentValue) => ({
                      ...currentValue,
                      title: event.target.value,
                    }))
                  }
                />
              </label>
              <label>
                Date
                <input
                  required
                  type="date"
                  value={formatInputDate(timelineForm.date)}
                  onChange={(event) =>
                    setTimelineForm((currentValue) => ({
                      ...currentValue,
                      date: new Date(event.target.value).getTime(),
                    }))
                  }
                />
              </label>
              <label>
                Description
                <textarea
                  required
                  rows={5}
                  value={timelineForm.description}
                  onChange={(event) =>
                    setTimelineForm((currentValue) => ({
                      ...currentValue,
                      description: event.target.value,
                    }))
                  }
                />
              </label>
              <label>
                Optional image URL
                <input
                  type="url"
                  value={timelineForm.image}
                  onChange={(event) =>
                    setTimelineForm((currentValue) => ({
                      ...currentValue,
                      image: event.target.value,
                    }))
                  }
                />
              </label>
              <div className="admin-actions">
                <button type="submit" className="primary-button" disabled={isSubmitting}>
                  {editingTimelineId ? 'Update timeline event' : 'Save timeline event'}
                </button>
                {editingTimelineId ? (
                  <button type="button" className="ghost-button" onClick={resetTimelineEditor}>
                    Cancel
                  </button>
                ) : null}
              </div>
            </form>
          </section>

          <section className="surface-card">
            <p className="meta-label">Current projects</p>
            <div className="admin-list">
              {projects.map((project) => (
                <div key={project.id} className="admin-list-item">
                  <div>
                    <h3>{project.title}</h3>
                    <p>{formatDisplayDate(project.date)}</p>
                  </div>
                  <div className="admin-item-actions">
                    <button
                      type="button"
                      className="ghost-button"
                      onClick={() => handleProjectEdit(project.id)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="ghost-button"
                      onClick={() => handleDeleteProject(project.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="surface-card">
            <p className="meta-label">Current timeline</p>
            <div className="admin-list">
              {timelineEvents.map((event) => (
                <div key={event.id} className="admin-list-item">
                  <div>
                    <h3>{event.title}</h3>
                    <p>{formatDisplayDate(event.date)}</p>
                  </div>
                  <div className="admin-item-actions">
                    <button
                      type="button"
                      className="ghost-button"
                      onClick={() => handleTimelineEdit(event.id)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="ghost-button"
                      onClick={() => handleDeleteTimelineEvent(event.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      ) : null}
    </div>
  );
};
