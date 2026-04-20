import assert from 'node:assert/strict'
import test from 'node:test'
import { generateMlInsights } from '../services/mlInsightsService.js'

const baseInput = {
  context: {
    seat: 'B-127',
    intent: 'quick',
    mobilityNeed: false,
    firstVisit: true
  },
  crowdSnapshot: [
    { id: 'gate-a', name: 'Gate A', occupancy: 420, capacity: 1200, level: 'medium' },
    { id: 'gate-d', name: 'Gate D', occupancy: 840, capacity: 1100, level: 'high' },
    { id: 'north-stand', name: 'North Stand', occupancy: 6200, capacity: 9000, level: 'high' },
    { id: 'south-stand', name: 'South Stand', occupancy: 7000, capacity: 9200, level: 'high' }
  ],
  queueStatus: [
    { id: 'f-01', name: 'Smash Burger Bay', type: 'food', predictedWaitMinutes: 12 },
    { id: 'f-02', name: 'Masala Wrap Point', type: 'food', predictedWaitMinutes: 9 },
    { id: 'm-01', name: 'Jersey Store', type: 'merch', predictedWaitMinutes: 5 }
  ],
  parkingZones: [
    { id: 'A', name: 'Parking A', gate: 'Gate 1', walkMinutes: 8, availableSpots: 180, totalSpots: 1200 },
    { id: 'C', name: 'Parking C', gate: 'Gate 3', walkMinutes: 10, availableSpots: 460, totalSpots: 1300 }
  ],
  alerts: [
    { id: 'a1', severity: 'warning' },
    { id: 'a2', severity: 'critical' }
  ]
}

test('generateMlInsights returns complete decision payload', () => {
  const insights = generateMlInsights(baseInput)

  assert.equal(insights.model.name, 'VenueFlow-Hybrid-Context-Model')
  assert.ok(typeof insights.predictions.crowdRiskScore === 'number')
  assert.ok(insights.predictions.crowdRiskScore >= 0)
  assert.ok(insights.predictions.crowdRiskScore <= 1)
  assert.ok(['low', 'medium', 'high', 'critical'].includes(insights.predictions.crowdRiskLevel))
  assert.ok(insights.recommendations.actions.length >= 3)
})

test('generateMlInsights adds mobility action for mobility context', () => {
  const insights = generateMlInsights({
    ...baseInput,
    context: {
      ...baseInput.context,
      mobilityNeed: true
    }
  })

  const hasMobilityAction = insights.recommendations.actions.some((action) => action.toLowerCase().includes('mobility'))
  assert.equal(hasMobilityAction, true)
})
