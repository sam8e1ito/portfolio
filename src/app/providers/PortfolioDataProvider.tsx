import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { User } from 'firebase/auth';
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut as firebaseSignOut,
} from 'firebase/auth';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import { auth, db, googleProvider, isFirebaseConfigured } from '@/shared/api/firebase';
import { demoProjects, demoTimelineEvents } from '@/shared/config/demoContent';
import type {
  ContentMode,
  Project,
  ProjectInput,
  TimelineEvent,
  TimelineEventInput,
} from '@/shared/types/content';
import {
  PortfolioDataContext,
  type PortfolioDataContextValue,
} from './portfolio-data-context';

const DEMO_PROJECTS_STORAGE_KEY = 'portfolio-demo-projects';
const DEMO_EVENTS_STORAGE_KEY = 'portfolio-demo-events';
const DEMO_ADMIN_STORAGE_KEY = 'portfolio-demo-admin-session';

const isValidProject = (value: unknown): value is Project => {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Project;
  return (
    typeof candidate.id === 'string' &&
    typeof candidate.title === 'string' &&
    typeof candidate.date === 'number' &&
    typeof candidate.image === 'string' &&
    typeof candidate.description === 'string' &&
    Array.isArray(candidate.techStack) &&
    (typeof candidate.githubUrl === 'string' || typeof candidate.githubUrl === 'undefined') &&
    (typeof candidate.liveUrl === 'string' || typeof candidate.liveUrl === 'undefined')
  );
};

const isValidTimelineEvent = (value: unknown): value is TimelineEvent => {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as TimelineEvent;
  return (
    typeof candidate.id === 'string' &&
    typeof candidate.title === 'string' &&
    typeof candidate.date === 'number' &&
    typeof candidate.description === 'string' &&
    (typeof candidate.image === 'string' || typeof candidate.image === 'undefined')
  );
};

const getStoredCollection = <T,>(
  storageKey: string,
  fallbackValue: T[],
  validator: (value: unknown) => value is T,
) => {
  if (typeof window === 'undefined') {
    return fallbackValue;
  }

  const storedValue = window.localStorage.getItem(storageKey);
  if (!storedValue) {
    return fallbackValue;
  }

  try {
    const parsedValue = JSON.parse(storedValue) as unknown[];
    if (!Array.isArray(parsedValue)) {
      return fallbackValue;
    }

    const validItems = parsedValue.filter(validator);
    return validItems.length ? validItems : fallbackValue;
  } catch {
    return fallbackValue;
  }
};

const setStoredCollection = <T,>(storageKey: string, value: T[]) => {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(storageKey, JSON.stringify(value));
};

const normalizeTimestamp = (value: unknown) => {
  if (typeof value === 'number') {
    return value;
  }

  if (value instanceof Date) {
    return value.getTime();
  }

  if (value && typeof value === 'object' && 'toMillis' in value && typeof value.toMillis === 'function') {
    return value.toMillis();
  }

  if (typeof value === 'string') {
    const parsedValue = new Date(value).getTime();
    return Number.isNaN(parsedValue) ? Date.now() : parsedValue;
  }

  return Date.now();
};

const sortByDateDescending = <T extends { date: number }>(items: T[]) =>
  [...items].sort((firstItem, secondItem) => secondItem.date - firstItem.date);

const getInitialDemoAdminState = () =>
  typeof window !== 'undefined' && window.localStorage.getItem(DEMO_ADMIN_STORAGE_KEY) === 'unlocked';

