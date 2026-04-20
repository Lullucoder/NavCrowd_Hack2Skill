import { AlertOctagon, Siren } from 'lucide-react'
import type { AlertItem } from '../types'

interface EmergencyPanelProps {
  activeAlert: AlertItem | null
  onSos: () => void | Promise<void>
  isTriggeringSos?: boolean
}

export const EmergencyPanel = ({ activeAlert, onSos, isTriggeringSos = false }: EmergencyPanelProps) => (
  <section className="glass-card vf-emergency-panel">
    <div className="vf-panel-head">
      <div>
        <h3>Emergency Response</h3>
        <p>Use SOS only for immediate assistance.</p>
      </div>
      <Siren size={20} className="heat-high" />
    </div>

    {activeAlert ? (
      <div className="vf-active-alert">
        <p className="vf-alert-title">{activeAlert.title}</p>
        <p>{activeAlert.message}</p>
      </div>
    ) : (
      <p className="vf-muted">No active critical alert right now.</p>
    )}

    <p className="vf-muted">Broadcast goes to connected dashboards, including mobile layouts.</p>

    <button className="btn btn-danger btn-lg" onClick={onSos} disabled={isTriggeringSos}>
      <AlertOctagon size={18} />
      {isTriggeringSos ? 'Broadcasting SOS...' : 'Trigger SOS'}
    </button>
  </section>
)
