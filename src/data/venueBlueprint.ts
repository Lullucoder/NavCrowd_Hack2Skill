import type { CCTVFeed, VenueArea, VenueBlueprint, VenueCheckpoint, VenuePath } from '../types/venue'

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
    currentOccupancy: 320,
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
    currentOccupancy: 420,
    level: 'high',
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
    currentOccupancy: 650,
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
    currentOccupancy: 780,
    level: 'high',
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
    currentOccupancy: 1850,
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
    currentOccupancy: 1420,
    level: 'high',
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
    currentOccupancy: 1920,
    level: 'critical',
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
    currentOccupancy: 245,
    level: 'high',
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
    currentOccupancy: 280,
    level: 'high',
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
    currentOccupancy: 85,
    level: 'high',
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
    currentOccupancy: 185,
    level: 'high',
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
    currentOccupancy: 230,
    level: 'high',
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
  { id: 'cp-parking-c', name: 'Parking C', position: { x: 400, y: 750 }, areaId: 'parking-c', type: 'waypoint' }
]

// Define paths between checkpoints
export const venuePaths: VenuePath[] = [
  { id: 'path-1', from: 'cp-parking-a', to: 'cp-gate-a', checkpoints: ['cp-parking-a', 'cp-gate-a'], distance: 50, estimatedTime: 2, crowdLevel: 'medium', accessible: true },
  { id: 'path-2', from: 'cp-gate-a', to: 'cp-concourse-n-center', checkpoints: ['cp-gate-a', 'cp-concourse-n-center'], distance: 80, estimatedTime: 3, crowdLevel: 'medium', accessible: true },
  { id: 'path-3', from: 'cp-concourse-n-center', to: 'cp-food-1', checkpoints: ['cp-concourse-n-center', 'cp-food-1'], distance: 40, estimatedTime: 2, crowdLevel: 'high', accessible: true },
  { id: 'path-4', from: 'cp-concourse-n-center', to: 'cp-restroom-1', checkpoints: ['cp-concourse-n-center', 'cp-restroom-1'], distance: 45, estimatedTime: 2, crowdLevel: 'medium', accessible: true },
  { id: 'path-5', from: 'cp-concourse-n-center', to: 'cp-seating-n', checkpoints: ['cp-concourse-n-center', 'cp-seating-n'], distance: 60, estimatedTime: 3, crowdLevel: 'high', accessible: true },
  
  { id: 'path-6', from: 'cp-parking-b', to: 'cp-gate-b', checkpoints: ['cp-parking-b', 'cp-gate-b'], distance: 50, estimatedTime: 2, crowdLevel: 'low', accessible: true },
  { id: 'path-7', from: 'cp-gate-b', to: 'cp-concourse-e-center', checkpoints: ['cp-gate-b', 'cp-concourse-e-center'], distance: 70, estimatedTime: 3, crowdLevel: 'low', accessible: true },
  { id: 'path-8', from: 'cp-concourse-e-center', to: 'cp-food-2', checkpoints: ['cp-concourse-e-center', 'cp-food-2'], distance: 35, estimatedTime: 2, crowdLevel: 'low', accessible: true },
  { id: 'path-9', from: 'cp-concourse-e-center', to: 'cp-seating-e', checkpoints: ['cp-concourse-e-center', 'cp-seating-e'], distance: 50, estimatedTime: 2, crowdLevel: 'medium', accessible: true },
  
  { id: 'path-10', from: 'cp-parking-c', to: 'cp-gate-c', checkpoints: ['cp-parking-c', 'cp-gate-c'], distance: 65, estimatedTime: 3, crowdLevel: 'high', accessible: true },
  { id: 'path-11', from: 'cp-gate-c', to: 'cp-concourse-s-center', checkpoints: ['cp-gate-c', 'cp-concourse-s-center'], distance: 75, estimatedTime: 3, crowdLevel: 'high', accessible: true },
  { id: 'path-12', from: 'cp-concourse-s-center', to: 'cp-food-3', checkpoints: ['cp-concourse-s-center', 'cp-food-3'], distance: 50, estimatedTime: 2, crowdLevel: 'high', accessible: true },
  { id: 'path-13', from: 'cp-concourse-s-center', to: 'cp-restroom-2', checkpoints: ['cp-concourse-s-center', 'cp-restroom-2'], distance: 40, estimatedTime: 2, crowdLevel: 'high', accessible: true },
  { id: 'path-14', from: 'cp-concourse-s-center', to: 'cp-seating-s', checkpoints: ['cp-concourse-s-center', 'cp-seating-s'], distance: 55, estimatedTime: 3, crowdLevel: 'high', accessible: true }
]

