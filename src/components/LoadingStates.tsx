import { Loader2 } from 'lucide-react'

export const Spinner = ({ size = 24, className = '' }: { size?: number; className?: string }) => (
  <Loader2 size={size} className={className} style={{ animation: 'spin-slow 1s linear infinite' }} />
)

export const FullPageLoader = ({ message = 'Loading...' }: { message?: string }) => (
  <div
    style={{
      position: 'fixed',
      inset: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 'var(--space-md)',
      background: 'var(--bg-primary)',
      zIndex: 9999
    }}
  >
    <Spinner size={48} />
    <p style={{ color: 'var(--text-secondary)' }}>{message}</p>
  </div>
)

export const SkeletonCard = () => (
  <div className="glass-card-static" style={{ padding: 'var(--space-lg)' }}>
    <div className="skeleton skeleton-title" />
    <div className="skeleton skeleton-text" />
    <div className="skeleton skeleton-text" style={{ width: '80%' }} />
    <div className="skeleton skeleton-text" style={{ width: '60%' }} />
  </div>
)

export const SkeletonStats = () => (
  <div className="glass-card-static stat-card">
    <div className="skeleton" style={{ height: '2rem', width: '60%' }} />
    <div className="skeleton" style={{ height: '0.8rem', width: '40%', marginTop: 'var(--space-sm)' }} />
  </div>
)

export const SkeletonHeatmap = () => (
  <div className="glass-card-static" style={{ padding: 'var(--space-lg)' }}>
    <div className="skeleton skeleton-title" />
    <div className="skeleton skeleton-text" style={{ width: '70%', marginBottom: 'var(--space-lg)' }} />
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-sm)' }}>
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className="skeleton" style={{ height: '92px' }} />
      ))}
    </div>
  </div>
)

export const InlineLoader = ({ text = 'Loading' }: { text?: string }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', color: 'var(--text-secondary)' }}>
    <Spinner size={16} />
    <span>{text}</span>
  </div>
)
