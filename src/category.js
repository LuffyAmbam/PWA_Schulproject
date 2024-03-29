const addCategoryButton = document.getElementById("addCategoryButton");
const kategorieNameInput = document.getElementById("kategorie-name");
let db = null;

// Open the database and handle errors and success
const request = window.indexedDB.open("lernApp", 1);

console.log("kategorie.js geladen.");

//transaction
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
  // Do nothing for now
});

request.addEventListener("success", (event) => {
  console.log("Database geöffnet.");
  db = event.target.result;

  // Get all objects from the Kategorie object store and create buttons for each one
  const store = makeTransaction("Kategorie", "readonly");
  const getAllRequest = store.getAll();

  getAllRequest.addEventListener("success", (event) => {
    const kategorien = event.target.result;
    kategorien.forEach((kategorie) => {
      addNewCategoryButton(kategorie);
    });
  });

});

request.onerror = (event) => {
  console.error("Database konnte nicht geöffnet werden." + event.target.error);
};

addCategoryButton.addEventListener("click", (event) => {
  event.preventDefault();
  let newCategory = {
    kategorieName: kategorieNameInput.value.trim(),
  };

  const store = makeTransaction("Kategorie", "readwrite");
  let request = store.add(newCategory);

  request.addEventListener("success", (event) => {
    console.log("Kategorie hinzugefügt." + event.target.result);
    addNewCategoryButton(newCategory);
    kategorieNameInput.value = "";
  });
  request.addEventListener("error", (event) => {
    console.log(event.target.error);
  });
});

function addNewCategoryButton(kategorie) {
  const buttonContainer = document.querySelector(".row-cols-lg-2");

  const newButton = document.createElement("button");
  newButton.className = "selection-button p-button col-sm-12 col-md-6 col-xl-4";
  newButton.id = `${kategorie.kategorieName}-btn`;
  newButton.setAttribute("data-bs-toggle", "modal");
  newButton.setAttribute("data-bs-target", `#${kategorie.kategorieName}CategoryModal`);
  newButton.setAttribute("data-bs-whatever", "@getbootstrap");

  const newButtonInnerHtml = `
    <div class="row btn-row">
      <div class="col-6">
        <h1 class="card-title">${kategorie.kategorieName}</h1>
      </div>
      <div class="col-6 d-flex justify-content-end">
        <button class="btn btn-danger" style="margin-right: 0.5rem";>Delete</button>
        <button class="btn btn-secondary">Edit</button>
      </div>
    </div>
  `;
  newButton.innerHTML = newButtonInnerHtml;

  buttonContainer.appendChild(document.createElement("div").appendChild(newButton));
}
