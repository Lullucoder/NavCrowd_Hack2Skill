import { useMemo, useState } from 'react'
import { QueueCard } from '../components/QueueCard'
import { queueStallsSeed } from '../data/mockData'

export const QueuePage = () => {
  const [joinedStallId, setJoinedStallId] = useState<string | null>(null)
  const [queuePosition, setQueuePosition] = useState<number | null>(null)

  const joinedStall = useMemo(() => queueStallsSeed.find((stall) => stall.id === joinedStallId) ?? null, [joinedStallId])

  const handleJoin = (stallId: string) => {
    setJoinedStallId(stallId)
    setQueuePosition(Math.floor(Math.random() * 12) + 3)
  }

  const handleLeave = () => {
    setJoinedStallId(null)
    setQueuePosition(null)
  }

  return (
    <div className="page-container">
      <header className="page-header">
        <h1 className="page-title">Smart Virtual Queue</h1>
        <p className="page-subtitle">Join digitally and keep enjoying the event while your turn approaches.</p>
      </header>

      {joinedStall && queuePosition ? (
        <section className="vf-queue-ticket glass-card">
          <p className="badge badge-green">Active Queue Ticket</p>
          <h2>{joinedStall.name}</h2>
          <p>
            Position <strong>#{queuePosition}</strong> • Estimated wait {joinedStall.avgWaitMinutes} minutes
          </p>
        </section>
      ) : null}

      <div className="vf-section-space" />
      <section className="grid-2">
        {queueStallsSeed.map((stall) => (
          <QueueCard
            key={stall.id}
            stall={stall}
            isJoined={joinedStallId === stall.id}
            onJoin={handleJoin}
            onLeave={handleLeave}
          />
        ))}
      </section>
    </div>
  )
}
