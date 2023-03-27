let db = null;

const request = indexedDB.open("lernApp", 1);

request.addEventListener("upgradeneeded", (event) => {
    db = event.target.result;
    // Karteikarte object store
    if (!db.objectStoreNames.contains("Karteikarte")) {
        const objectStore = db.createObjectStore("Karteikarte", {
            keyPath: "KarteikartenID",
            autoIncrement: true,
        });
        objectStore.createIndex("begriffText", "begriffText", { unique: false });
        objectStore.createIndex("beschreibungText", "beschreibungText", { unique: false });
        objectStore.createIndex("rating", "rating", { unique: false });
        objectStore.createIndex("kategorieID", "kategorieID", { unique: false });
    }
    // Kategorie object store
    if (!db.objectStoreNames.contains("Kategorie")) {
        const objectStore = db.createObjectStore("Kategorie", {
            keyPath: "kategorieID",
            autoIncrement: true,
        });
        objectStore.createIndex("kategorieName", "kategorieName", {
            unique: false,
        });
    }
    // Quiz object store
    if (!db.objectStoreNames.contains("Quiz")) {
        const objectStore = db.createObjectStore("Quiz", {
            keyPath: "quizID",
            autoIncrement: true,
        });
        objectStore.createIndex("quizName", "quizName", { unique: false });
    }

    // FRAGE object store
    if (!db.objectStoreNames.contains("FRAGE")) {
        const objectStore = db.createObjectStore("FRAGE", {
            keyPath: "frageID",
            autoIncrement: true,
        });
        objectStore.createIndex("frageText", "frageText", { unique: false });
        objectStore.createIndex("quizID", "quizID", { unique: false });
    }

    // Antwort object store
    if (!db.objectStoreNames.contains("Antwort")) {
        const objectStore = db.createObjectStore("Antwort", {
            keyPath: "AntwortID",
            autoIncrement: true,
        });
        objectStore.createIndex("antwortText", "antwortText", { unique: false });
        objectStore.createIndex("korrekt", "korrekt", { unique: false });
        objectStore.createIndex("frageID", "frageID", { unique: false });
    }
    // Lernziel object store
    if (!db.objectStoreNames.contains("Lernziel")) {
        const objectStore = db.createObjectStore("Lernziel", {
            keyPath: "lernzielID",
            autoIncrement: true
        });
        objectStore.createIndex("kategorieID", "kategorieID", { unique: false });
        objectStore.createIndex("zieldatum", "zieldatum", { unique: false });
        objectStore.createIndex("gelernteTage", "gelernteTage", { unique: false });
    }
});

request.addEventListener("success", (event) => {
    console.log("Database geöffnet.");
});

request.onerror = (event) => {
    console.error("Database konnte nicht geöffnet werden." + event.target.error);
};
