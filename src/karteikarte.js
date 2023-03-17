/*let db = null;
const addKarteikarteButton = document.getElementById("addKarteikarteButton");
const dropdownKategorien = document.getElementById("dropdownKategorien");

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
            console.log(kategorie.kategorieName)
            const listItem = document.createElement("option");
            listItem.innerHTML = `<option value="${kategorie.kategorieID}">${kategorie.kategorieName}</option>`;
            dropdownKategorien.appendChild(listItem);
        });
    });
});

request.addEventListener("error", (event) => {
    console.error("Database konnte nicht geöffnet werden." + event.target.error);
});

document.addEventListener("DOMContentLoaded", () => {
    const dropdownToggle = document.querySelector(".dropdown-toggle");
    dropdownToggle.addEventListener("click", () => {
        dropdownToggle.parentElement.classList.toggle("show");
    });
});

//Um neue Karteikarte hinzuzufügen
addKarteikarteButton.addEventListener("click", (event) => {
    event.preventDefault();
    const karteikarteFrage = document.getElementById("karteikarte-name").value.trim();
    const karteikarteAntwort = document.getElementById("karteikarte-text").value.trim();
    const rating = 0;
    const kategorieID = document.querySelector("#dropdownKategorien").value;
    const karteikarte = {
        begriffText: karteikarteFrage,
        karteikarteAntwort: karteikarteAntwort,
        rating: rating,
        kategorieID: kategorieID
    };
    console.log(karteikarte);

    const store = makeTransaction("Karteikarte", "readwrite");
    let request = store.add(karteikarte);
});
*/

let db = null;
const addKarteikarteButton = document.getElementById("addKarteikarteButton");
const dropdownKategorien = document.getElementById("dropdownKategorien");

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
            console.log(kategorie.kategorieName)
            const listItem = document.createElement("option");
            listItem.innerHTML = `<option value="${kategorie.kategorieID}">${kategorie.kategorieName}</option>`;
            dropdownKategorien.appendChild(listItem);
        });
    });
});

request.addEventListener("error", (event) => {
    console.error("Database konnte nicht geöffnet werden." + event.target.error);
});

document.addEventListener("DOMContentLoaded", () => {
    const dropdownToggle = document.querySelector(".dropdown-toggle");
    dropdownToggle.addEventListener("click", () => {
        dropdownToggle.parentElement.classList.toggle("show");
    });
});

//Um neue Karteikarte hinzuzufügen
addKarteikarteButton.addEventListener("click", (event) => {
    event.preventDefault();
    const karteikarteFrage = document.getElementById("karteikarte-name").value.trim();
    const karteikarteAntwort = document.getElementById("karteikarte-text").value.trim();
    const rating = 0;
    const kategorieID = document.querySelector("#dropdownKategorien").value;
    const karteikarte = {
        begriffText: karteikarteFrage,
        karteikarteAntwort: karteikarteAntwort,
        rating: rating,
        kategorieID: kategorieID
    };
    console.log(karteikarte);

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
