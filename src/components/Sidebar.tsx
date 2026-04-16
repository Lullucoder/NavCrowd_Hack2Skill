import { AlertTriangle, Gauge, LayoutDashboard, MapPinned, ShieldAlert, UtensilsCrossed, Waypoints } from 'lucide-react'
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
  <aside className="vf-sidebar gradient-border">
    <div className="vf-sidebar-brand">
      <div className="vf-brand-logo">VF</div>
      <div>
        <p className="vf-brand-title">VenueFlow</p>
        <p className="vf-brand-tagline">Your Stadium, Smarter</p>
      </div>
    </div>

    <nav className="vf-sidebar-nav">
      {navItems.map((item) => {
        const Icon = item.icon

        return (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => (isActive ? 'vf-nav-link active' : 'vf-nav-link')}
          >
            <Icon size={18} />
            <span>{item.label}</span>
          </NavLink>
        )
      })}
    </nav>
  </aside>
)
