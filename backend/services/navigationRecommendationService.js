const clamp = (value, min, max) => Math.max(min, Math.min(max, value))

const normalizeSeatSide = (seat = 'B-127') => {
  const block = seat.split('-')[0]?.trim().toUpperCase()

  if (block === 'A' || block === 'B') {
    return 'north'
  }

  if (block === 'C' || block === 'D') {
    return 'south'
  }

  return 'center'
}

const normalizePhase = (phase = 'entry') => {
  const value = phase.trim().toLowerCase()

  if (value === 'entry' || value === 'halftime' || value === 'exit') {
    return value
  }

  return 'entry'
}

const normalizeIntent = (intent = 'quick') => {
  const value = intent.trim().toLowerCase()

  if (value === 'quick' || value === 'comfort' || value === 'merch') {
    return value
  }

  return 'quick'
}

const getRatioById = (crowdSnapshot, id, fallback = 0.55) => {
  const zone = crowdSnapshot.find((item) => item.id === id)
  if (!zone) {
    return fallback
  }
  return clamp(zone.occupancy / zone.capacity, 0, 1)
}

const gateProfilesFromCrowd = (crowdSnapshot) => {
  const northRatio = getRatioById(crowdSnapshot, 'north-stand', 0.62)
  const southRatio = getRatioById(crowdSnapshot, 'south-stand', 0.68)
  const gateARatio = getRatioById(crowdSnapshot, 'gate-a', 0.4)
  const gateDRatio = getRatioById(crowdSnapshot, 'gate-d', 0.72)

  return [
    {
      code: 'A',
      name: 'Gate A',
      lane: 'Blue Corridor',
      accessibility: 'ramp',
      congestionRatio: gateARatio,
      seatDistanceMinutes: { north: 5, center: 7, south: 10 }
    },
    {
      code: 'B',
      name: 'Gate B',
      lane: 'North Concourse Ring',
      accessibility: 'stairs',
      congestionRatio: clamp(gateARatio * 0.65 + northRatio * 0.35, 0, 1),
      seatDistanceMinutes: { north: 6, center: 6, south: 9 }
    },
    {
      code: 'C',
      name: 'Gate C',
      lane: 'South Concourse Ring',
      accessibility: 'ramp',
      congestionRatio: clamp(gateDRatio * 0.6 + southRatio * 0.4, 0, 1),
      seatDistanceMinutes: { north: 9, center: 6, south: 6 }
    },
    {
      code: 'D',
      name: 'Gate D',
      lane: 'Amber Corridor',
      accessibility: 'ramp',
      congestionRatio: gateDRatio,
      seatDistanceMinutes: { north: 10, center: 7, south: 5 }
    }
  ]
}

const mapParkingGateCode = (parkingGate = '') => {
  if (parkingGate.includes('1')) {
    return 'A'
  }
  if (parkingGate.includes('2')) {
    return 'B'
  }
  if (parkingGate.includes('3')) {
    return 'C'
  }
  if (parkingGate.includes('4')) {
    return 'D'
  }

  return 'B'
}

const preferredGateCodes = {
  north: ['A', 'B'],
  center: ['B', 'C'],
  south: ['C', 'D']
}

const phaseDelayMultiplier = {
  entry: 1,
  halftime: 1.15,
  exit: 1.35
}

const phaseExtraDelay = {
  entry: 0,
  halftime: 2,
  exit: 5
}

const queueFactorByIntent = {
  quick: 0.8,
  comfort: 1,
  merch: 1.15
}

const formatActionByLevel = (level, zoneName) => {
  if (level === 'critical') {
    return `Avoid ${zoneName} now and use parallel concourse lanes.`
  }

  if (level === 'high') {
    return `Delay crossing ${zoneName} by 5 to 8 minutes if possible.`
  }

  if (level === 'medium') {
    return `Monitor ${zoneName}; alternate paths are still available.`
  }

  return `${zoneName} remains stable for normal movement.`
}

const buildRouteSteps = ({ parking, gate, seat, mobilityNeed, phase }) => {
  const seatBlock = seat.split('-')[0]?.toUpperCase() || 'B'
  const mobilityStep = mobilityNeed
    ? 'Follow accessible route markers and use elevator nodes where available.'
    : 'Use standard concourse connectors for the shortest path.'

  const phaseStep =
    phase === 'exit'
      ? 'Expect outbound surge; stagger departure by 6 to 10 minutes after whistle.'
      : phase === 'halftime'
        ? 'Use side aisles to avoid halftime bottlenecks.'
        : 'Arrive before rush windows to minimize gate queue time.'

  return [
    `Start from ${parking.name} and proceed via wayfinding to ${gate.name}.`,
    `Enter through ${gate.lane} and continue toward Block ${seatBlock}.`,
    mobilityStep,
    phaseStep
  ]
}

const toConfidence = (score, bestScore, worstScore) => {
  const spread = Math.max(1, worstScore - bestScore)
  const penalty = ((score - bestScore) / spread) * 35
  return clamp(Math.round(93 - penalty), 58, 96)
}

