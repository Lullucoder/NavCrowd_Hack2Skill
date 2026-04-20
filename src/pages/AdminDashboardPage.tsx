import { useEffect, useMemo, useState } from 'react'
import { AlertBanner } from '../components/AlertBanner'
import { HeatmapCanvas } from '../components/HeatmapCanvas'
import { StatsCard } from '../components/StatsCard'
import { alertSeed, initialHeatZones, queueStallsSeed, tickHeatZones } from '../data/mockData'
import {
  callGoogleOpsFunction,
  getGoogleClientServiceSnapshot,
  initializeGoogleClientServices,
  refreshGoogleRemoteConfig,
  requestGooglePushToken,
  trackGoogleEvent
} from '../services/googleServices'
import type { AlertItem } from '../types'

const isAlertItem = (value: unknown): value is AlertItem => {
  if (!value || typeof value !== 'object') {
    return false
  }

  const alert = value as Record<string, unknown>
  return (
    typeof alert.id === 'string' &&
    typeof alert.title === 'string' &&
    typeof alert.message === 'string' &&
    typeof alert.severity === 'string' &&
    typeof alert.createdAt === 'string'
  )
}

interface GoogleStatusResponse {
  generatedAt: string
  runtime: {
    cloudRunService: string
    cloudRunRevision: string
    regionHint: string
  }
  services: Record<
    string,
    {
      status: 'configured' | 'fallback'
      purpose: string
      detail?: string
      model?: string
      serviceId?: string
    }
  >
}

const toServiceLabel = (key: string) =>
  key
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[_-]/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase())

