import express from 'express'
import { buildHeatmapSnapshot } from '../mock/crowdSimulator.js'
import { listOrders } from '../mock/menuData.js'
import { listQueueStatus } from '../mock/queueSimulator.js'
import { getAlertState } from './alerts.js'
import { createTTLCache } from '../utils/cache.js'

const router = express.Router()
const analyticsCache = createTTLCache({ ttlMs: 3000, maxEntries: 10 })

router.get('/overview', (_req, res) => {
  const cached = analyticsCache.get('overview')
  if (cached) {
    res.setHeader('x-cache', 'HIT')
    res.json(cached)
    return
  }

  const crowd = buildHeatmapSnapshot()
  const queue = listQueueStatus()
  const orders = listOrders()
  const alerts = getAlertState()

  const totalAttendance = crowd.reduce((sum, zone) => sum + zone.occupancy, 0)
  const avgWait = Math.round(queue.reduce((sum, item) => sum + item.predictedWaitMinutes, 0) / Math.max(1, queue.length))
  const revenue = orders.reduce((sum, order) => sum + order.total, 0)

  const payload = {
    generatedAt: new Date().toISOString(),
    kpis: {
      totalAttendance,
      avgWaitMinutes: avgWait,
      revenue,
      activeAlerts: alerts.length
    },
    queue,
    crowd
  }

  analyticsCache.set('overview', payload)
  res.setHeader('x-cache', 'MISS')
  res.json(payload)
})

export default router
