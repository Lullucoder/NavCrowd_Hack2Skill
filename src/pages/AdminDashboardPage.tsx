import { useEffect, useMemo, useState } from 'react'
import { AlertBanner } from '../components/AlertBanner'
import { HeatmapCanvas } from '../components/HeatmapCanvas'
import { StatsCard } from '../components/StatsCard'
import { alertSeed, initialHeatZones, queueStallsSeed, tickHeatZones } from '../data/mockData'
import type { AlertItem } from '../types'

interface GoogleStatusResponse {
  generatedAt: string
  runtime: {
    cloudRunService: string
    cloudRunRevision: string
    regionHint: string
  }
  services: {
    geminiApi: {
      status: 'configured' | 'fallback'
      model: string
      purpose: string
    }
    firebaseHosting: {
      status: 'configured' | 'fallback'
      purpose: string
    }
    cloudRun: {
      status: 'configured' | 'fallback'
      serviceId: string
      purpose: string
    }
  }
}

export const AdminDashboardPage = () => {
  const [zones, setZones] = useState(initialHeatZones)
  const [alerts, setAlerts] = useState<AlertItem[]>(alertSeed)
  const [googleStatus, setGoogleStatus] = useState<GoogleStatusResponse | null>(null)
  const [googleStatusError, setGoogleStatusError] = useState<string | null>(null)
  const [isGoogleStatusLoading, setIsGoogleStatusLoading] = useState(false)

  const attendance = useMemo(() => zones.reduce((sum, zone) => sum + zone.occupancy, 0), [zones])
  const averageWait = useMemo(
    () => Math.round(queueStallsSeed.reduce((sum, stall) => sum + stall.avgWaitMinutes, 0) / queueStallsSeed.length),
    []
  )

  const configuredServices = useMemo(() => {
    if (!googleStatus) {
      return 0
    }

    return Object.values(googleStatus.services).filter((service) => service.status === 'configured').length
  }, [googleStatus])

  const fetchGoogleStatus = async () => {
    setIsGoogleStatusLoading(true)
    setGoogleStatusError(null)

    try {
      const response = await fetch('/api/google/status')
      if (!response.ok) {
        throw new Error('Google services status unavailable')
      }

      const payload = (await response.json()) as GoogleStatusResponse
      setGoogleStatus(payload)
    } catch {
      setGoogleStatusError('Could not fetch Google service status from backend.')
    } finally {
      setIsGoogleStatusLoading(false)
    }
  }

  useEffect(() => {
    void fetchGoogleStatus()
  }, [])

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
      <section className="glass-card vf-google-services-panel" aria-live="polite">
        <div className="vf-panel-head">
          <div>
            <h3>Google Services Health</h3>
            <p>Live integration checks for Gemini, Firebase Hosting, and Cloud Run.</p>
          </div>
          <button className="btn btn-secondary" onClick={() => void fetchGoogleStatus()} disabled={isGoogleStatusLoading}>
            {isGoogleStatusLoading ? 'Refreshing...' : 'Refresh Status'}
          </button>
        </div>

        {googleStatus ? (
          <>
            <div className="vf-google-status-grid">
              <article className="vf-google-status-card">
                <p className="vf-muted">Gemini API</p>
                <strong>{googleStatus.services.geminiApi.status}</strong>
                <p className="vf-muted">{googleStatus.services.geminiApi.model}</p>
              </article>
              <article className="vf-google-status-card">
                <p className="vf-muted">Firebase Hosting</p>
                <strong>{googleStatus.services.firebaseHosting.status}</strong>
                <p className="vf-muted">Public SPA delivery + rewrites</p>
              </article>
              <article className="vf-google-status-card">
                <p className="vf-muted">Cloud Run</p>
                <strong>{googleStatus.services.cloudRun.status}</strong>
                <p className="vf-muted">Service: {googleStatus.services.cloudRun.serviceId}</p>
              </article>
            </div>

            <p className="vf-inline-note">
              {configuredServices}/3 services configured. Runtime target: {googleStatus.runtime.cloudRunService} ({googleStatus.runtime.regionHint})
            </p>
          </>
        ) : null}

        {googleStatusError ? <p className="vf-muted">{googleStatusError}</p> : null}
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
