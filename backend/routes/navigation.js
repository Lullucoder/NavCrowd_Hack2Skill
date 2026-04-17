import express from 'express'
import { buildHeatmapSnapshot } from '../mock/crowdSimulator.js'
import { listParkingZones } from '../mock/parkingData.js'
import { listQueueStatus } from '../mock/queueSimulator.js'
import { generateNavigationPlan } from '../services/navigationRecommendationService.js'

const router = express.Router()

const toBoolean = (value) => {
  if (typeof value !== 'string') {
    return false
  }

  const normalized = value.trim().toLowerCase()
  return normalized === '1' || normalized === 'true' || normalized === 'yes'
}

router.get('/assist', (req, res) => {
  const seat = req.query.seat?.toString() || 'B-127'
  const phase = req.query.phase?.toString() || 'entry'
  const intent = req.query.intent?.toString() || 'quick'
  const mobilityNeed = toBoolean(req.query.mobilityNeed?.toString())

  const crowdSnapshot = buildHeatmapSnapshot()
  const queueStatus = listQueueStatus()
  const parkingZones = listParkingZones()

  const recommendation = generateNavigationPlan({
    seat,
    phase,
    intent,
    mobilityNeed,
    crowdSnapshot,
    queueStatus,
    parkingZones
  })

  res.json(recommendation)
})

export default router
