importScripts(
  "https://www.gstatic.com/firebasejs/9.22.1/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.22.1/firebase-messaging-compat.js"
);

firebase.initializeApp({
    apiKey: 'AIzaSyBRCAV6hvxD_GL9Ffhcg-7A8C_PGx7mdGw',
    authDomain: 'eximso-dev.firebaseapp.com',
    projectId: 'eximso-dev',
    storageBucket: 'eximso-dev.firebasestorage.app',
    messagingSenderId: '806042958161',
    appId: '1:806042958161:web:4778ffda7968e565ccfb70',
    measurementId: 'G-3BRH2XX5F6',
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const { title, body, icon, click_action } = payload.notification;
  self.registration.showNotification(title, {
    body,
    icon,
    data: { url: click_action },
  });
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(clients.openWindow(event.notification.data.url));
});