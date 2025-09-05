// Ultimate Marvel Universe Quiz - Service Worker
// Advanced PWA Implementation with Intelligent Caching & AI-like Features

const CACHE_NAME = 'marvel-quiz-v2.1.0';
const STATIC_CACHE = 'marvel-static-v2.1.0';
const DYNAMIC_CACHE = 'marvel-dynamic-v2.1.0';
const API_CACHE = 'marvel-api-v2.1.0';
const PERFORMANCE_CACHE = 'marvel-performance-v2.1.0';

// Advanced configuration
const CONFIG = {
    maxCacheAge: 24 * 60 * 60 * 1000, // 24 hours
    maxCacheSize: 50 * 1024 * 1024, // 50MB
    maxAPIRetries: 3,
    performanceThreshold: 1000, // 1 second
    intelligentPrefetch: true,
    adaptiveCaching: true
};

// Performance monitoring
const performanceMetrics = {
    cacheHits: 0,
    cacheMisses: 0,
    networkRequests: 0,
    averageResponseTime: 0,
    lastCleanup: Date.now()
};

// Critical resources for offline functionality
const STATIC_ASSETS = [
    './',
    './index.html',
    './manifest.json',
    './icons/icon-192.png',
    './icons/icon-512.png'
];

// Marvel API endpoints to cache
const API_ENDPOINTS = [
    'https://gateway.marvel.com/v1/public/characters',
    'https://gateway.marvel.com/v1/public/comics'
];

// Cache strategies
const CACHE_STRATEGIES = {
    CACHE_FIRST: 'cache-first',
    NETWORK_FIRST: 'network-first',
    STALE_WHILE_REVALIDATE: 'stale-while-revalidate'
};

// Install Event - Cache critical resources
self.addEventListener('install', (event) => {
    console.log('🚀 Service Worker: Installing...');
    
    event.waitUntil(
        Promise.all([
            // Cache static assets
            caches.open(STATIC_CACHE).then(cache => {
                console.log('📦 Caching static assets...');
                return cache.addAll(STATIC_ASSETS);
            }),
            
            // Pre-cache critical API data
            precacheAPIData()
        ]).then(() => {
            console.log('✅ Service Worker: Installation complete');
            // Force activation of new service worker
            return self.skipWaiting();
        })
    );
});

// Activate Event - Clean up old caches
self.addEventListener('activate', (event) => {
    console.log('🔄 Service Worker: Activating...');
    
    event.waitUntil(
        Promise.all([
            // Clean up old caches
            cleanupOldCaches(),
            
            // Take control of all clients
            self.clients.claim()
        ]).then(() => {
            console.log('✅ Service Worker: Activation complete');
        })
    );
});

// Fetch Event - Intelligent request handling
self.addEventListener('fetch', (event) => {
    // Skip non-GET requests and chrome-extension requests
    if (event.request.method !== 'GET' || event.request.url.startsWith('chrome-extension://')) {
        return;
    }
    
    const { request } = event;
    const url = new URL(request.url);
    const startTime = performance.now();
    
    // Update performance metrics
    performanceMetrics.networkRequests++;
    
    // Intelligent prefetching
    intelligentPrefetch(request);
    
    // Get adaptive caching strategy
    const strategy = getAdaptiveCacheStrategy(request, {
        averageResponseTime: performanceMetrics.averageResponseTime,
        cacheHits: performanceMetrics.cacheHits,
        cacheMisses: performanceMetrics.cacheMisses
    });
    
    // Handle different types of requests with performance tracking
    if (isAPIRequest(url)) {
        event.respondWith(
            handleAPIRequest(request, strategy)
                .then(response => {
                    trackResponseTime(startTime);
                    return response;
                })
                .catch(error => {
                    trackResponseTime(startTime);
                    throw error;
                })
        );
    } else if (isImageRequest(url)) {
        event.respondWith(
            handleImageRequest(request)
                .then(response => {
                    trackResponseTime(startTime);
                    return response;
                })
                .catch(error => {
                    trackResponseTime(startTime);
                    throw error;
                })
        );
    } else if (isStaticAsset(url)) {
        event.respondWith(
            handleStaticAsset(request)
                .then(response => {
                    trackResponseTime(startTime);
                    return response;
                })
                .catch(error => {
                    trackResponseTime(startTime);
                    throw error;
                })
        );
    } else {
        event.respondWith(
            handleDynamicRequest(request)
                .then(response => {
                    trackResponseTime(startTime);
                    return response;
                })
                .catch(error => {
                    trackResponseTime(startTime);
                    throw error;
                })
        );
    }
});