export const AdminDashboardPage = () => {
  const [zones, setZones] = useState(initialHeatZones)
  const [alerts, setAlerts] = useState<AlertItem[]>(alertSeed)
  const [googleStatus, setGoogleStatus] = useState<GoogleStatusResponse | null>(null)
  const [clientGoogleStatus, setClientGoogleStatus] = useState(getGoogleClientServiceSnapshot())
  const [googleStatusError, setGoogleStatusError] = useState<string | null>(null)
  const [isGoogleStatusLoading, setIsGoogleStatusLoading] = useState(false)
  const [isBroadcasting, setIsBroadcasting] = useState(false)
  const [pushStatusMessage, setPushStatusMessage] = useState<string | null>(null)
  const [remoteConfigMessage, setRemoteConfigMessage] = useState<string | null>(null)
  const [functionsMessage, setFunctionsMessage] = useState<string | null>(null)
  const [clientSdkMessage, setClientSdkMessage] = useState<string | null>(null)
  const [isClientSdkInitializing, setIsClientSdkInitializing] = useState(false)
  const [hasAttemptedClientSdkInit, setHasAttemptedClientSdkInit] = useState(false)

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

  const configuredClientServices = useMemo(
    () => Object.values(clientGoogleStatus.services).filter((service) => service.status === 'configured').length,
    [clientGoogleStatus]
  )

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

  useEffect(() => {
    let cancelled = false

    const syncAlerts = async () => {
      try {
        const response = await fetch('/api/alerts')
        if (!response.ok) {
          return
        }

        const payload = (await response.json()) as { alerts?: unknown }
        const syncedAlerts = Array.isArray(payload.alerts) ? payload.alerts.filter(isAlertItem) : []

        if (!cancelled && syncedAlerts.length) {
          setAlerts(syncedAlerts)
        }
      } catch {
        // Keep current alerts when backend sync is unavailable.
      }
    }

    void syncAlerts()
    const timerId = window.setInterval(() => {
      void syncAlerts()
    }, 10000)

    return () => {
      cancelled = true
      window.clearInterval(timerId)
    }
  }, [])

  const issueBroadcast = async () => {
    if (isBroadcasting) {
      return
    }

    setIsBroadcasting(true)

    const fallbackAlert: AlertItem = {
      id: crypto.randomUUID(),
      title: 'Ops Advisory',
      message: 'Deploy two staff members to Concourse C to reduce queue pressure.',
      severity: 'warning',
      createdAt: new Date().toISOString()
    }

    try {
      const response = await fetch('/api/alerts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: fallbackAlert.title,
          message: fallbackAlert.message,
          severity: fallbackAlert.severity
        })
      })

      if (!response.ok) {
        throw new Error('Unable to broadcast advisory')
      }

      const persistedAlert = (await response.json()) as AlertItem
      setAlerts((current) => [persistedAlert, ...current.filter((alert) => alert.id !== persistedAlert.id)])
    } catch {
      setAlerts((current) => [fallbackAlert, ...current])
    } finally {
      setIsBroadcasting(false)
    }
  }

  const ensureClientGoogleSdkReady = async () => {
    if (hasAttemptedClientSdkInit || isClientSdkInitializing) {
      return
    }

    setIsClientSdkInitializing(true)
    setClientSdkMessage(null)

    try {
      await initializeGoogleClientServices()
      setClientGoogleStatus(getGoogleClientServiceSnapshot())
      setClientSdkMessage('Client Google SDK initialization attempted. Configure VITE_FIREBASE_* env values for full activation.')
      setHasAttemptedClientSdkInit(true)
    } catch {
      setClientSdkMessage('Client Google SDK initialization failed. Check Firebase env values and try again.')
      setHasAttemptedClientSdkInit(false)
    } finally {
      setIsClientSdkInitializing(false)
    }
  }

  const handleEnablePush = async () => {
    await ensureClientGoogleSdkReady()

    const result = await requestGooglePushToken()
    setPushStatusMessage(result.detail)
    trackGoogleEvent('google_push_token_attempt', {
      success: result.ok,
      tokenReceived: Boolean(result.token)
    })
    setClientGoogleStatus(getGoogleClientServiceSnapshot())
  }

  const handleRefreshRemoteConfig = async () => {
    await ensureClientGoogleSdkReady()

    const result = await refreshGoogleRemoteConfig()
    setRemoteConfigMessage(result.detail)
    trackGoogleEvent('google_remote_config_refresh', {
      success: result.ok
    })
    setClientGoogleStatus(getGoogleClientServiceSnapshot())
  }

  const handleCallablePing = async () => {
    await ensureClientGoogleSdkReady()

    const result = await callGoogleOpsFunction({
      sourcePage: 'admin-dashboard'
    })

    setFunctionsMessage(result.detail)
    trackGoogleEvent('google_callable_function_ping', {
      success: result.ok
    })
    setClientGoogleStatus(getGoogleClientServiceSnapshot())
  }

  const latestAlert = alerts[0] ?? {
    id: 'fallback-alert',
    title: 'No Alerts Yet',
    message: 'Live advisory feed is currently clear.',
    severity: 'info' as const,
    createdAt: new Date().toISOString()
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
            <p>Live integration checks for Gemini, Firebase, Cloud Run, Maps readiness, and client SDK services.</p>
          </div>
          <button className="btn btn-secondary" onClick={() => void fetchGoogleStatus()} disabled={isGoogleStatusLoading}>
            {isGoogleStatusLoading ? 'Refreshing...' : 'Refresh Status'}
          </button>
        </div>

        {googleStatus ? (
          <>
            <div className="vf-google-status-grid">
              {Object.entries(googleStatus.services).map(([key, service]) => (
                <article key={key} className="vf-google-status-card">
                  <p className="vf-muted">{toServiceLabel(key)}</p>
                  <strong>{service.status}</strong>
                  <p className="vf-muted">{service.detail || service.model || service.serviceId || service.purpose}</p>
                </article>
              ))}
            </div>

            <p className="vf-inline-note">
              Backend services configured: {configuredServices}/{Object.keys(googleStatus.services).length}. Runtime target: {googleStatus.runtime.cloudRunService} ({googleStatus.runtime.regionHint})
            </p>
          </>
        ) : null}

        <div className="vf-google-status-grid">
          {Object.entries(clientGoogleStatus.services).map(([key, service]) => (
            <article key={`client-${key}`} className="vf-google-status-card">
              <p className="vf-muted">Client {toServiceLabel(key)}</p>
              <strong>{service.status}</strong>
              <p className="vf-muted">{service.detail || service.purpose}</p>
            </article>
          ))}
        </div>

        <p className="vf-inline-note">
          Client services configured: {configuredClientServices}/{Object.keys(clientGoogleStatus.services).length}.
        </p>

        <div className="vf-admin-actions">
          <button
            className="btn btn-secondary"
            onClick={() => void ensureClientGoogleSdkReady()}
            disabled={isClientSdkInitializing || hasAttemptedClientSdkInit}
          >
            {isClientSdkInitializing ? 'Initializing Client SDK...' : hasAttemptedClientSdkInit ? 'Client SDK Initialized' : 'Initialize Client Google SDK'}
          </button>
        </div>

        <div className="vf-admin-actions">
          <button className="btn btn-secondary" onClick={() => void handleEnablePush()}>
            Enable Push Token (FCM)
          </button>
          <button className="btn btn-secondary" onClick={() => void handleRefreshRemoteConfig()}>
            Refresh Remote Config
          </button>
          <button className="btn btn-secondary" onClick={() => void handleCallablePing()}>
            Ping Cloud Function
          </button>
        </div>

        {pushStatusMessage ? <p className="vf-muted">Push: {pushStatusMessage}</p> : null}
        {remoteConfigMessage ? <p className="vf-muted">Remote Config: {remoteConfigMessage}</p> : null}
        {functionsMessage ? <p className="vf-muted">Cloud Function: {functionsMessage}</p> : null}
        {clientSdkMessage ? <p className="vf-muted">Client SDK: {clientSdkMessage}</p> : null}

        {googleStatusError ? <p className="vf-muted">{googleStatusError}</p> : null}
      </section>

      <div className="vf-section-space" />
      <section className="vf-admin-actions">
        <button className="btn btn-primary" onClick={() => void issueBroadcast()} disabled={isBroadcasting}>
          {isBroadcasting ? 'Broadcasting...' : 'Broadcast Advisory'}
        </button>
        <button className="btn btn-secondary" onClick={() => setZones((current) => tickHeatZones(current))}>
          Recalculate Heatmap
        </button>
      </section>

      <div className="vf-section-space" />
      <AlertBanner title={latestAlert.title} message={latestAlert.message} severity={latestAlert.severity} />

      <div className="vf-section-space" />
      <HeatmapCanvas zones={zones} onRefresh={() => setZones((current) => tickHeatZones(current))} />
    </div>
  )
}
