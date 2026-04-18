import type { CCTVFeed, VenueArea, VenueBlueprint, VenueCheckpoint, VenueIncident, VenuePath } from '../types/venue'

// Define venue areas with polygons
export const venueAreas: VenueArea[] = [
  {
    id: 'gate-a',
    name: 'Gate A - North Entrance',
    type: 'gate',
    polygon: [
      { x: 50, y: 50 },
      { x: 150, y: 50 },
      { x: 150, y: 120 },
      { x: 50, y: 120 }
    ],
    capacity: 500,
    currentOccupancy: 260,
    level: 'medium',
    connectedTo: ['concourse-north', 'parking-a']
  },
  {
    id: 'gate-b',
    name: 'Gate B - East Entrance',
    type: 'gate',
    polygon: [
      { x: 650, y: 150 },
      { x: 750, y: 150 },
      { x: 750, y: 220 },
      { x: 650, y: 220 }
    ],
    capacity: 500,
    currentOccupancy: 180,
    level: 'low',
    connectedTo: ['concourse-east', 'parking-b']
  },
  {
    id: 'gate-c',
    name: 'Gate C - South Entrance',
    type: 'gate',
    polygon: [
      { x: 350, y: 650 },
      { x: 450, y: 650 },
      { x: 450, y: 720 },
      { x: 350, y: 720 }
    ],
    capacity: 500,
    currentOccupancy: 210,
    level: 'medium',
    connectedTo: ['concourse-south', 'parking-c']
  },
  {
    id: 'concourse-north',
    name: 'North Concourse',
    type: 'concourse',
    polygon: [
      { x: 150, y: 80 },
      { x: 650, y: 80 },
      { x: 650, y: 180 },
      { x: 150, y: 180 }
    ],
    capacity: 1000,
    currentOccupancy: 540,
    level: 'medium',
    connectedTo: ['gate-a', 'seating-north', 'food-zone-1', 'restroom-1']
  },
  {
    id: 'concourse-east',
    name: 'East Concourse',
    type: 'concourse',
    polygon: [
      { x: 620, y: 180 },
      { x: 720, y: 180 },
      { x: 720, y: 580 },
      { x: 620, y: 580 }
    ],
    capacity: 800,
    currentOccupancy: 320,
    level: 'low',
    connectedTo: ['gate-b', 'seating-east', 'food-zone-2']
  },
  {
    id: 'concourse-south',
    name: 'South Concourse',
    type: 'concourse',
    polygon: [
      { x: 150, y: 580 },
      { x: 650, y: 580 },
      { x: 650, y: 680 },
      { x: 150, y: 680 }
    ],
    capacity: 1000,
    currentOccupancy: 460,
    level: 'medium',
    connectedTo: ['gate-c', 'seating-south', 'food-zone-3', 'restroom-2']
  },
  {
    id: 'seating-north',
    name: 'North Seating - Sections A-D',
    type: 'seating',
    polygon: [
      { x: 200, y: 200 },
      { x: 600, y: 200 },
      { x: 600, y: 300 },
      { x: 200, y: 300 }
    ],
    capacity: 2000,
    currentOccupancy: 1320,
    level: 'high',
    connectedTo: ['concourse-north']
  },
  {
    id: 'seating-east',
    name: 'East Seating - Sections E-H',
    type: 'seating',
    polygon: [
      { x: 520, y: 300 },
      { x: 620, y: 300 },
      { x: 620, y: 500 },
      { x: 520, y: 500 }
    ],
    capacity: 1500,
    currentOccupancy: 880,
    level: 'medium',
    connectedTo: ['concourse-east']
  },
  {
    id: 'seating-south',
    name: 'South Seating - Sections I-L',
    type: 'seating',
    polygon: [
      { x: 200, y: 500 },
      { x: 600, y: 500 },
      { x: 600, y: 600 },
      { x: 200, y: 600 }
    ],
    capacity: 2000,
    currentOccupancy: 1180,
    level: 'medium',
    connectedTo: ['concourse-south']
  },
  {
    id: 'food-zone-1',
    name: 'Food Court North',
    type: 'food',
    polygon: [
      { x: 250, y: 120 },
      { x: 350, y: 120 },
      { x: 350, y: 180 },
      { x: 250, y: 180 }
    ],
    capacity: 300,
    currentOccupancy: 118,
    level: 'medium',
    connectedTo: ['concourse-north']
  },
  {
    id: 'food-zone-2',
    name: 'Food Court East',
    type: 'food',
    polygon: [
      { x: 630, y: 350 },
      { x: 710, y: 350 },
      { x: 710, y: 420 },
      { x: 630, y: 420 }
    ],
    capacity: 250,
    currentOccupancy: 120,
    level: 'low',
    connectedTo: ['concourse-east']
  },
  {
    id: 'food-zone-3',
    name: 'Food Court South',
    type: 'food',
    polygon: [
      { x: 450, y: 600 },
      { x: 550, y: 600 },
      { x: 550, y: 660 },
      { x: 450, y: 660 }
    ],
    capacity: 300,
    currentOccupancy: 126,
    level: 'medium',
    connectedTo: ['concourse-south']
  },
  {
    id: 'restroom-1',
    name: 'Restrooms North',
    type: 'restroom',
    polygon: [
      { x: 450, y: 120 },
      { x: 520, y: 120 },
      { x: 520, y: 180 },
      { x: 450, y: 180 }
    ],
    capacity: 100,
    currentOccupancy: 65,
    level: 'medium',
    connectedTo: ['concourse-north']
  },
  {
    id: 'restroom-2',
    name: 'Restrooms South',
    type: 'restroom',
    polygon: [
      { x: 250, y: 600 },
      { x: 320, y: 600 },
      { x: 320, y: 660 },
      { x: 250, y: 660 }
    ],
    capacity: 100,
    currentOccupancy: 40,
    level: 'low',
    connectedTo: ['concourse-south']
  },
  {
    id: 'parking-a',
    name: 'Parking Lot A',
    type: 'parking',
    polygon: [
      { x: 20, y: 20 },
      { x: 120, y: 20 },
      { x: 120, y: 80 },
      { x: 20, y: 80 }
    ],
    capacity: 200,
    currentOccupancy: 120,
    level: 'medium',
    connectedTo: ['gate-a']
  },
  {
    id: 'parking-b',
    name: 'Parking Lot B',
    type: 'parking',
    polygon: [
      { x: 720, y: 100 },
      { x: 780, y: 100 },
      { x: 780, y: 200 },
      { x: 720, y: 200 }
    ],
    capacity: 150,
    currentOccupancy: 95,
    level: 'medium',
    connectedTo: ['gate-b']
  },
  {
    id: 'parking-c',
    name: 'Parking Lot C',
    type: 'parking',
    polygon: [
      { x: 320, y: 720 },
      { x: 480, y: 720 },
      { x: 480, y: 780 },
      { x: 320, y: 780 }
    ],
    capacity: 250,
    currentOccupancy: 130,
    level: 'medium',
    connectedTo: ['gate-c']
  },
  {
    id: 'emergency-exit-1',
    name: 'Emergency Exit North',
    type: 'emergency',
    polygon: [
      { x: 380, y: 50 },
      { x: 420, y: 50 },
      { x: 420, y: 80 },
      { x: 380, y: 80 }
    ],
    capacity: 200,
    currentOccupancy: 0,
    level: 'low',
    connectedTo: ['concourse-north']
  },
  {
    id: 'emergency-exit-2',
    name: 'Emergency Exit South',
    type: 'emergency',
    polygon: [
      { x: 380, y: 680 },
      { x: 420, y: 680 },
      { x: 420, y: 710 },
      { x: 380, y: 710 }
    ],
    capacity: 200,
    currentOccupancy: 0,
    level: 'low',
    connectedTo: ['concourse-south']
  }
]

