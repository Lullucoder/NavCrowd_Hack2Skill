import { Activity, AlertTriangle, TrendingDown, TrendingUp } from 'lucide-react'
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

  return (
    <section className="vf-heatmap-panel glass-card">
      <div className="vf-panel-head">
        <div>
          <h3>Interactive Crowd Heatmap</h3>
          <p>Live occupancy plus short-horizon prediction to support real-time routing decisions.</p>
        </div>

        <button className="btn btn-secondary" onClick={onRefresh}>
          <Activity size={16} />
          Refresh Snapshot
        </button>
      </div>

      <div className="vf-heatmap-meta">
        <span className="badge badge-green">Low {severityCounts.low}</span>
        <span className="badge badge-amber">Medium {severityCounts.medium}</span>
        <span className="badge badge-red">High {severityCounts.high}</span>
        <span className="badge badge-purple">Critical {severityCounts.critical}</span>
      </div>

      <div className="vf-heatmap-grid">
        {zones.map((zone) => {
          const occupancyPercent = Math.round((zone.occupancy / zone.capacity) * 100)
          const isSelected = zone.id === selectedZone?.id

          return (
            <button
              key={zone.id}
              className={`vf-zone-cell ${levelClassByZone(zone.level)} ${isSelected ? 'selected' : ''}`}
              onClick={() => setSelectedZoneId(zone.id)}
            >
              <span>{zone.name}</span>
              <strong>{occupancyPercent}%</strong>
            </button>
          )
        })}
      </div>

      {selectedZone ? (
        <div className="vf-zone-details">
          <p>
            <strong>{selectedZone.name}</strong>
          </p>
          <p>
            Occupancy: {selectedZone.occupancy} / {selectedZone.capacity} attendees
          </p>
          <div className="progress-bar">
            <div
              className="progress-bar-fill"
              style={{ width: `${selectedOccupancyPercent}%` }}
            />
          </div>

          <div className="vf-zone-forecast-grid">
            <div className="vf-zone-forecast-item">
              <p className="vf-muted">Trend</p>
              <strong>
                {selectedZone.trend > 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />} {' '}
                {selectedZone.trend > 0 ? 'Rising' : 'Easing'}
              </strong>
            </div>

            <div className="vf-zone-forecast-item">
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
          <AlertTriangle size={16} /> Top Movement Hotspots
        </h4>

        <div className="vf-heatmap-hotspot-list">
          {hotspots.map((spot) => (
            <article key={spot.id} className="vf-heatmap-hotspot-item">
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
