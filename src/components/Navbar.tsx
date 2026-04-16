import { Bell, LogOut, Radar } from 'lucide-react'
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
    <header className="vf-navbar glass-card">
      <div className="vf-navbar-title">
        <Radar size={18} />
        <span>VenueFlow Live</span>
      </div>

      <div className="vf-navbar-meta">
        <div className="vf-live-group">
          <span className="live-dot" aria-hidden="true" />
          <span>Live</span>
        </div>

        <div className="vf-clock">{now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>

        <button className="btn btn-ghost vf-icon-btn" aria-label="Notifications">
          <Bell size={18} />
        </button>

        <div className="vf-user-pill">{userName}</div>

        <button className="btn btn-secondary" onClick={onLogout}>
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </header>
  )
}
