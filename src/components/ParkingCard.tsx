import { CarFront } from 'lucide-react'
import type { ParkingZone } from '../types'

interface ParkingCardProps {
  zone: ParkingZone
  selected: boolean
  nextSpot: string | null
  onSelect: (zoneId: string) => void
}

export const ParkingCard = ({ zone, selected, nextSpot, onSelect }: ParkingCardProps) => {
  const availabilityPercent = Math.round((zone.availableSpots / zone.totalSpots) * 100)
  const occupancyPercent = 100 - availabilityPercent
  const occupancyBadge = occupancyPercent >= 90 ? 'badge-red' : occupancyPercent >= 75 ? 'badge-amber' : 'badge-green'

  return (
    <article className={`glass-card vf-parking-card ${selected ? 'selected' : ''}`}>
      <div className="vf-parking-head">
        <h3>{zone.name}</h3>
        <span className={`badge ${occupancyBadge}`}>{occupancyPercent}% occupied</span>
      </div>

      <p>
        <CarFront size={16} style={{ display: 'inline', marginRight: '6px' }} />
        {zone.availableSpots} / {zone.totalSpots} spots open
      </p>
      <p>Walk: {zone.walkMinutes} min</p>
      <p>Recommended entry: {zone.recommendedGate}</p>
      <p className="vf-muted">
        Next spot: <strong>{nextSpot ?? 'No immediate spot available'}</strong>
      </p>

      <div className="progress-bar">
        <div className="progress-bar-fill" style={{ width: `${Math.max(8, availabilityPercent)}%` }} />
      </div>

      <button className="btn btn-secondary" onClick={() => onSelect(zone.id)}>
        {selected ? 'Selected' : 'Select Zone'}
      </button>
    </article>
  )
}
