import { createHashRouter, RouterProvider, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import './styles/globals.css';
import Portfolio from './components/Portfolio';
import CoordinationDashboard from './coordination/CoordinationDashboard';

// Lazy load new portfolio sections
const ProjectShowcase = lazy(() => import('./components/projects/ProjectShowcase'));
const AIArtGallery = lazy(() => import('./components/gallery/AIArtGallery'));
const ProjectDemo = lazy(() => import('./components/demos/ProjectDemo'));
const IntelligentSearch = lazy(() => import('./components/search/IntelligentSearch'));

// Loading component with Hunter Green theme
const LoadingSpinner = ({ message }: { message: string }) => (
  <div className="min-h-screen bg-gray-900 flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
      <p className="text-white">{message}</p>
    </div>
  </div>
);

// Lazy load Marvel Quiz to prevent loading issues
// const MarvelQuizGame = lazy(() => import('./projects/MarvelQuiz/index'));

const router = createHashRouter([
  {
    path: "/",
    element: <Portfolio />,
  },
  {
    path: "/projects",
    element: (
      <Suspense fallback={<LoadingSpinner message="Loading Project Gallery..." />}>
        <ProjectShowcase />
      </Suspense>
    ),
  },
  {
    path: "/gallery",
    element: (
      <Suspense fallback={<LoadingSpinner message="Loading AI Art Gallery..." />}>
        <AIArtGallery />
      </Suspense>
    ),
  },
  {
    path: "/demos",
    element: (
      <Suspense fallback={<LoadingSpinner message="Loading Interactive Demos..." />}>
        <ProjectDemo />
      </Suspense>
    ),
  },
  {
    path: "/demos/:projectId",
    element: (
      <Suspense fallback={<LoadingSpinner message="Loading Demo..." />}>
        <ProjectDemo />
      </Suspense>
    ),
  },
  {
    path: "/search",
    element: (
      <Suspense fallback={<LoadingSpinner message="Loading Intelligent Search..." />}>
        <IntelligentSearch />
      </Suspense>
    ),
  },
  // {
  //   path: "/marvel-quiz",
  //   element: (
  //     <Suspense fallback={<LoadingSpinner message="Loading Marvel Quiz..." />}>
  //       <MarvelQuizGame />
  //     </Suspense>
  //   ),
  // },
  {
    path: "/coordination",
    element: <CoordinationDashboard />,
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App