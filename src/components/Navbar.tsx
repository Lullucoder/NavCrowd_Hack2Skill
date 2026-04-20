import { Bell, LogOut, Radar, Sparkles } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

interface NavbarProps {
  userName: string
  onLogout: () => void
}

export const Navbar = ({ userName, onLogout }: NavbarProps) => {
  const [now, setNow] = useState(() => new Date())
  const [showNotifications, setShowNotifications] = useState(false)
  const notificationPanelRef = useRef<HTMLDivElement | null>(null)
  const notificationsPanelId = 'vf-navbar-notifications-panel'

  const notificationItems = [
    'North concourse is trending busy. Suggested reroute active.',
    'Queue wait at Food Court 2 dropped below 6 minutes.',
    'Security team confirms all emergency exits are clear.'
  ]

  useEffect(() => {
    const timerId = window.setInterval(() => {
      setNow(new Date())
    }, 30000)

    return () => window.clearInterval(timerId)
  }, [])

  useEffect(() => {
    if (!showNotifications) {
      return
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (notificationPanelRef.current && !notificationPanelRef.current.contains(event.target as Node)) {
        setShowNotifications(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showNotifications])

  return (
    <header className="vf-navbar glass-card-static animate-slideDown">
      <div className="vf-navbar-title">
        <Radar size={18} className="animate-glow" style={{ color: 'var(--accent-blue)' }} />
        <span>NavCrowd Live</span>
      </div>

      <div className="vf-navbar-meta">
        <div className="vf-live-group hover-lift">
          <span className="live-dot" aria-hidden="true" />
          <span>Live</span>
        </div>

        <div className="vf-clock">{now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>

        <div className="vf-notification-wrap" ref={notificationPanelRef}>
          <button
            className="btn btn-ghost vf-icon-btn hover-lift"
            aria-label="Notifications"
            aria-expanded={showNotifications}
            aria-haspopup="dialog"
            aria-controls={notificationsPanelId}
            onClick={() => setShowNotifications((current) => !current)}
          >
            <Bell size={18} />
            <span className="vf-notification-badge" aria-hidden="true" />
          </button>

          {showNotifications ? (
            <div id={notificationsPanelId} className="vf-notification-panel" role="dialog" aria-label="Live alerts">
              <p className="vf-notification-title">Live alerts</p>
              <div className="vf-notification-list">
                {notificationItems.map((item) => (
                  <p key={item} className="vf-notification-item">
                    {item}
                  </p>
                ))}
              </div>
            </div>
          ) : null}
        </div>

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
