function initializeApp() {
    let db;
    const dbName = 'lernApp';
    const dbVersion = 1;

    const request = indexedDB.open(dbName, dbVersion);

    request.onerror = function (event) {
        console.error('Fehler beim Öffnen der Datenbank');
    };

    request.onsuccess = function (event) {
        db = event.target.result;
        console.log('Datenbank erfolgreich geöffnet');
    };

    request.onupgradeneeded = function (event) {
        const db = event.target.result;

        // Tabelle Karteikarte erstellen, falls sie noch nicht existiert
        if (!db.objectStoreNames.contains('Karteikarte')) {
            const objectStore = db.createObjectStore('Karteikarte', { keyPath: 'KarteikartenID', autoIncrement: true });
            objectStore.createIndex('begriffText', 'begriffText', { unique: false });
            objectStore.createIndex('rating', 'rating', { unique: false });
            objectStore.createIndex('kategorieID', 'kategorieID', { unique: false });
        }

        // Tabelle Kategorie erstellen, falls sie noch nicht existiert
        if (!db.objectStoreNames.contains('Kategorie')) {
            const objectStore = db.createObjectStore('Kategorie', { keyPath: 'kategorieID', autoIncrement: true });
            objectStore.createIndex('kategorieName', 'kategorieName', { unique: false });
        }

        // Tabelle Quiz erstellen, falls sie noch nicht existiert
        if (!db.objectStoreNames.contains('Quiz')) {
            const objectStore = db.createObjectStore('Quiz', { keyPath: 'quizID', autoIncrement: true });
            objectStore.createIndex('quizName', 'quizName', { unique: false });
        }

        // Tabelle FRAGE erstellen, falls sie noch nicht existiert
        if (!db.objectStoreNames.contains('FRAGE')) {
            const objectStore = db.createObjectStore('FRAGE', { keyPath: 'frageID', autoIncrement: true });
            objectStore.createIndex('frageText', 'frageText', { unique: false });
            objectStore.createIndex('quizID', 'quizID', { unique: false });
        }
        // Tabelle Antwort erstellen, falls sie noch nicht existiert
        if (!db.objectStoreNames.contains('Antwort')) {
            const objectStore = db.createObjectStore('Antwort', { keyPath: 'AntwortID', autoIncrement: true });
            objectStore.createIndex('antwortText', 'antwortText', { unique: false });
            objectStore.createIndex('korrekt', 'korrekt', { unique: false });
            objectStore.createIndex('frageID', 'frageID', { unique: false });
        }
    };
}
document.addEventListener("DOMContentLoaded", function (event) {
    initializeApp();
});