// Define checkpoints for navigation
export const venueCheckpoints: VenueCheckpoint[] = [
  { id: 'cp-gate-a', name: 'Gate A Entry', position: { x: 100, y: 85 }, areaId: 'gate-a', type: 'waypoint' },
  { id: 'cp-gate-b', name: 'Gate B Entry', position: { x: 700, y: 185 }, areaId: 'gate-b', type: 'waypoint' },
  { id: 'cp-gate-c', name: 'Gate C Entry', position: { x: 400, y: 685 }, areaId: 'gate-c', type: 'waypoint' },

  { id: 'cp-concourse-n-center', name: 'North Concourse Center', position: { x: 400, y: 130 }, areaId: 'concourse-north', type: 'decision' },
  { id: 'cp-concourse-e-center', name: 'East Concourse Center', position: { x: 670, y: 380 }, areaId: 'concourse-east', type: 'decision' },
  { id: 'cp-concourse-s-center', name: 'South Concourse Center', position: { x: 400, y: 630 }, areaId: 'concourse-south', type: 'decision' },

  { id: 'cp-food-1', name: 'Food Court North', position: { x: 300, y: 150 }, areaId: 'food-zone-1', type: 'destination' },
  { id: 'cp-food-2', name: 'Food Court East', position: { x: 670, y: 385 }, areaId: 'food-zone-2', type: 'destination' },
  { id: 'cp-food-3', name: 'Food Court South', position: { x: 500, y: 630 }, areaId: 'food-zone-3', type: 'destination' },

  { id: 'cp-restroom-1', name: 'Restrooms North', position: { x: 485, y: 150 }, areaId: 'restroom-1', type: 'destination' },
  { id: 'cp-restroom-2', name: 'Restrooms South', position: { x: 285, y: 630 }, areaId: 'restroom-2', type: 'destination' },

  { id: 'cp-seating-n', name: 'North Seating Entry', position: { x: 400, y: 250 }, areaId: 'seating-north', type: 'destination' },
  { id: 'cp-seating-e', name: 'East Seating Entry', position: { x: 570, y: 400 }, areaId: 'seating-east', type: 'destination' },
  { id: 'cp-seating-s', name: 'South Seating Entry', position: { x: 400, y: 550 }, areaId: 'seating-south', type: 'destination' },

  { id: 'cp-parking-a', name: 'Parking A', position: { x: 70, y: 50 }, areaId: 'parking-a', type: 'waypoint' },
  { id: 'cp-parking-b', name: 'Parking B', position: { x: 750, y: 150 }, areaId: 'parking-b', type: 'waypoint' },
  { id: 'cp-parking-c', name: 'Parking C', position: { x: 400, y: 750 }, areaId: 'parking-c', type: 'waypoint' },

  { id: 'cp-emergency-n', name: 'Emergency Exit North', position: { x: 400, y: 65 }, areaId: 'emergency-exit-1', type: 'destination' },
  { id: 'cp-emergency-s', name: 'Emergency Exit South', position: { x: 400, y: 695 }, areaId: 'emergency-exit-2', type: 'destination' }
]

