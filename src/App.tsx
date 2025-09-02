import { createHashRouter, RouterProvider, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import './styles/globals.css';
import Portfolio from './components/Portfolio';
import CoordinationDashboard from './coordination/CoordinationDashboard';

// Lazy load Marvel Quiz to prevent loading issues
// const MarvelQuizGame = lazy(() => import('./projects/MarvelQuiz/index'));

const router = createHashRouter([
  {
    path: "/",
    element: <Portfolio />,
  },
  // {
  //   path: "/marvel-quiz",
  //   element: (
  //     <Suspense fallback={
  //       <div className="min-h-screen bg-gray-900 flex items-center justify-center">
  //         <div className="text-center">
  //           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
  //           <p className="text-white">Loading Marvel Quiz...</p>
  //         </div>
  //       </div>
  //     }>
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