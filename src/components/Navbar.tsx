import { Bell, LogOut, Radar, Sparkles } from 'lucide-react'
import { useEffect, useState } from 'react'

interface NavbarProps {
  userName: string
  onLogout: () => void
}

export const Navbar = ({ userName, onLogout }: NavbarProps) => {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const timerId = window.setInterval(() => {
      setNow(new Date())
    }, 30000)

    return () => window.clearInterval(timerId)
  }, [])

  return (
    <header className="vf-navbar glass-card-static animate-slideDown">
      <div className="vf-navbar-title">
        <Radar size={18} className="animate-glow" style={{ color: 'var(--accent-blue)' }} />
        <span>VenueFlow Live</span>
      </div>

      <div className="vf-navbar-meta">
        <div className="vf-live-group hover-lift">
          <span className="live-dot" aria-hidden="true" />
          <span>Live</span>
        </div>

        <div className="vf-clock">{now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>

        <button className="btn btn-ghost vf-icon-btn hover-lift" aria-label="Notifications">
          <Bell size={18} />
        </button>

        <div className="vf-user-pill hover-lift" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Sparkles size={14} style={{ color: 'var(--accent-blue)' }} />
          {userName}
        </div>

        <button className="btn btn-secondary hover-lift" onClick={onLogout}>
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </header>
  )
}
