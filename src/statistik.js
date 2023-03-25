let db;

const dropdownKategorien = document.getElementById("dropdownKategorien");
const zeigeStatistikBtn = document.getElementById("showStatistik");

const request = window.indexedDB.open("lernApp", 1);

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

  const store = makeTransaction("Kategorie", "readonly");
  const getAllRequest = store.getAll();

  getAllRequest.addEventListener("success", (event) => {
    const kategorien = event.target.result;

    kategorien.forEach((kategorie) => {
      const listItem = document.createElement("option");
      listItem.setAttribute("data-id", kategorie.kategorieID);
      listItem.setAttribute("value", kategorie.kategorieID);
      listItem.innerHTML = `${kategorie.kategorieName}`;
      dropdownKategorien.appendChild(listItem);
    });
  });
});

request.addEventListener("error", (event) => {
  console.error("Database konnte nicht geöffnet werden." + event.target.error);
});

zeigeStatistikBtn.addEventListener("click", (event) => {
  calculateStatistik();
});

function calculateStatistik() {
  const dropdownKategorien = document.getElementById("dropdownKategorien");
  const selectedCategoryOption = dropdownKategorien.options[dropdownKategorien.selectedIndex];
  const kategorieID = selectedCategoryOption.dataset.id;

  const store = makeTransaction("Karteikarte", "readonly");
  const getAllRequest = store.getAll();

  getAllRequest.addEventListener("success", (event) => {
    const karteikarten = event.target.result;

    const cardsInCategory = karteikarten.filter((karteikarte) => karteikarte.kategorieID === kategorieID);
    const totalCards = cardsInCategory.length;
    const totalRating = cardsInCategory.reduce((acc, karteikarte) => acc + karteikarte.rating, 0);
    const averageRating = totalRating / totalCards;

    console.log(`Total number of cards: ${totalCards}`);
    console.log(`Average rating of cards in category ${selectedCategoryOption.text}: ${averageRating}`);

    const chartLabels = ["0", "1", "2", "3", "4", "5"];
    const chartData = [0, 0, 0, 0, 0, 0];

    cardsInCategory.forEach((karteikarte) => {
      const rating = Math.round(karteikarte.rating);
      chartData[rating] += 1;
    });

    renderDiagram(totalCards, averageRating, selectedCategoryOption.text, chartLabels, chartData);
  });
}

function renderDiagram(totalCards, averageRating, categoryText, chartLabels, chartData) {

  const ctx = document.getElementById("myChart").getContext("2d");
  const chart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Total Cards", `Average Rating (${categoryText})`],
      datasets: [
        {
          label: categoryText,
          data: [totalCards, averageRating.toFixed(2)],
          backgroundColor: [
            "rgba(255, 99, 132, 0.2)",
            "rgba(54, 162, 235, 0.2)",
          ],
          borderColor: ["rgba(255, 99, 132, 1)", "rgba(54, 162, 235, 1)"],
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
            },
          },
        ],
      },
    },
  });
}


