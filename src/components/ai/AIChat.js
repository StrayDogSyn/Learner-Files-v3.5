import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
// AI Chat Component with Glassmorphic Design
import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Sparkles, Brain, Zap } from 'lucide-react';
import { strayDogAI } from '../../ai';
export const AIChat = ({ domain, userId, userRole = 'user', tier = 'free', className = '', placeholder = 'Ask me anything...', maxHeight = '600px' }) => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);
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
            const welcomeMessage = {
                id: 'welcome',
                content: `Welcome to the ${domain} AI assistant! I'm here to help you with ${getDomainDescription(domain)}. How can I assist you today?`,
                role: 'assistant',
                timestamp: new Date(),
                domain
            };
            setMessages([welcomeMessage]);
        }
        catch (error) {
            console.error('Failed to initialize AI:', error);
        }
    };
    const getDomainDescription = (domain) => {
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
    const getDomainIcon = (domain) => {
        switch (domain) {
            case 'corporate':
                return _jsx(Sparkles, { className: "w-4 h-4" });
            case 'technical':
                return _jsx(Brain, { className: "w-4 h-4" });
            case 'business':
                return _jsx(Zap, { className: "w-4 h-4" });
            case 'justice':
                return _jsx(Bot, { className: "w-4 h-4" });
            default:
                return _jsx(Bot, { className: "w-4 h-4" });
        }
    };
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading || !isInitialized)
            return;
        const userMessage = {
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
        const typingMessage = {
            id: 'typing',
            content: '',
            role: 'assistant',
            timestamp: new Date(),
            domain,
            isTyping: true
        };
        setMessages(prev => [...prev, typingMessage]);
        try {
            const response = await strayDogAI.generateContent(domain, 'analysis', userMessage.content, userId, userRole, tier);
            // Remove typing indicator
            setMessages(prev => prev.filter(msg => msg.id !== 'typing'));
            if (response.success && response.data) {
                const assistantMessage = {
                    id: (Date.now() + 1).toString(),
                    content: response.data,
                    role: 'assistant',
                    timestamp: new Date(),
                    domain
                };
                setMessages(prev => [...prev, assistantMessage]);
                // Update context
                await strayDogAI.updateUserContext(userId, domain, userMessage.content, response.data);
            }
            else {
                throw new Error(response.error?.message || 'Failed to generate response');
            }
        }
        catch (error) {
            // Remove typing indicator
            setMessages(prev => prev.filter(msg => msg.id !== 'typing'));
            const errorMessage = {
                id: (Date.now() + 1).toString(),
                content: `I apologize, but I encountered an error: ${error.message}. Please try again.`,
                role: 'assistant',
                timestamp: new Date(),
                domain
            };
            setMessages(prev => [...prev, errorMessage]);
        }
        finally {
            setIsLoading(false);
        }
    };
    const formatTime = (timestamp) => {
        return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };
    return (_jsxs("div", { className: `flex flex-col h-full ${className}`, children: [_jsxs("div", { className: "flex items-center gap-3 p-4 border-b border-white/10 bg-gradient-to-r from-emerald-900/20 to-green-900/20 backdrop-blur-sm", children: [_jsxs("div", { className: "flex items-center gap-2 text-emerald-300", children: [getDomainIcon(domain), _jsxs("h3", { className: "font-semibold capitalize", children: [domain, " AI Assistant"] })] }), _jsx("div", { className: "ml-auto text-xs text-emerald-400/70", children: isInitialized ? 'Online' : 'Initializing...' })] }), _jsxs("div", { className: "flex-1 overflow-y-auto p-4 space-y-4", style: { maxHeight }, children: [messages.map((message) => (_jsxs("div", { className: `flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`, children: [message.role === 'assistant' && (_jsx("div", { className: "flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center text-white", children: message.isTyping ? (_jsx(Loader2, { className: "w-4 h-4 animate-spin" })) : (getDomainIcon(domain)) })), _jsx("div", { className: `max-w-[80%] rounded-2xl px-4 py-3 ${message.role === 'user'
                                    ? 'bg-gradient-to-br from-emerald-600 to-green-700 text-white ml-auto'
                                    : 'bg-white/10 backdrop-blur-sm border border-white/20 text-white'}`, children: message.isTyping ? (_jsxs("div", { className: "flex items-center gap-2 text-emerald-300", children: [_jsx("span", { className: "text-sm", children: "AI is thinking" }), _jsxs("div", { className: "flex gap-1", children: [_jsx("div", { className: "w-1 h-1 bg-emerald-400 rounded-full animate-bounce", style: { animationDelay: '0ms' } }), _jsx("div", { className: "w-1 h-1 bg-emerald-400 rounded-full animate-bounce", style: { animationDelay: '150ms' } }), _jsx("div", { className: "w-1 h-1 bg-emerald-400 rounded-full animate-bounce", style: { animationDelay: '300ms' } })] })] })) : (_jsxs(_Fragment, { children: [_jsx("div", { className: "text-sm leading-relaxed whitespace-pre-wrap", children: message.content }), _jsx("div", { className: `text-xs mt-2 opacity-70 ${message.role === 'user' ? 'text-emerald-100' : 'text-emerald-300'}`, children: formatTime(message.timestamp) })] })) }), message.role === 'user' && (_jsx("div", { className: "flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-emerald-700 to-green-800 flex items-center justify-center text-white", children: _jsx(User, { className: "w-4 h-4" }) }))] }, message.id))), _jsx("div", { ref: messagesEndRef })] }), _jsx("form", { onSubmit: handleSubmit, className: "p-4 border-t border-white/10", children: _jsxs("div", { className: "flex gap-3 items-end", children: [_jsxs("div", { className: "flex-1 relative", children: [_jsx("input", { ref: inputRef, type: "text", value: input, onChange: (e) => setInput(e.target.value), placeholder: placeholder, disabled: isLoading || !isInitialized, className: "w-full px-4 py-3 pr-12 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-emerald-300/50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200" }), _jsx("div", { className: "absolute right-3 top-1/2 transform -translate-y-1/2 text-emerald-400/50", children: getDomainIcon(domain) })] }), _jsx("button", { type: "submit", disabled: !input.trim() || isLoading || !isInitialized, className: "flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-600 to-green-700 hover:from-emerald-500 hover:to-green-600 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed flex items-center justify-center text-white transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100", children: isLoading ? (_jsx(Loader2, { className: "w-5 h-5 animate-spin" })) : (_jsx(Send, { className: "w-5 h-5" })) })] }) })] }));
};
export default AIChat;
//# sourceMappingURL=AIChat.js.map