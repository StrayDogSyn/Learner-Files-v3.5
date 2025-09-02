import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  Zap, 
  Play, 
  Square, 
  RotateCcw, 
  Settings, 
  Download, 
  Upload, 
  Copy, 
  Share2,
  Cpu, 
  Activity, 
  Clock, 
  BarChart3, 
  Sliders, 
  Image, 
  FileText, 
  MessageSquare, 
  Code,
  Sparkles,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Loader2,
  Eye,
  EyeOff
} from 'lucide-react';

interface AIModel {
  id: string;
  name: string;
  type: 'text' | 'image' | 'code' | 'chat';
  description: string;
  parameters: {
    temperature: number;
    maxTokens: number;
    topP: number;
    frequencyPenalty: number;
  };
  isLoaded: boolean;
  loadTime?: number;
}

interface InferenceResult {
  id: string;
  input: string;
  output: string;
  model: string;
  timestamp: Date;
  processingTime: number;
  confidence?: number;
  tokens?: {
    input: number;
    output: number;
  };
}

interface AIInferenceProps {
  projectId: string;
  title?: string;
  description?: string;
  className?: string;
}

const AIInference: React.FC<AIInferenceProps> = ({
  projectId,
  title = 'AI Inference Demo',
  description = 'Experience real-time AI model inference',
  className = ''
}) => {
  const [models] = useState<AIModel[]>([
    {
      id: 'gpt-4',
      name: 'GPT-4 Turbo',
      type: 'text',
      description: 'Advanced language model for text generation and analysis',
      parameters: {
        temperature: 0.7,
        maxTokens: 1000,
        topP: 0.9,
        frequencyPenalty: 0.0
      },
      isLoaded: true,
      loadTime: 1200
    },
    {
      id: 'claude-3',
      name: 'Claude 3 Sonnet',
      type: 'chat',
      description: 'Conversational AI with advanced reasoning capabilities',
      parameters: {
        temperature: 0.8,
        maxTokens: 2000,
        topP: 0.95,
        frequencyPenalty: 0.1
      },
      isLoaded: true,
      loadTime: 950
    },
    {
      id: 'dall-e-3',
      name: 'DALL-E 3',
      type: 'image',
      description: 'Advanced image generation from text descriptions',
      parameters: {
        temperature: 0.9,
        maxTokens: 500,
        topP: 1.0,
        frequencyPenalty: 0.0
      },
      isLoaded: false,
      loadTime: 2500
    },
    {
      id: 'codex',
      name: 'GitHub Copilot',
      type: 'code',
      description: 'AI-powered code generation and completion',
      parameters: {
        temperature: 0.3,
        maxTokens: 1500,
        topP: 0.8,
        frequencyPenalty: 0.2
      },
      isLoaded: true,
      loadTime: 800
    }
  ]);
  
  const [selectedModel, setSelectedModel] = useState<AIModel>(models[0]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<InferenceResult[]>([]);
  const [showSettings, setShowSettings] = useState(false);
  const [showMetrics, setShowMetrics] = useState(true);
  const [modelParameters, setModelParameters] = useState(selectedModel.parameters);
  
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setModelParameters(selectedModel.parameters);
  }, [selectedModel]);

  const simulateInference = useCallback(async (inputText: string): Promise<InferenceResult> => {
    const startTime = Date.now();
    
    // Simulate processing delay based on model type
    const processingDelay = {
      'text': 1000 + Math.random() * 2000,
      'chat': 800 + Math.random() * 1500,
      'image': 3000 + Math.random() * 5000,
      'code': 1200 + Math.random() * 2500
    }[selectedModel.type];
    
    await new Promise(resolve => setTimeout(resolve, processingDelay));
    
    const endTime = Date.now();
    const processingTime = endTime - startTime;
    
    // Generate mock output based on model type
    let output = '';
    let confidence = 0.85 + Math.random() * 0.14;
    
    switch (selectedModel.type) {
      case 'text':
        output = `Generated response for: "${inputText}". This is a sophisticated AI-generated text that demonstrates the model's understanding of context, nuance, and linguistic patterns. The response maintains coherence while providing valuable insights based on the input prompt.`;
        break;
      case 'chat':
        output = `I understand you're asking about "${inputText}". Let me provide a thoughtful response that addresses your query comprehensively. Based on my analysis, here are the key points to consider...`;
        break;
      case 'image':
        output = `[Generated Image] A high-quality image based on the prompt: "${inputText}". The image features vibrant colors, detailed composition, and artistic elements that perfectly capture the essence of your description.`;
        break;
      case 'code':
        output = `// Generated code for: ${inputText}\nfunction processInput(data) {\n  // AI-generated implementation\n  const result = data.map(item => {\n    return item.transform();\n  });\n  \n  return result.filter(Boolean);\n}\n\n// Usage example\nconst output = processInput(inputData);\nconsole.log('Processing complete:', output);`;
        break;
    }
    
    const inputTokens = Math.ceil(inputText.length / 4);
    const outputTokens = Math.ceil(output.length / 4);
    
    return {
      id: Date.now().toString(),
      input: inputText,
      output,
      model: selectedModel.name,
      timestamp: new Date(),
      processingTime,
      confidence,
      tokens: {
        input: inputTokens,
        output: outputTokens
      }
    };
  }, [selectedModel]);

  const runInference = async () => {
    if (!input.trim() || isProcessing) return;
    
    setIsProcessing(true);
    
    try {
      const result = await simulateInference(input);
      setResults(prev => [result, ...prev]);
      setInput('');
    } catch (error) {
      console.error('Inference error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const clearResults = () => {
    setResults([]);
  };

  const downloadResults = () => {
    const data = {
      model: selectedModel.name,
      parameters: modelParameters,
      results: results,
      timestamp: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ai-inference-results-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyResult = (result: InferenceResult) => {
    navigator.clipboard.writeText(result.output);
  };

  const shareResult = async (result: InferenceResult) => {
    const shareData = {
      title: `AI Inference Result - ${result.model}`,
      text: result.output.substring(0, 100) + '...',
      url: window.location.href
    };
    
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        copyResult(result);
      }
    } else {
      copyResult(result);
    }
  };

  const getModelIcon = (type: AIModel['type']) => {
    switch (type) {
      case 'text':
        return <FileText className="w-4 h-4" />;
      case 'chat':
        return <MessageSquare className="w-4 h-4" />;
      case 'image':
        return <Image className="w-4 h-4" />;
      case 'code':
        return <Code className="w-4 h-4" />;
      default:
        return <Brain className="w-4 h-4" />;
    }
  };

  const formatProcessingTime = (time: number) => {
    if (time < 1000) return `${time}ms`;
    return `${(time / 1000).toFixed(1)}s`;
  };

  const averageProcessingTime = results.length > 0 
    ? results.reduce((sum, result) => sum + result.processingTime, 0) / results.length
    : 0;

  const totalTokens = results.reduce((sum, result) => 
    sum + (result.tokens?.input || 0) + (result.tokens?.output || 0), 0
  );

  return (
    <div className={`bg-white/10 backdrop-blur-md border border-white/20 rounded-xl overflow-hidden ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/20">
        <div className="flex items-center gap-3">
          <Brain className="w-5 h-5 text-emerald-400" />
          <div>
            <h3 className="text-lg font-semibold text-white">{title}</h3>
            <p className="text-sm text-gray-400">{description}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowMetrics(!showMetrics)}
            className="flex items-center gap-2 px-3 py-1 text-sm text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            {showMetrics ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            Metrics
          </button>
          
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
            title="Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
          
          <button
            onClick={downloadResults}
            className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
            title="Download Results"
            disabled={results.length === 0}
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Model Selection */}
      <div className="p-4 border-b border-white/20">
        <div className="flex items-center gap-2 mb-3">
          <Cpu className="w-4 h-4 text-emerald-400" />
          <span className="text-sm font-medium text-white">AI Model</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {models.map((model) => (
            <button
              key={model.id}
              onClick={() => setSelectedModel(model)}
              disabled={!model.isLoaded}
              className={`p-3 rounded-lg border transition-all ${
                selectedModel.id === model.id
                  ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                  : model.isLoaded
                  ? 'bg-white/5 border-white/20 text-white hover:bg-white/10'
                  : 'bg-gray-500/10 border-gray-500/20 text-gray-500 cursor-not-allowed'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                {getModelIcon(model.type)}
                <span className="font-medium text-sm">{model.name}</span>
                {!model.isLoaded && <Loader2 className="w-3 h-3 animate-spin" />}
              </div>
              <p className="text-xs opacity-80">{model.description}</p>
              {model.loadTime && (
                <div className="flex items-center gap-1 mt-2 text-xs opacity-60">
                  <Clock className="w-3 h-3" />
                  <span>Load: {formatProcessingTime(model.loadTime)}</span>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Settings Panel */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-b border-white/20 overflow-hidden"
          >
            <div className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <Sliders className="w-4 h-4 text-emerald-400" />
                <span className="text-sm font-medium text-white">Model Parameters</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Temperature</label>
                  <input
                    type="range"
                    min="0"
                    max="2"
                    step="0.1"
                    value={modelParameters.temperature}
                    onChange={(e) => setModelParameters(prev => ({ ...prev, temperature: parseFloat(e.target.value) }))}
                    className="w-full"
                  />
                  <span className="text-xs text-white">{modelParameters.temperature}</span>
                </div>
                
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Max Tokens</label>
                  <input
                    type="range"
                    min="100"
                    max="4000"
                    step="100"
                    value={modelParameters.maxTokens}
                    onChange={(e) => setModelParameters(prev => ({ ...prev, maxTokens: parseInt(e.target.value) }))}
                    className="w-full"
                  />
                  <span className="text-xs text-white">{modelParameters.maxTokens}</span>
                </div>
                
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Top P</label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={modelParameters.topP}
                    onChange={(e) => setModelParameters(prev => ({ ...prev, topP: parseFloat(e.target.value) }))}
                    className="w-full"
                  />
                  <span className="text-xs text-white">{modelParameters.topP}</span>
                </div>
                
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Frequency Penalty</label>
                  <input
                    type="range"
                    min="0"
                    max="2"
                    step="0.1"
                    value={modelParameters.frequencyPenalty}
                    onChange={(e) => setModelParameters(prev => ({ ...prev, frequencyPenalty: parseFloat(e.target.value) }))}
                    className="w-full"
                  />
                  <span className="text-xs text-white">{modelParameters.frequencyPenalty}</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Metrics Panel */}
      <AnimatePresence>
        {showMetrics && results.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-b border-white/20 overflow-hidden"
          >
            <div className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="w-4 h-4 text-emerald-400" />
                <span className="text-sm font-medium text-white">Performance Metrics</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white/5 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Activity className="w-4 h-4 text-blue-400" />
                    <span className="text-xs text-gray-400">Total Inferences</span>
                  </div>
                  <span className="text-lg font-semibold text-white">{results.length}</span>
                </div>
                
                <div className="bg-white/5 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="w-4 h-4 text-green-400" />
                    <span className="text-xs text-gray-400">Avg Processing</span>
                  </div>
                  <span className="text-lg font-semibold text-white">
                    {formatProcessingTime(averageProcessingTime)}
                  </span>
                </div>
                
                <div className="bg-white/5 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    <span className="text-xs text-gray-400">Total Tokens</span>
                  </div>
                  <span className="text-lg font-semibold text-white">{totalTokens.toLocaleString()}</span>
                </div>
                
                <div className="bg-white/5 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp className="w-4 h-4 text-orange-400" />
                    <span className="text-xs text-gray-400">Success Rate</span>
                  </div>
                  <span className="text-lg font-semibold text-white">100%</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input Section */}
      <div className="p-4 border-b border-white/20">
        <div className="flex items-center gap-2 mb-3">
          <Zap className="w-4 h-4 text-emerald-400" />
          <span className="text-sm font-medium text-white">Input Prompt</span>
        </div>
        
        <div className="flex gap-3">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Enter your ${selectedModel.type} prompt here...`}
            className="flex-1 bg-white/5 border border-white/20 rounded-lg p-3 text-white placeholder-gray-400 resize-none focus:outline-none focus:border-emerald-500/50"
            rows={3}
            disabled={isProcessing}
          />
          
          <div className="flex flex-col gap-2">
            <button
              onClick={runInference}
              disabled={!input.trim() || isProcessing || !selectedModel.isLoaded}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-500/20 text-emerald-300 rounded-lg hover:bg-emerald-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Play className="w-4 h-4" />
              )}
              <span className="text-sm">{isProcessing ? 'Processing...' : 'Run'}</span>
            </button>
            
            <button
              onClick={clearResults}
              disabled={results.length === 0}
              className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="text-sm">Clear</span>
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span className="text-sm font-medium text-white">Results ({results.length})</span>
          </div>
        </div>
        
        <div ref={resultsRef} className="space-y-4 max-h-96 overflow-y-auto">
          {results.map((result) => (
            <motion.div
              key={result.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/5 border border-white/20 rounded-lg p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-emerald-300">{result.model}</span>
                  <span className="text-xs text-gray-400">
                    {result.timestamp.toLocaleTimeString()}
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <Clock className="w-3 h-3" />
                    <span>{formatProcessingTime(result.processingTime)}</span>
                  </div>
                  
                  {result.confidence && (
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <TrendingUp className="w-3 h-3" />
                      <span>{(result.confidence * 100).toFixed(1)}%</span>
                    </div>
                  )}
                  
                  <div className="flex bg-white/10 rounded p-1">
                    <button
                      onClick={() => copyResult(result)}
                      className="p-1 text-gray-400 hover:text-white rounded transition-colors"
                      title="Copy"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => shareResult(result)}
                      className="p-1 text-gray-400 hover:text-white rounded transition-colors"
                      title="Share"
                    >
                      <Share2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <span className="text-xs text-gray-400 block mb-1">Input:</span>
                  <p className="text-sm text-white bg-white/5 rounded p-2">{result.input}</p>
                </div>
                
                <div>
                  <span className="text-xs text-gray-400 block mb-1">Output:</span>
                  <div className="text-sm text-white bg-white/5 rounded p-2">
                    {selectedModel.type === 'code' ? (
                      <pre className="font-mono text-xs overflow-x-auto">{result.output}</pre>
                    ) : (
                      <p>{result.output}</p>
                    )}
                  </div>
                </div>
                
                {result.tokens && (
                  <div className="flex items-center gap-4 text-xs text-gray-400">
                    <span>Input tokens: {result.tokens.input}</span>
                    <span>Output tokens: {result.tokens.output}</span>
                    <span>Total: {result.tokens.input + result.tokens.output}</span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
          
          {results.length === 0 && (
            <div className="text-center text-gray-500 py-8">
              <Brain className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No inference results yet</p>
              <p className="text-sm">Enter a prompt and click Run to see AI inference in action</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIInference;