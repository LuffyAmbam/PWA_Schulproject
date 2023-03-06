import { openDb } from './connection.js';

async function loadCategories() {
  const db = await openDb();
  const tx = db.transaction("Kategorie", "readonly");
  const store = tx.objectStore("Kategorie");
  const categories = await store.getAll();

  const categoryList = document.querySelector(".category-list");
  categoryList.innerHTML = "";

  for (const category of categories) {
    const newButton = document.createElement("button");
    newButton.classList.add("selection-button", "p-button", "col-md-4");
    newButton.dataset.categoryName = category.name;
    newButton.textContent = category.name;
    categoryList.appendChild(newButton);
  }

  tx.done;
}

loadCategories();

document.addEventListener("DOMContentLoaded", () => {
  const popup = document.querySelector(".popup");
  const openPopupButton = document.querySelector(".open-popup-button");
  const closePopupButton = document.querySelector(".close-popup-button");
  const popupText = document.querySelector(".popup-text");

  openPopupButton.addEventListener("click", () => {
    popup.classList.add("visible");
  });

  closePopupButton.addEventListener("click", () => {
    closePopup();
  });

  function closePopup() {
    const popup = document.querySelector(".popup");
    if (popup) {
      popup.classList.remove("visible");
      popupText.value = "";
    }
  }
});
