// Environment Variables Loader for Marvel Quiz Game
// Enhanced for GitHub Pages deployment with security constraints

async function loadEnvironmentVariables() {
  try {
    // Wait for CONFIG to be available if not already loaded
    if (!window.CONFIG) {
      console.log('⏳ Waiting for CONFIG to be available...');
      await new Promise(resolve => {
        const checkConfig = () => {
          if (window.CONFIG) {
            resolve();
          } else {
            setTimeout(checkConfig, 50);
          }
        };
        checkConfig();
      });
    }
    
    // Detect environment using CONFIG
    const isGitHubPages = window.location.hostname.includes('github.io');
    const isProd = window.CONFIG.isProd;
    const isDev = window.CONFIG.isDev;
    
    console.log('🌍 Environment detection:', { isGitHubPages, isProd, isDev, hostname: window.location.hostname });
    
    // Get API keys from CONFIG system
    const apiKeys = window.CONFIG.getApiKeys();
    
    // Create environment variables object from CONFIG
    const envVars = {
      VITE_MARVEL_PUBLIC_KEY: apiKeys.publicKey,
      VITE_MARVEL_QUIZ_ENABLED: apiKeys.enabled ? 'true' : 'false',
      VITE_API_TIMEOUT: window.CONFIG.MARVEL_API.TIMEOUT.toString(),
      VITE_MAX_RETRIES: window.CONFIG.MARVEL_API.RETRY_ATTEMPTS.toString(),
      VITE_ENVIRONMENT: isDev ? 'development' : 'production'
    };
    
    // Create a global ENV object
    window.ENV = window.ENV || {};
    
    // Add all variables to the ENV object
    Object.assign(window.ENV, envVars);
    
    console.log('✅ Environment variables loaded from CONFIG system');
    console.log('🔧 Using CONFIG-based environment loading (no .env file access needed)');
    
    // Return the loaded variables
    return envVars;
  } catch (error) {
    console.error('❌ Error loading environment variables from CONFIG:', error);
    console.log('📝 Falling back to default environment variables');
    return {};
  }
}

// Initialize environment variables and integrate with CONFIG
async function initializeEnvironment() {
  // Load environment variables first
  const envVars = await loadEnvironmentVariables();
  
  // Ensure CONFIG object exists and is initialized
  if (window.CONFIG && typeof window.CONFIG.init === 'function') {
    // Let CONFIG handle the environment integration
    window.CONFIG.init();
    console.log('🔧 CONFIG system initialized with environment variables');
  }
  
  // Update application title if specified in environment variables
  const appTitle = window.ENV?.VITE_APP_TITLE || envVars.VITE_APP_TITLE;
  if (appTitle) {
    const titleElement = document.getElementById('app-title');
    if (titleElement) {
      titleElement.textContent = appTitle;
    }
    // Also update document title
    document.title = appTitle;
  }

  // Dispatch an event to notify that environment variables are loaded
  window.dispatchEvent(new CustomEvent('env-loaded', { 
    detail: { 
      envVars, 
      config: window.CONFIG,
      environment: {
        isProd: window.CONFIG?.isProd,
        isGitHubPages: window.location.hostname.includes('github.io'),
        hostname: window.location.hostname
      }
    } 
  }));
  
  return envVars;
}

// Load environment variables when the script is loaded
initializeEnvironment().catch(error => {
  console.error('❌ Failed to initialize environment:', error);
  // Dispatch error event
  window.dispatchEvent(new CustomEvent('env-error', { detail: error }));
});

// Default environment configuration for fallback
// This ensures the app works even if no environment variables are loaded
window.ENV = window.ENV || {
  // Marvel API Configuration (Public Key Only - will be overridden by build-time config)
  VITE_MARVEL_PUBLIC_KEY: 'e68a214d78db55dc7ce56b8f9fd573f4',
  
  // Application Configuration
  VITE_MARVEL_QUIZ_ENABLED: 'true',
  VITE_API_TIMEOUT: '10000',
  VITE_MAX_RETRIES: '3',
  VITE_MARVEL_CACHE_DURATION: '3600000',
  
  // App Metadata
  VITE_APP_TITLE: 'Marvel Quiz Game',
  VITE_APP_VERSION: '2.1.0',
  VITE_ENVIRONMENT: 'development',
  
  // Feature Flags
  VITE_ENABLE_PWA: 'true',
  VITE_ENABLE_OFFLINE_MODE: 'true',
  VITE_ENABLE_ANALYTICS: 'false',
  
  // Performance Settings
  VITE_CACHE_ENABLED: 'true',
  VITE_PRELOAD_IMAGES: 'true',
  VITE_LAZY_LOADING: 'true'
};

// Environment validation and security checks
function validateEnvironment() {
  const requiredVars = ['VITE_MARVEL_PUBLIC_KEY', 'VITE_MARVEL_QUIZ_ENABLED'];
  const missing = requiredVars.filter(key => !window.ENV[key]);
  
  if (missing.length > 0) {
    console.warn('⚠️ Missing required environment variables:', missing);
  }
  
  // Security validation
  if (window.ENV.VITE_MARVEL_PUBLIC_KEY === 'your_public_key_here') {
    console.warn('🔒 Using placeholder API key - configure real keys for production');
  }
  
  console.log('✅ Environment validation complete');
  console.log('🔒 Security: Private API keys are handled server-side or via build-time injection');
}

// Run validation after a short delay to ensure all scripts are loaded
setTimeout(validateEnvironment, 100);
