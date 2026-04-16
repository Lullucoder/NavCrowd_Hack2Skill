import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import { useState } from 'react'
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

const storageKey = 'venueflow-auth-name'

interface AppShellProps {
  userName: string
  onLogout: () => void
}

const AppShell = ({ userName, onLogout }: AppShellProps) => (
  <div className="vf-shell">
    <Sidebar />
    <div className="vf-shell-main">
      <Navbar userName={userName} onLogout={onLogout} />
      <main className="vf-content">
        <Outlet />
      </main>
    </div>
  </div>
)

const getStoredUser = (): string | null => {
  const value = window.localStorage.getItem(storageKey)
  return value?.trim() ? value : null
}

function App() {
  const [userName, setUserName] = useState<string | null>(getStoredUser)
  const isAuthenticated = Boolean(userName)

  const handleSignIn = (name: string) => {
    window.localStorage.setItem(storageKey, name)
    setUserName(name)
  }

  const handleLogout = () => {
    window.localStorage.removeItem(storageKey)
    setUserName(null)
  }

  return (
    <Routes>
      <Route
        path="/"
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LandingPage onSignIn={handleSignIn} />}
      />

      <Route
        element={
          isAuthenticated && userName ? <AppShell userName={userName} onLogout={handleLogout} /> : <Navigate to="/" replace />
        }
      >
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/queue" element={<QueuePage />} />
        <Route path="/food" element={<FoodOrderPage />} />
        <Route path="/navigation" element={<NavigationPage />} />
        <Route path="/parking" element={<ParkingPage />} />
        <Route path="/emergency" element={<EmergencyPage />} />
        <Route path="/admin" element={<AdminDashboardPage />} />
      </Route>

      <Route path="*" element={<Navigate to={isAuthenticated ? '/dashboard' : '/'} replace />} />
    </Routes>
  )
}

export default App
