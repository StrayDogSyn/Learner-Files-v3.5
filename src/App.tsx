import React, { useEffect, useState } from 'react';
import GitHubStats from './components/GitHubStats';
import ProjectShowcase from './components/ProjectShowcase';
import AIDemo from './pages/AIDemo';
import ROICalculator from './pages/ROICalculator';
import MetricsDashboard from './pages/MetricsDashboard';
import CaseStudyGenerator from './pages/CaseStudyGenerator';
import GlassmorphicDemo from './pages/GlassmorphicDemo';
import { AIHeroSection, AILeadQualificationChatbot } from './components/ai';
import { useAnalytics } from './hooks/useAnalytics';
import './App.css';

type ViewType = 'portfolio' | 'ai-demo' | 'roi-calculator' | 'metrics-dashboard' | 'case-studies' | 'glassmorphic-demo';

const VIEW_TYPES = {
  PORTFOLIO: 'portfolio' as ViewType,
  AI_DEMO: 'ai-demo' as ViewType,
  ROI_CALCULATOR: 'roi-calculator' as ViewType,
  METRICS_DASHBOARD: 'metrics-dashboard' as ViewType,
  CASE_STUDIES: 'case-studies' as ViewType,
  GLASSMORPHIC_DEMO: 'glassmorphic-demo' as ViewType
};

const INITIAL_VIEW: ViewType = VIEW_TYPES.PORTFOLIO;

function App() {
  const { trackEvent } = useAnalytics();
  const [currentView, setCurrentView] = useState<ViewType>(INITIAL_VIEW as ViewType);

  // Track app initialization
  React.useEffect(() => {
    trackEvent('page_view', {
      component: 'App',
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent
    });
  }, [trackEvent]);

  // Check URL for AI demo route
  React.useEffect(() => {
    const path = window.location.pathname;
    if (path.includes('/ai-demo')) {
      setCurrentView(VIEW_TYPES.AI_DEMO);
    } else if (path.includes('/roi-calculator')) {
      setCurrentView(VIEW_TYPES.ROI_CALCULATOR);
    } else if (path.includes('/metrics-dashboard')) {
      setCurrentView(VIEW_TYPES.METRICS_DASHBOARD);
    } else if (path.includes('/case-studies')) {
      setCurrentView(VIEW_TYPES.CASE_STUDIES);
    } else if (path.includes('/glassmorphic-demo')) {
      setCurrentView(VIEW_TYPES.GLASSMORPHIC_DEMO);
    }
  }, []);

  const handleViewChange = (view: ViewType) => {
    setCurrentView(view);
    const path = view === VIEW_TYPES.AI_DEMO ? '/ai-demo' : 
                 view === VIEW_TYPES.ROI_CALCULATOR ? '/roi-calculator' : 
                 view === VIEW_TYPES.METRICS_DASHBOARD ? '/metrics-dashboard' : 
                 view === VIEW_TYPES.CASE_STUDIES ? '/case-studies' : 
                 view === VIEW_TYPES.GLASSMORPHIC_DEMO ? '/glassmorphic-demo' : '/';
    window.history.pushState({}, '', path);
  };

  if (currentView === VIEW_TYPES.AI_DEMO) {
    return <AIDemo />;
  }

  if (currentView === VIEW_TYPES.ROI_CALCULATOR) {
    return <ROICalculator />;
  }

  if (currentView === VIEW_TYPES.METRICS_DASHBOARD) {
    return <MetricsDashboard />;
  }

  if (currentView === VIEW_TYPES.CASE_STUDIES) {
    return <CaseStudyGenerator />;
  }

  if (currentView === VIEW_TYPES.GLASSMORPHIC_DEMO) {
    return <GlassmorphicDemo />;
  }

  return (
    <div className="app">
      {/* Navigation */}
      <nav className="fixed top-4 right-4 z-50 flex gap-2">
        <button
          onClick={() => handleViewChange(VIEW_TYPES.PORTFOLIO)}
          className={`px-3 py-2 backdrop-blur-md border rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105 ${
            currentView === VIEW_TYPES.PORTFOLIO
              ? 'bg-green-600/30 border-green-500/50 text-green-400'
              : 'bg-green-600/20 border-green-500/30 text-green-400 hover:bg-green-600/30'
          }`}
        >
          Portfolio
        </button>
        <button
          onClick={() => handleViewChange(VIEW_TYPES.AI_DEMO)}
          className={`px-3 py-2 backdrop-blur-md border rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105 ${
            currentView === VIEW_TYPES.AI_DEMO
              ? 'bg-green-600/30 border-green-500/50 text-green-400'
              : 'bg-green-600/20 border-green-500/30 text-green-400 hover:bg-green-600/30'
          }`}
        >
          AI Demo
        </button>
        <button
          onClick={() => handleViewChange(VIEW_TYPES.ROI_CALCULATOR)}
          className={`px-3 py-2 backdrop-blur-md border rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105 ${
            currentView === VIEW_TYPES.ROI_CALCULATOR
              ? 'bg-green-600/30 border-green-500/50 text-green-400'
              : 'bg-green-600/20 border-green-500/30 text-green-400 hover:bg-green-600/30'
          }`}
        >
          ROI Calc
        </button>
        <button
          onClick={() => handleViewChange(VIEW_TYPES.METRICS_DASHBOARD)}
          className={`px-3 py-2 backdrop-blur-md border rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105 ${
            currentView === VIEW_TYPES.METRICS_DASHBOARD
              ? 'bg-green-600/30 border-green-500/50 text-green-400'
              : 'bg-green-600/20 border-green-500/30 text-green-400 hover:bg-green-600/30'
          }`}
        >
          Metrics
        </button>
        <button
          onClick={() => handleViewChange(VIEW_TYPES.CASE_STUDIES)}
          className={`px-3 py-2 backdrop-blur-md border rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105 ${
            currentView === VIEW_TYPES.CASE_STUDIES
              ? 'bg-green-600/30 border-green-500/50 text-green-400'
              : 'bg-green-600/20 border-green-500/30 text-green-400 hover:bg-green-600/30'
          }`}
        >
          Cases
        </button>
        <button
          onClick={() => handleViewChange(VIEW_TYPES.GLASSMORPHIC_DEMO)}
          className={`px-3 py-2 backdrop-blur-md border rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105 ${
            currentView === VIEW_TYPES.GLASSMORPHIC_DEMO
              ? 'bg-green-600/30 border-green-500/50 text-green-400'
              : 'bg-green-600/20 border-green-500/30 text-green-400 hover:bg-green-600/30'
          }`}
        >
          Glass
        </button>
      </nav>

      {/* AI-Powered Hero Section */}
      <AIHeroSection className="mb-20" />
      
      {/* GitHub Stats Component - Enhanced with AI insights */}
      <div id="github-stats-container" className="github-stats-container mb-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Development Metrics</h2>
            <p className="text-lg text-gray-300">Real-time insights into our technical capabilities</p>
          </div>
          <GitHubStats />
        </div>
      </div>
      
      {/* Dynamic Project Showcase - AI-Enhanced */}
      <div id="dynamic-projects-container" className="dynamic-projects-container">
        <ProjectShowcase />
      </div>
      
      {/* AI Lead Qualification Chatbot - Available on all pages */}
      <AILeadQualificationChatbot />
    </div>
  );
}

export default App;