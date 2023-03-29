
(() => { var e = { 269: () => { var e = null, t = document.getElementById("datepicker"), n = document.getElementById("addLernzielBtn"), o = document.getElementById("dropdownKategorien"), i = window.indexedDB.open("lernApp", 1); i.addEventListener("upgradeneeded", (function (e) { e.target.result.createObjectStore("Lernziel", { keyPath: "id" }) })), i.addEventListener("success", (function (t) { console.log("Database geöffnet."), e = t.target.result; var n = function (t, n) { var o = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : null, i = e.transaction(t, n); return i.addEventListener("error", (function (e) { console.error("Transaction error: " + e.target.error) })), i.addEventListener("complete", (function () { console.log("Transaction completed."), "function" == typeof o && o() })), i.objectStore(t) }("Kategorie", "readonly"); n.getAll().addEventListener("success", (function (e) { e.target.result.forEach((function (e) { console.log(e); var t = document.createElement("option"); t.setAttribute("data-id", e.kategorieID), t.setAttribute("value", e.kategorieID), t.innerHTML = "".concat(e.kategorieName), o.appendChild(t) })) })) })), n.addEventListener("click", (function () { var n = t.value, i = o.options[o.selectedIndex], r = e.transaction("Lernziel", "readwrite").objectStore("Lernziel"), a = { kategorieID: i.dataset.id, zielDatum: n, gelernteTage: [] }; r.put(a), "serviceWorker" in navigator && navigator.serviceWorker.ready.then((function (e) { e.active.postMessage({ type: "scheduleNotification", date: n }) })) })), i.addEventListener("error", (function (e) { console.error("Database konnte nicht geöffnet werden." + e.target.error) })), self.addEventListener("message", (function (e) { var t, n, o, i, r, a, s; e.data && "scheduleNotification" === e.data.type && (t = e.data.date, i = new Date(t), r = new Date, a = i.getTime() - r.getTime(), s = a / 864e5, (new Date).setHours(18, 0, 0), s > 0 ? (n = { body: "Don't forget to learn today!", icon: "/path/to/icon.png", badge: "/path/to/badge.png", vibrate: [100, 50, 100], data: { date: t } }, o = a - 36e5, "Notification" in window ? "granted" === Notification.permission ? (console.log("Notification permission already granted."), setTimeout((function () { self.clients.matchAll().then((function (e) { e.forEach((function (e) { e.postMessage({ type: "show-notification", options: n }) })) })) }), o)) : "denied" !== Notification.permission && Notification.requestPermission().then((function (e) { "granted" === e && (console.log("Notification permission granted."), setTimeout((function () { self.clients.matchAll().then((function (e) { e.forEach((function (e) { e.postMessage({ type: "show-notification", options: n }) })) })) }), o)) })) : console.error("This browser does not support notifications.")) : console.log("The learning goal date has already been reached.")) })) } }, t = {}; function n(o) { var i = t[o]; if (void 0 !== i) return i.exports; var r = t[o] = { exports: {} }; return e[o](r, r.exports, n), r.exports } n.n = e => { var t = e && e.__esModule ? () => e.default : () => e; return n.d(t, { a: t }), t }, n.d = (e, t) => { for (var o in t) n.o(t, o) && !n.o(e, o) && Object.defineProperty(e, o, { enumerable: !0, get: t[o] }) }, n.o = (e, t) => Object.prototype.hasOwnProperty.call(e, t), (() => { "use strict"; var e = n(269); self.addEventListener("install", (function (e) { e.waitUntil(caches.open("static").then((function (e) { return e.addAll(["/", "/index.html", "/manifest.json", "/lernziel.html", "/src/lernziel.js", "/src/category.js", "/kategorie.html", "/statistik.html", "/src/statistik.js", "/karteikarten.html", "/src/karteikarte.js", "/quiz.html", "/src/quiz.js", "/card-display.html", "/src/card-display.js", "/src/card-display.css", "/src/quiz.css", "/display-quiz.html", "/src/quiz-display.js", "/src/style.css", "script.js", "/node_modules/bootstrap/dist/js/bootstrap.js", "/node_modules/bootstrap/dist/js/bootstrap.bundle.js", "/node_modules/bootstrap/dist/js/bootstrap.bundle.min.js", "/node_modules/bootstrap/dist/js/bootstrap.min.js"]) }))), console.log("Service Worker: Installed") })), self.addEventListener("fetch", (function (e) { e.respondWith(caches.match(e.request).then((function (t) { return t || fetch(e.request) }))) })), "granted" !== Notification.permission && Notification.requestPermission().then((function (e) { "granted" === e && console.log("Notification permission granted.") })), self.addEventListener("message", (function (t) { t.data && "scheduleNotification" === t.data.type && (0, e.setDailyReminder)(t.data.date) })) })() })();