import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  Sparkles, 
  TrendingUp, 
  Clock, 
  Star, 
  Tag, 
  Search, 
  ArrowRight, 
  Lightbulb, 
  Target, 
  Zap, 
  Eye, 
  Heart, 
  Share2, 
  Code, 
  Image, 
  FileText, 
  Play, 
  Filter, 
  Shuffle, 
  RefreshCw, 
  ChevronRight, 
  ChevronDown, 
  ChevronUp, 
  X, 
  Plus, 
  Minus, 
  Info, 
  HelpCircle, 
  MessageSquare, 
  Bot, 
  User, 
  Send, 
  Loader2, 
  CheckCircle, 
  AlertCircle
} from 'lucide-react';

interface Suggestion {
  id: string;
  text: string;
  type: 'search' | 'filter' | 'category' | 'trending' | 'personalized' | 'ai-generated';
  confidence: number;
  category?: string;
  tags?: string[];
  description?: string;
  icon?: React.ReactNode;
  metadata?: {
    popularity?: number;
    recentUse?: Date;
    userRelevance?: number;
    aiReasoning?: string;
  };
}

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  suggestions?: Suggestion[];
}

interface SearchSuggestionsProps {
  query: string;
  onSuggestionSelect: (suggestion: Suggestion) => void;
  onQueryUpdate: (query: string) => void;
  searchHistory?: string[];
  userPreferences?: {
    categories: string[];
    technologies: string[];
    difficulty: string;
  };
  isVisible?: boolean;
  className?: string;
}

