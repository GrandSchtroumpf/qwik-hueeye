const main = async () => {
  let cache;

  const fetchResponse = async (event) => {
    const req = event.request;
    // Check cache
    const cachedResponse = await caches.match(req);
    if (cachedResponse) return cachedResponse;

    // Check preload response
    const response = await event.preloadResponse;
    if (response) return response;

    // Cache and return reponse
    return fetch(req).then((res) => {
      if (req.url.includes("q-")) {
        cache.put(req, res.clone());
      }
      return res;
    })
  }

  self.addEventListener("activate", async (event) => {
    event.waitUntil(self.registration.navigationPreload?.enable());
    cache ||= await caches.open("QwikModulePreload");
  });
  self.addEventListener("message", async (message) => {
    cache ||= await caches.open("QwikModulePreload");
    if (message.data.type === "init") {
      const bundles = Array.from(new Set(message.data.value));
      cache.addAll(bundles);
    }
  });
  self.addEventListener("fetch", async (event) => {
    event.respondWith(fetchResponse(event));
  });
};
main();
addEventListener("install", () => self.skipWaiting());
addEventListener("activate", () => self.clients.claim());