// Define paths between checkpoints
export const venuePaths: VenuePath[] = [
  { id: 'path-1', from: 'cp-parking-a', to: 'cp-gate-a', checkpoints: ['cp-parking-a', 'cp-gate-a'], distance: 50, estimatedTime: 2, crowdLevel: 'low', accessible: true },
  { id: 'path-2', from: 'cp-gate-a', to: 'cp-concourse-n-center', checkpoints: ['cp-gate-a', 'cp-concourse-n-center'], distance: 80, estimatedTime: 3, crowdLevel: 'medium', accessible: true },
  { id: 'path-3', from: 'cp-concourse-n-center', to: 'cp-food-1', checkpoints: ['cp-concourse-n-center', 'cp-food-1'], distance: 40, estimatedTime: 2, crowdLevel: 'medium', accessible: true },
  { id: 'path-4', from: 'cp-concourse-n-center', to: 'cp-restroom-1', checkpoints: ['cp-concourse-n-center', 'cp-restroom-1'], distance: 45, estimatedTime: 2, crowdLevel: 'medium', accessible: true },
  { id: 'path-5', from: 'cp-concourse-n-center', to: 'cp-seating-n', checkpoints: ['cp-concourse-n-center', 'cp-seating-n'], distance: 60, estimatedTime: 3, crowdLevel: 'medium', accessible: true },

  { id: 'path-6', from: 'cp-parking-b', to: 'cp-gate-b', checkpoints: ['cp-parking-b', 'cp-gate-b'], distance: 50, estimatedTime: 2, crowdLevel: 'low', accessible: true },
  { id: 'path-7', from: 'cp-gate-b', to: 'cp-concourse-e-center', checkpoints: ['cp-gate-b', 'cp-concourse-e-center'], distance: 70, estimatedTime: 3, crowdLevel: 'low', accessible: true },
  { id: 'path-8', from: 'cp-concourse-e-center', to: 'cp-food-2', checkpoints: ['cp-concourse-e-center', 'cp-food-2'], distance: 35, estimatedTime: 2, crowdLevel: 'low', accessible: true },
  { id: 'path-9', from: 'cp-concourse-e-center', to: 'cp-seating-e', checkpoints: ['cp-concourse-e-center', 'cp-seating-e'], distance: 50, estimatedTime: 2, crowdLevel: 'medium', accessible: true },

  { id: 'path-10', from: 'cp-parking-c', to: 'cp-gate-c', checkpoints: ['cp-parking-c', 'cp-gate-c'], distance: 65, estimatedTime: 3, crowdLevel: 'medium', accessible: true },
  { id: 'path-11', from: 'cp-gate-c', to: 'cp-concourse-s-center', checkpoints: ['cp-gate-c', 'cp-concourse-s-center'], distance: 75, estimatedTime: 3, crowdLevel: 'medium', accessible: true },
  { id: 'path-12', from: 'cp-concourse-s-center', to: 'cp-food-3', checkpoints: ['cp-concourse-s-center', 'cp-food-3'], distance: 50, estimatedTime: 2, crowdLevel: 'medium', accessible: true },
  { id: 'path-13', from: 'cp-concourse-s-center', to: 'cp-restroom-2', checkpoints: ['cp-concourse-s-center', 'cp-restroom-2'], distance: 40, estimatedTime: 2, crowdLevel: 'medium', accessible: true },
  { id: 'path-14', from: 'cp-concourse-s-center', to: 'cp-seating-s', checkpoints: ['cp-concourse-s-center', 'cp-seating-s'], distance: 55, estimatedTime: 3, crowdLevel: 'medium', accessible: true },

  { id: 'path-15', from: 'cp-concourse-n-center', to: 'cp-concourse-e-center', checkpoints: ['cp-concourse-n-center', 'cp-concourse-e-center'], distance: 270, estimatedTime: 8, crowdLevel: 'medium', accessible: true },
  { id: 'path-16', from: 'cp-concourse-e-center', to: 'cp-concourse-s-center', checkpoints: ['cp-concourse-e-center', 'cp-concourse-s-center'], distance: 300, estimatedTime: 9, crowdLevel: 'medium', accessible: true },
  { id: 'path-17', from: 'cp-concourse-s-center', to: 'cp-concourse-n-center', checkpoints: ['cp-concourse-s-center', 'cp-concourse-n-center'], distance: 300, estimatedTime: 9, crowdLevel: 'medium', accessible: true },
  { id: 'path-18', from: 'cp-seating-n', to: 'cp-seating-e', checkpoints: ['cp-seating-n', 'cp-seating-e'], distance: 210, estimatedTime: 7, crowdLevel: 'medium', accessible: true },
  { id: 'path-19', from: 'cp-seating-e', to: 'cp-seating-s', checkpoints: ['cp-seating-e', 'cp-seating-s'], distance: 220, estimatedTime: 7, crowdLevel: 'medium', accessible: true },
  { id: 'path-20', from: 'cp-seating-s', to: 'cp-seating-n', checkpoints: ['cp-seating-s', 'cp-seating-n'], distance: 300, estimatedTime: 9, crowdLevel: 'medium', accessible: true },

  { id: 'path-21', from: 'cp-concourse-n-center', to: 'cp-gate-b', checkpoints: ['cp-concourse-n-center', 'cp-gate-b'], distance: 240, estimatedTime: 7, crowdLevel: 'medium', accessible: true },
  { id: 'path-22', from: 'cp-concourse-s-center', to: 'cp-gate-a', checkpoints: ['cp-concourse-s-center', 'cp-gate-a'], distance: 360, estimatedTime: 10, crowdLevel: 'medium', accessible: true },
  { id: 'path-23', from: 'cp-concourse-e-center', to: 'cp-gate-c', checkpoints: ['cp-concourse-e-center', 'cp-gate-c'], distance: 250, estimatedTime: 8, crowdLevel: 'medium', accessible: true },

  { id: 'path-24', from: 'cp-concourse-n-center', to: 'cp-emergency-n', checkpoints: ['cp-concourse-n-center', 'cp-emergency-n'], distance: 80, estimatedTime: 3, crowdLevel: 'low', accessible: true },
  { id: 'path-25', from: 'cp-concourse-s-center', to: 'cp-emergency-s', checkpoints: ['cp-concourse-s-center', 'cp-emergency-s'], distance: 80, estimatedTime: 3, crowdLevel: 'low', accessible: true },
  { id: 'path-26', from: 'cp-seating-n', to: 'cp-emergency-n', checkpoints: ['cp-seating-n', 'cp-emergency-n'], distance: 190, estimatedTime: 6, crowdLevel: 'medium', accessible: true },
  { id: 'path-27', from: 'cp-seating-s', to: 'cp-emergency-s', checkpoints: ['cp-seating-s', 'cp-emergency-s'], distance: 170, estimatedTime: 5, crowdLevel: 'medium', accessible: true },
  { id: 'path-28', from: 'cp-gate-b', to: 'cp-emergency-n', checkpoints: ['cp-gate-b', 'cp-emergency-n'], distance: 305, estimatedTime: 9, crowdLevel: 'low', accessible: true },
  { id: 'path-29', from: 'cp-gate-c', to: 'cp-emergency-s', checkpoints: ['cp-gate-c', 'cp-emergency-s'], distance: 85, estimatedTime: 3, crowdLevel: 'low', accessible: true }
]

