import { siteProfile } from '@/shared/config/siteProfile';

export const ContactPage = () => {
  return (
    <div className="page-stack contact-page">
      <section className="surface-card page-intro contact-panel">
        <h1>Get In Touch</h1>
        <p>
          The easiest way to reach me is by email, and you can also find my work and repositories
          on GitHub.
        </p>
      </section>

      <section className="surface-card contact-links">
        <a className="contact-link-card" href={`mailto:${siteProfile.email}`}>
          <div>
            <strong>Email</strong>
            <span>{siteProfile.email}</span>
          </div>
          <span className="meta-label">Write</span>
        </a>

        <a
          className="contact-link-card"
          href={siteProfile.githubUrl}
          target="_blank"
          rel="noreferrer"
        >
          <div>
            <strong>GitHub</strong>
            <span>{siteProfile.githubUrl}</span>
          </div>
          <span className="meta-label">Visit</span>
        </a>
      </section>
    </div>
  );
};
