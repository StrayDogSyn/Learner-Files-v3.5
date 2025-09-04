// AI Integration for Portfolio - Basic Implementation
class AIIntegration {
    constructor() {
        this.isInitialized = false;
        this.chatWidget = null;
        this.apiEndpoint = '/api/claude'; // Will gracefully degrade if not available
        this.init();
    }

    async init() {
        try {
            this.createChatWidget();
            this.setupEventListeners();
            this.isInitialized = true;
            console.log('✅ AI Integration initialized successfully');
        } catch (error) {
            console.warn('AI Integration failed to initialize:', error);
            this.showOfflineMode();
        }
    }

    createChatWidget() {
        // Create floating AI chat button
        const chatButton = document.createElement('div');
        chatButton.id = 'ai-chat-button';
        chatButton.innerHTML = `
            <div class="ai-chat-btn">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    <path d="M8 9h8"></path>
                    <path d="M8 13h6"></path>
                </svg>
                <span>AI Assistant</span>
            </div>
        `;

        // Create chat panel
        const chatPanel = document.createElement('div');
        chatPanel.id = 'ai-chat-panel';
        chatPanel.innerHTML = `
            <div class="ai-chat-header">
                <h3>AI Portfolio Assistant</h3>
                <button id="close-chat" class="close-btn">×</button>
            </div>
            <div class="ai-chat-messages" id="chat-messages">
                <div class="ai-message">
                    <div class="message-content">
                        👋 Hi! I'm your AI assistant. I can help you learn more about Hunter's projects and experience. Try asking:
                        <ul>
                            <li>"Tell me about Hunter's technical skills"</li>
                            <li>"What projects has he worked on?"</li>
                            <li>"How can I contact Hunter?"</li>
                        </ul>
                    </div>
                </div>
            </div>
            <div class="ai-chat-input">
                <input type="text" id="chat-input" placeholder="Ask me anything about Hunter's portfolio..." />
                <button id="send-message" class="send-btn">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="22" y1="2" x2="11" y2="13"></line>
                        <polygon points="22,2 15,22 11,13 2,9"></polygon>
                    </svg>
                </button>
            </div>
        `;

        // Add styles
        this.addChatStyles();

        // Append to body
        document.body.appendChild(chatButton);
        document.body.appendChild(chatPanel);

        this.chatWidget = { button: chatButton, panel: chatPanel };
    }

