const main = async () => {
  let cache;

  const fetchResponse = async (req) => {
    // Check cache
    const cachedResponse = await caches.match(req);
    if (cachedResponse) return cachedResponse;

    // Cache and return reponse
    return fetch(req).then((res) => {
      if (req.url.includes("q-") && req.url.endsWith('.js')) {
        cache.put(req, res.clone());
      }
      return res;
    })
  }

  self.addEventListener("activate", async (event) => {
    event.waitUntil(caches.open("QwikModulePreload"));
    // event.waitUntil(self.registration.navigationPreload?.enable());
  });
  self.addEventListener("message", async (message) => {
    if (message.data.type === "init") {
      cache ||= await caches.open("QwikModulePreload");
      new Set(message.data.value).forEach(url => {
        // force-cache to use disk cache if modulepreload was already executed
        return fetchResponse(new Request(url, { cache: 'force-cache' }));
      });
    }
  });
  self.addEventListener("fetch", async (event) => {
    cache ||= await caches.open("QwikModulePreload");
    event.respondWith(fetchResponse(event.request));
  });
};
main();
addEventListener("install", () => self.skipWaiting());
addEventListener("activate", () => self.clients.claim());
