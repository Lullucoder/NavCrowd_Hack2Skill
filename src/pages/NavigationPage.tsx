import { Route } from 'lucide-react'
import { useMemo, useState } from 'react'
import { ParkingCard } from '../components/ParkingCard'
import { parkingSeed } from '../data/mockData'

export const NavigationPage = () => {
  const [seat, setSeat] = useState('B-127')
  const [selectedZoneId, setSelectedZoneId] = useState(parkingSeed[0]?.id ?? '')

  const selectedZone = useMemo(
    () => parkingSeed.find((zone) => zone.id === selectedZoneId) ?? parkingSeed[0],
    [selectedZoneId]
  )

  const steps = [
    `Park at ${selectedZone.name}`,
    `Walk ${selectedZone.walkMinutes} minutes to ${selectedZone.recommendedGate}`,
    'Use Concourse Ring 2',
    `Follow seat markers to Block ${seat.split('-')[0]} and seat ${seat}`
  ]

  return (
    <div className="page-container">
      <header className="page-header">
        <h1 className="page-title">Parking and Navigation</h1>
        <p className="page-subtitle">Get the fastest path from parking to your exact seat block.</p>
      </header>

      <section className="vf-seat-row glass-card">
        <label htmlFor="seat-input">Ticket Seat</label>
        <input id="seat-input" className="input" value={seat} onChange={(event) => setSeat(event.target.value.toUpperCase())} />
      </section>

      <div className="vf-section-space" />
      <section className="grid-2">
        {parkingSeed.map((zone) => (
          <ParkingCard key={zone.id} zone={zone} selected={selectedZoneId === zone.id} onSelect={setSelectedZoneId} />
        ))}
      </section>

      <div className="vf-section-space" />
      <section className="glass-card vf-route-panel">
        <h3>
          <Route size={18} /> Route Steps
        </h3>
        <ol>
          {steps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </section>
    </div>
  )
}
