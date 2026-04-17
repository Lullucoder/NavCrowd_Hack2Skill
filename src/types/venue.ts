export interface VenuePoint {
  x: number
  y: number
}

export interface VenueArea {
  id: string
  name: string
  type: 'gate' | 'concourse' | 'seating' | 'food' | 'restroom' | 'parking' | 'emergency'
  polygon: VenuePoint[]
  capacity: number
  currentOccupancy: number
  level: 'low' | 'medium' | 'high' | 'critical'
  connectedTo: string[]
}

export interface VenueCheckpoint {
  id: string
  name: string
  position: VenuePoint
  areaId: string
  type: 'waypoint' | 'decision' | 'destination'
}

export interface VenuePath {
  id: string
  from: string
  to: string
  checkpoints: string[]
  distance: number
  estimatedTime: number
  crowdLevel: 'low' | 'medium' | 'high'
  accessible: boolean
}

export interface NavigationRoute {
  id: string
  from: VenueCheckpoint
  to: VenueCheckpoint
  path: VenuePath[]
  currentCheckpointIndex: number
  totalDistance: number
  estimatedTime: number
  checkpoints: VenueCheckpoint[]
  status: 'active' | 'completed' | 'cancelled'
}

export interface CCTVFeed {
  id: string
  name: string
  areaId: string
  position: VenuePoint
  status: 'active' | 'inactive'
  detectedCount: number
  lastUpdate: string
}

export interface VenueBlueprint {
  id: string
  name: string
  width: number
  height: number
  areas: VenueArea[]
  checkpoints: VenueCheckpoint[]
  paths: VenuePath[]
  cctvFeeds: CCTVFeed[]
}
