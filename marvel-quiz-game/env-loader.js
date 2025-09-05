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
                if ((value.startsWith('"') && value.endsWith('"')) ||
                    (value.startsWith('\'') && value.endsWith('\'')))
                {
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
loadEnvironmentVariables().then((envVars) => {
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

// Environment configuration for GitHub Pages deployment
window.ENV = {
  VITE_MARVEL_PUBLIC_KEY: 'your_public_key_here',
  MARVEL_PRIVATE_KEY: 'your_private_key_here',
  VITE_MARVEL_QUIZ_ENABLED: 'true',
  VITE_API_TIMEOUT: '10000',
  VITE_MAX_RETRIES: '3',
  VITE_MARVEL_CACHE_DURATION: '3600000'
};

console.log('Environment variables loaded for Marvel Quiz');
