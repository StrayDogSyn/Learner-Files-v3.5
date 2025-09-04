import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { FileText, Download, RefreshCw, Sparkles, Users, TrendingUp, Target, Calendar } from 'lucide-react';
import { strayDogAI } from '../../ai';
import { useAnalytics } from '../../hooks/useAnalytics';
const AICaseStudyGenerator = () => {
    const [caseStudies, setCaseStudies] = useState([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [selectedProject, setSelectedProject] = useState('');
    const [customPrompt, setCustomPrompt] = useState('');
    const [generationCount, setGenerationCount] = useState(0);
    const { trackEvent } = useAnalytics();
    // Mock project data - in real implementation, this would come from GitHub API or project database
    const projectData = [
        {
            name: 'Justice Reform Analytics Platform',
            description: 'AI-powered platform for analyzing criminal justice data and identifying reform opportunities',
            technologies: ['React', 'TypeScript', 'Claude AI', 'D3.js', 'Node.js'],
            metrics: {
                users: 1200,
                efficiency: '45% faster case processing',
                cost_savings: '$2.3M annually'
            }
        },
        {
            name: 'Bail Reform Prediction System',
            description: 'Machine learning system to predict optimal bail decisions and reduce recidivism',
            technologies: ['Python', 'TensorFlow', 'React', 'PostgreSQL'],
            metrics: {
                users: 850,
                efficiency: '60% reduction in pre-trial detention',
                cost_savings: '$1.8M annually'
            }
        },
        {
            name: 'Legal Aid Resource Optimizer',
            description: 'Platform to optimize legal aid resource allocation and improve access to justice',
            technologies: ['Vue.js', 'Node.js', 'MongoDB', 'Claude AI'],
            metrics: {
                users: 2100,
                efficiency: '35% increase in case resolution',
                cost_savings: '$950K annually'
            }
        }
    ];
    const generateCaseStudy = async () => {
        if (!selectedProject && !customPrompt)
            return;
        setIsGenerating(true);
        trackEvent('case_study_generation_started', {
            project: selectedProject,
            has_custom_prompt: !!customPrompt
        });
        try {
            const project = projectData.find(p => p.name === selectedProject);
            const prompt = customPrompt || `Generate a comprehensive case study for the ${project?.name || 'justice reform project'}. 
      
      Project Details:
      - Name: ${project?.name}
      - Description: ${project?.description}
      - Technologies: ${project?.technologies.join(', ')}
      - Key Metrics: ${JSON.stringify(project?.metrics)}
      
      Please create a detailed case study that includes:
      1. Client background and challenge
      2. Our solution approach
      3. Implementation details
      4. Measurable impact and outcomes
      5. Client testimonial
      6. Lessons learned
      
      Focus on justice reform impact, technological innovation, and measurable social outcomes. Make it compelling and professional for potential clients.`;
            const response = await strayDogAI.generateContent('corporate', 'case-study', prompt, 'user-' + Date.now(), 'user', 'free');
            // Parse the AI response into structured case study data
            const newCaseStudy = {
                id: `case-${Date.now()}`,
                title: project?.name || 'Custom Justice Reform Project',
                client: 'State Justice Department', // This would be dynamic in real implementation
                challenge: response.data?.split('Challenge:')[1]?.split('Solution:')[0]?.trim() || 'Complex justice reform challenges requiring innovative solutions',
                solution: response.data?.split('Solution:')[1]?.split('Impact:')[0]?.trim() || 'AI-powered platform with advanced analytics and user-friendly interface',
                impact: [
                    {
                        metric: 'Processing Efficiency',
                        value: project?.metrics?.efficiency || '40% improvement',
                        improvement: 'Faster case resolution'
                    },
                    {
                        metric: 'Cost Savings',
                        value: project?.metrics?.cost_savings || '$1.5M annually',
                        improvement: 'Reduced operational costs'
                    },
                    {
                        metric: 'User Adoption',
                        value: `${project?.metrics?.users || 1000}+ users`,
                        improvement: 'High engagement rate'
                    }
                ],
                timeline: '6 months',
                technologies: project?.technologies || ['React', 'TypeScript', 'Claude AI'],
                outcomes: [
                    'Improved case processing efficiency',
                    'Enhanced decision-making accuracy',
                    'Reduced administrative burden',
                    'Better resource allocation'
                ],
                testimonial: '"This platform has revolutionized how we approach justice reform. The AI insights have been invaluable." - Justice Department Director',
                generatedAt: new Date()
            };
            setCaseStudies(prev => [newCaseStudy, ...prev]);
            setGenerationCount(prev => prev + 1);
            trackEvent('case_study_generated', {
                case_study_id: newCaseStudy.id,
                project: selectedProject,
                generation_time: Date.now()
            });
        }
        catch (error) {
            console.error('Error generating case study:', error);
            trackEvent('case_study_generation_error', { error: error.message });
        }
        finally {
            setIsGenerating(false);
        }
    };
    const downloadCaseStudy = (caseStudy) => {
        const content = `
# ${caseStudy.title}

## Client: ${caseStudy.client}

## Challenge
${caseStudy.challenge}

## Solution
${caseStudy.solution}

## Impact Metrics
${caseStudy.impact.map(i => `- **${i.metric}**: ${i.value} (${i.improvement})`).join('\n')}

## Technologies Used
${caseStudy.technologies.map(tech => `- ${tech}`).join('\n')}

## Key Outcomes
${caseStudy.outcomes.map(outcome => `- ${outcome}`).join('\n')}

## Client Testimonial
> ${caseStudy.testimonial}

---
*Generated on ${caseStudy.generatedAt.toLocaleDateString()}*
    `;
        const blob = new Blob([content], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${caseStudy.title.replace(/\s+/g, '-').toLowerCase()}-case-study.md`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        trackEvent('case_study_downloaded', {
            case_study_id: caseStudy.id,
            title: caseStudy.title
        });
    };
    return (_jsxs("div", { className: "max-w-6xl mx-auto p-6", children: [_jsxs("div", { className: "text-center mb-8", children: [_jsxs("div", { className: "flex items-center justify-center gap-3 mb-4", children: [_jsx("div", { className: "p-3 bg-gradient-to-r from-hunter-green-500 to-hunter-green-600 rounded-full", children: _jsx(FileText, { className: "w-8 h-8 text-white" }) }), _jsx("h1", { className: "text-4xl font-bold bg-gradient-to-r from-hunter-green-400 to-hunter-green-600 bg-clip-text text-transparent", children: "AI Case Study Generator" })] }), _jsx("p", { className: "text-gray-400 text-lg max-w-2xl mx-auto", children: "Generate compelling case studies showcasing justice reform impact using AI analysis of project data" })] }), _jsxs("div", { className: "bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 mb-8", children: [_jsxs("h2", { className: "text-xl font-semibold text-white mb-4 flex items-center gap-2", children: [_jsx(Sparkles, { className: "w-5 h-5 text-hunter-green-400" }), "Generate New Case Study"] }), _jsxs("div", { className: "grid md:grid-cols-2 gap-6", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-300 mb-2", children: "Select Project" }), _jsxs("select", { value: selectedProject, onChange: (e) => setSelectedProject(e.target.value), "aria-label": "Select Project", title: "Choose a project to generate case study", className: "w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-hunter-green-500", children: [_jsx("option", { value: "", children: "Choose a project..." }), projectData.map((project) => (_jsx("option", { value: project.name, className: "bg-gray-800", children: project.name }, project.name)))] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-300 mb-2", children: "Custom Prompt (Optional)" }), _jsx("textarea", { value: customPrompt, onChange: (e) => setCustomPrompt(e.target.value), placeholder: "Add specific requirements or focus areas...", className: "w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-hunter-green-500 resize-none", rows: 3 })] })] }), _jsx("button", { onClick: generateCaseStudy, disabled: isGenerating || (!selectedProject && !customPrompt), className: "mt-4 bg-gradient-to-r from-hunter-green-500 to-hunter-green-600 text-white px-6 py-3 rounded-lg font-medium hover:from-hunter-green-600 hover:to-hunter-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center gap-2", children: isGenerating ? (_jsxs(_Fragment, { children: [_jsx(RefreshCw, { className: "w-4 h-4 animate-spin" }), "Generating..."] })) : (_jsxs(_Fragment, { children: [_jsx(Sparkles, { className: "w-4 h-4" }), "Generate Case Study"] })) })] }), _jsx("div", { className: "space-y-6", children: caseStudies.map((caseStudy) => (_jsxs("div", { className: "bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6", children: [_jsxs("div", { className: "flex justify-between items-start mb-4", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-2xl font-bold text-white mb-2", children: caseStudy.title }), _jsx("p", { className: "text-hunter-green-400 font-medium", children: caseStudy.client })] }), _jsxs("button", { onClick: () => downloadCaseStudy(caseStudy), className: "bg-white/10 hover:bg-white/20 border border-white/20 text-white px-4 py-2 rounded-lg transition-all duration-300 flex items-center gap-2", children: [_jsx(Download, { className: "w-4 h-4" }), "Download"] })] }), _jsxs("div", { className: "grid md:grid-cols-2 gap-6 mb-6", children: [_jsxs("div", { children: [_jsxs("h4", { className: "text-lg font-semibold text-white mb-2 flex items-center gap-2", children: [_jsx(Target, { className: "w-5 h-5 text-hunter-green-400" }), "Challenge"] }), _jsx("p", { className: "text-gray-300", children: caseStudy.challenge })] }), _jsxs("div", { children: [_jsxs("h4", { className: "text-lg font-semibold text-white mb-2 flex items-center gap-2", children: [_jsx(Sparkles, { className: "w-5 h-5 text-hunter-green-400" }), "Solution"] }), _jsx("p", { className: "text-gray-300", children: caseStudy.solution })] })] }), _jsxs("div", { className: "mb-6", children: [_jsxs("h4", { className: "text-lg font-semibold text-white mb-4 flex items-center gap-2", children: [_jsx(TrendingUp, { className: "w-5 h-5 text-hunter-green-400" }), "Impact Metrics"] }), _jsx("div", { className: "grid md:grid-cols-3 gap-4", children: caseStudy.impact.map((metric, index) => (_jsxs("div", { className: "bg-white/5 border border-white/10 rounded-lg p-4", children: [_jsx("div", { className: "text-2xl font-bold text-hunter-green-400 mb-1", children: metric.value }), _jsx("div", { className: "text-white font-medium", children: metric.metric }), _jsx("div", { className: "text-gray-400 text-sm", children: metric.improvement })] }, index))) })] }), _jsxs("div", { className: "grid md:grid-cols-2 gap-6 mb-6", children: [_jsxs("div", { children: [_jsx("h4", { className: "text-lg font-semibold text-white mb-2", children: "Technologies Used" }), _jsx("div", { className: "flex flex-wrap gap-2", children: caseStudy.technologies.map((tech) => (_jsx("span", { className: "bg-hunter-green-500/20 text-hunter-green-400 px-3 py-1 rounded-full text-sm", children: tech }, tech))) })] }), _jsxs("div", { children: [_jsxs("h4", { className: "text-lg font-semibold text-white mb-2 flex items-center gap-2", children: [_jsx(Calendar, { className: "w-5 h-5 text-hunter-green-400" }), "Timeline"] }), _jsx("p", { className: "text-gray-300", children: caseStudy.timeline })] })] }), caseStudy.testimonial && (_jsxs("div", { className: "bg-hunter-green-500/10 border border-hunter-green-500/20 rounded-lg p-4", children: [_jsxs("h4", { className: "text-lg font-semibold text-white mb-2 flex items-center gap-2", children: [_jsx(Users, { className: "w-5 h-5 text-hunter-green-400" }), "Client Testimonial"] }), _jsxs("p", { className: "text-gray-300 italic", children: ["\"", caseStudy.testimonial, "\""] })] })), _jsxs("div", { className: "text-xs text-gray-500 mt-4", children: ["Generated on ", caseStudy.generatedAt.toLocaleDateString(), " at ", caseStudy.generatedAt.toLocaleTimeString()] })] }, caseStudy.id))) }), caseStudies.length === 0 && (_jsxs("div", { className: "text-center py-12", children: [_jsx(FileText, { className: "w-16 h-16 text-gray-600 mx-auto mb-4" }), _jsx("h3", { className: "text-xl font-semibold text-gray-400 mb-2", children: "No Case Studies Generated Yet" }), _jsx("p", { className: "text-gray-500", children: "Select a project and generate your first AI-powered case study" })] }))] }));
};
export default AICaseStudyGenerator;
//# sourceMappingURL=AICaseStudyGenerator.js.map