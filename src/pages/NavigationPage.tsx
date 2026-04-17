import { ArrowRight, CheckCircle, MapPin, Navigation as NavigationIcon, Target, Zap } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { VenueMap } from '../components/VenueMap'
import { updateCrowdDataFromCCTV, venueBlueprint, venueCheckpoints } from '../data/venueBlueprint'
import type { NavigationRoute, VenueBlueprint, VenueCheckpoint } from '../types/venue'

export const NavigationPage = () => {
  const [blueprint, setBlueprint] = useState<VenueBlueprint>(venueBlueprint)
  const [fromCheckpoint, setFromCheckpoint] = useState<string>('cp-parking-a')
  const [toCheckpoint, setToCheckpoint] = useState<string>('cp-seating-n')
  const [activeRoute, setActiveRoute] = useState<NavigationRoute | null>(null)
  const [isNavigating, setIsNavigating] = useState(false)

  // Update crowd data from CCTV feeds every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setBlueprint((prev) => updateCrowdDataFromCCTV(prev))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const availableCheckpoints = useMemo(() => {
    return venueCheckpoints.filter((cp) => cp.type === 'waypoint' || cp.type === 'destination')
  }, [])

  const calculateRoute = () => {
    const from = venueCheckpoints.find((cp) => cp.id === fromCheckpoint)
    const to = venueCheckpoints.find((cp) => cp.id === toCheckpoint)

    if (!from || !to) return

    // Simple pathfinding - find intermediate checkpoints
    const route = findRoute(from, to, blueprint)

    if (route) {
      setActiveRoute({
        id: `route-${Date.now()}`,
        from,
        to,
        path: [],
        currentCheckpointIndex: 0,
        totalDistance: route.distance,
        estimatedTime: route.estimatedTime,
        checkpoints: route.checkpoints,
        status: 'active'
      })
      setIsNavigating(true)
    }
  }

  const handleReachCheckpoint = () => {
    if (!activeRoute) return

    if (activeRoute.currentCheckpointIndex < activeRoute.checkpoints.length - 1) {
      setActiveRoute({
        ...activeRoute,
        currentCheckpointIndex: activeRoute.currentCheckpointIndex + 1
      })
    } else {
      setActiveRoute({
        ...activeRoute,
        status: 'completed'
      })
      setIsNavigating(false)
    }
  }

  const handleCancelNavigation = () => {
    setActiveRoute(null)
    setIsNavigating(false)
  }

  const currentCheckpoint = activeRoute?.checkpoints[activeRoute.currentCheckpointIndex]
  const nextCheckpoint = activeRoute?.checkpoints[activeRoute.currentCheckpointIndex + 1]

  return (
    <div className="page-container">
      <header className="page-header animate-fadeIn">
        <h1 className="page-title">
          <NavigationIcon size={28} />
          <span className="glow-text">Smart Navigation</span>
        </h1>
        <p className="page-subtitle">AI-powered routing with real-time crowd avoidance using ML-processed CCTV feeds</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--space-lg)' }}>
        {/* Map Section */}
        <section className="glass-card-static animate-slideUp" style={{ padding: 'var(--space-lg)', animationDelay: '0.1s' }}>
          <div style={{ marginBottom: 'var(--space-md)' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', marginBottom: 'var(--space-xs)' }}>
              <Zap size={18} className="animate-glow" style={{ color: 'var(--accent-blue)' }} />
              Live Venue Blueprint
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              Real-time crowd heatmap with ML-powered navigation
            </p>
          </div>

          <VenueMap
            blueprint={blueprint}
            showCCTV={true}
            navigationRoute={
              activeRoute
                ? {
                    checkpoints: activeRoute.checkpoints,
                    currentIndex: activeRoute.currentCheckpointIndex
                  }
                : undefined
            }
            showFullMap={true}
          />

          <div style={{ marginTop: 'var(--space-md)', display: 'flex', gap: 'var(--space-sm)', flexWrap: 'wrap' }}>
            <span className="badge badge-green">Low Crowd</span>
            <span className="badge badge-amber">Medium Crowd</span>
            <span className="badge badge-red">High Crowd</span>
            <span className="badge badge-purple">Critical Crowd</span>
          </div>
        </section>

        {/* Navigation Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
          {!isNavigating ? (
            <section className="glass-card-static animate-slideUp" style={{ padding: 'var(--space-lg)', animationDelay: '0.2s' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', marginBottom: 'var(--space-md)' }}>
                <Target size={18} />
                Plan Your Route
              </h3>

              <div style={{ display: 'grid', gap: 'var(--space-md)' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: 'var(--space-xs)', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    Starting Point
                  </label>
                  <select className="input" value={fromCheckpoint} onChange={(e) => setFromCheckpoint(e.target.value)}>
                    {availableCheckpoints.map((cp) => (
                      <option key={cp.id} value={cp.id}>
                        {cp.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: 'var(--space-xs)', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    Destination
                  </label>
                  <select className="input" value={toCheckpoint} onChange={(e) => setToCheckpoint(e.target.value)}>
                    {availableCheckpoints.map((cp) => (
                      <option key={cp.id} value={cp.id}>
                        {cp.name}
                      </option>
                    ))}
                  </select>
                </div>

                <button className="btn btn-primary btn-lg hover-glow-blue" onClick={calculateRoute}>
                  <Zap size={18} />
                  Calculate Smart Route
                </button>
              </div>

              <div
                style={{
                  marginTop: 'var(--space-lg)',
                  padding: 'var(--space-md)',
                  background: 'rgba(59, 130, 246, 0.1)',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.8rem',
                  color: 'var(--text-secondary)'
                }}
              >
                <p style={{ fontWeight: 600, color: 'var(--accent-blue)', marginBottom: '4px' }}>
                  🤖 ML-Powered Routing
                </p>
                <p>Our AI analyzes live CCTV feeds to detect crowd density and suggests the fastest, least congested path.</p>
              </div>
            </section>
          ) : (
            <>
              {/* Active Navigation */}
              <section className="glass-card-static animate-bounceIn" style={{ padding: 'var(--space-lg)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-md)' }}>
                  <h3 style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
                    <NavigationIcon size={18} className="animate-glow" style={{ color: 'var(--accent-green)' }} />
                    Navigation Active
                  </h3>
                  <span className="badge badge-green">
                    {(activeRoute?.currentCheckpointIndex ?? 0) + 1} / {activeRoute?.checkpoints.length}
                  </span>
                </div>

                {currentCheckpoint && (
                  <div
                    style={{
                      padding: 'var(--space-md)',
                      background: 'rgba(34, 197, 94, 0.1)',
                      border: '2px solid rgba(34, 197, 94, 0.4)',
                      borderRadius: 'var(--radius-md)',
                      marginBottom: 'var(--space-md)'
                    }}
                  >
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>CURRENT LOCATION</p>
                    <p style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--accent-green)' }}>
                      <MapPin size={16} style={{ display: 'inline', marginRight: '6px' }} />
                      {currentCheckpoint.name}
                    </p>
                  </div>
                )}

                {nextCheckpoint && (
                  <div
                    style={{
                      padding: 'var(--space-md)',
                      background: 'rgba(59, 130, 246, 0.1)',
                      border: '1px solid rgba(59, 130, 246, 0.3)',
                      borderRadius: 'var(--radius-md)',
                      marginBottom: 'var(--space-md)'
                    }}
                  >
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>NEXT CHECKPOINT</p>
                    <p style={{ fontSize: '1rem', fontWeight: 600 }}>
                      <ArrowRight size={16} style={{ display: 'inline', marginRight: '6px', color: 'var(--accent-blue)' }} />
                      {nextCheckpoint.name}
                    </p>
                  </div>
                )}

                <div style={{ display: 'grid', gap: 'var(--space-sm)' }}>
                  {activeRoute?.status === 'active' && nextCheckpoint && (
                    <button className="btn btn-success btn-lg hover-glow-green" onClick={handleReachCheckpoint}>
                      <CheckCircle size={18} />
                      Reached Checkpoint
                    </button>
                  )}

                  {activeRoute?.status === 'completed' && (
                    <div
                      style={{
                        padding: 'var(--space-md)',
                        background: 'rgba(34, 197, 94, 0.15)',
                        border: '1px solid rgba(34, 197, 94, 0.4)',
                        borderRadius: 'var(--radius-md)',
                        textAlign: 'center'
                      }}
                    >
                      <CheckCircle size={32} style={{ color: 'var(--accent-green)', margin: '0 auto 8px' }} />
                      <p style={{ fontWeight: 600, color: 'var(--accent-green)' }}>Destination Reached!</p>
                    </div>
                  )}

                  <button className="btn btn-secondary" onClick={handleCancelNavigation}>
                    Cancel Navigation
                  </button>
                </div>
              </section>

              {/* Route Progress */}
              <section className="glass-card-static animate-slideUp" style={{ padding: 'var(--space-lg)', animationDelay: '0.1s' }}>
                <h3 style={{ marginBottom: 'var(--space-md)', fontSize: '0.9rem' }}>Route Progress</h3>

                <div style={{ display: 'grid', gap: 'var(--space-sm)' }}>
                  {activeRoute?.checkpoints.map((cp, index) => {
                    const isCurrent = index === activeRoute.currentCheckpointIndex
                    const isPassed = index < activeRoute.currentCheckpointIndex
                    const isFuture = index > activeRoute.currentCheckpointIndex

                    return (
                      <div
                        key={cp.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 'var(--space-sm)',
                          padding: 'var(--space-sm)',
                          background: isCurrent
                            ? 'rgba(34, 197, 94, 0.1)'
                            : isPassed
                            ? 'rgba(148, 163, 184, 0.05)'
                            : 'rgba(59, 130, 246, 0.05)',
                          border: `1px solid ${
                            isCurrent
                              ? 'rgba(34, 197, 94, 0.3)'
                              : isPassed
                              ? 'rgba(148, 163, 184, 0.2)'
                              : 'rgba(59, 130, 246, 0.2)'
                          }`,
                          borderRadius: 'var(--radius-md)',
                          opacity: isFuture ? 0.6 : 1
                        }}
                      >
                        <div
                          style={{
                            width: '24px',
                            height: '24px',
                            borderRadius: '50%',
                            background: isCurrent
                              ? 'var(--accent-green)'
                              : isPassed
                              ? 'var(--text-muted)'
                              : 'var(--accent-blue)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            flexShrink: 0
                          }}
                        >
                          {isPassed ? '✓' : index + 1}
                        </div>
                        <div style={{ flex: 1 }}>
                          <p style={{ fontSize: '0.85rem', fontWeight: 500 }}>{cp.name}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </section>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

// Simple pathfinding algorithm
function findRoute(
  from: VenueCheckpoint,
  to: VenueCheckpoint,
  blueprint: VenueBlueprint
): { checkpoints: VenueCheckpoint[]; distance: number; estimatedTime: number } | null {
  // For demo purposes, create a simple route through decision points
  const checkpoints: VenueCheckpoint[] = [from]

  // Find intermediate decision points based on area connections
  const fromArea = blueprint.areas.find((a) => a.id === from.areaId)
  const toArea = blueprint.areas.find((a) => a.id === to.areaId)

  if (!fromArea || !toArea) return null

  // Add decision point checkpoints between start and end
  const decisionPoints = blueprint.checkpoints.filter((cp) => cp.type === 'decision')

  // Simple heuristic: find decision points that connect the areas
  for (const dp of decisionPoints) {
    const dpArea = blueprint.areas.find((a) => a.id === dp.areaId)
    if (dpArea && (fromArea.connectedTo.includes(dpArea.id) || dpArea.connectedTo.includes(toArea.id))) {
      if (!checkpoints.some((cp) => cp.id === dp.id)) {
        checkpoints.push(dp)
      }
    }
  }

  checkpoints.push(to)

  // Calculate distance and time
  const distance = checkpoints.length * 50 // Simplified
  const estimatedTime = checkpoints.length * 2 // 2 minutes per checkpoint

  return { checkpoints, distance, estimatedTime }
}
