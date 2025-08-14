import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './styles/globals.css';
import MarvelQuizGame from './projects/MarvelQuiz/index';
import Portfolio from './components/Portfolio';



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Portfolio />} />
        <Route path="/marvel-quiz" element={<MarvelQuizGame />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App
