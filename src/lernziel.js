// get the HTML elements
let db = null;
const dateInput = document.getElementById("datepicker");
const saveBtn = document.getElementById("addLernzielBtn");
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
    const db = event.target.result;

    // create the Lernziel object store
    db.createObjectStore("Lernziel", { keyPath: "id" });
});

request.addEventListener("success", (event) => {
    console.log("Database geöffnet.")
    db = event.target.result;

    const store = makeTransaction("Kategorie", "readonly");
    const getAllRequest = store.getAll();

    getAllRequest.addEventListener("success", (event) => {
        const kategorie = event.target.result;
        kategorie.forEach((kategorie) => {
            console.log(kategorie)
            const listItem = document.createElement("option");
            listItem.setAttribute("data-id", kategorie.kategorieID);
            listItem.setAttribute("value", kategorie.kategorieID);
            listItem.innerHTML = `${kategorie.kategorieName}`;
            dropdownKategorien.appendChild(listItem);
        });
    });

    // add event listener to the save button

});

saveBtn.addEventListener("click", function () {
    // get the selected date
    const selectedDate = dateInput.value;
    const selectedOption = dropdownKategorien.options[dropdownKategorien.selectedIndex];

    // save the date to the Lernziel object store
    const transaction = db.transaction("Lernziel", "readwrite");
    const store = transaction.objectStore("Lernziel");
    const lernZiel = {
        kategorieID: selectedOption.dataset.id,
        zielDatum: selectedDate,
        gelernteTage: []
    };
    store.put(lernZiel);

    // send a message to the service worker to schedule a notification
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready.then(function (registration) {
            registration.active.postMessage({
                type: 'scheduleNotification',
                date: selectedDate // pass the selected date
            });
        });
    }
});




request.addEventListener("error", (event) => {
    console.error("Database konnte nicht geöffnet werden." + event.target.error);
});

// Listen for a notification schedule event from the client
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'scheduleNotification') {
        // Schedule the notification
        setDailyReminder(event.data.date);
    }
});

// Function to schedule the daily reminder notification
// export function setDailyReminder(date) {
//     const selectedDate = new Date(date);
//     const today = new Date();

//     const differenceInTime = selectedDate.getTime() - today.getTime();
//     const differenceInDays = differenceInTime / (1000 * 3600 * 24);

//     const reminderTime = new Date();
//     reminderTime.setHours(18, 0, 0);

//     if (differenceInDays > 0) {
//         const options = {
//             body: "Don't forget to learn today!",
//             icon: "/path/to/icon.png",
//             badge: "/path/to/badge.png",
//             vibrate: [100, 50, 100],
//             data: {
//                 date: date,
//             },
//         };

//         const secondsUntilReminder = differenceInTime - (60 * 60 * 1000); // 1 hour before the reminder time

//         scheduleNotification(reminderTime, options, secondsUntilReminder);
//     } else {
//         console.log("The learning goal date has already been reached.");
//     }
// }

function scheduleNotification(date, options, delay) {
    if (!("Notification" in window)) {
        console.error("This browser does not support notifications.");
        return;
    }

    if (Notification.permission === "granted") {
        // plan the notification
        console.log("Notification permission already granted.");
        setTimeout(() => {
            self.clients.matchAll().then((clients) => {
                clients.forEach((client) => {
                    client.postMessage({
                        type: "show-notification",
                        options: options,
                    });
                });
            });
        }, delay);
    } else if (Notification.permission !== "denied") {
        // ask for permission
        Notification.requestPermission().then(function (permission) {
            if (permission === "granted") {
                console.log("Notification permission granted.");
                setTimeout(() => {
                    self.clients.matchAll().then((clients) => {
                        clients.forEach((client) => {
                            client.postMessage({
                                type: "show-notification",
                                options: options,
                            });
                        });
                    });
                }, delay);
            }
        });
    }
}

// function setDailyReminder(date) {
//     const selectedDate = new Date(date);
//     const today = new Date();

//     const differenceInTime = selectedDate.getTime() - today.getTime();
//     const differenceInDays = differenceInTime / (1000 * 3600 * 24);

//     const reminderTime = new Date();
//     reminderTime.setHours(18, 0, 0);

//     if (differenceInDays > 0) {
//         const options = {
//             body: "Vergiss nicht zu lernen!",
//             icon: "images/icon.png",
//             badge: "images/badge.png",
//             vibrate: [100, 50, 100],
//             data: {
//                 date: date,
//             },
//         };

//         const secondsUntilReminder = differenceInTime - (60 * 60 * 1000); // 1 hour before the reminder time

//         scheduleNotification(reminderTime, options, secondsUntilReminder);
//     } else {
//         console.log("Das Lernziel-Datum wurde bereits erreicht.");
//     }
// }

function sendNotificationMessageToSW(message) {
    return new Promise((resolve, reject) => {
        const messageChannel = new MessageChannel();
        messageChannel.port1.onmessage = (event) => {
            if (event.data.error) {
                reject(event.data.error);
            } else {
                resolve(event.data);
            }
        };
        navigator.serviceWorker.controller.postMessage(message, [messageChannel.port2]);
    });
}

//send a message to the service worker to schedule the notification
sendNotificationMessageToSW({ action: 'scheduleNotification', date: selectedDate });


// function scheduleNotification(date) {
//     if (!("Notification" in window)) {
//         console.error("This browser does not support notifications.");
//         return;
//     }

//     if (Notification.permission === "granted") {
//         // plan the notification
//         console.log("Notification permission already granted.");
//         const notificationPromise = self.registration.showNotification("Lernziel", options);
//     } else if (Notification.permission !== "denied") {
//         // ask for permission
//         Notification.requestPermission().then(function (permission) {
//             if (permission === "granted") {
//                 console.log("Notification permission granted.");
//                 const notificationPromise = self.registration.showNotification("Lernziel", options);
//             }
//         });
//     }
// }

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

        const secondsUntilReminder = differenceInTime - (60 * 60 * 1000); // 1 hour before the reminder time

        scheduleNotification(reminderTime, options, secondsUntilReminder);
    } else {
        console.log("Das Lernziel-Datum wurde bereits erreicht.");
    }
}

