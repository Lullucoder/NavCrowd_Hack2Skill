import express from 'express'
import { listParkingZones, recommendParkingBySeat } from '../mock/parkingData.js'

const router = express.Router()

router.get('/', (_req, res) => {
  res.json({ zones: listParkingZones() })
})

router.get('/recommendation', (req, res) => {
  const seat = req.query.seat?.toString() ?? 'B-127'
  const recommendation = recommendParkingBySeat({ seat })

  res.json({
    seat,
    recommendation
  })
})

export default router
