import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// Project Showcase component with dynamic GitHub integration
import { useState, useMemo } from 'react';
import { Search, Filter, RefreshCw, AlertCircle } from 'lucide-react';
import { useGitHub } from '../hooks/useGitHub';
import { useAnalytics } from '../hooks/useAnalytics';
import { useLazyLoad } from '../hooks/useLazyLoad';
import DynamicProjectCard from './DynamicProjectCard';
const ProjectShowcase = ({ className = '', maxProjects = 6, showSearch = true, showFilters = true, title = 'Featured Projects', subtitle = 'Explore my latest work and contributions' }) => {
    const { trackEvent } = useAnalytics();
    const { projectCards, loading, error, refreshData } = useGitHub();
    const { elementRef: sectionRef, isVisible } = useLazyLoad({ threshold: 0.1 });
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [isRefreshing, setIsRefreshing] = useState(false);
    // Get unique categories from projects
    const categories = useMemo(() => {
        const cats = new Set(projectCards.map(project => project.category));
        return ['all', ...Array.from(cats)];
    }, [projectCards]);
    // Filter and search projects
    const filteredProjects = useMemo(() => {
        let filtered = projectCards;
        // Filter by category
        if (selectedCategory !== 'all') {
            filtered = filtered.filter(project => project.category === selectedCategory);
        }
        // Filter by search query
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(project => project.title.toLowerCase().includes(query) ||
                project.description.toLowerCase().includes(query) ||
                project.technologies.some(tech => tech.toLowerCase().includes(query)) ||
                project.language.toLowerCase().includes(query));
        }
        // Limit results
        return filtered.slice(0, maxProjects);
    }, [projectCards, selectedCategory, searchQuery, maxProjects]);
    const handleRefresh = async () => {
        setIsRefreshing(true);
        try {
            await refreshData();
        }
        finally {
            setIsRefreshing(false);
        }
    };
    if (loading && projectCards.length === 0) {
        return (_jsx("section", { className: `py-20 ${className}`, children: _jsxs("div", { className: "container mx-auto px-6", children: [_jsxs("div", { className: "text-center mb-16", children: [_jsx("h2", { className: "text-4xl md:text-5xl font-bold text-white mb-4", children: title }), _jsx("p", { className: "text-xl text-gray-300 max-w-2xl mx-auto", children: subtitle })] }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8", children: [...Array(6)].map((_, i) => (_jsxs("div", { className: "relative", children: [_jsx("div", { className: "absolute inset-0 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 animate-pulse" }), _jsxs("div", { className: "relative p-6 h-80", children: [_jsx("div", { className: "h-6 bg-white/20 rounded mb-4 animate-pulse" }), _jsx("div", { className: "h-4 bg-white/20 rounded mb-2 animate-pulse" }), _jsx("div", { className: "h-4 bg-white/20 rounded mb-4 w-3/4 animate-pulse" }), _jsxs("div", { className: "flex gap-2 mb-4", children: [_jsx("div", { className: "h-6 w-16 bg-white/20 rounded animate-pulse" }), _jsx("div", { className: "h-6 w-20 bg-white/20 rounded animate-pulse" })] }), _jsx("div", { className: "mt-auto pt-4", children: _jsx("div", { className: "h-10 bg-white/20 rounded animate-pulse" }) })] })] }, i))) })] }) }));
    }
    return (_jsx("section", { ref: sectionRef, className: `py-20 ${className}`, children: _jsxs("div", { className: "container mx-auto px-6", children: [_jsxs("div", { className: "text-center mb-16", children: [_jsx("h2", { className: "text-4xl md:text-5xl font-bold text-white mb-4", children: title }), _jsx("p", { className: "text-xl text-gray-300 max-w-2xl mx-auto mb-8", children: subtitle }), (showSearch || showFilters) && (_jsxs("div", { className: "flex flex-col md:flex-row gap-4 items-center justify-center max-w-4xl mx-auto", children: [showSearch && (_jsxs("div", { className: "relative flex-1 max-w-md", children: [_jsx(Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" }), _jsx("input", { type: "text", placeholder: "Search projects...", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), className: "w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-hunter-green-400 focus:ring-2 focus:ring-hunter-green-400/20 transition-all duration-300" })] })), showFilters && (_jsxs("div", { className: "relative", children: [_jsx(Filter, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" }), _jsx("select", { value: selectedCategory, onChange: (e) => setSelectedCategory(e.target.value), className: "pl-10 pr-8 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white focus:outline-none focus:border-hunter-green-400 focus:ring-2 focus:ring-hunter-green-400/20 transition-all duration-300 appearance-none cursor-pointer", children: categories.map(category => (_jsx("option", { value: category, className: "bg-gray-800 text-white", children: category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1) }, category))) })] })), _jsxs("button", { onClick: handleRefresh, disabled: isRefreshing, className: "flex items-center gap-2 px-4 py-3 bg-hunter-green-600 hover:bg-hunter-green-700 disabled:bg-hunter-green-800 text-white rounded-xl transition-all duration-300 hover:scale-105 disabled:scale-100 disabled:opacity-50", children: [_jsx(RefreshCw, { className: `w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}` }), _jsx("span", { className: "font-medium", children: "Refresh" })] })] }))] }), error && (_jsx("div", { className: "mb-8", children: _jsxs("div", { className: "relative max-w-md mx-auto", children: [_jsx("div", { className: "absolute inset-0 bg-red-500/10 backdrop-blur-md rounded-xl border border-red-500/20" }), _jsxs("div", { className: "relative p-4 text-center", children: [_jsx(AlertCircle, { className: "w-8 h-8 text-red-400 mx-auto mb-2" }), _jsx("p", { className: "text-red-300 text-sm font-medium", children: "Failed to load projects" }), _jsx("p", { className: "text-red-400/70 text-xs mt-1", children: error })] })] }) })), filteredProjects.length > 0 ? (_jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8", children: isVisible && filteredProjects.map((project) => (_jsx(DynamicProjectCard, { project: project, className: "h-full", showStats: true, showCategory: true }, project.id))) })) : (!loading && (_jsx("div", { className: "text-center py-16", children: _jsxs("div", { className: "relative max-w-md mx-auto", children: [_jsx("div", { className: "absolute inset-0 bg-white/5 backdrop-blur-md rounded-xl border border-white/10" }), _jsxs("div", { className: "relative p-8", children: [_jsx(Search, { className: "w-12 h-12 text-gray-400 mx-auto mb-4" }), _jsx("h3", { className: "text-xl font-semibold text-white mb-2", children: "No projects found" }), _jsx("p", { className: "text-gray-400 text-sm", children: searchQuery || selectedCategory !== 'all'
                                            ? 'Try adjusting your search or filter criteria'
                                            : 'Projects will appear here once loaded from GitHub' })] })] }) }))), filteredProjects.length > 0 && (_jsx("div", { className: "text-center mt-12", children: _jsxs("p", { className: "text-gray-400 text-sm", children: ["Showing ", filteredProjects.length, " of ", projectCards.length, " projects", searchQuery && ` matching "${searchQuery}"`, selectedCategory !== 'all' && ` in ${selectedCategory}`] }) }))] }) }));
};
export default ProjectShowcase;
//# sourceMappingURL=ProjectShowcase.js.map