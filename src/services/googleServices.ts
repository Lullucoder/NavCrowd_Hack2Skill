import type { FirebaseApp, FirebaseOptions } from 'firebase/app'
import type { Analytics } from 'firebase/analytics'
import type { Auth } from 'firebase/auth'
import type { DocumentData, Firestore } from 'firebase/firestore'
import type { Functions } from 'firebase/functions'
import type { Messaging } from 'firebase/messaging'
import type { FirebasePerformance } from 'firebase/performance'
import type { RemoteConfig } from 'firebase/remote-config'
import type { FirebaseStorage } from 'firebase/storage'

type ServiceStatus = 'configured' | 'fallback'

interface GoogleClientServiceEntry {
  status: ServiceStatus
  purpose: string
  detail?: string
}

export interface GoogleClientServiceSnapshot {
  generatedAt: string
  services: Record<string, GoogleClientServiceEntry>
}

interface CloudFunctionPingResponse {
  ok: boolean
  detail: string
}

const firebaseConfig: FirebaseOptions = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
}

const hasFirebaseCoreConfig = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.appId)

let firebaseApp: FirebaseApp | null = null
let firebaseAuth: Auth | null = null
let firebaseFirestore: Firestore | null = null
let firebaseAnalytics: Analytics | null = null
let firebaseFunctions: Functions | null = null
let firebaseStorage: FirebaseStorage | null = null
let firebaseRemoteConfig: RemoteConfig | null = null
let firebasePerformance: FirebasePerformance | null = null
let firebaseMessaging: Messaging | null = null

let analyticsModuleRef: typeof import('firebase/analytics') | null = null
let authModuleRef: typeof import('firebase/auth') | null = null
let firestoreModuleRef: typeof import('firebase/firestore') | null = null
let functionsModuleRef: typeof import('firebase/functions') | null = null
let messagingModuleRef: typeof import('firebase/messaging') | null = null
let remoteConfigModuleRef: typeof import('firebase/remote-config') | null = null
let storageModuleRef: typeof import('firebase/storage') | null = null

let appModulePromise: Promise<typeof import('firebase/app')> | null = null
let analyticsModulePromise: Promise<typeof import('firebase/analytics')> | null = null
let authModulePromise: Promise<typeof import('firebase/auth')> | null = null
let firestoreModulePromise: Promise<typeof import('firebase/firestore')> | null = null
let functionsModulePromise: Promise<typeof import('firebase/functions')> | null = null
let messagingModulePromise: Promise<typeof import('firebase/messaging')> | null = null
let performanceModulePromise: Promise<typeof import('firebase/performance')> | null = null
let remoteConfigModulePromise: Promise<typeof import('firebase/remote-config')> | null = null
let storageModulePromise: Promise<typeof import('firebase/storage')> | null = null

let remoteConfigActive = false

const statusValue = (isConfigured: boolean): ServiceStatus => (isConfigured ? 'configured' : 'fallback')

const loadAppModule = () => {
  if (!appModulePromise) {
    appModulePromise = import('firebase/app')
  }
  return appModulePromise
}

const loadAnalyticsModule = () => {
  if (!analyticsModulePromise) {
    analyticsModulePromise = import('firebase/analytics')
  }
  return analyticsModulePromise
}

const loadAuthModule = () => {
  if (!authModulePromise) {
    authModulePromise = import('firebase/auth')
  }
  return authModulePromise
}

const loadFirestoreModule = () => {
  if (!firestoreModulePromise) {
    firestoreModulePromise = import('firebase/firestore')
  }
  return firestoreModulePromise
}

const loadFunctionsModule = () => {
  if (!functionsModulePromise) {
    functionsModulePromise = import('firebase/functions')
  }
  return functionsModulePromise
}

const loadMessagingModule = () => {
  if (!messagingModulePromise) {
    messagingModulePromise = import('firebase/messaging')
  }
  return messagingModulePromise
}

const loadPerformanceModule = () => {
  if (!performanceModulePromise) {
    performanceModulePromise = import('firebase/performance')
  }
  return performanceModulePromise
}

const loadRemoteConfigModule = () => {
  if (!remoteConfigModulePromise) {
    remoteConfigModulePromise = import('firebase/remote-config')
  }
  return remoteConfigModulePromise
}

const loadStorageModule = () => {
  if (!storageModulePromise) {
    storageModulePromise = import('firebase/storage')
  }
  return storageModulePromise
}

const ensureFirebaseApp = async () => {
  if (!hasFirebaseCoreConfig) {
    return null
  }

  if (!firebaseApp) {
    const appModule = await loadAppModule()
    firebaseApp = appModule.initializeApp(firebaseConfig)
  }

  return firebaseApp
}

const isBrowser = typeof window !== 'undefined'

const getCallableRegion = () => import.meta.env.VITE_FIREBASE_FUNCTIONS_REGION || 'us-central1'

const getMessagingVapidKey = () => import.meta.env.VITE_FIREBASE_VAPID_KEY || ''

