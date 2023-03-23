let db;

const request = indexedDB.open("lernApp", 1);

// define the variables to hold the HTML elements
const quizName = document.getElementById("quizname");
const frageText = document.getElementById("frage-Text");
const answerForm = document.getElementById("answer-form");
const beantwortenBtn = document.getElementById("beantworten");
const timerElement = document.getElementById("timer");
const startBtn = document.getElementById("startBtn");
const questionAnswers = [];


// define a variable to hold the current question index
let currentQuestionIndex = 0;
let correctAnswers = 0;
let countdown;
let questionsAnswered = 0;
let progressBar = document.querySelector(".progress-bar");

// add an event listener for the answer submit button
beantwortenBtn.addEventListener("click", submitAnswer);
startBtn.addEventListener("click", function () {
    startQuiz();
});

// open the IndexedDB and retrieve quiz data
request.onerror = function (event) {
    console.log("Database error: " + event.target.errorCode);
};

request.onsuccess = function (event) {
    db = event.target.result;
    console.log("Database opened successfully");

    const transaction = db.transaction(["Quiz", "FRAGE", "Antwort"], "readonly");
    const quizObjectStore = transaction.objectStore("Quiz");
    const selectedQuiz = localStorage.getItem("selectedQuiz");

    const quizRequest = quizObjectStore.index("quizName").get(selectedQuiz);
    quizRequest.onsuccess = function (event) {
        const quizData = event.target.result;
        if (quizData) {
            console.log(quizData);
            const quizID = quizData.quizID;

            // load the questions for the quiz
            loadQuestions(quizID);
        } else {
            console.error("No quiz found with name " + selectedQuiz);
        }
    };

    quizRequest.onerror = function (event) {
        console.error("Error getting quiz with name " + selectedQuiz);
    };
};

/*
// function to display a question on the screen
function displayQuestion(questionData) {
    frageText.textContent = questionData.frageText;

    // clear any existing answer options
    while (answerForm.firstChild) {
        answerForm.removeChild(answerForm.firstChild);
    }

    // create the answer options
    const answers = questionData.answers;
    answers.forEach(function (answer, index) {
        const label = document.createElement("label");
        const input = document.createElement("input");
        input.type = "radio";
        input.name = "answer";
        input.value = index;
        label.appendChild(input);
        label.appendChild(document.createTextNode(answer));
        answerForm.appendChild(label);
    });

    // enable the answer submit button
    beantwortenBtn.disabled = false;
}*/


function loadQuestions(quizID) {
    const transaction = db.transaction("FRAGE", "readonly");
    const objectStore = transaction.objectStore("FRAGE");

    const index = objectStore.index("quizID");
    const request = index.getAll(quizID);

    request.onsuccess = function (event) {
        const questions = event.target.result;
        console.log(questions);
        // Display the first question
        if (questions && questions.length > 0) {
            const frageIDs = []

            questions.forEach(function (question) {
                frageIDs.push(question.frageID);
                console.log(question.frageID)
            });
            loadAnswersData(frageIDs, questions);
        } else {
            console.error("No questions found for quiz with ID " + quizID);
        }
    };

    request.onerror = function (event) {
        console.error("Error getting questions for quiz with ID " + quizID);
    };
}


function loadAnswersData(frageIDs, questions) {
    const transaction = db.transaction(["Antwort"], "readonly");
    const objectStore = transaction.objectStore("Antwort");


    // iterate through each question and retrieve its answers
    frageIDs.forEach(function (frageID) {
        const answerRequest = objectStore.index("frageID").getAll(frageID);

        answerRequest.onsuccess = function (event) {
            const answersForQuestion = event.target.result;

            // Find the question that corresponds to the current set of answers
            const question = questions.find(function (q) {
                return q.frageID === frageID;
            });

            // Create a new object that combines the question and its answers
            const questionWithAnswers = Object.assign({}, question, { answers: answersForQuestion });

            // Add the question and its answers to the array
            questionAnswers.push(questionWithAnswers);
        }

        answerRequest.onerror = function (event) {
            console.error("Error getting answers for question " + frageID);
        }
    });

    transaction.oncomplete = function (event) {
        console.log("Answers loaded successfully");
        console.log(questionAnswers);

        // TODO: Display questions with answers
    }
    transaction.onerror = function (event) {
        console.error("Error loading answers");
    }
}

