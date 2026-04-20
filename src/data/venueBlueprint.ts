import type { CCTVFeed, VenueArea, VenueBlueprint, VenueCheckpoint, VenueIncident, VenuePath } from '../types/venue'

// Define venue areas with polygons
export const venueAreas: VenueArea[] = [
  {
    id: 'gate-a',
    name: 'Gate A - North Main',
    type: 'gate',
    polygon: [
      { x: 410, y: 40 },
      { x: 550, y: 40 },
      { x: 550, y: 110 },
      { x: 410, y: 110 }
    ],
    capacity: 700,
    currentOccupancy: 310,
    level: 'medium',
    connectedTo: ['concourse-north', 'parking-a']
  },
  {
    id: 'gate-b',
    name: 'Gate B - East Main',
    type: 'gate',
    polygon: [
      { x: 840, y: 290 },
      { x: 920, y: 290 },
      { x: 920, y: 420 },
      { x: 840, y: 420 }
    ],
    capacity: 700,
    currentOccupancy: 180,
    level: 'low',
    connectedTo: ['concourse-east', 'parking-b']
  },
  {
    id: 'gate-c',
    name: 'Gate C - South Main',
    type: 'gate',
    polygon: [
      { x: 410, y: 710 },
      { x: 550, y: 710 },
      { x: 550, y: 760 },
      { x: 410, y: 760 }
    ],
    capacity: 700,
    currentOccupancy: 230,
    level: 'medium',
    connectedTo: ['concourse-south', 'parking-c']
  },
  {
    id: 'gate-d',
    name: 'Gate D - West Main',
    type: 'gate',
    polygon: [
      { x: 20, y: 290 },
      { x: 100, y: 290 },
      { x: 100, y: 420 },
      { x: 20, y: 420 }
    ],
    capacity: 700,
    currentOccupancy: 165,
    level: 'low',
    connectedTo: ['concourse-west', 'parking-d']
  },
  {
    id: 'concourse-north',
    name: 'North Concourse',
    type: 'concourse',
    polygon: [
      { x: 220, y: 120 },
      { x: 740, y: 120 },
      { x: 710, y: 180 },
      { x: 250, y: 180 }
    ],
    capacity: 1400,
    currentOccupancy: 620,
    level: 'medium',
    connectedTo: ['gate-a', 'seating-north', 'concourse-east', 'concourse-west', 'food-zone-1', 'restroom-1', 'emergency-exit-1']
  },
  {
    id: 'concourse-east',
    name: 'East Concourse',
    type: 'concourse',
    polygon: [
      { x: 760, y: 170 },
      { x: 840, y: 210 },
      { x: 840, y: 610 },
      { x: 760, y: 640 },
      { x: 730, y: 580 },
      { x: 730, y: 230 }
    ],
    capacity: 1200,
    currentOccupancy: 520,
    level: 'medium',
    connectedTo: ['gate-b', 'seating-east', 'concourse-north', 'concourse-south', 'food-zone-2']
  },
  {
    id: 'concourse-south',
    name: 'South Concourse',
    type: 'concourse',
    polygon: [
      { x: 250, y: 640 },
      { x: 710, y: 640 },
      { x: 740, y: 710 },
      { x: 220, y: 710 }
    ],
    capacity: 1400,
    currentOccupancy: 690,
    level: 'medium',
    connectedTo: ['gate-c', 'seating-south', 'concourse-east', 'concourse-west', 'food-zone-3', 'restroom-2', 'emergency-exit-2']
  },
  {
    id: 'concourse-west',
    name: 'West Concourse',
    type: 'concourse',
    polygon: [
      { x: 120, y: 210 },
      { x: 200, y: 170 },
      { x: 230, y: 230 },
      { x: 230, y: 580 },
      { x: 150, y: 640 },
      { x: 90, y: 600 }
    ],
    capacity: 1200,
    currentOccupancy: 470,
    level: 'medium',
    connectedTo: ['gate-d', 'seating-west', 'concourse-north', 'concourse-south', 'food-zone-4', 'restroom-3']
  },
  {
    id: 'seating-north',
    name: 'North Stand - Sections A-D',
    type: 'seating',
    polygon: [
      { x: 250, y: 180 },
      { x: 710, y: 180 },
      { x: 660, y: 290 },
      { x: 300, y: 290 }
    ],
    capacity: 2800,
    currentOccupancy: 1790,
    level: 'high',
    connectedTo: ['concourse-north', 'field-core', 'seating-east', 'seating-west']
  },
  {
    id: 'seating-east',
    name: 'East Stand - Sections E-H',
    type: 'seating',
    polygon: [
      { x: 670, y: 250 },
      { x: 760, y: 220 },
      { x: 790, y: 560 },
      { x: 700, y: 600 },
      { x: 620, y: 520 },
      { x: 620, y: 330 }
    ],
    capacity: 1900,
    currentOccupancy: 1210,
    level: 'high',
    connectedTo: ['concourse-east', 'field-core', 'seating-north', 'seating-south']
  },
  {
    id: 'seating-south',
    name: 'South Stand - Sections I-L',
    type: 'seating',
    polygon: [
      { x: 300, y: 530 },
      { x: 660, y: 530 },
      { x: 710, y: 640 },
      { x: 250, y: 640 }
    ],
    capacity: 2800,
    currentOccupancy: 1620,
    level: 'medium',
    connectedTo: ['concourse-south', 'field-core', 'seating-east', 'seating-west']
  },
  {
    id: 'seating-west',
    name: 'West Stand - Sections M-P',
    type: 'seating',
    polygon: [
      { x: 200, y: 220 },
      { x: 290, y: 250 },
      { x: 290, y: 520 },
      { x: 210, y: 600 },
      { x: 130, y: 560 },
      { x: 160, y: 240 }
    ],
    capacity: 1900,
    currentOccupancy: 1090,
    level: 'medium',
    connectedTo: ['concourse-west', 'field-core', 'seating-north', 'seating-south']
  },
  {
    id: 'field-core',
    name: 'Pitch and Field Core',
    type: 'field',
    polygon: [
      { x: 350, y: 290 },
      { x: 610, y: 290 },
      { x: 670, y: 360 },
      { x: 670, y: 460 },
      { x: 610, y: 530 },
      { x: 350, y: 530 },
      { x: 290, y: 460 },
      { x: 290, y: 360 }
    ],
    capacity: 120,
    currentOccupancy: 22,
    level: 'low',
    connectedTo: ['seating-north', 'seating-east', 'seating-south', 'seating-west']
  },
  {
    id: 'food-zone-1',
    name: 'Food Court North',
    type: 'food',
    polygon: [
      { x: 330, y: 200 },
      { x: 420, y: 200 },
      { x: 420, y: 250 },
      { x: 330, y: 250 }
    ],
    capacity: 320,
    currentOccupancy: 142,
    level: 'medium',
    connectedTo: ['concourse-north']
  },
  {
    id: 'food-zone-2',
    name: 'Food Court East',
    type: 'food',
    polygon: [
      { x: 740, y: 390 },
      { x: 810, y: 390 },
      { x: 810, y: 460 },
      { x: 740, y: 460 }
    ],
    capacity: 280,
    currentOccupancy: 134,
    level: 'medium',
    connectedTo: ['concourse-east']
  },
  {
    id: 'food-zone-3',
    name: 'Food Court South',
    type: 'food',
    polygon: [
      { x: 510, y: 570 },
      { x: 600, y: 570 },
      { x: 600, y: 625 },
      { x: 510, y: 625 }
    ],
    capacity: 320,
    currentOccupancy: 148,
    level: 'medium',
    connectedTo: ['concourse-south']
  },
  {
    id: 'food-zone-4',
    name: 'Food Court West',
    type: 'food',
    polygon: [
      { x: 170, y: 380 },
      { x: 240, y: 380 },
      { x: 240, y: 450 },
      { x: 170, y: 450 }
    ],
    capacity: 280,
    currentOccupancy: 116,
    level: 'medium',
    connectedTo: ['concourse-west']
  },
  {
    id: 'restroom-1',
    name: 'Restrooms North',
    type: 'restroom',
    polygon: [
      { x: 490, y: 200 },
      { x: 560, y: 200 },
      { x: 560, y: 245 },
      { x: 490, y: 245 }
    ],
    capacity: 140,
    currentOccupancy: 78,
    level: 'medium',
    connectedTo: ['concourse-north']
  },
  {
    id: 'restroom-2',
    name: 'Restrooms South',
    type: 'restroom',
    polygon: [
      { x: 320, y: 570 },
      { x: 390, y: 570 },
      { x: 390, y: 625 },
      { x: 320, y: 625 }
    ],
    capacity: 140,
    currentOccupancy: 62,
    level: 'medium',
    connectedTo: ['concourse-south']
  },
  {
    id: 'restroom-3',
    name: 'Restrooms West',
    type: 'restroom',
    polygon: [
      { x: 170, y: 470 },
      { x: 230, y: 470 },
      { x: 230, y: 520 },
      { x: 170, y: 520 }
    ],
    capacity: 120,
    currentOccupancy: 49,
    level: 'low',
    connectedTo: ['concourse-west']
  },
  {
    id: 'parking-a',
    name: 'Parking Lot A',
    type: 'parking',
    polygon: [
      { x: 120, y: 20 },
      { x: 300, y: 20 },
      { x: 300, y: 100 },
      { x: 120, y: 100 }
    ],
    capacity: 420,
    currentOccupancy: 265,
    level: 'medium',
    connectedTo: ['gate-a']
  },
  {
    id: 'parking-b',
    name: 'Parking Lot B',
    type: 'parking',
    polygon: [
      { x: 860, y: 130 },
      { x: 950, y: 130 },
      { x: 950, y: 270 },
      { x: 860, y: 270 }
    ],
    capacity: 300,
    currentOccupancy: 188,
    level: 'medium',
    connectedTo: ['gate-b']
  },
  {
    id: 'parking-c',
    name: 'Parking Lot C',
    type: 'parking',
    polygon: [
      { x: 350, y: 760 },
      { x: 610, y: 760 },
      { x: 610, y: 820 },
      { x: 350, y: 820 }
    ],
    capacity: 520,
    currentOccupancy: 332,
    level: 'medium',
    connectedTo: ['gate-c']
  },
  {
    id: 'parking-d',
    name: 'Parking Lot D',
    type: 'parking',
    polygon: [
      { x: 0, y: 500 },
      { x: 90, y: 500 },
      { x: 90, y: 680 },
      { x: 0, y: 680 }
    ],
    capacity: 300,
    currentOccupancy: 174,
    level: 'medium',
    connectedTo: ['gate-d']
  },
  {
    id: 'emergency-exit-1',
    name: 'Emergency Exit North',
    type: 'emergency',
    polygon: [
      { x: 460, y: 110 },
      { x: 500, y: 110 },
      { x: 500, y: 140 },
      { x: 460, y: 140 }
    ],
    capacity: 240,
    currentOccupancy: 0,
    level: 'low',
    connectedTo: ['concourse-north']
  },
  {
    id: 'emergency-exit-2',
    name: 'Emergency Exit South',
    type: 'emergency',
    polygon: [
      { x: 460, y: 680 },
      { x: 500, y: 680 },
      { x: 500, y: 710 },
      { x: 460, y: 710 }
    ],
    capacity: 240,
    currentOccupancy: 0,
    level: 'low',
    connectedTo: ['concourse-south']
  }
]

