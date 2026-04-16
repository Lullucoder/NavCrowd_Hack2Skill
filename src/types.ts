export type HeatLevel = 'low' | 'medium' | 'high' | 'critical'

export interface HeatZone {
  id: string
  name: string
  occupancy: number
  capacity: number
  level: HeatLevel
  trend: number
}

export interface QueueStall {
  id: string
  name: string
  type: 'Food' | 'Merch' | 'Restroom'
  zone: string
  peopleWaiting: number
  avgWaitMinutes: number
}

export interface MenuItem {
  id: string
  stallId: string
  name: string
  price: number
  category: 'Veg' | 'Non-Veg' | 'Drinks' | 'Combo'
  prepMinutes: number
}

export interface ParkingZone {
  id: string
  name: string
  totalSpots: number
  availableSpots: number
  walkMinutes: number
  recommendedGate: string
}

export interface AlertItem {
  id: string
  title: string
  message: string
  severity: 'info' | 'warning' | 'critical'
  createdAt: string
}

export interface ChatMessage {
  id: string
  sender: 'user' | 'assistant'
  text: string
  timestamp: string
}

export interface MlInsightsResponse {
  model: {
    name: string
    version: string
    type: string
  }
  generatedAt: string
  context: {
    seat: string
    intent: 'quick' | 'merch' | 'comfort'
    mobilityNeed: boolean
    firstVisit: boolean
  }
  predictions: {
    crowdRiskScore: number
    crowdRiskLevel: 'low' | 'medium' | 'high' | 'critical'
    expectedQueueWaitMinutes: number
    recommendedArrivalOffsetMinutes: number
  }
  recommendations: {
    gate: string
    queue: string
    parking: string
    actions: string[]
  }
  narrative: string | null
  provider: string
}
