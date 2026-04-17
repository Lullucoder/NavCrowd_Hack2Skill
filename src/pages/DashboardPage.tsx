import { Activity, AlertTriangle, Clock, Users } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { AiInsightsPanel } from '../components/AiInsightsPanel'
import { AlertBanner } from '../components/AlertBanner'
import { ChatBot } from '../components/ChatBot'
import { HeatmapCanvas } from '../components/HeatmapCanvas'
import { StatsCard } from '../components/StatsCard'
import { ToastContainer, useToast } from '../components/Toast'
import { alertSeed, initialHeatZones, tickHeatZones } from '../data/mockData'

export const DashboardPage = () => {
  const [zones, setZones] = useState(initialHeatZones)
  const { toasts, addToast, removeToast } = useToast()

  useEffect(() => {
    // Welcome toast on mount
    addToast({
      type: 'success',
      title: 'Welcome to VenueFlow!',
      message: 'Real-time crowd monitoring is active',
      duration: 4000
    })
  }, [])

  useEffect(() => {
    const timer = window.setInterval(() => {
      setZones((current) => {
        const next = tickHeatZones(current)
        
        // Check for critical zones and show toast
        const criticalZones = next.filter((z) => z.level === 'critical')
        const prevCritical = current.filter((z) => z.level === 'critical')
        
        if (criticalZones.length > prevCritical.length) {
          const newCritical = criticalZones.find((z) => !prevCritical.some((p) => p.id === z.id))
          if (newCritical) {
            addToast({
              type: 'warning',
              title: 'Critical Zone Alert',
              message: `${newCritical.name} has reached critical capacity`,
              duration: 6000
            })
          }
        }
        
        return next
      })
    }, 8000)

    return () => window.clearInterval(timer)
  }, [addToast])

  const occupancy = useMemo(() => {
    const current = zones.reduce((sum, zone) => sum + zone.occupancy, 0)
    const capacity = zones.reduce((sum, zone) => sum + zone.capacity, 0)
    return Math.round((current / capacity) * 100)
  }, [zones])

  const highRiskZones = useMemo(() => zones.filter((zone) => zone.level === 'high' || zone.level === 'critical').length, [zones])

  return (
    <>
      <ToastContainer toasts={toasts} onClose={removeToast} />
      <div className="page-container">
        <header className="page-header animate-fadeIn">
          <h1 className="page-title">
            <span className="glow-text">Matchday Command Center</span>
          </h1>
          <p className="page-subtitle">Live fan-side overview of crowd flow, alerts, and assistance.</p>
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
            label="Zones At Risk"
            value={String(highRiskZones)}
            trend="Needs routing support"
            trendDirection="negative"
            icon={<AlertTriangle size={32} />}
            delay={100}
          />
          <StatsCard
            label="Avg Queue Wait"
            value="11 min"
            trend="-2 min with virtual queues"
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
            <HeatmapCanvas zones={zones} onRefresh={() => setZones((current) => tickHeatZones(current))} />
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
