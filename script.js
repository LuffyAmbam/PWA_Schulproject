// Registrieren des Service Workers
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
        navigator.serviceWorker.register('/sw.js').then(function (registration) {
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
        }, function (err) {
            console.log('ServiceWorker registration failed: ', err);
        });
    });
}

// Anfordern von Berechtigungen für Push-Benachrichtigungen
if ('Notification' in window) {
    Notification.requestPermission().then(function (result) {
        if (result === 'denied') {
            console.log('Notification permission denied');
            return;
        } else if (result === 'default') {
            console.log('Notification permission prompt dismissed');
            return;
        }

        console.log('Notification permission granted');
        // Hier können Push-Benachrichtigungen gesendet werden
    });
}