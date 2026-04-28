import type { TimelineEvent as TimelineEventItem } from '@/shared/types/content';
import { formatDisplayDate } from '@/shared/lib/formatters';

type Props = {
  items: TimelineEventItem[];
};

export const Timeline = ({ items }: Props) => {
  return (
    <div className="timeline">
      {items.map((item) => (
        <article key={item.id} className="timeline-item">
          <div className="timeline-marker" aria-hidden="true" />
          <div className="timeline-card">
            <p className="meta-label">{formatDisplayDate(item.date)}</p>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
            {item.image ? (
              <div className="timeline-image-wrap">
                <img className="timeline-image" src={item.image} alt={item.title} />
              </div>
            ) : null}
          </div>
        </article>
      ))}
    </div>
  );
};
