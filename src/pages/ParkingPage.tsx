import { ParkingCircle } from 'lucide-react'
import { ParkingCard } from '../components/ParkingCard'
import { parkingSeed } from '../data/mockData'

export const ParkingPage = () => (
  <div className="page-container">
    <header className="page-header">
      <h1 className="page-title">Smart Parking Availability</h1>
      <p className="page-subtitle">Live parking occupancy by zone before kickoff.</p>
    </header>

    <section className="vf-queue-ticket glass-card">
      <p className="badge badge-amber">Arrival Advisory</p>
      <h2>
        <ParkingCircle size={20} /> Parking B filling quickly
      </h2>
      <p>Best alternate is Parking C with high availability and medium walk distance.</p>
    </section>

    <div className="vf-section-space" />
    <section className="grid-2">
      {parkingSeed.map((zone) => (
        <ParkingCard key={zone.id} zone={zone} selected={zone.id === 'C'} onSelect={() => undefined} />
      ))}
    </section>
  </div>
)
