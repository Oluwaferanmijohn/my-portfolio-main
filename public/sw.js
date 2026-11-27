const CACHE_VERSION = "portfolio-v2";
const SHELL_CACHE = `${CACHE_VERSION}-shell`;
const PAGE_CACHE = `${CACHE_VERSION}-pages`;
const ASSET_CACHE = `${CACHE_VERSION}-assets`;
const CACHE_NAMES = [SHELL_CACHE, PAGE_CACHE, ASSET_CACHE];

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(caches.open(SHELL_CACHE).then((cache) => cache.addAll(["/offline.html", "/manifest.webmanifest", "/icons/icon-192.png"])));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(Promise.all([
    self.clients.claim(),
    caches.keys().then((names) => Promise.all(names.filter((name) => !CACHE_NAMES.includes(name)).map((name) => caches.delete(name)))),
  ]));
});

async function trimCache(cache, maxEntries) {
  const keys = await cache.keys();
  if (keys.length > maxEntries) await Promise.all(keys.slice(0, keys.length - maxEntries).map((key) => cache.delete(key)));
}

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  const sameOrigin = url.origin === self.location.origin;
  if (request.mode === "navigate" && sameOrigin) {
    if (url.pathname.startsWith("/dashboard")) {
      event.respondWith(fetch(request).catch(() => caches.match("/offline.html")));
      return;
    }
    event.respondWith((async () => {
      try {
        const response = await fetch(request);
        if (response.ok && response.type === "basic") {
          const cache = await caches.open(PAGE_CACHE);
          event.waitUntil(cache.put(request, response.clone()).then(() => trimCache(cache, 30)));
        }
        return response;
      } catch {
        return (await caches.match(request)) || (await caches.match("/offline.html"));
      }
    })());
    return;
  }
  if (sameOrigin && (url.pathname.startsWith("/api/") || url.pathname.startsWith("/dashboard"))) return;
  const isStaticAsset = sameOrigin && (url.pathname.startsWith("/_nuxt/") || url.pathname.startsWith("/images/") || url.pathname.startsWith("/icons/"));
  const isPublicImage = request.destination === "image";
  if (isStaticAsset || isPublicImage) {
    event.respondWith((async () => {
      const cache = await caches.open(ASSET_CACHE);
      const cached = await cache.match(request);
      if (cached) return cached;
      const response = await fetch(request);
      if (response.ok || response.type === "opaque") {
        event.waitUntil(cache.put(request, response.clone()).then(() => trimCache(cache, 100)));
      }
      return response;
    })());
  }
});

self.addEventListener("push", (event) => {
  let data = {};
  try { data = event.data?.json() || {}; } catch { data = { body: event.data?.text() || "You have a new portfolio message." }; }
  event.waitUntil(self.registration.showNotification(data.title || "New portfolio message", {
    body: data.body || "A new contact message arrived.",
    icon: "/icons/icon-192.png",
    badge: "/icons/icon-192.png",
    tag: data.tag || "portfolio-message",
    data: { url: data.url || "/dashboard" },
  }));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const target = new URL(event.notification.data?.url || "/dashboard", self.location.origin).href;
  event.waitUntil(self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients) => {
    const existing = clients.find((client) => client.url === target);
    return existing ? existing.focus() : self.clients.openWindow(target);
  }));
});
