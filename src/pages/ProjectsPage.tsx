import { usePortfolioData } from '@/app/providers/usePortfolioData';
import { ProjectCard } from '@/features/projects/ProjectCard';

export const ProjectsPage = () => {
  const { projects } = usePortfolioData();

  return (
    <div className="page-stack">
      <section className="surface-card page-intro contact-panel">
        <h1>My Projects</h1>
        <p>Here are some of the projects I've been working on.</p>
      </section>

      <section className="project-grid">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </section>
    </div>
  );
};
