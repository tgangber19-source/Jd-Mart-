const CACHE_NAME = "jdmart-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/manifest.json",
  "/icon192.png",
  "/icon512.png",
  "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css",
  "https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700;800&display=swap"
];

// 1. INSTALL: App ki design files ko cache me daalo
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting();
});

// 2. ACTIVATE: Purana cache saaf karo (Version control)
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// 3. FETCH: Yaha asli logic hai
self.addEventListener("fetch", (event) => {
  
  // RULE 1: Agar request Firebase (Database) ki hai, to use Cache mat karo.
  // Isse Price aur Product update turant honge.
  if (event.request.url.includes("firebaseio.com")) {
    return; // Direct Internet se laao
  }

  // RULE 2: Baaki files (HTML, CSS, Icons) ko Cache se uthao (Fast Loading ke liye)
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response; // Cache se mila
      }
      return fetch(event.request); // Nahi to internet se laao
    })
  );
});