// Define checkpoints for navigation
export const venueCheckpoints: VenueCheckpoint[] = [
  { id: 'cp-gate-a', name: 'Gate A Entry', position: { x: 480, y: 90 }, areaId: 'gate-a', type: 'waypoint' },
  { id: 'cp-gate-b', name: 'Gate B Entry', position: { x: 880, y: 355 }, areaId: 'gate-b', type: 'waypoint' },
  { id: 'cp-gate-c', name: 'Gate C Entry', position: { x: 480, y: 735 }, areaId: 'gate-c', type: 'waypoint' },
  { id: 'cp-gate-d', name: 'Gate D Entry', position: { x: 60, y: 355 }, areaId: 'gate-d', type: 'waypoint' },

  { id: 'cp-concourse-n-center', name: 'North Concourse Junction', position: { x: 480, y: 150 }, areaId: 'concourse-north', type: 'decision' },
  { id: 'cp-concourse-e-center', name: 'East Concourse Junction', position: { x: 790, y: 420 }, areaId: 'concourse-east', type: 'decision' },
  { id: 'cp-concourse-s-center', name: 'South Concourse Junction', position: { x: 480, y: 675 }, areaId: 'concourse-south', type: 'decision' },
  { id: 'cp-concourse-w-center', name: 'West Concourse Junction', position: { x: 170, y: 420 }, areaId: 'concourse-west', type: 'decision' },

  { id: 'cp-food-1', name: 'Food Court North', position: { x: 375, y: 225 }, areaId: 'food-zone-1', type: 'destination' },
  { id: 'cp-food-2', name: 'Food Court East', position: { x: 775, y: 425 }, areaId: 'food-zone-2', type: 'destination' },
  { id: 'cp-food-3', name: 'Food Court South', position: { x: 555, y: 595 }, areaId: 'food-zone-3', type: 'destination' },
  { id: 'cp-food-4', name: 'Food Court West', position: { x: 205, y: 415 }, areaId: 'food-zone-4', type: 'destination' },

  { id: 'cp-restroom-1', name: 'Restrooms North', position: { x: 525, y: 220 }, areaId: 'restroom-1', type: 'destination' },
  { id: 'cp-restroom-2', name: 'Restrooms South', position: { x: 355, y: 595 }, areaId: 'restroom-2', type: 'destination' },
  { id: 'cp-restroom-3', name: 'Restrooms West', position: { x: 200, y: 495 }, areaId: 'restroom-3', type: 'destination' },

  { id: 'cp-seating-n', name: 'North Stand Entry', position: { x: 480, y: 245 }, areaId: 'seating-north', type: 'destination' },
  { id: 'cp-seating-e', name: 'East Stand Entry', position: { x: 705, y: 420 }, areaId: 'seating-east', type: 'destination' },
  { id: 'cp-seating-s', name: 'South Stand Entry', position: { x: 480, y: 585 }, areaId: 'seating-south', type: 'destination' },
  { id: 'cp-seating-w', name: 'West Stand Entry', position: { x: 245, y: 420 }, areaId: 'seating-west', type: 'destination' },

  { id: 'cp-parking-a', name: 'Parking A', position: { x: 210, y: 60 }, areaId: 'parking-a', type: 'waypoint' },
  { id: 'cp-parking-b', name: 'Parking B', position: { x: 905, y: 200 }, areaId: 'parking-b', type: 'waypoint' },
  { id: 'cp-parking-c', name: 'Parking C', position: { x: 480, y: 790 }, areaId: 'parking-c', type: 'waypoint' },
  { id: 'cp-parking-d', name: 'Parking D', position: { x: 45, y: 590 }, areaId: 'parking-d', type: 'waypoint' },

  { id: 'cp-emergency-n', name: 'Emergency Exit North', position: { x: 480, y: 125 }, areaId: 'emergency-exit-1', type: 'destination' },
  { id: 'cp-emergency-s', name: 'Emergency Exit South', position: { x: 480, y: 695 }, areaId: 'emergency-exit-2', type: 'destination' }
]

