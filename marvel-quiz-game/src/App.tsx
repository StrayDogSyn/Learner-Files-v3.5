import React, { useState } from 'react';
import CompleteMarvelQuiz from './components/CompleteMarvelQuiz';
import CoordinationDashboard from './components/CoordinationDashboard';
import { Monitor, Gamepad2 } from 'lucide-react';
import './App.css';

type AppView = 'quiz' | 'coordination';

function App() {
  const [currentView, setCurrentView] = useState<AppView>('coordination');

  return (
    <div className="App min-h-screen">
      {/* Navigation Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-white">
              Marvel Quiz & Coordination System
            </h1>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentView('coordination')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  currentView === 'coordination'
                    ? 'bg-purple-600 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                <Monitor className="w-4 h-4" />
                Coordination
              </button>
              
              <button
                onClick={() => setCurrentView('quiz')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  currentView === 'quiz'
                    ? 'bg-purple-600 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                <Gamepad2 className="w-4 h-4" />
                Marvel Quiz
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-20">
        {currentView === 'coordination' ? (
          <CoordinationDashboard />
        ) : (
          <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            <CompleteMarvelQuiz />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;