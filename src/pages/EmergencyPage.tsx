import { useEffect, useMemo, useState } from 'react'
import { AlertBanner } from '../components/AlertBanner'
import { EmergencyPanel } from '../components/EmergencyPanel'
import { alertSeed } from '../data/mockData'
import { logGoogleAuditRecord, trackGoogleEvent } from '../services/googleServices'
import type { AlertItem } from '../types'

interface EmergencyPageProps {
  onSosBroadcast?: (alert: AlertItem) => void
}

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

export const EmergencyPage = ({ onSosBroadcast }: EmergencyPageProps) => {
  const [alerts, setAlerts] = useState<AlertItem[]>(alertSeed)
  const [isTriggeringSos, setIsTriggeringSos] = useState(false)

  const criticalAlert = useMemo(() => alerts.find((alert) => alert.severity === 'critical') ?? null, [alerts])

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
        // Keep local alerts when endpoint is unavailable.
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

  const triggerSos = async () => {
    if (isTriggeringSos) {
      return
    }

    setIsTriggeringSos(true)

    const seat = window.localStorage.getItem('navcrowd-seat-number') ?? 'B-127'
    const fallbackAlert: AlertItem = {
      id: crypto.randomUUID(),
      title: 'SOS Triggered',
      message: `Medical support dispatched. Fan assistance requested at seat ${seat}.`,
      severity: 'critical',
      createdAt: new Date().toISOString()
    }

    try {
      const response = await fetch('/api/alerts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: 'SOS Triggered',
          message: fallbackAlert.message,
          severity: 'critical'
        })
      })

      if (!response.ok) {
        throw new Error('Unable to broadcast SOS right now')
      }

      const persistedAlert = (await response.json()) as AlertItem
      setAlerts((current) => [persistedAlert, ...current.filter((alert) => alert.id !== persistedAlert.id)])
      onSosBroadcast?.(persistedAlert)

      trackGoogleEvent('navcrowd_sos_triggered', {
        seat,
        channel: 'api'
      })

      void logGoogleAuditRecord('emergency_events', {
        eventType: 'sos_triggered',
        seat,
        alertId: persistedAlert.id,
        severity: persistedAlert.severity
      })
    } catch {
      setAlerts((current) => [fallbackAlert, ...current])
      onSosBroadcast?.(fallbackAlert)

      trackGoogleEvent('navcrowd_sos_triggered', {
        seat,
        channel: 'fallback'
      })

      void logGoogleAuditRecord('emergency_events', {
        eventType: 'sos_triggered_fallback',
        seat,
        alertId: fallbackAlert.id,
        severity: fallbackAlert.severity
      })
    } finally {
      setIsTriggeringSos(false)
    }
  }

  return (
    <div className="page-container">
      <header className="page-header">
        <h1 className="page-title">Emergency and Safety</h1>
        <p className="page-subtitle">Critical alerts, evacuation guidance, and direct SOS support.</p>
      </header>

      {criticalAlert ? (
        <AlertBanner title={criticalAlert.title} message={criticalAlert.message} severity={criticalAlert.severity} />
      ) : (
        <AlertBanner
          title="Safety Status Normal"
          message="No active critical incident. Stay aware of route signage."
          severity="info"
        />
      )}

      <div className="vf-section-space" />
      <EmergencyPanel activeAlert={criticalAlert} onSos={triggerSos} isTriggeringSos={isTriggeringSos} />

      <div className="vf-section-space" />
      <section className="glass-card vf-alert-history">
        <h3>Recent Alerts</h3>
        <div className="vf-alert-list">
          {alerts.map((alert) => (
            <article key={alert.id} className={`vf-alert-list-item ${alert.severity}`}>
              <p className="vf-alert-title">{alert.title}</p>
              <p>{alert.message}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
