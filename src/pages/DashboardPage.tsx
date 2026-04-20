import { Activity, AlertTriangle, Armchair, Clock, QrCode, Ticket, Trophy, Users, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { AiInsightsPanel } from '../components/AiInsightsPanel'
import { AlertBanner } from '../components/AlertBanner'
import { ChatBot } from '../components/ChatBot'
import { StatsCard } from '../components/StatsCard'
import { ToastContainer, useToast } from '../components/Toast'
import { VenueMap } from '../components/VenueMap'
import { alertSeed } from '../data/mockData'
import { updateCrowdDataFromCCTV, venueBlueprint } from '../data/venueBlueprint'
import type { UserTicketProfile } from '../types'
import type { VenueBlueprint } from '../types/venue'

interface DashboardPageProps {
  ticketProfile: UserTicketProfile
}

export const DashboardPage = ({ ticketProfile }: DashboardPageProps) => {
  const [blueprint, setBlueprint] = useState<VenueBlueprint>(venueBlueprint)
  const [selectedAreaId, setSelectedAreaId] = useState<string | null>(null)
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false)
  const { toasts, addToast, removeToast } = useToast()

  const ticketStampDate = useMemo(
    () => new Date().toLocaleDateString([], { day: '2-digit', month: 'short', year: 'numeric' }),
    []
  )

  const ticketQrPayload = useMemo(
    () => `NC|${ticketProfile.sport}|${ticketProfile.ticketNumber}|${ticketProfile.seatNumber}|${ticketProfile.name}`,
    [ticketProfile]
  )

  useEffect(() => {
    // Welcome toast on mount
    addToast({
      type: 'success',
      title: 'Welcome to NavCrowd!',
      message: 'Real-time crowd monitoring is active',
      duration: 4000
    })
  }, [])

  useEffect(() => {
    const timer = window.setInterval(() => {
      setBlueprint((current) => {
        const next = updateCrowdDataFromCCTV(current)
        
        // Check for critical zones and show toast
        const criticalAreas = next.areas.filter((a) => a.level === 'critical')
        const prevCritical = current.areas.filter((a) => a.level === 'critical')
        
        if (criticalAreas.length > prevCritical.length) {
          const newCritical = criticalAreas.find((a) => !prevCritical.some((p) => p.id === a.id))
          if (newCritical) {
            addToast({
              type: 'warning',
              title: 'Critical Area Alert',
              message: `${newCritical.name} has reached critical capacity`,
              duration: 6000
            })
          }
        }
        
        return next
      })
    }, 5000)

    return () => window.clearInterval(timer)
  }, [addToast])

  const occupancy = useMemo(() => {
    const current = blueprint.areas.reduce((sum, area) => sum + area.currentOccupancy, 0)
    const capacity = blueprint.areas.reduce((sum, area) => sum + area.capacity, 0)
    return Math.round((current / capacity) * 100)
  }, [blueprint.areas])

  const highRiskAreas = useMemo(
    () => blueprint.areas.filter((area) => area.level === 'high' || area.level === 'critical').length,
    [blueprint.areas]
  )

  const selectedArea = selectedAreaId ? blueprint.areas.find((a) => a.id === selectedAreaId) : null

  return (
    <>
      <ToastContainer toasts={toasts} onClose={removeToast} />
      <div className="page-container">
        <header className="page-header animate-fadeIn">
          <h1 className="page-title">
            <span className="text-gradient">Matchday Command Center</span>
          </h1>
          <p className="page-subtitle">Live fan-side overview of crowd flow, alerts, and ML-powered assistance.</p>
        </header>

        <section className="vf-ticket-summary glass-card-static animate-slideUp" style={{ animationDelay: '0.15s', opacity: 0 }}>
          <div className="vf-ticket-summary-head">
            <div>
              <p className="vf-section-label">
                <Ticket size={14} />
                Verified Ticket
              </p>
              <h2>
                {ticketProfile.sport} Match Pass • Seat {ticketProfile.seatNumber}
              </h2>
              <p className="vf-muted">
                Ticket {ticketProfile.ticketNumber} is mapped to {ticketProfile.name}. This event is currently configured for cricket by default.
              </p>
            </div>
            <button className="btn btn-primary" onClick={() => setIsTicketModalOpen(true)}>
              View Ticket Pass
            </button>
          </div>

          <div className="vf-ticket-chip-row">
            <span className="badge badge-blue" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <Trophy size={14} />
              {ticketProfile.sport}
            </span>
            <span className="badge badge-green" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <Armchair size={14} />
              Seat {ticketProfile.seatNumber}
            </span>
            <span className="badge badge-amber" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <Ticket size={14} />
              {ticketProfile.ticketNumber}
            </span>
          </div>
        </section>

        <section className="grid-4 stagger-children">
          <StatsCard
            label="Live Occupancy"
            value={`${occupancy}%`}
            trend="+4.1% from 10 minutes ago"
            icon={<Users size={32} />}
            delay={0}
          />
          <StatsCard
            label="Areas At Risk"
            value={String(highRiskAreas)}
            trend="Needs routing support"
            trendDirection="negative"
            icon={<AlertTriangle size={32} />}
            delay={100}
          />
          <StatsCard
            label="CCTV Feeds Active"
            value={String(blueprint.cctvFeeds.filter((f) => f.status === 'active').length)}
            trend="ML processing live"
            icon={<Clock size={32} />}
            delay={200}
          />
          <StatsCard
            label="Active Alerts"
            value={String(alertSeed.length)}
            trend="No critical emergency"
            icon={<Activity size={32} />}
            delay={300}
          />
        </section>

        <div className="vf-section-space" />
        <div className="animate-slideUp" style={{ animationDelay: '0.4s', opacity: 0 }}>
          <AlertBanner title={alertSeed[0].title} message={alertSeed[0].message} severity={alertSeed[0].severity} />
        </div>

        <div className="vf-section-space" />
        <section className="vf-dashboard-grid">
          <div className="animate-slideUp" style={{ animationDelay: '0.5s', opacity: 0 }}>
            <div className="glass-card-static" style={{ padding: 'var(--space-lg)' }}>
              <div style={{ marginBottom: 'var(--space-md)' }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', marginBottom: 'var(--space-xs)' }}>
                  <Activity size={18} className="animate-glow" style={{ color: 'var(--accent-blue)' }} />
                  Live Venue Heatmap
                </h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                  Click on any area to view details. ML processes CCTV feeds every 5 seconds.
                </p>
              </div>

              <VenueMap blueprint={blueprint} selectedAreaId={selectedAreaId ?? undefined} onAreaSelect={setSelectedAreaId} showCCTV={true} />

              {selectedArea && (
                <div
                  className="animate-fadeIn"
                  style={{
                    marginTop: 'var(--space-md)',
                    padding: 'var(--space-md)',
                    background: 'rgba(249, 115, 22, 0.11)',
                    border: '1px solid rgba(249, 115, 22, 0.32)',
                    borderRadius: 'var(--radius-md)'
                  }}
                >
                  <p style={{ fontWeight: 600, marginBottom: '4px' }}>{selectedArea.name}</p>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    Occupancy: {selectedArea.currentOccupancy} / {selectedArea.capacity} (
                    {Math.round((selectedArea.currentOccupancy / selectedArea.capacity) * 100)}%)
                  </p>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    Status: <span className={`heat-${selectedArea.level}`}>{selectedArea.level}</span>
                  </p>
                </div>
              )}
            </div>
          </div>
          <div className="animate-slideUp" style={{ animationDelay: '0.6s', opacity: 0 }}>
            <ChatBot />
          </div>
        </section>

        <div className="vf-section-space" />
        <div className="animate-slideUp" style={{ animationDelay: '0.7s', opacity: 0 }}>
          <AiInsightsPanel />
        </div>
      </div>

      {isTicketModalOpen ? (
        <div
          className="vf-ticket-modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-label="Ticket pass"
          onClick={() => setIsTicketModalOpen(false)}
        >
          <div className="vf-ticket-modal" onClick={(event) => event.stopPropagation()}>
            <button
              className="btn btn-ghost vf-ticket-close-btn"
              onClick={() => setIsTicketModalOpen(false)}
              aria-label="Close ticket pass"
            >
              <X size={16} />
            </button>

            <div className="vf-ticket-pass">
              <p className="vf-ticket-pass-kicker">NavCrowd Match Ticket</p>
              <h3>{ticketProfile.sport} Entry Pass</h3>
              <p className="vf-muted">Ticket holder: {ticketProfile.name}</p>

              <div className="vf-ticket-pass-grid">
                <div>
                  <span>Ticket Number</span>
                  <strong>{ticketProfile.ticketNumber}</strong>
                </div>
                <div>
                  <span>Seat</span>
                  <strong>{ticketProfile.seatNumber}</strong>
                </div>
                <div>
                  <span>Sport</span>
                  <strong>{ticketProfile.sport}</strong>
                </div>
                <div>
                  <span>Issued</span>
                  <strong>{ticketStampDate}</strong>
                </div>
              </div>

              <div className="vf-ticket-qr-block" aria-label="Ticket quick scan code">
                <QrCode size={30} />
                <code>{ticketQrPayload}</code>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}
