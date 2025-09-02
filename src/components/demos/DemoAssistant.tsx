import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, 
  Send, 
  Bot, 
  User, 
  Minimize2, 
  Maximize2, 
  RotateCcw, 
  Copy, 
  ThumbsUp, 
  ThumbsDown,
  Sparkles,
  Code,
  HelpCircle,
  Lightbulb,
  Zap,
  X
} from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isTyping?: boolean;
  suggestions?: string[];
  codeSnippet?: string;
  helpful?: boolean | null;
}

interface DemoAssistantProps {
  projectId: string;
  projectTitle: string;
  isVisible: boolean;
  onToggle: () => void;
  className?: string;
}

const DemoAssistant: React.FC<DemoAssistantProps> = ({
  projectId,
  projectTitle,
  isVisible,
  onToggle,
  className = ''
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Predefined suggestions based on project context
  const quickSuggestions = [
    "How does this project work?",
    "Show me the key features",
    "Explain the code structure",
    "What technologies are used?",
    "How can I customize this?",
    "Show me similar projects"
  ];

  const welcomeMessage: Message = {
    id: 'welcome',
    type: 'assistant',
    content: `Hi! I'm your AI assistant for the ${projectTitle} demo. I can help you understand how this project works, explain the code, suggest improvements, or answer any questions you have. What would you like to know?`,
    timestamp: new Date(),
    suggestions: quickSuggestions.slice(0, 3)
  };

  useEffect(() => {
    if (isVisible && messages.length === 0) {
      setMessages([welcomeMessage]);
    }
  }, [isVisible, projectTitle]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const generateResponse = async (userMessage: string): Promise<Message> => {
    // Simulate AI response generation
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    const responses = {
      'how does this project work': {
        content: `This ${projectTitle} project demonstrates modern web development practices. It uses React with TypeScript for type safety, Framer Motion for smooth animations, and follows a component-based architecture. The project showcases responsive design principles and interactive user experiences.`,
        codeSnippet: `// Example component structure
const ProjectDemo: React.FC<Props> = ({ title, features }) => {
  const [isActive, setIsActive] = useState(false);
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="demo-container"
    >
      {/* Demo content */}
    </motion.div>
  );
};`
      },
      'key features': {
        content: `The key features of this project include:\n\n• Interactive user interface with smooth animations\n• Responsive design that works on all devices\n• Modern React hooks for state management\n• TypeScript for enhanced developer experience\n• Performance optimizations and lazy loading\n• Accessible design following WCAG guidelines`,
        suggestions: ['Tell me about the animations', 'How is it optimized?', 'Show accessibility features']
      },
      'code structure': {
        content: `The project follows a clean, modular architecture:\n\n📁 src/\n├── 📁 components/ (Reusable UI components)\n├── 📁 hooks/ (Custom React hooks)\n├── 📁 types/ (TypeScript definitions)\n├── 📁 utils/ (Helper functions)\n└── 📁 styles/ (CSS and styling)\n\nEach component is self-contained with its own types, styles, and logic.`,
        codeSnippet: `// Example hook usage
const useProjectDemo = (projectId: string) => {
  const [state, setState] = useState(initialState);
  
  useEffect(() => {
    // Initialize demo
  }, [projectId]);
  
  return { state, actions };
};`
      },
      'technologies': {
        content: `This project is built with modern web technologies:\n\n🔧 **Frontend:**\n• React 18 with TypeScript\n• Framer Motion for animations\n• Tailwind CSS for styling\n• Lucide React for icons\n\n⚡ **Build Tools:**\n• Vite for fast development\n• ESLint & Prettier for code quality\n• PostCSS for CSS processing`,
        suggestions: ['Why these technologies?', 'Show me the build process', 'Performance benefits']
      },
      'customize': {
        content: `You can customize this project in several ways:\n\n🎨 **Styling:**\n• Modify Tailwind classes\n• Update CSS custom properties\n• Change animation parameters\n\n⚙️ **Functionality:**\n• Add new features via props\n• Extend component interfaces\n• Create custom hooks\n\n🔧 **Configuration:**\n• Update build settings\n• Modify environment variables\n• Customize deployment options`,
        codeSnippet: `// Customization example
const customTheme = {
  colors: {
    primary: '#10b981', // emerald-500
    secondary: '#3b82f6', // blue-500
  },
  animations: {
    duration: 0.3,
    easing: 'ease-out'
  }
};`
      }
    };

    // Find best matching response
    const key = Object.keys(responses).find(k => 
      userMessage.toLowerCase().includes(k)
    ) as keyof typeof responses;

    const response = responses[key] || {
      content: `That's a great question about ${projectTitle}! While I don't have a specific answer for that, I can help you explore the project further. Try asking about the technologies used, key features, or how to customize the project.`,
      suggestions: quickSuggestions.slice(0, 3)
    };

    return {
      id: Date.now().toString(),
      type: 'assistant',
      content: response.content,
      timestamp: new Date(),
      suggestions: response.suggestions,
      codeSnippet: response.codeSnippet
    };
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    setIsTyping(true);

    try {
      const response = await generateResponse(userMessage.content);
      setMessages(prev => [...prev, response]);
    } catch (error) {
      const errorMessage: Message = {
        id: Date.now().toString(),
        type: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    inputRef.current?.focus();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const markHelpful = (messageId: string, helpful: boolean) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, helpful } : msg
    ));
  };

  const clearChat = () => {
    setMessages([welcomeMessage]);
  };

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      className={`fixed bottom-4 right-4 z-50 ${className}`}
    >
      <div className={`bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-2xl transition-all duration-300 ${
        isMinimized ? 'w-80 h-16' : 'w-96 h-[600px]'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/20">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Bot className="w-6 h-6 text-emerald-400" />
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full opacity-75"
              />
            </div>
            <div>
              <h3 className="font-semibold text-white">AI Assistant</h3>
              <p className="text-xs text-gray-400">Here to help with {projectTitle}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={clearChat}
              className="p-1 text-gray-400 hover:text-white rounded transition-colors"
              title="Clear chat"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-1 text-gray-400 hover:text-white rounded transition-colors"
              title={isMinimized ? 'Expand' : 'Minimize'}
            >
              {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
            </button>
            
            <button
              onClick={onToggle}
              className="p-1 text-gray-400 hover:text-white rounded transition-colors"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 h-[440px]">
              <AnimatePresence>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`flex gap-3 ${
                      message.type === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {message.type === 'assistant' && (
                      <div className="w-8 h-8 bg-emerald-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <Bot className="w-4 h-4 text-emerald-400" />
                      </div>
                    )}
                    
                    <div className={`max-w-[80%] ${
                      message.type === 'user'
                        ? 'bg-emerald-500/20 text-emerald-100'
                        : 'bg-white/10 text-white'
                    } rounded-lg p-3`}>
                      <div className="whitespace-pre-wrap text-sm">{message.content}</div>
                      
                      {message.codeSnippet && (
                        <div className="mt-3 bg-gray-900/50 rounded p-3 relative">
                          <button
                            onClick={() => copyToClipboard(message.codeSnippet!)}
                            className="absolute top-2 right-2 p-1 text-gray-400 hover:text-white rounded transition-colors"
                            title="Copy code"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                          <pre className="text-xs text-gray-300 overflow-x-auto">
                            <code>{message.codeSnippet}</code>
                          </pre>
                        </div>
                      )}
                      
                      {message.suggestions && (
                        <div className="mt-3 space-y-2">
                          <p className="text-xs text-gray-400">Suggested questions:</p>
                          {message.suggestions.map((suggestion, index) => (
                            <button
                              key={index}
                              onClick={() => handleSuggestionClick(suggestion)}
                              className="block w-full text-left text-xs bg-white/10 hover:bg-white/20 rounded p-2 transition-colors"
                            >
                              {suggestion}
                            </button>
                          ))}
                        </div>
                      )}
                      
                      {message.type === 'assistant' && message.id !== 'welcome' && (
                        <div className="flex items-center gap-2 mt-3 pt-2 border-t border-white/10">
                          <span className="text-xs text-gray-400">Was this helpful?</span>
                          <button
                            onClick={() => markHelpful(message.id, true)}
                            className={`p-1 rounded transition-colors ${
                              message.helpful === true
                                ? 'text-green-400 bg-green-500/20'
                                : 'text-gray-400 hover:text-green-400'
                            }`}
                          >
                            <ThumbsUp className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => markHelpful(message.id, false)}
                            className={`p-1 rounded transition-colors ${
                              message.helpful === false
                                ? 'text-red-400 bg-red-500/20'
                                : 'text-gray-400 hover:text-red-400'
                            }`}
                          >
                            <ThumbsDown className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                      
                      <div className="text-xs text-gray-500 mt-2">
                        {message.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                    
                    {message.type === 'user' && (
                      <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="w-4 h-4 text-blue-400" />
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-3"
                >
                  <div className="w-8 h-8 bg-emerald-500/20 rounded-full flex items-center justify-center">
                    <Bot className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="bg-white/10 rounded-lg p-3">
                    <div className="flex gap-1">
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                        className="w-2 h-2 bg-emerald-400 rounded-full"
                      />
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                        className="w-2 h-2 bg-emerald-400 rounded-full"
                      />
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                        className="w-2 h-2 bg-emerald-400 rounded-full"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-white/20">
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything about this project..."
                  className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50"
                  disabled={isLoading}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isLoading}
                  className="p-2 bg-emerald-500/20 text-emerald-300 rounded-lg hover:bg-emerald-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              
              {/* Quick Actions */}
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => handleSuggestionClick('How does this work?')}
                  className="flex items-center gap-1 px-2 py-1 bg-white/10 hover:bg-white/20 rounded text-xs text-gray-300 transition-colors"
                >
                  <HelpCircle className="w-3 h-3" />
                  How it works
                </button>
                <button
                  onClick={() => handleSuggestionClick('Show me the code')}
                  className="flex items-center gap-1 px-2 py-1 bg-white/10 hover:bg-white/20 rounded text-xs text-gray-300 transition-colors"
                >
                  <Code className="w-3 h-3" />
                  Code
                </button>
                <button
                  onClick={() => handleSuggestionClick('Give me tips')}
                  className="flex items-center gap-1 px-2 py-1 bg-white/10 hover:bg-white/20 rounded text-xs text-gray-300 transition-colors"
                >
                  <Lightbulb className="w-3 h-3" />
                  Tips
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
};

export default DemoAssistant;