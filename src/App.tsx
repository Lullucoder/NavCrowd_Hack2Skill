import { Link, Navigate, Outlet, Route, Routes } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Navbar } from './components/Navbar'
import { Sidebar } from './components/Sidebar'
import { AdminDashboardPage } from './pages/AdminDashboardPage'
import { DashboardPage } from './pages/DashboardPage'
import { EmergencyPage } from './pages/EmergencyPage'
import { FoodOrderPage } from './pages/FoodOrderPage'
import { LandingPage } from './pages/LandingPage'
import { NavigationPage } from './pages/NavigationPage'
import { ParkingPage } from './pages/ParkingPage'
import { QueuePage } from './pages/QueuePage'
import {
  logGoogleAuditRecord,
  signInWithGoogleAnonymousSession,
  trackGoogleEvent
} from './services/googleServices'
import type { AlertItem, SportType, UserTicketProfile } from './types'

const storageKey = 'navcrowd-auth-session'
const legacyStorageKey = 'navcrowd-auth-name'
const seatStorageKey = 'navcrowd-seat-number'

const normalizeSeatNumber = (seatNumber: string) => seatNumber.replace(/\s+/g, '').toUpperCase()

const isSportType = (value: string): value is SportType => value === 'Cricket' || value === 'Football'

const isUserTicketProfile = (value: unknown): value is UserTicketProfile => {
  if (!value || typeof value !== 'object') {
    return false
  }

  const profile = value as Record<string, unknown>
  return (
    typeof profile.name === 'string' &&
    typeof profile.ticketNumber === 'string' &&
    typeof profile.seatNumber === 'string' &&
    typeof profile.sport === 'string' &&
    isSportType(profile.sport)
  )
}

interface AppShellProps {
  userName: string
  activeSosAlert: AlertItem | null
  onDismissSos: () => void
  onLogout: () => void
}

