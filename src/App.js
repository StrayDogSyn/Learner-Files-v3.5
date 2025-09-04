import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState } from 'react';
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
const VIEW_TYPES = {
    PORTFOLIO: 'portfolio',
    AI_DEMO: 'ai-demo',
    ROI_CALCULATOR: 'roi-calculator',
    METRICS_DASHBOARD: 'metrics-dashboard',
    CASE_STUDIES: 'case-studies',
    GLASSMORPHIC_DEMO: 'glassmorphic-demo'
};
const INITIAL_VIEW = VIEW_TYPES.PORTFOLIO;
function App() {
    const { trackEvent } = useAnalytics();
    const [currentView, setCurrentView] = useState(INITIAL_VIEW);
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
        }
        else if (path.includes('/roi-calculator')) {
            setCurrentView(VIEW_TYPES.ROI_CALCULATOR);
        }
        else if (path.includes('/metrics-dashboard')) {
            setCurrentView(VIEW_TYPES.METRICS_DASHBOARD);
        }
        else if (path.includes('/case-studies')) {
            setCurrentView(VIEW_TYPES.CASE_STUDIES);
        }
        else if (path.includes('/glassmorphic-demo')) {
            setCurrentView(VIEW_TYPES.GLASSMORPHIC_DEMO);
        }
    }, []);
    const handleViewChange = (view) => {
        setCurrentView(view);
        const path = view === VIEW_TYPES.AI_DEMO ? '/ai-demo' :
            view === VIEW_TYPES.ROI_CALCULATOR ? '/roi-calculator' :
                view === VIEW_TYPES.METRICS_DASHBOARD ? '/metrics-dashboard' :
                    view === VIEW_TYPES.CASE_STUDIES ? '/case-studies' :
                        view === VIEW_TYPES.GLASSMORPHIC_DEMO ? '/glassmorphic-demo' : '/';
        window.history.pushState({}, '', path);
    };
    if (currentView === VIEW_TYPES.AI_DEMO) {
        return _jsx(AIDemo, {});
    }
    if (currentView === VIEW_TYPES.ROI_CALCULATOR) {
        return _jsx(ROICalculator, {});
    }
    if (currentView === VIEW_TYPES.METRICS_DASHBOARD) {
        return _jsx(MetricsDashboard, {});
    }
    if (currentView === VIEW_TYPES.CASE_STUDIES) {
        return _jsx(CaseStudyGenerator, {});
    }
    if (currentView === VIEW_TYPES.GLASSMORPHIC_DEMO) {
        return _jsx(GlassmorphicDemo, {});
    }
    return (_jsxs("div", { className: "app", children: [_jsxs("nav", { className: "fixed top-4 right-4 z-50 flex gap-2", children: [_jsx("button", { onClick: () => handleViewChange(VIEW_TYPES.PORTFOLIO), className: `px-3 py-2 backdrop-blur-md border rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105 ${currentView === VIEW_TYPES.PORTFOLIO
                            ? 'bg-green-600/30 border-green-500/50 text-green-400'
                            : 'bg-green-600/20 border-green-500/30 text-green-400 hover:bg-green-600/30'}`, children: "Portfolio" }), _jsx("button", { onClick: () => handleViewChange(VIEW_TYPES.AI_DEMO), className: `px-3 py-2 backdrop-blur-md border rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105 ${currentView === VIEW_TYPES.AI_DEMO
                            ? 'bg-green-600/30 border-green-500/50 text-green-400'
                            : 'bg-green-600/20 border-green-500/30 text-green-400 hover:bg-green-600/30'}`, children: "AI Demo" }), _jsx("button", { onClick: () => handleViewChange(VIEW_TYPES.ROI_CALCULATOR), className: `px-3 py-2 backdrop-blur-md border rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105 ${currentView === VIEW_TYPES.ROI_CALCULATOR
                            ? 'bg-green-600/30 border-green-500/50 text-green-400'
                            : 'bg-green-600/20 border-green-500/30 text-green-400 hover:bg-green-600/30'}`, children: "ROI Calc" }), _jsx("button", { onClick: () => handleViewChange(VIEW_TYPES.METRICS_DASHBOARD), className: `px-3 py-2 backdrop-blur-md border rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105 ${currentView === VIEW_TYPES.METRICS_DASHBOARD
                            ? 'bg-green-600/30 border-green-500/50 text-green-400'
                            : 'bg-green-600/20 border-green-500/30 text-green-400 hover:bg-green-600/30'}`, children: "Metrics" }), _jsx("button", { onClick: () => handleViewChange(VIEW_TYPES.CASE_STUDIES), className: `px-3 py-2 backdrop-blur-md border rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105 ${currentView === VIEW_TYPES.CASE_STUDIES
                            ? 'bg-green-600/30 border-green-500/50 text-green-400'
                            : 'bg-green-600/20 border-green-500/30 text-green-400 hover:bg-green-600/30'}`, children: "Cases" }), _jsx("button", { onClick: () => handleViewChange(VIEW_TYPES.GLASSMORPHIC_DEMO), className: `px-3 py-2 backdrop-blur-md border rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105 ${currentView === VIEW_TYPES.GLASSMORPHIC_DEMO
                            ? 'bg-green-600/30 border-green-500/50 text-green-400'
                            : 'bg-green-600/20 border-green-500/30 text-green-400 hover:bg-green-600/30'}`, children: "Glass" })] }), _jsx(AIHeroSection, { className: "mb-20" }), _jsx("div", { id: "github-stats-container", className: "github-stats-container mb-20", children: _jsxs("div", { className: "container mx-auto px-6", children: [_jsxs("div", { className: "text-center mb-12", children: [_jsx("h2", { className: "text-3xl md:text-4xl font-bold text-white mb-4", children: "Development Metrics" }), _jsx("p", { className: "text-lg text-gray-300", children: "Real-time insights into our technical capabilities" })] }), _jsx(GitHubStats, {})] }) }), _jsx("div", { id: "dynamic-projects-container", className: "dynamic-projects-container", children: _jsx(ProjectShowcase, {}) }), _jsx(AILeadQualificationChatbot, {})] }));
}
export default App;
//# sourceMappingURL=App.js.map