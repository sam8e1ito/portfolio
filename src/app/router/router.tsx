import { createBrowserRouter } from 'react-router-dom';
import { Layout } from '@/shared/ui/layout/Layout';
import { AboutPage, AdminPage, ContactPage, HomePage, ProjectsPage } from '@/pages';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'projects', element: <ProjectsPage /> },
      { path: 'about', element: <AboutPage /> },
      { path: 'contact', element: <ContactPage /> },
      { path: 'admin', element: <AdminPage /> },
    ],
  },
]);
