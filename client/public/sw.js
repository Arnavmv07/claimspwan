// Retire the former advertising worker at this URL, including legacy query strings.
// Keep this first-party file available so browsers can update old registrations.
self.addEventListener('install', (event) => {
    event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
    event.waitUntil((async () => {
        // Replace the old worker for open pages without reloading or redirecting them.
        await self.clients.claim();
        await self.registration.unregister();
    })());
});
