/**
 * AI Content Enhancement System
 * Dynamically improves project descriptions and content using AI
 */
class AIContentEnhancer {
    constructor() {
        this.claudeAPI = new ClaudeAPI();
        this.enhancedElements = new Set();
        this.originalContent = new Map();
        this.isEnhancing = false;
        this.init();
    }

    init() {
        this.createEnhancementButton();
        this.identifyEnhanceableContent();
        this.setupEventListeners();
    }

    createEnhancementButton() {
        const button = document.createElement('button');
        button.id = 'ai-enhance-button';
        button.innerHTML = `
            <span class="enhance-icon">✨</span>
            <span class="enhance-text">Enhance with AI</span>
        `;
        button.className = 'ai-enhance-button';
        
        // Add styles
        const styles = `
            <style id="ai-enhance-styles">
                .ai-enhance-button {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: linear-gradient(135deg, #2d5016 0%, #4a7c59 100%);
                    color: white;
                    border: none;
                    padding: 12px 20px;
                    border-radius: 25px;
                    cursor: pointer;
                    font-size: 14px;
                    font-weight: 600;
                    box-shadow: 0 4px 20px rgba(45, 80, 22, 0.3);
                    -webkit-backdrop-filter: blur(10px);
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    transition: all 0.3s ease;
                    z-index: 998;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .ai-enhance-button:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 25px rgba(45, 80, 22, 0.4);
                    background: linear-gradient(135deg, #4a7c59 0%, #2d5016 100%);
                }

                .ai-enhance-button:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                    transform: none;
                }

                .ai-enhance-button.enhancing {
                    background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
                }

                .enhance-icon {
                    font-size: 16px;
                    animation: sparkle 2s infinite;
                }

                @keyframes sparkle {
                    0%, 100% { transform: scale(1) rotate(0deg); }
                    25% { transform: scale(1.1) rotate(90deg); }
                    50% { transform: scale(1) rotate(180deg); }
                    75% { transform: scale(1.1) rotate(270deg); }
                }

                .ai-enhanced-content {
                    position: relative;
                    transition: all 0.5s ease;
                }

                .ai-enhanced-content::before {
                    content: '✨';
                    position: absolute;
                    top: -10px;
                    right: -10px;
                    background: linear-gradient(135deg, #4ade80 0%, #22c55e 100%);
                    color: white;
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 10px;
                    box-shadow: 0 2px 10px rgba(34, 197, 94, 0.3);
                    animation: enhancedPulse 2s infinite;
                }

                @keyframes enhancedPulse {
                    0%, 100% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.1); opacity: 0.8; }
                }

                .enhancement-loading {
                    position: relative;
                    overflow: hidden;
                }

                .enhancement-loading::after {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
                    animation: shimmer 1.5s infinite;
                }

                @keyframes shimmer {
                    0% { left: -100%; }
                    100% { left: 100%; }
                }

                .ai-enhance-tooltip {
                    position: fixed;
                    background: rgba(0, 0, 0, 0.9);
                    color: white;
                    padding: 8px 12px;
                    border-radius: 6px;
                    font-size: 12px;
                    pointer-events: none;
                    z-index: 1001;
                    opacity: 0;
                    transition: opacity 0.2s ease;
                }

                .ai-enhance-tooltip.show {
                    opacity: 1;
                }

                @media (max-width: 768px) {
                    .ai-enhance-button {
                        top: 10px;
                        right: 10px;
                        padding: 10px 16px;
                        font-size: 12px;
                    }
                    
                    .enhance-text {
                        display: none;
                    }
                }
            </style>
        `;
        
        document.head.insertAdjacentHTML('beforeend', styles);
        document.body.appendChild(button);
        this.button = button;
    }

