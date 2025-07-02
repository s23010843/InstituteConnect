const CACHE_NAME = 'excellence-institute-v1';
const STATIC_CACHE_NAME = 'excellence-static-v1';
const DYNAMIC_CACHE_NAME = 'excellence-dynamic-v1';

// Assets to cache on install
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&family=Roboto+Slab:wght@400;500;700&display=swap',
  'https://fonts.googleapis.com/icon?family=Material+Icons',
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then((cache) => {
        console.log('Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        return self.skipWaiting();
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE_NAME && cacheName !== DYNAMIC_CACHE_NAME) {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Handle API requests
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Clone response for caching
          const responseClone = response.clone();
          
          // Cache successful responses
          if (response.status === 200) {
            caches.open(DYNAMIC_CACHE_NAME)
              .then((cache) => {
                cache.put(request, responseClone);
              });
          }
          
          return response;
        })
        .catch(() => {
          // Return cached response if network fails
          return caches.match(request);
        })
    );
    return;
  }

  // Handle static assets and pages
  event.respondWith(
    caches.match(request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }

        // Fetch from network and cache
        return fetch(request)
          .then((response) => {
            // Don't cache non-successful responses
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response
            const responseToCache = response.clone();

            // Determine which cache to use
            const cacheName = STATIC_ASSETS.includes(request.url) 
              ? STATIC_CACHE_NAME 
              : DYNAMIC_CACHE_NAME;

            caches.open(cacheName)
              .then((cache) => {
                cache.put(request, responseToCache);
              });

            return response;
          })
          .catch(() => {
            // Return offline page for navigation requests
            if (request.mode === 'navigate') {
              return caches.match('/');
            }
          });
      })
  );
});

// Background sync for offline form submissions
self.addEventListener('sync', (event) => {
  console.log('Background sync triggered:', event.tag);
  
  if (event.tag === 'contact-form') {
    event.waitUntil(syncContactForms());
  }
});

// Sync contact forms when back online
async function syncContactForms() {
  try {
    const db = await openDB();
    const transaction = db.transaction(['contactForms'], 'readonly');
    const store = transaction.objectStore('contactForms');
    const forms = await store.getAll();

    for (const form of forms) {
      try {
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(form.data),
        });

        if (response.ok) {
          // Remove from offline storage
          const deleteTransaction = db.transaction(['contactForms'], 'readwrite');
          const deleteStore = deleteTransaction.objectStore('contactForms');
          await deleteStore.delete(form.id);
        }
      } catch (error) {
        console.error('Failed to sync form:', error);
      }
    }
  } catch (error) {
    console.error('Background sync failed:', error);
  }
}

// Simple IndexedDB wrapper for offline storage
function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('ExcellenceInstituteDB', 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      
      if (!db.objectStoreNames.contains('contactForms')) {
        const store = db.createObjectStore('contactForms', { keyPath: 'id', autoIncrement: true });
        store.createIndex('timestamp', 'timestamp', { unique: false });
      }
    };
  });
}

// Push notification handling
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'New notification from Excellence Institute',
    icon: '/manifest.json',
    badge: '/manifest.json',
    tag: 'excellence-notification',
    data: {
      url: '/',
    },
    actions: [
      {
        action: 'open',
        title: 'Open App',
      },
      {
        action: 'close',
        title: 'Close',
      },
    ],
  };

  event.waitUntil(
    self.registration.showNotification('Excellence Institute', options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'open' || !event.action) {
    event.waitUntil(
      clients.openWindow(event.notification.data?.url || '/')
    );
  }
});

// Periodic background sync for updates
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(performBackgroundSync());
  }
});

async function performBackgroundSync() {
  try {
    // Update cached data
    const cache = await caches.open(DYNAMIC_CACHE_NAME);
    const requests = [
      '/api/programs',
      '/api/faculty',
    ];

    for (const request of requests) {
      try {
        const response = await fetch(request);
        if (response.ok) {
          await cache.put(request, response);
        }
      } catch (error) {
        console.error('Failed to update cache for:', request, error);
      }
    }
  } catch (error) {
    console.error('Background sync failed:', error);
  }
}

// Handle offline form submissions
self.addEventListener('message', (event) => {
  if (event.data.action === 'CACHE_FORM_DATA') {
    cacheFormData(event.data.formData);
  }
});

async function cacheFormData(formData) {
  try {
    const db = await openDB();
    const transaction = db.transaction(['contactForms'], 'readwrite');
    const store = transaction.objectStore('contactForms');
    
    await store.add({
      data: formData,
      timestamp: Date.now(),
    });

    // Register for background sync
    await self.registration.sync.register('contact-form');
  } catch (error) {
    console.error('Failed to cache form data:', error);
  }
}
