import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
// AI Prompt Builder Component with Glassmorphic Design
import { useState, useEffect } from 'react';
import { Wand2, Copy, RotateCcw, Plus, X, Lightbulb } from 'lucide-react';
const promptTemplates = [
    {
        id: 'corporate-press-release',
        name: 'Press Release',
        description: 'Generate professional press releases for corporate announcements',
        template: 'Create a professional press release for {company} announcing {announcement}. The tone should be {tone} and target {audience}. Include key details: {details}.',
        variables: ['company', 'announcement', 'tone', 'audience', 'details'],
        domain: 'corporate',
        contentType: 'case-study'
    },
    {
        id: 'technical-documentation',
        name: 'API Documentation',
        description: 'Generate comprehensive API documentation',
        template: 'Create detailed API documentation for {api_name}. Include {endpoints} endpoints with {methods} methods. Target audience: {audience}. Include examples for {examples}.',
        variables: ['api_name', 'endpoints', 'methods', 'audience', 'examples'],
        domain: 'technical',
        contentType: 'code'
    },
    {
        id: 'business-analysis',
        name: 'Market Analysis',
        description: 'Generate comprehensive market analysis reports',
        template: 'Conduct a market analysis for {industry} focusing on {market_segment}. Analyze {competitors} competitors and identify {opportunities} opportunities. Time frame: {timeframe}.',
        variables: ['industry', 'market_segment', 'competitors', 'opportunities', 'timeframe'],
        domain: 'business',
        contentType: 'analysis'
    },
    {
        id: 'justice-policy',
        name: 'Policy Analysis',
        description: 'Analyze policy implications and social impact',
        template: 'Analyze the policy implications of {policy} on {affected_groups}. Consider {factors} factors and evaluate {metrics} impact metrics. Provide recommendations for {improvements}.',
        variables: ['policy', 'affected_groups', 'factors', 'metrics', 'improvements'],
        domain: 'justice',
        contentType: 'analysis'
    }
];
const domainPromptTips = {
    corporate: [
        'Use professional, authoritative tone',
        'Include specific metrics and achievements',
        'Focus on stakeholder value and impact',
        'Maintain brand consistency'
    ],
    technical: [
        'Be precise and detailed in specifications',
        'Include code examples and use cases',
        'Consider different skill levels of readers',
        'Provide clear step-by-step instructions'
    ],
    business: [
        'Include quantifiable business metrics',
        'Focus on ROI and value propositions',
        'Consider market trends and competition',
        'Provide actionable insights'
    ],
    justice: [
        'Consider social impact and equity',
        'Include diverse perspectives',
        'Focus on measurable outcomes',
        'Address systemic issues'
    ]
};
export const AIPromptBuilder = ({ className = '', domain, onPromptGenerated, initialTemplate = '', showTemplates = true }) => {
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [customPrompt, setCustomPrompt] = useState(initialTemplate);
    const [variables, setVariables] = useState([]);
    const [generatedPrompt, setGeneratedPrompt] = useState('');
    const [showTips, setShowTips] = useState(false);
    const [isBuilding, setIsBuilding] = useState(false);
    const domainTemplates = promptTemplates.filter(t => t.domain === domain);
    const tips = domainPromptTips[domain] || [];
    useEffect(() => {
        if (selectedTemplate) {
            const templateVars = selectedTemplate.variables.map(varName => ({
                name: varName,
                value: '',
                placeholder: `Enter ${varName.replace('_', ' ')}...`,
                required: true
            }));
            setVariables(templateVars);
            setCustomPrompt(selectedTemplate.template);
        }
    }, [selectedTemplate]);
    const handleVariableChange = (index, value) => {
        const updatedVariables = [...variables];
        updatedVariables[index].value = value;
        setVariables(updatedVariables);
    };
    const addCustomVariable = () => {
        const newVar = {
            name: `custom_var_${variables.length + 1}`,
            value: '',
            placeholder: 'Enter custom variable...',
            required: false
        };
        setVariables([...variables, newVar]);
    };
    const removeVariable = (index) => {
        const updatedVariables = variables.filter((_, i) => i !== index);
        setVariables(updatedVariables);
    };
    const generatePrompt = () => {
        setIsBuilding(true);
        setTimeout(() => {
            let prompt = customPrompt;
            // Replace variables in the prompt
            variables.forEach(variable => {
                const placeholder = `{${variable.name}}`;
                prompt = prompt.replace(new RegExp(placeholder, 'g'), variable.value || variable.placeholder);
            });
            setGeneratedPrompt(prompt);
            onPromptGenerated?.(prompt);
            setIsBuilding(false);
        }, 1000);
    };
    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(generatedPrompt);
            // Could add a toast notification here
        }
        catch (error) {
            console.error('Failed to copy to clipboard:', error);
        }
    };
    const resetBuilder = () => {
        setSelectedTemplate(null);
        setCustomPrompt('');
        setVariables([]);
        setGeneratedPrompt('');
    };
    return (_jsxs("div", { className: `bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 ${className}`, children: [_jsxs("div", { className: "flex items-center justify-between mb-6", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "p-2 rounded-lg bg-gradient-to-br from-purple-500 to-violet-600", children: _jsx(Wand2, { className: "w-5 h-5 text-white" }) }), _jsxs("div", { children: [_jsx("h3", { className: "font-semibold text-white", children: "AI Prompt Builder" }), _jsxs("p", { className: "text-sm text-emerald-300/70 capitalize", children: [domain, " Domain"] })] })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("button", { onClick: () => setShowTips(!showTips), className: "p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors duration-200", children: _jsx(Lightbulb, { className: "w-4 h-4 text-yellow-400" }) }), _jsx("button", { onClick: resetBuilder, className: "p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors duration-200", children: _jsx(RotateCcw, { className: "w-4 h-4 text-white" }) })] })] }), showTips && (_jsxs("div", { className: "mb-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg", children: [_jsxs("h4", { className: "font-medium text-yellow-400 mb-2", children: ["Prompt Tips for ", domain.charAt(0).toUpperCase() + domain.slice(1)] }), _jsx("ul", { className: "space-y-1", children: tips.map((tip, index) => (_jsxs("li", { className: "text-sm text-yellow-300/80 flex items-start gap-2", children: [_jsx("span", { className: "text-yellow-400 mt-1", children: "\u2022" }), tip] }, index))) })] })), showTemplates && domainTemplates.length > 0 && (_jsxs("div", { className: "mb-6", children: [_jsx("label", { className: "block text-sm font-medium text-emerald-300 mb-2", children: "Choose a Template (Optional)" }), _jsxs("select", { value: selectedTemplate?.id || '', onChange: (e) => {
                            const template = domainTemplates.find(t => t.id === e.target.value);
                            setSelectedTemplate(template || null);
                        }, className: "w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500", children: [_jsx("option", { value: "", className: "bg-gray-800", children: "Select a template..." }), domainTemplates.map(template => (_jsxs("option", { value: template.id, className: "bg-gray-800", children: [template.name, " - ", template.description] }, template.id)))] })] })), _jsxs("div", { className: "mb-6", children: [_jsx("label", { className: "block text-sm font-medium text-emerald-300 mb-2", children: "Prompt Template" }), _jsx("textarea", { value: customPrompt, onChange: (e) => setCustomPrompt(e.target.value), placeholder: "Enter your prompt template here. Use {variable_name} for dynamic content...", className: "w-full h-32 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-emerald-300/50 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none" })] }), variables.length > 0 && (_jsxs("div", { className: "mb-6", children: [_jsxs("div", { className: "flex items-center justify-between mb-3", children: [_jsx("label", { className: "text-sm font-medium text-emerald-300", children: "Variables" }), _jsxs("button", { onClick: addCustomVariable, className: "flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300 transition-colors", children: [_jsx(Plus, { className: "w-3 h-3" }), "Add Variable"] })] }), _jsx("div", { className: "space-y-3", children: variables.map((variable, index) => (_jsxs("div", { className: "flex items-center gap-3", children: [_jsxs("div", { className: "flex-1", children: [_jsx("input", { type: "text", value: variable.value, onChange: (e) => handleVariableChange(index, e.target.value), placeholder: variable.placeholder, className: "w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-emerald-300/50 focus:outline-none focus:ring-2 focus:ring-emerald-500" }), _jsxs("div", { className: "text-xs text-emerald-300/70 mt-1", children: ["Variable: ", variable.name, " ", variable.required && _jsx("span", { className: "text-red-400", children: "*" })] })] }), !variable.required && (_jsx("button", { onClick: () => removeVariable(index), className: "p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 transition-colors duration-200", children: _jsx(X, { className: "w-4 h-4 text-red-400" }) }))] }, index))) })] })), _jsx("div", { className: "mb-6", children: _jsx("button", { onClick: generatePrompt, disabled: isBuilding || !customPrompt.trim(), className: "w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-700 hover:to-green-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-all duration-200", children: isBuilding ? (_jsxs(_Fragment, { children: [_jsx("div", { className: "w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" }), "Building Prompt..."] })) : (_jsxs(_Fragment, { children: [_jsx(Wand2, { className: "w-4 h-4" }), "Generate Prompt"] })) }) }), generatedPrompt && (_jsxs("div", { className: "bg-white/5 border border-white/10 rounded-lg p-4", children: [_jsxs("div", { className: "flex items-center justify-between mb-3", children: [_jsx("h4", { className: "font-medium text-emerald-300", children: "Generated Prompt" }), _jsxs("button", { onClick: copyToClipboard, className: "flex items-center gap-1 text-sm text-emerald-400 hover:text-emerald-300 transition-colors", children: [_jsx(Copy, { className: "w-4 h-4" }), "Copy"] })] }), _jsx("div", { className: "bg-white/5 rounded-lg p-3 border border-white/10", children: _jsx("p", { className: "text-white text-sm leading-relaxed", children: generatedPrompt }) })] }))] }));
};
export default AIPromptBuilder;
//# sourceMappingURL=AIPromptBuilder.js.map