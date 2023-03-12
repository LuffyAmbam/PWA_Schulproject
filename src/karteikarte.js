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
            const listItem = document.createElement("li");
            listItem.innerHTML = `<a class="dropdown-item" href="#" data-id="${kategorie.kategorieID}">${kategorie.kategorieName}</a>`;
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
