export type ThemeMode = 'light' | 'dark';

export type Project = {
  id: string;
  title: string;
  date: number;
  image: string;
  description: string;
  techStack: string[];
  githubUrl?: string;
  liveUrl?: string;
};

export type TimelineEvent = {
  id: string;
  title: string;
  date: number;
  description: string;
  image?: string;
};

export type ProjectInput = Omit<Project, 'id'>;

export type TimelineEventInput = Omit<TimelineEvent, 'id'>;

export type ContentMode = 'demo' | 'firebase';
