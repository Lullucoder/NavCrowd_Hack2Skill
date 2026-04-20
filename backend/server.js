import compression from 'compression'
import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import alertsRoutes from './routes/alerts.js'
import analyticsRoutes from './routes/analytics.js'
import chatRoutes from './routes/chat.js'
import foodRoutes from './routes/food.js'
import googleRoutes from './routes/google.js'
import mlRoutes from './routes/ml.js'
import navigationRoutes from './routes/navigation.js'
import parkingRoutes from './routes/parking.js'
import queueRoutes from './routes/queue.js'
import { toHttpStatus } from './utils/validation.js'

dotenv.config()

const app = express()
const port = process.env.PORT || 8080

const allowedOrigins = process.env.CORS_ALLOWED_ORIGINS
  ? process.env.CORS_ALLOWED_ORIGINS.split(',').map((entry) => entry.trim()).filter(Boolean)
  : []

const corsOptions = {
  origin(origin, callback) {
    if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
      callback(null, true)
      return
    }

    callback(new Error('Origin is not allowed by CORS'))
  },
  methods: ['GET', 'POST', 'OPTIONS'],
  maxAge: 600
}

const globalLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 180,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests. Please try again shortly.' }
})

const aiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 24,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'AI endpoint limit reached. Retry in a minute.' }
})

app.disable('x-powered-by')
app.set('trust proxy', 1)
app.use(helmet())
app.use(cors(corsOptions))
app.use(compression())
app.use(express.json({ limit: '24kb' }))
app.use((req, res, next) => {
  req.requestId = crypto.randomUUID()
  res.setHeader('x-request-id', req.requestId)
  next()
})
app.use(globalLimiter)

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'venueflow-api',
    timestamp: new Date().toISOString()
  })
})

app.use('/api/queue', queueRoutes)
app.use('/api/food', foodRoutes)
app.use('/api/chat', aiLimiter, chatRoutes)
app.use('/api/alerts', alertsRoutes)
app.use('/api/analytics', analyticsRoutes)
app.use('/api/parking', parkingRoutes)
app.use('/api/ml', aiLimiter, mlRoutes)
app.use('/api/navigation', navigationRoutes)
app.use('/api/google', googleRoutes)

app.use((error, req, res, _next) => {
  const statusCode = toHttpStatus(error, 500)
  const defaultMessage = statusCode >= 500 ? 'Unexpected server error' : 'Request validation failed'

  res.status(statusCode).json({
    error: error instanceof Error ? error.message || defaultMessage : defaultMessage,
    requestId: req.requestId
  })
})

app.listen(port, () => {
  console.log(`VenueFlow backend running on http://localhost:${port}`)
})
