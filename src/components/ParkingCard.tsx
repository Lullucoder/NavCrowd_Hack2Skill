import { CarFront } from 'lucide-react'
import type { ParkingZone } from '../types'

interface ParkingCardProps {
  zone: ParkingZone
  selected: boolean
  onSelect: (zoneId: string) => void
}

export const ParkingCard = ({ zone, selected, onSelect }: ParkingCardProps) => {
  const availability = Math.round((zone.availableSpots / zone.totalSpots) * 100)

  return (
    <article className={`glass-card vf-parking-card ${selected ? 'selected' : ''}`}>
      <div className="vf-parking-head">
        <h3>{zone.name}</h3>
        <CarFront size={18} />
      </div>

      <p>
        {zone.availableSpots} / {zone.totalSpots} spots available
      </p>
      <p>Walk: {zone.walkMinutes} min</p>
      <p>Recommended entry: {zone.recommendedGate}</p>

      <div className="progress-bar">
        <div className="progress-bar-fill" style={{ width: `${availability}%` }} />
      </div>

      <button className="btn btn-secondary" onClick={() => onSelect(zone.id)}>
        {selected ? 'Selected' : 'Select Zone'}
      </button>
    </article>
  )
}
