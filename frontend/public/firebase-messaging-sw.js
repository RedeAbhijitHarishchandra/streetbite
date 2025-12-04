// Replace YOUR_* placeholders with actual Firebase config values
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
}

// Import Firebase scripts
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js')

// Initialize Firebase
firebase.initializeApp(firebaseConfig)

const messaging = firebase.messaging()

// Handle background messages
messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Received background message', payload)

    const notificationTitle = payload.notification?.title || 'StreetBite Notification'
    const notificationOptions = {
        body: payload.notification?.body || 'You have a new notification',
        icon: '/logo.png',
        badge: '/logo.png',
        data: payload.data,
        tag: payload.data?.type || 'general',
        requireInteraction: false
    }

    self.registration.showNotification(notificationTitle, notificationOptions)
})

// Handle notification click
self.addEventListener('notificationclick', (event) => {
    console.log('[firebase-messaging-sw.js] Notification clicked', event)

    event.notification.close()

    // Navigate to the appropriate page based on notification data
    const data = event.notification.data
    let url = '/'

    if (data?.type === 'new_order' && data?.orderId) {
        url = `/vendor/orders/${data.orderId}`
    } else if (data?.type === 'order_update' && data?.orderId) {
        url = `/orders/${data.orderId}`
    }

    event.waitUntil(
        clients.openWindow(url)
    )
})
