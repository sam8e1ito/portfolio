import { usePortfolioData } from '@/app/providers/usePortfolioData';
import { Timeline } from '@/features/timeline/Timeline';

export const AboutPage = () => {
  const { timelineEvents } = usePortfolioData();

  return (
    <div className="page-stack">
      <section className="surface-card page-intro">
        <h1>About Me</h1>
      </section>

      <section className="surface-card">
        <Timeline items={timelineEvents} />
      </section>
    </div>
  );
};