const SearchSuggestions: React.FC<SearchSuggestionsProps> = ({
  query,
  onSuggestionSelect,
  onQueryUpdate,
  searchHistory = [],
  userPreferences,
  isVisible = true,
  className = ''
}) => {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [expandedSuggestion, setExpandedSuggestion] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Generate AI-powered suggestions
  const generateSuggestions = useCallback(async () => {
    setIsLoading(true);
    
    try {
      // Simulate AI processing delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newSuggestions: Suggestion[] = [];
      
      // Recent searches
      if (searchHistory.length > 0) {
        searchHistory.slice(0, 3).forEach((search, index) => {
          newSuggestions.push({
            id: `recent-${index}`,
            text: search,
            type: 'search',
            confidence: 0.8 - (index * 0.1),
            icon: <Clock className="w-4 h-4" />,
            metadata: {
              recentUse: new Date(Date.now() - (index * 24 * 60 * 60 * 1000))
            }
          });
        });
      }
      
      // Trending searches
      const trendingSuggestions: Suggestion[] = [
        {
          id: 'trending-1',
          text: 'AI art generation techniques',
          type: 'trending',
          confidence: 0.95,
          category: 'gallery',
          tags: ['AI', 'Art', 'Generation'],
          description: 'Explore cutting-edge AI art creation methods',
          icon: <TrendingUp className="w-4 h-4" />,
          metadata: {
            popularity: 1250,
            aiReasoning: 'High engagement with AI art content recently'
          }
        },
        {
          id: 'trending-2',
          text: 'React performance optimization',
          type: 'trending',
          confidence: 0.9,
          category: 'projects',
          tags: ['React', 'Performance', 'Optimization'],
          description: 'Learn advanced React optimization techniques',
          icon: <Zap className="w-4 h-4" />,
          metadata: {
            popularity: 980,
            aiReasoning: 'Popular topic among developers this week'
          }
        },
        {
          id: 'trending-3',
          text: 'Interactive data visualization',
          type: 'trending',
          confidence: 0.85,
          category: 'demos',
          tags: ['Data', 'Visualization', 'Interactive'],
          description: 'Discover engaging data visualization projects',
          icon: <Eye className="w-4 h-4" />,
          metadata: {
            popularity: 750,
            aiReasoning: 'Growing interest in data storytelling'
          }
        }
      ];
      
      newSuggestions.push(...trendingSuggestions);
      
      // Personalized suggestions based on user preferences
      if (userPreferences) {
        const personalizedSuggestions: Suggestion[] = [];
        
        userPreferences.categories.forEach(category => {
          personalizedSuggestions.push({
            id: `personalized-${category}`,
            text: `Latest ${category} projects`,
            type: 'personalized',
            confidence: 0.9,
            category,
            description: `Discover new ${category} content tailored for you`,
            icon: <Star className="w-4 h-4" />,
            metadata: {
              userRelevance: 0.95,
              aiReasoning: `Based on your interest in ${category}`
            }
          });
        });
        
        userPreferences.technologies.forEach(tech => {
          personalizedSuggestions.push({
            id: `tech-${tech}`,
            text: `${tech} tutorials and examples`,
            type: 'personalized',
            confidence: 0.85,
            tags: [tech],
            description: `Explore ${tech} resources and projects`,
            icon: <Code className="w-4 h-4" />,
            metadata: {
              userRelevance: 0.9,
              aiReasoning: `Matches your ${tech} expertise level`
            }
          });
        });
        
        newSuggestions.push(...personalizedSuggestions.slice(0, 3));
      }
      
      // Query-specific AI suggestions
      if (query.trim()) {
        const aiSuggestions = generateQuerySpecificSuggestions(query);
        newSuggestions.push(...aiSuggestions);
      }
      
      // Category filters
      const categoryFilters: Suggestion[] = [
        {
          id: 'filter-projects',
          text: 'Filter by Projects',
          type: 'filter',
          confidence: 0.8,
          category: 'projects',
          icon: <Code className="w-4 h-4" />,
          description: 'Show only project-related content'
        },
        {
          id: 'filter-gallery',
          text: 'Filter by AI Gallery',
          type: 'filter',
          confidence: 0.8,
          category: 'gallery',
          icon: <Image className="w-4 h-4" />,
          description: 'Show only AI artwork and gallery items'
        },
        {
          id: 'filter-demos',
          text: 'Filter by Interactive Demos',
          type: 'filter',
          confidence: 0.8,
          category: 'demos',
          icon: <Play className="w-4 h-4" />,
          description: 'Show only interactive demonstrations'
        }
      ];
      
      newSuggestions.push(...categoryFilters);
      
      setSuggestions(newSuggestions);
    } catch (error) {
      console.error('Failed to generate suggestions:', error);
    } finally {
      setIsLoading(false);
    }
  }, [query, searchHistory, userPreferences]);

  const generateQuerySpecificSuggestions = (searchQuery: string): Suggestion[] => {
    const lowerQuery = searchQuery.toLowerCase();
    const suggestions: Suggestion[] = [];
    
    // AI-powered query expansion
    if (lowerQuery.includes('ai') || lowerQuery.includes('machine learning')) {
      suggestions.push({
        id: 'ai-expand-1',
        text: `${searchQuery} with neural networks`,
        type: 'ai-generated',
        confidence: 0.9,
        icon: <Brain className="w-4 h-4" />,
        metadata: {
          aiReasoning: 'Neural networks are commonly associated with AI projects'
        }
      });
      
      suggestions.push({
        id: 'ai-expand-2',
        text: `${searchQuery} computer vision`,
        type: 'ai-generated',
        confidence: 0.85,
        icon: <Eye className="w-4 h-4" />,
        metadata: {
          aiReasoning: 'Computer vision is a popular AI application'
        }
      });
    }
    
    if (lowerQuery.includes('react') || lowerQuery.includes('javascript')) {
      suggestions.push({
        id: 'react-expand-1',
        text: `${searchQuery} TypeScript`,
        type: 'ai-generated',
        confidence: 0.9,
        icon: <Code className="w-4 h-4" />,
        metadata: {
          aiReasoning: 'TypeScript is commonly used with React for type safety'
        }
      });
      
      suggestions.push({
        id: 'react-expand-2',
        text: `${searchQuery} hooks patterns`,
        type: 'ai-generated',
        confidence: 0.85,
        icon: <Zap className="w-4 h-4" />,
        metadata: {
          aiReasoning: 'React hooks are essential for modern React development'
        }
      });
    }
    
    if (lowerQuery.includes('design') || lowerQuery.includes('ui')) {
      suggestions.push({
        id: 'design-expand-1',
        text: `${searchQuery} user experience`,
        type: 'ai-generated',
        confidence: 0.9,
        icon: <Heart className="w-4 h-4" />,
        metadata: {
          aiReasoning: 'UX is crucial for effective design'
        }
      });
    }
    
    return suggestions;
  };

  useEffect(() => {
    if (isVisible) {
      generateSuggestions();
    }
  }, [isVisible, generateSuggestions]);

  const handleChatSubmit = async () => {
    if (!chatInput.trim()) return;
    
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: chatInput.trim(),
      timestamp: new Date()
    };
    
    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');
    setIsChatLoading(true);
    
    try {
      // Simulate Claude AI response
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: generateClaudeResponse(userMessage.content),
        timestamp: new Date(),
        suggestions: generateChatSuggestions(userMessage.content)
      };
      
      setChatMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
    } finally {
      setIsChatLoading(false);
    }
  };

  const generateClaudeResponse = (userInput: string): string => {
    const lowerInput = userInput.toLowerCase();
    
    if (lowerInput.includes('help') || lowerInput.includes('how')) {
      return "I'd be happy to help you find what you're looking for! I can suggest relevant projects, AI artwork, interactive demos, or help you refine your search. What specific area interests you most?";
    }
    
    if (lowerInput.includes('ai') || lowerInput.includes('machine learning')) {
      return "Great choice! I can show you AI-related projects including machine learning models, neural network implementations, and AI art generation. Would you like to see projects, gallery items, or interactive demos?";
    }
    
    if (lowerInput.includes('react') || lowerInput.includes('javascript')) {
      return "Excellent! I have many React and JavaScript projects to show you. These include component libraries, full-stack applications, and interactive demos. What type of React content are you most interested in?";
    }
    
    if (lowerInput.includes('design') || lowerInput.includes('ui')) {
      return "Perfect! I can help you explore UI/UX design projects, design systems, and visual components. Are you looking for inspiration, code examples, or design patterns?";
    }
    
    return "I understand you're looking for something specific. Based on your query, I can suggest relevant content from projects, AI gallery, or interactive demos. Let me know if you'd like me to focus on a particular area!";
  };

  const generateChatSuggestions = (userInput: string): Suggestion[] => {
    const lowerInput = userInput.toLowerCase();
    const suggestions: Suggestion[] = [];
    
    if (lowerInput.includes('ai')) {
      suggestions.push(
        {
          id: 'chat-ai-1',
          text: 'Show me AI art gallery',
          type: 'ai-generated',
          confidence: 0.95,
          icon: <Image className="w-4 h-4" />
        },
        {
          id: 'chat-ai-2',
          text: 'Find machine learning projects',
          type: 'ai-generated',
          confidence: 0.9,
          icon: <Brain className="w-4 h-4" />
        }
      );
    }
    
    if (lowerInput.includes('react')) {
      suggestions.push(
        {
          id: 'chat-react-1',
          text: 'React component examples',
          type: 'ai-generated',
          confidence: 0.9,
          icon: <Code className="w-4 h-4" />
        },
        {
          id: 'chat-react-2',
          text: 'Interactive React demos',
          type: 'ai-generated',
          confidence: 0.85,
          icon: <Play className="w-4 h-4" />
        }
      );
    }
    
    return suggestions;
  };

  const filteredSuggestions = selectedCategory === 'all' 
    ? suggestions 
    : suggestions.filter(s => s.category === selectedCategory || s.type === 'filter');

  const getSuggestionTypeColor = (type: string) => {
    switch (type) {
      case 'trending':
        return 'text-orange-400';
      case 'personalized':
        return 'text-purple-400';
      case 'ai-generated':
        return 'text-emerald-400';
      case 'filter':
        return 'text-blue-400';
      default:
        return 'text-gray-400';
    }
  };

  const getSuggestionTypeIcon = (type: string) => {
    switch (type) {
      case 'trending':
        return <TrendingUp className="w-3 h-3" />;
      case 'personalized':
        return <Star className="w-3 h-3" />;
      case 'ai-generated':
        return <Sparkles className="w-3 h-3" />;
      case 'filter':
        return <Filter className="w-3 h-3" />;
      default:
        return <Search className="w-3 h-3" />;
    }
  };

  if (!isVisible) return null;

  return (
    <div className={`${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-emerald-400" />
          <h3 className="text-lg font-semibold text-white">AI Search Assistant</h3>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowChat(!showChat)}
            className={`p-2 rounded-lg transition-colors ${
              showChat ? 'bg-emerald-500/20 text-emerald-300' : 'text-gray-400 hover:text-white hover:bg-white/10'
            }`}
            title="Chat with Claude"
          >
            <MessageSquare className="w-4 h-4" />
          </button>
          
          <button
            onClick={generateSuggestions}
            disabled={isLoading}
            className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors disabled:opacity-50"
            title="Refresh suggestions"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-4">
        {['all', 'projects', 'gallery', 'demos', 'blog'].map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-3 py-1 rounded-full text-sm transition-colors ${
              selectedCategory === category
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50'
                : 'bg-white/10 text-gray-400 hover:text-white border border-white/20'
            }`}
          >
            {category === 'all' ? 'All' : category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>

      {/* Chat Interface */}
      <AnimatePresence>
        {showChat && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-white/5 border border-white/20 rounded-xl p-4 mb-4 overflow-hidden"
          >
            <div className="flex items-center gap-2 mb-3">
              <Bot className="w-4 h-4 text-emerald-400" />
              <span className="text-sm font-medium text-white">Chat with Claude</span>
            </div>
            
            {/* Chat Messages */}
            <div className="max-h-48 overflow-y-auto mb-3 space-y-2">
              {chatMessages.length === 0 && (
                <div className="text-center py-4">
                  <p className="text-gray-400 text-sm">Ask me anything about the portfolio content!</p>
                </div>
              )}
              
              {chatMessages.map((message) => (
                <div key={message.id} className={`flex gap-2 ${
                  message.type === 'user' ? 'justify-end' : 'justify-start'
                }`}>
                  <div className={`max-w-xs p-2 rounded-lg text-sm ${
                    message.type === 'user'
                      ? 'bg-emerald-500/20 text-emerald-100'
                      : 'bg-white/10 text-white'
                  }`}>
                    <p>{message.content}</p>
                    
                    {message.suggestions && message.suggestions.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {message.suggestions.map((suggestion) => (
                          <button
                            key={suggestion.id}
                            onClick={() => onSuggestionSelect(suggestion)}
                            className="block w-full text-left p-1 rounded text-xs bg-white/10 hover:bg-white/20 transition-colors"
                          >
                            {suggestion.text}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {isChatLoading && (
                <div className="flex justify-start">
                  <div className="bg-white/10 p-2 rounded-lg">
                    <Loader2 className="w-4 h-4 text-emerald-400 animate-spin" />
                  </div>
                </div>
              )}
            </div>
            
            {/* Chat Input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleChatSubmit()}
                placeholder="Ask about projects, AI art, demos..."
                className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-400 focus:outline-none focus:border-emerald-500/50"
              />
              
              <button
                onClick={handleChatSubmit}
                disabled={!chatInput.trim() || isChatLoading}
                className="p-2 bg-emerald-500/20 text-emerald-300 rounded-lg hover:bg-emerald-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Suggestions List */}
      <div className="space-y-2">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <Loader2 className="w-6 h-6 text-emerald-400 animate-spin mx-auto mb-2" />
              <p className="text-sm text-gray-400">Generating AI suggestions...</p>
            </div>
          </div>
        ) : (
          <AnimatePresence>
            {filteredSuggestions.map((suggestion, index) => (
              <motion.div
                key={suggestion.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.05 }}
                className="group"
              >
                <div className="bg-white/5 border border-white/20 rounded-lg p-3 hover:border-emerald-500/50 transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => onSuggestionSelect(suggestion)}
                      className="flex-1 flex items-center gap-3 text-left"
                    >
                      <div className="flex items-center gap-2">
                        <div className={`${getSuggestionTypeColor(suggestion.type)}`}>
                          {suggestion.icon || getSuggestionTypeIcon(suggestion.type)}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-white group-hover:text-emerald-300 transition-colors">
                              {suggestion.text}
                            </span>
                            
                            <div className="flex items-center gap-1">
                              <div className="w-8 bg-white/20 rounded-full h-1">
                                <div 
                                  className="h-full bg-emerald-400 rounded-full transition-all"
                                  style={{ width: `${suggestion.confidence * 100}%` }}
                                />
                              </div>
                              <span className="text-xs text-gray-400">
                                {Math.round(suggestion.confidence * 100)}%
                              </span>
                            </div>
                          </div>
                          
                          {suggestion.description && (
                            <p className="text-xs text-gray-400 mt-1">
                              {suggestion.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </button>
                    
                    {suggestion.metadata?.aiReasoning && (
                      <button
                        onClick={() => setExpandedSuggestion(
                          expandedSuggestion === suggestion.id ? null : suggestion.id
                        )}
                        className="p-1 text-gray-400 hover:text-white rounded transition-colors"
                        title="AI Reasoning"
                      >
                        <Info className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  
                  {/* Tags */}
                  {suggestion.tags && suggestion.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {suggestion.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-white/10 rounded text-xs text-gray-300"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  {/* AI Reasoning */}
                  <AnimatePresence>
                    {expandedSuggestion === suggestion.id && suggestion.metadata?.aiReasoning && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="mt-2 p-2 bg-emerald-500/10 border border-emerald-500/20 rounded text-xs text-emerald-300 overflow-hidden"
                      >
                        <div className="flex items-center gap-1 mb-1">
                          <Brain className="w-3 h-3" />
                          <span className="font-medium">AI Reasoning:</span>
                        </div>
                        <p>{suggestion.metadata.aiReasoning}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
        
        {filteredSuggestions.length === 0 && !isLoading && (
          <div className="text-center py-8">
            <Search className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-400">No suggestions available</p>
            <button
              onClick={generateSuggestions}
              className="mt-2 text-emerald-400 hover:text-emerald-300 text-sm transition-colors"
            >
              Generate new suggestions
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchSuggestions;