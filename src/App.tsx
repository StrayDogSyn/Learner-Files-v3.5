import { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './styles/globals.css';

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

// Marvel Quiz Component (temporary placeholder)
const MarvelQuiz = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-black to-yellow-900">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center text-white">
          <h1 className="text-6xl font-bold mb-8">Marvel Quiz Game</h1>
          <div className="bg-black/50 backdrop-blur-lg rounded-2xl p-12 max-w-2xl mx-auto">
            <h2 className="text-3xl mb-6">🚀 Loading Game...</h2>
            <p className="text-xl mb-8">
              The Marvel Quiz is being assembled...
            </p>
            <a
              href="#/"
              className="inline-block px-8 py-4 bg-gradient-to-r from-red-600 to-yellow-600
                       text-white font-bold rounded-lg hover:scale-105 transition-transform"
            >
              Back to Portfolio
            </a>
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
        <Route path="/marvel-quiz" element={<MarvelQuiz />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App
