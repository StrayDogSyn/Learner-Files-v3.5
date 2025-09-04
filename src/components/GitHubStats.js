import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// Enhanced GitHub Stats component with AI capabilities and justice reform metrics
import { useState, useEffect } from 'react';
import { Star, GitFork, Code, Calendar, Brain, Scale, Users, TrendingUp } from 'lucide-react';
import { useGitHub } from '../hooks/useGitHub';
import { useLazyLoad } from '../hooks/useLazyLoad';
import { formatNumber } from '../types/github';
const AnimatedCounter = ({ value, duration = 2000, formatter = (v) => v.toString() }) => {
    const [displayValue, setDisplayValue] = useState(0);
    useEffect(() => {
        if (value === 0) {
            setDisplayValue(0);
            return;
        }
        const startTime = Date.now();
        const startValue = displayValue;
        const difference = value - startValue;
        const updateCounter = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Easing function for smooth animation
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const currentValue = Math.round(startValue + (difference * easeOutQuart));
            setDisplayValue(currentValue);
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            }
        };
        requestAnimationFrame(updateCounter);
    }, [value, duration]);
    return _jsx("span", { children: formatter(displayValue) });
};
const StatItem = ({ icon, label, value, formatter, color }) => {
    return (_jsxs("div", { className: "group relative", children: [_jsx("div", { className: "absolute inset-0 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 transition-all duration-300 group-hover:bg-white/15 group-hover:border-white/30" }), _jsxs("div", { className: "relative p-4 text-center", children: [_jsx("div", { className: `inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br ${color} mb-3 transition-transform duration-300 group-hover:scale-110`, children: _jsx("div", { className: "text-white", children: icon }) }), _jsx("div", { className: "text-2xl font-bold text-white mb-1", children: _jsx(AnimatedCounter, { value: value, formatter: formatter }) }), _jsx("div", { className: "text-sm text-gray-300 font-medium", children: label })] })] }));
};
const GitHubStats = ({ className = '', showLastUpdated = true }) => {
    const { stats, loading, error, lastUpdated } = useGitHub();
    const { elementRef: statsRef, isVisible } = useLazyLoad({ threshold: 0.1 });
    if (loading) {
        return (_jsx("div", { className: `${className}`, children: _jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4", children: [...Array(4)].map((_, i) => (_jsxs("div", { className: "relative", children: [_jsx("div", { className: "absolute inset-0 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 animate-pulse" }), _jsxs("div", { className: "relative p-4 text-center", children: [_jsx("div", { className: "w-12 h-12 bg-white/20 rounded-lg mx-auto mb-3 animate-pulse" }), _jsx("div", { className: "h-6 bg-white/20 rounded mb-1 animate-pulse" }), _jsx("div", { className: "h-4 bg-white/20 rounded animate-pulse" })] })] }, i))) }) }));
    }
    if (error) {
        return (_jsx("div", { className: `${className}`, children: _jsxs("div", { className: "relative", children: [_jsx("div", { className: "absolute inset-0 bg-red-500/10 backdrop-blur-md rounded-xl border border-red-500/20" }), _jsxs("div", { className: "relative p-4 text-center text-red-300", children: [_jsx(Code, { className: "w-8 h-8 mx-auto mb-2" }), _jsx("p", { className: "text-sm", children: "Unable to load GitHub stats" }), _jsx("p", { className: "text-xs opacity-75 mt-1", children: error })] })] }) }));
    }
    if (!stats) {
        return null;
    }
    // Enhanced stats with AI and justice reform focus
    const developmentStats = [
        {
            icon: _jsx(Code, { className: "w-6 h-6" }),
            label: 'Tech Projects',
            value: stats.totalRepos,
            color: 'from-blue-500 to-blue-600',
            formatter: formatNumber
        },
        {
            icon: _jsx(Star, { className: "w-6 h-6" }),
            label: 'Community Impact',
            value: stats.totalStars,
            color: 'from-yellow-500 to-yellow-600',
            formatter: formatNumber
        },
        {
            icon: _jsx(GitFork, { className: "w-6 h-6" }),
            label: 'Collaborations',
            value: stats.totalForks,
            color: 'from-green-500 to-green-600',
            formatter: formatNumber
        },
        {
            icon: _jsx(Calendar, { className: "w-6 h-6" }),
            label: 'Tech Stack',
            value: Object.keys(stats.languages).length,
            color: 'from-purple-500 to-purple-600',
            formatter: (v) => `${v}+`
        }
    ];
    // AI & Justice Reform Impact Metrics
    const impactStats = [
        {
            icon: _jsx(Brain, { className: "w-6 h-6" }),
            label: 'AI Solutions',
            value: 12,
            color: 'from-hunter-green-500 to-hunter-green-600',
            formatter: (v) => v.toString()
        },
        {
            icon: _jsx(Scale, { className: "w-6 h-6" }),
            label: 'Justice Cases',
            value: 847,
            color: 'from-emerald-500 to-emerald-600',
            formatter: formatNumber
        },
        {
            icon: _jsx(Users, { className: "w-6 h-6" }),
            label: 'Lives Impacted',
            value: 15420,
            color: 'from-teal-500 to-teal-600',
            formatter: formatNumber
        },
        {
            icon: _jsx(TrendingUp, { className: "w-6 h-6" }),
            label: 'Efficiency Gain',
            value: 340,
            color: 'from-cyan-500 to-cyan-600',
            formatter: (v) => `${v}%`
        }
    ];
    return (_jsxs("div", { ref: statsRef, className: `${className}`, children: [_jsxs("div", { className: "mb-8", children: [_jsxs("div", { className: "text-center mb-6", children: [_jsx("h3", { className: "text-2xl font-bold text-white mb-2", children: "Development Excellence" }), _jsx("p", { className: "text-gray-300 text-sm", children: "Building the future of justice reform technology" })] }), _jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4", children: isVisible && developmentStats.map((item, index) => (_jsx(StatItem, { icon: item.icon, label: item.label, value: item.value, formatter: item.formatter, color: item.color }, `dev-${index}`))) })] }), _jsxs("div", { className: "mb-6", children: [_jsxs("div", { className: "text-center mb-6", children: [_jsx("h3", { className: "text-2xl font-bold text-white mb-2", children: "Justice Reform Impact" }), _jsx("p", { className: "text-gray-300 text-sm", children: "Transforming lives through AI-powered solutions" })] }), _jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4", children: isVisible && impactStats.map((item, index) => (_jsx(StatItem, { icon: item.icon, label: item.label, value: item.value, formatter: item.formatter, color: item.color }, `impact-${index}`))) })] }), _jsxs("div", { className: "relative mb-6", children: [_jsx("div", { className: "absolute inset-0 bg-gradient-to-r from-hunter-green-500/10 to-emerald-500/10 backdrop-blur-md rounded-xl border border-hunter-green-500/20" }), _jsxs("div", { className: "relative p-6 text-center", children: [_jsxs("div", { className: "inline-flex items-center gap-3 mb-4", children: [_jsx("div", { className: "p-3 bg-gradient-to-br from-hunter-green-500 to-hunter-green-600 rounded-full", children: _jsx(Brain, { className: "w-6 h-6 text-white" }) }), _jsxs("div", { children: [_jsx("h4", { className: "text-lg font-semibold text-white", children: "AI-Powered Ecosystem" }), _jsx("p", { className: "text-sm text-gray-300", children: "Claude 4.1 Integration \u2022 Real-time Analytics \u2022 Intelligent Automation" })] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4 text-sm", children: [_jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-hunter-green-400 font-semibold", children: "Smart Case Analysis" }), _jsx("div", { className: "text-gray-400", children: "AI-driven legal insights" })] }), _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-hunter-green-400 font-semibold", children: "Predictive Modeling" }), _jsx("div", { className: "text-gray-400", children: "Outcome forecasting" })] }), _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-hunter-green-400 font-semibold", children: "Automated Workflows" }), _jsx("div", { className: "text-gray-400", children: "Streamlined processes" })] })] })] })] }), showLastUpdated && lastUpdated && (_jsx("div", { className: "text-center", children: _jsxs("div", { className: "inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 text-xs text-gray-400", children: [_jsx(Calendar, { className: "w-3 h-3" }), _jsxs("span", { children: ["Updated ", new Date(lastUpdated).toLocaleString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })] })] }) }))] }));
};
export default GitHubStats;
//# sourceMappingURL=GitHubStats.js.map