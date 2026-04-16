import express from 'express'

const router = express.Router()

const alerts = [
  {
    id: 'a1',
    title: 'Crowd Advisory',
    message: 'Gate D has high density. Prefer Gate B for faster entry.',
    severity: 'warning',
    createdAt: new Date().toISOString()
  },
  {
    id: 'a2',
    title: 'Weather Update',
    message: 'Light drizzle expected after 9:15 PM. Keep ponchos ready.',
    severity: 'info',
    createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString()
  }
]

router.get('/', (_req, res) => {
  res.json({ alerts })
})

router.post('/', (req, res) => {
  const title = req.body?.title
  const message = req.body?.message
  const severity = req.body?.severity ?? 'warning'

  if (!title || !message) {
    res.status(400).json({ error: 'title and message are required' })
    return
  }

  const alert = {
    id: crypto.randomUUID(),
    title,
    message,
    severity,
    createdAt: new Date().toISOString()
  }

  alerts.unshift(alert)
  res.status(201).json(alert)
})

export const getAlertState = () => alerts

export default router
