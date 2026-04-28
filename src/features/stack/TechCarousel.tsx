import { techStackItems } from '@/shared/config/techStack';

const loopedItems = [...techStackItems, ...techStackItems];

export const TechCarousel = () => {
  return (
    <div className="carousel-shell" aria-label="Technology stack">
      <div className="carousel-track">
        {loopedItems.map((item, index) => (
          <div key={`${item.name}-${index}`} className="carousel-item">
            <img src={item.image} alt={item.name} />
            <span>{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
