import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// AI Status Indicator Component with Glassmorphic Design
import { useState, useEffect } from 'react';
import { Activity, AlertCircle, CheckCircle, Clock, WifiOff } from 'lucide-react';
import { strayDogAI } from '../../ai';
const statusConfig = {
    online: {
        color: 'text-emerald-400',
        bgColor: 'bg-emerald-500/20',
        borderColor: 'border-emerald-500/30',
        icon: CheckCircle,
        label: 'Online'
    },
    offline: {
        color: 'text-red-400',
        bgColor: 'bg-red-500/20',
        borderColor: 'border-red-500/30',
        icon: WifiOff,
        label: 'Offline'
    },
    degraded: {
        color: 'text-yellow-400',
        bgColor: 'bg-yellow-500/20',
        borderColor: 'border-yellow-500/30',
        icon: AlertCircle,
        label: 'Degraded'
    },
    maintenance: {
        color: 'text-blue-400',
        bgColor: 'bg-blue-500/20',
        borderColor: 'border-blue-500/30',
        icon: Clock,
        label: 'Maintenance'
    }
};
export const AIStatusIndicator = ({ className = '', showDetails = true, autoRefresh = true, refreshInterval = 30000, compact = false }) => {
    const [overallStatus, setOverallStatus] = useState('online');
    const [services, setServices] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [lastUpdate, setLastUpdate] = useState(new Date());
    const checkServiceHealth = async () => {
        try {
            setIsLoading(true);
            const startTime = Date.now();
            // Check overall system health
            const healthCheck = await strayDogAI.healthCheck();
            const responseTime = Date.now() - startTime;
            // Check rate limit status
            const rateLimitStatus = await strayDogAI.getRateLimitStatus('user123', 'free');
            // Simulate checking individual services
            const serviceChecks = [
                {
                    name: 'Claude API',
                    status: healthCheck.services.aiService ? 'online' : 'offline',
                    responseTime: responseTime,
                    lastCheck: new Date(),
                    errorCount: 0
                },
                {
                    name: 'Rate Limiter',
                    status: healthCheck.services.rateLimiter ? 'online' : 'offline',
                    responseTime: responseTime * 0.8,
                    lastCheck: new Date(),
                    errorCount: 0
                },
                {
                    name: 'Analytics',
                    status: healthCheck.services.analyticsService ? 'online' : 'offline',
                    responseTime: responseTime * 0.6,
                    lastCheck: new Date(),
                    errorCount: 0
                },
                {
                    name: 'Context Manager',
                    status: healthCheck.services.contextManager ? 'online' : 'offline',
                    responseTime: responseTime * 0.4,
                    lastCheck: new Date(),
                    errorCount: 0
                }
            ];
            setServices(serviceChecks);
            // Determine overall status
            const offlineServices = serviceChecks.filter(s => s.status === 'offline');
            const degradedServices = serviceChecks.filter(s => s.status === 'degraded');
            if (offlineServices.length > 0) {
                setOverallStatus('offline');
            }
            else if (degradedServices.length > 0) {
                setOverallStatus('degraded');
            }
            else {
                setOverallStatus('online');
            }
            setLastUpdate(new Date());
        }
        catch (error) {
            console.error('Health check failed:', error);
            setOverallStatus('offline');
        }
        finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        checkServiceHealth();
        if (autoRefresh) {
            const interval = setInterval(checkServiceHealth, refreshInterval);
            return () => clearInterval(interval);
        }
    }, [autoRefresh, refreshInterval]);
    const currentStatus = statusConfig[overallStatus];
    const StatusIcon = currentStatus.icon;
    if (compact) {
        return (_jsx("div", { className: `flex items-center gap-2 ${className}`, children: _jsxs("div", { className: `flex items-center gap-2 px-3 py-1 rounded-full ${currentStatus.bgColor} border ${currentStatus.borderColor}`, children: [isLoading ? (_jsx(Activity, { className: "w-4 h-4 text-white animate-pulse" })) : (_jsx(StatusIcon, { className: `w-4 h-4 ${currentStatus.color}` })), _jsx("span", { className: `text-sm font-medium ${currentStatus.color}`, children: currentStatus.label })] }) }));
    }
    return (_jsxs("div", { className: `bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 ${className}`, children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: `p-2 rounded-lg ${currentStatus.bgColor} border ${currentStatus.borderColor}`, children: isLoading ? (_jsx(Activity, { className: "w-5 h-5 text-white animate-pulse" })) : (_jsx(StatusIcon, { className: `w-5 h-5 ${currentStatus.color}` })) }), _jsxs("div", { children: [_jsx("h3", { className: "font-semibold text-white", children: "AI System Status" }), _jsxs("p", { className: `text-sm ${currentStatus.color}`, children: [currentStatus.label, " \u2022 Last updated ", lastUpdate.toLocaleTimeString()] })] })] }), _jsx("button", { onClick: checkServiceHealth, disabled: isLoading, className: "p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors duration-200 disabled:opacity-50", children: _jsx(Activity, { className: `w-4 h-4 text-white ${isLoading ? 'animate-spin' : ''}` }) })] }), showDetails && (_jsx("div", { className: "space-y-3", children: services.map((service, index) => {
                    const serviceStatus = statusConfig[service.status];
                    const ServiceIcon = serviceStatus.icon;
                    return (_jsxs("div", { className: "flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx(ServiceIcon, { className: `w-4 h-4 ${serviceStatus.color}` }), _jsxs("div", { children: [_jsx("div", { className: "text-white font-medium", children: service.name }), _jsxs("div", { className: "text-xs text-emerald-300/70", children: [service.responseTime, "ms \u2022 ", service.lastCheck.toLocaleTimeString()] })] })] }), _jsxs("div", { className: "flex items-center gap-2", children: [service.errorCount > 0 && (_jsxs("span", { className: "text-xs text-red-400 bg-red-500/20 px-2 py-1 rounded", children: [service.errorCount, " errors"] })), _jsx("div", { className: `px-2 py-1 rounded text-xs font-medium ${serviceStatus.bgColor} ${serviceStatus.color}`, children: serviceStatus.label })] })] }, index));
                }) })), showDetails && (_jsx("div", { className: "mt-4 pt-4 border-t border-white/10", children: _jsxs("div", { className: "grid grid-cols-3 gap-4 text-center", children: [_jsxs("div", { children: [_jsxs("div", { className: "text-2xl font-bold text-emerald-400", children: [services.length > 0 ? Math.round(services.reduce((acc, s) => acc + s.responseTime, 0) / services.length) : 0, "ms"] }), _jsx("div", { className: "text-xs text-emerald-300/70", children: "Avg Response" })] }), _jsxs("div", { children: [_jsxs("div", { className: "text-2xl font-bold text-emerald-400", children: [services.filter(s => s.status === 'online').length, "/", services.length] }), _jsx("div", { className: "text-xs text-emerald-300/70", children: "Services Online" })] }), _jsxs("div", { children: [_jsx("div", { className: "text-2xl font-bold text-emerald-400", children: "99.9%" }), _jsx("div", { className: "text-xs text-emerald-300/70", children: "Uptime" })] })] }) }))] }));
};
export default AIStatusIndicator;
//# sourceMappingURL=AIStatusIndicator.js.map