export const generateNavigationPlan = ({ seat, phase, mobilityNeed, intent, crowdSnapshot, queueStatus, parkingZones }) => {
  const normalizedPhase = normalizePhase(phase)
  const normalizedIntent = normalizeIntent(intent)
  const seatSide = normalizeSeatSide(seat)

  const gates = gateProfilesFromCrowd(crowdSnapshot)
  const gateByCode = new Map(gates.map((gate) => [gate.code, gate]))

  const averageQueueWaitMinutes = Math.round(
    queueStatus.reduce((sum, item) => sum + item.predictedWaitMinutes, 0) / Math.max(1, queueStatus.length)
  )

  const occupied = crowdSnapshot.reduce((sum, zone) => sum + zone.occupancy, 0)
  const capacity = crowdSnapshot.reduce((sum, zone) => sum + zone.capacity, 0)
  const occupancyPercent = Math.round((occupied / Math.max(1, capacity)) * 100)
  const highRiskZones = crowdSnapshot.filter((zone) => zone.level === 'high' || zone.level === 'critical').length

  const candidates = parkingZones.flatMap((parking) => {
    const mappedGateCode = mapParkingGateCode(parking.gate)
    const preferred = preferredGateCodes[seatSide]
    const candidateGateCodes = [...new Set([mappedGateCode, ...preferred])]

    return candidateGateCodes
      .map((gateCode) => {
        const gate = gateByCode.get(gateCode)
        if (!gate) {
          return null
        }

        const parkingFillRatio = 1 - parking.availableSpots / Math.max(1, parking.totalSpots)
        const baseTravel = parking.walkMinutes + gate.seatDistanceMinutes[seatSide]
        const dynamicDelay = Math.round(
          gate.congestionRatio * 10 * phaseDelayMultiplier[normalizedPhase] +
            (averageQueueWaitMinutes / 10) * queueFactorByIntent[normalizedIntent]
        )
        const mobilityDelay = mobilityNeed && gate.accessibility === 'stairs' ? 5 : 0

        const estimatedTravelMinutes = baseTravel + dynamicDelay + phaseExtraDelay[normalizedPhase] + mobilityDelay

        // Lower score means better route quality.
        const routeScore =
          estimatedTravelMinutes * 0.58 +
          gate.congestionRatio * 22 +
          parkingFillRatio * 9 +
          (mobilityNeed && gate.accessibility === 'stairs' ? 6 : 0)

        return {
          routeId: `${parking.id}-${gate.code}`,
          parking,
          gate,
          estimatedTravelMinutes,
          congestionScore: Math.round(gate.congestionRatio * 100),
          routeScore,
          steps: buildRouteSteps({ parking, gate, seat, mobilityNeed, phase: normalizedPhase })
        }
      })
      .filter(Boolean)
  })

  const ranked = candidates.sort((a, b) => a.routeScore - b.routeScore)
  const bestScore = ranked[0]?.routeScore ?? 0
  const worstScore = ranked[ranked.length - 1]?.routeScore ?? bestScore + 1

  const formattedRoutes = ranked.slice(0, 4).map((item) => ({
    routeId: item.routeId,
    parking: {
      id: item.parking.id,
      name: item.parking.name,
      availableSpots: item.parking.availableSpots,
      totalSpots: item.parking.totalSpots,
      walkMinutes: item.parking.walkMinutes
    },
    gate: item.gate.name,
    lane: item.gate.lane,
    estimatedTravelMinutes: item.estimatedTravelMinutes,
    congestionScore: item.congestionScore,
    confidence: toConfidence(item.routeScore, bestScore, worstScore),
    accessibility: item.gate.accessibility,
    explanation:
      item.congestionScore >= 70
        ? 'Higher pressure expected near this gate; only use when location is significantly closer.'
        : 'Balanced route with manageable crowd pressure and good travel efficiency.',
    steps: item.steps
  }))

  const bestRoute = formattedRoutes[0]

  const hotspots = [...crowdSnapshot]
    .map((zone) => {
      const occupancyRatio = zone.occupancy / Math.max(1, zone.capacity)
      return {
        id: zone.id,
        name: zone.name,
        level: zone.level,
        occupancyRatio: Number(occupancyRatio.toFixed(3)),
        action: formatActionByLevel(zone.level, zone.name)
      }
    })
    .sort((a, b) => b.occupancyRatio - a.occupancyRatio)
    .slice(0, 3)

  const recommendedLeaveMinutes =
    normalizedPhase === 'exit'
      ? clamp(Math.round(8 + highRiskZones * 1.5), 8, 18)
      : clamp(Math.round(10 + (bestRoute?.congestionScore ?? 50) / 12), 8, 20)

  return {
    generatedAt: new Date().toISOString(),
    context: {
      seat,
      seatSide,
      phase: normalizedPhase,
      intent: normalizedIntent,
      mobilityNeed
    },
    telemetry: {
      occupancyPercent,
      averageQueueWaitMinutes,
      highRiskZones
    },
    bestRoute,
    alternatives: formattedRoutes.slice(1),
    hotspots,
    timingAdvice: {
      leaveInMinutes: recommendedLeaveMinutes,
      recommendedWindow:
        normalizedPhase === 'exit'
          ? 'Post-event stagger window'
          : normalizedPhase === 'halftime'
            ? 'Halftime transition window'
            : 'Pre-entry movement window',
      rationale:
        bestRoute?.congestionScore >= 75
          ? 'High gate pressure detected; early movement lowers queue risk.'
          : 'Moderate gate pressure detected; standard timing should be sufficient.'
    },
    coordinationHint:
      hotspots[0]?.level === 'critical'
        ? `Ops suggestion: deploy crowd marshals near ${hotspots[0].name} for directional routing.`
        : 'Ops suggestion: maintain standard staffing and monitor trend shifts every 5 minutes.'
  }
}
