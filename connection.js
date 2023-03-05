async function initialize() {

    const sqlite3 = require('sqlite3').verbose();
    const db = new sqlite3.Database(':memory:');

    db = new sqlite3.Database('./database/mydb.db', (err) => {
        if (err) {
            console.error(err.message);
        }
        console.log('Connected to the mydb database.');
    });
}
/*
await new Promise((resolve, reject) => {
    db.serialize(() => {
        db.run("CREATE TABLE IF NOT EXISTS Karteikarte(KarteikartenID INTEGER PRIMARY KEY AUTOINCREMENT, begriffText TEXT, beschreibungText TEXT, rating INTEGER, kategorieID INTEGER, FOREIGN KEY(kategorieID) REFERENCES Kategorie(kategorieID))");
        db.run("CREATE TABLE IF NOT EXISTS Kategorie(kategorieID INTEGER PRIMARY KEY AUTOINCREMENT, kategorieName TEXT, anzahlKarten INTEGER)");
        db.run("CREATE TABLE IF NOT EXISTS Quiz(quizID INTEGER PRIMARY KEY AUTOINCREMENT, quizName TEXT, anzahlFragen INTEGER)");
        db.run("CREATE TABLE IF NOT EXISTS FRAGE(frageID INTEGER PRIMARY KEY AUTOINCREMENT, frageText TEXT, quizID INTEGER, FOREIGN KEY(quizID) REFERENCES Quiz(quizID))");
        db.run("CREATE TABLE IF NOT EXISTS Antwort(antwortID INTEGER PRIMARY KEY AUTOINCREMENT, antwortText TEXT, richtig BOOLEAN, frageID INTEGER, FOREIGN KEY(frageID) REFERENCES FRAGE(frageID))");
    });
});
*/

const createTables = async () => {
    const db = await openDatabase();
    await db.run("CREATE TABLE IF NOT EXISTS Karteikarte(KarteikartenID INTEGER PRIMARY KEY AUTOINCREMENT, begriffText TEXT, beschreibungText TEXT, rating INTEGER, kategorieID INTEGER, FOREIGN KEY(kategorieID) REFERENCES Kategorie(kategorieID))");
    await db.run("CREATE TABLE IF NOT EXISTS Kategorie(kategorieID INTEGER PRIMARY KEY AUTOINCREMENT, kategorieName TEXT, anzahlKarten INTEGER)");
    await db.run("CREATE TABLE IF NOT EXISTS Quiz(quizID INTEGER PRIMARY KEY AUTOINCREMENT, quizName TEXT, anzahlFragen INTEGER)");
    await db.run("CREATE TABLE IF NOT EXISTS FRAGE(frageID INTEGER PRIMARY KEY AUTOINCREMENT, frageText TEXT, quizID INTEGER, FOREIGN KEY(quizID) REFERENCES Quiz(quizID))");
    await db.run("CREATE TABLE IF NOT EXISTS Antwort(antwortID INTEGER PRIMARY KEY AUTOINCREMENT, antwortText TEXT, richtig BOOLEAN, frageID INTEGER, FOREIGN KEY(frageID) REFERENCES FRAGE(frageID))");
    await db.close();
    console.log("Tables created successfully.");
}


db.close((err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Close the database connection.');
});