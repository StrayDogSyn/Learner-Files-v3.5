import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import ReactDOM from 'react-dom/client';
import GitHubStats from './components/GitHubStats';
import ProjectShowcase from './components/ProjectShowcase';
import './App.css';
// Initialize React app and mount components to existing DOM elements
function initializeReactComponents() {
    // Mount GitHub Stats component to hero section
    const githubStatsContainer = document.getElementById('github-stats-mount');
    if (githubStatsContainer) {
        githubStatsContainer.style.display = 'block';
        const statsRoot = ReactDOM.createRoot(githubStatsContainer);
        statsRoot.render(_jsx(React.StrictMode, { children: _jsx(GitHubStats, { className: "mt-8" }) }));
    }
    // Mount Dynamic Projects to replace static project cards
    const projectsContainer = document.getElementById('dynamic-projects-mount');
    if (projectsContainer) {
        projectsContainer.style.display = 'block';
        const projectsRoot = ReactDOM.createRoot(projectsContainer);
        projectsRoot.render(_jsx(React.StrictMode, { children: _jsx(ProjectShowcase, { className: "bg-transparent" }) }));
    }
    // If no specific mount points exist, create them
    if (!githubStatsContainer && !projectsContainer) {
        // Create mount point for GitHub stats in hero section
        const heroSection = document.querySelector('.hero-content');
        if (heroSection) {
            const statsMount = document.createElement('div');
            statsMount.id = 'github-stats-mount';
            statsMount.className = 'github-stats-integration';
            // Insert after hero achievements
            const achievements = heroSection.querySelector('.hero-achievements');
            if (achievements) {
                achievements.insertAdjacentElement('afterend', statsMount);
                const statsRoot = ReactDOM.createRoot(statsMount);
                statsRoot.render(_jsx(React.StrictMode, { children: _jsx(GitHubStats, { className: "mt-8" }) }));
            }
        }
        // Create mount point for dynamic projects
        const projectsSection = document.querySelector('#projects .projects-grid');
        if (projectsSection) {
            const projectsMount = document.createElement('div');
            projectsMount.id = 'dynamic-projects-mount';
            projectsMount.className = 'dynamic-projects-integration';
            // Replace the existing projects grid
            projectsSection.parentNode?.replaceChild(projectsMount, projectsSection);
            const projectsRoot = ReactDOM.createRoot(projectsMount);
            projectsRoot.render(_jsx(React.StrictMode, { children: _jsx(ProjectShowcase, { className: "bg-transparent" }) }));
        }
    }
}
// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeReactComponents);
}
else {
    initializeReactComponents();
}
// Export for potential manual initialization
export { initializeReactComponents };
//# sourceMappingURL=main.js.map