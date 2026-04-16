import { Activity } from 'lucide-react'
import { useMemo, useState } from 'react'
import type { HeatZone } from '../types'

interface HeatmapCanvasProps {
  zones: HeatZone[]
  onRefresh: () => void
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

  return (
    <section className="vf-heatmap-panel glass-card">
      <div className="vf-panel-head">
        <div>
          <h3>Interactive Crowd Heatmap</h3>
          <p>Zone occupancy updates every 8 seconds with realistic event patterns.</p>
        </div>

        <button className="btn btn-secondary" onClick={onRefresh}>
          <Activity size={16} />
          Refresh Snapshot
        </button>
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
              style={{ width: `${Math.round((selectedZone.occupancy / selectedZone.capacity) * 100)}%` }}
            />
          </div>
        </div>
      ) : null}
    </section>
  )
}