    addChatStyles() {
        const styles = `
            <style id="ai-chat-styles">
                #ai-chat-button {
                    position: fixed;
                    bottom: 30px;
                    right: 30px;
                    z-index: 1000;
                    cursor: pointer;
                }

                .ai-chat-btn {
                    background: rgba(53, 94, 59, 0.75);
                    backdrop-filter: blur(12px);
                    -webkit-backdrop-filter: blur(12px);
                    color: white;
                    padding: 15px 20px;
                    border-radius: 50px;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    box-shadow: 0 4px 20px rgba(53, 94, 59, 0.5);
                    border: 1px solid rgba(255, 255, 255, 0.25);
                    transition: all 0.3s ease;
                    font-weight: 500;
                }

                .ai-chat-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 25px rgba(53, 94, 59, 0.6);
                    background: rgba(53, 94, 59, 0.85);
                }

                #ai-chat-panel {
                    position: fixed;
                    bottom: 100px;
                    right: 30px;
                    width: 350px;
                    height: 500px;
                    background: rgba(53, 94, 59, 0.15);
                    backdrop-filter: blur(16px);
                    -webkit-backdrop-filter: blur(16px);
                    border-radius: 20px;
                    border: 1px solid rgba(53, 94, 59, 0.3);
                    box-shadow: 0 10px 40px rgba(53, 94, 59, 0.2);
                    display: none;
                    flex-direction: column;
                    z-index: 1001;
                    overflow: hidden;
                }

                .ai-chat-header {
                    background: rgba(53, 94, 59, 0.85);
                    backdrop-filter: blur(12px);
                    -webkit-backdrop-filter: blur(12px);
                    color: white;
                    padding: 20px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
                }

                .ai-chat-header h3 {
                    margin: 0;
                    font-size: 1.1rem;
                }

                .close-btn {
                    background: none;
                    border: none;
                    color: white;
                    font-size: 24px;
                    cursor: pointer;
                    padding: 0;
                    width: 30px;
                    height: 30px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 50%;
                    transition: background 0.3s ease;
                }

                .close-btn:hover {
                    background: rgba(255, 255, 255, 0.2);
                }

                .ai-chat-messages {
                    flex: 1;
                    padding: 20px;
                    overflow-y: auto;
                    display: flex;
                    flex-direction: column;
                    gap: 15px;
                }

                .ai-message, .user-message {
                    max-width: 80%;
                    padding: 12px 16px;
                    border-radius: 18px;
                    font-size: 14px;
                    line-height: 1.4;
                }

                .ai-message {
                    background: rgba(255, 255, 255, 0.1);
                    backdrop-filter: blur(12px);
                    -webkit-backdrop-filter: blur(12px);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    color: white;
                    align-self: flex-start;
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                }

                .user-message {
                    background: rgba(53, 94, 59, 0.6);
                    backdrop-filter: blur(12px);
                    -webkit-backdrop-filter: blur(12px);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    color: white;
                    align-self: flex-end;
                    box-shadow: 0 2px 10px rgba(53, 94, 59, 0.2);
                }

                .message-content ul {
                    margin: 10px 0 0 20px;
                    font-size: 13px;
                }

                .ai-chat-input {
                    padding: 20px;
                    border-top: 1px solid rgba(255, 255, 255, 0.1);
                    display: flex;
                    gap: 10px;
                }

                #chat-input {
                    flex: 1;
                    padding: 12px 16px;
                    background: rgba(255, 255, 255, 0.1);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    border-radius: 25px;
                    outline: none;
                    font-size: 14px;
                    color: white;
                    backdrop-filter: blur(8px);
                    -webkit-backdrop-filter: blur(8px);
                }

                #chat-input:focus {
                    border-color: rgba(53, 94, 59, 0.6);
                    box-shadow: 0 0 0 2px rgba(53, 94, 59, 0.2);
                }
                
                #chat-input::placeholder {
                    color: rgba(255, 255, 255, 0.6);
                }

                .send-btn {
                    background: rgba(53, 94, 59, 0.85);
                    backdrop-filter: blur(12px);
                    -webkit-backdrop-filter: blur(12px);
                    color: white;
                    border: 1px solid rgba(255, 255, 255, 0.25);
                    width: 45px;
                    height: 45px;
                    border-radius: 50%;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: transform 0.2s ease;
                    box-shadow: 0 4px 15px rgba(53, 94, 59, 0.3);
                }

                .send-btn:hover {
                    transform: scale(1.05);
                    box-shadow: 0 6px 20px rgba(53, 94, 59, 0.4);
                }

                .typing-indicator {
                    display: flex;
                    gap: 4px;
                    padding: 12px 16px;
                }

                .typing-dot {
                    width: 8px;
                    height: 8px;
                    background: #999;
                    border-radius: 50%;
                    animation: typing 1.4s infinite;
                }

                .typing-dot:nth-child(2) { animation-delay: 0.2s; }
                .typing-dot:nth-child(3) { animation-delay: 0.4s; }

                @keyframes typing {
                    0%, 60%, 100% { transform: translateY(0); }
                    30% { transform: translateY(-10px); }
                }

                @media (max-width: 768px) {
                    #ai-chat-panel {
                        width: calc(100vw - 40px);
                        height: 70vh;
                        bottom: 20px;
                        right: 20px;
                    }
                }
            </style>
        `;
        document.head.insertAdjacentHTML('beforeend', styles);
    }

