const CACHE_NAME = 'thrust-monitor-v10';
const urlsToCache = [
  '/',
  '/index.html',
  '/styles/globals.css'
];

console.log('[ServiceWorker] Loading v10...');

// Install service worker
self.addEventListener('install', (event) => {
  console.log('[ServiceWorker] Installing v10...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[ServiceWorker] Cache opened');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('[ServiceWorker] Installation complete');
      })
  );
  self.skipWaiting();
});

// Activate service worker
self.addEventListener('activate', (event) => {
  console.log('[ServiceWorker] Activating v10...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[ServiceWorker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
    .then(() => {
      console.log('[ServiceWorker] Activated successfully');
    })
  );
  self.clients.claim();
});

// Fetch event - network first, fallback to cache
self.addEventListener('fetch', (event) => {
  // Skip for 192.168.4.1 requests - always use network
  if (event.request.url.includes('192.168.4.1')) {
    console.log('[ServiceWorker] Skipping cache for API:', event.request.url);
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        console.log('[ServiceWorker] Network response:', event.request.url.split('/').pop());
        // Cache successful responses
        if (response && response.status === 200) {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return response;
      })
      .catch(() => {
        console.log('[ServiceWorker] Network failed, using cache:', event.request.url.split('/').pop());
        return caches.match(event.request);
      })
  );
});

console.log('[ServiceWorker] Service worker v10 ready!');
