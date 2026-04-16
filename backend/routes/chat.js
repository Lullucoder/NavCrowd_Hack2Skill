import express from 'express'

const router = express.Router()

const venuePrompt = `You are VenueFlow assistant for a stadium called NexGen Arena.
Focus on practical and concise guidance about gates, restrooms, queues, food, parking, and safety.
If asked outside venue context, politely steer back to event assistance.`

const fallbackReply = (question) => {
  const text = question.toLowerCase()

  if (text.includes('restroom')) {
    return 'Nearest restroom is Block D near Gate 4. Current queue is around 5 minutes.'
  }
  if (text.includes('food') || text.includes('eat')) {
    return 'Try Masala Wrap Point in Concourse C for the shortest wait right now.'
  }
  if (text.includes('parking')) {
    return 'Parking C currently has the highest availability and smoothest entry flow.'
  }
  if (text.includes('exit') || text.includes('evacuate')) {
    return 'Follow illuminated markers to Exit Lane 2 and avoid Gate D due to heavy density.'
  }

  return 'I can help with gates, queues, food stalls, parking, and safety alerts in NexGen Arena.'
}

const generateWithGemini = async (message) => {
  const apiKey = process.env.GEMINI_API_KEY

  if (!apiKey) {
    return fallbackReply(message)
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: venuePrompt }]
        },
        contents: [
          {
            role: 'user',
            parts: [{ text: message }]
          }
        ],
        generationConfig: {
          temperature: 0.4,
          maxOutputTokens: 250
        }
      })
    }
  )

  if (!response.ok) {
    return fallbackReply(message)
  }

  const payload = await response.json()
  const answer = payload?.candidates?.[0]?.content?.parts?.[0]?.text

  if (!answer || typeof answer !== 'string') {
    return fallbackReply(message)
  }

  return answer.trim()
}

router.post('/', async (req, res) => {
  const message = req.body?.message

  if (typeof message !== 'string' || !message.trim()) {
    res.status(400).json({ error: 'Message is required' })
    return
  }

  try {
    const reply = await generateWithGemini(message)
    res.json({ reply })
  } catch {
    res.json({ reply: fallbackReply(message) })
  }
})

export default router
