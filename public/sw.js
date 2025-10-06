const CACHE_NAME = 'pdf-tools-v1'
const urlsToCache = [
  '/',
  '/tools/pdf-tools',
  '/offline.html',
  // PDF.js related
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js',
]

// Install
self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache)))
})

// Fetch
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Return cached response if available
      if (response) {
        return response
      }
      // Fetch from network
      return fetch(event.request).then((response) => {
        // Only cache valid GET requests
        if (!response || response.status !== 200 || response.type === 'error') {
          return response
        }

        // Don't cache POST requests (causes errors)
        if (event.request.method !== 'GET') {
          return response
        }

        const responseToCache = response.clone()
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache)
        })
        return response
      })
    })
  )
})

// Activate
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
})
