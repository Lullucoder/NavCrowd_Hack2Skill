import type { AlertItem, HeatLevel, HeatZone, MenuItem, ParkingZone, QueueStall } from '../types'

const levelByRatio = (ratio: number): HeatLevel => {
  if (ratio < 0.35) {
    return 'low'
  }
  if (ratio < 0.55) {
    return 'medium'
  }
  if (ratio < 0.75) {
    return 'high'
  }
  return 'critical'
}

const crowdSeed: Array<{ id: string; name: string; occupancy: number; capacity: number }> = [
  { id: 'gate-a', name: 'Gate A', occupancy: 420, capacity: 1200 },
  { id: 'gate-d', name: 'Gate D', occupancy: 810, capacity: 1100 },
  { id: 'north-stand', name: 'North Stand', occupancy: 5800, capacity: 9000 },
  { id: 'south-stand', name: 'South Stand', occupancy: 7100, capacity: 9200 },
  { id: 'food-court-east', name: 'Food Court East', occupancy: 620, capacity: 1100 },
  { id: 'food-court-west', name: 'Food Court West', occupancy: 710, capacity: 1050 },
  { id: 'merch-hub', name: 'Merch Hub', occupancy: 330, capacity: 700 },
  { id: 'exit-lane-2', name: 'Exit Lane 2', occupancy: 250, capacity: 1200 }
]

export const initialHeatZones: HeatZone[] = crowdSeed.map((zone, index) => {
  const ratio = zone.occupancy / zone.capacity
  return {
    ...zone,
    level: levelByRatio(ratio),
    trend: index % 2 === 0 ? 1 : -1
  }
})

export const tickHeatZones = (zones: HeatZone[]): HeatZone[] =>
  zones.map((zone) => {
    const swing = Math.floor(Math.random() * 220)
    const signedSwing = zone.trend > 0 ? swing : -swing
    const nextOccupancy = Math.max(60, Math.min(zone.capacity - 20, zone.occupancy + signedSwing))
    const nextRatio = nextOccupancy / zone.capacity

    let nextTrend = zone.trend
    if (nextRatio >= 0.82) {
      nextTrend = -1
    }
    if (nextRatio <= 0.22) {
      nextTrend = 1
    }

    return {
      ...zone,
      occupancy: nextOccupancy,
      level: levelByRatio(nextRatio),
      trend: nextTrend
    }
  })

export const queueStallsSeed: QueueStall[] = [
  {
    id: 'f-01',
    name: 'Smash Burger Bay',
    type: 'Food',
    zone: 'Concourse B',
    peopleWaiting: 24,
    avgWaitMinutes: 14
  },
  {
    id: 'f-02',
    name: 'Masala Wrap Point',
    type: 'Food',
    zone: 'Concourse C',
    peopleWaiting: 13,
    avgWaitMinutes: 8
  },
  {
    id: 'm-01',
    name: 'Official Jersey Store',
    type: 'Merch',
    zone: 'North Atrium',
    peopleWaiting: 9,
    avgWaitMinutes: 6
  },
  {
    id: 'r-01',
    name: 'Restroom Block D',
    type: 'Restroom',
    zone: 'Gate D',
    peopleWaiting: 11,
    avgWaitMinutes: 5
  }
]

export const menuSeed: MenuItem[] = [
  { id: 'm1', stallId: 'f-01', name: '🍔 Classic Smash Burger', price: 220, category: 'Non-Veg', prepMinutes: 7 },
  { id: 'm2', stallId: 'f-01', name: '🍟 Loaded Fries', price: 140, category: 'Veg', prepMinutes: 5 },
  { id: 'm3', stallId: 'f-02', name: '🌯 Paneer Tikka Wrap', price: 180, category: 'Veg', prepMinutes: 6 },
  { id: 'm4', stallId: 'f-02', name: '🥙 Chicken Shawarma Wrap', price: 210, category: 'Non-Veg', prepMinutes: 7 },
  { id: 'm5', stallId: 'f-01', name: '🥤 Arena Cola', price: 90, category: 'Drinks', prepMinutes: 2 },
  { id: 'm6', stallId: 'f-02', name: '🍱 Matchday Combo', price: 290, category: 'Combo', prepMinutes: 8 }
]

export const parkingSeed: ParkingZone[] = [
  { id: 'A', name: 'Parking A', totalSpots: 1200, availableSpots: 182, walkMinutes: 8, recommendedGate: 'Gate 1' },
  { id: 'B', name: 'Parking B', totalSpots: 950, availableSpots: 74, walkMinutes: 6, recommendedGate: 'Gate 2' },
  { id: 'C', name: 'Parking C', totalSpots: 1300, availableSpots: 462, walkMinutes: 11, recommendedGate: 'Gate 3' },
  { id: 'D', name: 'Parking D', totalSpots: 780, availableSpots: 298, walkMinutes: 5, recommendedGate: 'Gate 4' }
]

export const alertSeed: AlertItem[] = [
  {
    id: 'a1',
    title: 'Crowd Advisory',
    message: 'Gate D has high density. Prefer Gate B for faster entry.',
    severity: 'warning',
    createdAt: new Date().toISOString()
  },
  {
    id: 'a2',
    title: 'Weather Update',
    message: 'Light drizzle expected after 9:15 PM. Keep ponchos ready.',
    severity: 'info',
    createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString()
  }
]

export const venueAssistantFallback = (question: string): string => {
  const normalized = question.toLowerCase()

  if (normalized.includes('restroom')) {
    return 'Nearest restroom is Block D near Gate 4. Current wait is around 5 minutes.'
  }

  if (normalized.includes('food') || normalized.includes('eat')) {
    return 'Top nearby options: Smash Burger Bay (Concourse B, 14 min wait) and Masala Wrap Point (Concourse C, 8 min wait).'
  }

  if (normalized.includes('gate') || normalized.includes('entry')) {
    return 'For fastest entry right now, Gate B is recommended. Gate D is currently congested.'
  }

  if (normalized.includes('parking')) {
    return 'Parking C has the best availability right now with 462 spots open.'
  }

  return 'I can help with queues, food stalls, parking, gates, restrooms, and navigation. Ask me anything about the venue.'
}
