/**
 * AI Chat Widget Component
 * Modern glassmorphic design with floating button and modal interface
 */
class AIChatWidget {
    constructor() {
        this.isOpen = false;
        this.claudeAPI = new ClaudeAPI();
        this.messages = [];
        this.isTyping = false;
        this.init();
    }

    init() {
        this.createStyles();
        this.createFloatingButton();
        this.createChatModal();
        this.setupEventListeners();
        this.addWelcomeMessage();
    }

    createStyles() {
        const styles = `
            <style id="ai-chat-styles">
                .ai-chat-button {
                    position: fixed;
                    bottom: 30px;
                    right: 30px;
                    width: 60px;
                    height: 60px;
                    background: rgba(53, 94, 59, 0.75);
                    border-radius: 50%;
                    cursor: pointer;
                    box-shadow: 0 8px 32px rgba(45, 80, 22, 0.3);
                    backdrop-filter: blur(12px);
                    -webkit-backdrop-filter: blur(12px);
                    border: 1px solid rgba(255, 255, 255, 0.25);
                    transition: all 0.3s ease;
                    z-index: 1000;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-size: 24px;
                }

                .ai-chat-button:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 12px 40px rgba(45, 80, 22, 0.5);
                    background: rgba(53, 94, 59, 0.85);
                }

                .ai-chat-button.active {
                    background: rgba(53, 94, 59, 0.95);
                    box-shadow: 0 8px 32px rgba(45, 80, 22, 0.5);
                }

                .ai-chat-modal {
                    position: fixed;
                    bottom: 100px;
                    right: 30px;
                    width: 380px;
                    height: 500px;
                    background: rgba(53, 94, 59, 0.2);
                    backdrop-filter: blur(12px);
                    -webkit-backdrop-filter: blur(12px);
                    border: 1px solid rgba(255, 255, 255, 0.25);
                    border-radius: 20px;
                    box-shadow: 0 20px 60px rgba(45, 80, 22, 0.3);
                    z-index: 999;
                    display: none;
                    flex-direction: column;
                    overflow: hidden;
                    animation: slideUp 0.3s ease;
                }

                .ai-chat-modal.open {
                    display: flex;
                }

                @keyframes slideUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .ai-chat-header {
                    padding: 20px;
                    background: rgba(53, 94, 59, 0.85);
                    backdrop-filter: blur(12px);
                    -webkit-backdrop-filter: blur(12px);
                    color: white;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
                }

                .ai-chat-title {
                    font-weight: 600;
                    font-size: 16px;
                }

                .ai-chat-status {
                    font-size: 12px;
                    opacity: 0.8;
                    display: flex;
                    align-items: center;
                    gap: 5px;
                }

                .ai-chat-status-dot {
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    background: #4ade80;
                    animation: pulse 2s infinite;
                }

                .ai-chat-status-dot.demo {
                    background: #fbbf24;
                }

                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }

                .ai-chat-close {
                    background: none;
                    border: none;
                    color: white;
                    font-size: 20px;
                    cursor: pointer;
                    padding: 0;
                    width: 24px;
                    height: 24px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .ai-chat-messages {
                    flex: 1;
                    padding: 20px;
                    overflow-y: auto;
                    display: flex;
                    flex-direction: column;
                    gap: 15px;
                }

                .ai-chat-message {
                    max-width: 80%;
                    padding: 12px 16px;
                    border-radius: 18px;
                    font-size: 14px;
                    line-height: 1.4;
                    animation: messageSlide 0.3s ease;
                }

                @keyframes messageSlide {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .ai-chat-message.user {
                    align-self: flex-end;
                    background: rgba(53, 94, 59, 0.85);
                    backdrop-filter: blur(12px);
                    -webkit-backdrop-filter: blur(12px);
                    color: white;
                    border: 1px solid rgba(255, 255, 255, 0.25);
                    box-shadow: 0 4px 15px rgba(45, 80, 22, 0.3);
                }

                .ai-chat-message.assistant {
                    align-self: flex-start;
                    background: rgba(53, 94, 59, 0.2);
                    backdrop-filter: blur(12px);
                    -webkit-backdrop-filter: blur(12px);
                    color: white;
                    border: 1px solid rgba(255, 255, 255, 0.25);
                    box-shadow: 0 4px 15px rgba(45, 80, 22, 0.2);
                }

                .ai-chat-typing {
                    align-self: flex-start;
                    background: rgba(53, 94, 59, 0.2);
                    backdrop-filter: blur(12px);
                    -webkit-backdrop-filter: blur(12px);
                    color: white;
                    border: 1px solid rgba(255, 255, 255, 0.25);
                    padding: 12px 16px;
                    border-radius: 18px;
                    display: none;
                    box-shadow: 0 4px 15px rgba(45, 80, 22, 0.2);
                }

                .ai-chat-typing.show {
                    display: block;
                }

                .typing-dots {
                    display: flex;
                    gap: 4px;
                }

                .typing-dot {
                    width: 6px;
                    height: 6px;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.8);
                    animation: typingBounce 1.4s infinite;
                }

                .typing-dot:nth-child(2) {
                    animation-delay: 0.2s;
                }

                .typing-dot:nth-child(3) {
                    animation-delay: 0.4s;
                }

                @keyframes typingBounce {
                    0%, 60%, 100% {
                        transform: translateY(0);
                    }
                    30% {
                        transform: translateY(-10px);
                    }
                }

                .ai-chat-input-container {
                    padding: 20px;
                    background: rgba(53, 94, 59, 0.1);
                    backdrop-filter: blur(12px);
                    -webkit-backdrop-filter: blur(12px);
                    border-top: 1px solid rgba(255, 255, 255, 0.15);
                    display: flex;
                    gap: 10px;
                }

                .ai-chat-input {
                    flex: 1;
                    padding: 12px 16px;
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    border-radius: 25px;
                    background: rgba(255, 255, 255, 0.1);
                    color: white;
                    font-size: 14px;
                    outline: none;
                    backdrop-filter: blur(12px);
                    -webkit-backdrop-filter: blur(12px);
                    box-shadow: 0 2px 10px rgba(45, 80, 22, 0.1);
                }

                .ai-chat-input::placeholder {
                    color: rgba(255, 255, 255, 0.6);
                }

                .ai-chat-input:focus {
                    border-color: rgba(53, 94, 59, 0.6);
                    background: rgba(255, 255, 255, 0.15);
                    box-shadow: 0 0 0 2px rgba(53, 94, 59, 0.2);
                }

                .ai-chat-send {
                    width: 44px;
                    height: 44px;
                    border: 1px solid rgba(255, 255, 255, 0.25);
                    border-radius: 50%;
                    background: rgba(53, 94, 59, 0.85);
                    backdrop-filter: blur(12px);
                    -webkit-backdrop-filter: blur(12px);
                    color: white;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s ease;
                    box-shadow: 0 4px 15px rgba(45, 80, 22, 0.3);
                }

                .ai-chat-send:hover {
                    transform: scale(1.05);
                    background: rgba(53, 94, 59, 0.95);
                    box-shadow: 0 6px 20px rgba(45, 80, 22, 0.4);
                }

                .ai-chat-send:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                    transform: none;
                    box-shadow: none;
                }

                @media (max-width: 480px) {
                    .ai-chat-modal {
                        right: 10px;
                        left: 10px;
                        width: auto;
                        bottom: 80px;
                    }
                    
                    .ai-chat-button {
                        right: 20px;
                        bottom: 20px;
                    }
                }
            </style>
        `;
        document.head.insertAdjacentHTML('beforeend', styles);
    }