export const initializeGoogleClientServices = async () => {
  const app = await ensureFirebaseApp()
  if (!app || !isBrowser) {
    return getGoogleClientServiceSnapshot()
  }

  if (!firebaseAuth) {
    const authModule = await loadAuthModule()
    authModuleRef = authModule
    firebaseAuth = authModule.getAuth(app)
  }

  if (!firebaseFirestore) {
    const firestoreModule = await loadFirestoreModule()
    firestoreModuleRef = firestoreModule
    firebaseFirestore = firestoreModule.getFirestore(app)
  }

  if (!firebaseFunctions) {
    const functionsModule = await loadFunctionsModule()
    functionsModuleRef = functionsModule
    firebaseFunctions = functionsModule.getFunctions(app, getCallableRegion())
  }

  if (!firebaseStorage) {
    const storageModule = await loadStorageModule()
    storageModuleRef = storageModule
    firebaseStorage = storageModule.getStorage(app)
  }

  if (!firebaseRemoteConfig) {
    try {
      const remoteConfigModule = await loadRemoteConfigModule()
      remoteConfigModuleRef = remoteConfigModule

      const remoteConfig = remoteConfigModule.getRemoteConfig(app)
      remoteConfig.settings = {
        minimumFetchIntervalMillis: 60_000,
        fetchTimeoutMillis: 5_000
      }
      firebaseRemoteConfig = remoteConfig
    } catch {
      firebaseRemoteConfig = null
    }
  }

  if (!firebasePerformance) {
    try {
      const performanceModule = await loadPerformanceModule()
      firebasePerformance = performanceModule.getPerformance(app)
    } catch {
      firebasePerformance = null
    }
  }

  if (!firebaseAnalytics) {
    try {
      const analyticsModule = await loadAnalyticsModule()
      analyticsModuleRef = analyticsModule

      if (await analyticsModule.isSupported()) {
        firebaseAnalytics = analyticsModule.getAnalytics(app)
      }
    } catch {
      firebaseAnalytics = null
    }
  }

  if (!firebaseMessaging) {
    try {
      const messagingModule = await loadMessagingModule()
      messagingModuleRef = messagingModule

      if (await messagingModule.isSupported()) {
        firebaseMessaging = messagingModule.getMessaging(app)
      }
    } catch {
      firebaseMessaging = null
    }
  }

  return getGoogleClientServiceSnapshot()
}

export const getGoogleClientServiceSnapshot = (): GoogleClientServiceSnapshot => ({
  generatedAt: new Date().toISOString(),
  services: {
    firebaseApp: {
      status: statusValue(hasFirebaseCoreConfig),
      purpose: 'Firebase app bootstrap for all client SDK modules',
      detail: hasFirebaseCoreConfig ? 'Core web config present' : 'Set VITE_FIREBASE_* env values'
    },
    firebaseAuth: {
      status: statusValue(Boolean(firebaseAuth)),
      purpose: 'Anonymous session support and identity handoff'
    },
    firestore: {
      status: statusValue(Boolean(firebaseFirestore)),
      purpose: 'Operational event logging and audit trails'
    },
    analytics: {
      status: statusValue(Boolean(firebaseAnalytics)),
      purpose: 'Product telemetry and event conversion tracking'
    },
    cloudFunctions: {
      status: statusValue(Boolean(firebaseFunctions)),
      purpose: 'Callable backend automations'
    },
    cloudStorage: {
      status: statusValue(Boolean(firebaseStorage)),
      purpose: 'Media and document storage hooks'
    },
    remoteConfig: {
      status: statusValue(Boolean(firebaseRemoteConfig && remoteConfigActive)),
      purpose: 'Runtime feature toggles and configuration control'
    },
    performanceMonitoring: {
      status: statusValue(Boolean(firebasePerformance)),
      purpose: 'Web performance metrics collection'
    },
    cloudMessaging: {
      status: statusValue(Boolean(firebaseMessaging && getMessagingVapidKey())),
      purpose: 'Web push notifications for urgent venue updates',
      detail: getMessagingVapidKey() ? 'VAPID key detected' : 'Set VITE_FIREBASE_VAPID_KEY'
    }
  }
})

export const signInWithGoogleAnonymousSession = async () => {
  if (!firebaseAuth) {
    await initializeGoogleClientServices()
  }

  if (!firebaseAuth || !authModuleRef) {
    return { ok: false, detail: 'Firebase Auth not configured' }
  }

  try {
    if (!firebaseAuth.currentUser) {
      await authModuleRef.signInAnonymously(firebaseAuth)
    }
    return { ok: true, detail: 'Anonymous Firebase Auth session active' }
  } catch {
    return { ok: false, detail: 'Anonymous Firebase sign-in failed' }
  }
}

export const trackGoogleEvent = (eventName: string, params?: Record<string, string | number | boolean>) => {
  if (!firebaseAnalytics || !analyticsModuleRef) {
    return false
  }

  try {
    analyticsModuleRef.logEvent(firebaseAnalytics, eventName, params)
    return true
  } catch {
    return false
  }
}

