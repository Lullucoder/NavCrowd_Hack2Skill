import { Activity, AlertTriangle, TrendingDown, TrendingUp, Zap } from 'lucide-react'
import { useMemo, useState } from 'react'
import type { HeatZone } from '../types'

interface HeatmapCanvasProps {
  zones: HeatZone[]
  onRefresh: () => void
}

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value))

const levelFromRatio = (ratio: number): HeatZone['level'] => {
  if (ratio < 0.35) {
    return 'low'
  }

  if (ratio < 0.55) {
    return 'medium'
  }

  if (ratio < 0.75) {
    return 'high'
  }

  return 'critical'
}

const recommendedActionByLevel = (zone: HeatZone) => {
  if (zone.level === 'critical') {
    return `Critical load at ${zone.name}. Reroute foot traffic immediately.`
  }

  if (zone.level === 'high') {
    return `${zone.name} is near high load. Slow non-essential movement through this zone.`
  }

  if (zone.level === 'medium') {
    return `${zone.name} is stable but should be watched for surge changes.`
  }

  return `${zone.name} is currently clear for normal fan movement.`
}

const levelClassByZone = (level: HeatZone['level']) => {
  if (level === 'low') {
    return 'heat-bg-low'
  }

  if (level === 'medium') {
    return 'heat-bg-medium'
  }

  if (level === 'high') {
    return 'heat-bg-high'
  }

  return 'heat-bg-critical'
}

export const HeatmapCanvas = ({ zones, onRefresh }: HeatmapCanvasProps) => {
  const [selectedZoneId, setSelectedZoneId] = useState(zones[0]?.id ?? '')
  const [isRefreshing, setIsRefreshing] = useState(false)

  const selectedZone = useMemo(
    () => zones.find((zone) => zone.id === selectedZoneId) ?? zones[0],
    [selectedZoneId, zones]
  )

  const severityCounts = useMemo(
    () => ({
      low: zones.filter((zone) => zone.level === 'low').length,
      medium: zones.filter((zone) => zone.level === 'medium').length,
      high: zones.filter((zone) => zone.level === 'high').length,
      critical: zones.filter((zone) => zone.level === 'critical').length
    }),
    [zones]
  )

  const hotspots = useMemo(
    () =>
      [...zones]
        .sort((a, b) => b.occupancy / b.capacity - a.occupancy / a.capacity)
        .slice(0, 3)
        .map((zone) => ({
          ...zone,
          occupancyRatio: Math.round((zone.occupancy / zone.capacity) * 100)
        })),
    [zones]
  )

  const selectedOccupancyPercent = selectedZone ? Math.round((selectedZone.occupancy / selectedZone.capacity) * 100) : 0
  const forecastRatio = selectedZone
    ? clamp(selectedZone.occupancy / selectedZone.capacity + selectedZone.trend * 0.09, 0, 1)
    : 0
  const forecastLevel = levelFromRatio(forecastRatio)
  const forecastOccupancy = selectedZone ? Math.round(selectedZone.capacity * forecastRatio) : 0

  const handleRefresh = () => {
    setIsRefreshing(true)
    onRefresh()
    setTimeout(() => setIsRefreshing(false), 600)
  }

  return (
    <section className="vf-heatmap-panel glass-card-static">
      <div className="vf-panel-head">
        <div>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
            <Zap size={20} className="animate-glow" style={{ color: 'var(--accent-blue)' }} />
            Interactive Crowd Heatmap
          </h3>
          <p>Live occupancy plus short-horizon prediction to support real-time routing decisions.</p>
        </div>

        <button className={`btn btn-secondary hover-lift ${isRefreshing ? 'animate-bounceIn' : ''}`} onClick={handleRefresh}>
          <Activity size={16} style={{ animation: isRefreshing ? 'spin-slow 0.6s linear' : 'none' }} />
          Refresh Snapshot
        </button>
      </div>

      <div className="vf-heatmap-meta">
        <span className="badge badge-green animate-scaleIn" style={{ animationDelay: '0.1s' }}>
          Low {severityCounts.low}
        </span>
        <span className="badge badge-amber animate-scaleIn" style={{ animationDelay: '0.2s' }}>
          Medium {severityCounts.medium}
        </span>
        <span className="badge badge-red animate-scaleIn" style={{ animationDelay: '0.3s' }}>
          High {severityCounts.high}
        </span>
        <span className="badge badge-purple animate-scaleIn" style={{ animationDelay: '0.4s' }}>
          Critical {severityCounts.critical}
        </span>
      </div>

      <div className="vf-heatmap-grid">
        {zones.map((zone, index) => {
          const occupancyPercent = Math.round((zone.occupancy / zone.capacity) * 100)
          const isSelected = zone.id === selectedZone?.id

          return (
            <button
              key={zone.id}
              className={`vf-zone-cell ${levelClassByZone(zone.level)} ${isSelected ? 'selected' : ''} hover-lift`}
              onClick={() => setSelectedZoneId(zone.id)}
              style={{
                animation: `scaleIn 0.3s ease-out ${index * 0.03}s both`,
                position: 'relative'
              }}
            >
              {zone.level === 'critical' && (
                <div
                  style={{
                    position: 'absolute',
                    top: '4px',
                    right: '4px',
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: 'var(--accent-red)',
                    animation: 'live-pulse 1.5s ease-in-out infinite'
                  }}
                />
              )}
              <span>{zone.name}</span>
              <strong>{occupancyPercent}%</strong>
            </button>
          )
        })}
      </div>

      {selectedZone ? (
        <div className="vf-zone-details animate-fadeIn">
          <p>
            <strong>{selectedZone.name}</strong>
          </p>
          <p>
            Occupancy: {selectedZone.occupancy} / {selectedZone.capacity} attendees
          </p>
          <div className="progress-bar">
            <div
              className="progress-bar-fill"
              style={{
                width: `${selectedOccupancyPercent}%`,
                transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            />
          </div>

          <div className="vf-zone-forecast-grid">
            <div className="vf-zone-forecast-item hover-lift">
              <p className="vf-muted">Trend</p>
              <strong>
                {selectedZone.trend > 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />} {' '}
                {selectedZone.trend > 0 ? 'Rising' : 'Easing'}
              </strong>
            </div>

            <div className="vf-zone-forecast-item hover-lift">
              <p className="vf-muted">15-min Forecast</p>
              <strong className={`heat-${forecastLevel}`}>
                {forecastOccupancy} ({Math.round(forecastRatio * 100)}%)
              </strong>
            </div>
          </div>

          <p className="vf-muted">{recommendedActionByLevel(selectedZone)}</p>
        </div>
      ) : null}

      <div className="vf-heatmap-hotspots">
        <h4>
          <AlertTriangle size={16} className="animate-glow" style={{ color: 'var(--accent-amber)' }} /> Top Movement
          Hotspots
        </h4>

        <div className="vf-heatmap-hotspot-list">
          {hotspots.map((spot, index) => (
            <article
              key={spot.id}
              className="vf-heatmap-hotspot-item hover-lift"
              style={{ animation: `fadeIn 0.4s ease-out ${0.5 + index * 0.1}s both` }}
            >
              <p>
                <strong>{spot.name}</strong> <span className={`heat-${spot.level}`}>{spot.level}</span>
              </p>
              <p className="vf-muted">{spot.occupancyRatio}% occupied</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
