let db = null;
let questions = [];
let currentQuestionIndex = 0;

const addFragenButton = document.getElementById("addFragenButton");
const nextButton = document.getElementById("next-page");
const prevButton = document.getElementById("prev-page");

const request = window.indexedDB.open("lernApp", 1);

request.onerror = function (event) {
  console.log("Database error: " + event.target.errorCode);
};

// Aktualisiere den Counter
function updateCounter() {
  // Wähle das Counter-Element aus
  const totalQuestions = questions.length === 0 ? 1 : questions.length;
  const counter = document.querySelector(".counter");
  // Setze den Text des Counter-Elements auf den aktuellen Frage-Index und die Gesamtzahl der Fragen
  counter.innerHTML = `Frage ${currentQuestionIndex+1} von ${totalQuestions+1}`;
}

// Funktion zum Setzen der Werte in den Input-Feldern
function setValuesInInputs(question) {
  const inputs = document.querySelectorAll('.quiz-page input');
  inputs.forEach(input => {
    input.value = question[input.id] || '';
  });
}

// Listener-Funktion für den "addFragenButton"
addFragenButton.addEventListener("click", function () {
  // Erhöhe den aktuellen Frage-Index um 1
  currentQuestionIndex++;
  // Aktualisiere den Counter
  updateCounter();

  // Wähle alle Input-Felder in der aktuellen Quiz-Seite aus
  const inputs = document.querySelectorAll('.quiz-page input');
  // Erstelle ein leeres Objekt, um die Daten zu speichern
  const question = {};
  // Iteriere über alle Input-Felder
  inputs.forEach(input => {
    // Speichere den Wert des Input-Felds im Frage-Objekt
    question[input.id] = input.value;
    input.value = '';
  });
  // Füge das Frage-Objekt zum Array questions hinzu
  questions[currentQuestionIndex - 1] = question;

  // Gib das aktualisierte Array in der Konsole aus
  console.log(questions);
});

// Listener-Funktion für den "nextButton"
nextButton.addEventListener("click", function () {
  // Wenn wir nicht am Ende der Liste sind, erhöhen wir den aktuellen Index um 1 und setzen die Werte in den Input-Feldern
  if (currentQuestionIndex < questions.length - 1) {
    currentQuestionIndex++;
    setValuesInInputs(questions[currentQuestionIndex]);
    updateCounter();
  }
});

// Listener-Funktion für den "prevButton"
prevButton.addEventListener("click", function () {
  // Wenn wir nicht am Anfang der Liste sind, verringern wir den aktuellen Index um 1 und setzen die Werte in den Input-Feldern
  if (currentQuestionIndex > 0) {
    currentQuestionIndex--;
    setValuesInInputs(questions[currentQuestionIndex]);
    updateCounter();
  }
});

// Initialisierung: Wenn wir mindestens eine Frage haben, setzen wir die Werte in den Input-Feldern und aktualisieren den Counter
if (questions.length > 0) {
  setValuesInInputs(questions[0]);
  updateCounter();
}
