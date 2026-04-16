import { AlertTriangle, Info, Siren } from 'lucide-react'

interface AlertBannerProps {
  title: string
  message: string
  severity: 'info' | 'warning' | 'critical'
}

export const AlertBanner = ({ title, message, severity }: AlertBannerProps) => {
  const icon =
    severity === 'critical' ? <Siren size={18} /> : severity === 'warning' ? <AlertTriangle size={18} /> : <Info size={18} />

  return (
    <div className={`vf-alert-banner ${severity}`} role="status">
      <div className="vf-alert-icon">{icon}</div>
      <div>
        <p className="vf-alert-title">{title}</p>
        <p className="vf-alert-message">{message}</p>
      </div>
    </div>
  )
}
