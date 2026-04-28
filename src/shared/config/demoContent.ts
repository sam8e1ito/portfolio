import type { Project, TimelineEvent } from '@/shared/types/content';

export const demoProjects: Project[] = [
  {
    id: 'demo-project-1',
    title: 'Realtime Orders Dashboard',
    date: new Date('2026-03-18').getTime(),
    image:
      '/public/img-placeholder.jpg',
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
      '/public/img-placeholder.jpg',
    description:
      'A booking-focused site with conversion-minded sections, service highlights, and a quick contact handoff.',
    techStack: ['Vite', 'React Router', 'Sass'],
    githubUrl: 'https://github.com/your-username/studio-booking-flow',
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
