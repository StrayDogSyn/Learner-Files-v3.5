import React, { useEffect } from 'react';
import GitHubStats from './components/GitHubStats';
import ProjectShowcase from './components/ProjectShowcase';
import { useAnalytics } from './hooks/useAnalytics';
import './App.css';

function App() {
  const { trackEvent } = useAnalytics();

  // Track app initialization
  React.useEffect(() => {
    trackEvent('page_view', {
      component: 'App',
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent
    });
  }, [trackEvent]);

  return (
    <div className="app">
      {/* GitHub Stats Component - will be integrated into hero section */}
      <div id="github-stats-container" className="github-stats-container">
        <GitHubStats />
      </div>
      
      {/* Dynamic Project Showcase - will replace static project cards */}
      <div id="dynamic-projects-container" className="dynamic-projects-container">
        <ProjectShowcase />
      </div>
    </div>
  );
}

export default App;