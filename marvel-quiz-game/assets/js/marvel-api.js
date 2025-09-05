// Marvel API Integration Module
// Handles authentication, data fetching, and fallback mechanisms

class MarvelAPI {
    constructor() {
        this.config = {
            publicKey: '', // Will be loaded from env-loader.js
            privateKey: '', // Will be loaded from env-loader.js
            baseUrl: 'https://gateway.marvel.com/v1/public',
            timeout: 10000,
            retryAttempts: 3,
            cacheExpiry: 24 * 60 * 60 * 1000 // 24 hours
        };
        
        this.cache = new Map();
        this.fallbackData = null;
        this.isOnline = navigator.onLine;
        this.requestQueue = [];
        
        this.init();
    }
    
    async init() {
        // Load API keys from environment
        await this.loadAPIKeys();
        
        // Load fallback data
        await this.loadFallbackData();
        
        // Setup network monitoring
        this.setupNetworkMonitoring();
        
        // Process any queued requests
        this.processRequestQueue();
    }
    
    async loadAPIKeys() {
        try {
            // Check if env-loader.js has loaded the keys
            if (window.MARVEL_CONFIG) {
                this.config.publicKey = window.MARVEL_CONFIG.publicKey;
                this.config.privateKey = window.MARVEL_CONFIG.privateKey;
            } else {
                console.warn('Marvel API keys not found. Using fallback data only.');
            }
        } catch (error) {
            console.error('Failed to load API keys:', error);
        }
    }
    
    async loadFallbackData() {
        try {
            const response = await fetch('./assets/data/fallback.json');
            this.fallbackData = await response.json();
            console.log('Fallback data loaded successfully');
        } catch (error) {
            console.error('Failed to load fallback data:', error);
        }
    }
    
    setupNetworkMonitoring() {
        window.addEventListener('online', () => {
            this.isOnline = true;
            this.processRequestQueue();
            this.notifyNetworkStatus('online');
        });
        
        window.addEventListener('offline', () => {
            this.isOnline = false;
            this.notifyNetworkStatus('offline');
        });
    }
    
    generateAuthParams() {
        if (!this.config.publicKey || !this.config.privateKey) {
            return null;
        }
        
        const timestamp = Date.now().toString();
        const hash = CryptoJS.MD5(timestamp + this.config.privateKey + this.config.publicKey).toString();
        
        return {
            ts: timestamp,
            apikey: this.config.publicKey,
            hash: hash
        };
    }
    
    async fetchCharacters(options = {}) {
        const cacheKey = `characters_${JSON.stringify(options)}`;
        
        // Check cache first
        if (this.cache.has(cacheKey)) {
            const cached = this.cache.get(cacheKey);
            if (Date.now() - cached.timestamp < this.config.cacheExpiry) {
                return cached.data;
            }
        }
        
        // Try API if online and configured
        if (this.isOnline && this.config.publicKey) {
            try {
                const authParams = this.generateAuthParams();
                if (!authParams) throw new Error('Authentication failed');
                
                const params = new URLSearchParams({
                    ...authParams,
                    limit: options.limit || 20,
                    offset: options.offset || 0,
                    ...(options.nameStartsWith && { nameStartsWith: options.nameStartsWith })
                });
                
                const response = await this.fetchWithTimeout(
                    `${this.config.baseUrl}/characters?${params}`,
                    { timeout: this.config.timeout }
                );
                
                if (!response.ok) {
                    throw new Error(`API request failed: ${response.status}`);
                }
                
                const data = await response.json();
                
                // Cache the result
                this.cache.set(cacheKey, {
                    data: data.data.results,
                    timestamp: Date.now()
                });
                
                return data.data.results;
            } catch (error) {
                console.warn('API request failed, using fallback data:', error);
            }
        }
        
        // Use fallback data
        return this.getFallbackCharacters(options);
    }
    
