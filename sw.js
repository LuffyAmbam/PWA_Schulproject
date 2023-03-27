self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open('static').then((cache) => {
            return cache.addAll(['/',
                '/index.html',
                '/manifest.json',
                '/lernziel.html',
                '/src/lernziel.js',
                '/src/category.js',
                '/kategorie.html',
                '/statistik.html',
                '/src/statistik.js',
                '/karteikarten.html',
                '/src/karteikarte.js',
                '/quiz.html',
                '/src/quiz.js',
                '/card-display.html',
                '/src/card-display.js',
                '/src/card-display.css',
                '/src/quiz.css',
                '/display-quiz.html',
                '/src/quiz-display.js',
                '/src/style.css',
                'script.js',
                '/node_modules/bootstrap/dist/js/bootstrap.js',
                '/node_modules/bootstrap/dist/js/bootstrap.bundle.js',
                '/node_modules/bootstrap/dist/js/bootstrap.bundle.min.js',
                '/node_modules/bootstrap/dist/js/bootstrap.min.js'
            ]);
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

if (Notification.permission !== "granted") {
    Notification.requestPermission().then(function (permission) {
        if (permission === "granted") {
            console.log("Notification permission granted.");
        }
    });
}

// receive message from client
self.addEventListener('message', function (event) {
    if (event.data && event.data.type === 'setDailyReminder') {
        // call setDailyReminder in lernziel.js
        event.source.postMessage({ type: 'setDailyReminder' });
    }
});