// Mock CCTV feeds
export const cctvFeeds: CCTVFeed[] = [
  { id: 'cctv-1', name: 'Gate A Camera', areaId: 'gate-a', position: { x: 100, y: 70 }, status: 'active', detectedCount: 39, lastUpdate: new Date().toISOString() },
  { id: 'cctv-2', name: 'Gate B Camera', areaId: 'gate-b', position: { x: 700, y: 170 }, status: 'active', detectedCount: 18, lastUpdate: new Date().toISOString() },
  { id: 'cctv-3', name: 'Gate C Camera', areaId: 'gate-c', position: { x: 400, y: 670 }, status: 'active', detectedCount: 33, lastUpdate: new Date().toISOString() },
  { id: 'cctv-4', name: 'North Concourse Cam 1', areaId: 'concourse-north', position: { x: 300, y: 130 }, status: 'active', detectedCount: 56, lastUpdate: new Date().toISOString() },
  { id: 'cctv-5', name: 'North Concourse Cam 2', areaId: 'concourse-north', position: { x: 500, y: 130 }, status: 'active', detectedCount: 50, lastUpdate: new Date().toISOString() },
  { id: 'cctv-6', name: 'East Concourse Camera', areaId: 'concourse-east', position: { x: 670, y: 380 }, status: 'active', detectedCount: 31, lastUpdate: new Date().toISOString() },
  { id: 'cctv-7', name: 'South Concourse Cam 1', areaId: 'concourse-south', position: { x: 300, y: 630 }, status: 'active', detectedCount: 47, lastUpdate: new Date().toISOString() },
  { id: 'cctv-8', name: 'South Concourse Cam 2', areaId: 'concourse-south', position: { x: 500, y: 630 }, status: 'active', detectedCount: 43, lastUpdate: new Date().toISOString() },
  { id: 'cctv-9', name: 'Food Court North Cam', areaId: 'food-zone-1', position: { x: 300, y: 150 }, status: 'active', detectedCount: 27, lastUpdate: new Date().toISOString() },
  { id: 'cctv-10', name: 'Food Court South Cam', areaId: 'food-zone-3', position: { x: 500, y: 630 }, status: 'active', detectedCount: 26, lastUpdate: new Date().toISOString() }
]

