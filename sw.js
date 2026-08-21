const CACHE_NAME = "flare-u-global-v1";

self.addEventListener("install", event => {
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    self.clients.claim()
  );
});

self.addEventListener("fetch", event => {
  // Biarkan request berjalan normal untuk sekarang.
});