// Mock CCTV feeds
export const cctvFeeds: CCTVFeed[] = [
  { id: 'cctv-1', name: 'Gate A Camera', areaId: 'gate-a', position: { x: 100, y: 70 }, status: 'active', detectedCount: 45, lastUpdate: new Date().toISOString() },
  { id: 'cctv-2', name: 'Gate B Camera', areaId: 'gate-b', position: { x: 700, y: 170 }, status: 'active', detectedCount: 22, lastUpdate: new Date().toISOString() },
  { id: 'cctv-3', name: 'Gate C Camera', areaId: 'gate-c', position: { x: 400, y: 670 }, status: 'active', detectedCount: 58, lastUpdate: new Date().toISOString() },
  { id: 'cctv-4', name: 'North Concourse Cam 1', areaId: 'concourse-north', position: { x: 300, y: 130 }, status: 'active', detectedCount: 78, lastUpdate: new Date().toISOString() },
  { id: 'cctv-5', name: 'North Concourse Cam 2', areaId: 'concourse-north', position: { x: 500, y: 130 }, status: 'active', detectedCount: 82, lastUpdate: new Date().toISOString() },
  { id: 'cctv-6', name: 'East Concourse Camera', areaId: 'concourse-east', position: { x: 670, y: 380 }, status: 'active', detectedCount: 35, lastUpdate: new Date().toISOString() },
  { id: 'cctv-7', name: 'South Concourse Cam 1', areaId: 'concourse-south', position: { x: 300, y: 630 }, status: 'active', detectedCount: 95, lastUpdate: new Date().toISOString() },
  { id: 'cctv-8', name: 'South Concourse Cam 2', areaId: 'concourse-south', position: { x: 500, y: 630 }, status: 'active', detectedCount: 102, lastUpdate: new Date().toISOString() },
  { id: 'cctv-9', name: 'Food Court North Cam', areaId: 'food-zone-1', position: { x: 300, y: 150 }, status: 'active', detectedCount: 42, lastUpdate: new Date().toISOString() },
  { id: 'cctv-10', name: 'Food Court South Cam', areaId: 'food-zone-3', position: { x: 500, y: 630 }, status: 'active', detectedCount: 48, lastUpdate: new Date().toISOString() }
]

export const venueBlueprint: VenueBlueprint = {
  id: 'nexgen-arena',
  name: 'NexGen Arena',
  width: 800,
  height: 800,
  areas: venueAreas,
  checkpoints: venueCheckpoints,
  paths: venuePaths,
  cctvFeeds
}

// Simulate ML processing of CCTV feeds
export const updateCrowdDataFromCCTV = (blueprint: VenueBlueprint): VenueBlueprint => {
  const updatedAreas = blueprint.areas.map((area) => {
    // Find CCTV feeds for this area
    const areaFeeds = blueprint.cctvFeeds.filter((feed) => feed.areaId === area.id)
    
    if (areaFeeds.length === 0) return area
    
    // Simulate ML detection - aggregate counts from cameras
    const totalDetected = areaFeeds.reduce((sum, feed) => sum + feed.detectedCount, 0)
    
    // Add some randomness to simulate movement
    const variance = Math.floor(Math.random() * 20 - 10)
    const newOccupancy = Math.max(0, Math.min(area.capacity, totalDetected * 8 + variance))
    
    const ratio = newOccupancy / area.capacity
    let level: 'low' | 'medium' | 'high' | 'critical' = 'low'
    
    if (ratio >= 0.85) level = 'critical'
    else if (ratio >= 0.65) level = 'high'
    else if (ratio >= 0.4) level = 'medium'
    
    return {
      ...area,
      currentOccupancy: newOccupancy,
      level
    }
  })
  
  // Update CCTV feed counts
  const updatedFeeds = blueprint.cctvFeeds.map((feed) => ({
    ...feed,
    detectedCount: Math.max(0, feed.detectedCount + Math.floor(Math.random() * 10 - 5)),
    lastUpdate: new Date().toISOString()
  }))
  
  return {
    ...blueprint,
    areas: updatedAreas,
    cctvFeeds: updatedFeeds
  }
}
