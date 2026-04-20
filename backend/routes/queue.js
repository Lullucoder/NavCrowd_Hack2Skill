import express from 'express'
import { buildCrowdForecast } from '../mock/crowdSimulator.js'
import { joinQueue, leaveQueue, listQueueStatus } from '../mock/queueSimulator.js'
import { optionalText, requireStallId, requireTicketId, toHttpStatus } from '../utils/validation.js'

const router = express.Router()

router.get('/', (_req, res) => {
  res.json({ stalls: listQueueStatus() })
})

router.post('/join', (req, res) => {
  try {
    const stallId = requireStallId(req.body?.stallId)
    const userId = optionalText(req.body?.userId, { fallback: 'guest-user', maxLength: 48 })
    const ticket = joinQueue({ stallId, userId })
    res.status(201).json(ticket)
  } catch (error) {
    res.status(toHttpStatus(error, 400)).json({
      error: error instanceof Error ? error.message : 'Unable to join queue'
    })
  }
})

router.post('/leave', (req, res) => {
  try {
    const ticketId = requireTicketId(req.body?.ticketId)
    const result = leaveQueue({ ticketId })
    res.json(result)
  } catch (error) {
    res.status(toHttpStatus(error, 400)).json({
      error: error instanceof Error ? error.message : 'Unable to leave queue'
    })
  }
})

router.get('/prediction', (req, res) => {
  const stallId = requireStallId(req.query.stallId?.toString())
  const forecast = buildCrowdForecast(15)

  const matchingZone = forecast.find((zone) => zone.id.includes('food') || zone.id.includes('gate'))
  const queue = listQueueStatus().find((item) => item.id === stallId)

  if (!queue) {
    res.status(404).json({ error: 'Stall not found' })
    return
  }

  const crowdMultiplier = matchingZone && (matchingZone.level === 'high' || matchingZone.level === 'critical') ? 1.25 : 1
  const predictedWaitMinutes = Math.max(2, Math.round(queue.predictedWaitMinutes * crowdMultiplier))

  res.json({
    stallId,
    predictedWaitMinutes,
    confidence: 0.78
  })
})

export default router
