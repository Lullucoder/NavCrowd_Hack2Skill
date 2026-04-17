import { AlertTriangle, Compass, Route, Sparkles, Timer, UserRoundCheck } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { ParkingCard } from '../components/ParkingCard'
import { StatsCard } from '../components/StatsCard'
import { initialHeatZones, parkingSeed, queueStallsSeed } from '../data/mockData'
import type { NavigationAssistResponse } from '../types'

type NavPhase = 'entry' | 'halftime' | 'exit'
type NavIntent = 'quick' | 'comfort' | 'merch'

const seatSide = (seat: string): 'north' | 'south' | 'center' => {
  const block = seat.split('-')[0]?.trim().toUpperCase()

  if (block === 'A' || block === 'B') {
    return 'north'
  }

  if (block === 'C' || block === 'D') {
    return 'south'
  }

  return 'center'
}

const fallbackNavigation = ({
  seat,
  phase,
  intent,
  mobilityNeed
}: {
  seat: string
  phase: NavPhase
  intent: NavIntent
  mobilityNeed: boolean
}): NavigationAssistResponse => {
  const side = seatSide(seat)
  const averageQueue = Math.round(queueStallsSeed.reduce((sum, stall) => sum + stall.avgWaitMinutes, 0) / queueStallsSeed.length)

  const preferredParkingId = side === 'north' ? 'B' : side === 'south' ? 'D' : 'A'
  const selectedParking = parkingSeed.find((zone) => zone.id === preferredParkingId) ?? parkingSeed[0]

  const baselineTravel = selectedParking.walkMinutes + (side === 'center' ? 7 : 5)
  const phaseDelay = phase === 'exit' ? 6 : phase === 'halftime' ? 3 : 0
  const estimatedTravelMinutes = baselineTravel + Math.round(averageQueue / 4) + phaseDelay + (mobilityNeed ? 2 : 0)

  const sortedHotspots = [...initialHeatZones]
    .map((zone) => ({
      id: zone.id,
      name: zone.name,
      level: zone.level,
      occupancyRatio: Number((zone.occupancy / zone.capacity).toFixed(3)),
      action:
        zone.level === 'critical'
          ? `Avoid ${zone.name} and use alternate lanes.`
          : zone.level === 'high'
            ? `Expect moderate slowdown near ${zone.name}.`
            : `Normal movement expected near ${zone.name}.`
    }))
    .sort((a, b) => b.occupancyRatio - a.occupancyRatio)
    .slice(0, 3)

  return {
    generatedAt: new Date().toISOString(),
    context: {
      seat,
      seatSide: side,
      phase,
      intent,
      mobilityNeed
    },
    telemetry: {
      occupancyPercent: Math.round(
        (initialHeatZones.reduce((sum, zone) => sum + zone.occupancy, 0) /
          initialHeatZones.reduce((sum, zone) => sum + zone.capacity, 0)) *
          100
      ),
      averageQueueWaitMinutes: averageQueue,
      highRiskZones: initialHeatZones.filter((zone) => zone.level === 'high' || zone.level === 'critical').length
    },
    bestRoute: {
      routeId: `${selectedParking.id}-${selectedParking.recommendedGate}`,
      parking: {
        id: selectedParking.id,
        name: selectedParking.name,
        availableSpots: selectedParking.availableSpots,
        totalSpots: selectedParking.totalSpots,
        walkMinutes: selectedParking.walkMinutes
      },
      gate: selectedParking.recommendedGate,
      lane: side === 'north' ? 'North Concourse Ring' : 'South Concourse Ring',
      estimatedTravelMinutes,
      congestionScore: 58,
      confidence: 74,
      accessibility: mobilityNeed ? 'ramp' : 'stairs',
      explanation: 'Fallback recommendation generated from local venue signals.',
      steps: [
        `Park at ${selectedParking.name}.`,
        `Enter via ${selectedParking.recommendedGate} and follow concourse signage.`,
        mobilityNeed ? 'Use accessible lift nodes where available.' : 'Use standard stair connectors for shortest traversal.',
        `Proceed to block ${seat.split('-')[0]?.toUpperCase()} and locate seat ${seat}.`
      ]
    },
    alternatives: parkingSeed
      .filter((zone) => zone.id !== selectedParking.id)
      .slice(0, 2)
      .map((zone, index) => ({
        routeId: `${zone.id}-${zone.recommendedGate}`,
        parking: {
          id: zone.id,
          name: zone.name,
          availableSpots: zone.availableSpots,
          totalSpots: zone.totalSpots,
          walkMinutes: zone.walkMinutes
        },
        gate: zone.recommendedGate,
        lane: index === 0 ? 'Side Corridor' : 'Main Concourse',
        estimatedTravelMinutes: zone.walkMinutes + 9 + index,
        congestionScore: 64 + index * 5,
        confidence: 67 - index * 4,
        accessibility: 'ramp',
        explanation: 'Alternative route for fallback mode.',
        steps: [
          `Start from ${zone.name}.`,
          `Move to ${zone.recommendedGate}.`,
          `Proceed to seat ${seat}.`
        ]
      })),
    hotspots: sortedHotspots,
    timingAdvice: {
      leaveInMinutes: phase === 'exit' ? 10 : 14,
      recommendedWindow: phase === 'exit' ? 'Post-event stagger window' : 'Pre-entry movement window',
      rationale: 'Generated from local fallback data because backend intelligence was unavailable.'
    },
    coordinationHint: 'Fallback mode active: verify backend navigation endpoint for richer recommendations.'
  }
}

