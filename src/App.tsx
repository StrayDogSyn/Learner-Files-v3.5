import { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './styles/globals.css';
import MarvelQuizGame from './projects/MarvelQuiz/index';

// Portfolio components
const Portfolio = () => {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <div className="container mx-auto px-4 py-16">
        <div className={`transition-all duration-1000 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
          <h1 className="text-6xl font-bold text-center mb-4 text-white">
            Learner Files <span className="text-blue-400">v3.5</span>
          </h1>
          
          <div className="mt-12 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
              <h2 className="text-3xl font-bold text-white mb-4">Featured Project</h2>
              <a
                href="#/marvel-quiz"
                className="inline-block px-6 py-3 bg-red-600 hover:bg-red-700
                         text-white font-bold rounded-lg transition-colors"
              >
                Play Marvel Quiz →
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};



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
