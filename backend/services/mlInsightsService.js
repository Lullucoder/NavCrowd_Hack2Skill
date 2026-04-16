const clamp = (value, min, max) => Math.max(min, Math.min(max, value))

const sigmoid = (x) => 1 / (1 + Math.exp(-x))

const riskBand = (score) => {
  if (score < 0.35) {
    return 'low'
  }
  if (score < 0.58) {
    return 'medium'
  }
  if (score < 0.8) {
    return 'high'
  }
  return 'critical'
}

const normalizeSeatZone = (seat = 'B-127') => {
  const block = seat.split('-')[0]?.trim().toUpperCase() || 'B'
  if (['A', 'B'].includes(block)) {
    return 'north'
  }
  if (['C', 'D'].includes(block)) {
    return 'south'
  }
  return 'center'
}

const preferredFoodType = {
  quick: 'food',
  merch: 'merch',
  comfort: 'restroom'
}

const buildFeatureVector = ({ context, crowdSnapshot, queueStatus, alerts }) => {
  const occupancyRatios = crowdSnapshot.map((zone) => zone.occupancy / zone.capacity)
  const avgOccupancy = occupancyRatios.reduce((sum, item) => sum + item, 0) / occupancyRatios.length
  const highLoadZones = crowdSnapshot.filter((zone) => zone.level === 'high' || zone.level === 'critical').length / crowdSnapshot.length

  const avgQueueMinutes = queueStatus.reduce((sum, queue) => sum + queue.predictedWaitMinutes, 0) / queueStatus.length
  const normalizedQueue = clamp(avgQueueMinutes / 25, 0, 1)

  const criticalAlerts = alerts.filter((alert) => alert.severity === 'critical').length
  const warningAlerts = alerts.filter((alert) => alert.severity === 'warning').length
  const alertSignal = clamp((criticalAlerts * 0.6 + warningAlerts * 0.25), 0, 1)

  const mobilityNeed = context.mobilityNeed ? 1 : 0
  const firstVisit = context.firstVisit ? 1 : 0

  return {
    avgOccupancy,
    highLoadZones,
    normalizedQueue,
    alertSignal,
    mobilityNeed,
    firstVisit
  }
}

const selectGateRecommendation = ({ crowdSnapshot, context }) => {
  const seatSide = normalizeSeatZone(context.seat)
  const gateCandidates = crowdSnapshot
    .filter((zone) => zone.name.toLowerCase().includes('gate'))
    .sort((a, b) => a.occupancy / a.capacity - b.occupancy / b.capacity)

  const bestGate = gateCandidates[0]?.name || 'Gate B'

  if (seatSide === 'north') {
    return bestGate.includes('A') ? bestGate : 'Gate A'
  }

  if (seatSide === 'south') {
    return bestGate.includes('D') ? 'Gate C' : bestGate
  }

  return bestGate
}

const selectQueueRecommendation = ({ queueStatus, context }) => {
  const desiredType = preferredFoodType[context.intent] || 'food'

  const ranked = [...queueStatus]
    .filter((item) => item.type === desiredType || desiredType === 'food')
    .sort((a, b) => a.predictedWaitMinutes - b.predictedWaitMinutes)

  return ranked[0] || queueStatus[0]
}

const selectParkingRecommendation = ({ parkingZones, context }) => {
  const seatSide = normalizeSeatZone(context.seat)

  const ranked = [...parkingZones].sort((a, b) => {
    const aFill = 1 - a.availableSpots / a.totalSpots
    const bFill = 1 - b.availableSpots / b.totalSpots
    const aScore = a.walkMinutes * 0.6 + aFill * 10
    const bScore = b.walkMinutes * 0.6 + bFill * 10
    return aScore - bScore
  })

  if (seatSide === 'north') {
    return ranked.find((zone) => zone.gate.includes('1') || zone.gate.includes('2')) || ranked[0]
  }

  if (seatSide === 'south') {
    return ranked.find((zone) => zone.gate.includes('3') || zone.gate.includes('4')) || ranked[0]
  }

  return ranked[0]
}

export const generateMlInsights = ({ context, crowdSnapshot, queueStatus, parkingZones, alerts }) => {
  const features = buildFeatureVector({ context, crowdSnapshot, queueStatus, alerts })

  const linearRiskScore =
    features.avgOccupancy * 1.45 +
    features.highLoadZones * 1.2 +
    features.normalizedQueue * 1.0 +
    features.alertSignal * 1.5 +
    features.mobilityNeed * 0.35 +
    features.firstVisit * 0.2 -
    1.6

  const riskScore = sigmoid(linearRiskScore)
  const riskLevel = riskBand(riskScore)

  const recommendedGate = selectGateRecommendation({ crowdSnapshot, context })
  const queueRecommendation = selectQueueRecommendation({ queueStatus, context })
  const parkingRecommendation = selectParkingRecommendation({ parkingZones, context })

  const expectedWait = Math.round(queueRecommendation.predictedWaitMinutes * (1 + riskScore * 0.25))

  const suggestedActions = [
    `Use ${recommendedGate} for entry to avoid heavy congestion.`,
    `Join ${queueRecommendation.name} now (predicted wait ${expectedWait} min).`,
    `Park at ${parkingRecommendation.name} and enter via ${parkingRecommendation.gate}.`
  ]

  if (context.mobilityNeed) {
    suggestedActions.push('Mobility support path is recommended. Follow elevator signs from the main concourse.')
  }

  if (riskScore > 0.7) {
    suggestedActions.push('High crowd risk expected in next 30 minutes. Start moving 10 minutes early for transitions.')
  }

  return {
    model: {
      name: 'VenueFlow-Hybrid-Context-Model',
      version: '1.1.0',
      type: 'hybrid-rule-ml'
    },
    generatedAt: new Date().toISOString(),
    context,
    features,
    predictions: {
      crowdRiskScore: Number(riskScore.toFixed(3)),
      crowdRiskLevel: riskLevel,
      expectedQueueWaitMinutes: expectedWait,
      recommendedArrivalOffsetMinutes: clamp(Math.round(20 - riskScore * 8), 8, 20)
    },
    recommendations: {
      gate: recommendedGate,
      queue: queueRecommendation.name,
      parking: parkingRecommendation.name,
      actions: suggestedActions
    }
  }
}
