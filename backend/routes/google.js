import express from 'express'
import { requireText } from '../utils/validation.js'

const router = express.Router()

const getServiceStatus = (isConfigured) => (isConfigured ? 'configured' : 'fallback')

const hasFirebaseWebConfig = () => {
  return Boolean(
    process.env.FIREBASE_API_KEY &&
      process.env.FIREBASE_PROJECT_ID &&
      process.env.FIREBASE_APP_ID &&
      process.env.FIREBASE_AUTH_DOMAIN
  )
}

router.get('/status', (_req, res) => {
  const hasGeminiKey = Boolean(process.env.GEMINI_API_KEY)
  const hasFirebaseConfig = hasFirebaseWebConfig()
  const hasMapsKey = Boolean(process.env.GOOGLE_MAPS_API_KEY)
  const hasFcmVapid = Boolean(process.env.FIREBASE_VAPID_KEY)
  const hasFunctionsRegion = Boolean(process.env.FIREBASE_FUNCTIONS_REGION)
  const hasStorageBucket = Boolean(process.env.FIREBASE_STORAGE_BUCKET)
  const hasMeasurementId = Boolean(process.env.FIREBASE_MEASUREMENT_ID)

  res.json({
    generatedAt: new Date().toISOString(),
    runtime: {
      cloudRunService: process.env.K_SERVICE || 'local-dev',
      cloudRunRevision: process.env.K_REVISION || 'local-dev',
      regionHint: process.env.GCP_REGION || process.env.FUNCTION_REGION || 'asia-south1'
    },
    services: {
      geminiApi: {
        status: getServiceStatus(hasGeminiKey),
        model: 'gemini-2.5-flash',
        purpose: 'Conversational assistant and AI summary generation'
      },
      firebaseHosting: {
        status: 'configured',
        purpose: 'Frontend hosting with API rewrites'
      },
      cloudRun: {
        status: 'configured',
        serviceId: 'venueflow-api',
        purpose: 'Backend API deployment target'
      },
      firebaseApp: {
        status: getServiceStatus(hasFirebaseConfig),
        purpose: 'Core Firebase web SDK bootstrap',
        detail: hasFirebaseConfig ? 'Web SDK config values found' : 'Missing FIREBASE_* runtime values'
      },
      firebaseAuth: {
        status: getServiceStatus(hasFirebaseConfig),
        purpose: 'Anonymous and identity-aware client sessions'
      },
      firestore: {
        status: getServiceStatus(hasFirebaseConfig),
        purpose: 'Operational event and audit logging store'
      },
      firebaseAnalytics: {
        status: getServiceStatus(hasMeasurementId),
        purpose: 'Client telemetry and conversion tracking'
      },
      cloudMessaging: {
        status: getServiceStatus(hasFirebaseConfig && hasFcmVapid),
        purpose: 'Web push notifications for urgent updates',
        detail: hasFcmVapid ? 'VAPID key present' : 'Missing FIREBASE_VAPID_KEY'
      },
      remoteConfig: {
        status: getServiceStatus(hasFirebaseConfig),
        purpose: 'Remote feature and parameter toggles'
      },
      cloudFunctions: {
        status: getServiceStatus(hasFunctionsRegion),
        purpose: 'Callable backend automation hooks',
        detail: hasFunctionsRegion ? `Region: ${process.env.FIREBASE_FUNCTIONS_REGION}` : 'Missing FIREBASE_FUNCTIONS_REGION'
      },
      cloudStorage: {
        status: getServiceStatus(hasStorageBucket),
        purpose: 'Object/media storage capability',
        detail: hasStorageBucket ? process.env.FIREBASE_STORAGE_BUCKET : 'Missing FIREBASE_STORAGE_BUCKET'
      },
      googleMapsPlatform: {
        status: getServiceStatus(hasMapsKey),
        purpose: 'Geocoding and maps intelligence endpoints',
        detail: hasMapsKey ? 'Maps API key configured' : 'Missing GOOGLE_MAPS_API_KEY'
      }
    }
  })
})

router.post('/maps/geocode', async (req, res) => {
  const mapsApiKey = process.env.GOOGLE_MAPS_API_KEY
  const address = requireText(req.body?.address, 'address', { maxLength: 180 })

  if (!mapsApiKey) {
    res.json({
      source: 'fallback',
      message: 'Google Maps API key not configured. Add GOOGLE_MAPS_API_KEY to enable geocoding.',
      result: null
    })
    return
  }

  try {
    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${mapsApiKey}`
    const response = await fetch(geocodeUrl)

    if (!response.ok) {
      throw new Error('Google Maps geocode request failed')
    }

    const payload = await response.json()
    const topMatch = Array.isArray(payload.results) ? payload.results[0] : null

    if (!topMatch) {
      res.json({
        source: 'google-maps',
        message: 'No geocode result found for the requested address.',
        result: null
      })
      return
    }

    res.json({
      source: 'google-maps',
      result: {
        formattedAddress: topMatch.formatted_address,
        location: topMatch.geometry?.location || null,
        placeId: topMatch.place_id || null
      }
    })
  } catch {
    res.status(502).json({
      source: 'google-maps',
      message: 'Google Maps geocoding is currently unavailable.',
      result: null
    })
  }
})

export default router
