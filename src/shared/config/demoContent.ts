import type { Project, TimelineEvent } from '@/shared/types/content';

export const demoProjects: Project[] = [
  {
    id: 'demo-project-1',
    title: 'Realtime Orders Dashboard',
    date: new Date('2026-03-18').getTime(),
    image:
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
    description:
      'A responsive operations dashboard with live status cards, filtering, and a streamlined review flow for daily order management.',
    techStack: ['React', 'TypeScript', 'Firebase', 'Sass'],
    githubUrl: 'https://github.com/your-username/realtime-orders-dashboard',
    liveUrl: 'https://example.com/realtime-orders-dashboard',
  },
  {
    id: 'demo-project-2',
    title: 'Studio Booking Landing Flow',
    date: new Date('2026-02-05').getTime(),
    image:
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80',
    description:
      'A booking-focused site with conversion-minded sections, service highlights, and a quick contact handoff.',
    techStack: ['Vite', 'React Router', 'Sass'],
    githubUrl: 'https://github.com/your-username/studio-booking-flow',
  },
  {
    id: 'demo-project-3',
    title: 'Portfolio CMS Prototype',
    date: new Date('2025-12-12').getTime(),
    image:
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
    description:
      'An early admin-first prototype for publishing case studies, timeline milestones, and reusable stack content.',
    techStack: ['Firebase Auth', 'Firestore', 'React'],
    githubUrl: 'https://github.com/your-username/portfolio-cms-prototype',
  },
];

export const demoTimelineEvents: TimelineEvent[] = [
  {
    id: 'demo-event-1',
    title: 'Started building client-facing products',
    date: new Date('2023-07-01').getTime(),
    description:
      'Began shipping frontend work for real businesses, focusing on clarity, speed, and maintainable structure.',
  },
  {
    id: 'demo-event-2',
    title: 'Moved into React and TypeScript',
    date: new Date('2024-02-14').getTime(),
    description:
      'Started building more structured UI systems, reusable components, and cleaner data flows.',
  },
  {
    id: 'demo-event-3',
    title: 'Built the first admin-backed portfolio setup',
    date: new Date('2026-04-01').getTime(),
    description:
      'Switched from hardcoded content to managed content so projects and story updates can be published without editing source files.',
  },
];
