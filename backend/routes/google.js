import express from 'express'

const router = express.Router()

const getServiceStatus = (isConfigured) => (isConfigured ? 'configured' : 'fallback')

router.get('/status', (_req, res) => {
  const hasGeminiKey = Boolean(process.env.GEMINI_API_KEY)

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
      }
    }
  })
})

export default router