export const venueBlueprint: VenueBlueprint = {
  id: 'nexgen-arena',
  name: 'NexGen Arena',
  width: 800,
  height: 800,
  areas: venueAreas,
  checkpoints: venueCheckpoints,
  paths: venuePaths,
  cctvFeeds,
  incident: null
}

const clampValue = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min

const determineCrowdLevel = (ratio: number): VenueArea['level'] => {
  if (ratio >= 0.9) return 'critical'
  if (ratio >= 0.72) return 'high'
  if (ratio >= 0.45) return 'medium'
  return 'low'
}

type SimulationPhase = 'arrival' | 'in-event' | 'halftime' | 'egress'

const occupancyScaleByAreaType: Record<VenueArea['type'], number> = {
  gate: 5,
  concourse: 6,
  seating: 18,
  food: 4,
  restroom: 2.2,
  parking: 4,
  emergency: 5
}

const targetOccupancyByPhase: Record<SimulationPhase, Record<VenueArea['type'], number>> = {
  arrival: {
    gate: 0.46,
    concourse: 0.5,
    seating: 0.58,
    food: 0.36,
    restroom: 0.32,
    parking: 0.62,
    emergency: 0.04
  },
  'in-event': {
    gate: 0.26,
    concourse: 0.42,
    seating: 0.68,
    food: 0.28,
    restroom: 0.22,
    parking: 0.56,
    emergency: 0.03
  },
  halftime: {
    gate: 0.32,
    concourse: 0.62,
    seating: 0.45,
    food: 0.64,
    restroom: 0.58,
    parking: 0.58,
    emergency: 0.05
  },
  egress: {
    gate: 0.57,
    concourse: 0.53,
    seating: 0.34,
    food: 0.29,
    restroom: 0.24,
    parking: 0.66,
    emergency: 0.08
  }
}

