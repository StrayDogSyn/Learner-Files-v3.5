// AI Prompt Builder Component with Glassmorphic Design

import React, { useState, useEffect } from 'react';
import { Wand2, Copy, RotateCcw, Plus, X, ChevronDown, Lightbulb, FileText } from 'lucide-react';
import { DomainType, ContentType } from '../../shared/types/ai';

interface PromptTemplate {
  id: string;
  name: string;
  description: string;
  template: string;
  variables: string[];
  domain: DomainType;
  contentType: ContentType;
}

interface PromptVariable {
  name: string;
  value: string;
  placeholder: string;
  required: boolean;
}

interface AIPromptBuilderProps {
  className?: string;
  domain: DomainType;
  onPromptGenerated?: (prompt: string) => void;
  initialTemplate?: string;
  showTemplates?: boolean;
}

const promptTemplates: PromptTemplate[] = [
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

export const AIPromptBuilder: React.FC<AIPromptBuilderProps> = ({
  className = '',
  domain,
  onPromptGenerated,
  initialTemplate = '',
  showTemplates = true
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<PromptTemplate | null>(null);
  const [customPrompt, setCustomPrompt] = useState(initialTemplate);
  const [variables, setVariables] = useState<PromptVariable[]>([]);
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [showTips, setShowTips] = useState(false);
  const [isBuilding, setIsBuilding] = useState(false);

  const domainTemplates = promptTemplates.filter(t => t.domain === domain);
  const tips = domainPromptTips[domain] || [];

  useEffect(() => {
    if (selectedTemplate) {
      const templateVars: PromptVariable[] = selectedTemplate.variables.map(varName => ({
        name: varName,
        value: '',
        placeholder: `Enter ${varName.replace('_', ' ')}...`,
        required: true
      }));
      setVariables(templateVars);
      setCustomPrompt(selectedTemplate.template);
    }
  }, [selectedTemplate]);

  const handleVariableChange = (index: number, value: string) => {
    const updatedVariables = [...variables];
    updatedVariables[index].value = value;
    setVariables(updatedVariables);
  };

  const addCustomVariable = () => {
    const newVar: PromptVariable = {
      name: `custom_var_${variables.length + 1}`,
      value: '',
      placeholder: 'Enter custom variable...',
      required: false
    };
    setVariables([...variables, newVar]);
  };

  const removeVariable = (index: number) => {
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
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  const resetBuilder = () => {
    setSelectedTemplate(null);
    setCustomPrompt('');
    setVariables([]);
    setGeneratedPrompt('');
  };

  return (
    <div className={`bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-violet-600">
            <Wand2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-white">AI Prompt Builder</h3>
            <p className="text-sm text-emerald-300/70 capitalize">{domain} Domain</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowTips(!showTips)}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors duration-200"
          >
            <Lightbulb className="w-4 h-4 text-yellow-400" />
          </button>
          <button
            onClick={resetBuilder}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors duration-200"
          >
            <RotateCcw className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>

      {/* Tips Panel */}
      {showTips && (
        <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
          <h4 className="font-medium text-yellow-400 mb-2">Prompt Tips for {domain.charAt(0).toUpperCase() + domain.slice(1)}</h4>
          <ul className="space-y-1">
            {tips.map((tip, index) => (
              <li key={index} className="text-sm text-yellow-300/80 flex items-start gap-2">
                <span className="text-yellow-400 mt-1">•</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Template Selection */}
      {showTemplates && domainTemplates.length > 0 && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-emerald-300 mb-2">
            Choose a Template (Optional)
          </label>
          <select
            value={selectedTemplate?.id || ''}
            onChange={(e) => {
              const template = domainTemplates.find(t => t.id === e.target.value);
              setSelectedTemplate(template || null);
            }}
            className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="" className="bg-gray-800">Select a template...</option>
            {domainTemplates.map(template => (
              <option key={template.id} value={template.id} className="bg-gray-800">
                {template.name} - {template.description}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Custom Prompt Input */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-emerald-300 mb-2">
          Prompt Template
        </label>
        <textarea
          value={customPrompt}
          onChange={(e) => setCustomPrompt(e.target.value)}
          placeholder="Enter your prompt template here. Use {variable_name} for dynamic content..."
          className="w-full h-32 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-emerald-300/50 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
        />
      </div>

      {/* Variables */}
      {variables.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-emerald-300">
              Variables
            </label>
            <button
              onClick={addCustomVariable}
              className="flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              <Plus className="w-3 h-3" />
              Add Variable
            </button>
          </div>
          
          <div className="space-y-3">
            {variables.map((variable, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="flex-1">
                  <input
                    type="text"
                    value={variable.value}
                    onChange={(e) => handleVariableChange(index, e.target.value)}
                    placeholder={variable.placeholder}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-emerald-300/50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <div className="text-xs text-emerald-300/70 mt-1">
                    Variable: {variable.name} {variable.required && <span className="text-red-400">*</span>}
                  </div>
                </div>
                
                {!variable.required && (
                  <button
                    onClick={() => removeVariable(index)}
                    className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 transition-colors duration-200"
                  >
                    <X className="w-4 h-4 text-red-400" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Generate Button */}
      <div className="mb-6">
        <button
          onClick={generatePrompt}
          disabled={isBuilding || !customPrompt.trim()}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-700 hover:to-green-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-all duration-200"
        >
          {isBuilding ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Building Prompt...
            </>
          ) : (
            <>
              <Wand2 className="w-4 h-4" />
              Generate Prompt
            </>
          )}
        </button>
      </div>

      {/* Generated Prompt */}
      {generatedPrompt && (
        <div className="bg-white/5 border border-white/10 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-emerald-300">Generated Prompt</h4>
            <button
              onClick={copyToClipboard}
              className="flex items-center gap-1 text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              <Copy className="w-4 h-4" />
              Copy
            </button>
          </div>
          
          <div className="bg-white/5 rounded-lg p-3 border border-white/10">
            <p className="text-white text-sm leading-relaxed">{generatedPrompt}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIPromptBuilder;