import { ArrowRight, CheckCircle, MapPin, Navigation as NavigationIcon, Target, Zap, ShieldAlert, Cpu } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { VenueMap } from '../components/VenueMap'
import { updateCrowdDataFromCCTV, venueBlueprint, venueCheckpoints } from '../data/venueBlueprint'
import type { NavigationRoute, VenueBlueprint, VenueCheckpoint, VenuePath, VenuePoint } from '../types/venue'

export const NavigationPage = () => {
  const [blueprint, setBlueprint] = useState<VenueBlueprint>(venueBlueprint)
  const [fromCheckpoint, setFromCheckpoint] = useState<string>('cp-parking-a')
  const [toCheckpoint, setToCheckpoint] = useState<string>('cp-seating-n')
  const [activeRoute, setActiveRoute] = useState<NavigationRoute | null>(null)
  const [isNavigating, setIsNavigating] = useState(false)
  const [routeFeedback, setRouteFeedback] = useState('Pick your origin and destination, then build a route.')

  useEffect(() => {
    const interval = setInterval(() => setBlueprint((prev) => updateCrowdDataFromCCTV(prev)), 5000)
    return () => clearInterval(interval)
  }, [])

  const availableCheckpoints = useMemo(() => venueCheckpoints.filter((cp) => cp.type === 'waypoint' || cp.type === 'destination'), [])

  const calculateRoute = () => {
    const from = venueCheckpoints.find((cp) => cp.id === fromCheckpoint)
    const to = venueCheckpoints.find((cp) => cp.id === toCheckpoint)
    if (!from || !to) {
      setRouteFeedback('Please select valid checkpoints to continue.')
      return
    }

    if (from.id === to.id) {
      setActiveRoute(null)
      setIsNavigating(false)
      setRouteFeedback(`You are already at ${from.name}. Choose another destination to generate guidance.`)
      return
    }

    const route = findRoute(from, to, blueprint)
    if (route) {
      setActiveRoute({ id: `route-${Date.now()}`, from, to, path: [], currentCheckpointIndex: 0, totalDistance: route.distance, estimatedTime: route.estimatedTime, checkpoints: route.checkpoints, status: 'active' })
      setIsNavigating(true)
      setRouteFeedback(`Route ready: ${route.checkpoints.length} checkpoints • ${route.estimatedTime} min • ${route.distance} m`)
    } else {
      setActiveRoute(null)
      setIsNavigating(false)
      setRouteFeedback('No safe route is available right now. Try a nearby waypoint or wait for crowd conditions to improve.')
    }
  }

  const handleReachCheckpoint = () => {
    if (!activeRoute) return
    if (activeRoute.currentCheckpointIndex < activeRoute.checkpoints.length - 1) setActiveRoute({ ...activeRoute, currentCheckpointIndex: activeRoute.currentCheckpointIndex + 1 })
    else { setActiveRoute({ ...activeRoute, status: 'completed' }); setIsNavigating(false) }
  }
  const handleCancelNavigation = () => {
    setActiveRoute(null)
    setIsNavigating(false)
    setRouteFeedback('Navigation cancelled. Adjust checkpoints and build a fresh route.')
  }

  const currentCheckpoint = activeRoute?.checkpoints[activeRoute.currentCheckpointIndex]
  const nextCheckpoint = activeRoute?.checkpoints[activeRoute.currentCheckpointIndex + 1]

  return (
    <div className="page-container animate-fadeIn">
      <header className="page-header">
        <h1 className="page-title">
          <NavigationIcon size={32} className="animate-glow" style={{ color: 'var(--accent-blue)' }} />
          <span className="text-gradient">NavCrowd Route Navigator</span>
        </h1>
        <p className="page-subtitle">Real-time route guidance tuned for crowd density and active incidents.</p>
      </header>

      <p className="vf-nav-status-note">{routeFeedback}</p>

      <div className="vf-navigation-layout">
        {/* Map Section */}
          <section className="glass-card-static animate-slideUp" style={{ padding: 'var(--space-md)', display: 'flex', flexDirection: 'column' }}>
           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 'var(--space-sm)', flexWrap: 'wrap', marginBottom: 'var(--space-sm)' }}>
             <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Zap size={20} className="animate-glow" style={{ color: 'var(--accent-cyan)' }} />
               Live Venue Feed
             </h3>
             <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <span className="badge badge-green">Safe</span>
                <span className="badge badge-amber">Steady</span>
                <span className="badge badge-red">Dense</span>
                <span className="badge badge-purple">Gridlock</span>
             </div>
          </div>
          <div style={{ flex: 1, position: 'relative', overflow: 'hidden', borderRadius: 'var(--radius-md)' }}>
            <VenueMap
              blueprint={blueprint}
              showCCTV={true}
              navigationRoute={ activeRoute ? { checkpoints: activeRoute.checkpoints, currentIndex: activeRoute.currentCheckpointIndex } : undefined }
              showFullMap={true}
            />
          </div>
        </section>

        {/* Console Section */}
        <div className="vf-navigation-sidebar" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          {!isNavigating ? (
            <section className="glass-card-static animate-slideUp" style={{ padding: 'var(--space-lg)', animationDelay: '0.1s' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', marginBottom: 'var(--space-md)' }}>
                <Target size={20} /> Route Planner
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)' }}>Origin</label>
                  <select className="vf-select" style={{ marginTop: '0.2rem' }} value={fromCheckpoint} onChange={(e) => setFromCheckpoint(e.target.value)}>
                    {availableCheckpoints.map((cp) => <option key={cp.id} value={cp.id}>{cp.name}</option>)}
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)' }}>Destination</label>
                  <select className="vf-select" style={{ marginTop: '0.2rem' }} value={toCheckpoint} onChange={(e) => setToCheckpoint(e.target.value)}>
                    {availableCheckpoints.map((cp) => <option key={cp.id} value={cp.id}>{cp.name}</option>)}
                  </select>
                </div>

                <button className="btn btn-primary btn-lg" style={{ marginTop: '0.5rem' }} onClick={calculateRoute}>
                  <Cpu size={18} /> Build best route
                </button>
              </div>
              
              <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(249, 115, 22, 0.09)', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid var(--accent-blue)' }}>
                 <p style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--accent-blue)', marginBottom: '4px' }}>
                    <ShieldAlert size={14} /> AI Guardian Active
                 </p>
                 <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Routing weights automatically avoid dense or incident-prone segments where possible.</p>
              </div>
            </section>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
              {/* Active Navigation Panel */}
              <section className="glass-card animate-bounceIn" style={{ padding: 'var(--space-lg)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
                  <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-green)' }}>
                    <NavigationIcon size={20} className="animate-glow" /> Navigation Active
                  </h3>
                  <span className="badge badge-green">
                    {(activeRoute?.currentCheckpointIndex ?? 0) + 1} / {activeRoute?.checkpoints.length}
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                  {currentCheckpoint && (
                    <div style={{ padding: '0.8rem', border: '1px solid rgba(52, 211, 153, 0.3)', borderRadius: 'var(--radius-sm)', background: 'rgba(52, 211, 153, 0.05)' }}>
                      <p style={{ fontSize: '0.7rem', color: 'var(--accent-green)', fontWeight: 700, letterSpacing: '1px' }}>CURRENT</p>
                      <p style={{ fontSize: '1.1rem', fontWeight: 600 }}><MapPin size={16} style={{ display: 'inline', marginRight: '6px' }} />{currentCheckpoint.name}</p>
                    </div>
                  )}

                  {nextCheckpoint && (
                    <div style={{ padding: '0.8rem', border: '1px solid rgba(249, 115, 22, 0.3)', borderRadius: 'var(--radius-sm)', background: 'rgba(249, 115, 22, 0.06)' }}>
                      <p style={{ fontSize: '0.7rem', color: 'var(--accent-blue)', fontWeight: 700, letterSpacing: '1px' }}>HEADING TO</p>
                      <p style={{ fontSize: '1rem', fontWeight: 600 }}><ArrowRight size={16} style={{ display: 'inline', marginRight: '6px' }} />{nextCheckpoint.name}</p>
                    </div>
                  )}
                </div>

                <div style={{ display: 'grid', gap: '0.5rem', marginTop: '1.2rem' }}>
                  {activeRoute?.status === 'active' && nextCheckpoint && (
                    <button className="btn btn-success btn-lg" onClick={handleReachCheckpoint}>
                      <CheckCircle size={18} /> Mark checkpoint reached
                    </button>
                  )}
                  {activeRoute?.status === 'completed' && (
                    <div style={{ padding: '1rem', background: 'rgba(52, 211, 153, 0.1)', border: '1px solid rgba(52, 211, 153, 0.4)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                      <CheckCircle size={32} style={{ color: 'var(--accent-green)', margin: '0 auto 8px' }} />
                      <p style={{ fontWeight: 600, color: 'var(--accent-green)' }}>Traversal Complete</p>
                    </div>
                  )}
                  <button className="btn btn-secondary" onClick={handleCancelNavigation}>Cancel route</button>
                </div>

                {activeRoute ? (
                  <p className="vf-muted" style={{ marginTop: '0.7rem' }}>
                    Estimated time: {activeRoute.estimatedTime} min • Distance: {activeRoute.totalDistance} m
                  </p>
                ) : null}
              </section>

              {/* Progress Timeline */}
              <section className="glass-card-static animate-slideUp" style={{ padding: 'var(--space-md)', animationDelay: '0.1s' }}>
                 <h4 style={{ marginBottom: '1rem', fontSize: '0.9rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Timeline</h4>
                 <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {activeRoute?.checkpoints.map((cp, index) => {
                      const isCurrent = index === activeRoute.currentCheckpointIndex
                      const isPassed = index < activeRoute.currentCheckpointIndex
                      return (
                        <div key={cp.id} style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', padding: '0.4rem', opacity: isPassed ? 0.5 : 1 }}>
                          <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: isCurrent ? 'var(--accent-green)' : isPassed ? 'var(--text-muted)' : 'var(--bg-card)', border: `2px solid ${isCurrent ? 'var(--accent-green)' : 'var(--accent-blue)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem', color: 'white', fontWeight: 'bold' }}>
                            {isPassed ? '✓' : index + 1}
                          </div>
                          <span style={{ fontSize: '0.9rem', color: isCurrent ? 'white' : 'var(--text-secondary)' }}>{cp.name}</span>
                        </div>
                      )
                    })}
                 </div>
              </section>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function findRoute(from: VenueCheckpoint, to: VenueCheckpoint, blueprint: VenueBlueprint): { checkpoints: VenueCheckpoint[]; distance: number; estimatedTime: number } | null {
  const checkpointById = new Map(blueprint.checkpoints.map((checkpoint) => [checkpoint.id, checkpoint]))
  const areaById = new Map(blueprint.areas.map((area) => [area.id, area]))
  const fieldArea = blueprint.areas.find((area) => area.type === 'field')

  type Edge = { to: string; weight: number; distance: number; estimatedTime: number }
  const graph = new Map<string, Edge[]>()

  const addEdge = (fromId: string, edge: Edge) => {
    const existing = graph.get(fromId) ?? []
    existing.push(edge)
    graph.set(fromId, existing)
  }

  const getRiskPenalty = (path: VenuePath): number => {
    const fromCheckpoint = checkpointById.get(path.from)
    const toCheckpoint = checkpointById.get(path.to)
    const fromArea = fromCheckpoint ? areaById.get(fromCheckpoint.areaId) : undefined
    const toArea = toCheckpoint ? areaById.get(toCheckpoint.areaId) : undefined

    const fromRatio = fromArea ? fromArea.currentOccupancy / Math.max(1, fromArea.capacity) : 0.45
    const toRatio = toArea ? toArea.currentOccupancy / Math.max(1, toArea.capacity) : 0.45
    const avgRatio = (fromRatio + toRatio) / 2

    const pathCrowdBias = path.crowdLevel === 'high' ? 32 : path.crowdLevel === 'medium' ? 16 : 4
    const occupancyBias = avgRatio * 42

    const concourseFlowBonus = (fromArea?.type === 'concourse' && toArea?.type === 'concourse') ? -10 : 0
    const gateBottleneckPenalty = (fromArea?.type === 'gate' || toArea?.type === 'gate') && avgRatio > 0.62 ? 24 : 0
    const seatingCrossPenalty = (fromArea?.type === 'seating' && toArea?.type === 'seating') ? 14 : 0
    const amenitiesQueuePenalty = (fromArea?.type === 'food' || toArea?.type === 'food' || fromArea?.type === 'restroom' || toArea?.type === 'restroom') && avgRatio > 0.66 ? 12 : 0

    const segmentCrossesField = Boolean(
      fieldArea &&
      fromCheckpoint &&
      toCheckpoint &&
      fromArea?.type !== 'field' &&
      toArea?.type !== 'field' &&
      doesSegmentIntersectPolygon(fromCheckpoint.position, toCheckpoint.position, fieldArea.polygon)
    )
    const fieldCrossingPenalty = segmentCrossesField ? 240 : 0

    const incidentPenalty = blueprint.incident?.active &&
      (fromArea?.id === blueprint.incident.areaId || toArea?.id === blueprint.incident.areaId)
      ? 100
      : 0

    const emergencyTypePenalty = (fromArea?.type === 'emergency' || toArea?.type === 'emergency')
      ? blueprint.incident?.active
        ? -14
        : 18
      : 0

    const levelPenalty = (fromArea?.level === 'critical' || toArea?.level === 'critical')
      ? 42
      : (fromArea?.level === 'high' || toArea?.level === 'high')
      ? 18
      : 0

    return pathCrowdBias + occupancyBias + incidentPenalty + emergencyTypePenalty + levelPenalty + gateBottleneckPenalty + seatingCrossPenalty + amenitiesQueuePenalty + concourseFlowBonus + fieldCrossingPenalty
  }

  blueprint.paths.forEach((path) => {
    if (!path.accessible) return

    const baseCost = path.distance * 0.9 + path.estimatedTime * 8
    const weight = baseCost + getRiskPenalty(path)

    addEdge(path.from, { to: path.to, weight, distance: path.distance, estimatedTime: path.estimatedTime })
    addEdge(path.to, { to: path.from, weight, distance: path.distance, estimatedTime: path.estimatedTime })
  })

  const distances = new Map<string, number>()
  const previous = new Map<string, string | null>()
  const visited = new Set<string>()

  checkpointById.forEach((_, checkpointId) => {
    distances.set(checkpointId, Number.POSITIVE_INFINITY)
    previous.set(checkpointId, null)
  })
  distances.set(from.id, 0)

  while (visited.size < checkpointById.size) {
    let currentId: string | null = null
    let minDistance = Number.POSITIVE_INFINITY

    distances.forEach((distance, checkpointId) => {
      if (!visited.has(checkpointId) && distance < minDistance) {
        minDistance = distance
        currentId = checkpointId
      }
    })

    if (!currentId || minDistance === Number.POSITIVE_INFINITY) break
    if (currentId === to.id) break

    const activeId = currentId
    visited.add(activeId)

    const neighbors = graph.get(activeId) ?? []
    neighbors.forEach((edge) => {
      if (visited.has(edge.to)) return

      const currentDistance = distances.get(activeId) ?? Number.POSITIVE_INFINITY
      const nextDistance = currentDistance + edge.weight
      if (nextDistance < (distances.get(edge.to) ?? Number.POSITIVE_INFINITY)) {
        distances.set(edge.to, nextDistance)
        previous.set(edge.to, activeId)
      }
    })
  }

  if ((distances.get(to.id) ?? Number.POSITIVE_INFINITY) === Number.POSITIVE_INFINITY) {
    return null
  }

  const pathIds: string[] = []
  let cursor: string | null = to.id
  while (cursor) {
    pathIds.unshift(cursor)
    if (cursor === from.id) break
    cursor = previous.get(cursor) ?? null
  }

  if (pathIds[0] !== from.id) {
    return null
  }

  const checkpoints = pathIds
    .map((checkpointId) => checkpointById.get(checkpointId))
    .filter((checkpoint): checkpoint is VenueCheckpoint => Boolean(checkpoint))

  let totalDistance = 0
  let estimatedTime = 0
  for (let index = 0; index < pathIds.length - 1; index += 1) {
    const currentId = pathIds[index]
    const nextId = pathIds[index + 1]
    const segment = (graph.get(currentId) ?? []).find((edge) => edge.to === nextId)
    if (segment) {
      totalDistance += segment.distance
      estimatedTime += segment.estimatedTime
    }
  }

  return {
    checkpoints,
    distance: Math.max(totalDistance, 35),
    estimatedTime: Math.max(estimatedTime, 1)
  }
}

const getOrientation = (a: VenuePoint, b: VenuePoint, c: VenuePoint) => {
  const value = (b.y - a.y) * (c.x - b.x) - (b.x - a.x) * (c.y - b.y)
  if (Math.abs(value) < 0.0001) {
    return 0
  }
  return value > 0 ? 1 : 2
}

const onSegment = (a: VenuePoint, b: VenuePoint, c: VenuePoint) => {
  return (
    b.x <= Math.max(a.x, c.x) &&
    b.x >= Math.min(a.x, c.x) &&
    b.y <= Math.max(a.y, c.y) &&
    b.y >= Math.min(a.y, c.y)
  )
}

const doSegmentsIntersect = (p1: VenuePoint, q1: VenuePoint, p2: VenuePoint, q2: VenuePoint) => {
  const o1 = getOrientation(p1, q1, p2)
  const o2 = getOrientation(p1, q1, q2)
  const o3 = getOrientation(p2, q2, p1)
  const o4 = getOrientation(p2, q2, q1)

  if (o1 !== o2 && o3 !== o4) {
    return true
  }

  if (o1 === 0 && onSegment(p1, p2, q1)) return true
  if (o2 === 0 && onSegment(p1, q2, q1)) return true
  if (o3 === 0 && onSegment(p2, p1, q2)) return true
  if (o4 === 0 && onSegment(p2, q1, q2)) return true

  return false
}

const isPointInPolygon = (point: VenuePoint, polygon: VenuePoint[]) => {
  let inside = false
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].x
    const yi = polygon[i].y
    const xj = polygon[j].x
    const yj = polygon[j].y

    const intersects = yi > point.y !== yj > point.y && point.x < ((xj - xi) * (point.y - yi)) / (yj - yi + 0.00001) + xi
    if (intersects) {
      inside = !inside
    }
  }
  return inside
}

const doesSegmentIntersectPolygon = (start: VenuePoint, end: VenuePoint, polygon: VenuePoint[]) => {
  if (isPointInPolygon(start, polygon) || isPointInPolygon(end, polygon)) {
    return true
  }

  for (let i = 0; i < polygon.length; i += 1) {
    const nextIndex = (i + 1) % polygon.length
    const p1 = polygon[i]
    const p2 = polygon[nextIndex]
    if (doSegmentsIntersect(start, end, p1, p2)) {
      return true
    }
  }

  return false
}