export const logGoogleAuditRecord = async (stream: string, payload: Record<string, unknown>) => {
  if (!firebaseFirestore) {
    await initializeGoogleClientServices()
  }

  if (!firebaseFirestore) {
    return { ok: false, detail: 'Firestore not configured' }
  }

  if (!firestoreModuleRef) {
    firestoreModuleRef = await loadFirestoreModule()
  }

  try {
    await firestoreModuleRef.addDoc(firestoreModuleRef.collection(firebaseFirestore, stream), {
      ...payload,
      createdAt: firestoreModuleRef.serverTimestamp()
    })

    return { ok: true, detail: 'Audit record pushed to Firestore' }
  } catch {
    return { ok: false, detail: 'Firestore write failed' }
  }
}

export const refreshGoogleRemoteConfig = async () => {
  if (!firebaseRemoteConfig) {
    await initializeGoogleClientServices()
  }

  if (!firebaseRemoteConfig || !remoteConfigModuleRef) {
    return { ok: false, detail: 'Remote Config not configured' }
  }

  try {
    remoteConfigActive = await remoteConfigModuleRef.fetchAndActivate(firebaseRemoteConfig)
    return {
      ok: true,
      detail: remoteConfigActive ? 'Remote Config updated from server' : 'Remote Config already up-to-date'
    }
  } catch {
    return { ok: false, detail: 'Remote Config fetch failed' }
  }
}

export const requestGooglePushToken = async () => {
  if (!firebaseMessaging) {
    await initializeGoogleClientServices()
  }

  if (!firebaseMessaging || !messagingModuleRef) {
    return { ok: false, detail: 'Cloud Messaging not configured', token: null as string | null }
  }

  const vapidKey = getMessagingVapidKey()
  if (!vapidKey) {
    return { ok: false, detail: 'Missing VAPID key (VITE_FIREBASE_VAPID_KEY)', token: null as string | null }
  }

  if (!('serviceWorker' in navigator) || !('Notification' in window)) {
    return { ok: false, detail: 'Push APIs not supported by browser', token: null as string | null }
  }

  try {
    const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js')

    if (Notification.permission === 'default') {
      await Notification.requestPermission()
    }

    if (Notification.permission !== 'granted') {
      return { ok: false, detail: 'Notification permission not granted', token: null as string | null }
    }

    const token = await messagingModuleRef.getToken(firebaseMessaging, {
      vapidKey,
      serviceWorkerRegistration: registration
    })

    if (!token) {
      return { ok: false, detail: 'FCM token unavailable', token: null as string | null }
    }

    try {
      await fetch('/api/notifications/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          token,
          userAgent: navigator.userAgent,
          platform: navigator.platform
        })
      })
    } catch {
      // Token is still useful locally even if backend registration fails.
    }

    return { ok: true, detail: 'FCM token generated', token }
  } catch {
    return { ok: false, detail: 'FCM token request failed', token: null as string | null }
  }
}

export const callGoogleOpsFunction = async (payload: Record<string, unknown> = {}) => {
  if (!firebaseFunctions) {
    await initializeGoogleClientServices()
  }

  if (!firebaseFunctions) {
    return { ok: false, detail: 'Cloud Functions not configured' } as CloudFunctionPingResponse
  }

  if (!functionsModuleRef) {
    functionsModuleRef = await loadFunctionsModule()
  }

  try {
    const callable = functionsModuleRef.httpsCallable<
      Record<string, unknown>,
      DocumentData
    >(firebaseFunctions, 'navcrowdPing')

    await callable({
      source: 'web-client',
      ...payload
    })

    return { ok: true, detail: 'Callable function invocation attempted' }
  } catch {
    return { ok: false, detail: 'Callable function unavailable (deploy later)' }
  }
}

export const uploadGoogleStorageJsonRecord = async (folder: string, payload: Record<string, unknown>) => {
  if (!firebaseStorage) {
    await initializeGoogleClientServices()
  }

  if (!firebaseStorage) {
    return {
      ok: false,
      detail: 'Cloud Storage not configured',
      objectPath: null as string | null,
      downloadUrl: null as string | null
    }
  }

  if (!storageModuleRef) {
    storageModuleRef = await loadStorageModule()
  }

  const safeFolder = folder.replace(/^\/+|\/+$/g, '') || 'records'
  const fileStamp = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
  const objectPath = `${safeFolder}/${fileStamp}.json`

  try {
    const jsonString = JSON.stringify(payload, null, 2)
    const objectRef = storageModuleRef.ref(firebaseStorage, objectPath)

    await storageModuleRef.uploadString(objectRef, jsonString, 'raw', {
      contentType: 'application/json; charset=utf-8'
    })

    const downloadUrl = await storageModuleRef.getDownloadURL(objectRef)

    return {
      ok: true,
      detail: 'JSON record uploaded to Cloud Storage',
      objectPath,
      downloadUrl
    }
  } catch {
    return {
      ok: false,
      detail: 'Cloud Storage upload failed',
      objectPath,
      downloadUrl: null as string | null
    }
  }
}
