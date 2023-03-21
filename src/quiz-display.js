// Öffnen der Datenbank
let db = null;
const request = indexedDB.open("LernApp", 1);

request.onerror = function (event) {
    console.log("Fehler beim Öffnen der Datenbank");
};

request.onsuccess = function (event) {
    db = event.target.result;
    // Laden der Daten für das ausgewählte Quiz aus den ObjectStores
    loadQuizData();
};

request.onupgradeneeded = function (event) {
    console.log("Datenbank wird in file quiz-display.js aktualisiert");
};

// Binden der HTML-Tags an Konstanten
const startBtn = document.getElementById("startBtn");
const frageText = document.getElementById("frage-Text");
const answerForm = document.getElementById("answer-form");
const timer = document.getElementById("timer");
const beantwortenBtn = document.getElementById("beantworten");

// Hinzufügen von EventListenern
startBtn.addEventListener("click", startQuiz);
beantwortenBtn.addEventListener("click", submitAnswer);

async function loadQuizData() {
    const quizTitle = localStorage.getItem("selectedQuiz");

    if (db) {
        const transaction = db.transaction(["Quiz", "FRAGE", "Antwort"], "readonly");
        const quizObjectStore = transaction.objectStore("Quiz");
        const fragenObjectStore = transaction.objectStore("FRAGE");
        const antwortenObjectStore = transaction.objectStore("Antwort");

        const quizIndex = quizObjectStore.index("quizName");
        const request = quizIndex.get(quizTitle);

        request.onsuccess = function (event) {
            const quizData = event.target.result;
            if (quizData) {
                const fragenRequest = fragenObjectStore.index("quizID").getAll(quizData.quizID);

                fragenRequest.onsuccess = function (event) {
                    const fragen = event.target.result;

                    fragen.forEach((frage, index) => {
                        const antwortenRequest = antwortenObjectStore.index("frageID").getAll(frage.frageID);

                        antwortenRequest.onsuccess = function (event) {
                            fragen[index].antworten = event.target.result;

                            if (index === fragen.length - 1) {
                                quizData.fragen = fragen;
                                displayQuiz(quizData);
                            }
                        };
                    });
                };
            } else {
                console.log("Quizdaten nicht gefunden");
            }
        };

        request.onerror = function (event) {
            console.log("Fehler beim Abrufen der Quizdaten");
        };
    }
}

function displayQuiz(quizData) {
    // Hier implementieren Sie die Logik zum Anzeigen des Quiz
}


function displayQuiz(quizData) {
    // Hier implementieren Sie die Logik zum Anzeigen des Quiz
}

function startQuiz() {
    // Hier starten Sie das Quiz
}

function submitAnswer() {
    // Hier übermitteln Sie die Antwort
}

window.addEventListener("load", () => {
    // Hier laden Sie die Daten des ausgewählten Quiz
    loadQuizData();
});