// Track response times for adaptive caching
function trackResponseTime(startTime) {
    const responseTime = performance.now() - startTime;
    if (!performanceMetrics.totalResponseTime) {
        performanceMetrics.totalResponseTime = 0;
    }
    performanceMetrics.totalResponseTime += responseTime;
    performanceMetrics.averageResponseTime = 
        performanceMetrics.totalResponseTime / performanceMetrics.networkRequests;
}

// Background Sync - Handle offline quiz results
self.addEventListener('sync', (event) => {
    console.log('🔄 Background Sync triggered:', event.tag);
    
    if (event.tag === 'quiz-results-sync') {
        event.waitUntil(syncQuizResults());
    }
});

// Push Notifications - Handle incoming notifications
self.addEventListener('push', (event) => {
    console.log('📱 Push notification received');
    
    const options = {
        body: event.data ? event.data.text() : 'New Marvel content available!',
        icon: './icons/icon-192.png',
        badge: './icons/icon-192.png',
        vibrate: [200, 100, 200],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        },
        actions: [
            {
                action: 'explore',
                title: 'Take Quiz',
                icon: './icons/icon-192.png'
            },
            {
                action: 'close',
                title: 'Close',
                icon: './icons/icon-192.png'
            }
        ]
    };
    
    event.waitUntil(
        self.registration.showNotification('Marvel Quiz Update', options)
    );
});

// Notification Click - Handle notification interactions
self.addEventListener('notificationclick', (event) => {
    console.log('📱 Notification clicked:', event.action);
    
    event.notification.close();
    
    if (event.action === 'explore') {
        event.waitUntil(
            clients.openWindow('./index.html')
        );
    }
});

// Helper Functions

async function precacheAPIData() {
    try {
        console.log('🌐 Pre-caching API data...');
        const cache = await caches.open(API_CACHE);
        
        // Cache fallback character data
        const fallbackData = {
            characters: [
                {
                    id: 1,
                    name: 'Spider-Man',
                    image: 'https://i.annihil.us/u/prod/marvel/i/mg/3/50/526548a343e4b.jpg',
                    tier: 'S+'
                },
                {
                    id: 2,
                    name: 'Iron Man',
                    image: 'https://i.annihil.us/u/prod/marvel/i/mg/9/c0/527bb7b37ff55.jpg',
                    tier: 'S+'
                }
            ]
        };
        
        const response = new Response(JSON.stringify(fallbackData), {
            headers: { 'Content-Type': 'application/json' }
        });
        
        await cache.put('fallback-characters', response);
        console.log('✅ Fallback data cached');
        
    } catch (error) {
        console.error('❌ Pre-cache failed:', error);
    }
}

async function cleanupOldCaches() {
    const cacheNames = await caches.keys();
    const validCaches = [CACHE_NAME, STATIC_CACHE, DYNAMIC_CACHE, API_CACHE, PERFORMANCE_CACHE];
    
    // Clean up old caches
    const cleanupPromises = cacheNames
        .filter(cacheName => !validCaches.includes(cacheName))
        .map(cacheName => {
            console.log('🗑️ Deleting old cache:', cacheName);
            return caches.delete(cacheName);
        });
    
    // Intelligent cache size management
    await manageCacheSize();
    
    // Update cleanup timestamp
    performanceMetrics.lastCleanup = Date.now();
    
    return Promise.all(cleanupPromises);
}

