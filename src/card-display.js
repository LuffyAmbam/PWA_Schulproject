let db = null;

const request = window.indexedDB.open("lernApp", 1);
const startBtn = document.getElementById("startBtn");
const cardContainer = document.getElementById("card-container");
const infoBtn = document.getElementById("infoBtn");
const cardText = document.getElementById("card-text");
const understoodBtn = document.getElementById("understoodBtn");
const kindOfUnderstoodBtn = document.getElementById("kindOfUnderstoodBtn");
const notUnderstoodBtn = document.getElementById("notUnderstoodBtn");


let cardList = [];
let currentCardIndex = 0;

function makeTransaction(storeName, mode, callback = null) {
    const transaction = db.transaction(storeName, mode);

    transaction.addEventListener("error", (event) => {
        console.error("Transaction error: " + event.target.error);
    });

    transaction.addEventListener("complete", () => {
        console.log("Transaction completed.");
        if (typeof callback === "function") callback();
    });

    return transaction.objectStore(storeName);
}

request.addEventListener("upgradeneeded", (event) => {
    db = event.target.result;
});

request.addEventListener("success", (event) => {
    console.log("Database geöffnet.");
    db = event.target.result;
    initUI();
});

request.addEventListener("error", (event) => {
    console.error("Database konnte nicht geöffnet werden." + event.target.error);
});

function initUI() {
    const cardType = localStorage.getItem("cardType");
    const container = document.getElementById("selection-container");

    if (cardType === "random") {
        // Create an Input field for the number of cards
        const cardNumberInput = document.createElement("input");
        cardNumberInput.setAttribute("type", "number");
        cardNumberInput.setAttribute("id", "card-number-input");
        cardNumberInput.setAttribute("min", "1");
        cardNumberInput.setAttribute("max", "100");
        cardNumberInput.setAttribute("value", "10");
        cardNumberInput.setAttribute("placeholder", "Anzahl der Karten");

        container.appendChild(cardNumberInput);
    } else if (cardType === "category") {
        // Create a select field for the categories
        const categorySelect = document.createElement("select");
        categorySelect.setAttribute("id", "category-select");
        container.appendChild(categorySelect);

        loadCategories();
    } else if (cardType === "bad") {
        // Hier können Sie die Logik zum Laden von "schlechten" Karteikarten implementieren
    }
}

function loadCategories() {
    const categorySelect = document.getElementById("category-select");
    const store = makeTransaction("Kategorie", "readonly");
    const getAllRequest = store.getAll();

    getAllRequest.addEventListener("success", (event) => {
        const kategorie = event.target.result;
        kategorie.forEach((kategorie) => {
            console.log(kategorie.kategorieName);
            const listItem = document.createElement("option");
            listItem.setAttribute("data-id", kategorie.kategorieID);
            listItem.setAttribute("value", kategorie.kategorieID);
            listItem.innerHTML = `${kategorie.kategorieName}`;
            categorySelect.appendChild(listItem);
        });
    });
}

// Neue Funktion zum Laden der Karteikarten
function loadCards() {
    const cardType = localStorage.getItem("cardType");
    const store = makeTransaction("Karteikarte", "readonly");
    const getAllRequest = store.getAll();

    getAllRequest.addEventListener("success", (event) => {
        const karteikarten = event.target.result;
        if (cardType === "random") {
            const numberOfCards = parseInt(document.getElementById("card-number-input").value, 10);
            cardList = getRandomCards(karteikarten, numberOfCards);
        } else if (cardType === "category") {
            const mySelect = document.getElementById("category-select");
            const selectedOption = mySelect.options[mySelect.selectedIndex];
            const kategorieID = selectedOption.dataset.id;
            cardList = karteikarten.filter((karteikarte) => karteikarte.kategorieID === kategorieID);
        } else if (cardType === "bad") {
            cardList = karteikarten.filter((karteikarte) => karteikarte.rating <= 4);
        }

        console.log(cardList);
        showNextCard();
    });
}



function showNextCard() {
    if (currentCardIndex >= cardList.length) {
        // Wenn alle Karteikarten abgeschlossen sind, eine Meldung anzeigen
        cardContainer.innerHTML = `<h3>Alle Karteikarten abgeschlossen!</h3>`;
        return;
    }

    const card = cardList[currentCardIndex];
    showCard(card);
    currentCardIndex++;
}

function showCard(card) {
    const cardTitle = document.getElementById("card-title");
    const cardText = document.getElementById("card-text");

    cardTitle.innerText = card.begriffText;
    cardText.innerText = card.karteikarteAntwort;
    cardText.style.display = "none";
}


startBtn.addEventListener("click", (event) => {
    event.preventDefault();
    loadCards();
    // disable button
    startBtn.setAttribute("disabled", "disabled");
});

function getRandomCards(karteikarten, numberOfCards) {
    const shuffledKarteikarten = karteikarten.sort(() => 0.5 - Math.random());
    return shuffledKarteikarten.slice(0, numberOfCards);
}

infoBtn.addEventListener("click", () => {
    cardText.style.display = "block";
});

infoBtn.addEventListener("mouseenter", () => {
    infoBtn.setAttribute("title", "Beschreibung einblenden");
});

infoBtn.addEventListener("mouseleave", () => {
    infoBtn.removeAttribute("title");
});


// Event Listener für den "Understood"-Button
understoodBtn.addEventListener("click", () => {
    updateCardRating(10);
});

// Event Listener für den "Kind of Understood"-Button
kindOfUnderstoodBtn.addEventListener("click", () => {
    updateCardRating(5);
});

// Event Listener für den "Not Understood"-Button
notUnderstoodBtn.addEventListener("click", () => {
    updateCardRating(1);
});

function updateCardRating(rating) {
    const store = makeTransaction("Karteikarte", "readwrite");
    const karteikarte = cardList[currentCardIndex - 1];
    const newRating = (karteikarte.rating + rating) / 2;
    console.log(karteikarte.rating + "karteikarte rating" + rating + "rating");
    karteikarte.rating = newRating;
    console.log(karteikarte.rating + "karteikarte rating")
    const updateRequest = store.put(karteikarte);
    updateRequest.addEventListener("success", () => {
        console.log(`Karteikarte ${karteikarte.begriffText} erfolgreich aktualisiert.`);
    });
    showNextCard();
}
