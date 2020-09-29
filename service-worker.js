// Service Worker:
const staticCacheName = 'pre-cache-v1';
const dynamicCacheName = 'runtime-cache-v1';

// Pre Caching Assets
const precacheAssets = [
    '/',
    '/font/DSDIGI.eot',
    '/font/DSDIGI.ttf',
    '/font/DSDIGI.woff',
    '/img/android-chrome-192x192.png',
    '/img/android-chrome-512x512.png',
    '/img/apple-touch-icon.png',
    '/img/favicon-16x16.png',
    '/img/favicon-32x32.png',
    '/img/favicon.ico',
    '/img/logo.png',
    '/img/mstile-150x150.png',
    '/img/safari-pinned-tab.svg',
    'browserconfig.xml',
    'index.html',
    'manifest.json',
    'pwa.js',
    'style.css',
    'script.js'
];

// INSTALL Event
self.addEventListener('install', function (event) {
    event.waitUntil(
        caches.open(staticCacheName).then(function (cache) {
            return cache.addAll(precacheAssets);
        })
    );
});

// ACTIVATE Event
self.addEventListener('activate', function (event) {
    event.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(keys
                .filter(key => key !== staticCacheName && key !== dynamicCacheName)
                .map(key => caches.delete(key))
            );
        })
    );
});

// FETCH Event
self.addEventListener('fetch', function (event) {
    event.respondWith(
        caches.match(event.request).then(cacheRes => {
            return cacheRes || fetch(event.request).then(response => {
                return caches.open(dynamicCacheName).then(function (cache) {
                    cache.put(event.request, response.clone());
                    return response;
                })
            });
        }).catch(function() {
            // Fallback Page, When No Internet Connection
            return caches.match('index.html');
          })
    );
});