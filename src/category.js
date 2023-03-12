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
  console.log(newCategory);

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
  newButton.className = "selection-button p-button col-md-4";
  newButton.id = `${kategorie.kategorieName}-btn`;
  newButton.setAttribute("data-bs-toggle", "modal");
  newButton.setAttribute("data-bs-target", `#${kategorie.kategorieName}CategoryModal`);
  newButton.setAttribute("data-bs-whatever", "@getbootstrap");

  const newButtonInnerHtml = `
    <div class="row">
      <div class="col-6">
        <h1 class="card-title">${kategorie.kategorieName}</h1>
      </div>
      <div class="col-6 justify-content-center">
        <button><i class="fas fa-trash-alt"></i>Delete</button>
        <button><i class="fas fa-edit"></i>Edit</button>
      </div>
    </div>
  `;
  newButton.innerHTML = newButtonInnerHtml;

  buttonContainer.appendChild(document.createElement("div").appendChild(newButton));
}

/*
request.onsuccess = (event) => {
  const db = event.target.result;

  // handle click event on the "Add" button
  addCategoryButton.addEventListener("click", (event) => {
    event.preventDefault();

    // check that the database is open and available
    if (!db) {
      console.error("Database is not open.");
      return;
    }

    // open a transaction to the "Kategorie" object store
    const transaction = db.transaction(["Kategorie"], "readwrite");
    const objectStore = transaction.objectStore("Kategorie");

    // create a new category object with the data from the input field
    const newCategory = {
      kategorieName: kategorieNameInput.value,
    };

    // add the new category object to the object store
    const request = objectStore.add(newCategory);

    // handle success and error events for the database request
    request.onsuccess = (event) => {
      console.log("Category added to database.");
      // reset the input field
      kategorieNameInput.value = "";
      // hide the modal
      $("#newCategoryModal").modal("hide");
    };

    request.onerror = (event) => {
      console.error("Error adding category to database.");
    };

    // close the transaction
    transaction.oncomplete = () => {
      console.log("Transaction completed.");
      // close the database connection
      db.close();
    };
  });
};

// Create the "Kategorie" object store if it does not exist
request.onupgradeneeded = (event) => {
  const db = event.target.result;

  if (!db.objectStoreNames.contains("Kategorie")) {
    const objectStore = db.createObjectStore("Kategorie", {
      keyPath: "kategorieID",
      autoIncrement: true,
    });
    objectStore.createIndex("kategorieName", "kategorieName", {
      unique: false,
    });
  }
};
*/