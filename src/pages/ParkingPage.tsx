import { CarFront, Gauge, MapPin, Navigation as NavigationIcon, ParkingCircle, Sparkles, Target, Zap } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { ParkingCard } from '../components/ParkingCard'
import { parkingSeed } from '../data/mockData'
import { logGoogleAuditRecord, trackGoogleEvent } from '../services/googleServices'
import type { ParkingZone } from '../types'

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value))

const getOpenRatio = (zone: ParkingZone) => zone.availableSpots / Math.max(1, zone.totalSpots)

const getOccupancyPercent = (zone: ParkingZone) => Math.round((1 - getOpenRatio(zone)) * 100)

const buildNextSpotCode = (zone: ParkingZone) => {
  if (zone.availableSpots <= 0) {
    return null
  }

  const occupiedCount = zone.totalSpots - zone.availableSpots
  const nextIndex = Math.min(zone.totalSpots, occupiedCount + 1)
  const level = Math.floor((nextIndex - 1) / 220) + 1
  const laneIndex = Math.floor(((nextIndex - 1) % 220) / 22)
  const lane = String.fromCharCode(65 + laneIndex)
  const bay = ((nextIndex - 1) % 22) + 1

  return `${zone.id}-L${level}-${lane}${String(bay).padStart(2, '0')}`
}