    identifyEnhanceableContent() {
        // Find project descriptions, skill descriptions, and other enhanceable content
        const selectors = [
            '.project-description',
            '.skill-description', 
            '.about-text',
            '.service-description',
            'p[data-enhance="true"]',
            '.enhanceable'
        ];
        
        this.enhanceableElements = [];
        
        selectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => {
                if (el.textContent.trim().length > 20) { // Only enhance substantial content
                    this.enhanceableElements.push({
                        element: el,
                        type: this.getContentType(el),
                        originalContent: el.innerHTML
                    });
                    this.originalContent.set(el, el.innerHTML);
                }
            });
        });
        
        // If no specific selectors found, look for general content
        if (this.enhanceableElements.length === 0) {
            this.findGeneralContent();
        }
    }

    findGeneralContent() {
        // Look for paragraphs and descriptions in common portfolio sections
        const sections = document.querySelectorAll('section, .section, .content-area');
        
        sections.forEach(section => {
            const paragraphs = section.querySelectorAll('p');
            paragraphs.forEach(p => {
                const text = p.textContent.trim();
                if (text.length > 50 && text.length < 500 && !p.closest('.ai-chat-modal')) {
                    this.enhanceableElements.push({
                        element: p,
                        type: 'description',
                        originalContent: p.innerHTML
                    });
                    this.originalContent.set(p, p.innerHTML);
                }
            });
        });
    }

    getContentType(element) {
        const classList = element.className.toLowerCase();
        const parentClass = element.parentElement?.className.toLowerCase() || '';
        
        if (classList.includes('project') || parentClass.includes('project')) {
            return 'project';
        } else if (classList.includes('skill') || parentClass.includes('skill')) {
            return 'skill';
        } else if (classList.includes('about') || parentClass.includes('about')) {
            return 'about';
        } else if (classList.includes('service') || parentClass.includes('service')) {
            return 'service';
        } else {
            return 'description';
        }
    }

    setupEventListeners() {
        this.button.addEventListener('click', () => this.toggleEnhancement());
        
        // Add hover tooltips for enhanced content
        document.addEventListener('mouseover', (e) => {
            if (this.enhancedElements.has(e.target)) {
                this.showTooltip(e.target, 'Enhanced with AI');
            }
        });
        
        document.addEventListener('mouseout', (e) => {
            if (this.enhancedElements.has(e.target)) {
                this.hideTooltip();
            }
        });
    }

    async toggleEnhancement() {
        if (this.isEnhancing) return;
        
        if (this.enhancedElements.size === 0) {
            await this.enhanceContent();
        } else {
            this.restoreOriginalContent();
        }
    }

    async enhanceContent() {
        if (this.enhanceableElements.length === 0) {
            this.showNotification('No enhanceable content found on this page.');
            return;
        }
        
        this.isEnhancing = true;
        this.button.disabled = true;
        this.button.classList.add('enhancing');
        this.button.querySelector('.enhance-text').textContent = 'Enhancing...';
        
        let enhancedCount = 0;
        
        for (const item of this.enhanceableElements) {
            try {
                // Add loading animation
                item.element.classList.add('enhancement-loading');
                
                // Get original text content (strip HTML for AI processing)
                const originalText = item.element.textContent.trim();
                
                // Enhance with AI
                const enhancedText = await this.claudeAPI.enhanceContent(originalText, item.type);
                
                // Apply enhancement
                if (enhancedText && enhancedText !== originalText) {
                    item.element.innerHTML = enhancedText;
                    item.element.classList.remove('enhancement-loading');
                    item.element.classList.add('ai-enhanced-content');
                    this.enhancedElements.add(item.element);
                    enhancedCount++;
                    
                    // Small delay between enhancements for better UX
                    await new Promise(resolve => setTimeout(resolve, 500));
                } else {
                    item.element.classList.remove('enhancement-loading');
                }
                
            } catch (error) {
                console.error('Enhancement error:', error);
                item.element.classList.remove('enhancement-loading');
            }
        }
        
        this.isEnhancing = false;
        this.button.disabled = false;
        this.button.classList.remove('enhancing');
        this.button.querySelector('.enhance-text').textContent = 'Restore Original';
        
        if (enhancedCount > 0) {
            this.showNotification(`Enhanced ${enhancedCount} content sections with AI!`);
        } else {
            this.showNotification('Content enhancement completed (demo mode)');
        }
    }

    restoreOriginalContent() {
        this.enhancedElements.forEach(element => {
            const originalContent = this.originalContent.get(element);
            if (originalContent) {
                element.innerHTML = originalContent;
                element.classList.remove('ai-enhanced-content');
            }
        });
        
        this.enhancedElements.clear();
        this.button.querySelector('.enhance-text').textContent = 'Enhance with AI';
        this.showNotification('Original content restored');
    }

    showNotification(message) {
        // Create temporary notification
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            background: rgba(0, 0, 0, 0.9);
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            font-size: 14px;
            z-index: 1002;
            animation: slideInRight 0.3s ease;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    showTooltip(element, text) {
        const tooltip = document.createElement('div');
        tooltip.className = 'ai-enhance-tooltip show';
        tooltip.textContent = text;
        
        const rect = element.getBoundingClientRect();
        tooltip.style.left = rect.left + 'px';
        tooltip.style.top = (rect.top - 30) + 'px';
        
        document.body.appendChild(tooltip);
        this.currentTooltip = tooltip;
    }

    hideTooltip() {
        if (this.currentTooltip) {
            this.currentTooltip.remove();
            this.currentTooltip = null;
        }
    }

    destroy() {
        if (this.button) this.button.remove();
        const styles = document.getElementById('ai-enhance-styles');
        if (styles) styles.remove();
        this.restoreOriginalContent();
    }
}

// Export for use in other modules
window.AIContentEnhancer = AIContentEnhancer;