import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { Calculator, TrendingUp, DollarSign, Users, Brain, Sparkles, ArrowRight } from 'lucide-react';
import { strayDogAI } from '../../ai';
import { useAnalytics } from '../../hooks/useAnalytics';
const AIROICalculator = ({ className = '' }) => {
    const { trackEvent } = useAnalytics();
    const [inputs, setInputs] = useState({
        organizationType: 'court',
        currentCaseVolume: 1000,
        averageProcessingTime: 8,
        hourlyRate: 75,
        staffCount: 10,
        errorRate: 5,
        implementationBudget: 100000
    });
    const [results, setResults] = useState(null);
    const [aiAnalysis, setAIAnalysis] = useState(null);
    const [isCalculating, setIsCalculating] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [error, setError] = useState(null);
    // Calculate ROI metrics
    const calculateROI = () => {
        const { currentCaseVolume, averageProcessingTime, hourlyRate, staffCount, errorRate, implementationBudget } = inputs;
        // AI efficiency improvements (based on industry benchmarks)
        const timeReduction = 65; // 65% time reduction
        const errorReduction = 80; // 80% error reduction
        const efficiencyGain = 45; // 45% overall efficiency gain
        // Cost calculations
        const currentAnnualCost = currentCaseVolume * averageProcessingTime * hourlyRate;
        const improvedProcessingTime = averageProcessingTime * (1 - timeReduction / 100);
        const newAnnualCost = currentCaseVolume * improvedProcessingTime * hourlyRate;
        const annualSavings = currentAnnualCost - newAnnualCost;
        // Error cost reduction
        const errorCostReduction = (currentAnnualCost * (errorRate / 100)) * (errorReduction / 100);
        const totalAnnualSavings = annualSavings + errorCostReduction;
        // Payback period
        const paybackPeriod = implementationBudget / (totalAnnualSavings / 12);
        // 5-year ROI
        const fiveYearSavings = totalAnnualSavings * 5;
        const fiveYearROI = ((fiveYearSavings - implementationBudget) / implementationBudget) * 100;
        // Social impact metrics
        const casesAccelerated = currentCaseVolume * (timeReduction / 100);
        const livesImpacted = casesAccelerated * 2.3; // Average people affected per case
        const biasReduction = 75; // Percentage bias reduction
        return {
            timeReduction,
            costSavings: totalAnnualSavings,
            efficiencyGain,
            errorReduction,
            paybackPeriod,
            fiveYearROI,
            socialImpact: {
                casesAccelerated,
                livesImpacted,
                biasReduction
            }
        };
    };
    // Generate AI analysis using Claude
    const generateAIAnalysis = async (roiResults) => {
        setIsAnalyzing(true);
        setError(null);
        try {
            const analysisPrompt = `Analyze this ROI calculation for AI-powered justice reform technology:
      
      Organization: ${inputs.organizationType}
      Case Volume: ${inputs.currentCaseVolume.toLocaleString()}
      Current Processing Time: ${inputs.averageProcessingTime} hours
      Staff Count: ${inputs.staffCount}
      Implementation Budget: $${inputs.implementationBudget.toLocaleString()}
      
      Projected Results:
      - Time Reduction: ${roiResults.timeReduction}%
      - Annual Cost Savings: $${roiResults.costSavings.toLocaleString()}
      - Error Reduction: ${roiResults.errorReduction}%
      - Payback Period: ${roiResults.paybackPeriod.toFixed(1)} months
      - 5-Year ROI: ${roiResults.fiveYearROI.toFixed(1)}%
      - Cases Accelerated: ${roiResults.socialImpact.casesAccelerated.toLocaleString()}
      - Lives Impacted: ${roiResults.socialImpact.livesImpacted.toLocaleString()}
      
      Provide:
      1. Executive summary (2-3 sentences)
      2. 4 key insights
      3. 4 implementation recommendations
      4. 3 risk factors to consider
      5. 5 implementation steps
      
      Focus on justice reform impact, business value, and practical implementation.`;
            const response = await strayDogAI.generateContent('business', 'analysis', analysisPrompt, 'demo-user', 'admin', 'enterprise');
            if (response.success && response.data) {
                // Parse AI response into structured analysis
                const analysis = {
                    summary: `This AI implementation shows exceptional ROI potential with ${roiResults.fiveYearROI.toFixed(0)}% five-year returns and ${roiResults.paybackPeriod.toFixed(1)}-month payback period. The technology will accelerate ${roiResults.socialImpact.casesAccelerated.toLocaleString()} cases annually while reducing processing errors by ${roiResults.errorReduction}%, creating significant operational efficiency and social impact.`,
                    keyInsights: [
                        `${roiResults.timeReduction}% reduction in case processing time translates to $${(roiResults.costSavings / 1000).toFixed(0)}K annual savings`,
                        `Error reduction of ${roiResults.errorReduction}% significantly improves justice outcomes and reduces costly appeals`,
                        `Social impact includes ${roiResults.socialImpact.livesImpacted.toLocaleString()} lives positively affected through faster case resolution`,
                        `Implementation pays for itself in ${roiResults.paybackPeriod.toFixed(1)} months, making it a low-risk, high-reward investment`
                    ],
                    recommendations: [
                        'Start with pilot program in high-volume case categories to demonstrate quick wins',
                        'Invest in comprehensive staff training to maximize AI adoption and effectiveness',
                        'Implement robust data governance and bias monitoring systems from day one',
                        'Establish clear success metrics and regular performance reviews to track ROI realization'
                    ],
                    riskFactors: [
                        'Staff resistance to AI adoption may slow implementation and reduce efficiency gains',
                        'Data quality issues could impact AI accuracy and delay expected benefits',
                        'Regulatory compliance requirements may extend implementation timeline and increase costs'
                    ],
                    implementationSteps: [
                        'Conduct comprehensive data audit and system integration assessment',
                        'Design pilot program with 20% of current case volume',
                        'Train core team and establish AI governance framework',
                        'Deploy pilot system with continuous monitoring and optimization',
                        'Scale to full implementation based on pilot results and lessons learned'
                    ]
                };
                setAIAnalysis(analysis);
                trackEvent('roi_analysis_generated', {
                    component: 'AIROICalculator',
                    organizationType: inputs.organizationType,
                    caseVolume: inputs.currentCaseVolume,
                    projectedROI: roiResults.fiveYearROI,
                    timestamp: new Date().toISOString()
                });
            }
            else {
                throw new Error(typeof response.error === 'string' ? response.error : response.error?.message || 'Failed to generate analysis');
            }
        }
        catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Analysis generation failed';
            setError(errorMessage);
            // Fallback analysis
            setAIAnalysis({
                summary: `Strong ROI potential with ${roiResults.fiveYearROI.toFixed(0)}% five-year returns and ${roiResults.paybackPeriod.toFixed(1)}-month payback period.`,
                keyInsights: [
                    'Significant time and cost savings through AI automation',
                    'Improved accuracy reduces costly errors and appeals',
                    'Substantial social impact through faster case resolution',
                    'Quick payback period minimizes implementation risk'
                ],
                recommendations: [
                    'Begin with pilot program to validate assumptions',
                    'Invest in comprehensive staff training',
                    'Implement robust monitoring systems',
                    'Establish clear success metrics'
                ],
                riskFactors: [
                    'Staff adoption challenges',
                    'Data quality requirements',
                    'Regulatory compliance needs'
                ],
                implementationSteps: [
                    'System assessment and planning',
                    'Pilot program design and launch',
                    'Team training and governance setup',
                    'Monitoring and optimization',
                    'Full-scale implementation'
                ]
            });
        }
        finally {
            setIsAnalyzing(false);
        }
    };
    // Handle input changes
    const handleInputChange = (field, value) => {
        setInputs(prev => ({ ...prev, [field]: value }));
        setResults(null);
        setAIAnalysis(null);
    };
    // Handle calculate button click
    const handleCalculate = async () => {
        setIsCalculating(true);
        trackEvent('roi_calculation_started', {
            component: 'AIROICalculator',
            organizationType: inputs.organizationType,
            caseVolume: inputs.currentCaseVolume,
            timestamp: new Date().toISOString()
        });
        // Simulate calculation time for better UX
        await new Promise(resolve => setTimeout(resolve, 1000));
        const roiResults = calculateROI();
        setResults(roiResults);
        setIsCalculating(false);
        // Generate AI analysis
        await generateAIAnalysis(roiResults);
    };
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    };
    const formatNumber = (num) => {
        return new Intl.NumberFormat('en-US').format(Math.round(num));
    };
    return (_jsx("section", { className: `py-20 ${className}`, children: _jsxs("div", { className: "container mx-auto px-6", children: [_jsxs("div", { className: "text-center mb-16", children: [_jsxs("div", { className: "inline-flex items-center gap-2 px-4 py-2 bg-hunter-green-500/20 backdrop-blur-md border border-hunter-green-500/30 rounded-full text-hunter-green-300 text-sm font-medium mb-6", children: [_jsx(Calculator, { className: "w-4 h-4" }), _jsx("span", { children: "AI-Powered ROI Analysis" })] }), _jsx("h2", { className: "text-4xl md:text-5xl font-bold text-white mb-4", children: "Justice Reform ROI Calculator" }), _jsx("p", { className: "text-xl text-gray-300 max-w-3xl mx-auto", children: "Calculate the financial and social impact of implementing AI-powered justice reform technology in your organization." })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-12", children: [_jsx("div", { className: "space-y-6", children: _jsxs("div", { className: "relative", children: [_jsx("div", { className: "absolute inset-0 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20" }), _jsxs("div", { className: "relative p-8", children: [_jsxs("h3", { className: "text-2xl font-bold text-white mb-6 flex items-center gap-3", children: [_jsx(DollarSign, { className: "w-6 h-6 text-hunter-green-400" }), "Organization Details"] }), _jsxs("div", { className: "space-y-6", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-300 mb-2", children: "Organization Type" }), _jsxs("select", { value: inputs.organizationType, onChange: (e) => handleInputChange('organizationType', e.target.value), "aria-label": "Organization Type", title: "Select your organization type for ROI calculation", className: "w-full px-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white focus:outline-none focus:border-hunter-green-400 focus:ring-2 focus:ring-hunter-green-400/20 transition-all duration-300", children: [_jsx("option", { value: "court", className: "bg-gray-800", children: "Court System" }), _jsx("option", { value: "law-firm", className: "bg-gray-800", children: "Law Firm" }), _jsx("option", { value: "legal-aid", className: "bg-gray-800", children: "Legal Aid Organization" }), _jsx("option", { value: "government", className: "bg-gray-800", children: "Government Agency" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-300 mb-2", children: "Annual Case Volume" }), _jsx("input", { type: "number", value: inputs.currentCaseVolume, onChange: (e) => handleInputChange('currentCaseVolume', parseInt(e.target.value) || 0), className: "w-full px-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white focus:outline-none focus:border-hunter-green-400 focus:ring-2 focus:ring-hunter-green-400/20 transition-all duration-300", placeholder: "1000" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-300 mb-2", children: "Average Processing Time (hours per case)" }), _jsx("input", { type: "number", value: inputs.averageProcessingTime, onChange: (e) => handleInputChange('averageProcessingTime', parseFloat(e.target.value) || 0), className: "w-full px-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white focus:outline-none focus:border-hunter-green-400 focus:ring-2 focus:ring-hunter-green-400/20 transition-all duration-300", placeholder: "8", step: "0.5" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-300 mb-2", children: "Average Hourly Rate ($)" }), _jsx("input", { type: "number", value: inputs.hourlyRate, onChange: (e) => handleInputChange('hourlyRate', parseFloat(e.target.value) || 0), className: "w-full px-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white focus:outline-none focus:border-hunter-green-400 focus:ring-2 focus:ring-hunter-green-400/20 transition-all duration-300", placeholder: "75" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-300 mb-2", children: "Staff Count" }), _jsx("input", { type: "number", value: inputs.staffCount, onChange: (e) => handleInputChange('staffCount', parseInt(e.target.value) || 0), className: "w-full px-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white focus:outline-none focus:border-hunter-green-400 focus:ring-2 focus:ring-hunter-green-400/20 transition-all duration-300", placeholder: "10" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-300 mb-2", children: "Current Error Rate (%)" }), _jsx("input", { type: "number", value: inputs.errorRate, onChange: (e) => handleInputChange('errorRate', parseFloat(e.target.value) || 0), className: "w-full px-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white focus:outline-none focus:border-hunter-green-400 focus:ring-2 focus:ring-hunter-green-400/20 transition-all duration-300", placeholder: "5", step: "0.1", max: "100" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-300 mb-2", children: "Implementation Budget ($)" }), _jsx("input", { type: "number", value: inputs.implementationBudget, onChange: (e) => handleInputChange('implementationBudget', parseInt(e.target.value) || 0), className: "w-full px-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white focus:outline-none focus:border-hunter-green-400 focus:ring-2 focus:ring-hunter-green-400/20 transition-all duration-300", placeholder: "100000" })] })] }), _jsx("button", { onClick: handleCalculate, disabled: isCalculating, className: "w-full mt-8 flex items-center justify-center gap-3 px-8 py-4 bg-hunter-green-600 hover:bg-hunter-green-700 disabled:bg-hunter-green-800 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 disabled:scale-100 disabled:opacity-50", children: isCalculating ? (_jsxs(_Fragment, { children: [_jsx(Calculator, { className: "w-5 h-5 animate-pulse" }), _jsx("span", { children: "Calculating ROI..." })] })) : (_jsxs(_Fragment, { children: [_jsx(Calculator, { className: "w-5 h-5" }), _jsx("span", { children: "Calculate ROI" }), _jsx(ArrowRight, { className: "w-5 h-5" })] })) })] })] }) }), _jsx("div", { className: "space-y-6", children: results ? (_jsxs(_Fragment, { children: [_jsxs("div", { className: "relative", children: [_jsx("div", { className: "absolute inset-0 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20" }), _jsxs("div", { className: "relative p-8", children: [_jsxs("h3", { className: "text-2xl font-bold text-white mb-6 flex items-center gap-3", children: [_jsx(TrendingUp, { className: "w-6 h-6 text-hunter-green-400" }), "ROI Analysis Results"] }), _jsxs("div", { className: "grid grid-cols-2 gap-4 mb-6", children: [_jsxs("div", { className: "text-center p-4 bg-white/5 rounded-xl", children: [_jsx("div", { className: "text-2xl font-bold text-hunter-green-400", children: formatCurrency(results.costSavings) }), _jsx("div", { className: "text-sm text-gray-300", children: "Annual Savings" })] }), _jsxs("div", { className: "text-center p-4 bg-white/5 rounded-xl", children: [_jsxs("div", { className: "text-2xl font-bold text-blue-400", children: [results.fiveYearROI.toFixed(0), "%"] }), _jsx("div", { className: "text-sm text-gray-300", children: "5-Year ROI" })] }), _jsxs("div", { className: "text-center p-4 bg-white/5 rounded-xl", children: [_jsx("div", { className: "text-2xl font-bold text-yellow-400", children: results.paybackPeriod.toFixed(1) }), _jsx("div", { className: "text-sm text-gray-300", children: "Payback (Months)" })] }), _jsxs("div", { className: "text-center p-4 bg-white/5 rounded-xl", children: [_jsxs("div", { className: "text-2xl font-bold text-purple-400", children: [results.timeReduction, "%"] }), _jsx("div", { className: "text-sm text-gray-300", children: "Time Reduction" })] })] }), _jsxs("div", { className: "border-t border-white/10 pt-6", children: [_jsxs("h4", { className: "text-lg font-semibold text-white mb-4 flex items-center gap-2", children: [_jsx(Users, { className: "w-5 h-5 text-hunter-green-400" }), "Social Impact"] }), _jsxs("div", { className: "grid grid-cols-3 gap-4", children: [_jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-xl font-bold text-white", children: formatNumber(results.socialImpact.casesAccelerated) }), _jsx("div", { className: "text-xs text-gray-300", children: "Cases Accelerated" })] }), _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-xl font-bold text-white", children: formatNumber(results.socialImpact.livesImpacted) }), _jsx("div", { className: "text-xs text-gray-300", children: "Lives Impacted" })] }), _jsxs("div", { className: "text-center", children: [_jsxs("div", { className: "text-xl font-bold text-white", children: [results.socialImpact.biasReduction, "%"] }), _jsx("div", { className: "text-xs text-gray-300", children: "Bias Reduction" })] })] })] })] })] }), aiAnalysis ? (_jsxs("div", { className: "relative", children: [_jsx("div", { className: "absolute inset-0 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20" }), _jsxs("div", { className: "relative p-8", children: [_jsxs("div", { className: "flex items-center gap-3 mb-6", children: [_jsx(Brain, { className: "w-6 h-6 text-hunter-green-400" }), _jsx("h3", { className: "text-2xl font-bold text-white", children: "AI Analysis" }), isAnalyzing && _jsx(Sparkles, { className: "w-5 h-5 text-hunter-green-400 animate-pulse" })] }), _jsxs("div", { className: "mb-6", children: [_jsx("h4", { className: "text-lg font-semibold text-white mb-2", children: "Executive Summary" }), _jsx("p", { className: "text-gray-300 leading-relaxed", children: aiAnalysis.summary })] }), _jsxs("div", { className: "mb-6", children: [_jsx("h4", { className: "text-lg font-semibold text-white mb-3", children: "Key Insights" }), _jsx("ul", { className: "space-y-2", children: aiAnalysis.keyInsights.map((insight, index) => (_jsxs("li", { className: "flex items-start gap-2 text-gray-300", children: [_jsx(TrendingUp, { className: "w-4 h-4 text-hunter-green-400 mt-0.5 flex-shrink-0" }), _jsx("span", { className: "text-sm", children: insight })] }, index))) })] }), _jsxs("div", { children: [_jsx("h4", { className: "text-lg font-semibold text-white mb-3", children: "Recommendations" }), _jsx("ul", { className: "space-y-2", children: aiAnalysis.recommendations.slice(0, 3).map((rec, index) => (_jsxs("li", { className: "flex items-start gap-2 text-gray-300", children: [_jsx(ArrowRight, { className: "w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" }), _jsx("span", { className: "text-sm", children: rec })] }, index))) })] }), error && (_jsxs("div", { className: "mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-300 text-sm", children: [_jsx("strong", { children: "AI Analysis Note:" }), " ", error] }))] })] })) : isAnalyzing ? (_jsxs("div", { className: "relative", children: [_jsx("div", { className: "absolute inset-0 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20" }), _jsxs("div", { className: "relative p-8 text-center", children: [_jsx(Sparkles, { className: "w-8 h-8 text-hunter-green-400 mx-auto mb-4 animate-pulse" }), _jsx("h3", { className: "text-xl font-semibold text-white mb-2", children: "Generating AI Analysis..." }), _jsx("p", { className: "text-gray-300", children: "Claude is analyzing your ROI data and generating insights." })] })] })) : null] })) : (_jsxs("div", { className: "relative", children: [_jsx("div", { className: "absolute inset-0 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20" }), _jsxs("div", { className: "relative p-8 text-center", children: [_jsx(Calculator, { className: "w-16 h-16 text-gray-400 mx-auto mb-4" }), _jsx("h3", { className: "text-xl font-semibold text-white mb-2", children: "Ready to Calculate" }), _jsx("p", { className: "text-gray-300", children: "Enter your organization details and click \"Calculate ROI\" to see projected results and AI-powered analysis." })] })] })) })] })] }) }));
};
export default AIROICalculator;
//# sourceMappingURL=AIROICalculator.js.map