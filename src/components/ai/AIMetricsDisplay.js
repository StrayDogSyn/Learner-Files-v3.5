import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// AI Metrics Display Component with Glassmorphic Design
import { useState, useEffect } from 'react';
import { BarChart3, Users, Zap, Clock, Target, RefreshCw } from 'lucide-react';
import { strayDogAI } from '../../ai';
const timeRangeLabels = {
    '1h': 'Last Hour',
    '24h': 'Last 24 Hours',
    '7d': 'Last 7 Days',
    '30d': 'Last 30 Days'
};
const domainColors = {
    corporate: 'from-emerald-500 to-green-600',
    technical: 'from-blue-500 to-cyan-600',
    business: 'from-purple-500 to-violet-600',
    justice: 'from-amber-500 to-orange-600'
};
export const AIMetricsDisplay = ({ className = '', timeRange = '24h', showDomainBreakdown = true, autoRefresh = true, refreshInterval = 60000 }) => {
    const [metrics, setMetrics] = useState([]);
    const [domainMetrics, setDomainMetrics] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [lastUpdate, setLastUpdate] = useState(new Date());
    const [selectedTimeRange, setSelectedTimeRange] = useState(timeRange);
    const fetchMetrics = async () => {
        try {
            setIsLoading(true);
            // Fetch analytics data from the AI system
            const analytics = await strayDogAI.getAnalytics();
            // Calculate metrics based on timeRange (using mock data for now)
            const totalRequests = Math.floor(Math.random() * 10000) + 5000;
            const avgResponseTime = Math.floor(Math.random() * 200) + 150;
            const successRate = 0.95 + Math.random() * 0.05;
            const activeUsers = Math.floor(Math.random() * 500) + 100;
            const metricsData = [
                {
                    title: 'Total Requests',
                    value: totalRequests.toLocaleString(),
                    change: 12.5,
                    changeType: 'increase',
                    icon: _jsx(Zap, { className: "w-5 h-5" }),
                    color: 'from-emerald-500 to-green-600',
                    description: `AI requests in ${timeRangeLabels[selectedTimeRange].toLowerCase()}`
                },
                {
                    title: 'Avg Response Time',
                    value: `${avgResponseTime}ms`,
                    change: -8.2,
                    changeType: 'decrease',
                    icon: _jsx(Clock, { className: "w-5 h-5" }),
                    color: 'from-blue-500 to-cyan-600',
                    description: 'Average API response time'
                },
                {
                    title: 'Success Rate',
                    value: `${(successRate * 100).toFixed(1)}%`,
                    change: 2.1,
                    changeType: 'increase',
                    icon: _jsx(Target, { className: "w-5 h-5" }),
                    color: 'from-purple-500 to-violet-600',
                    description: 'Successful AI responses'
                },
                {
                    title: 'Active Users',
                    value: activeUsers.toLocaleString(),
                    change: 15.7,
                    changeType: 'increase',
                    icon: _jsx(Users, { className: "w-5 h-5" }),
                    color: 'from-amber-500 to-orange-600',
                    description: 'Users with active sessions'
                }
            ];
            setMetrics(metricsData);
            // Fetch domain-specific metrics
            if (showDomainBreakdown) {
                const domains = ['corporate', 'technical', 'business', 'justice'];
                const domainData = [];
                const analytics = await strayDogAI.getAnalytics('user123', 'week');
                for (const domain of domains) {
                    domainData.push({
                        domain,
                        requests: Math.floor(Math.random() * 1000),
                        avgResponseTime: Math.floor(Math.random() * 500) + 200,
                        successRate: 0.95 + Math.random() * 0.05,
                        topFeatures: ['Feature 1', 'Feature 2', 'Feature 3']
                    });
                }
                setDomainMetrics(domainData);
            }
            setLastUpdate(new Date());
        }
        catch (error) {
            console.error('Failed to fetch metrics:', error);
        }
        finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        fetchMetrics();
        if (autoRefresh) {
            const interval = setInterval(fetchMetrics, refreshInterval);
            return () => clearInterval(interval);
        }
    }, [selectedTimeRange, autoRefresh, refreshInterval]);
    const getChangeColor = (changeType) => {
        switch (changeType) {
            case 'increase': return 'text-emerald-400';
            case 'decrease': return 'text-red-400';
            default: return 'text-gray-400';
        }
    };
    const getChangeIcon = (changeType) => {
        if (changeType === 'increase')
            return '↗';
        if (changeType === 'decrease')
            return '↘';
        return '→';
    };
    return (_jsxs("div", { className: `space-y-6 ${className}`, children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-2xl font-bold text-white mb-2", children: "AI Performance Metrics" }), _jsxs("p", { className: "text-emerald-300/70", children: ["Last updated: ", lastUpdate.toLocaleTimeString()] })] }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("select", { value: selectedTimeRange, onChange: (e) => setSelectedTimeRange(e.target.value), className: "bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500", children: Object.entries(timeRangeLabels).map(([value, label]) => (_jsx("option", { value: value, className: "bg-gray-800", children: label }, value))) }), _jsx("button", { onClick: fetchMetrics, disabled: isLoading, className: "p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors duration-200 disabled:opacity-50", children: _jsx(RefreshCw, { className: `w-4 h-4 text-white ${isLoading ? 'animate-spin' : ''}` }) })] })] }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6", children: metrics.map((metric, index) => (_jsxs("div", { className: "bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("div", { className: `p-3 rounded-lg bg-gradient-to-br ${metric.color}`, children: metric.icon }), _jsxs("div", { className: `flex items-center gap-1 text-sm ${getChangeColor(metric.changeType)}`, children: [_jsx("span", { children: getChangeIcon(metric.changeType) }), _jsxs("span", { children: [Math.abs(metric.change), "%"] })] })] }), _jsxs("div", { className: "mb-2", children: [_jsx("div", { className: "text-2xl font-bold text-white mb-1", children: metric.value }), _jsx("div", { className: "text-sm font-medium text-emerald-300", children: metric.title })] }), metric.description && (_jsx("div", { className: "text-xs text-emerald-300/70", children: metric.description }))] }, index))) }), showDomainBreakdown && domainMetrics.length > 0 && (_jsxs("div", { className: "bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6", children: [_jsxs("div", { className: "flex items-center gap-3 mb-6", children: [_jsx(BarChart3, { className: "w-6 h-6 text-emerald-400" }), _jsx("h3", { className: "text-xl font-semibold text-white", children: "Domain Performance" })] }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4", children: domainMetrics.map((domain, index) => (_jsxs("div", { className: "bg-white/5 rounded-lg p-4 border border-white/10", children: [_jsxs("div", { className: "flex items-center gap-3 mb-3", children: [_jsx("div", { className: `w-3 h-3 rounded-full bg-gradient-to-br ${domainColors[domain.domain]}` }), _jsx("h4", { className: "font-semibold text-white capitalize", children: domain.domain })] }), _jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-sm text-emerald-300/70", children: "Requests" }), _jsx("span", { className: "text-sm font-medium text-white", children: domain.requests.toLocaleString() })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-sm text-emerald-300/70", children: "Avg Time" }), _jsxs("span", { className: "text-sm font-medium text-white", children: [domain.avgResponseTime, "ms"] })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-sm text-emerald-300/70", children: "Success Rate" }), _jsxs("span", { className: "text-sm font-medium text-white", children: [(domain.successRate * 100).toFixed(1), "%"] })] })] }), _jsx("div", { className: "mt-3", children: _jsx("div", { className: "w-full bg-white/10 rounded-full h-2", children: _jsx("div", { className: `h-2 rounded-full bg-gradient-to-r ${domainColors[domain.domain]}`, style: { width: `${domain.successRate * 100}%` } }) }) })] }, index))) })] }))] }));
};
export default AIMetricsDisplay;
//# sourceMappingURL=AIMetricsDisplay.js.map