function startQuiz() {
    console.log("Starte Quiz");

    setTimer();
    const currentQuestion = questionAnswers[currentQuestionIndex];
    const answers = currentQuestion.answers;
    correctAnswerIndex = setQuestions(answers);
}


let secondsRemaining = 20; // set the total number of seconds

function setTimer() {
    const secondsTotal = 20;
    let secondsRemaining = secondsTotal;

    timerElement.textContent = secondsRemaining;

    // clear existing timer before starting a new one
    if (countdown) {
        clearInterval(countdown);
    }

    countdown = setInterval(function () {
        secondsRemaining--;
        timerElement.textContent = secondsRemaining;

        if (secondsRemaining === 0) {
            clearInterval(countdown);
            console.log("Time's up!");
            submitAnswer();

            if (currentQuestionIndex === questionAnswers.length - 1) {
                // end of quiz
                console.log("End of quiz");
                showResults();
            } else {
                // move to next question
                currentQuestionIndex++;
                setQuestions();
                setTimer();
            }
        }
    }, 1000);
}

function setQuestions() {
    const currentQuestion = questionAnswers[currentQuestionIndex];
    const questionText = currentQuestion.frageText;
    const answers = currentQuestion.answers;

    // set the question text
    frageText.textContent = questionText;

    // clear any existing answer options
    while (answerForm.firstChild) {
        answerForm.removeChild(answerForm.firstChild);
    }

    // create the answer options
    answers.forEach(function (answer, index) {
        const label = document.createElement("label");
        const input = document.createElement("input");
        //give the label a class of form-check-label
        label.className = "form-check-label";
        //give the input a class of form-check-input
        input.className = "form-check-input";
        input.type = "radio";
        input.name = "answer";
        input.value = index;
        label.appendChild(input);
        label.appendChild(document.createTextNode(answer.antwortText));
        answerForm.appendChild(label);
    });

    // get the correct answer index
    const correctAnswerIndex = answers.findIndex(answer => answer.korrekt);

    // set the progress bar to the appropriate value
    const progressBar = document.querySelector('.progress-bar');
    const progressPercent = (questionsAnswered) / questionAnswers.length * 100;
    progressBar.style.width = progressPercent + '%';

    // return the correct answer index
    return correctAnswerIndex;
}






function submitAnswer() {
    // get the selected answer
    const answer = answerForm.elements["answer"].value;


    // check if the answer is correct
    if (answer == correctAnswerIndex) {
        console.log("Correct answer!");
        // increment the correctAnswers counter
        correctAnswers++;
        questionsAnswered++;
        updateProgressBar();
        setTimer();
    } else {
        console.log("Incorrect answer!");
        questionsAnswered++;
        updateProgressBar();
        setTimer();
    }

    // move to the next question
    currentQuestionIndex++;
    if (currentQuestionIndex < questionAnswers.length) {
        const currentQuestion = questionAnswers[currentQuestionIndex];
        const answers = currentQuestion.answers;
        correctAnswerIndex = setQuestions(answers);
    } else {
        // show the quiz results
        showResults();
    }
}




function showResults() {
    // hide the question and answer form elements
    frageText.style.display = "none";
    answerForm.style.display = "none";

    clearInterval(countdown);
    //destroy the html element with the id timer-container
    const timerContainer = document.getElementById("timer-container");
    timerContainer.remove();
    beantwortenBtn.remove();

    let quizMenueBtn = document.createElement("button");
    quizMenueBtn.className = "btn btn-danger";
    quizMenueBtn.textContent = "Zurück zum Quiz-Menü";
    quizMenueBtn.addEventListener("click", function () {
        window.location.href = "quiz.html";
    });
    quizName.parentNode.insertBefore(quizMenueBtn, quizName.nextSibling);

    // display the user's score
    const scoreText = "You got " + correctAnswers + " out of " + questionAnswers.length + " questions correct!";
    const scoreElement = document.createElement("p");
    scoreElement.textContent = scoreText;
    quizName.parentNode.insertBefore(scoreElement, quizName.nextSibling);
}

function updateProgressBar() {
    let percentage = (questionsAnswered / questionAnswers.length) * 100;
    progressBar.style.width = percentage + "%";
}