const incidentGuidanceByType: Record<VenueIncident['type'], string> = {
  fire: 'Fire alert active. Avoid the affected zone and route through nearest emergency exits.',
  medical: 'Medical response active. Keep corridors clear and use alternate fan routes.',
  security: 'Security hold active. Follow steward guidance and avoid congestion pockets.'
}

const getSimulationPhase = (date: Date): SimulationPhase => {
  const minute = date.getMinutes() % 60
  if (minute < 15) return 'arrival'
  if (minute < 35) return 'in-event'
  if (minute < 48) return 'halftime'
  return 'egress'
}

const chooseIncident = (blueprint: VenueBlueprint, now: Date): VenueIncident | null => {
  if (blueprint.incident && blueprint.incident.active) {
    const expiry = new Date(blueprint.incident.expiresAt).getTime()
    if (expiry > now.getTime()) {
      return blueprint.incident
    }
  }

  const overloadedAreas = blueprint.areas.filter((area) => {
    if (area.type === 'emergency' || area.type === 'parking') return false
    return area.currentOccupancy / Math.max(1, area.capacity) > 0.8
  })

  if (overloadedAreas.length === 0 || Math.random() > 0.08) {
    return null
  }

  const sourceArea = overloadedAreas[randomInt(0, overloadedAreas.length - 1)]
  const incidentTypes: VenueIncident['type'][] = ['fire', 'medical', 'security']
  const type = incidentTypes[randomInt(0, incidentTypes.length - 1)]
  const ratio = sourceArea.currentOccupancy / Math.max(1, sourceArea.capacity)
  const severity: VenueIncident['severity'] = ratio > 0.9 ? 'critical' : ratio > 0.85 ? 'high' : 'medium'
  const expiresAt = new Date(now.getTime() + (severity === 'critical' ? 6 : 4) * 60 * 1000)

  return {
    id: `${type}-${now.getTime()}`,
    type,
    areaId: sourceArea.id,
    severity,
    active: true,
    startedAt: now.toISOString(),
    expiresAt: expiresAt.toISOString(),
    guidance: incidentGuidanceByType[type]
  }
}

