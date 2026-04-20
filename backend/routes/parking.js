import express from 'express'
import { listParkingZones, recommendParkingBySeat } from '../mock/parkingData.js'
import { optionalText } from '../utils/validation.js'

const router = express.Router()

router.get('/', (_req, res) => {
  res.json({ zones: listParkingZones() })
})

router.get('/recommendation', (req, res) => {
  const seat = optionalText(req.query.seat?.toString(), { fallback: 'B-127', maxLength: 12 }).toUpperCase()
  const recommendation = recommendParkingBySeat({ seat })

  res.json({
    seat,
    recommendation
  })
})

export default router
