import assert from 'node:assert/strict'
import test from 'node:test'
import { predictCrowdForHorizon, predictWaitTime } from '../services/predictionEngine.js'

test('predictWaitTime scales with queue pressure', () => {
  const low = predictWaitTime({ peopleWaiting: 8, zoneLoad: 0.2 })
  const high = predictWaitTime({ peopleWaiting: 24, zoneLoad: 0.7 })

  assert.ok(low >= 1)
  assert.ok(high > low)
})

test('predictCrowdForHorizon stays within valid capacity bounds', () => {
  const prediction = predictCrowdForHorizon({
    occupancy: 520,
    capacity: 1000,
    trend: 1,
    minutesAhead: 20
  })

  assert.ok(prediction >= 0)
  assert.ok(prediction <= 1000)
})

test('predictCrowdForHorizon clamps when drift is extreme', () => {
  const prediction = predictCrowdForHorizon({
    occupancy: 995,
    capacity: 1000,
    trend: 1,
    minutesAhead: 90
  })

  assert.equal(prediction, 1000)
})