// Advanced cache size management
async function manageCacheSize() {
    try {
        const caches_to_check = [DYNAMIC_CACHE, API_CACHE];
        
        for (const cacheName of caches_to_check) {
            const cache = await caches.open(cacheName);
            const requests = await cache.keys();
            
            // Calculate cache size and age
            const cacheEntries = [];
            
            for (const request of requests) {
                const response = await cache.match(request);
                if (response) {
                    const dateHeader = response.headers.get('date');
                    const age = dateHeader ? Date.now() - new Date(dateHeader).getTime() : 0;
                    const size = await estimateResponseSize(response);
                    
                    cacheEntries.push({ request, age, size });
                }
            }
            
            // Sort by age (oldest first) and remove if over limits
            cacheEntries.sort((a, b) => b.age - a.age);
            
            let totalSize = cacheEntries.reduce((sum, entry) => sum + entry.size, 0);
            
            // Remove old or oversized entries
            for (const entry of cacheEntries) {
                if (entry.age > CONFIG.maxCacheAge || totalSize > CONFIG.maxCacheSize) {
                    await cache.delete(entry.request);
                    totalSize -= entry.size;
                    console.log('🗑️ Removed cache entry:', entry.request.url);
                }
            }
        }
        
        console.log('✅ Cache size management complete');
        
    } catch (error) {
        console.error('❌ Cache size management failed:', error);
    }
}

// Estimate response size
async function estimateResponseSize(response) {
    try {
        const clone = response.clone();
        const text = await clone.text();
        return new Blob([text]).size;
    } catch {
        return 1024; // Default 1KB estimate
    }
}

// Intelligent prefetching based on user behavior
async function intelligentPrefetch(request) {
    if (!CONFIG.intelligentPrefetch) return;
    
    try {
        const url = new URL(request.url);
        
        // Prefetch related Marvel characters if viewing character page
        if (url.pathname.includes('characters')) {
            const relatedEndpoints = [
                '/characters?limit=20&offset=0',
                '/characters?limit=20&offset=20'
            ];
            
            for (const endpoint of relatedEndpoints) {
                const prefetchUrl = `https://gateway.marvel.com/v1/public${endpoint}`;
                fetch(prefetchUrl).then(response => {
                    if (response.ok) {
                        const cache = caches.open(API_CACHE);
                        cache.then(c => c.put(prefetchUrl, response.clone()));
                        console.log('🔮 Prefetched:', endpoint);
                    }
                }).catch(() => {});
            }
        }
        
    } catch (error) {
        console.error('❌ Intelligent prefetch failed:', error);
    }
}

// Adaptive caching strategy based on performance
function getAdaptiveCacheStrategy(request, performanceData) {
    if (!CONFIG.adaptiveCaching) return CACHE_STRATEGIES.STALE_WHILE_REVALIDATE;
    
    const avgResponseTime = performanceData.averageResponseTime;
    const cacheHitRatio = performanceData.cacheHits / (performanceData.cacheHits + performanceData.cacheMisses);
    
    // Use cache-first for slow networks
    if (avgResponseTime > CONFIG.performanceThreshold) {
        return CACHE_STRATEGIES.CACHE_FIRST;
    }
    
    // Use network-first for fast networks with low cache hit ratio
    if (avgResponseTime < 500 && cacheHitRatio < 0.7) {
        return CACHE_STRATEGIES.NETWORK_FIRST;
    }
    
    // Default to stale-while-revalidate
    return CACHE_STRATEGIES.STALE_WHILE_REVALIDATE;
}

function isStaticAsset(url) {
    return url.pathname.endsWith('.html') ||
           url.pathname.endsWith('.css') ||
           url.pathname.endsWith('.js') ||
           url.pathname.endsWith('.json') ||
           url.pathname === './' ||
           url.pathname === '/marvel-quiz-game/';
}

function isAPIRequest(url) {
    return url.hostname === 'gateway.marvel.com' ||
           url.pathname.includes('/api/');
}

function isImageRequest(url) {
    return url.pathname.endsWith('.jpg') ||
           url.pathname.endsWith('.jpeg') ||
           url.pathname.endsWith('.png') ||
           url.pathname.endsWith('.gif') ||
           url.pathname.endsWith('.webp') ||
           url.hostname === 'i.annihil.us';
}

