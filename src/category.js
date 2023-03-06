// Add event listener to the button
const newCategoryBtn = document.getElementById('new-category-btn');
newCategoryBtn.addEventListener('click', openNewCategoryPopup);

document.addEventListener("DOMContentLoaded", function () {
    loadCategories();
  });


// Function to create the popup
function openNewCategoryPopup() {
  // Create a new popup element
  const popup = document.createElement('div');
  popup.classList.add('popup');

  // Create a form element to get the category name
  const form = document.createElement('form');
  form.innerHTML = `
    <label for="category-name">Category name:</label>
    <input type="text" id="category-name" name="category-name">
    <br>
    <button type="submit">Create</button>
    <button type="button" onclick="closePopup()">Cancel</button>
  `;

  function createNewCategory(categoryName) {
    // open a transaction and add the new category to the object store
    const tx = db.transaction(["Kategorie"], "readwrite");
    const categoriesStore = tx.objectStore("Kategorie");
    const request = categoriesStore.add({ kategorieName: categoryName });
  
    // on successful addition of the new category, generate a new button for the category
    request.onsuccess = function () {
      const categoryContainer = document.querySelector(".row.g-3.row-cols-xs-1.row-cols-sm-2.row-cols-md-3.row-cols-lg-2.mx-1");
      const newButton = document.createElement("button");
      newButton.classList.add("selection-button", "p-button", "col-md-4");
      newButton.dataset.categoryName = categoryName;
      newButton.addEventListener("click", function () {
        navigateToCategoryShapesPage(categoryName);
      });
      newButton.innerHTML = `
        <div class="row">
          <div class="col-6">
            <h1 class="card-title">${categoryName}</h1>
          </div>
          <div class="col-6 justify-content-center">
            <img src="img/Kategorie.png" class="" alt="...">
          </div>
        </div>
      `;
      categoryContainer.insertBefore(newButton, categoryContainer.lastElementChild);
    };
  
    // on error, log the error message
    request.onerror = function (event) {
      console.error("Error adding new category:", event.target.error);
    };
  }

  // Add event listener to the form submit button
  form.addEventListener('submit', (event) => {
    event.preventDefault(); // Prevent the form from submitting and reloading the page
    const categoryName = document.getElementById('category-name').value;
    createNewCategory(categoryName);
    closePopup();
  });

  // Add the form to the popup
  popup.appendChild(form);

  // Add the popup to the page
  document.body.appendChild(popup);
}

// Function to close the popup
function closePopup() {
  const popup = document.querySelector('.popup');
  if (popup) {
    popup.remove();
  }
}

function loadCategories() {
    const tx = db.transaction("categories", "readonly");
    const categoriesStore = tx.objectStore("categories");
    const request = categoriesStore.getAll();
  
    request.onsuccess = function () {
      const categoryContainer = document.querySelector(".row.g-3.row-cols-xs-1.row-cols-sm-2.row-cols-md-3.row-cols-lg-2.mx-1");
      const categories = request.result;
  
      for (const category of categories) {
        const newButton = document.createElement("button");
        newButton.classList.add("selection-button", "p-button", "col-md-4");
        newButton.dataset.categoryName = category.name;
        newButton.addEventListener("click", function () {
          navigateToCategoryShapesPage(category.name);
        });
        newButton.innerHTML = `
          <div class="row">
            <div class="col-6">
              <h1 class="card-title">${category.name}</h1>
            </div>
            <div class="col-6 justify-content-center">
              <img src="img/AddXS.png" class="" alt="...">
            </div>
          </div>
        `;
        categoryContainer.insertBefore(newButton, categoryContainer.lastElementChild);
      }
    };
  
    request.onerror = function (event) {
      console.error("Error loading categories:", event.target.error);
    };
  }
  
  
