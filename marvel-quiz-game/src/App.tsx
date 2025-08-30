import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import QuizGame from './components/QuizGame';
import Results from './components/Results';
import MarvelQuiz from './components/MarvelQuiz';
import { GameProvider } from './context/GameContext';
import './App.css';

function App() {
  return (
    <GameProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-red-900 via-blue-900 to-purple-900">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/quiz" element={<QuizGame />} />
            <Route path="/marvel-quiz" element={<MarvelQuiz />} />
            <Route path="/results" element={<Results />} />
          </Routes>
        </div>
      </Router>
    </GameProvider>
  );
}

export default App;