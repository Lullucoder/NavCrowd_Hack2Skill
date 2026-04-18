import { Activity, AlertTriangle, Clock, Users } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { AiInsightsPanel } from '../components/AiInsightsPanel'
import { AlertBanner } from '../components/AlertBanner'
import { ChatBot } from '../components/ChatBot'
import { StatsCard } from '../components/StatsCard'
import { ToastContainer, useToast } from '../components/Toast'
import { VenueMap } from '../components/VenueMap'
import { alertSeed } from '../data/mockData'
import { updateCrowdDataFromCCTV, venueBlueprint } from '../data/venueBlueprint'
import type { VenueBlueprint } from '../types/venue'

export const DashboardPage = () => {
  const [blueprint, setBlueprint] = useState<VenueBlueprint>(venueBlueprint)
  const [selectedAreaId, setSelectedAreaId] = useState<string | null>(null)
  const { toasts, addToast, removeToast } = useToast()

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
                    background: 'rgba(59, 130, 246, 0.1)',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
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
    </>
  )
}
