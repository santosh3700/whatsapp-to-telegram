const CACHE_NAME = "wa2tg-v2";
const APP_SHELL = [
  "/",
  "/index.html",
  "/script.js",
  "/styles.css",
  "/manifest.json",
  "/icons/icon-192x192.png",
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)));
});

// Add notification click handler
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: "window" }).then((clientList) => {
      if (clientList.length > 0) {
        return clientList[0].focus();
      }
      return clients.openWindow("/");
    })
  );
});
