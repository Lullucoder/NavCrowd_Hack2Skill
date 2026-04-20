import express from 'express'
import { requireText } from '../utils/validation.js'

const router = express.Router()

const tokenRegistry = new Map()

const trimRegistry = () => {
  const maxTokens = 500
  if (tokenRegistry.size <= maxTokens) {
    return
  }

  const keys = Array.from(tokenRegistry.keys())
  const overflow = tokenRegistry.size - maxTokens
  for (let index = 0; index < overflow; index += 1) {
    tokenRegistry.delete(keys[index])
  }
}

router.get('/status', (_req, res) => {
  const entries = Array.from(tokenRegistry.values())
  const lastRegisteredAt = entries.length
    ? entries.map((entry) => entry.registeredAt).sort().reverse()[0]
    : null

  res.json({
    tokenCount: tokenRegistry.size,
    lastRegisteredAt,
    messagingConfigured: Boolean(process.env.FIREBASE_VAPID_KEY)
  })
})

router.post('/register', (req, res) => {
  const token = requireText(req.body?.token, 'token', { minLength: 20, maxLength: 4096 })

  tokenRegistry.set(token, {
    token,
    userAgent: typeof req.body?.userAgent === 'string' ? req.body.userAgent : 'unknown',
    platform: typeof req.body?.platform === 'string' ? req.body.platform : 'unknown',
    registeredAt: new Date().toISOString()
  })

  trimRegistry()

  res.status(201).json({
    message: 'Token registered',
    tokenCount: tokenRegistry.size
  })
})

router.post('/broadcast-test', (req, res) => {
  const title = requireText(req.body?.title, 'title', { maxLength: 80 })
  const body = requireText(req.body?.body, 'body', { maxLength: 240 })

  const acceptedTokens = tokenRegistry.size

  res.json({
    queued: acceptedTokens,
    source: 'test-broadcast',
    notification: {
      title,
      body
    },
    note: 'This endpoint verifies registration flow. Connect Firebase Admin send logic when credentials are added.'
  })
})

export default router
