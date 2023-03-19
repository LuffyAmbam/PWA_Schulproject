let db = null;
let questions = [];
let currentQuestionIndex = 0;

const addQuiz = document.getElementById("addQuiz");
const addFragenButton = document.getElementById("addFragenButton");
const nextButton = document.getElementById("next-page");
const prevButton = document.getElementById("prev-page");
const saveQuizButton = document.getElementById("saveQuiz");
const quizNameInput = document.getElementById("quizNameInput");

const request = window.indexedDB.open("lernApp", 1);

request.onerror = function (event) {
  console.log("Database error: " + event.target.errorCode);
};

request.onsuccess = function (event) {
  db = event.target.result;
  console.log("Database opened successfully");
}

request.onupgradeneeded = function (event) {
  console.log("Database upgrade needed: ", event.oldVersion, 'to', event.newVersion);

  db = event.target.result;
};

// Fügt den EventListener zum addQuiz-Button hinzu
addQuiz.addEventListener('click', () => {
  initFragenCounter();
});

//fügt die Frage und die Antwort der questions-Array hinzu
addFragenButton.addEventListener('click', () => {
  addNewQuestion();
});

// Fügt den EventListener zum saveQuizButton hinzu
saveQuizButton.addEventListener('click', saveQuiz);

nextButton.addEventListener('click', () => {
  nächsteFrage();
});

prevButton.addEventListener('click', () => {
  vorherigeFrage();
});

function initFragenCounter() {
  //create a p element and add it to the DOM
  const fragenCounter = document.createElement("p");
  fragenCounter.innerHTML = `Frage ${currentQuestionIndex + 1} von ${questions.length + 1}`;
  document.querySelector('.modal-footer').appendChild(fragenCounter);
}

//speicher die aktulle frage im array questions
function addNewQuestion() {
  const newQuestion = {
    frageText: document.getElementById("question-1").value,
    antwort1: document.getElementById("answer-1-1").value,
    antwort1Checkbox: document.getElementById("correct-answer-1").checked,
    antwort2: document.getElementById("answer-1-2").value,
    antwort2Checkbox: document.getElementById("correct-answer-2").checked,
    antwort3: document.getElementById("answer-1-3").value,
    antwort3Checkbox: document.getElementById("correct-answer-3").checked,
    antwort4: document.getElementById("answer-1-4").value,
    antwort4Checkbox: document.getElementById("correct-answer-4").checked,
  }
  console.log(newQuestion);
  questions.push(newQuestion);

  //clear the input fields
  clearInputFields();
  updateFragenCounter();
}


function clearInputFields() {

  document.getElementById("question-1").value = "";
  document.getElementById("answer-1-1").value = "";
  document.getElementById("answer-1-2").value = "";
  document.getElementById("answer-1-3").value = "";
  document.getElementById("answer-1-4").value = "";

  document.getElementById("correct-answer-1").checked = false;
  document.getElementById("correct-answer-2").checked = false;
  document.getElementById("correct-answer-3").checked = false;
  document.getElementById("correct-answer-4").checked = false;
}

function updateFragenCounter() {
  currentQuestionIndex++;
  console.log(currentQuestionIndex);
  const fragenCounter = document.querySelector('.modal-footer p');
  fragenCounter.innerHTML = `Frage ${currentQuestionIndex + 1} von ${questions.length + 1}`;
}

function nächsteFrage() {
  // Befülle die Inputfelder mit den Daten der nächsten Frage aus dem Array
  // Falls die aktuelle Frage die letzte im Array ist, springe zur ersten Frage
}

function vorherigeFrage() {
  // Befülle die Inputfelder mit den Daten der vorherigen Frage aus dem Array
  // Falls die aktuelle Frage die erste im Array ist, springe zur letzten Frage
}

function updateQuestion() {
  if (questions.length > 0) {
    document.getElementById("question-1").value = questions[currentQuestionIndex].frageText;
    document.getElementById("answer-1-1").value = questions[currentQuestionIndex].antwort1;
    document.getElementById("answer-1-2").value = questions[currentQuestionIndex].antwort2;
    document.getElementById("answer-1-3").value = questions[currentQuestionIndex].antwort3;
    document.getElementById("answer-1-4").value = questions[currentQuestionIndex].antwort4;

    document.getElementById("correct-answer-1").checked = questions[currentQuestionIndex].antwort1Checkbox;
    document.getElementById("correct-answer-2").checked = questions[currentQuestionIndex].antwort2Checkbox;
    document.getElementById("correct-answer-3").checked = questions[currentQuestionIndex].antwort3Checkbox;
    document.getElementById("correct-answer-4").checked = questions[currentQuestionIndex].antwort4Checkbox;
  } else {
    clearInputFields();
  }
}

function saveQuiz() {
  // Speichere den Quiznamen und die Fragen in der IndexedDB
  console.log("SAVE QUIZ wird ausgeführt")
  const quizName = quizNameInput.value;
  const quiz = { quizName };

  const quizTransaction = db.transaction(["Quiz"], "readwrite");
  const quizObjectStore = quizTransaction.objectStore("Quiz");
  const quizRequest = quizObjectStore.add(quiz);

  quizRequest.onsuccess = (event) => {
    const quizID = event.target.result;

    // Speichere die Fragen im ObjectStore "FRAGE"
    const frageTransaction = db.transaction(["FRAGE", "Antwort"], "readwrite");
    const questionObjectStore = frageTransaction.objectStore("FRAGE");
    const answerObjectStore = frageTransaction.objectStore("Antwort");

    questions.forEach((questionData) => {
      const { frageText, antwort1, antwort1Checkbox, antwort2, antwort2Checkbox, antwort3, antwort3Checkbox, antwort4, antwort4Checkbox } = questionData;
      const questionToStore = {
        quizID: quizID,
        frageText: frageText
      };

      const questionRequest = questionObjectStore.add(questionToStore);

      questionRequest.onsuccess = (event) => {
        const frageID = event.target.result;

        const answers = [
          { antwortText: antwort1, korrekt: antwort1Checkbox },
          { antwortText: antwort2, korrekt: antwort2Checkbox },
          { antwortText: antwort3, korrekt: antwort3Checkbox },
          { antwortText: antwort4, korrekt: antwort4Checkbox }
        ];

        answers.forEach((answerData) => {
          const answerToStore = {
            frageID: frageID,
            antwortText: answerData.antwortText,
            korrekt: answerData.korrekt
          };

          const answerRequest = answerObjectStore.add(answerToStore);

          answerRequest.onsuccess = () => {
            console.log(`Antwort "${answerData.antwortText}" wurde erfolgreich gespeichert.`);
          };

          answerRequest.onerror = () => {
            console.error(`Fehler beim Speichern der Antwort "${answerData.antwortText}":`, answerRequest.error);
          };
        });

        console.log(`Frage "${frageText}" wurde erfolgreich gespeichert.`);
      };

      questionRequest.onerror = () => {
        console.error(`Fehler beim Speichern der Frage "${frageText}":`, questionRequest.error);
      };
    });

    frageTransaction.oncomplete = () => {
      console.log('Alle Fragen und Antworten wurden erfolgreich gespeichert.');
    };

    frageTransaction.onerror = () => {
      console.error('Fehler beim Speichern der Fragen und Antworten:', frageTransaction.error);
    };
  };

  quizRequest.onerror = () => {
    console.error('Fehler beim Speichern des Quiz:', quizRequest.error);
  };
}
