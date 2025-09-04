import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// AI Dashboard Component with Glassmorphic Design
import { useState, useEffect } from 'react';
import { Brain, Sparkles, Zap, Scale, TrendingUp, Clock, Activity, BarChart3, ArrowUpRight, ArrowDownRight, Loader2 } from 'lucide-react';
import { strayDogAI } from '../../ai';
export const AIDashboard = ({ userId, userRole = 'user', tier = 'basic', className = '' }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [systemHealth, setSystemHealth] = useState(null);
    const [domainStats, setDomainStats] = useState([]);
    const [analytics, setAnalytics] = useState(null);
    const [rateLimitStatus, setRateLimitStatus] = useState(null);
    const [selectedTimeframe, setSelectedTimeframe] = useState('week');
    useEffect(() => {
        loadDashboardData();
        const interval = setInterval(loadDashboardData, 30000); // Refresh every 30 seconds
        return () => clearInterval(interval);
    }, [selectedTimeframe]);
    const loadDashboardData = async () => {
        try {
            setIsLoading(true);
            // Initialize AI if needed
            await strayDogAI.initialize();
            // Load all dashboard data in parallel
            const [health, analyticsData, rateLimit] = await Promise.all([
                strayDogAI.healthCheck(),
                strayDogAI.getAnalytics(userId, selectedTimeframe),
                strayDogAI.getRateLimitStatus(userId, tier)
            ]);
            setSystemHealth(health);
            setAnalytics(analyticsData);
            setRateLimitStatus(rateLimit);
            // Generate mock domain stats (in real implementation, this would come from analytics)
            const mockDomainStats = [
                {
                    domain: 'corporate',
                    requests: 145,
                    successRate: 98.5,
                    avgResponseTime: 1200,
                    trend: 'up'
                },
                {
                    domain: 'technical',
                    requests: 89,
                    successRate: 96.2,
                    avgResponseTime: 1800,
                    trend: 'stable'
                },
                {
                    domain: 'business',
                    requests: 203,
                    successRate: 99.1,
                    avgResponseTime: 950,
                    trend: 'up'
                },
                {
                    domain: 'justice',
                    requests: 67,
                    successRate: 97.8,
                    avgResponseTime: 1400,
                    trend: 'down'
                }
            ];
            setDomainStats(mockDomainStats);
        }
        catch (error) {
            console.error('Failed to load dashboard data:', error);
        }
        finally {
            setIsLoading(false);
        }
    };
    const getDomainIcon = (domain) => {
        switch (domain) {
            case 'corporate':
                return _jsx(Sparkles, { className: "w-5 h-5" });
            case 'technical':
                return _jsx(Brain, { className: "w-5 h-5" });
            case 'business':
                return _jsx(Zap, { className: "w-5 h-5" });
            case 'justice':
                return _jsx(Scale, { className: "w-5 h-5" });
            default:
                return _jsx(Activity, { className: "w-5 h-5" });
        }
    };
    const getDomainColor = (domain) => {
        switch (domain) {
            case 'corporate':
                return 'from-emerald-500 to-green-600';
            case 'technical':
                return 'from-blue-500 to-cyan-600';
            case 'business':
                return 'from-purple-500 to-violet-600';
            case 'justice':
                return 'from-amber-500 to-orange-600';
            default:
                return 'from-gray-500 to-gray-600';
        }
    };
    const getTrendIcon = (trend) => {
        switch (trend) {
            case 'up':
                return _jsx(ArrowUpRight, { className: "w-4 h-4 text-green-400" });
            case 'down':
                return _jsx(ArrowDownRight, { className: "w-4 h-4 text-red-400" });
            default:
                return _jsx("div", { className: "w-4 h-4 rounded-full bg-yellow-400" });
        }
    };
    const getHealthStatusColor = (status) => {
        switch (status) {
            case 'healthy':
                return 'text-green-400';
            case 'degraded':
                return 'text-yellow-400';
            case 'unhealthy':
                return 'text-red-400';
            default:
                return 'text-gray-400';
        }
    };
    if (isLoading) {
        return (_jsx("div", { className: `flex items-center justify-center h-96 ${className}`, children: _jsxs("div", { className: "flex items-center gap-3 text-emerald-300", children: [_jsx(Loader2, { className: "w-6 h-6 animate-spin" }), _jsx("span", { children: "Loading AI Dashboard..." })] }) }));
    }
    return (_jsxs("div", { className: `space-y-6 ${className}`, children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-2xl font-bold text-white mb-2", children: "AI Ecosystem Dashboard" }), _jsx("p", { className: "text-emerald-300/70", children: "Monitor and manage your AI-powered domains" })] }), _jsx("div", { className: "flex items-center gap-2", children: ['day', 'week', 'month', 'quarter'].map((timeframe) => (_jsx("button", { onClick: () => setSelectedTimeframe(timeframe), className: `px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 ${selectedTimeframe === timeframe
                                ? 'bg-emerald-600 text-white'
                                : 'bg-white/10 text-emerald-300 hover:bg-white/20'}`, children: timeframe.charAt(0).toUpperCase() + timeframe.slice(1) }, timeframe))) })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { className: "bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6", children: [_jsxs("div", { className: "flex items-center gap-3 mb-4", children: [_jsx(Activity, { className: "w-5 h-5 text-emerald-400" }), _jsx("h3", { className: "text-lg font-semibold text-white", children: "System Health" })] }), systemHealth && (_jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-emerald-300", children: "Status" }), _jsx("span", { className: `font-semibold capitalize ${getHealthStatusColor(systemHealth.status)}`, children: systemHealth.status })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("span", { className: "text-emerald-300 text-sm", children: "Services" }), _jsx("div", { className: "grid grid-cols-2 gap-2", children: Object.entries(systemHealth.services).map(([service, isHealthy]) => (_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: `w-2 h-2 rounded-full ${isHealthy ? 'bg-green-400' : 'bg-red-400'}` }), _jsx("span", { className: "text-xs text-white/70 capitalize", children: service.replace(/([A-Z])/g, ' $1').trim() })] }, service))) })] })] }))] }), _jsxs("div", { className: "bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6", children: [_jsxs("div", { className: "flex items-center gap-3 mb-4", children: [_jsx(Clock, { className: "w-5 h-5 text-emerald-400" }), _jsx("h3", { className: "text-lg font-semibold text-white", children: "Rate Limits" })] }), rateLimitStatus && (_jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-emerald-300", children: "Tier" }), _jsx("span", { className: "font-semibold text-white capitalize", children: rateLimitStatus.tier })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-emerald-300", children: "Remaining" }), _jsx("span", { className: "font-semibold text-white", children: rateLimitStatus.remaining })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-emerald-300", children: "Reset Time" }), _jsx("span", { className: "font-semibold text-white text-sm", children: rateLimitStatus.resetTime.toLocaleTimeString() })] }), _jsx("div", { className: "mt-3", children: _jsx("div", { className: "w-full bg-white/20 rounded-full h-2", children: _jsx("div", { className: "bg-gradient-to-r from-emerald-500 to-green-600 h-2 rounded-full transition-all duration-300", style: { width: `${(rateLimitStatus.remaining / 100) * 100}%` } }) }) })] }))] })] }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6", children: domainStats.map((stat) => (_jsxs("div", { className: "bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("div", { className: `p-2 rounded-lg bg-gradient-to-br ${getDomainColor(stat.domain)}`, children: getDomainIcon(stat.domain) }), getTrendIcon(stat.trend)] }), _jsx("h3", { className: "text-lg font-semibold text-white capitalize mb-2", children: stat.domain }), _jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-emerald-300 text-sm", children: "Requests" }), _jsx("span", { className: "font-semibold text-white", children: stat.requests })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-emerald-300 text-sm", children: "Success Rate" }), _jsxs("span", { className: "font-semibold text-white", children: [stat.successRate, "%"] })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-emerald-300 text-sm", children: "Avg Response" }), _jsxs("span", { className: "font-semibold text-white", children: [stat.avgResponseTime, "ms"] })] })] })] }, stat.domain))) }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [_jsxs("div", { className: "bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6", children: [_jsxs("div", { className: "flex items-center gap-3 mb-4", children: [_jsx(TrendingUp, { className: "w-5 h-5 text-emerald-400" }), _jsx("h3", { className: "text-lg font-semibold text-white", children: "Usage Trends" })] }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-emerald-300", children: "Total Requests" }), _jsx("span", { className: "font-semibold text-white", children: domainStats.reduce((sum, stat) => sum + stat.requests, 0) })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-emerald-300", children: "Average Success Rate" }), _jsxs("span", { className: "font-semibold text-white", children: [(domainStats.reduce((sum, stat) => sum + stat.successRate, 0) / domainStats.length).toFixed(1), "%"] })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-emerald-300", children: "Most Active Domain" }), _jsx("span", { className: "font-semibold text-white capitalize", children: domainStats.reduce((max, stat) => stat.requests > max.requests ? stat : max, domainStats[0])?.domain })] })] })] }), _jsxs("div", { className: "bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6", children: [_jsxs("div", { className: "flex items-center gap-3 mb-4", children: [_jsx(BarChart3, { className: "w-5 h-5 text-emerald-400" }), _jsx("h3", { className: "text-lg font-semibold text-white", children: "Quick Actions" })] }), _jsxs("div", { className: "space-y-3", children: [_jsx("button", { className: "w-full p-3 rounded-lg bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-500 hover:to-green-600 text-white font-medium transition-all duration-200 transform hover:scale-105", children: "Export Analytics" }), _jsx("button", { className: "w-full p-3 rounded-lg bg-white/10 hover:bg-white/20 text-emerald-300 font-medium transition-all duration-200 border border-white/20", children: "View Detailed Reports" }), _jsx("button", { className: "w-full p-3 rounded-lg bg-white/10 hover:bg-white/20 text-emerald-300 font-medium transition-all duration-200 border border-white/20", children: "Manage Domains" })] })] })] })] }));
};
export default AIDashboard;
//# sourceMappingURL=AIDashboard.js.map