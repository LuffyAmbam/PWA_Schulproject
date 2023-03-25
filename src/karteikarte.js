let db = null;
const addKarteikarteButton = document.getElementById("addKarteikarteButton");
const dropdownKategorien = document.getElementById("dropdownKategorien");
const categoryCardsBtn = document.getElementById("categoryCards");
const randomCardsBtn = document.getElementById("randomCards");
const badCardsBtn = document.getElementById("badCards");
const categorySelect = document.getElementById("category-select");

const request = window.indexedDB.open("lernApp", 1);

function makeTransaction(storeName, mode, callback = null) {
    const transaction = db.transaction(storeName, mode);

    transaction.addEventListener('error', (event) => {
        console.error('Transaction error: ' + event.target.error);
    });

    transaction.addEventListener('complete', () => {
        console.log('Transaction completed.');
        if (typeof callback === 'function') callback();
    });

    return transaction.objectStore(storeName);
}

request.addEventListener("upgradeneeded", (event) => {
    db = event.target.result;

});

request.addEventListener("success", (event) => {
    console.log("Database geöffnet.");
    db = event.target.result;

    const store = makeTransaction("Kategorie", "readonly");
    const getAllRequest = store.getAll();

    getAllRequest.addEventListener("success", (event) => {
        const kategorie = event.target.result;
        kategorie.forEach((kategorie) => {
            const listItem = document.createElement("option");
            listItem.setAttribute("data-id", kategorie.kategorieID);
            listItem.setAttribute("value", kategorie.kategorieID);
            listItem.innerHTML = `${kategorie.kategorieName}`;
            console.log(listItem.value + " Das ist das listitem")
            dropdownKategorien.appendChild(listItem);
        });
    });
});

request.addEventListener("error", (event) => {
    console.error("Database konnte nicht geöffnet werden." + event.target.error);
});

//Um neue Karteikarte hinzuzufügen
addKarteikarteButton.addEventListener("click", (event) => {
    event.preventDefault();
    const karteikarteFrage = document.getElementById("karteikarte-name").value.trim();
    const karteikarteAntwort = document.getElementById("karteikarte-text").value.trim();
    const rating = 1;
    const mySelect = document.getElementById("dropdownKategorien");
    const selectedOption = mySelect.options[mySelect.selectedIndex];
    const kategorieID = selectedOption.dataset.id;
    const karteikarte = {
        begriffText: karteikarteFrage,
        karteikarteAntwort: karteikarteAntwort,
        rating: rating,
        kategorieID: kategorieID
    };


    const store = makeTransaction("Karteikarte", "readwrite");
    const addRequest = store.add(karteikarte);

    addRequest.addEventListener("success", (event) => {
        console.log("Karteikarte erfolgreich hinzugefügt.");
    });

    addRequest.addEventListener("error", (event) => {
        console.error("Fehler beim Hinzufügen der Karteikarte: " + event.target.error);
    });

    const getAllRequest = store.getAll();
    getAllRequest.addEventListener("success", (event) => {
        const karteikarten = event.target.result;
        console.log("Alle Karteikarten im Objektspeicher:");
        console.log(karteikarten);
    });

    document.getElementById("karteikarte-name").value = "";
    document.getElementById("karteikarte-text").value = "";
});

randomCardsBtn.addEventListener("click", () => {
    localStorage.setItem("cardType", "random");
    window.location.href = "card-display.html";
});

categoryCardsBtn.addEventListener("click", () => {
    localStorage.setItem("cardType", "category");
    window.location.href = `card-display.html`;
});

badCardsBtn.addEventListener("click", () => {
    localStorage.setItem("cardType", "bad");
    window.location.href = `card-display.html`;
});

