import express from 'express'
import { optionalEnum, requireText } from '../utils/validation.js'

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
  const title = requireText(req.body?.title, 'title', { maxLength: 90 })
  const message = requireText(req.body?.message, 'message', { maxLength: 320 })
  const severity = optionalEnum(req.body?.severity, ['info', 'warning', 'critical'], 'warning')

  const alert = {
    id: crypto.randomUUID(),
    title,
    message,
    severity,
    createdAt: new Date().toISOString()
  }

  alerts.unshift(alert)

  if (alerts.length > 80) {
    alerts.splice(80)
  }

  res.status(201).json(alert)
})

export const getAlertState = () => alerts

export default router