// Define paths between checkpoints
export const venuePaths: VenuePath[] = [
  { id: 'path-1', from: 'cp-parking-a', to: 'cp-gate-a', checkpoints: ['cp-parking-a', 'cp-gate-a'], distance: 120, estimatedTime: 4, crowdLevel: 'low', accessible: true },
  { id: 'path-2', from: 'cp-gate-a', to: 'cp-concourse-n-center', checkpoints: ['cp-gate-a', 'cp-concourse-n-center'], distance: 70, estimatedTime: 2, crowdLevel: 'medium', accessible: true },
  { id: 'path-3', from: 'cp-concourse-n-center', to: 'cp-food-1', checkpoints: ['cp-concourse-n-center', 'cp-food-1'], distance: 55, estimatedTime: 2, crowdLevel: 'medium', accessible: true },
  { id: 'path-4', from: 'cp-concourse-n-center', to: 'cp-restroom-1', checkpoints: ['cp-concourse-n-center', 'cp-restroom-1'], distance: 45, estimatedTime: 2, crowdLevel: 'medium', accessible: true },
  { id: 'path-5', from: 'cp-concourse-n-center', to: 'cp-seating-n', checkpoints: ['cp-concourse-n-center', 'cp-seating-n'], distance: 80, estimatedTime: 3, crowdLevel: 'medium', accessible: true },

  { id: 'path-6', from: 'cp-parking-b', to: 'cp-gate-b', checkpoints: ['cp-parking-b', 'cp-gate-b'], distance: 95, estimatedTime: 3, crowdLevel: 'low', accessible: true },
  { id: 'path-7', from: 'cp-gate-b', to: 'cp-concourse-e-center', checkpoints: ['cp-gate-b', 'cp-concourse-e-center'], distance: 70, estimatedTime: 2, crowdLevel: 'low', accessible: true },
  { id: 'path-8', from: 'cp-concourse-e-center', to: 'cp-food-2', checkpoints: ['cp-concourse-e-center', 'cp-food-2'], distance: 48, estimatedTime: 2, crowdLevel: 'medium', accessible: true },
  { id: 'path-9', from: 'cp-concourse-e-center', to: 'cp-seating-e', checkpoints: ['cp-concourse-e-center', 'cp-seating-e'], distance: 70, estimatedTime: 3, crowdLevel: 'medium', accessible: true },

  { id: 'path-10', from: 'cp-parking-c', to: 'cp-gate-c', checkpoints: ['cp-parking-c', 'cp-gate-c'], distance: 110, estimatedTime: 4, crowdLevel: 'medium', accessible: true },
  { id: 'path-11', from: 'cp-gate-c', to: 'cp-concourse-s-center', checkpoints: ['cp-gate-c', 'cp-concourse-s-center'], distance: 70, estimatedTime: 2, crowdLevel: 'medium', accessible: true },
  { id: 'path-12', from: 'cp-concourse-s-center', to: 'cp-food-3', checkpoints: ['cp-concourse-s-center', 'cp-food-3'], distance: 58, estimatedTime: 2, crowdLevel: 'medium', accessible: true },
  { id: 'path-13', from: 'cp-concourse-s-center', to: 'cp-restroom-2', checkpoints: ['cp-concourse-s-center', 'cp-restroom-2'], distance: 52, estimatedTime: 2, crowdLevel: 'medium', accessible: true },
  { id: 'path-14', from: 'cp-concourse-s-center', to: 'cp-seating-s', checkpoints: ['cp-concourse-s-center', 'cp-seating-s'], distance: 75, estimatedTime: 3, crowdLevel: 'medium', accessible: true },

  { id: 'path-15', from: 'cp-parking-d', to: 'cp-gate-d', checkpoints: ['cp-parking-d', 'cp-gate-d'], distance: 92, estimatedTime: 3, crowdLevel: 'low', accessible: true },
  { id: 'path-16', from: 'cp-gate-d', to: 'cp-concourse-w-center', checkpoints: ['cp-gate-d', 'cp-concourse-w-center'], distance: 72, estimatedTime: 2, crowdLevel: 'medium', accessible: true },
  { id: 'path-17', from: 'cp-concourse-w-center', to: 'cp-food-4', checkpoints: ['cp-concourse-w-center', 'cp-food-4'], distance: 50, estimatedTime: 2, crowdLevel: 'medium', accessible: true },
  { id: 'path-18', from: 'cp-concourse-w-center', to: 'cp-restroom-3', checkpoints: ['cp-concourse-w-center', 'cp-restroom-3'], distance: 46, estimatedTime: 2, crowdLevel: 'medium', accessible: true },
  { id: 'path-19', from: 'cp-concourse-w-center', to: 'cp-seating-w', checkpoints: ['cp-concourse-w-center', 'cp-seating-w'], distance: 78, estimatedTime: 3, crowdLevel: 'medium', accessible: true },

  { id: 'path-20', from: 'cp-concourse-n-center', to: 'cp-concourse-e-center', checkpoints: ['cp-concourse-n-center', 'cp-concourse-e-center'], distance: 290, estimatedTime: 8, crowdLevel: 'medium', accessible: true },
  { id: 'path-21', from: 'cp-concourse-e-center', to: 'cp-concourse-s-center', checkpoints: ['cp-concourse-e-center', 'cp-concourse-s-center'], distance: 265, estimatedTime: 8, crowdLevel: 'medium', accessible: true },
  { id: 'path-22', from: 'cp-concourse-s-center', to: 'cp-concourse-w-center', checkpoints: ['cp-concourse-s-center', 'cp-concourse-w-center'], distance: 300, estimatedTime: 9, crowdLevel: 'medium', accessible: true },
  { id: 'path-23', from: 'cp-concourse-w-center', to: 'cp-concourse-n-center', checkpoints: ['cp-concourse-w-center', 'cp-concourse-n-center'], distance: 280, estimatedTime: 8, crowdLevel: 'medium', accessible: true },

  { id: 'path-24', from: 'cp-concourse-n-center', to: 'cp-concourse-s-center', checkpoints: ['cp-concourse-n-center', 'cp-concourse-s-center'], distance: 410, estimatedTime: 12, crowdLevel: 'medium', accessible: true },
  { id: 'path-25', from: 'cp-concourse-e-center', to: 'cp-concourse-w-center', checkpoints: ['cp-concourse-e-center', 'cp-concourse-w-center'], distance: 430, estimatedTime: 13, crowdLevel: 'medium', accessible: true },

  { id: 'path-26', from: 'cp-seating-n', to: 'cp-seating-e', checkpoints: ['cp-seating-n', 'cp-seating-e'], distance: 260, estimatedTime: 8, crowdLevel: 'medium', accessible: true },
  { id: 'path-27', from: 'cp-seating-e', to: 'cp-seating-s', checkpoints: ['cp-seating-e', 'cp-seating-s'], distance: 250, estimatedTime: 8, crowdLevel: 'medium', accessible: true },
  { id: 'path-28', from: 'cp-seating-s', to: 'cp-seating-w', checkpoints: ['cp-seating-s', 'cp-seating-w'], distance: 270, estimatedTime: 8, crowdLevel: 'medium', accessible: true },
  { id: 'path-29', from: 'cp-seating-w', to: 'cp-seating-n', checkpoints: ['cp-seating-w', 'cp-seating-n'], distance: 250, estimatedTime: 8, crowdLevel: 'medium', accessible: true },

  { id: 'path-30', from: 'cp-concourse-n-center', to: 'cp-emergency-n', checkpoints: ['cp-concourse-n-center', 'cp-emergency-n'], distance: 36, estimatedTime: 1, crowdLevel: 'low', accessible: true },
  { id: 'path-31', from: 'cp-concourse-s-center', to: 'cp-emergency-s', checkpoints: ['cp-concourse-s-center', 'cp-emergency-s'], distance: 35, estimatedTime: 1, crowdLevel: 'low', accessible: true },
  { id: 'path-32', from: 'cp-seating-n', to: 'cp-emergency-n', checkpoints: ['cp-seating-n', 'cp-emergency-n'], distance: 150, estimatedTime: 5, crowdLevel: 'medium', accessible: true },
  { id: 'path-33', from: 'cp-seating-s', to: 'cp-emergency-s', checkpoints: ['cp-seating-s', 'cp-emergency-s'], distance: 142, estimatedTime: 5, crowdLevel: 'medium', accessible: true },

  { id: 'path-34', from: 'cp-gate-b', to: 'cp-concourse-n-center', checkpoints: ['cp-gate-b', 'cp-concourse-n-center'], distance: 370, estimatedTime: 11, crowdLevel: 'medium', accessible: true },
  { id: 'path-35', from: 'cp-gate-d', to: 'cp-concourse-s-center', checkpoints: ['cp-gate-d', 'cp-concourse-s-center'], distance: 360, estimatedTime: 11, crowdLevel: 'medium', accessible: true },
  { id: 'path-36', from: 'cp-concourse-w-center', to: 'cp-gate-a', checkpoints: ['cp-concourse-w-center', 'cp-gate-a'], distance: 390, estimatedTime: 12, crowdLevel: 'medium', accessible: true },
  { id: 'path-37', from: 'cp-concourse-e-center', to: 'cp-gate-c', checkpoints: ['cp-concourse-e-center', 'cp-gate-c'], distance: 340, estimatedTime: 10, crowdLevel: 'medium', accessible: true },

  { id: 'path-38', from: 'cp-concourse-w-center', to: 'cp-emergency-s', checkpoints: ['cp-concourse-w-center', 'cp-emergency-s'], distance: 390, estimatedTime: 11, crowdLevel: 'medium', accessible: true },
  { id: 'path-39', from: 'cp-concourse-e-center', to: 'cp-emergency-n', checkpoints: ['cp-concourse-e-center', 'cp-emergency-n'], distance: 390, estimatedTime: 11, crowdLevel: 'medium', accessible: true }
]

