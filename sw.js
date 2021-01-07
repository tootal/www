let urlsToCache = [
  '/',
  '/index.html',
  '/index.js'
];
let CACHE_NAME = 'tootal-store';

self.addEventListener('install', function(e) {
  console.log('install');
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE_NAME)
          .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', function(e) {
  e.respondWith(
    caches.match(e.request)
          .then(response => response || fetch(e.request))
  );
});

self.addEventListener('activate', function(e) {
  console.log('activate');
  let cacheWhiteList = [CACHE_NAME];
  e.waitUntil(
    caches.keys().then(function(names) {
      return Promise.all(
        names.map(function(name) {
          if (cacheWhiteList.indexOf(name) === -1) {
            console.log('delete cache ' + name);
            return caches.delete(name);
          }
        })
      )
    })
  )
});
