import { useState, useEffect } from 'react'
import './styles/globals.css'

function App() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-dark-bg dark:to-gray-900">
      <div className="container mx-auto px-4 py-16">
        <div className={`transition-opacity duration-1000 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
          <h1 className="text-5xl font-bold text-center mb-4 bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
            Learner Files v3.5
          </h1>
          <p className="text-xl text-center text-gray-600 dark:text-gray-300 mb-8">
            AISE Developer Portfolio - Tier 2 Graduation Showcase
          </p>
          
          <div className="card max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold mb-4">🚀 Portfolio Initializing...</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Your AI-enhanced portfolio is being constructed. This is your mission control.
            </p>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <span className="text-green-500">✓</span>
                <span>Repository Created</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-green-500">✓</span>
                <span>Build System Configured</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="animate-pulse text-yellow-500">⏳</span>
                <span>Deploying to GitHub Pages...</span>
              </div>
            </div>
            
            <button className="btn-primary mt-6 w-full">
              View Build Status
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
