import express from 'express'
import { buildHeatmapSnapshot } from '../mock/crowdSimulator.js'
import { listParkingZones } from '../mock/parkingData.js'
import { listQueueStatus } from '../mock/queueSimulator.js'
import { generateNavigationPlan } from '../services/navigationRecommendationService.js'
import { createTTLCache } from '../utils/cache.js'
import { optionalBoolean, optionalEnum, optionalText } from '../utils/validation.js'

const router = express.Router()
const navigationCache = createTTLCache({ ttlMs: 2500, maxEntries: 100 })

router.get('/assist', (req, res) => {
  const seat = optionalText(req.query.seat?.toString(), { fallback: 'B-127', maxLength: 12 }).toUpperCase()
  const phase = optionalEnum(req.query.phase?.toString(), ['entry', 'halftime', 'exit'], 'entry')
  const intent = optionalEnum(req.query.intent?.toString(), ['quick', 'comfort', 'merch'], 'quick')
  const mobilityNeed = optionalBoolean(req.query.mobilityNeed?.toString())

  const cacheKey = `${seat}|${phase}|${intent}|${mobilityNeed ? '1' : '0'}`
  const cached = navigationCache.get(cacheKey)

  if (cached) {
    res.setHeader('x-cache', 'HIT')
    res.json(cached)
    return
  }

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

  navigationCache.set(cacheKey, recommendation)
  res.setHeader('x-cache', 'MISS')
  res.json(recommendation)
})

export default router
