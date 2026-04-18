import { MapPin, Navigation as NavigationIcon, ParkingCircle, Zap } from 'lucide-react'
import { useMemo, useState } from 'react'
import { ParkingCard } from '../components/ParkingCard'
import { parkingSeed } from '../data/mockData'

export const ParkingPage = () => {
  const [selectedZoneId, setSelectedZoneId] = useState(parkingSeed[0]?.id ?? '')
  const [rerouteMessage, setRerouteMessage] = useState('')

  const selectedZone = useMemo(
    () => parkingSeed.find((zone) => zone.id === selectedZoneId) ?? parkingSeed[0],
    [selectedZoneId]
  )

  const busiestZone = useMemo(
    () => [...parkingSeed].sort((a, b) => a.availableSpots / a.totalSpots - b.availableSpots / b.totalSpots)[0],
    []
  )

  const bestRerouteZone = useMemo(() => {
    const ranked = [...parkingSeed].sort((a, b) => {
      const availabilityA = a.availableSpots / Math.max(1, a.totalSpots)
      const availabilityB = b.availableSpots / Math.max(1, b.totalSpots)
      if (availabilityB !== availabilityA) {
        return availabilityB - availabilityA
      }
      return a.walkMinutes - b.walkMinutes
    })

    return ranked[0]
  }, [])

  const handleReroutePlan = () => {
    setSelectedZoneId(bestRerouteZone.id)
    setRerouteMessage(
      `Reroute engaged: ${bestRerouteZone.name} selected with ${bestRerouteZone.availableSpots} free spots and ${bestRerouteZone.walkMinutes} min walk.`
    )
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

      <div className="vf-section-label">
        <MapPin size={16} />
        <span>Live Status Grids</span>
      </div>

      <section className="grid-2">
        {parkingSeed.map((zone, index) => (
          <div key={zone.id} className="animate-slideUp" style={{ animationDelay: `${0.1 + index * 0.08}s` }}>
            <ParkingCard zone={zone} selected={zone.id === selectedZoneId} onSelect={setSelectedZoneId} />
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
          </section>
        </>
      ) : null}
    </div>
  )
}
