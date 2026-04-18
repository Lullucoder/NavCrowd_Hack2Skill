import { Crown, Clock, FastForward, QrCode } from 'lucide-react'
import type { QueueStall } from '../types'

interface QueueCardProps {
  stall: QueueStall
  isJoined: boolean
  onJoin: (stallId: string) => void
  onLeave: () => void
}

export const QueueCard = ({ stall, isJoined, onJoin, onLeave }: QueueCardProps) => (
  <article className="glass-card hover-lift" style={{ padding: 'var(--space-md)' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
      <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: stall.type === 'Merch' ? 'var(--accent-purple)' : 'var(--text-primary)' }}>
        {stall.type === 'Merch' && <Crown size={16} className="animate-glow" />}
        {stall.name}
      </h3>
      {stall.type === 'Merch' && <span className="badge badge-purple">Elite Access</span>}
    </div>

    <div
      style={{
        display: 'flex',
        gap: 'var(--space-lg)',
        flexWrap: 'wrap',
        rowGap: '0.45rem',
        marginBottom: '1.2rem',
        color: 'var(--text-secondary)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <Clock size={16} style={{ color: 'var(--accent-cyan)' }} />
        <span>{stall.avgWaitMinutes}m Sync</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <FastForward size={16} style={{ color: stall.peopleWaiting > 10 ? 'var(--accent-red)' : 'var(--accent-green)' }} />
        <span>{stall.peopleWaiting} Units</span>
      </div>
    </div>

    <button
      className={`btn hover-lift ${stall.type === 'Food' ? 'btn-primary' : 'btn-secondary'}`}
      style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', width: '100%' }}
      onClick={() => (isJoined ? onLeave() : onJoin(stall.id))}
    >
      <QrCode size={18} /> {isJoined ? 'Exit Queue' : 'Generate Token'}
    </button>
  </article>
)