export const PortfolioDataProvider = ({ children }: { children: ReactNode }) => {
  const mode: ContentMode = isFirebaseConfigured ? 'firebase' : 'demo';
  const [projects, setProjects] = useState<Project[]>(() =>
    sortByDateDescending(
      getStoredCollection<Project>(DEMO_PROJECTS_STORAGE_KEY, demoProjects, isValidProject),
    ),
  );
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>(() =>
    sortByDateDescending(
      getStoredCollection<TimelineEvent>(
        DEMO_EVENTS_STORAGE_KEY,
        demoTimelineEvents,
        isValidTimelineEvent,
      ),
    ),
  );
  const [isLoading, setIsLoading] = useState(mode === 'firebase');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(mode === 'demo' ? getInitialDemoAdminState : false);
  const [isAuthReady, setIsAuthReady] = useState(mode === 'demo');

  useEffect(() => {
    const firestore = db;
    const firebaseAuth = auth;
    if (mode !== 'firebase' || !firestore || !firebaseAuth) {
      return;
    }

    const unsubscribeFromAuth = onAuthStateChanged(firebaseAuth, async (user) => {
      setCurrentUser(user);
      if (!user) {
        setIsAdmin(false);
        setIsAuthReady(true);
        return;
      }

      try {
        const adminSnapshot = await getDoc(doc(firestore, 'admins', user.uid));
        setIsAdmin(adminSnapshot.exists());
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : 'Failed to validate admin access.');
        setIsAdmin(false);
      } finally {
        setIsAuthReady(true);
      }
    });

    return () => {
      unsubscribeFromAuth();
    };
  }, [mode]);

  useEffect(() => {
    const firestore = db;
    if (mode !== 'firebase' || !firestore) {
      return;
    }

    const projectsQuery = query(collection(firestore, 'projects'), orderBy('date', 'desc'));
    const timelineQuery = query(collection(firestore, 'timelineEvents'), orderBy('date', 'desc'));

    const unsubscribeFromProjects = onSnapshot(
      projectsQuery,
      (snapshot) => {
        setProjects(
          snapshot.docs.map((documentSnapshot) => {
            const data = documentSnapshot.data();

            return {
              id: documentSnapshot.id,
              title: String(data.title ?? ''),
              date: normalizeTimestamp(data.date),
              image: String(data.image ?? ''),
              description: String(data.description ?? ''),
              techStack: Array.isArray(data.techStack)
                ? data.techStack.map((item) => String(item))
                : [],
              githubUrl: data.githubUrl ? String(data.githubUrl) : undefined,
              liveUrl: data.liveUrl ? String(data.liveUrl) : undefined,
            };
          }),
        );
        setIsLoading(false);
      },
      (error) => {
        setErrorMessage(error.message);
        setIsLoading(false);
      },
    );

    const unsubscribeFromTimeline = onSnapshot(
      timelineQuery,
      (snapshot) => {
        setTimelineEvents(
          snapshot.docs.map((documentSnapshot) => {
            const data = documentSnapshot.data();

            return {
              id: documentSnapshot.id,
              title: String(data.title ?? ''),
              date: normalizeTimestamp(data.date),
              description: String(data.description ?? ''),
              image: data.image ? String(data.image) : undefined,
            };
          }),
        );
      },
      (error) => {
        setErrorMessage(error.message);
      },
    );

    return () => {
      unsubscribeFromProjects();
      unsubscribeFromTimeline();
    };
  }, [mode]);

  const signInAsAdmin = useCallback(async (password?: string) => {
    setErrorMessage(null);

    if (mode === 'demo') {
      const configuredPassword = import.meta.env.VITE_DEMO_ADMIN_PASSWORD;
      if (!configuredPassword) {
        throw new Error('Set VITE_DEMO_ADMIN_PASSWORD in your env file to unlock demo admin mode.');
      }

      if (password !== configuredPassword) {
        throw new Error('The demo admin password is incorrect.');
      }

      window.localStorage.setItem(DEMO_ADMIN_STORAGE_KEY, 'unlocked');
      setIsAdmin(true);
      return;
    }

    if (!auth || !googleProvider) {
      throw new Error('Firebase auth is not available.');
    }

    await signInWithPopup(auth, googleProvider);
  }, [mode]);

  const signOutAdmin = useCallback(async () => {
    if (mode === 'demo') {
      window.localStorage.removeItem(DEMO_ADMIN_STORAGE_KEY);
      setIsAdmin(false);
      return;
    }

    if (!auth) {
      return;
    }

    await firebaseSignOut(auth);
  }, [mode]);

  const addProject = useCallback(async (input: ProjectInput) => {
    if (mode === 'firebase') {
      if (!db || !isAdmin) {
        throw new Error('Admin access is required to add a project.');
      }

      await addDoc(collection(db, 'projects'), {
        ...input,
        createdAt: serverTimestamp(),
      });
      return;
    }

    const nextProjects = sortByDateDescending([
      {
        id: crypto.randomUUID(),
        ...input,
      },
      ...projects,
    ]);

    setProjects(nextProjects);
    setStoredCollection(DEMO_PROJECTS_STORAGE_KEY, nextProjects);
  }, [isAdmin, mode, projects]);

  const deleteProject = useCallback(async (id: string) => {
    if (mode === 'firebase') {
      if (!db || !isAdmin) {
        throw new Error('Admin access is required to remove a project.');
      }

      await deleteDoc(doc(db, 'projects', id));
      return;
    }

    const nextProjects = projects.filter((project) => project.id !== id);
    setProjects(nextProjects);
    setStoredCollection(DEMO_PROJECTS_STORAGE_KEY, nextProjects);
  }, [isAdmin, mode, projects]);

  const updateProject = useCallback(async (id: string, input: ProjectInput) => {
    if (mode === 'firebase') {
      if (!db || !isAdmin) {
        throw new Error('Admin access is required to update a project.');
      }

      await updateDoc(doc(db, 'projects', id), {
        ...input,
        updatedAt: serverTimestamp(),
      });
      return;
    }

    const nextProjects = sortByDateDescending(
      projects.map((project) => (project.id === id ? { id, ...input } : project)),
    );

    setProjects(nextProjects);
    setStoredCollection(DEMO_PROJECTS_STORAGE_KEY, nextProjects);
  }, [isAdmin, mode, projects]);

  const addTimelineEvent = useCallback(async (input: TimelineEventInput) => {
    if (mode === 'firebase') {
      if (!db || !isAdmin) {
        throw new Error('Admin access is required to add a timeline event.');
      }

      await addDoc(collection(db, 'timelineEvents'), {
        ...input,
        createdAt: serverTimestamp(),
      });
      return;
    }

    const nextEvents = sortByDateDescending([
      {
        id: crypto.randomUUID(),
        ...input,
      },
      ...timelineEvents,
    ]);

    setTimelineEvents(nextEvents);
    setStoredCollection(DEMO_EVENTS_STORAGE_KEY, nextEvents);
  }, [isAdmin, mode, timelineEvents]);

  const deleteTimelineEvent = useCallback(async (id: string) => {
    if (mode === 'firebase') {
      if (!db || !isAdmin) {
        throw new Error('Admin access is required to remove a timeline event.');
      }

      await deleteDoc(doc(db, 'timelineEvents', id));
      return;
    }

    const nextEvents = timelineEvents.filter((event) => event.id !== id);
    setTimelineEvents(nextEvents);
    setStoredCollection(DEMO_EVENTS_STORAGE_KEY, nextEvents);
  }, [isAdmin, mode, timelineEvents]);

  const updateTimelineEvent = useCallback(async (id: string, input: TimelineEventInput) => {
    if (mode === 'firebase') {
      if (!db || !isAdmin) {
        throw new Error('Admin access is required to update a timeline event.');
      }

      await updateDoc(doc(db, 'timelineEvents', id), {
        ...input,
        updatedAt: serverTimestamp(),
      });
      return;
    }

    const nextEvents = sortByDateDescending(
      timelineEvents.map((event) => (event.id === id ? { id, ...input } : event)),
    );

    setTimelineEvents(nextEvents);
    setStoredCollection(DEMO_EVENTS_STORAGE_KEY, nextEvents);
  }, [isAdmin, mode, timelineEvents]);

  const value = useMemo<PortfolioDataContextValue>(
    () => ({
      mode,
      projects,
      timelineEvents,
      isLoading,
      errorMessage,
      currentUser,
      isAdmin,
      isAuthReady,
      signInAsAdmin,
      signOutAdmin,
      addProject,
      updateProject,
      deleteProject,
      addTimelineEvent,
      updateTimelineEvent,
      deleteTimelineEvent,
    }),
    [
      addProject,
      addTimelineEvent,
      currentUser,
      deleteProject,
      deleteTimelineEvent,
      errorMessage,
      isAdmin,
      isAuthReady,
      isLoading,
      mode,
      projects,
      signInAsAdmin,
      signOutAdmin,
      timelineEvents,
      updateProject,
      updateTimelineEvent,
    ],
  );

  return <PortfolioDataContext.Provider value={value}>{children}</PortfolioDataContext.Provider>;
};
