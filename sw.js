const CACHE_NAME = 'bk4301fl-guide-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/index.tsx',
  '/types.ts',
  '/App.tsx',
  // Note: In a real build, we wouldn't cache TSX files, but for this specific 
  // no-build setup using importmap/Babel in browser, we cache source files.
];

// Install event - cache core assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - Network first, falling back to cache
// This strategy is best for content that updates but needs offline support
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Strategy for external CDNs (esm.sh, tailwind, fonts, picsum)
  // Cache First, then Network (since libraries don't change often)
  if (url.hostname.includes('esm.sh') || 
      url.hostname.includes('tailwindcss.com') ||
      url.hostname.includes('googleapis.com') ||
      url.hostname.includes('gstatic.com') || 
      url.hostname.includes('picsum.photos') ||
      url.hostname.includes('flaticon.com')) {
    
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(event.request).then((response) => {
          // Check if we received a valid response
          if (!response || response.status !== 200 || response.type !== 'basic' && response.type !== 'cors') {
            return response;
          }

          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });

          return response;
        });
      })
    );
    return;
  }

  // Default strategy for local files: Stale-While-Revalidate
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        if(networkResponse && networkResponse.status === 200) {
           const responseToCache = networkResponse.clone();
           caches.open(CACHE_NAME).then((cache) => {
             cache.put(event.request, responseToCache);
           });
        }
        return networkResponse;
      }).catch(() => {
        // Network failed
      });

      return cachedResponse || fetchPromise;
    })
  );
});