// Mock CCTV feeds
export const cctvFeeds: CCTVFeed[] = [
  { id: 'cctv-1', name: 'Gate A Camera', areaId: 'gate-a', position: { x: 480, y: 85 }, status: 'active', detectedCount: 34, lastUpdate: new Date().toISOString() },
  { id: 'cctv-2', name: 'Gate B Camera', areaId: 'gate-b', position: { x: 878, y: 352 }, status: 'active', detectedCount: 22, lastUpdate: new Date().toISOString() },
  { id: 'cctv-3', name: 'Gate C Camera', areaId: 'gate-c', position: { x: 480, y: 735 }, status: 'active', detectedCount: 28, lastUpdate: new Date().toISOString() },
  { id: 'cctv-4', name: 'Gate D Camera', areaId: 'gate-d', position: { x: 62, y: 352 }, status: 'active', detectedCount: 20, lastUpdate: new Date().toISOString() },
  { id: 'cctv-5', name: 'North Concourse Cam', areaId: 'concourse-north', position: { x: 420, y: 150 }, status: 'active', detectedCount: 72, lastUpdate: new Date().toISOString() },
  { id: 'cctv-6', name: 'East Concourse Cam', areaId: 'concourse-east', position: { x: 790, y: 390 }, status: 'active', detectedCount: 63, lastUpdate: new Date().toISOString() },
  { id: 'cctv-7', name: 'South Concourse Cam', areaId: 'concourse-south', position: { x: 540, y: 675 }, status: 'active', detectedCount: 66, lastUpdate: new Date().toISOString() },
  { id: 'cctv-8', name: 'West Concourse Cam', areaId: 'concourse-west', position: { x: 170, y: 420 }, status: 'active', detectedCount: 58, lastUpdate: new Date().toISOString() },
  { id: 'cctv-9', name: 'North Food Cam', areaId: 'food-zone-1', position: { x: 375, y: 225 }, status: 'active', detectedCount: 31, lastUpdate: new Date().toISOString() },
  { id: 'cctv-10', name: 'East Food Cam', areaId: 'food-zone-2', position: { x: 775, y: 425 }, status: 'active', detectedCount: 29, lastUpdate: new Date().toISOString() },
  { id: 'cctv-11', name: 'South Food Cam', areaId: 'food-zone-3', position: { x: 555, y: 595 }, status: 'active', detectedCount: 33, lastUpdate: new Date().toISOString() },
  { id: 'cctv-12', name: 'West Food Cam', areaId: 'food-zone-4', position: { x: 205, y: 415 }, status: 'active', detectedCount: 27, lastUpdate: new Date().toISOString() },
  { id: 'cctv-13', name: 'North Stand Cam', areaId: 'seating-north', position: { x: 480, y: 245 }, status: 'active', detectedCount: 103, lastUpdate: new Date().toISOString() },
  { id: 'cctv-14', name: 'East Stand Cam', areaId: 'seating-east', position: { x: 705, y: 420 }, status: 'active', detectedCount: 95, lastUpdate: new Date().toISOString() }
]

