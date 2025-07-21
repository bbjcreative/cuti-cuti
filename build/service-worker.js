const CACHE_NAME = 'holiday-man-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/tailwind.css',
  '/manifest.json',
  // Add other static assets you want to cache for offline use
  // e.g., '/static/js/bundle.js', '/static/css/main.css', images, etc.
  // For a React app, typically the 'build' output should be listed here
  // when you move to production. For development, this is a basic setup.
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});

self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});