// Simulate ML processing of CCTV feeds with balanced inflow/outflow dynamics.
export const updateCrowdDataFromCCTV = (blueprint: VenueBlueprint): VenueBlueprint => {
  const now = new Date()
  const simulationPhase = getSimulationPhase(now)
  const incident = chooseIncident(blueprint, now)
  const areaById = new Map(blueprint.areas.map((area) => [area.id, area]))

  const updatedFeeds = blueprint.cctvFeeds.map((feed) => {
    const area = areaById.get(feed.areaId)
    if (!area) {
      return {
        ...feed,
        lastUpdate: now.toISOString()
      }
    }

    const scale = occupancyScaleByAreaType[area.type]
    const baselineObservation = area.currentOccupancy / Math.max(1, scale)
    const incidentSignal = incident?.areaId === area.id ? (incident.type === 'fire' ? 7 : 4) : 0
    const nextDetected = clampValue(
      Math.round(feed.detectedCount * 0.58 + baselineObservation * 0.42 + randomInt(-3, 3) + incidentSignal),
      0,
      160
    )

    return {
      ...feed,
      detectedCount: nextDetected,
      lastUpdate: now.toISOString()
    }
  })

  const feedByArea = new Map<string, number[]>()
  updatedFeeds.forEach((feed) => {
    const counts = feedByArea.get(feed.areaId) ?? []
    counts.push(feed.detectedCount)
    feedByArea.set(feed.areaId, counts)
  })

  const updatedAreas = blueprint.areas.map((area) => {
    const currentRatio = area.currentOccupancy / Math.max(1, area.capacity)
    const targetRatio = targetOccupancyByPhase[simulationPhase][area.type]
    const baselineTarget = area.capacity * targetRatio
    const areaFeeds = feedByArea.get(area.id) ?? []
    const hasFeeds = areaFeeds.length > 0
    const observedPeople = hasFeeds
      ? (areaFeeds.reduce((sum, count) => sum + count, 0) / areaFeeds.length) * occupancyScaleByAreaType[area.type]
      : area.currentOccupancy

    const neighborRatios = area.connectedTo
      .map((connectedId) => areaById.get(connectedId))
      .filter((neighbor): neighbor is VenueArea => Boolean(neighbor))
      .map((neighbor) => neighbor.currentOccupancy / Math.max(1, neighbor.capacity))
    const neighborRatio = neighborRatios.length > 0
      ? neighborRatios.reduce((sum, ratio) => sum + ratio, 0) / neighborRatios.length
      : currentRatio

    let inflow = randomInt(0, Math.max(1, Math.round(area.capacity * 0.015)))
    let outflow = randomInt(0, Math.max(1, Math.round(area.capacity * 0.014)))

    if (simulationPhase === 'arrival') {
      if (area.type === 'gate' || area.type === 'parking' || area.type === 'concourse') {
        inflow += Math.round(area.capacity * 0.014)
      }
      if (area.type === 'seating') {
        inflow += Math.round(area.capacity * 0.007)
      }
    }

    if (simulationPhase === 'halftime') {
      if (area.type === 'food' || area.type === 'restroom' || area.type === 'concourse') {
        inflow += Math.round(area.capacity * 0.012)
      }
      if (area.type === 'seating') {
        outflow += Math.round(area.capacity * 0.016)
      }
    }

    if (simulationPhase === 'egress') {
      outflow += Math.round(area.capacity * 0.018)
      if (area.type === 'gate' || area.type === 'parking' || area.type === 'emergency') {
        inflow += Math.round(area.capacity * 0.01)
      }
    }

    let incidentEffect = 0
    if (incident) {
      if (incident.areaId === area.id) {
        incidentEffect += incident.type === 'fire' ? -Math.round(area.capacity * 0.09) : Math.round(area.capacity * 0.04)
      } else if (area.connectedTo.includes(incident.areaId)) {
        incidentEffect += incident.type === 'fire' ? Math.round(area.capacity * 0.015) : Math.round(area.capacity * 0.01)
      }

      if (area.type === 'emergency' && incident.type === 'fire') {
        incidentEffect += Math.round(area.capacity * 0.08)
      }
    } else if (area.type === 'emergency') {
      outflow += Math.round(area.capacity * 0.1)
    }

    const reversion = (baselineTarget - area.currentOccupancy) * 0.24
    const feedCorrection = hasFeeds ? (observedPeople - area.currentOccupancy) * 0.17 : 0
    const neighborPressure = (neighborRatio - currentRatio) * area.capacity * 0.09
    const netFlow = inflow - outflow

    const rawDelta = reversion + feedCorrection + neighborPressure + netFlow + incidentEffect
    const maxStep = Math.max(10, Math.round(area.capacity * 0.055))
    const delta = clampValue(Math.round(rawDelta), -maxStep, maxStep)

    let nextOccupancy = clampValue(area.currentOccupancy + delta, 0, Math.round(area.capacity * 0.95))
    if (area.type === 'emergency' && !incident) {
      nextOccupancy = Math.min(nextOccupancy, Math.round(area.capacity * 0.12))
    }

    const level = determineCrowdLevel(nextOccupancy / Math.max(1, area.capacity))

    return {
      ...area,
      currentOccupancy: nextOccupancy,
      level
    }
  })

  const areaAfterUpdateById = new Map(updatedAreas.map((area) => [area.id, area]))
  const checkpointById = new Map(blueprint.checkpoints.map((checkpoint) => [checkpoint.id, checkpoint]))

  const updatedPaths = blueprint.paths.map((path) => {
    const fromCheckpoint = checkpointById.get(path.from)
    const toCheckpoint = checkpointById.get(path.to)
    const fromArea = fromCheckpoint ? areaAfterUpdateById.get(fromCheckpoint.areaId) : undefined
    const toArea = toCheckpoint ? areaAfterUpdateById.get(toCheckpoint.areaId) : undefined

    const fromRatio = fromArea ? fromArea.currentOccupancy / Math.max(1, fromArea.capacity) : 0.45
    const toRatio = toArea ? toArea.currentOccupancy / Math.max(1, toArea.capacity) : 0.45
    const pressure = (fromRatio + toRatio) / 2

    const crowdLevel: VenuePath['crowdLevel'] = pressure >= 0.78 ? 'high' : pressure >= 0.52 ? 'medium' : 'low'
    const blockedByIncident = Boolean(
      incident?.type === 'fire' &&
      fromArea &&
      toArea &&
      (fromArea.id === incident.areaId || toArea.id === incident.areaId)
    )

    return {
      ...path,
      crowdLevel,
      accessible: path.accessible && !blockedByIncident
    }
  })

  return {
    ...blueprint,
    areas: updatedAreas,
    paths: updatedPaths,
    cctvFeeds: updatedFeeds,
    incident
  }
}
