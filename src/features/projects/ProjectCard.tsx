import type { Project } from '@/shared/types/content';
import { formatDisplayDate } from '@/shared/lib/formatters';

type Props = {
  project: Project;
};

export const ProjectCard = ({ project }: Props) => {
  return (
    <article className="project-card">
      <div className="project-image-wrap">
        <img className="project-image" src={project.image} alt={project.title} />
      </div>
      <div className="project-body">
        <p className="meta-label">{formatDisplayDate(project.date)}</p>
        <h3>{project.title}</h3>
        <p>{project.description}</p>
        <div className="tag-row">
          {project.techStack.map((item) => (
            <span key={item} className="tag">
              {item}
            </span>
          ))}
        </div>
        {project.githubUrl || project.liveUrl ? (
          <div className="project-links">
            {project.githubUrl ? (
              <a href={project.githubUrl} target="_blank" rel="noreferrer" className="ghost-button">
                GitHub
              </a>
            ) : null}
            {project.liveUrl ? (
              <a href={project.liveUrl} target="_blank" rel="noreferrer" className="primary-link">
                Live site
              </a>
            ) : null}
          </div>
        ) : null}
      </div>
    </article>
  );
};
