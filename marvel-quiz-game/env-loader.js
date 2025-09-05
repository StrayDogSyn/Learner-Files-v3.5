// Environment Variables Loader for Marvel Quiz Game

async function loadEnvironmentVariables() {
  try {
    // Fetch the .env file
    const response = await fetch('./.env');

    if (!response.ok) {
      throw new Error(`Failed to load .env file: ${response.status} ${response.statusText}`);
    }

    const envText = await response.text();

    // Parse the .env file
    const envVars = {};

    envText.split('\n').forEach(line => {
      // Skip comments and empty lines
      if (!line || line.startsWith('#')) return;

      // Parse key-value pairs
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)\s*$/);
      if (match) {
        const key = match[1];
        let value = match[2];

        // Remove quotes if present
        if (
          (value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))
        ) {
          value = value.substring(1, value.length - 1);
        }

        envVars[key] = value;
      }
    });

    // Create a global ENV object
    window.ENV = window.ENV || {};

    // Add all variables to the ENV object
    Object.assign(window.ENV, envVars);

    console.log('✅ Environment variables loaded successfully');

    // Return the loaded variables
    return envVars;
  } catch (error) {
    console.error('❌ Error loading environment variables:', error);
    return {};
  }
}

// Load environment variables when the script is loaded
loadEnvironmentVariables().then(envVars => {
  // Update application title if specified in environment variables
  if (envVars.VITE_APP_TITLE) {
    const titleElement = document.getElementById('app-title');
    if (titleElement) {
      titleElement.textContent = envVars.VITE_APP_TITLE;
    }
  }

  // Dispatch an event to notify that environment variables are loaded
  window.dispatchEvent(new CustomEvent('env-loaded', { detail: envVars }));
});

// Production environment configuration for GitHub Pages deployment
// Only public keys and non-sensitive configuration should be included here
window.ENV = window.ENV || {
  // Marvel API Configuration (Public Key Only)
  VITE_MARVEL_PUBLIC_KEY: 'e68a214d78db55dc7ce56b8f9fd573f4',
  
  // Application Configuration
  VITE_MARVEL_QUIZ_ENABLED: 'true',
  VITE_API_TIMEOUT: '10000',
  VITE_MAX_RETRIES: '3',
  VITE_MARVEL_CACHE_DURATION: '3600000',
  
  // App Metadata
  VITE_APP_TITLE: 'Marvel Quiz Game',
  VITE_APP_VERSION: '2.1.0',
  VITE_ENVIRONMENT: 'production',
  
  // Feature Flags
  VITE_ENABLE_PWA: 'true',
  VITE_ENABLE_OFFLINE_MODE: 'true',
  VITE_ENABLE_ANALYTICS: 'false',
  
  // Performance Settings
  VITE_CACHE_ENABLED: 'true',
  VITE_PRELOAD_IMAGES: 'true',
  VITE_LAZY_LOADING: 'true'
};

// Security note: Private keys should never be exposed in client-side code
// For production deployment, use server-side proxy or environment variables
console.log('✅ Production environment variables loaded for Marvel Quiz');
console.log('🔒 Security: Private API keys are handled server-side');
