import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, Bot, User, Sparkles, Building, Users, DollarSign, Calendar, CheckCircle, AlertCircle } from 'lucide-react';
import { strayDogAI } from '../../ai';
import { useAnalytics } from '../../hooks/useAnalytics';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  metadata?: {
    qualification_score?: number;
    lead_stage?: 'initial' | 'qualifying' | 'qualified' | 'unqualified';
    next_action?: string;
  };
}

interface LeadData {
  name?: string;
  organization?: string;
  role?: string;
  budget?: string;
  timeline?: string;
  challenges?: string[];
  interests?: string[];
  qualification_score: number;
  stage: 'initial' | 'qualifying' | 'qualified' | 'unqualified';
}

const AILeadQualificationChatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: 'Hello! I\'m your AI assistant for StrayDog Syndications. I\'m here to learn about your justice reform technology needs and see how we can help transform your organization. What brings you here today?',
      timestamp: new Date(),
      metadata: {
        qualification_score: 0,
        lead_stage: 'initial',
        next_action: 'gather_initial_info'
      }
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [leadData, setLeadData] = useState<LeadData>({
    qualification_score: 0,
    stage: 'initial'
  });
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { trackEvent } = useAnalytics();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const qualifyLead = (userMessage: string, conversationHistory: Message[]): Partial<LeadData> => {
    const message = userMessage.toLowerCase();
    let score = leadData.qualification_score;
    const updates: Partial<LeadData> = {};

    // Budget indicators
    if (message.includes('budget') || message.includes('funding') || message.includes('million') || message.includes('thousand')) {
      score += 20;
      if (message.includes('million')) score += 10;
    }

    // Urgency indicators
    if (message.includes('urgent') || message.includes('asap') || message.includes('immediately') || message.includes('soon')) {
      score += 15;
    }

    // Authority indicators
    if (message.includes('director') || message.includes('ceo') || message.includes('manager') || message.includes('lead')) {
      score += 15;
    }

    // Justice reform specific needs
    if (message.includes('justice') || message.includes('reform') || message.includes('legal') || message.includes('court')) {
      score += 25;
    }

    // Technology readiness
    if (message.includes('ai') || message.includes('automation') || message.includes('digital') || message.includes('technology')) {
      score += 10;
    }

    updates.qualification_score = Math.min(score, 100);

    // Determine stage based on score
    if (score >= 70) {
      updates.stage = 'qualified';
    } else if (score >= 40) {
      updates.stage = 'qualifying';
    } else if (score < 20 && conversationHistory.length > 6) {
      updates.stage = 'unqualified';
    } else {
      updates.stage = 'qualifying';
    }

    return updates;
  };

  const generateBotResponse = async (userMessage: string): Promise<string> => {
    const conversationContext = messages.slice(-5).map(m => `${m.type}: ${m.content}`).join('\n');
    
    const prompt = `You are a lead qualification chatbot for StrayDog Syndications, a justice reform technology company. 
    
    Current conversation context:
    ${conversationContext}
    User: ${userMessage}
    
    Lead qualification data:
    - Current score: ${leadData.qualification_score}/100
    - Stage: ${leadData.stage}
    - Organization: ${leadData.organization || 'Unknown'}
    - Role: ${leadData.role || 'Unknown'}
    
    Your goals:
    1. Qualify leads for justice reform technology solutions
    2. Gather information about budget, timeline, authority, and specific needs
    3. Showcase our AI-powered solutions for criminal justice, legal aid, and reform initiatives
    4. Guide qualified leads toward scheduling a consultation
    
    Key qualification questions to explore:
    - What justice reform challenges are they facing?
    - What's their budget range for technology solutions?
    - What's their timeline for implementation?
    - Who makes technology decisions in their organization?
    - Have they used AI/automation in justice processes before?
    
    Respond naturally and conversationally while gathering qualification information. If the lead seems qualified (score 70+), suggest scheduling a consultation. Keep responses concise (2-3 sentences max).`;

    try {
      const response = await strayDogAI.generateContent(
        'business',
        'analysis',
        prompt,
        'demo-user',
        'user',
        'enterprise'
      );

      if (response.success && response.data) {
        return response.data;
      } else {
        throw new Error(response.error?.message || 'Failed to generate response');
      }
    } catch (error) {
      console.error('Error generating bot response:', error);
      return "I apologize, but I'm having trouble connecting right now. Could you please try again? I'm here to help you explore how our justice reform technology can benefit your organization.";
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Update lead qualification
    const leadUpdates = qualifyLead(inputMessage, messages);
    setLeadData(prev => ({ ...prev, ...leadUpdates }));

    trackEvent('chatbot_user_message', {
      message_length: inputMessage.length,
      qualification_score: leadUpdates.qualification_score,
      lead_stage: leadUpdates.stage
    });

    try {
      const botResponse = await generateBotResponse(inputMessage);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: botResponse,
        timestamp: new Date(),
        metadata: {
          qualification_score: leadUpdates.qualification_score,
          lead_stage: leadUpdates.stage,
          next_action: leadUpdates.stage === 'qualified' ? 'schedule_consultation' : 'continue_qualifying'
        }
      };

      setMessages(prev => [...prev, botMessage]);
      
      trackEvent('chatbot_bot_response', {
        response_length: botResponse.length,
        qualification_score: leadUpdates.qualification_score,
        lead_stage: leadUpdates.stage
      });
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getQualificationColor = (score: number) => {
    if (score >= 70) return 'text-green-400';
    if (score >= 40) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getStageIcon = (stage: string) => {
    switch (stage) {
      case 'qualified': return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'qualifying': return <AlertCircle className="w-4 h-4 text-yellow-400" />;
      case 'unqualified': return <AlertCircle className="w-4 h-4 text-red-400" />;
      default: return <MessageCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  if (isMinimized) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsMinimized(false)}
          aria-label="Open Lead Qualification Chatbot"
          title="Click to open AI Lead Assistant"
          className="bg-gradient-to-r from-hunter-green-500 to-hunter-green-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-96 h-[600px] bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-hunter-green-500 to-hunter-green-600 p-4 rounded-t-2xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-full">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-white font-semibold">AI Lead Assistant</h3>
            <div className="flex items-center gap-2 text-xs text-white/80">
              {getStageIcon(leadData.stage)}
              <span className={`font-medium ${getQualificationColor(leadData.qualification_score)}`}>
                Score: {leadData.qualification_score}/100
              </span>
            </div>
          </div>
        </div>
        <button
          onClick={() => setIsMinimized(true)}
          aria-label="Minimize Chatbot"
          title="Minimize AI Lead Assistant"
          className="text-white/80 hover:text-white transition-colors"
        >
          <MessageCircle className="w-5 h-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-start gap-3 ${message.type === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div className={`p-2 rounded-full ${
              message.type === 'user' 
                ? 'bg-hunter-green-500/20' 
                : 'bg-white/10'
            }`}>
              {message.type === 'user' ? (
                <User className="w-4 h-4 text-hunter-green-400" />
              ) : (
                <Bot className="w-4 h-4 text-white" />
              )}
            </div>
            <div className={`max-w-[80%] p-3 rounded-2xl ${
              message.type === 'user'
                ? 'bg-hunter-green-500/20 text-white ml-auto'
                : 'bg-white/10 text-white'
            }`}>
              <p className="text-sm">{message.content}</p>
              <div className="text-xs text-gray-400 mt-1">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex items-start gap-3">
            <div className="p-2 bg-white/10 rounded-full">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="bg-white/10 text-white p-3 rounded-2xl">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-hunter-green-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-hunter-green-400 rounded-full animate-bounce [animation-delay:0.1s]"></div>
                <div className="w-2 h-2 bg-hunter-green-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Qualification Status */}
      {leadData.stage !== 'initial' && (
        <div className="px-4 py-2 border-t border-white/10">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              {getStageIcon(leadData.stage)}
              <span className="text-white/80 capitalize">{leadData.stage}</span>
            </div>
            <div className="flex items-center gap-4 text-white/60">
              {leadData.organization && (
                <div className="flex items-center gap-1">
                  <Building className="w-3 h-3" />
                  <span>{leadData.organization}</span>
                </div>
              )}
              {leadData.budget && (
                <div className="flex items-center gap-1">
                  <DollarSign className="w-3 h-3" />
                  <span>{leadData.budget}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t border-white/10">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-hunter-green-500 text-sm"
            disabled={isTyping}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isTyping}
            aria-label="Send Message"
            title="Send message to AI Lead Assistant"
            className="bg-gradient-to-r from-hunter-green-500 to-hunter-green-600 text-white p-2 rounded-lg hover:from-hunter-green-600 hover:to-hunter-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Quick Actions for Qualified Leads */}
      {leadData.stage === 'qualified' && (
        <div className="p-4 bg-hunter-green-500/10 border-t border-hunter-green-500/20">
          <div className="text-xs text-hunter-green-400 mb-2 font-medium">✨ Qualified Lead - Next Steps:</div>
          <div className="flex gap-2">
            <button className="flex-1 bg-hunter-green-500/20 text-hunter-green-400 px-3 py-2 rounded-lg text-xs hover:bg-hunter-green-500/30 transition-colors flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              Schedule Call
            </button>
            <button className="flex-1 bg-hunter-green-500/20 text-hunter-green-400 px-3 py-2 rounded-lg text-xs hover:bg-hunter-green-500/30 transition-colors flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Send Proposal
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AILeadQualificationChatbot;