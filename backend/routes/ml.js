import express from 'express'
import { getAlertState } from './alerts.js'
import { buildHeatmapSnapshot } from '../mock/crowdSimulator.js'
import { listParkingZones } from '../mock/parkingData.js'
import { listQueueStatus } from '../mock/queueSimulator.js'
import { generateMlInsights } from '../services/mlInsightsService.js'
import { optionalBoolean, optionalEnum, optionalText } from '../utils/validation.js'

const router = express.Router()

const fetchWithTimeout = async (url, options, timeoutMs = 4500) => {
  const abortController = new AbortController()
  const timeoutId = setTimeout(() => abortController.abort(), timeoutMs)

  try {
    return await fetch(url, {
      ...options,
      signal: abortController.signal
    })
  } finally {
    clearTimeout(timeoutId)
  }
}

const summarizeWithGemini = async (insights) => {
  const apiKey = process.env.GEMINI_API_KEY

  if (!apiKey) {
    return null
  }

  const prompt = `You are VenueFlow AI operations assistant. Summarize this JSON into 3 short recommendations for an attendee:\n${JSON.stringify(insights)}`

  const response = await fetchWithTimeout(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [{ text: prompt }]
          }
        ],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 200
        }
      })
    },
    4800
  )

  if (!response.ok) {
    return null
  }

  const payload = await response.json()
  const text = payload?.candidates?.[0]?.content?.parts?.[0]?.text
  return typeof text === 'string' && text.trim() ? text.trim() : null
}

router.post('/insights', async (req, res) => {
  const context = {
    seat: optionalText(req.body?.seat, { fallback: 'B-127', maxLength: 12 }).toUpperCase(),
    intent: optionalEnum(req.body?.intent, ['quick', 'merch', 'comfort'], 'quick'),
    mobilityNeed: optionalBoolean(req.body?.mobilityNeed),
    firstVisit: optionalBoolean(req.body?.firstVisit)
  }

  const crowdSnapshot = buildHeatmapSnapshot()
  const queueStatus = listQueueStatus()
  const parkingZones = listParkingZones()
  const alerts = getAlertState()

  const insights = generateMlInsights({ context, crowdSnapshot, queueStatus, parkingZones, alerts })

  try {
    const narrative = await summarizeWithGemini(insights)
    res.json({
      ...insights,
      narrative,
      provider: narrative ? 'gemini+hcm' : 'hcm-fallback'
    })
  } catch {
    res.json({
      ...insights,
      narrative: null,
      provider: 'hcm-fallback'
    })
  }
})

export default router