// Enhanced Cache-First Strategy (for static assets)
async function handleStaticAsset(request) {
    const cache = await caches.open(STATIC_CACHE);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
        performanceMetrics.cacheHits++;
        console.log('📦 Cache hit (static):', request.url);
        return cachedResponse;
    }
    
    performanceMetrics.cacheMisses++;
    
    try {
        const networkResponse = await fetch(request, {
            signal: AbortSignal.timeout(CONFIG.networkTimeout || 10000)
        });
        
        if (networkResponse.ok) {
            cache.put(request, networkResponse.clone());
            console.log('🌐 Network response cached (static):', request.url);
        }
        return networkResponse;
    } catch (error) {
        console.error('❌ Static asset fetch failed:', error);
        
        // Return offline fallback
        if (request.destination === 'document') {
            const cache = await caches.open(STATIC_CACHE);
            return cache.match('./index.html');
        }
        
        return new Response('Offline', { 
            status: 503, 
            statusText: 'Service Unavailable',
            headers: { 'Content-Type': 'text/plain' }
        });
    }
}

// Enhanced Network-First Strategy with adaptive caching
async function handleAPIRequest(request, strategy = CACHE_STRATEGIES.NETWORK_FIRST) {
    const cache = await caches.open(API_CACHE);
    
    // Use adaptive strategy
    if (strategy === CACHE_STRATEGIES.CACHE_FIRST) {
        const cachedResponse = await cache.match(request);
        if (cachedResponse) {
            performanceMetrics.cacheHits++;
            console.log('📦 Cache hit (API cache-first):', request.url);
            
            // Update in background
            updateCacheInBackground(request, cache);
            return cachedResponse;
        }
    }
    
    try {
        console.log('🌐 API request:', request.url);
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), CONFIG.apiTimeout || 8000);
        
        const networkResponse = await fetch(request, {
            signal: controller.signal,
            headers: {
                ...request.headers,
                'Cache-Control': 'no-cache'
            }
        });
        
        clearTimeout(timeoutId);
        
        if (networkResponse.ok) {
            // Enhanced caching with metadata
            const responseToCache = networkResponse.clone();
            const headers = new Headers(responseToCache.headers);
            headers.set('sw-cached-at', new Date().toISOString());
            headers.set('sw-cache-strategy', strategy);
            
            const enhancedResponse = new Response(responseToCache.body, {
                status: responseToCache.status,
                statusText: responseToCache.statusText,
                headers: headers
            });
            
            cache.put(request, enhancedResponse);
            console.log('✅ API response cached with metadata');
            return networkResponse;
        }
        
        throw new Error('Network response not ok');
        
    } catch (error) {
        performanceMetrics.cacheMisses++;
        console.log('📦 Network failed, trying cache:', error.message);
        
        const cachedResponse = await cache.match(request);
        
        if (cachedResponse) {
            performanceMetrics.cacheHits++;
            console.log('📦 Serving API from cache');
            
            // Add stale indicator
            const headers = new Headers(cachedResponse.headers);
            headers.set('sw-cache-status', 'stale');
            
            return new Response(cachedResponse.body, {
                status: cachedResponse.status,
                statusText: cachedResponse.statusText,
                headers: headers
            });
        }
        
        // Return fallback data
        console.log('📦 Serving fallback data');
        return cache.match('fallback-characters');
    }
}

