// Mikael's Vin — service worker
// Caches the app shell on install so it works fully offline after first load.
//
// CACHE_VERSION bumps must match a release. When you change app code,
// bump this version so users automatically get the new code on next launch.

const CACHE_VERSION = 'mikaels-vin-v1.4.0';

// Files that make up the app shell. Same-origin only.
const APP_SHELL = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './apple-touch-icon.png',
  './favicon.png',
];

// External CDN libraries the app loads. These get cached too so the
// app works offline once loaded once with internet.
const CDN_ASSETS = [
  'https://cdn.jsdelivr.net/npm/qrcode-generator@1.4.4/qrcode.min.js',
  // Fraunces + Inter from Google Fonts (the CSS file)
  'https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght,FILL@9..144,300..600,0..1&family=Inter:wght@400..600&display=swap',
];

// ---------- Install: pre-cache the app shell ----------
self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_VERSION);
      // Cache the local app shell — must succeed
      try {
        await cache.addAll(APP_SHELL);
      } catch (e) {
        console.error('[SW] Failed to cache app shell:', e);
      }
      // Cache external assets — best effort, don't fail install if these don't load
      await Promise.allSettled(
        CDN_ASSETS.map(async (url) => {
          try {
            const response = await fetch(url, { mode: 'no-cors' });
            await cache.put(url, response);
          } catch (e) {
            console.warn('[SW] Could not pre-cache', url, e);
          }
        })
      );
      // Activate immediately rather than waiting for tabs to close
      await self.skipWaiting();
    })()
  );
});

// ---------- Activate: clean up old caches ----------
self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((k) => k !== CACHE_VERSION)
          .map((k) => caches.delete(k))
      );
      await self.clients.claim();
    })()
  );
});

// ---------- Fetch: cache-first with network fallback ----------
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Only handle GET requests
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // Never intercept Dropbox API calls — those need to talk to the live API
  // and shouldn't be cached.
  if (url.hostname.includes('dropboxapi.com') || url.hostname.includes('dropbox.com')) {
    return;
  }

  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE_VERSION);

      // For navigation requests (HTML), prefer network first so users get
      // updates quickly. Fall back to cached index.html if offline.
      if (request.mode === 'navigate') {
        try {
          const fresh = await fetch(request);
          // Cache the fresh response for offline use
          cache.put(request, fresh.clone()).catch(() => {});
          return fresh;
        } catch (e) {
          // Offline — serve cached index
          const cached = await cache.match('./index.html') || await cache.match('./');
          if (cached) return cached;
          throw e;
        }
      }

      // For everything else: cache first, then network
      const cached = await cache.match(request);
      if (cached) {
        // Background refresh — pull a new copy without blocking the response
        fetch(request)
          .then((fresh) => {
            if (fresh && fresh.status === 200) {
              cache.put(request, fresh).catch(() => {});
            }
          })
          .catch(() => {});
        return cached;
      }

      // Not in cache — fetch from network and cache the result
      try {
        const fresh = await fetch(request);
        if (fresh && fresh.status === 200) {
          cache.put(request, fresh.clone()).catch(() => {});
        }
        return fresh;
      } catch (e) {
        // Network failed, nothing cached — return a basic 503 response
        return new Response('Offline and not in cache', {
          status: 503,
          headers: { 'Content-Type': 'text/plain' },
        });
      }
    })()
  );
});

// ---------- Message: allow the page to trigger updates ----------
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