    createFloatingButton() {
        const button = document.createElement('button');
        button.className = 'ai-chat-button';
        button.innerHTML = '🤖';
        button.setAttribute('aria-label', 'Open AI Assistant');
        button.id = 'ai-chat-button';
        document.body.appendChild(button);
        this.button = button;
    }

    createChatModal() {
        const modal = document.createElement('div');
        modal.className = 'ai-chat-modal';
        modal.id = 'ai-chat-modal';
        
        const status = this.claudeAPI.getStatus();
        const statusText = status.isAvailable ? 'Live AI' : 'Demo Mode';
        const statusClass = status.isAvailable ? '' : 'demo';
        
        modal.innerHTML = `
            <div class="ai-chat-header">
                <div>
                    <div class="ai-chat-title">AI Assistant</div>
                    <div class="ai-chat-status">
                        <div class="ai-chat-status-dot ${statusClass}"></div>
                        ${statusText}
                    </div>
                </div>
                <button class="ai-chat-close" aria-label="Close chat">×</button>
            </div>
            <div class="ai-chat-messages" id="ai-chat-messages">
                <div class="ai-chat-typing" id="ai-chat-typing">
                    <div class="typing-dots">
                        <div class="typing-dot"></div>
                        <div class="typing-dot"></div>
                        <div class="typing-dot"></div>
                    </div>
                </div>
            </div>
            <div class="ai-chat-input-container">
                <input type="text" class="ai-chat-input" id="ai-chat-input" placeholder="Ask about Eric's expertise..." maxlength="500">
                <button class="ai-chat-send" id="ai-chat-send" aria-label="Send message">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="22" y1="2" x2="11" y2="13"></line>
                        <polygon points="22,2 15,22 11,13 2,9"></polygon>
                    </svg>
                </button>
            </div>
        `;
        
        document.body.appendChild(modal);
        this.modal = modal;
        this.messagesContainer = modal.querySelector('#ai-chat-messages');
        this.input = modal.querySelector('#ai-chat-input');
        this.sendButton = modal.querySelector('#ai-chat-send');
        this.typingIndicator = modal.querySelector('#ai-chat-typing');
    }

