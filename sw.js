const CACHE_NAME = 'falcon-lab-v1';
const ASSETS_TO_CACHE = [
  'index.html',
  'bcc.png',
  'JMM-Lab.png',
  'manifest.json'
];

// 1. Install phase: Cache all necessary files
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  // Force the waiting service worker to become active immediately
  self.skipWaiting();
});

// 2. Activate phase: Clean up old caches and take control
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      );
    })
  );
  // Take control of all pages immediately
  self.clients.claim();
});

// 3. Fetch phase: Network-First strategy (gets newest code if online, falls back to cache if offline)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});
