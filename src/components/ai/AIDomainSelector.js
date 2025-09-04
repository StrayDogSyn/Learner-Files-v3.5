import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
// AI Domain Selector Component with Glassmorphic Design
import React, { useState } from 'react';
import { Brain, Sparkles, Zap, Scale, ChevronDown, Check } from 'lucide-react';
const domainInfo = {
    corporate: {
        domain: 'corporate',
        title: 'Corporate AI',
        description: 'Executive content, leadership profiles, and strategic communications',
        icon: _jsx(Sparkles, { className: "w-5 h-5" }),
        color: 'from-emerald-500 to-green-600',
        features: ['Press Releases', 'Executive Summaries', 'Leadership Profiles', 'Strategic Plans']
    },
    technical: {
        domain: 'technical',
        title: 'Technical AI',
        description: 'Code generation, technical documentation, and architecture design',
        icon: _jsx(Brain, { className: "w-5 h-5" }),
        color: 'from-blue-500 to-cyan-600',
        features: ['Code Generation', 'API Documentation', 'Technical Specs', 'Architecture Design']
    },
    business: {
        domain: 'business',
        title: 'Business AI',
        description: 'Lead qualification, ROI analysis, and business strategy development',
        icon: _jsx(Zap, { className: "w-5 h-5" }),
        color: 'from-purple-500 to-violet-600',
        features: ['Lead Qualification', 'ROI Analysis', 'Market Research', 'Business Plans']
    },
    justice: {
        domain: 'justice',
        title: 'Justice AI',
        description: 'Impact metrics, policy analysis, and criminal justice reform strategies',
        icon: _jsx(Scale, { className: "w-5 h-5" }),
        color: 'from-amber-500 to-orange-600',
        features: ['Impact Metrics', 'Policy Analysis', 'Legal Research', 'Reform Strategies']
    }
};
export const AIDomainSelector = ({ selectedDomain, onDomainChange, className = '', variant = 'dropdown', showDescriptions = true }) => {
    const [isOpen, setIsOpen] = useState(false);
    const selectedInfo = domainInfo[selectedDomain];
    const handleDomainSelect = (domain) => {
        onDomainChange(domain);
        setIsOpen(false);
    };
    if (variant === 'dropdown') {
        return (_jsxs("div", { className: `relative ${className}`, children: [_jsxs("button", { onClick: () => setIsOpen(!isOpen), className: "w-full flex items-center justify-between p-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white hover:bg-white/20 transition-all duration-200", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: `p-2 rounded-lg bg-gradient-to-br ${selectedInfo.color}`, children: selectedInfo.icon }), _jsxs("div", { className: "text-left", children: [_jsx("div", { className: "font-semibold", children: selectedInfo.title }), showDescriptions && (_jsx("div", { className: "text-sm text-emerald-300/70", children: selectedInfo.description }))] })] }), _jsx(ChevronDown, { className: `w-5 h-5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}` })] }), isOpen && (_jsx("div", { className: "absolute top-full left-0 right-0 mt-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl overflow-hidden z-50", children: Object.values(domainInfo).map((info) => (_jsxs("button", { onClick: () => handleDomainSelect(info.domain), className: "w-full flex items-center gap-3 p-4 text-white hover:bg-white/20 transition-all duration-200 border-b border-white/10 last:border-b-0", children: [_jsx("div", { className: `p-2 rounded-lg bg-gradient-to-br ${info.color}`, children: info.icon }), _jsxs("div", { className: "flex-1 text-left", children: [_jsx("div", { className: "font-semibold", children: info.title }), showDescriptions && (_jsx("div", { className: "text-sm text-emerald-300/70", children: info.description }))] }), selectedDomain === info.domain && (_jsx(Check, { className: "w-5 h-5 text-emerald-400" }))] }, info.domain))) }))] }));
    }
    if (variant === 'grid') {
        return (_jsx("div", { className: `grid grid-cols-1 md:grid-cols-2 gap-4 ${className}`, children: Object.values(domainInfo).map((info) => (_jsxs("button", { onClick: () => handleDomainSelect(info.domain), className: `p-6 rounded-xl border-2 transition-all duration-200 text-left ${selectedDomain === info.domain
                    ? 'border-emerald-500 bg-emerald-500/20'
                    : 'border-white/20 bg-white/10 hover:bg-white/20'}`, children: [_jsxs("div", { className: "flex items-center gap-3 mb-3", children: [_jsx("div", { className: `p-3 rounded-lg bg-gradient-to-br ${info.color}`, children: info.icon }), _jsxs("div", { children: [_jsx("h3", { className: "font-semibold text-white", children: info.title }), selectedDomain === info.domain && (_jsx(Check, { className: "w-4 h-4 text-emerald-400 mt-1" }))] })] }), showDescriptions && (_jsxs(_Fragment, { children: [_jsx("p", { className: "text-emerald-300/70 text-sm mb-3", children: info.description }), _jsx("div", { className: "space-y-1", children: info.features.map((feature, index) => (_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "w-1 h-1 bg-emerald-400 rounded-full" }), _jsx("span", { className: "text-xs text-white/70", children: feature })] }, index))) })] }))] }, info.domain))) }));
    }
    if (variant === 'tabs') {
        return (_jsxs("div", { className: `${className}`, children: [_jsx("div", { className: "flex flex-wrap gap-2", children: Object.values(domainInfo).map((info) => (_jsxs("button", { onClick: () => handleDomainSelect(info.domain), className: `flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${selectedDomain === info.domain
                            ? 'bg-gradient-to-r from-emerald-600 to-green-700 text-white'
                            : 'bg-white/10 text-emerald-300 hover:bg-white/20'}`, children: [_jsx("div", { className: `p-1 rounded ${selectedDomain === info.domain ? 'bg-white/20' : ''}`, children: React.cloneElement(info.icon, {
                                    className: 'w-4 h-4'
                                }) }), _jsx("span", { children: info.title }), selectedDomain === info.domain && (_jsx(Check, { className: "w-4 h-4" }))] }, info.domain))) }), showDescriptions && (_jsxs("div", { className: "mt-4 p-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl", children: [_jsxs("div", { className: "flex items-center gap-3 mb-2", children: [_jsx("div", { className: `p-2 rounded-lg bg-gradient-to-br ${selectedInfo.color}`, children: selectedInfo.icon }), _jsx("h3", { className: "font-semibold text-white", children: selectedInfo.title })] }), _jsx("p", { className: "text-emerald-300/70 text-sm mb-3", children: selectedInfo.description }), _jsx("div", { className: "grid grid-cols-2 gap-2", children: selectedInfo.features.map((feature, index) => (_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "w-1 h-1 bg-emerald-400 rounded-full" }), _jsx("span", { className: "text-xs text-white/70", children: feature })] }, index))) })] }))] }));
    }
    return null;
};
export default AIDomainSelector;
//# sourceMappingURL=AIDomainSelector.js.map