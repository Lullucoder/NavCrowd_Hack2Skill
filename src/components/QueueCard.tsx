import { Timer } from 'lucide-react'
import type { QueueStall } from '../types'

interface QueueCardProps {
  stall: QueueStall
  isJoined: boolean
  onJoin: (stallId: string) => void
  onLeave: () => void
}

export const QueueCard = ({ stall, isJoined, onJoin, onLeave }: QueueCardProps) => (
  <article className="glass-card vf-queue-card">
    <div className="vf-queue-head">
      <h3>{stall.name}</h3>
      <span className="badge badge-blue">{stall.type}</span>
    </div>

    <p className="vf-queue-zone">{stall.zone}</p>

    <div className="vf-queue-metrics">
      <div>
        <p className="vf-queue-metric-label">Waiting</p>
        <strong>{stall.peopleWaiting} people</strong>
      </div>
      <div>
        <p className="vf-queue-metric-label">Avg Wait</p>
        <strong>
          <Timer size={14} /> {stall.avgWaitMinutes} min
        </strong>
      </div>
    </div>

    {isJoined ? (
      <button className="btn btn-danger" onClick={onLeave}>
        Leave Queue
      </button>
    ) : (
      <button className="btn btn-primary" onClick={() => onJoin(stall.id)}>
        Join Queue
      </button>
    )}
  </article>
)
