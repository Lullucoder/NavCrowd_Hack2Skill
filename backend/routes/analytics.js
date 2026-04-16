import express from 'express'
import { buildHeatmapSnapshot } from '../mock/crowdSimulator.js'
import { listOrders } from '../mock/menuData.js'
import { listQueueStatus } from '../mock/queueSimulator.js'
import { getAlertState } from './alerts.js'

const router = express.Router()

router.get('/overview', (_req, res) => {
  const crowd = buildHeatmapSnapshot()
  const queue = listQueueStatus()
  const orders = listOrders()
  const alerts = getAlertState()

  const totalAttendance = crowd.reduce((sum, zone) => sum + zone.occupancy, 0)
  const avgWait = Math.round(queue.reduce((sum, item) => sum + item.predictedWaitMinutes, 0) / queue.length)
  const revenue = orders.reduce((sum, order) => sum + order.total, 0)

  res.json({
    generatedAt: new Date().toISOString(),
    kpis: {
      totalAttendance,
      avgWaitMinutes: avgWait,
      revenue,
      activeAlerts: alerts.length
    },
    queue,
    crowd
  })
})

export default router
