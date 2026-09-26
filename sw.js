/* ============================================
   Chaos Button — Service Worker
   ============================================
   Strategy: pre-cache everything in install, then stale-while-revalidate
   for runtime fetches. Aggressive caching so the game works fully offline.
*/

const CACHE_VERSION = "chaos-v12";
const APP_SHELL = [
  "./",
  "./index.html",
  "./styles.css?v=20",
  "./app.js?v=20",
  "./boss.html",
  "./boss.js?v=20",
  "./manifest.json",
  "./assets/icons/icon-192.png",
  "./assets/icons/icon-512.png",
  "./assets/boss.jpg",
  "./assets/music-boss-1.mp3",
  "./assets/music-boss-2.mp3",
  "./assets/music-boss-3.mp3",

  // Fonts
  "./assets/fonts/KittyKatt.ttf",
  "./assets/fonts/StrangerThings-Outlined.ttf",
  "./assets/fonts/Benguiat-Bold.ttf",
  "./assets/fonts/GameOfSquids.ttf",

  // Shop pictures
  "./assets/images/Obama.jpg",
  "./assets/images/Isabel.webp",
  "./assets/images/Tomioka.jpg",
  "./assets/images/Muichiro.jpg",
  "./assets/images/Megumi.jpg",
  "./assets/images/Knight.jpg",
  "./assets/images/Ratón_gamer.jpg",
  "./assets/images/Nikola-Albert.webp",
  "./assets/images/medalla_de_oro.jpg",
  "./assets/images/Jesus_Payne.jpg",
  "./assets/images/foto_de_perfil.png",
  "./assets/images/Mouse_roto.png",
  "./assets/images/Trollface.png",
  "./assets/images/Gumball.jpg",
  "./assets/images/darwin.jpg",
  "./assets/images/agnes-tachyon.jpg",
  "./assets/images/pessi.jpg",
  "./assets/images/camellonaldo.jpg",
  "./assets/images/pan.jpg",
  "./assets/images/big-mac.jpg",
  "./assets/images/killian-dictador.jpg",

  // Roulette collectibles
  "./assets/images/Doge.jpg",
  "./assets/images/Agua_en_polvo.jpg",
  "./assets/images/Rengoku_dona.jpg",
  "./assets/images/Ven_paca.jpg",
  "./assets/images/Atun_con_mayonesa.jpg",

  // Coin events
  "./assets/images/Gato.jpg",
  "./assets/images/Sardina.jpg",

  // Videos
  "./assets/videos/Avioncito.mp4",
  "./assets/videos/Tesla_bailando.mp4",
  "./assets/videos/Gojo_bici.mp4",

  // Sounds
  "./assets/sounds/mouse-click-sound.mp3",
  "./assets/sounds/purchase.mp3",
  "./assets/sounds/equip.mp3",
  "./assets/sounds/powerup.mp3",
  "./assets/sounds/roulette.mp3",
  "./assets/sounds/meow.mp3",
  "./assets/sounds/splash.mp3",
  "./assets/sounds/galaxy-meme.mp3",
  "./assets/sounds/bruh.mp3",
  "./assets/sounds/ara-ara-sayonara.mp3",
  "./assets/sounds/sad-violin-the-meme-one.mp3",
  "./assets/sounds/spongebob-fail.mp3",
  "./assets/sounds/cat-laugh-meme-1.mp3",
  "./assets/sounds/windows-xp-donteflon.mp3"
];

self.addEventListener("install", function(event) {
  event.waitUntil(
    caches.open(CACHE_VERSION).then(function(cache) {
      return Promise.all(
        APP_SHELL.map(function(url) {
          return cache.add(url).catch(function(err) {
            console.warn("[SW] Failed to cache:", url, err);
          });
        })
      );
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

// Handle messages from the page (e.g. SKIP_WAITING to force-update)
self.addEventListener("message", function(event) {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

self.addEventListener("fetch", function(event) {
  var req = event.request;
  if (req.method !== "GET") return;

  var url = new URL(req.url);

  // Only handle same-origin requests (skip Google Fonts CSS, etc.)
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    caches.match(req).then(function(cached) {
      var networkFetch = fetch(req).then(function(networkRes) {
        if (networkRes && networkRes.status === 200) {
          var copy = networkRes.clone();
          caches.open(CACHE_VERSION).then(function(cache) {
            cache.put(req, copy);
          });
        }
        return networkRes;
      }).catch(function() {
        // Offline: return cached or a basic offline response
        return cached || new Response("Offline", { status: 503, statusText: "Offline" });
      });

      // Stale-while-revalidate: return cached immediately if present,
      // otherwise wait for network
      return cached || networkFetch;
    })
  );
});