    setupEventListeners() {
        // Toggle chat
        this.button.addEventListener('click', () => this.toggleChat());
        
        // Close chat
        this.modal.querySelector('.ai-chat-close').addEventListener('click', () => this.closeChat());
        
        // Send message
        this.sendButton.addEventListener('click', () => this.sendMessage());
        
        // Enter key to send
        this.input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });
        
        // Close on outside click
        document.addEventListener('click', (e) => {
            if (this.isOpen && !this.modal.contains(e.target) && !this.button.contains(e.target)) {
                this.closeChat();
            }
        });
        
        // Escape key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.closeChat();
            }
        });
    }

    toggleChat() {
        if (this.isOpen) {
            this.closeChat();
        } else {
            this.openChat();
        }
    }

    openChat() {
        this.isOpen = true;
        this.modal.classList.add('open');
        this.button.classList.add('active');
        this.input.focus();
        
        // Scroll to bottom
        setTimeout(() => {
            this.scrollToBottom();
        }, 100);
    }

    closeChat() {
        this.isOpen = false;
        this.modal.classList.remove('open');
        this.button.classList.remove('active');
    }

    addWelcomeMessage() {
        const welcomeMessage = {
            role: 'assistant',
            content: "👋 Hi! I'm Eric's AI assistant. I can tell you about his expertise in Claude 4.1 integration, justice reform technology, and full-stack development. What would you like to know?",
            timestamp: new Date().toISOString()
        };
        
        this.messages.push(welcomeMessage);
        this.renderMessage(welcomeMessage);
    }

    async sendMessage() {
        const message = this.input.value.trim();
        if (!message || this.isTyping) return;
        
        // Add user message
        const userMessage = {
            role: 'user',
            content: message,
            timestamp: new Date().toISOString()
        };
        
        this.messages.push(userMessage);
        this.renderMessage(userMessage);
        
        // Clear input and show typing
        this.input.value = '';
        this.showTyping();
        
        try {
            // Get AI response
            const response = await this.claudeAPI.sendMessage(message);
            
            const assistantMessage = {
                role: 'assistant',
                content: response.response,
                timestamp: response.timestamp,
                isLive: response.isLive
            };
            
            this.messages.push(assistantMessage);
            this.hideTyping();
            this.renderMessage(assistantMessage);
            
        } catch (error) {
            console.error('Chat error:', error);
            this.hideTyping();
            
            const errorMessage = {
                role: 'assistant',
                content: "I apologize, but I'm having trouble responding right now. Please try again in a moment.",
                timestamp: new Date().toISOString(),
                isError: true
            };
            
            this.messages.push(errorMessage);
            this.renderMessage(errorMessage);
        }
    }

    renderMessage(message) {
        const messageEl = document.createElement('div');
        messageEl.className = `ai-chat-message ${message.role}`;
        messageEl.textContent = message.content;
        
        this.messagesContainer.appendChild(messageEl);
        this.scrollToBottom();
    }

    showTyping() {
        this.isTyping = true;
        this.typingIndicator.classList.add('show');
        this.sendButton.disabled = true;
        this.scrollToBottom();
    }

    hideTyping() {
        this.isTyping = false;
        this.typingIndicator.classList.remove('show');
        this.sendButton.disabled = false;
    }

    scrollToBottom() {
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }

    destroy() {
        if (this.button) this.button.remove();
        if (this.modal) this.modal.remove();
        const styles = document.getElementById('ai-chat-styles');
        if (styles) styles.remove();
    }
}

// Export for use in other modules
window.AIChatWidget = AIChatWidget;