import { createHashRouter, RouterProvider, Navigate } from 'react-router-dom';
import './styles/globals.css';
import MarvelQuizGame from './projects/MarvelQuiz/index';
import Portfolio from './components/Portfolio';

const router = createHashRouter([
  {
    path: "/",
    element: <Portfolio />,
  },
  {
    path: "/marvel-quiz",
    element: <MarvelQuizGame />,
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
