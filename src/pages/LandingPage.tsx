import { ArrowRight, Armchair, ShieldCheck, Sparkles, Ticket, TimerReset, Trophy, Waypoints, Zap } from 'lucide-react'
import { useState } from 'react'
import type { SportType, UserTicketProfile } from '../types'

interface LandingPageProps {
  onSignIn: (profile: UserTicketProfile) => void
}

const seatPattern = /^[A-P]{1,2}-\d{1,3}$/
const normalizeSeatNumber = (value: string) => value.replace(/\s+/g, '').toUpperCase()

const particlePalette = ['rgba(249, 115, 22, 0.32)', 'rgba(234, 179, 8, 0.28)', 'rgba(101, 163, 13, 0.28)']

export const LandingPage = ({ onSignIn }: LandingPageProps) => {
  const [name, setName] = useState('')
  const [ticketNumber, setTicketNumber] = useState('')
  const [seatNumber, setSeatNumber] = useState('')
  const [sport, setSport] = useState<SportType>('Cricket')
  const [formError, setFormError] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const normalizedSeat = normalizeSeatNumber(seatNumber)

    if (!ticketNumber.trim()) {
      setFormError('Enter your ticket number to continue.')
      return
    }

    if (!seatPattern.test(normalizedSeat)) {
      setFormError('Use seat format like B-127, E-44, or P-312.')
      return
    }

    setFormError(null)

    onSignIn({
      name: name.trim() || 'Guest Fan',
      ticketNumber: ticketNumber.trim().toUpperCase(),
      seatNumber: normalizedSeat,
      sport
    })
  }

  return (
    <div className="vf-landing">
      <div className="vf-landing-overlay" />

      {/* Floating particles effect */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="animate-float"
            style={{
              position: 'absolute',
              width: `${Math.random() * 4 + 2}px`,
              height: `${Math.random() * 4 + 2}px`,
              borderRadius: '50%',
              background: particlePalette[i % particlePalette.length],
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${Math.random() * 4 + 3}s`
            }}
          />
        ))}
      </div>

      <section className="vf-landing-main">
        <div className="vf-landing-copy">
          <div className="animate-slideUp" style={{ animationDelay: '0.1s' }}>
            <p className="badge badge-blue" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <Sparkles size={14} />
              NavCrowd • Live Cricket Mode
            </p>
          </div>
          
          <h1 className="animate-slideUp" style={{ animationDelay: '0.2s' }}>
            Your Stadium,
            <br />
            <span className="glow-text">Smarter.</span>
          </h1>
          
          <p className="animate-slideUp" style={{ animationDelay: '0.3s' }}>
            NavCrowd helps fans avoid crowd bottlenecks, join virtual queues, order food faster, and stay safe with
            AI-powered live guidance.
          </p>

          <div className="vf-feature-row">
            <article className="glass-card vf-feature-chip hover-lift animate-scaleIn" style={{ animationDelay: '0.4s' }}>
              <TimerReset size={18} className="animate-glow" style={{ color: 'var(--accent-blue)' }} />
              <span>Smart Virtual Queues</span>
            </article>
            <article className="glass-card vf-feature-chip hover-lift animate-scaleIn" style={{ animationDelay: '0.5s' }}>
              <Waypoints size={18} className="animate-glow" style={{ color: 'var(--accent-green)' }} />
              <span>Parking + Navigation</span>
            </article>
            <article className="glass-card vf-feature-chip hover-lift animate-scaleIn" style={{ animationDelay: '0.6s' }}>
              <ShieldCheck size={18} className="animate-glow" style={{ color: 'var(--accent-amber)' }} />
              <span>Emergency Response</span>
            </article>
          </div>

          <div className="animate-fadeIn" style={{ animationDelay: '0.7s', marginTop: 'var(--space-xl)' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-lg)',
                padding: 'var(--space-lg)',
                background: 'rgba(249, 115, 22, 0.11)',
                border: '1px solid rgba(249, 115, 22, 0.32)',
                borderRadius: 'var(--radius-lg)'
              }}
            >
              <Zap size={32} className="animate-glow" style={{ color: 'var(--accent-amber)', flexShrink: 0 }} />
              <div>
                <p style={{ fontWeight: 600, marginBottom: '4px' }}>Powered by Google Gemini AI</p>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                  Real-time crowd predictions, smart routing, and conversational assistance
                </p>
              </div>
            </div>
          </div>
        </div>

        <aside className="vf-auth-card">
          <div className="gradient-border animate-bounceIn" style={{ animationDelay: '0.3s' }}>
            <div className="vf-auth-inner">
              <h2 style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
                <Sparkles size={24} className="animate-glow" style={{ color: 'var(--accent-blue)' }} />
                Match Entry Login
              </h2>
              <p>Enter ticket details to unlock your live dashboard and verified seat services.</p>
              
              <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 'var(--space-md)' }}>
                <div className="vf-login-grid">
                  <label className="vf-login-label" htmlFor="login-name">
                    <Sparkles size={14} />
                    Display Name
                  </label>
                  <input
                    id="login-name"
                    className="input"
                    placeholder="Your name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    autoFocus
                  />

                  <label className="vf-login-label" htmlFor="login-ticket-number">
                    <Ticket size={14} />
                    Ticket Number
                  </label>
                  <input
                    id="login-ticket-number"
                    className="input"
                    placeholder="CRK-2026-1194"
                    value={ticketNumber}
                    onChange={(event) => setTicketNumber(event.target.value)}
                    autoComplete="off"
                    required
                  />

                  <label className="vf-login-label" htmlFor="login-seat-number">
                    <Armchair size={14} />
                    Seat Number
                  </label>
                  <input
                    id="login-seat-number"
                    className="input"
                    placeholder="B-127"
                    value={seatNumber}
                    onChange={(event) => setSeatNumber(event.target.value.toUpperCase())}
                    onBlur={() => setSeatNumber(normalizeSeatNumber(seatNumber))}
                    autoComplete="off"
                    required
                  />

                  <label className="vf-login-label" htmlFor="login-sport">
                    <Trophy size={14} />
                    Sport
                  </label>
                  <select
                    id="login-sport"
                    className="vf-select"
                    value={sport}
                    onChange={(event) => setSport(event.target.value as SportType)}
                  >
                    <option value="Cricket">Cricket (default)</option>
                    <option value="Football">Football</option>
                  </select>

                  <p className="vf-login-help">Default is cricket for this event setup and all route recommendations.</p>
                  {formError ? <p className="vf-login-error">{formError}</p> : null}
                </div>

                <input
                  type="hidden"
                  value={sport}
                  aria-hidden="true"
                  readOnly
                />
                <button type="submit" className="btn btn-primary btn-lg hover-glow-blue">
                  Enter Dashboard
                  <ArrowRight size={20} />
                </button>
              </form>
            </div>
          </div>
        </aside>
      </section>
    </div>
  )
}
