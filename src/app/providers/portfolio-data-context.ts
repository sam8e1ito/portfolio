import { createContext } from 'react';
import type { User } from 'firebase/auth';
import type {
  ContentMode,
  Project,
  ProjectInput,
  TimelineEvent,
  TimelineEventInput,
} from '@/shared/types/content';

export type PortfolioDataContextValue = {
  mode: ContentMode;
  projects: Project[];
  timelineEvents: TimelineEvent[];
  isLoading: boolean;
  errorMessage: string | null;
  currentUser: User | null;
  isAdmin: boolean;
  isAuthReady: boolean;
  signInAsAdmin: (password?: string) => Promise<void>;
  signOutAdmin: () => Promise<void>;
  addProject: (input: ProjectInput) => Promise<void>;
  updateProject: (id: string, input: ProjectInput) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  addTimelineEvent: (input: TimelineEventInput) => Promise<void>;
  updateTimelineEvent: (id: string, input: TimelineEventInput) => Promise<void>;
  deleteTimelineEvent: (id: string) => Promise<void>;
};

export const PortfolioDataContext = createContext<PortfolioDataContextValue | null>(null);
