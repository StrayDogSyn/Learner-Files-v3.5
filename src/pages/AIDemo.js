import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { strayDogAI } from '../ai';
import { AIChat, AIDashboard, AIDomainSelector, AIStatusIndicator, AIMetricsDisplay, AIPromptBuilder } from '../components/ai';
const AIDemo = () => {
    const [selectedDomain, setSelectedDomain] = useState('corporate');
    const [systemHealth, setSystemHealth] = useState(null);
    const [isInitialized, setIsInitialized] = useState(false);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        initializeAI();
    }, []);
    const initializeAI = async () => {
        try {
            setLoading(true);
            await strayDogAI.initialize();
            const health = await strayDogAI.healthCheck();
            setSystemHealth(health);
            setIsInitialized(true);
        }
        catch (error) {
            console.error('Failed to initialize AI system:', error);
        }
        finally {
            setLoading(false);
        }
    };
    const handleDomainChange = (domain) => {
        setSelectedDomain(domain);
    };
    const handleGenerateContent = async (prompt, contentType) => {
        try {
            const response = await strayDogAI.generateContent(selectedDomain, contentType, prompt, 'demo-user', 'user', 'free');
            if (response.success) {
                console.log('Generated content:', response.data);
                return response.data;
            }
            else {
                console.error('Content generation failed:', response.error);
                return null;
            }
        }
        catch (error) {
            console.error('Error generating content:', error);
            return null;
        }
    };
    if (loading) {
        return (_jsx("div", { className: "min-h-screen bg-gradient-to-br from-slate-900 via-green-900 to-slate-900 flex items-center justify-center", children: _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "animate-spin rounded-full h-32 w-32 border-b-2 border-green-400 mx-auto mb-4" }), _jsx("h2", { className: "text-2xl font-bold text-green-400 mb-2", children: "Initializing StrayDog AI" }), _jsx("p", { className: "text-green-300", children: "Setting up the AI ecosystem..." })] }) }));
    }
    return (_jsx("div", { className: "min-h-screen bg-gradient-to-br from-slate-900 via-green-900 to-slate-900 p-6", children: _jsxs("div", { className: "max-w-7xl mx-auto", children: [_jsxs("div", { className: "text-center mb-8", children: [_jsx("h1", { className: "text-4xl font-bold text-green-400 mb-2", children: "StrayDog AI Ecosystem Demo" }), _jsx("p", { className: "text-green-300 text-lg", children: "Multi-Domain AI Coordination System" })] }), _jsx("div", { className: "mb-8", children: _jsx(AIStatusIndicator, { showDetails: true, autoRefresh: true, refreshInterval: 30000 }) }), _jsxs("div", { className: "mb-8", children: [_jsx("h2", { className: "text-2xl font-bold text-green-400 mb-4", children: "Select AI Domain" }), _jsx(AIDomainSelector, { selectedDomain: selectedDomain, onDomainChange: handleDomainChange, variant: "grid" })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8", children: [_jsxs("div", { className: "space-y-6", children: [_jsx("h2", { className: "text-2xl font-bold text-green-400", children: "AI Chat Interface" }), _jsx(AIChat, { domain: selectedDomain, userId: "demo-user", userRole: "user", tier: "free" })] }), _jsxs("div", { className: "space-y-6", children: [_jsx("h2", { className: "text-2xl font-bold text-green-400", children: "Prompt Builder" }), _jsx(AIPromptBuilder, { domain: selectedDomain, onPromptGenerated: (prompt) => {
                                        console.log('Generated prompt:', prompt);
                                    } })] })] }), _jsxs("div", { className: "mb-8", children: [_jsx("h2", { className: "text-2xl font-bold text-green-400 mb-4", children: "Analytics Dashboard" }), _jsx(AIDashboard, { userId: "demo-user" })] }), _jsxs("div", { className: "mb-8", children: [_jsx("h2", { className: "text-2xl font-bold text-green-400 mb-4", children: "Usage Metrics" }), _jsx(AIMetricsDisplay, { timeRange: "7d", autoRefresh: true })] }), systemHealth && (_jsxs("div", { className: "bg-black/20 backdrop-blur-md rounded-xl border border-green-500/30 p-6", children: [_jsx("h2", { className: "text-2xl font-bold text-green-400 mb-4", children: "System Health" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [_jsxs("div", { className: "text-center", children: [_jsx("div", { className: `text-3xl font-bold mb-2 ${systemHealth.status === 'healthy' ? 'text-green-400' :
                                                systemHealth.status === 'degraded' ? 'text-yellow-400' :
                                                    'text-red-400'}`, children: systemHealth.status.toUpperCase() }), _jsx("p", { className: "text-green-300", children: "Overall Status" })] }), _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-3xl font-bold text-green-400 mb-2", children: Object.values(systemHealth.services).filter(Boolean).length }), _jsx("p", { className: "text-green-300", children: "Services Online" })] }), _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-3xl font-bold text-green-400 mb-2", children: Object.keys(systemHealth.services).length }), _jsx("p", { className: "text-green-300", children: "Total Services" })] })] }), _jsxs("div", { className: "mt-6", children: [_jsx("h3", { className: "text-lg font-semibold text-green-400 mb-3", children: "Service Status" }), _jsx("div", { className: "grid grid-cols-2 md:grid-cols-3 gap-2", children: Object.entries(systemHealth.services).map(([service, status]) => (_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("div", { className: `w-3 h-3 rounded-full ${status ? 'bg-green-400' : 'bg-red-400'}` }), _jsx("span", { className: "text-green-300 text-sm", children: service })] }, service))) })] })] }))] }) }));
};
export default AIDemo;
//# sourceMappingURL=AIDemo.js.map