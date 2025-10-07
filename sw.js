// Service Worker for Advanced HTML Features Repository
const CACHE_NAME = 'advanced-html-v1.0.0';
const STATIC_CACHE = 'static-v1.0.0';
const DYNAMIC_CACHE = 'dynamic-v1.0.0';

// Resources to cache immediately
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/manifest.json',
    '/assets/css/main.css',
    '/assets/js/main.js',
    '/assets/images/favicon.svg',
    '/assets/images/icon-192.png',
    '/assets/images/icon-512.png',
    // Add other critical assets
];

// Resources to cache on demand
const DYNAMIC_ASSETS = [
    '/pages/',
    '/assets/images/',
    '/assets/audio/',
    '/assets/video/'
];

// Install event - cache static assets
self.addEventListener('install', event => {
    console.log('Service Worker: Installing...');

    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then(cache => {
                console.log('Service Worker: Caching static assets');
                return cache.addAll(STATIC_ASSETS);
            })
            .then(() => {
                console.log('Service Worker: Static assets cached');
                return self.skipWaiting();
            })
            .catch(error => {
                console.error('Service Worker: Cache failed', error);
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
    console.log('Service Worker: Activating...');

    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if (cache !== STATIC_CACHE && cache !== DYNAMIC_CACHE) {
                        console.log('Service Worker: Deleting old cache', cache);
                        return caches.delete(cache);
                    }
                })
            );
        }).then(() => {
            console.log('Service Worker: Activated');
            return self.clients.claim();
        })
    );
});

// Fetch event - serve cached content when offline
self.addEventListener('fetch', event => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip non-GET requests
    if (request.method !== 'GET') return;

    // Skip cross-origin requests
    if (url.origin !== location.origin) return;

    event.respondWith(
        caches.match(request)
            .then(response => {
                // Return cached version if available
                if (response) {
                    console.log('Service Worker: Serving from cache', request.url);
                    return response;
                }

                // Otherwise fetch from network
                return fetch(request)
                    .then(fetchResponse => {
                        // Check if valid response
                        if (!fetchResponse || fetchResponse.status !== 200 || fetchResponse.type !== 'basic') {
                            return fetchResponse;
                        }

                        // Clone response for caching
                        const responseClone = fetchResponse.clone();

                        // Cache dynamic content
                        if (shouldCacheDynamically(request.url)) {
                            caches.open(DYNAMIC_CACHE)
                                .then(cache => {
                                    console.log('Service Worker: Caching dynamic asset', request.url);
                                    cache.put(request, responseClone);
                                });
                        }

                        return fetchResponse;
                    })
                    .catch(error => {
                        console.log('Service Worker: Fetch failed, serving offline page', error);

                        // Serve offline page for navigation requests
                        if (request.mode === 'navigate') {
                            return caches.match('/offline.html') || createOfflineResponse();
                        }

                        // Serve placeholder for images
                        if (request.destination === 'image') {
                            return createPlaceholderImage();
                        }

                        throw error;
                    });
            })
    );
});

// Helper function to determine if resource should be cached dynamically
function shouldCacheDynamically(url) {
    return DYNAMIC_ASSETS.some(pattern => url.includes(pattern));
}

// Create offline response
function createOfflineResponse() {
    return new Response(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Offline - Advanced HTML Features</title>
            <style>
                body {
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    min-height: 100vh;
                    margin: 0;
                    background: linear-gradient(135deg, #2196F3, #1976D2);
                    color: white;
                    text-align: center;
                    padding: 20px;
                }
                .offline-icon {
                    font-size: 4rem;
                    margin-bottom: 2rem;
                }
                h1 {
                    font-size: 2.5rem;
                    margin-bottom: 1rem;
                }
                p {
                    font-size: 1.2rem;
                    margin-bottom: 2rem;
                    opacity: 0.9;
                }
                .retry-btn {
                    background: #FFC107;
                    color: #212121;
                    border: none;
                    padding: 12px 24px;
                    border-radius: 8px;
                    font-size: 1rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: transform 0.2s ease;
                }
                .retry-btn:hover {
                    transform: translateY(-2px);
                }
            </style>
        </head>
        <body>
            <div class="offline-icon">🌐</div>
            <h1>You're Offline</h1>
            <p>This page is not available offline. Please check your internet connection and try again.</p>
            <button class="retry-btn" onclick="window.location.reload()">Retry</button>
        </body>
        </html>
    `, {
        headers: {
            'Content-Type': 'text/html'
        }
    });
}

// Create placeholder image
function createPlaceholderImage() {
    return new Response(
        `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
            <rect width="400" height="300" fill="#f0f0f0"/>
            <text x="200" y="150" text-anchor="middle" dy=".3em" fill="#999" font-family="Arial, sans-serif" font-size="18">
                Image unavailable offline
            </text>
        </svg>`,
        {
            headers: {
                'Content-Type': 'image/svg+xml'
            }
        }
    );
}

// Background sync for future enhancement
self.addEventListener('sync', event => {
    if (event.tag === 'background-sync') {
        console.log('Service Worker: Background sync triggered');
        event.waitUntil(doBackgroundSync());
    }
});

// Placeholder for background sync functionality
async function doBackgroundSync() {
    // Implement background sync logic here
    // e.g., send queued form data, update content, etc.
}

// Push notification handler
self.addEventListener('push', event => {
    if (!event.data) return;

    const data = event.data.json();
    const options = {
        body: data.body,
        icon: '/assets/images/icon-192.png',
        badge: '/assets/images/badge-72.png',
        vibrate: [200, 100, 200],
        data: data.data,
        actions: [
            {
                action: 'explore',
                title: 'Explore',
                icon: '/assets/images/action-explore.png'
            },
            {
                action: 'dismiss',
                title: 'Dismiss',
                icon: '/assets/images/action-dismiss.png'
            }
        ]
    };

    event.waitUntil(
        self.registration.showNotification(data.title, options)
    );
});

// Notification click handler
self.addEventListener('notificationclick', event => {
    event.notification.close();

    if (event.action === 'explore') {
        event.waitUntil(
            clients.openWindow('/#demos')
        );
    } else if (event.action !== 'dismiss') {
        event.waitUntil(
            clients.openWindow('/')
        );
    }
});

// Message handler for communication with main thread
self.addEventListener('message', event => {
    if (event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }

    if (event.data.type === 'GET_VERSION') {
        event.ports[0].postMessage({
            version: CACHE_NAME
        });
    }

    if (event.data.type === 'CLEAR_CACHE') {
        event.waitUntil(
            caches.keys().then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cache => caches.delete(cache))
                );
            })
        );
    }
});

console.log('Service Worker: Loaded');