import { AppRouter } from './router'
import { AIInitializer } from './components/AIInitializer'
import './App.css'

function App() {
  return (
    <AIInitializer>
      <AppRouter />
    </AIInitializer>
  )
}

export default App