    setupEventListeners() {
        const chatButton = document.getElementById('ai-chat-button');
        const chatPanel = document.getElementById('ai-chat-panel');
        const closeBtn = document.getElementById('close-chat');
        const sendBtn = document.getElementById('send-message');
        const chatInput = document.getElementById('chat-input');

        chatButton.addEventListener('click', () => this.toggleChat());
        closeBtn.addEventListener('click', () => this.closeChat());
        sendBtn.addEventListener('click', () => this.sendMessage());
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });
    }

    toggleChat() {
        const panel = document.getElementById('ai-chat-panel');
        panel.style.display = panel.style.display === 'flex' ? 'none' : 'flex';
    }

    closeChat() {
        document.getElementById('ai-chat-panel').style.display = 'none';
    }

    async sendMessage() {
        const input = document.getElementById('chat-input');
        const message = input.value.trim();
        
        if (!message) return;

        // Add user message to chat
        this.addMessageToChat(message, 'user');
        input.value = '';

        // Show typing indicator
        this.showTypingIndicator();

        try {
            // Try to get AI response
            const response = await this.getAIResponse(message);
            this.hideTypingIndicator();
            this.addMessageToChat(response, 'ai');
        } catch (error) {
            this.hideTypingIndicator();
            const fallbackResponse = this.getFallbackResponse(message);
            this.addMessageToChat(fallbackResponse, 'ai');
        }
    }

    addMessageToChat(message, sender) {
        const messagesContainer = document.getElementById('chat-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = sender === 'user' ? 'user-message' : 'ai-message';
        messageDiv.innerHTML = `<div class="message-content">${message}</div>`;
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    showTypingIndicator() {
        const messagesContainer = document.getElementById('chat-messages');
        const typingDiv = document.createElement('div');
        typingDiv.id = 'typing-indicator';
        typingDiv.className = 'ai-message typing-indicator';
        typingDiv.innerHTML = `
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        `;
        messagesContainer.appendChild(typingDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    hideTypingIndicator() {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    async getAIResponse(message) {
        // This would connect to a real Claude API in production
        // For now, return intelligent fallback responses
        throw new Error('API not available - using fallback');
    }

    getFallbackResponse(message) {
        const lowerMessage = message.toLowerCase();
        
        // Portfolio-specific responses
        if (lowerMessage.includes('skill') || lowerMessage.includes('technical')) {
            return `Hunter specializes in Claude 4.1 AI integration, full-stack development with MongoDB, and has 20+ years of customer service excellence. His technical stack includes JavaScript, Python, React, and advanced AI/ML systems.`;
        }
        
        if (lowerMessage.includes('project') || lowerMessage.includes('work')) {
            return `Hunter has built several impressive projects including this AI-powered analytics dashboard, a Marvel quiz game with advanced state management, and various justice reform technology solutions. Each project demonstrates his commitment to both technical excellence and social impact.`;
        }
        
        if (lowerMessage.includes('contact') || lowerMessage.includes('hire') || lowerMessage.includes('reach')) {
            return `You can reach Hunter through his GitHub profile or the contact information provided in his portfolio. He's actively seeking opportunities in AI integration and full-stack development roles.`;
        }
        
        if (lowerMessage.includes('experience') || lowerMessage.includes('background')) {
            return `Hunter brings a unique combination of 20+ years in customer service excellence and cutting-edge technical expertise. His background in culinary arts has trained him in high-pressure performance and attention to detail, which he now applies to creating exceptional AI solutions.`;
        }
        
        if (lowerMessage.includes('ai') || lowerMessage.includes('claude')) {
            return `Hunter specializes in Claude 4.1 integration and intelligent automation. This portfolio features live AI analytics, real-time performance monitoring, and demonstrates his expertise in building production-ready AI systems.`;
        }
        
        // Default response
        return `Thanks for your question! Hunter is a passionate AI developer and technical architect with expertise in Claude 4.1 integration, full-stack development, and customer-focused solutions. Feel free to ask about his projects, skills, or experience!`;
    }

    showOfflineMode() {
        console.log('AI Integration running in offline mode with intelligent fallbacks');
    }
}

// Initialize AI Integration when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.aiIntegration = new AIIntegration();
    });
} else {
    window.aiIntegration = new AIIntegration();
}