export const ParkingPage = () => {
  const [zones, setZones] = useState<ParkingZone[]>(parkingSeed)
  const [selectedZoneId, setSelectedZoneId] = useState(parkingSeed[0]?.id ?? '')
  const [rerouteMessage, setRerouteMessage] = useState('')

  useEffect(() => {
    const timerId = window.setInterval(() => {
      setZones((current) =>
        current.map((zone) => {
          const pressure = getOccupancyPercent(zone)
          const randomFlow = Math.floor(Math.random() * 22) - 9
          const pressurePull = pressure > 85 ? 4 : pressure > 70 ? 2 : -1
          const nextAvailable = clamp(zone.availableSpots + randomFlow - pressurePull, 0, zone.totalSpots)

          return {
            ...zone,
            availableSpots: nextAvailable
          }
        })
      )
    }, 9000)

    return () => {
      window.clearInterval(timerId)
    }
  }, [])

  const selectedZone = useMemo(
    () => zones.find((zone) => zone.id === selectedZoneId) ?? zones[0],
    [selectedZoneId, zones]
  )

  const busiestZone = useMemo(
    () => [...zones].sort((a, b) => getOpenRatio(a) - getOpenRatio(b))[0],
    [zones]
  )

  const bestRerouteZone = useMemo(() => {
    const ranked = [...zones].sort((a, b) => {
      const availabilityA = getOpenRatio(a)
      const availabilityB = getOpenRatio(b)
      if (availabilityB !== availabilityA) {
        return availabilityB - availabilityA
      }
      return a.walkMinutes - b.walkMinutes
    })

    return ranked[0]
  }, [zones])

  const selectedNextSpot = useMemo(() => {
    if (!selectedZone) {
      return null
    }
    return buildNextSpotCode(selectedZone)
  }, [selectedZone])

  const fallbackZone = useMemo(() => {
    if (!selectedZone) {
      return null
    }

    const rankedAlternatives = zones
      .filter((zone) => zone.id !== selectedZone.id && zone.availableSpots > 0)
      .sort((a, b) => {
        const availabilityB = getOpenRatio(b)
        const availabilityA = getOpenRatio(a)
        if (availabilityB !== availabilityA) {
          return availabilityB - availabilityA
        }
        return a.walkMinutes - b.walkMinutes
      })

    return rankedAlternatives[0] ?? null
  }, [selectedZone, zones])

  const totalSpots = useMemo(() => zones.reduce((sum, zone) => sum + zone.totalSpots, 0), [zones])
  const totalOpenSpots = useMemo(() => zones.reduce((sum, zone) => sum + zone.availableSpots, 0), [zones])

  const networkOccupancy = useMemo(() => {
    if (!totalSpots) {
      return 0
    }
    return Math.round(((totalSpots - totalOpenSpots) / totalSpots) * 100)
  }, [totalOpenSpots, totalSpots])

  const handleReroutePlan = () => {
    setSelectedZoneId(bestRerouteZone.id)
    setRerouteMessage(
      `Reroute engaged: ${bestRerouteZone.name} selected with ${bestRerouteZone.availableSpots} free spots and ${bestRerouteZone.walkMinutes} min walk.`
    )

    trackGoogleEvent('parking_reroute_engaged', {
      targetZone: bestRerouteZone.id,
      availableSpots: bestRerouteZone.availableSpots,
      walkMinutes: bestRerouteZone.walkMinutes
    })

    void logGoogleAuditRecord('parking_events', {
      eventType: 'reroute_engaged',
      zoneId: bestRerouteZone.id,
      zoneName: bestRerouteZone.name,
      availableSpots: bestRerouteZone.availableSpots,
      walkMinutes: bestRerouteZone.walkMinutes
    })
  }

  const handleSelectZone = (zoneId: string) => {
    setSelectedZoneId(zoneId)
    setRerouteMessage('')
  }

  const handleUseSuggestedSpot = () => {
    if (selectedZone && selectedNextSpot) {
      setRerouteMessage(`Next spot assigned: ${selectedNextSpot} in ${selectedZone.name}. Enter via ${selectedZone.recommendedGate}.`)

      trackGoogleEvent('parking_spot_assigned', {
        zoneId: selectedZone.id,
        spotCode: selectedNextSpot
      })

      void logGoogleAuditRecord('parking_events', {
        eventType: 'spot_assigned',
        zoneId: selectedZone.id,
        zoneName: selectedZone.name,
        spotCode: selectedNextSpot,
        gate: selectedZone.recommendedGate
      })
      return
    }

    if (fallbackZone) {
      const fallbackSpot = buildNextSpotCode(fallbackZone)
      setSelectedZoneId(fallbackZone.id)
      setRerouteMessage(
        `Selected zone is full. Redirected to ${fallbackZone.name}${fallbackSpot ? ` • next spot ${fallbackSpot}` : ''}.`
      )

      trackGoogleEvent('parking_zone_fallback', {
        targetZone: fallbackZone.id,
        spotCode: fallbackSpot ?? 'none'
      })

      void logGoogleAuditRecord('parking_events', {
        eventType: 'zone_fallback',
        zoneId: fallbackZone.id,
        zoneName: fallbackZone.name,
        spotCode: fallbackSpot,
        availableSpots: fallbackZone.availableSpots
      })
      return
    }

    setRerouteMessage('All zones are near full right now. Please follow marshal instructions at entry gate.')
  }

  return (
    <div className="page-container animate-fadeIn">
      <header className="page-header">
        <h1 className="page-title">
          <ParkingCircle size={28} className="animate-glow" style={{ color: 'var(--accent-purple)' }} />
          <span className="text-gradient">Smart Parking Grid</span>
        </h1>
        <p className="page-subtitle">Live telemetry for stadium vehicle zones with faster gate-entry decisions.</p>
      </header>

      <section className="glass-card vf-parking-advisory">
        <div className="vf-panel-head">
          <div>
            <h3>
              <Zap size={18} className="animate-glow" style={{ color: 'var(--accent-amber)' }} /> Priority Advisory
            </h3>
            <p>
              {busiestZone.name} is filling quickly. Use {selectedZone.name} for balanced availability and smooth walk-in.
            </p>
          </div>
          <span className="badge badge-amber">{busiestZone.name} high load</span>
        </div>

        <button className="btn btn-secondary hover-lift" type="button" onClick={handleReroutePlan}>
          <NavigationIcon size={16} /> Engage reroute plan
        </button>

        {rerouteMessage ? <p className="vf-inline-note">{rerouteMessage}</p> : null}
      </section>

      <div className="vf-section-space" />

      <section className="vf-parking-metric-grid">
        <article className="glass-card-static vf-parking-metric-card">
          <p className="vf-section-label">
            <Gauge size={14} />
            Live Occupancy
          </p>
          <strong>{networkOccupancy}% occupied</strong>
          <span>{totalOpenSpots} spots open across all zones</span>
        </article>

        <article className="glass-card-static vf-parking-metric-card">
          <p className="vf-section-label">
            <Target size={14} />
            Selected Zone
          </p>
          <strong>{selectedZone.name}</strong>
          <span>{selectedZone.availableSpots} open • {selectedZone.walkMinutes} min walk</span>
        </article>

        <article className="glass-card-static vf-parking-metric-card">
          <p className="vf-section-label">
            <Sparkles size={14} />
            Best Reroute
          </p>
          <strong>{bestRerouteZone.name}</strong>
          <span>{bestRerouteZone.availableSpots} open • Gate {bestRerouteZone.recommendedGate.replace('Gate ', '')}</span>
        </article>
      </section>

      <div className="vf-section-space" />

      <div className="vf-section-label">
        <MapPin size={16} />
        <span>Live Status Grids</span>
      </div>

      <section className="grid-2">
        {zones.map((zone, index) => (
          <div key={zone.id} className="animate-slideUp" style={{ animationDelay: `${0.1 + index * 0.08}s` }}>
            <ParkingCard
              zone={zone}
              selected={zone.id === selectedZoneId}
              nextSpot={buildNextSpotCode(zone)}
              onSelect={handleSelectZone}
            />
          </div>
        ))}
      </section>

      {selectedZone ? (
        <>
          <div className="vf-section-space" />
          <section className="glass-card-static vf-selected-zone-panel animate-fadeIn">
            <div className="vf-panel-head">
              <div>
                <h3>{selectedZone.name} Quick Brief</h3>
                <p>
                  Recommended gate: {selectedZone.recommendedGate} • Walking time: {selectedZone.walkMinutes} min
                </p>
              </div>
              <span className="badge badge-blue">{selectedZone.availableSpots} spots open</span>
            </div>

            <div className="vf-parking-next-spot">
              <p className="vf-section-label">
                <CarFront size={14} />
                Next Available Spot
              </p>
              <p className="vf-parking-next-spot-code">{selectedNextSpot ?? 'Zone Full'}</p>
              <p className="vf-muted">
                {selectedNextSpot
                  ? `Follow lane markers to ${selectedNextSpot}.`
                  : 'This zone is currently full. Use suggested reroute below.'}
              </p>
            </div>

            {fallbackZone ? (
              <p className="vf-parking-fallback-note">
                Alternate: {fallbackZone.name} has {fallbackZone.availableSpots} open spots{buildNextSpotCode(fallbackZone) ? ` • next spot ${buildNextSpotCode(fallbackZone)}` : ''}.
              </p>
            ) : null}

            <button className="btn btn-primary" onClick={handleUseSuggestedSpot}>
              <NavigationIcon size={16} />
              {selectedNextSpot ? 'Use Suggested Spot' : 'Find Next Open Zone'}
            </button>
          </section>
        </>
      ) : null}
    </div>
  )
}
