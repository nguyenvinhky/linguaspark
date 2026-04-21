// Service worker for LinguaSpark — minimal cache-first with Groq API bypass.
// Bump CACHE_NAME when you change cached-asset contents so old clients refresh.

const CACHE_NAME = 'linguaspark-v2';
// Replaced by the deploy workflow (sed) with ${{ github.sha }} — keep the literal
// token on a new line so the match stays simple. Stays as placeholder in local dev.
const COMMIT_SHA = '__COMMIT_SHA__';

// Shell assets precached on install. Third-party CDNs (Tailwind, Google Fonts)
// are cached on first fetch instead of here to avoid brittle install-time failures.
const SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icon.svg',
];

self.addEventListener('install', (event) => {
  // Do NOT call skipWaiting() here — we want the page to see the waiting worker
  // and prompt the user before the upgrade replaces the active version.
  // The page posts {type:'SKIP_WAITING'} after the user confirms (see message handler below).
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

// Page <-> SW message handler.
// `SKIP_WAITING`: posted after the user clicks "Reload" in the update banner.
// `GET_VERSION`:  returns CACHE_NAME via MessagePort so Settings can display it.
self.addEventListener('message', (event) => {
  const msg = event.data;
  if (!msg) return;
  if (msg.type === 'SKIP_WAITING') {
    self.skipWaiting();
    return;
  }
  if (msg.type === 'GET_VERSION') {
    event.ports[0]?.postMessage({ version: CACHE_NAME, commit: COMMIT_SHA });
  }
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // Never intercept Groq API — always network, never cached. Sentences must be fresh.
  if (url.hostname === 'api.groq.com') return;

  // Only GETs are cacheable.
  if (req.method !== 'GET') return;

  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req).then((res) => {
        if (res && res.status === 200) {
          const clone = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, clone));
        }
        return res;
      }).catch(() => cached);  // offline: serve whatever we have (may be undefined)
    })
  );
});