export const NavigationPage = () => {
  const [seat, setSeat] = useState('B-127')
  const [phase, setPhase] = useState<NavPhase>('entry')
  const [intent, setIntent] = useState<NavIntent>('quick')
  const [mobilityNeed, setMobilityNeed] = useState(false)
  const [selectedZoneId, setSelectedZoneId] = useState(parkingSeed[0]?.id ?? '')
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [recommendation, setRecommendation] = useState<NavigationAssistResponse | null>(null)

  const endpoint = useMemo(() => `${import.meta.env.VITE_API_BASE_URL ?? ''}/api/navigation/assist`, [])

  const loadRecommendation = async () => {
    setIsLoading(true)
    setErrorMessage(null)

    try {
      const params = new URLSearchParams({
        seat,
        phase,
        intent,
        mobilityNeed: String(mobilityNeed)
      })

      const response = await fetch(`${endpoint}?${params.toString()}`)
      if (!response.ok) {
        throw new Error('Navigation intelligence service unavailable')
      }

      const payload = (await response.json()) as NavigationAssistResponse
      setRecommendation(payload)
      setSelectedZoneId(payload.bestRoute.parking.id)
    } catch {
      const fallback = fallbackNavigation({ seat, phase, intent, mobilityNeed })
      setRecommendation(fallback)
      setSelectedZoneId(fallback.bestRoute.parking.id)
      setErrorMessage('Live route engine is unavailable. Showing fallback recommendations.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void loadRecommendation()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const selectedZone = useMemo(
    () => parkingSeed.find((zone) => zone.id === selectedZoneId) ?? parkingSeed[0],
    [selectedZoneId]
  )

  const highCongestionBadge = recommendation?.bestRoute.congestionScore
    ? recommendation.bestRoute.congestionScore >= 75
      ? 'badge-red'
      : recommendation.bestRoute.congestionScore >= 55
        ? 'badge-amber'
        : 'badge-green'
    : 'badge-blue'

  return (
    <div className="page-container">
      <header className="page-header">
        <h1 className="page-title">Parking and Navigation</h1>
        <p className="page-subtitle">Crowd-aware route orchestration with phase and mobility context.</p>
      </header>

      <section className="glass-card vf-nav-control-panel">
        <h3>
          <Compass size={18} /> Smart Route Context
        </h3>

        <div className="vf-nav-control-grid">
          <label>
            Ticket Seat
            <input id="seat-input" className="input" value={seat} onChange={(event) => setSeat(event.target.value.toUpperCase())} />
          </label>

          <label>
            Event Phase
            <select className="input" value={phase} onChange={(event) => setPhase(event.target.value as NavPhase)}>
              <option value="entry">Entry</option>
              <option value="halftime">Halftime</option>
              <option value="exit">Exit</option>
            </select>
          </label>

          <label>
            Route Intent
            <select className="input" value={intent} onChange={(event) => setIntent(event.target.value as NavIntent)}>
              <option value="quick">Quickest Path</option>
              <option value="comfort">Comfort Route</option>
              <option value="merch">Merch + Movement</option>
            </select>
          </label>

          <label className="vf-checkbox-row">
            <input type="checkbox" checked={mobilityNeed} onChange={(event) => setMobilityNeed(event.target.checked)} />
            Mobility-friendly path
          </label>
        </div>

        <div className="vf-nav-control-actions">
          <button className="btn btn-primary" onClick={() => void loadRecommendation()} disabled={isLoading}>
            <Sparkles size={16} />
            {isLoading ? 'Calculating...' : 'Recalculate Smart Route'}
          </button>

          {recommendation ? <p className="vf-muted">Updated {new Date(recommendation.generatedAt).toLocaleTimeString()}</p> : null}
        </div>

        {errorMessage ? <p className="vf-nav-fallback-note">{errorMessage}</p> : null}
      </section>

      {recommendation ? (
        <>
          <div className="vf-section-space" />
          <section className="grid-4">
            <StatsCard label="Route ETA" value={`${recommendation.bestRoute.estimatedTravelMinutes} min`} trend="Best current path" />
            <StatsCard
              label="Gate Congestion"
              value={`${recommendation.bestRoute.congestionScore}%`}
              trend="Crowd pressure index"
              trendDirection={recommendation.bestRoute.congestionScore >= 75 ? 'negative' : 'positive'}
            />
            <StatsCard label="Queue Pressure" value={`${recommendation.telemetry.averageQueueWaitMinutes} min`} trend="Avg nearby waits" />
            <StatsCard label="Route Confidence" value={`${recommendation.bestRoute.confidence}%`} trend="Model confidence" />
          </section>

          <div className="vf-section-space" />
          <section className="grid-2">
            <article className="glass-card vf-route-panel vf-route-panel-hero">
              <h3>
                <Route size={18} /> Recommended Route
              </h3>

              <div className="vf-route-tags">
                <span className="badge badge-blue">{recommendation.bestRoute.parking.name}</span>
                <span className={`badge ${highCongestionBadge}`}>{recommendation.bestRoute.gate}</span>
                <span className="badge badge-green">{recommendation.bestRoute.accessibility}</span>
              </div>

              <p className="vf-route-summary">{recommendation.bestRoute.explanation}</p>

              <ol>
                {recommendation.bestRoute.steps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
            </article>

            <article className="glass-card vf-route-insights">
              <h3>
                <Timer size={18} /> Timing and Coordination
              </h3>
              <p className="vf-route-time-callout">
                Move in <strong>{recommendation.timingAdvice.leaveInMinutes} min</strong>
              </p>
              <p>{recommendation.timingAdvice.recommendedWindow}</p>
              <p className="vf-muted">{recommendation.timingAdvice.rationale}</p>

              <div className="vf-route-ops-note">
                <UserRoundCheck size={16} />
                <p>{recommendation.coordinationHint}</p>
              </div>
            </article>
          </section>

          <div className="vf-section-space" />
          <section className="grid-2">
            <article className="glass-card vf-route-alternatives">
              <h3>
                <Route size={18} /> Alternative Routes
              </h3>

              <div className="vf-route-alt-list">
                {recommendation.alternatives.map((option) => (
                  <div key={option.routeId} className="vf-route-alt-item">
                    <p>
                      <strong>{option.parking.name}</strong> via {option.gate}
                    </p>
                    <p className="vf-muted">
                      ETA {option.estimatedTravelMinutes} min | confidence {option.confidence}%
                    </p>
                  </div>
                ))}
              </div>
            </article>

            <article className="glass-card vf-hotspot-card">
              <h3>
                <AlertTriangle size={18} /> Movement Hotspots
              </h3>

              <div className="vf-hotspot-list">
                {recommendation.hotspots.map((spot) => (
                  <div key={spot.id} className="vf-hotspot-item">
                    <p>
                      <strong>{spot.name}</strong> <span className={`heat-${spot.level}`}>{spot.level}</span>
                    </p>
                    <p className="vf-muted">{spot.action}</p>
                  </div>
                ))}
              </div>
            </article>
          </section>
        </>
      ) : null}

      <div className="vf-section-space" />
      <section className="grid-2">
        {parkingSeed.map((zone) => (
          <ParkingCard key={zone.id} zone={zone} selected={selectedZoneId === zone.id} onSelect={setSelectedZoneId} />
        ))}
      </section>

      <section className="glass-card vf-route-panel vf-route-selected-zone">
        <h3>
          <Route size={18} /> Selected Parking Snapshot
        </h3>
        <p>
          {selectedZone.name}: {selectedZone.availableSpots} available spots, {selectedZone.walkMinutes} min walk, recommended entry{' '}
          {selectedZone.recommendedGate}.
        </p>
      </section>
    </div>
  )
}