export const venueBlueprint: VenueBlueprint = {
  id: 'nexgen-arena',
  name: 'NexGen Arena',
  width: 960,
  height: 820,
  areas: venueAreas,
  checkpoints: venueCheckpoints,
  paths: venuePaths,
  cctvFeeds,
  incident: null
}

const clampValue = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min

const determineCrowdLevel = (ratio: number): VenueArea['level'] => {
  if (ratio >= 0.88) return 'critical'
  if (ratio >= 0.7) return 'high'
  if (ratio >= 0.42) return 'medium'
  return 'low'
}

type SimulationPhase = 'arrival' | 'in-event' | 'halftime' | 'egress'

const occupancyScaleByAreaType: Record<VenueArea['type'], number> = {
  gate: 4.8,
  concourse: 6.4,
  seating: 20,
  food: 3.9,
  restroom: 2.1,
  parking: 3.8,
  emergency: 4.4,
  field: 0.7
}

const targetOccupancyByPhase: Record<SimulationPhase, Record<VenueArea['type'], number>> = {
  arrival: {
    gate: 0.58,
    concourse: 0.52,
    seating: 0.55,
    food: 0.3,
    restroom: 0.24,
    parking: 0.68,
    emergency: 0.03,
    field: 0.07
  },
  'in-event': {
    gate: 0.22,
    concourse: 0.36,
    seating: 0.74,
    food: 0.25,
    restroom: 0.18,
    parking: 0.62,
    emergency: 0.02,
    field: 0.08
  },
  halftime: {
    gate: 0.34,
    concourse: 0.66,
    seating: 0.48,
    food: 0.71,
    restroom: 0.63,
    parking: 0.64,
    emergency: 0.05,
    field: 0.08
  },
  egress: {
    gate: 0.63,
    concourse: 0.56,
    seating: 0.32,
    food: 0.26,
    restroom: 0.2,
    parking: 0.74,
    emergency: 0.09,
    field: 0.03
  }
}

