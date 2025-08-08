// Service Worker para PWA - Gabinete Digital
const CACHE_NAME = 'gabinete-digital-v1.0';
const urlsToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/responsive-complete.css',
  '/layout-fixes.css',
  '/elegant-layout.css',
  '/script.js',
  '/site_loader_unified.js',
  '/logo.png',
  '/vereador.png',
  '/manifest.json'
];

// Instalar Service Worker
self.addEventListener('install', function(event) {
  console.log('📱 PWA: Service Worker instalando...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('📱 PWA: Cache aberto');
        return cache.addAll(urlsToCache);
      })
  );
});

// Ativar Service Worker
self.addEventListener('activate', function(event) {
  console.log('📱 PWA: Service Worker ativado');
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName !== CACHE_NAME) {
            console.log('📱 PWA: Removendo cache antigo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Interceptar requisições
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Cache hit - retorna resposta
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});