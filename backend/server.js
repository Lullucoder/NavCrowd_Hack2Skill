import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import alertsRoutes from './routes/alerts.js'
import analyticsRoutes from './routes/analytics.js'
import chatRoutes from './routes/chat.js'
import foodRoutes from './routes/food.js'
import mlRoutes from './routes/ml.js'
import parkingRoutes from './routes/parking.js'
import queueRoutes from './routes/queue.js'

dotenv.config()

const app = express()
const port = process.env.PORT || 8080

app.use(cors())
app.use(express.json())

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'venueflow-api',
    timestamp: new Date().toISOString()
  })
})

app.use('/api/queue', queueRoutes)
app.use('/api/food', foodRoutes)
app.use('/api/chat', chatRoutes)
app.use('/api/alerts', alertsRoutes)
app.use('/api/analytics', analyticsRoutes)
app.use('/api/parking', parkingRoutes)
app.use('/api/ml', mlRoutes)

app.use((error, _req, res, _next) => {
  res.status(500).json({
    error: 'Unexpected server error',
    detail: error instanceof Error ? error.message : 'Unknown error'
  })
})

app.listen(port, () => {
  console.log(`VenueFlow backend running on http://localhost:${port}`)
})
