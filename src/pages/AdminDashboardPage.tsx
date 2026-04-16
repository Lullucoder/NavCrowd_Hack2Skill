import { useMemo, useState } from 'react'
import { AlertBanner } from '../components/AlertBanner'
import { HeatmapCanvas } from '../components/HeatmapCanvas'
import { StatsCard } from '../components/StatsCard'
import { alertSeed, initialHeatZones, queueStallsSeed, tickHeatZones } from '../data/mockData'
import type { AlertItem } from '../types'

export const AdminDashboardPage = () => {
  const [zones, setZones] = useState(initialHeatZones)
  const [alerts, setAlerts] = useState<AlertItem[]>(alertSeed)

  const attendance = useMemo(() => zones.reduce((sum, zone) => sum + zone.occupancy, 0), [zones])
  const averageWait = useMemo(
    () => Math.round(queueStallsSeed.reduce((sum, stall) => sum + stall.avgWaitMinutes, 0) / queueStallsSeed.length),
    []
  )

  const issueBroadcast = () => {
    setAlerts((current) => [
      {
        id: crypto.randomUUID(),
        title: 'Ops Advisory',
        message: 'Deploy two staff members to Concourse C to reduce queue pressure.',
        severity: 'warning',
        createdAt: new Date().toISOString()
      },
      ...current
    ])
  }

  return (
    <div className="page-container">
      <header className="page-header">
        <h1 className="page-title">Admin Analytics Dashboard</h1>
        <p className="page-subtitle">Operations view for crowd, queues, alerts, and performance.</p>
      </header>

      <section className="grid-4">
        <StatsCard label="Total Attendance" value={attendance.toLocaleString()} trend="+6.2% vs kickoff" />
        <StatsCard label="Avg Wait Time" value={`${averageWait} min`} trend="Target under 10 min" trendDirection="negative" />
        <StatsCard label="Food Revenue" value="Rs 3.9L" trend="+11% halftime surge" />
        <StatsCard label="Active Alerts" value={String(alerts.length)} trend="Monitor warning states" />
      </section>

      <div className="vf-section-space" />
      <section className="vf-admin-actions">
        <button className="btn btn-primary" onClick={issueBroadcast}>
          Broadcast Advisory
        </button>
        <button className="btn btn-secondary" onClick={() => setZones((current) => tickHeatZones(current))}>
          Recalculate Heatmap
        </button>
      </section>

      <div className="vf-section-space" />
      <AlertBanner title={alerts[0].title} message={alerts[0].message} severity={alerts[0].severity} />

      <div className="vf-section-space" />
      <HeatmapCanvas zones={zones} onRefresh={() => setZones((current) => tickHeatZones(current))} />
    </div>
  )
}
