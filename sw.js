self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open('static').then((cache) => {
            return cache.addAll(['/',
                '/index.html',
                '/karteikarten.html',
                'src/style.css',
                'src/karteikarte.js',
                'img/logoS.png',
                'node_modules/bootstrap/dist/css/bootstrap.min.css',]);
        })
    );
    console.log('Service Worker: Installed');
});

// Listen for a fetch event
self.addEventListener("fetch", (e) => {
    // Intercept the fetch event and respond with the cached version of the requested file
    e.respondWith(
        // Check if the file is already in the cache
        caches.match(e.request).then((response) => {
            // If it is, return the response from the cache
            return response || fetch(e.request);
        })
    );
}); 