import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navigation } from './components/Navigation';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { TechStack } from './pages/TechStack';
import { Experience } from './pages/Experience';
import { Portfolio } from './pages/Portfolio';
import { Contact } from './pages/Contact';
import MarvelQuiz from './components/MarvelQuiz';

function App() {
  return (
    <div className="min-h-screen bg-charcoal-black">
      <Router basename="/Learner-Files-v3.5">
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/demo" element={<MarvelQuiz />} />
          <Route path="/about" element={<About />} />
          <Route path="/tech-stack" element={<TechStack />} />
          <Route path="/experience" element={<Experience />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;