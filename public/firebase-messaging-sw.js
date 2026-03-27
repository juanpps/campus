/* eslint-disable no-undef */
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

firebase.initializeApp({
    apiKey: 'AIzaSyDf4y2iin6svS5MVIZeuDQIosY76BMEzTc',
    authDomain: 'metodo-raptor-cmp-2026-v2.firebaseapp.com',
    projectId: 'metodo-raptor-cmp-2026-v2',
    messagingSenderId: '954076502276',
    appId: '1:954076502276:web:70ace0a2aac78655f39851',
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    const { title, body, icon } = payload.notification ?? {};
    const notificationTitle = title || 'Campus Raptor';
    const notificationOptions = {
        body: body || 'Tienes una nueva notificación.',
        icon: icon || '/icons/icon-192x192.png',
        badge: '/icons/icon-72x72.png',
        tag: payload.data?.tag || String(Date.now()),
        data: { url: payload.data?.url || '/' },
    };
    self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    const urlToOpen = event.notification.data?.url || '/';
    event.waitUntil(
        self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
            for (const client of clients) {
                if (client.url.includes(self.location.origin) && 'focus' in client) {
                    return client.focus();
                }
            }
            if (self.clients.openWindow) {
                return self.clients.openWindow(urlToOpen);
            }
        })
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(self.clients.claim());
});
