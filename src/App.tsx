import { Suspense, lazy } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Portfolio from './components/Portfolio'
import './styles/globals.css'

// Lazy load the Marvel Quiz
const MarvelQuiz = lazy(() => import('./projects/MarvelQuiz'))

// Loading component
const LoadingScreen = () => (
  <div className="min-h-screen bg-charcoal-dark flex items-center justify-center">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-hunter-emerald border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-metallic-silver text-lg">Loading...</p>
    </div>
  </div>
)

function App() {
  return (
    <Router basename="/Learner-Files-v3.5">
      <Routes>
        <Route path="/" element={<Portfolio />} />
        <Route 
          path="/marvel-quiz" 
          element={
            <Suspense fallback={<LoadingScreen />}>
              <MarvelQuiz />
            </Suspense>
          } 
        />
      </Routes>
    </Router>
  )
}

export default App
