import { Activity, AlertTriangle, TrendingDown, TrendingUp, Zap } from 'lucide-react'
import { useMemo, useState } from 'react'
import type { HeatZone } from '../types'

interface HeatmapCanvasProps {
  zones: HeatZone[]
  onRefresh: () => void
}

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value))

const levelFromRatio = (ratio: number): HeatZone['level'] => {
  if (ratio < 0.35) return 'low'
  if (ratio < 0.55) return 'medium'
  if (ratio < 0.75) return 'high'
  return 'critical'
}

const levelClassByZone = (level: HeatZone['level']) => {
  if (level === 'low') return 'heat-bg-low heat-low'
  if (level === 'medium') return 'heat-bg-medium heat-medium'
  if (level === 'high') return 'heat-bg-high heat-high'
  return 'heat-bg-critical heat-critical'
}

export const HeatmapCanvas = ({ zones, onRefresh }: HeatmapCanvasProps) => {
  const [selectedZoneId, setSelectedZoneId] = useState(zones[0]?.id ?? '')
  const [isRefreshing, setIsRefreshing] = useState(false)

  const selectedZone = useMemo(() => zones.find((zone) => zone.id === selectedZoneId) ?? zones[0], [selectedZoneId, zones])

  const severityCounts = useMemo(() => ({
    low: zones.filter((zone) => zone.level === 'low').length,
    medium: zones.filter((zone) => zone.level === 'medium').length,
    high: zones.filter((zone) => zone.level === 'high').length,
    critical: zones.filter((zone) => zone.level === 'critical').length
  }), [zones])

  const hotspots = useMemo(() => [...zones].sort((a, b) => b.occupancy / b.capacity - a.occupancy / a.capacity).slice(0, 3).map((zone) => ({ ...zone, occupancyRatio: Math.round((zone.occupancy / zone.capacity) * 100) })), [zones])

  const selectedOccupancyPercent = selectedZone ? Math.round((selectedZone.occupancy / selectedZone.capacity) * 100) : 0
  const forecastRatio = selectedZone ? clamp(selectedZone.occupancy / selectedZone.capacity + selectedZone.trend * 0.09, 0, 1) : 0
  const forecastLevel = levelFromRatio(forecastRatio)
  const forecastOccupancy = selectedZone ? Math.round(selectedZone.capacity * forecastRatio) : 0

  const handleRefresh = () => {
    setIsRefreshing(true)
    onRefresh()
    setTimeout(() => setIsRefreshing(false), 600)
  }

  return (
    <section className="glass-card-static animate-slideUp" style={{ padding: 'var(--space-lg)', display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.4rem' }}>
            <Zap size={20} className="animate-glow" style={{ color: 'var(--accent-blue)' }} />
            Tactical Crowd Heatmap
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Real-time telemetry and 15-min flow predictions.</p>
        </div>

        <button className={`btn btn-secondary hover-lift ${isRefreshing ? 'animate-bounceIn' : ''}`} onClick={handleRefresh}>
          <Activity size={16} style={{ animation: isRefreshing ? 'spin-slow 0.6s linear' : 'none' }} />
          Sync Data
        </button>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        <span className="badge badge-green">Safe: {severityCounts.low}</span>
        <span className="badge badge-amber">Steady: {severityCounts.medium}</span>
        <span className="badge badge-red">Dense: {severityCounts.high}</span>
        <span className="badge badge-purple">Gridlock: {severityCounts.critical}</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 'var(--space-sm)' }}>
        {zones.map((zone, index) => {
          const occupancyPercent = Math.round((zone.occupancy / zone.capacity) * 100)
          const isSelected = zone.id === selectedZone?.id
          
          return (
            <button
              key={zone.id}
              className={`hover-lift ${levelClassByZone(zone.level)}`}
              onClick={() => setSelectedZoneId(zone.id)}
              style={{
                textAlign: 'left', minHeight: '90px', padding: 'var(--space-sm)', borderRadius: 'var(--radius-sm)', borderStyle: 'solid', borderWidth: '1px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', cursor: 'pointer',
                borderColor: isSelected ? 'var(--accent-blue)' : undefined,
                boxShadow: isSelected ? 'var(--shadow-glow-blue)' : undefined,
                animation: `fadeIn 0.3s ease-out ${index * 0.03}s both`,
                position: 'relative'
              }}
            >
              {zone.level === 'critical' && <div style={{ position: 'absolute', top: '6px', right: '6px', width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-red)', animation: 'live-pulse 1.5s infinite' }} />}
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-primary)' }}>{zone.name}</span>
              <strong style={{ fontSize: '1.4rem' }}>{occupancyPercent}%</strong>
            </button>
          )
        })}
      </div>

      {selectedZone && (
        <div className="glass-card animate-fadeIn" style={{ padding: 'var(--space-md)', marginTop: 'var(--space-sm)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <strong style={{ fontSize: '1.1rem' }}>{selectedZone.name} Sector</strong>
            <span style={{ color: 'var(--text-secondary)' }}>{selectedZone.occupancy} / {selectedZone.capacity} INT</span>
          </div>
          
          <div className="progress-bar" style={{ marginBottom: '1.2rem' }}>
            <div className="progress-bar-fill" style={{ width: `${selectedOccupancyPercent}%`, transition: 'width 0.6s ease' }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
            <div style={{ padding: '0.8rem', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
              <p style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>Micro-Trend</p>
              <strong style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                {selectedZone.trend > 0 ? <TrendingUp size={16} className="heat-high" /> : <TrendingDown size={16} className="heat-low" />}
                {selectedZone.trend > 0 ? 'Surging' : 'Easing'}
              </strong>
            </div>

            <div style={{ padding: '0.8rem', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
              <p style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>15m Forecast</p>
              <strong className={`heat-${forecastLevel}`}>
                {Math.round(forecastRatio * 100)}% Cap ({forecastOccupancy})
              </strong>
            </div>
          </div>
        </div>
      )}

      <div style={{ marginTop: 'var(--space-sm)' }}>
        <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.8rem' }}>
          <AlertTriangle size={16} className="animate-glow heat-medium" /> Anomaly Hotspots
        </h4>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-sm)' }}>
          {hotspots.map((spot, i) => (
            <div key={spot.id} className="hover-lift" style={{ padding: '0.8rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-sm)', animation: `slideUp 0.3s ease-out ${0.2 + i * 0.1}s both` }}>
              <p style={{ fontSize: '0.85rem', fontWeight: 600, display: 'flex', justifyContent: 'space-between' }}>
                {spot.name} <span className={`heat-${spot.level}`}>{spot.level.toUpperCase()}</span>
              </p>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>Mass: {spot.occupancyRatio}%</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
