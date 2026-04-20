import assert from 'node:assert/strict'
import test from 'node:test'
import { generateNavigationPlan } from '../services/navigationRecommendationService.js'

const crowdSnapshot = [
  { id: 'gate-a', name: 'Gate A', occupancy: 420, capacity: 1200, level: 'medium' },
  { id: 'gate-d', name: 'Gate D', occupancy: 860, capacity: 1100, level: 'high' },
  { id: 'north-stand', name: 'North Stand', occupancy: 6000, capacity: 9000, level: 'high' },
  { id: 'south-stand', name: 'South Stand', occupancy: 7200, capacity: 9200, level: 'high' },
  { id: 'food-court-east', name: 'Food Court East', occupancy: 520, capacity: 1100, level: 'medium' }
]

const queueStatus = [
  { id: 'f-01', name: 'Smash Burger Bay', predictedWaitMinutes: 12 },
  { id: 'f-02', name: 'Masala Wrap Point', predictedWaitMinutes: 8 }
]

const parkingZones = [
  { id: 'A', name: 'Parking A', totalSpots: 1200, availableSpots: 182, walkMinutes: 8, gate: 'Gate 1' },
  { id: 'B', name: 'Parking B', totalSpots: 950, availableSpots: 74, walkMinutes: 6, gate: 'Gate 2' },
  { id: 'C', name: 'Parking C', totalSpots: 1300, availableSpots: 462, walkMinutes: 11, gate: 'Gate 3' }
]

test('generateNavigationPlan returns best route and alternatives', () => {
  const plan = generateNavigationPlan({
    seat: 'C-204',
    phase: 'halftime',
    intent: 'quick',
    mobilityNeed: false,
    crowdSnapshot,
    queueStatus,
    parkingZones
  })

  assert.equal(plan.context.seatSide, 'south')
  assert.ok(plan.bestRoute)
  assert.ok(plan.bestRoute.steps.length >= 3)
  assert.ok(plan.alternatives.length <= 3)
  assert.ok(plan.hotspots.length > 0)
})

test('generateNavigationPlan prefers accessible routes for mobility mode', () => {
  const plan = generateNavigationPlan({
    seat: 'A-110',
    phase: 'entry',
    intent: 'comfort',
    mobilityNeed: true,
    crowdSnapshot,
    queueStatus,
    parkingZones
  })

  assert.ok(['ramp', 'stairs'].includes(plan.bestRoute.accessibility))
  assert.ok(plan.timingAdvice.leaveInMinutes >= 8)
})
