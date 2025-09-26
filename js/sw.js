const CACHE_NAME = 'dnd-near';

// Just cache the main page on install
self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function(cache) {
                console.log('Opened cache');
                // Only pre-cache the main page
                return cache.add('/');
            })
    );
});

// Fetch event - cache resources as they're requested
self.addEventListener('fetch', function(event) {
    // Only cache same-origin requests (your app files)
    if (event.request.url.startsWith(self.location.origin)) {
        event.respondWith(
            caches.match(event.request)
                .then(function(response) {
                    // Return cached version if available
                    if (response) {
                        return response;
                    }
                    
                    // Otherwise fetch from network and cache it
                    return fetch(event.request).then(function(response) {
                        // Don't cache non-successful responses
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }
                        
                        // Clone the response since it can only be consumed once
                        const responseToCache = response.clone();
                        
                        caches.open(CACHE_NAME)
                            .then(function(cache) {
                                cache.put(event.request, responseToCache);
                            });
                        
                        return response;
                    });
                })
        );
    }
});

// Activate event - clean up old caches
self.addEventListener('activate', function(event) {
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.map(function(cacheName) {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});