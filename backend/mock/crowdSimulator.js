import { predictCrowdForHorizon } from '../services/predictionEngine.js'

const baseZones = [
  { id: 'gate-a', name: 'Gate A', capacity: 1200, occupancy: 420, trend: 1 },
  { id: 'gate-d', name: 'Gate D', capacity: 1100, occupancy: 810, trend: -1 },
  { id: 'north-stand', name: 'North Stand', capacity: 9000, occupancy: 5800, trend: 1 },
  { id: 'south-stand', name: 'South Stand', capacity: 9200, occupancy: 7100, trend: -1 },
  { id: 'food-east', name: 'Food Court East', capacity: 1100, occupancy: 620, trend: 1 },
  { id: 'food-west', name: 'Food Court West', capacity: 1050, occupancy: 710, trend: -1 },
  { id: 'merch-hub', name: 'Merch Hub', capacity: 700, occupancy: 330, trend: 1 },
  { id: 'exit-lane-2', name: 'Exit Lane 2', capacity: 1200, occupancy: 250, trend: 1 }
]

const crowdLevel = (occupancy, capacity) => {
  const ratio = occupancy / capacity

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

export const buildHeatmapSnapshot = (date = new Date()) => {
  const minute = date.getMinutes()
  const pulse = Math.sin(minute / 60 * Math.PI * 2)

  return baseZones.map((zone) => {
    const swing = Math.round(zone.capacity * 0.08 * pulse * zone.trend)
    const occupancy = Math.max(40, Math.min(zone.capacity - 20, zone.occupancy + swing))

    return {
      ...zone,
      occupancy,
      level: crowdLevel(occupancy, zone.capacity)
    }
  })
}

export const buildCrowdForecast = (minutesAhead = 20) =>
  baseZones.map((zone) => {
    const occupancy = predictCrowdForHorizon({
      occupancy: zone.occupancy,
      capacity: zone.capacity,
      trend: zone.trend,
      minutesAhead
    })

    return {
      ...zone,
      occupancy,
      level: crowdLevel(occupancy, zone.capacity),
      minutesAhead
    }
  })
