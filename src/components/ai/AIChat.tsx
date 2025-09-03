// AI Chat Component with Glassmorphic Design

import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Sparkles, Brain, Zap } from 'lucide-react';
import { strayDogAI } from '../../ai';
import { DomainType, UserRole, RateLimitTier } from '../../shared/types/ai';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  domain?: DomainType;
  isTyping?: boolean;
}

interface AIChatProps {
  domain: DomainType;
  userId: string;
  userRole?: UserRole;
  tier?: RateLimitTier;
  className?: string;
  placeholder?: string;
  maxHeight?: string;
}

export const AIChat: React.FC<AIChatProps> = ({
  domain,
  userId,
  userRole = 'user',
  tier = 'free',
  className = '',
  placeholder = 'Ask me anything...',
  maxHeight = '600px'
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    initializeAI();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const initializeAI = async () => {
    try {
      await strayDogAI.initialize();
      setIsInitialized(true);
      
      // Add welcome message
      const welcomeMessage: Message = {
        id: 'welcome',
        content: `Welcome to the ${domain} AI assistant! I'm here to help you with ${getDomainDescription(domain)}. How can I assist you today?`,
        role: 'assistant',
        timestamp: new Date(),
        domain
      };
      setMessages([welcomeMessage]);
    } catch (error) {
      console.error('Failed to initialize AI:', error);
    }
  };

  const getDomainDescription = (domain: DomainType): string => {
    switch (domain) {
      case 'corporate':
        return 'executive content, leadership profiles, and strategic communications';
      case 'technical':
        return 'code generation, technical documentation, and architecture design';
      case 'business':
        return 'lead qualification, ROI analysis, and business strategy';
      case 'justice':
        return 'impact metrics, policy analysis, and reform strategies';
      default:
        return 'AI-powered assistance';
    }
  };

  const getDomainIcon = (domain: DomainType) => {
    switch (domain) {
      case 'corporate':
        return <Sparkles className="w-4 h-4" />;
      case 'technical':
        return <Brain className="w-4 h-4" />;
      case 'business':
        return <Zap className="w-4 h-4" />;
      case 'justice':
        return <Bot className="w-4 h-4" />;
      default:
        return <Bot className="w-4 h-4" />;
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || !isInitialized) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input.trim(),
      role: 'user',
      timestamp: new Date(),
      domain
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Add typing indicator
    const typingMessage: Message = {
      id: 'typing',
      content: '',
      role: 'assistant',
      timestamp: new Date(),
      domain,
      isTyping: true
    };
    setMessages(prev => [...prev, typingMessage]);

    try {
      const response = await strayDogAI.generateContent(
        domain,
        'analysis',
        userMessage.content,
        userId,
        userRole,
        tier
      );

      // Remove typing indicator
      setMessages(prev => prev.filter(msg => msg.id !== 'typing'));

      if (response.success && response.data) {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: response.data,
          role: 'assistant',
          timestamp: new Date(),
          domain
        };
        setMessages(prev => [...prev, assistantMessage]);

        // Update context
        await strayDogAI.updateUserContext(
          userId,
          domain,
          userMessage.content,
          response.data
        );
      } else {
        throw new Error(response.error?.message || 'Failed to generate response');
      }
    } catch (error) {
      // Remove typing indicator
      setMessages(prev => prev.filter(msg => msg.id !== 'typing'));
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `I apologize, but I encountered an error: ${error.message}. Please try again.`,
        role: 'assistant',
        timestamp: new Date(),
        domain
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (timestamp: Date): string => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-white/10 bg-gradient-to-r from-emerald-900/20 to-green-900/20 backdrop-blur-sm">
        <div className="flex items-center gap-2 text-emerald-300">
          {getDomainIcon(domain)}
          <h3 className="font-semibold capitalize">{domain} AI Assistant</h3>
        </div>
        <div className="ml-auto text-xs text-emerald-400/70">
          {isInitialized ? 'Online' : 'Initializing...'}
        </div>
      </div>

      {/* Messages */}
      <div 
        className="flex-1 overflow-y-auto p-4 space-y-4"
        style={{ maxHeight }}
      >
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {message.role === 'assistant' && (
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center text-white">
                {message.isTyping ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  getDomainIcon(domain)
                )}
              </div>
            )}
            
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                message.role === 'user'
                  ? 'bg-gradient-to-br from-emerald-600 to-green-700 text-white ml-auto'
                  : 'bg-white/10 backdrop-blur-sm border border-white/20 text-white'
              }`}
            >
              {message.isTyping ? (
                <div className="flex items-center gap-2 text-emerald-300">
                  <span className="text-sm">AI is thinking</span>
                  <div className="flex gap-1">
                    <div className="w-1 h-1 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-1 h-1 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-1 h-1 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              ) : (
                <>
                  <div className="text-sm leading-relaxed whitespace-pre-wrap">
                    {message.content}
                  </div>
                  <div className={`text-xs mt-2 opacity-70 ${
                    message.role === 'user' ? 'text-emerald-100' : 'text-emerald-300'
                  }`}>
                    {formatTime(message.timestamp)}
                  </div>
                </>
              )}
            </div>

            {message.role === 'user' && (
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-emerald-700 to-green-800 flex items-center justify-center text-white">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-white/10">
        <div className="flex gap-3 items-end">
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={placeholder}
              disabled={isLoading || !isInitialized}
              className="w-full px-4 py-3 pr-12 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-emerald-300/50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-emerald-400/50">
              {getDomainIcon(domain)}
            </div>
          </div>
          <button
            type="submit"
            disabled={!input.trim() || isLoading || !isInitialized}
            className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-600 to-green-700 hover:from-emerald-500 hover:to-green-600 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed flex items-center justify-center text-white transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AIChat;