const phaseFlowBias: Record<SimulationPhase, Record<VenueArea['type'], number>> = {
  arrival: {
    gate: 0.012,
    concourse: 0.009,
    seating: 0.007,
    food: -0.003,
    restroom: -0.001,
    parking: 0.01,
    emergency: -0.01,
    field: 0
  },
  'in-event': {
    gate: -0.008,
    concourse: -0.004,
    seating: 0.005,
    food: -0.002,
    restroom: -0.001,
    parking: -0.004,
    emergency: -0.01,
    field: 0
  },
  halftime: {
    gate: 0.004,
    concourse: 0.012,
    seating: -0.012,
    food: 0.015,
    restroom: 0.013,
    parking: 0.003,
    emergency: -0.008,
    field: 0
  },
  egress: {
    gate: 0.014,
    concourse: 0.01,
    seating: -0.014,
    food: -0.005,
    restroom: -0.006,
    parking: 0.012,
    emergency: 0.005,
    field: -0.002
  }
}

const pulseWeightByAreaType: Record<VenueArea['type'], number> = {
  gate: 1,
  concourse: 1.15,
  seating: 1.1,
  food: 1.25,
  restroom: 1.2,
  parking: 0.95,
  emergency: 0.5,
  field: 0.25
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

type CrowdBurst = 'none' | 'food-rush' | 'seat-return' | 'gate-wave'

const getFlowPulse = (date: Date, phase: SimulationPhase) => {
  const tick = date.getMinutes() * 60 + date.getSeconds()
  const baseWave = Math.sin(tick / 36) + Math.cos(tick / 52) * 0.45
  const phaseAmplifier = phase === 'halftime' ? 1.28 : phase === 'egress' ? 1.22 : phase === 'arrival' ? 1.15 : 0.92
  return baseWave * phaseAmplifier
}

const getCrowdBurst = (phase: SimulationPhase): CrowdBurst => {
  const chance = Math.random()

  if (phase === 'halftime') {
    if (chance < 0.26) return 'food-rush'
    if (chance < 0.34) return 'seat-return'
    return 'none'
  }

  if (phase === 'egress') {
    return chance < 0.27 ? 'gate-wave' : 'none'
  }

  if (phase === 'arrival') {
    return chance < 0.22 ? 'gate-wave' : 'none'
  }

  if (phase === 'in-event') {
    if (chance < 0.14) return 'food-rush'
    if (chance < 0.24) return 'seat-return'
  }

  return 'none'
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
  const flowPulse = getFlowPulse(now, simulationPhase)
  const crowdBurst = getCrowdBurst(simulationPhase)
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
    const phaseBiasObservation = (phaseFlowBias[simulationPhase][area.type] * area.capacity) / Math.max(1, scale)
    const incidentSignal = incident?.areaId === area.id ? (incident.type === 'fire' ? 7 : 4) : 0
    const pulseSignal = flowPulse * pulseWeightByAreaType[area.type] * 2.2
    const nextDetected = clampValue(
      Math.round(feed.detectedCount * 0.55 + baselineObservation * 0.45 + phaseBiasObservation + pulseSignal + randomInt(-3, 3) + incidentSignal),
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

    if (area.type === 'field') {
      const driftToTarget = (baselineTarget - area.currentOccupancy) * 0.18
      const nextOccupancy = clampValue(Math.round(area.currentOccupancy + driftToTarget + randomInt(-1, 2)), 0, Math.round(area.capacity * 0.32))

      return {
        ...area,
        currentOccupancy: nextOccupancy,
        level: 'low'
      }
    }

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

    const directionalBias = phaseFlowBias[simulationPhase][area.type]
    const directionalDelta = Math.round(area.capacity * directionalBias * (1 + flowPulse * pulseWeightByAreaType[area.type] * 0.38))
    if (directionalDelta >= 0) {
      inflow += directionalDelta
    } else {
      outflow += Math.abs(directionalDelta)
    }

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

    if (crowdBurst === 'food-rush') {
      if (area.type === 'food' || area.type === 'restroom' || area.type === 'concourse') {
        inflow += Math.round(area.capacity * 0.01)
      }
      if (area.type === 'seating') {
        outflow += Math.round(area.capacity * 0.012)
      }
    }

    if (crowdBurst === 'seat-return') {
      if (area.type === 'seating') {
        inflow += Math.round(area.capacity * 0.012)
      }
      if (area.type === 'food' || area.type === 'restroom' || area.type === 'concourse') {
        outflow += Math.round(area.capacity * 0.009)
      }
    }

    if (crowdBurst === 'gate-wave') {
      if (area.type === 'gate' || area.type === 'parking' || area.type === 'concourse') {
        inflow += Math.round(area.capacity * 0.012)
      }
      if (area.type === 'seating') {
        outflow += Math.round(area.capacity * 0.008)
      }
    }

    let incidentEffect = 0
    if (incident) {
      const severityScale = incident.severity === 'critical' ? 1.2 : incident.severity === 'high' ? 1 : 0.82

      if (incident.areaId === area.id) {
        incidentEffect += incident.type === 'fire'
          ? -Math.round(area.capacity * 0.1 * severityScale)
          : Math.round(area.capacity * 0.04 * severityScale)
      } else if (area.connectedTo.includes(incident.areaId)) {
        incidentEffect += incident.type === 'fire'
          ? Math.round(area.capacity * 0.018 * severityScale)
          : Math.round(area.capacity * 0.011 * severityScale)
      }

      if (area.type === 'emergency' && incident.type === 'fire') {
        incidentEffect += Math.round(area.capacity * 0.1 * severityScale)
      }
    } else if (area.type === 'emergency') {
      outflow += Math.round(area.capacity * 0.1)
    }

    const reversion = (baselineTarget - area.currentOccupancy) * 0.28
    const feedCorrection = hasFeeds ? (observedPeople - area.currentOccupancy) * 0.2 : 0
    const neighborPressure = (neighborRatio - currentRatio) * area.capacity * 0.11
    const netFlow = inflow - outflow

    const rawDelta = reversion + feedCorrection + neighborPressure + netFlow + incidentEffect
    const maxStep = Math.max(10, Math.round(area.capacity * 0.055))
    const delta = clampValue(Math.round(rawDelta), -maxStep, maxStep)

    const occupancyCapRatio = area.type === 'emergency' && !incident ? 0.16 : 0.95
    let nextOccupancy = clampValue(area.currentOccupancy + delta, 0, Math.round(area.capacity * occupancyCapRatio))
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
  const basePathById = new Map(venuePaths.map((path) => [path.id, path]))

  const updatedPaths = blueprint.paths.map((path) => {
    const fromCheckpoint = checkpointById.get(path.from)
    const toCheckpoint = checkpointById.get(path.to)
    const fromArea = fromCheckpoint ? areaAfterUpdateById.get(fromCheckpoint.areaId) : undefined
    const toArea = toCheckpoint ? areaAfterUpdateById.get(toCheckpoint.areaId) : undefined

    const fromRatio = fromArea ? fromArea.currentOccupancy / Math.max(1, fromArea.capacity) : 0.45
    const toRatio = toArea ? toArea.currentOccupancy / Math.max(1, toArea.capacity) : 0.45
    const pressure = (fromRatio + toRatio) / 2
    const incidentTouchingPath = Boolean(
      incident && fromArea && toArea && (fromArea.id === incident.areaId || toArea.id === incident.areaId || fromArea.connectedTo.includes(incident.areaId) || toArea.connectedTo.includes(incident.areaId))
    )

    const burstPenalty =
      crowdBurst === 'food-rush' && (fromArea?.type === 'food' || toArea?.type === 'food' || fromArea?.type === 'restroom' || toArea?.type === 'restroom')
        ? 0.2
        : crowdBurst === 'gate-wave' && (fromArea?.type === 'gate' || toArea?.type === 'gate' || fromArea?.type === 'parking' || toArea?.type === 'parking')
          ? 0.25
          : crowdBurst === 'seat-return' && (fromArea?.type === 'seating' || toArea?.type === 'seating')
            ? 0.14
            : 0

    const lanePenalty = (fromArea?.type === 'seating' && toArea?.type === 'seating') ? 0.12 : 0
    const incidentPenalty = incidentTouchingPath ? (incident?.severity === 'critical' ? 0.5 : incident?.severity === 'high' ? 0.34 : 0.18) : 0
    const baseMinutes = Math.max(1, Math.round(path.distance / 42))
    const estimatedTime = Math.max(1, Math.round(baseMinutes * (1 + pressure * 0.95 + burstPenalty + lanePenalty + incidentPenalty)))

    const crowdLevel: VenuePath['crowdLevel'] = pressure >= 0.75 ? 'high' : pressure >= 0.5 ? 'medium' : 'low'
    const blockedByIncident = Boolean(
      incident?.type === 'fire' &&
      incident?.severity !== 'medium' &&
      incidentTouchingPath
    )

    const baseAccessible = basePathById.get(path.id)?.accessible ?? true

    return {
      ...path,
      crowdLevel,
      estimatedTime,
      accessible: baseAccessible && !blockedByIncident
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
