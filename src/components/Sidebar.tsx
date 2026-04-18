import { AlertTriangle, Gauge, LayoutDashboard, MapPinned, ShieldAlert, Sparkles, UtensilsCrossed, Waypoints } from 'lucide-react'
import { NavLink } from 'react-router-dom'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/queue', label: 'Virtual Queue', icon: Gauge },
  { to: '/food', label: 'Food Order', icon: UtensilsCrossed },
  { to: '/navigation', label: 'Navigation', icon: Waypoints },
  { to: '/parking', label: 'Parking', icon: MapPinned },
  { to: '/emergency', label: 'Emergency', icon: AlertTriangle },
  { to: '/admin', label: 'Admin', icon: ShieldAlert }
]

export const Sidebar = () => (
  <aside className="vf-sidebar gradient-border animate-slideUp">
    <div className="vf-sidebar-brand" style={{ position: 'relative' }}>
      <div className="vf-brand-logo hover-lift" style={{ position: 'relative' }}>
        <Sparkles size={20} className="animate-glow" style={{ color: 'white' }} />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 'var(--radius-md)',
            background: 'var(--gradient-primary)',
            opacity: 0.2,
            animation: 'pulse-glow 2s ease-in-out infinite'
          }}
        />
      </div>
      <div>
        <p className="vf-brand-title">NavCrowd</p>
        <p className="vf-brand-tagline">Crowd Intelligence Hub</p>
      </div>
    </div>

    <nav className="vf-sidebar-nav">
      {navItems.map((item, index) => {
        const Icon = item.icon

        return (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => (isActive ? 'vf-nav-link active' : 'vf-nav-link')}
            style={{
              animation: `fadeIn 0.3s ease-out ${index * 0.05}s both`
            }}
          >
            <Icon size={18} />
            <span>{item.label}</span>
          </NavLink>
        )
      })}
    </nav>

    <div
      style={{
        marginTop: 'auto',
        padding: 'var(--space-md)',
        borderRadius: 'var(--radius-md)',
        background: 'rgba(59, 130, 246, 0.1)',
        border: '1px solid rgba(59, 130, 246, 0.2)',
        fontSize: '0.75rem',
        color: 'var(--text-secondary)',
        animation: 'fadeIn 0.5s ease-out 0.5s both'
      }}
    >
      <p style={{ fontWeight: 600, marginBottom: '4px', color: 'var(--text-primary)' }}>Live Ops Feed</p>
      <p>Telemetry refreshes every 5 seconds across crowd, route, and safety modules.</p>
    </div>
  </aside>
)