    getFallbackCharacters(options = {}) {
        if (!this.fallbackData) {
            return [];
        }
        
        let characters = [...this.fallbackData.characters];
        
        // Apply name filter
        if (options.nameStartsWith) {
            characters = characters.filter(char => 
                char.name.toLowerCase().startsWith(options.nameStartsWith.toLowerCase())
            );
        }
        
        // Apply pagination
        const offset = options.offset || 0;
        const limit = options.limit || 20;
        
        return characters.slice(offset, offset + limit);
    }
    
    async fetchWithTimeout(url, options = {}) {
        const { timeout = this.config.timeout } = options;
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);
        
        try {
            const response = await fetch(url, {
                ...options,
                signal: controller.signal
            });
            clearTimeout(timeoutId);
            return response;
        } catch (error) {
            clearTimeout(timeoutId);
            throw error;
        }
    }
    
    async retryRequest(requestFn, attempts = this.config.retryAttempts) {
        for (let i = 0; i < attempts; i++) {
            try {
                return await requestFn();
            } catch (error) {
                if (i === attempts - 1) throw error;
                await this.delay(Math.pow(2, i) * 1000); // Exponential backoff
            }
        }
    }
    
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    queueRequest(requestFn) {
        if (this.isOnline) {
            return requestFn();
        } else {
            return new Promise((resolve, reject) => {
                this.requestQueue.push({ requestFn, resolve, reject });
            });
        }
    }
    
    async processRequestQueue() {
        while (this.requestQueue.length > 0 && this.isOnline) {
            const { requestFn, resolve, reject } = this.requestQueue.shift();
            try {
                const result = await requestFn();
                resolve(result);
            } catch (error) {
                reject(error);
            }
        }
    }
    
    notifyNetworkStatus(status) {
        const event = new CustomEvent('marvelAPINetworkStatus', {
            detail: { status, isOnline: this.isOnline }
        });
        window.dispatchEvent(event);
    }
    
    // Generate random characters for quiz questions
    async getRandomCharacters(count = 4) {
        try {
            const characters = await this.fetchCharacters({ limit: 100 });
            const shuffled = characters.sort(() => 0.5 - Math.random());
            return shuffled.slice(0, count);
        } catch (error) {
            console.error('Failed to get random characters:', error);
            return this.getFallbackCharacters({ limit: count });
        }
    }
    
    // Get character by ID
    async getCharacterById(id) {
        const cacheKey = `character_${id}`;
        
        if (this.cache.has(cacheKey)) {
            const cached = this.cache.get(cacheKey);
            if (Date.now() - cached.timestamp < this.config.cacheExpiry) {
                return cached.data;
            }
        }
        
        if (this.isOnline && this.config.publicKey) {
            try {
                const authParams = this.generateAuthParams();
                if (!authParams) throw new Error('Authentication failed');
                
                const params = new URLSearchParams(authParams);
                const response = await this.fetchWithTimeout(
                    `${this.config.baseUrl}/characters/${id}?${params}`
                );
                
                if (!response.ok) {
                    throw new Error(`API request failed: ${response.status}`);
                }
                
                const data = await response.json();
                const character = data.data.results[0];
                
                this.cache.set(cacheKey, {
                    data: character,
                    timestamp: Date.now()
                });
                
                return character;
            } catch (error) {
                console.warn('API request failed, using fallback data:', error);
            }
        }
        
        // Fallback to local data
        return this.fallbackData?.characters.find(char => char.id === id) || null;
    }
    
    // Clear cache
    clearCache() {
        this.cache.clear();
        console.log('Marvel API cache cleared');
    }
    
    // Get cache statistics
    getCacheStats() {
        return {
            size: this.cache.size,
            keys: Array.from(this.cache.keys())
        };
    }
}

// Export for use in other modules
window.MarvelAPI = MarvelAPI;

// Initialize global instance
window.marvelAPI = new MarvelAPI();