const AppShell = ({ userName, activeSosAlert, onDismissSos, onLogout }: AppShellProps) => (
  <div className="vf-shell">
    <a className="vf-skip-link" href="#main-content">
      Skip to main content
    </a>
    <Sidebar />
    <div className="vf-shell-main">
      <Navbar userName={userName} onLogout={onLogout} />

      {activeSosAlert ? (
        <section className="vf-global-sos-banner" role="alert" aria-live="assertive">
          <div className="vf-global-sos-copy">
            <p className="vf-global-sos-kicker">SOS Broadcast Active</p>
            <p>{activeSosAlert.message}</p>
            <p className="vf-muted">
              Triggered at {new Date(activeSosAlert.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>

          <div className="vf-global-sos-actions">
            <Link to="/emergency" className="btn btn-danger">
              Open Emergency
            </Link>
            <button type="button" className="btn btn-ghost" onClick={onDismissSos}>
              Dismiss
            </button>
          </div>
        </section>
      ) : null}

      <main id="main-content" className="vf-content" tabIndex={-1}>
        <Outlet />
      </main>
    </div>
  </div>
)

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

const pickLatestSosAlert = (alerts: AlertItem[]) => {
  const criticalAlerts = alerts.filter((alert) => alert.severity === 'critical')
  if (!criticalAlerts.length) {
    return null
  }

  const sosByTitle = criticalAlerts.find((alert) => /sos|emergency|medical/i.test(`${alert.title} ${alert.message}`))
  if (sosByTitle) {
    return sosByTitle
  }

  return criticalAlerts[0]
}

const getStoredSession = (): UserTicketProfile | null => {
  const value = window.localStorage.getItem(storageKey)

  if (value) {
    try {
      const parsed = JSON.parse(value) as unknown
      if (isUserTicketProfile(parsed)) {
        return {
          ...parsed,
          name: parsed.name.trim() || 'Guest Fan',
          ticketNumber: parsed.ticketNumber.trim(),
          seatNumber: normalizeSeatNumber(parsed.seatNumber),
          sport: parsed.sport
        }
      }
    } catch {
      window.localStorage.removeItem(storageKey)
    }
  }

  const legacyName = window.localStorage.getItem(legacyStorageKey)
  if (legacyName?.trim()) {
    const legacySeat = window.localStorage.getItem(seatStorageKey)
    return {
      name: legacyName.trim(),
      ticketNumber: 'WALK-IN',
      seatNumber: normalizeSeatNumber(legacySeat ?? 'B-127'),
      sport: 'Cricket'
    }
  }

  return null
}

function App() {
  const [session, setSession] = useState<UserTicketProfile | null>(getStoredSession)
  const [activeSosAlert, setActiveSosAlert] = useState<AlertItem | null>(null)
  const [dismissedSosId, setDismissedSosId] = useState<string | null>(null)
  const isAuthenticated = Boolean(session)
  const visibleSosAlert = activeSosAlert && activeSosAlert.id !== dismissedSosId ? activeSosAlert : null

  useEffect(() => {
    if (!isAuthenticated) {
      setActiveSosAlert(null)
      return
    }

    let cancelled = false

    const syncAlerts = async () => {
      try {
        const response = await fetch('/api/alerts')
        if (!response.ok) {
          return
        }

        const payload = (await response.json()) as { alerts?: unknown }
        const alertList = Array.isArray(payload.alerts) ? payload.alerts.filter(isAlertItem) : []
        const nextSosAlert = pickLatestSosAlert(alertList)

        if (!cancelled) {
          setActiveSosAlert(nextSosAlert)
        }
      } catch {
        // Keep existing alert state when sync fails.
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
  }, [isAuthenticated])

  const handleSignIn = (profile: UserTicketProfile) => {
    const normalizedProfile: UserTicketProfile = {
      ...profile,
      name: profile.name.trim() || 'Guest Fan',
      ticketNumber: profile.ticketNumber.trim(),
      seatNumber: normalizeSeatNumber(profile.seatNumber),
      sport: profile.sport
    }

    window.localStorage.setItem(storageKey, JSON.stringify(normalizedProfile))
    window.localStorage.setItem(seatStorageKey, normalizedProfile.seatNumber)
    window.localStorage.removeItem(legacyStorageKey)
    setSession(normalizedProfile)

    void (async () => {
      await signInWithGoogleAnonymousSession()
      trackGoogleEvent('navcrowd_sign_in', {
        sport: normalizedProfile.sport,
        seat: normalizedProfile.seatNumber
      })

      await logGoogleAuditRecord('session_events', {
        eventType: 'sign_in',
        userName: normalizedProfile.name,
        ticketNumber: normalizedProfile.ticketNumber,
        seatNumber: normalizedProfile.seatNumber,
        sport: normalizedProfile.sport
      })
    })()
  }

  const handleLogout = () => {
    if (session) {
      trackGoogleEvent('navcrowd_logout', {
        sport: session.sport
      })
      void logGoogleAuditRecord('session_events', {
        eventType: 'logout',
        userName: session.name,
        seatNumber: session.seatNumber,
        sport: session.sport
      })
    }

    window.localStorage.removeItem(storageKey)
    window.localStorage.removeItem(legacyStorageKey)
    setActiveSosAlert(null)
    setDismissedSosId(null)
    setSession(null)
  }

  const handleSosDismiss = () => {
    if (!activeSosAlert) {
      return
    }
    setDismissedSosId(activeSosAlert.id)
  }

  const handleSosBroadcast = (alert: AlertItem) => {
    setDismissedSosId(null)
    setActiveSosAlert(alert)
  }

  return (
    <Routes>
      <Route
        path="/"
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LandingPage onSignIn={handleSignIn} />}
      />

      <Route
        element={
          isAuthenticated && session ? (
            <AppShell
              userName={session.name}
              activeSosAlert={visibleSosAlert}
              onDismissSos={handleSosDismiss}
              onLogout={handleLogout}
            />
          ) : (
            <Navigate to="/" replace />
          )
        }
      >
        <Route path="/dashboard" element={session ? <DashboardPage ticketProfile={session} /> : <Navigate to="/" replace />} />
        <Route path="/queue" element={<QueuePage />} />
        <Route path="/food" element={<FoodOrderPage />} />
        <Route path="/navigation" element={<NavigationPage />} />
        <Route path="/parking" element={<ParkingPage />} />
        <Route path="/emergency" element={<EmergencyPage onSosBroadcast={handleSosBroadcast} />} />
        <Route path="/admin" element={<AdminDashboardPage />} />
      </Route>

      <Route path="*" element={<Navigate to={isAuthenticated ? '/dashboard' : '/'} replace />} />
    </Routes>
  )
}

export default App
