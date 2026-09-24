/* ============================================
   Chaos Button — Service Worker
   ============================================
   Strategy: cache-first for app shell, network-first for everything else.
   Update flow: new SW takes over on next page load (skipWaiting + clientsClaim).
*/

const CACHE_VERSION = "chaos-v1";
const APP_SHELL = [
  "./",
  "./index.html",
  "./styles.css?v=8",
  "./app.js?v=8",
  "./manifest.json",
  "./assets/fonts/KittyKatt.ttf",
  "./assets/fonts/StrangerThings-Outlined.ttf",
  "./assets/fonts/Benguiat-Bold.ttf",
  "./assets/fonts/GameOfSquids.ttf",
  "./assets/icons/icon-192.png",
  "./assets/icons/icon-512.png"
];

self.addEventListener("install", function(event) {
  event.waitUntil(
    caches.open(CACHE_VERSION).then(function(cache) {
      return cache.addAll(APP_SHELL).catch(function(err) {
        console.warn("[SW] Some app shell assets failed to cache:", err);
        return Promise.all(
          APP_SHELL.map(function(url) {
            return cache.add(url).catch(function() {});
          })
        );
      });
    }).then(function() {
      return self.skipWaiting();
    })
  );
});

self.addEventListener("activate", function(event) {
  event.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(k) { return k !== CACHE_VERSION; })
            .map(function(k) { return caches.delete(k); })
      );
    }).then(function() {
      return self.clients.claim();
    })
  );
});

self.addEventListener("fetch", function(event) {
  var req = event.request;
  if (req.method !== "GET") return;

  var url = new URL(req.url);

  if (url.origin !== self.location.origin) return;

  var isNavigation = req.mode === "navigate";
  var isAsset = /\.(css|js|html|json|png|jpg|jpeg|webp|svg|gif|woff2?|ttf|mp3|mp4|webm)$/i.test(url.pathname);

  if (isNavigation || isAsset) {
    event.respondWith(
      caches.match(req).then(function(cached) {
        var fetchPromise = fetch(req).then(function(networkRes) {
          if (networkRes && networkRes.status === 200) {
            var copy = networkRes.clone();
            caches.open(CACHE_VERSION).then(function(cache) {
              cache.put(req, copy);
            });
          }
          return networkRes;
        }).catch(function() {
          return cached;
        });
        return cached || fetchPromise;
      })
    );
  }
});
