import { useEffect, useMemo, useState } from 'react'
import QRCode from 'qrcode'
import { QueueCard } from '../components/QueueCard'
import { queueStallsSeed } from '../data/mockData'

interface QueueTicket {
  stallId: string
  queuePosition: number
  tokenCode: string
  issuedAt: string
  expiresAt: string
  payload: string
}

export const QueuePage = () => {
  const [joinedStallId, setJoinedStallId] = useState<string | null>(null)
  const [queuePosition, setQueuePosition] = useState<number | null>(null)
  const [ticket, setTicket] = useState<QueueTicket | null>(null)
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState('')
  const [copyLabel, setCopyLabel] = useState('Copy Token')

  const joinedStall = useMemo(() => queueStallsSeed.find((stall) => stall.id === joinedStallId) ?? null, [joinedStallId])

  const expiryLabel = useMemo(() => {
    if (!ticket) {
      return ''
    }

    return new Date(ticket.expiresAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }, [ticket])

  useEffect(() => {
    if (!ticket) {
      setQrCodeDataUrl('')
      setCopyLabel('Copy Token')
      return
    }

    let isCancelled = false
    setQrCodeDataUrl('')

    void QRCode.toDataURL(ticket.payload, {
      width: 280,
      margin: 1,
      color: {
        dark: '#0b1120',
        light: '#f8fafc'
      }
    })
      .then((generatedUrl: string) => {
        if (!isCancelled) {
          setQrCodeDataUrl(generatedUrl)
        }
      })
      .catch(() => {
        if (!isCancelled) {
          setQrCodeDataUrl('')
        }
      })

    return () => {
      isCancelled = true
    }
  }, [ticket])

  const handleJoin = (stallId: string) => {
    const position = Math.floor(Math.random() * 12) + 3
    const issuedAt = new Date()
    const expiresAt = new Date(issuedAt.getTime() + 30 * 60 * 1000)
    const normalizedStall = stallId.replace(/[^a-z0-9]/gi, '').toUpperCase().slice(0, 4) || 'ZONE'
    const tokenCode = `NC-${normalizedStall}-${Math.floor(Math.random() * 9000 + 1000)}`

    setJoinedStallId(stallId)
    setQueuePosition(position)
    setTicket({
      stallId,
      queuePosition: position,
      tokenCode,
      issuedAt: issuedAt.toISOString(),
      expiresAt: expiresAt.toISOString(),
      payload: JSON.stringify({
        app: 'NavCrowd',
        stallId,
        queuePosition: position,
        tokenCode,
        issuedAt: issuedAt.toISOString(),
        expiresAt: expiresAt.toISOString()
      })
    })
  }

  const handleLeave = () => {
    setJoinedStallId(null)
    setQueuePosition(null)
    setTicket(null)
  }

  const handleCopyToken = async () => {
    if (!ticket) {
      return
    }

    try {
      await navigator.clipboard.writeText(ticket.tokenCode)
      setCopyLabel('Copied')
    } catch {
      setCopyLabel('Manual Copy')
    }

    window.setTimeout(() => {
      setCopyLabel('Copy Token')
    }, 1400)
  }

  return (
    <div className="page-container animate-fadeIn">
      <header className="page-header">
        <h1 className="page-title">Smart Virtual Queue</h1>
        <p className="page-subtitle">Join digitally and keep enjoying the event while your turn approaches.</p>
      </header>

      {joinedStall && queuePosition && ticket ? (
        <section className="vf-queue-ticket glass-card" role="status" aria-live="polite">
          <div className="vf-queue-ticket-top">
            <div>
              <p className="badge badge-green">Active Queue Ticket</p>
              <h2>{joinedStall.name}</h2>
            </div>
            <p className="vf-muted">Valid till {expiryLabel}</p>
          </div>

          <div className="vf-queue-ticket-grid">
            <div className="vf-queue-ticket-meta">
              <p>
                Position <strong>#{queuePosition}</strong> - Estimated wait {joinedStall.avgWaitMinutes} minutes
              </p>
              <p>
                Stall zone: <strong>{joinedStall.zone}</strong>
              </p>
              <p className="vf-queue-token-pill">Token: {ticket.tokenCode}</p>
              <button className="btn btn-secondary" aria-label="Copy queue token" onClick={() => void handleCopyToken()}>
                {copyLabel}
              </button>
            </div>

            <div className="vf-queue-qr-card" aria-busy={!qrCodeDataUrl}>
              {qrCodeDataUrl ? (
                <img className="vf-queue-qr-image" src={qrCodeDataUrl} alt={`Queue token QR for ${joinedStall.name}`} />
              ) : (
                <p className="vf-muted">Generating secure QR token...</p>
              )}
              <p className="vf-muted">Show this QR at the scanner when your turn is called.</p>
            </div>
          </div>
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
