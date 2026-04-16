import { useEffect, useMemo, useState } from 'react'
import { AiInsightsPanel } from '../components/AiInsightsPanel'
import { AlertBanner } from '../components/AlertBanner'
import { ChatBot } from '../components/ChatBot'
import { HeatmapCanvas } from '../components/HeatmapCanvas'
import { StatsCard } from '../components/StatsCard'
import { alertSeed, initialHeatZones, tickHeatZones } from '../data/mockData'

export const DashboardPage = () => {
  const [zones, setZones] = useState(initialHeatZones)

  useEffect(() => {
    const timer = window.setInterval(() => {
      setZones((current) => tickHeatZones(current))
    }, 8000)

    return () => window.clearInterval(timer)
  }, [])

  const occupancy = useMemo(() => {
    const current = zones.reduce((sum, zone) => sum + zone.occupancy, 0)
    const capacity = zones.reduce((sum, zone) => sum + zone.capacity, 0)
    return Math.round((current / capacity) * 100)
  }, [zones])

  const highRiskZones = useMemo(() => zones.filter((zone) => zone.level === 'high' || zone.level === 'critical').length, [zones])

  return (
    <div className="page-container">
      <header className="page-header">
        <h1 className="page-title">Matchday Command Center</h1>
        <p className="page-subtitle">Live fan-side overview of crowd flow, alerts, and assistance.</p>
      </header>

      <section className="grid-4">
        <StatsCard label="Live Occupancy" value={`${occupancy}%`} trend="+4.1% from 10 minutes ago" />
        <StatsCard label="Zones At Risk" value={String(highRiskZones)} trend="Needs routing support" trendDirection="negative" />
        <StatsCard label="Avg Queue Wait" value="11 min" trend="-2 min with virtual queues" />
        <StatsCard label="Active Alerts" value={String(alertSeed.length)} trend="No critical emergency" />
      </section>

      <div className="vf-section-space" />
      <AlertBanner title={alertSeed[0].title} message={alertSeed[0].message} severity={alertSeed[0].severity} />

      <div className="vf-section-space" />
      <section className="vf-dashboard-grid">
        <HeatmapCanvas zones={zones} onRefresh={() => setZones((current) => tickHeatZones(current))} />
        <ChatBot />
      </section>

      <div className="vf-section-space" />
      <AiInsightsPanel />
    </div>
  )
}
