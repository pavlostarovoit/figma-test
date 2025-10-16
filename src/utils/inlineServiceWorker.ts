/**
 * Inline Service Worker for Figma Make
 * 
 * Creates service worker as a blob URL since Figma Make doesn't serve static files correctly.
 * This is the ONLY way to get service workers working in Figma Make's preview environment.
 */

/**
 * Service Worker code as a string
 * Matches the working example - network-first strategy
 */
const SERVICE_WORKER_CODE = `
const CACHE_NAME = 'thrust-monitor-v10';
const urlsToCache = [
  '/',
  '/index.html',
  '/styles/globals.css'
];

console.log('[ServiceWorker] Loading v10 (inline)...');

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
      .catch((err) => {
        console.error('[ServiceWorker] Cache failed:', err);
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

console.log('[ServiceWorker] Service worker v10 ready (inline)!');
`;

/**
 * Register inline service worker (blob URL)
 */
export async function registerInlineServiceWorker(): Promise<ServiceWorkerRegistration> {
  if (!('serviceWorker' in navigator)) {
    throw new Error('Service workers not supported');
  }

  try {
    console.log('[PWA] Creating inline service worker...');
    
    // Create blob from service worker code
    const blob = new Blob([SERVICE_WORKER_CODE], { type: 'application/javascript' });
    const blobURL = URL.createObjectURL(blob);
    
    console.log('[PWA] Service worker blob created');
    console.log('[PWA] Registering from blob URL...');
    
    // Register the blob URL as service worker
    const registration = await navigator.serviceWorker.register(blobURL, {
      scope: '/',
      updateViaCache: 'none'
    });
    
    console.log('[PWA] ✅ Inline service worker registered');
    
    // Wait for activation
    if (registration.installing) {
      await new Promise<void>((resolve) => {
        registration.installing!.addEventListener('statechange', function handler(e) {
          const sw = e.target as ServiceWorker;
          if (sw.state === 'activated') {
            sw.removeEventListener('statechange', handler);
            resolve();
          }
        });
      });
    }
    
    return registration;
    
  } catch (error) {
    console.error('[PWA] ❌ Inline service worker registration failed:', error);
    throw error;
  }
}