// Enhanced Stale-While-Revalidate Strategy (for images)
async function handleImageRequest(request) {
    const cache = await caches.open(DYNAMIC_CACHE);
    const cachedResponse = await cache.match(request);
    
    // Return cached version immediately if available
    if (cachedResponse) {
        performanceMetrics.cacheHits++;
        console.log('📦 Serving image from cache:', request.url);
        
        // Update cache in background with retry logic
        updateImageCacheInBackground(request, cache);
        
        return cachedResponse;
    }
    
    performanceMetrics.cacheMisses++;
    
    // If not cached, fetch from network with timeout
    try {
        console.log('🌐 Fetching image:', request.url);
        const networkResponse = await fetch(request, {
            signal: AbortSignal.timeout(CONFIG.imageTimeout || 5000)
        });
        
        if (networkResponse.ok) {
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
        
    } catch (error) {
        console.error('❌ Image fetch failed:', error);
        
        // Return enhanced placeholder image
        return getPlaceholderImage(request);
    }
}

// Enhanced dynamic content strategy
async function handleDynamicRequest(request) {
    const cache = await caches.open(DYNAMIC_CACHE);
    
    try {
        const networkResponse = await fetch(request, {
            signal: AbortSignal.timeout(CONFIG.networkTimeout || 10000)
        });
        
        if (networkResponse.ok) {
            cache.put(request, networkResponse.clone());
            console.log('🌐 Dynamic content cached:', request.url);
        }
        return networkResponse;
    } catch (error) {
        const cachedResponse = await cache.match(request);
        
        if (cachedResponse) {
            performanceMetrics.cacheHits++;
            console.log('📦 Cache hit (dynamic fallback):', request.url);
            return cachedResponse;
        }
        
        performanceMetrics.cacheMisses++;
        console.error('❌ Dynamic request failed:', error);
        return new Response('Service temporarily unavailable', { 
            status: 503,
            headers: { 'Content-Type': 'text/plain' }
        });
    }
}

// Background Sync for Quiz Results
async function syncQuizResults() {
    try {
        console.log('🔄 Syncing quiz results...');
        
        // Get pending results from IndexedDB or localStorage
        const pendingResults = JSON.parse(
            (await getFromIndexedDB('pendingQuizResults')) || '[]'
        );
        
        if (pendingResults.length === 0) {
            console.log('📊 No pending results to sync');
            return;
        }
        
        // Sync each result
        for (const result of pendingResults) {
            if (!result.synced) {
                try {
                    await syncSingleResult(result);
                    result.synced = true;
                    console.log('✅ Result synced:', result.id);
                } catch (error) {
                    console.error('❌ Failed to sync result:', error);
                }
            }
        }
        
        // Update storage
        await saveToIndexedDB('pendingQuizResults', JSON.stringify(pendingResults));
        
        console.log('✅ Quiz results sync complete');
        
    } catch (error) {
        console.error('❌ Quiz results sync failed:', error);
    }
}

async function syncSingleResult(result) {
    // Simulate API call to sync result
    const response = await fetch('/api/quiz-results', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(result)
    });
    
    if (!response.ok) {
        throw new Error('Failed to sync result');
    }
    
    return response.json();
}

// IndexedDB helpers
function getFromIndexedDB(key) {
    return new Promise((resolve) => {
        // Fallback to localStorage for simplicity
        resolve(localStorage.getItem(key));
    });
}

function saveToIndexedDB(key, value) {
    return new Promise((resolve) => {
        // Fallback to localStorage for simplicity
        localStorage.setItem(key, value);
        resolve();
    });
}

// Performance monitoring
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'PERFORMANCE_MEASURE') {
        console.log('⚡ Performance measure:', event.data.data);
    }
});

// Background cache update
async function updateCacheInBackground(request, cache) {
    try {
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            cache.put(request, networkResponse.clone());
            console.log('🔄 Background cache update:', request.url);
        }
    } catch (error) {
        console.log('🔄 Background update failed:', request.url);
    }
}

// Background image cache update with retry
async function updateImageCacheInBackground(request, cache) {
    let retries = 0;
    const maxRetries = 2;
    
    while (retries < maxRetries) {
        try {
            const networkResponse = await fetch(request, {
                signal: AbortSignal.timeout(3000)
            });
            
            if (networkResponse.ok) {
                cache.put(request, networkResponse.clone());
                console.log('🔄 Image cache updated:', request.url);
                return;
            }
        } catch (error) {
            retries++;
            if (retries < maxRetries) {
                await new Promise(resolve => setTimeout(resolve, 1000 * retries));
            }
        }
    }
    console.log('🔄 Image background update failed after retries:', request.url);
}

// Enhanced placeholder image
function getPlaceholderImage(request) {
    const url = new URL(request.url);
    const isCharacterImage = url.pathname.includes('character');
    
    const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300">
            <defs>
                <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#1a1a2e;stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#16213e;stop-opacity:1" />
                </linearGradient>
            </defs>
            <rect width="300" height="300" fill="url(#grad)"/>
            <circle cx="150" cy="120" r="40" fill="#e50914" opacity="0.8"/>
            <text x="150" y="200" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" fill="#ffffff" opacity="0.9">
                ${isCharacterImage ? 'Character' : 'Image'}
            </text>
            <text x="150" y="220" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" fill="#cccccc" opacity="0.7">
                Unavailable
            </text>
        </svg>
    `;
    
    return new Response(svg, {
        status: 200,
        headers: { 
            'Content-Type': 'image/svg+xml',
            'Cache-Control': 'no-cache'
        }
    });
}

console.log('🚀 Ultimate Marvel Quiz Service Worker loaded - Advanced PWA ready!');