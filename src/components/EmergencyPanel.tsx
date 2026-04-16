import { AlertOctagon, Siren } from 'lucide-react'
import type { AlertItem } from '../types'

interface EmergencyPanelProps {
  activeAlert: AlertItem | null
  onSos: () => void
}

export const EmergencyPanel = ({ activeAlert, onSos }: EmergencyPanelProps) => (
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

    <button className="btn btn-danger btn-lg" onClick={onSos}>
      <AlertOctagon size={18} />
      Trigger SOS
    </button>
  </section>
)
