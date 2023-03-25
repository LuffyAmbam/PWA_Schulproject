// get the HTML elements
const dateInput = document.getElementById("lernziel-date");
const saveBtn = document.getElementById("lernziel-save");

const request = window.indexedDB.open("lernApp", 2);

request.addEventListener("upgradeneeded", (event) => {
    const db = event.target.result;

    // create the Lernziel object store
    db.createObjectStore("Lernziel", { keyPath: "id" });
});

request.addEventListener("success", (event) => {
    const db = event.target.result;

    // add event listener to the save button
    saveBtn.addEventListener("click", function () {
        // get the selected date
        const selectedDate = dateInput.value;

        // save the date to the Lernziel object store
        const transaction = db.transaction("Lernziel", "readwrite");
        const store = transaction.objectStore("Lernziel");
        const lernziel = { id: 1, zielDatum: selectedDate, gelernteTage: [] };
        store.put(lernziel);

        // set the daily reminder notification
        setDailyReminder(selectedDate);
    });
});

request.addEventListener("error", (event) => {
    console.error("Database konnte nicht geöffnet werden." + event.target.error);
});

function setDailyReminder(date) {

    const selectedDate = new Date(date);
    const today = new Date();

    const differenceInTime = selectedDate.getTime() - today.getTime();
    const differenceInDays = differenceInTime / (1000 * 3600 * 24);

    const reminderTime = new Date();
    reminderTime.setHours(18, 0, 0);

    if (differenceInDays > 0) {
        const options = {
            body: "Vergiss nicht zu lernen!",
            icon: "images/icon.png",
            badge: "images/badge.png",
            vibrate: [100, 50, 100],
            data: {
                date: date,
            },
        };

        setInterval(function () {
            const notificationPromise = self.registration.showNotification(
                "Lernziel",
                options
            );
        }, 24 * 60 * 60 * 1000);
    } else {
        console.log("Das Lernziel-Datum wurde bereits erreicht.");
    }
}

self.addEventListener("notificationclick", function (event) {
    event.notification.close();

    const date = event.notification.data.date;
    const url = "lernziel.html?date=" + date;
    event.waitUntil(clients.openWindow(url));
});
