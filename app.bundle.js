"serviceWorker"in navigator&&window.addEventListener("load",(function(){navigator.serviceWorker.register("/sw.bundle.js").then((function(i){console.log("ServiceWorker registration successful with scope: ",i.scope)}),(function(i){console.log("ServiceWorker registration failed: ",i)}))})),"Notification"in window&&Notification.requestPermission().then((function(i){"denied"!==i?"default"!==i?console.log("Notification permission granted"):console.log("Notification permission prompt dismissed"):console.log("Notification permission denied")}));