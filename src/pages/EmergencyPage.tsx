import { useMemo, useState } from 'react'
import { AlertBanner } from '../components/AlertBanner'
import { EmergencyPanel } from '../components/EmergencyPanel'
import { alertSeed } from '../data/mockData'
import type { AlertItem } from '../types'

export const EmergencyPage = () => {
  const [alerts, setAlerts] = useState<AlertItem[]>(alertSeed)

  const criticalAlert = useMemo(() => alerts.find((alert) => alert.severity === 'critical') ?? null, [alerts])

  const triggerSos = () => {
    setAlerts((current) => [
      {
        id: crypto.randomUUID(),
        title: 'SOS Triggered',
        message: 'Medical support dispatched to Section B lower concourse.',
        severity: 'critical',
        createdAt: new Date().toISOString()
      },
      ...current
    ])
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
      <EmergencyPanel activeAlert={criticalAlert} onSos={triggerSos} />

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
