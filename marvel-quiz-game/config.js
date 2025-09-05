// Marvel Quiz Configuration
// Handles environment-specific settings for development and production

const CONFIG = {
  // Environment detection
  isDev: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1',
  isProd: window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1',
  
  // API Configuration
  MARVEL_API: {
    BASE_URL: 'https://gateway.marvel.com/v1/public',
    TIMEOUT: 10000,
    RETRY_ATTEMPTS: 3
  },
  
  // Environment-specific API key handling
  getApiKeys() {
    if (this.isDev) {
      // Development: Use environment variables or fallback
      return {
        publicKey: window.ENV?.VITE_MARVEL_PUBLIC_KEY || 'your_dev_public_key_here',
        enabled: window.ENV?.VITE_MARVEL_QUIZ_ENABLED === 'true' || false
      };
    } else {
      // Production: Use injected build-time variables
      return {
        publicKey: window.ENV?.VITE_MARVEL_PUBLIC_KEY || null,
        enabled: window.ENV?.VITE_MARVEL_QUIZ_ENABLED === 'true' || false
      };
    }
  },
  
  // API endpoint configuration
  getApiEndpoint() {
    if (this.isProd && window.location.hostname.includes('github.io')) {
      // Production GitHub Pages: Use serverless function proxy
      return 'https://your-app.netlify.app/.netlify/functions/marvel-api';
    }
    // Development or other production: Direct API calls
    return this.MARVEL_API.BASE_URL;
  },
  
  // Feature flags
  FEATURES: {
    PWA_ENABLED: true,
    OFFLINE_MODE: true,
    ANALYTICS: false,
    DEBUG_MODE: false
  },
  
  // Quiz configuration
  QUIZ: {
    DEFAULT_QUESTIONS: 10,
    MAX_QUESTIONS: 50,
    TIME_LIMIT: 30, // seconds per question
    DIFFICULTY_LEVELS: ['easy', 'medium', 'hard'],
    FALLBACK_ENABLED: true
  },
  
  // UI Configuration
  UI: {
    THEME: 'glassmorphic',
    ANIMATIONS_ENABLED: true,
    SOUND_EFFECTS: false
  },
  
  // Initialize configuration
  init() {
    console.log(`Marvel Quiz initialized in ${this.isDev ? 'development' : 'production'} mode`);
    
    // Set debug mode for development
    if (this.isDev) {
      this.FEATURES.DEBUG_MODE = true;
      console.log('Debug mode enabled');
    }
    
    // Validate API keys
    const keys = this.getApiKeys();
    if (!keys.publicKey || keys.publicKey.includes('your_') || keys.publicKey === 'fallback_key') {
      console.warn('Marvel API keys not configured properly. Using fallback data.');
      this.QUIZ.FALLBACK_ENABLED = true;
    }
    
    return this;
  }
};

// Auto-initialize when loaded
if (typeof window !== 'undefined') {
  console.log('🔧 CONFIG: Initializing configuration system...');
  window.CONFIG = CONFIG.init();
  console.log('✅ CONFIG: Configuration system ready', { environment: CONFIG.isDev ? 'development' : 'production', isProduction: CONFIG.isProd, isDevelopment: CONFIG.isDev });
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CONFIG;
}