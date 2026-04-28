import { Link } from 'react-router-dom';
import { usePortfolioData } from '@/app/providers/usePortfolioData';
import { ProjectCard } from '@/features/projects/ProjectCard';
import { TechCarousel } from '@/features/stack/TechCarousel';

export const HomePage = () => {
  const { projects } = usePortfolioData();
  const latestProjects = projects.slice(0, 2);

  return (
    <div className="page-stack home-page">
      <section className="home-hero">
        <div className="home-hero__copy">
          <p className="eyebrow">web-developer</p>
          <h1>Hey, i'm Samvel Symonian</h1>
          <p className="lead">
            I build modern, fast and user-focused web applications.
          </p>
          <div className="home-hero__actions">
            <Link to="/projects" className="primary-link">
              Explore projects
            </Link>
            <Link to="/about" className="secondary-link">
              About me
            </Link>
          </div>
        </div>
      </section>

      <section className="surface-card home-about">
        <div>
          <p className="meta-label">About me</p>
          <h2>Get to know me better</h2>
        </div>
        <p>
          I'm a self-taught web developer currently studying in Germany, focused on building real-world projects and improving my skills every day.  
          I started with the basics of HTML, CSS and JavaScript, and quickly moved on to more advanced tools like TypeScript and modern frameworks.
  
          What drives me most is understanding how things work behind the scenes and turning ideas into functional products.  
          I enjoy solving problems, structuring code and continuously learning new technologies.

        </p>
      </section>

      <section className="surface-card home-stack">
        <div className="section-heading">
          <div>
            <p className="meta-label">Tech stack</p>
            <h2>Tools I like building with</h2>
          </div>
        </div>
        <TechCarousel />
      </section>

      <section className="surface-card home-recent">
        <div className="section-heading">
          <div>
            <p className="meta-label">Latest projects</p>
            <h2>Two recent pieces of work</h2>
          </div>
        </div>
        <div className="project-grid">
          {latestProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
        <div className="section-footer">
          <Link to="/projects" className="primary-link home-recent__link">
            See more
          </Link>
        </div>
      </section>
    </div>
  );
};
