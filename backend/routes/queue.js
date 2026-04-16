import express from 'express'
import { buildCrowdForecast } from '../mock/crowdSimulator.js'
import { joinQueue, leaveQueue, listQueueStatus } from '../mock/queueSimulator.js'

const router = express.Router()

router.get('/', (_req, res) => {
  res.json({ stalls: listQueueStatus() })
})

router.post('/join', (req, res) => {
  try {
    const { stallId, userId } = req.body
    const ticket = joinQueue({ stallId, userId })
    res.status(201).json(ticket)
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error ? error.message : 'Unable to join queue'
    })
  }
})

router.post('/leave', (req, res) => {
  const { ticketId } = req.body
  const result = leaveQueue({ ticketId })
  res.json(result)
})

router.get('/prediction', (req, res) => {
  const stallId = req.query.stallId?.toString()
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
