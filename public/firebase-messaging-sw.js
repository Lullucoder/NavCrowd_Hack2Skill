/* eslint-disable no-undef */
// Firebase Cloud Messaging service worker template.
// Update these values via CI/CD or manual replacement for production.

importScripts('https://www.gstatic.com/firebasejs/12.12.0/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/12.12.0/firebase-messaging-compat.js')

const config = {
  apiKey: 'REPLACE_WITH_FIREBASE_API_KEY',
  authDomain: 'REPLACE_WITH_FIREBASE_AUTH_DOMAIN',
  projectId: 'REPLACE_WITH_FIREBASE_PROJECT_ID',
  storageBucket: 'REPLACE_WITH_FIREBASE_STORAGE_BUCKET',
  messagingSenderId: 'REPLACE_WITH_FIREBASE_MESSAGING_SENDER_ID',
  appId: 'REPLACE_WITH_FIREBASE_APP_ID'
}

if (!config.apiKey.startsWith('REPLACE_')) {
  firebase.initializeApp(config)

  const messaging = firebase.messaging()

  messaging.onBackgroundMessage((payload) => {
    const title = payload.notification?.title || 'NavCrowd Update'
    const options = {
      body: payload.notification?.body || 'You have a new live event notification.',
      icon: '/favicon.ico',
      data: payload.data || {}
    }

    self.registration.showNotification(title, options)
  })
}
