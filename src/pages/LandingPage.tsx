import { ArrowRight, ShieldCheck, Sparkles, TimerReset, Waypoints, Zap } from 'lucide-react'
import { useState } from 'react'

interface LandingPageProps {
  onSignIn: (name: string) => void
}

export const LandingPage = ({ onSignIn }: LandingPageProps) => {
  const [name, setName] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSignIn(name.trim() || 'Guest Fan')
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
              background: `rgba(59, 130, 246, ${Math.random() * 0.3 + 0.1})`,
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
              NexGen Arena • Live Event Mode
            </p>
          </div>
          
          <h1 className="animate-slideUp" style={{ animationDelay: '0.2s' }}>
            Your Stadium,
            <br />
            <span className="glow-text">Smarter.</span>
          </h1>
          
          <p className="animate-slideUp" style={{ animationDelay: '0.3s' }}>
            VenueFlow helps attendees avoid crowd bottlenecks, join virtual queues, order food faster, and stay safe with
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
                background: 'rgba(59, 130, 246, 0.1)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                borderRadius: 'var(--radius-lg)'
              }}
            >
              <Zap size={32} className="animate-glow" style={{ color: 'var(--accent-blue)', flexShrink: 0 }} />
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
                Enter Your Arena
              </h2>
              <p>Use a display name to continue into the live dashboard.</p>
              
              <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 'var(--space-md)' }}>
                <input
                  className="input"
                  placeholder="Your name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  autoFocus
                />
                <button type="submit" className="btn btn-primary btn-lg hover-glow-blue">
                  Continue
                  <ArrowRight size={20} />
                </button>
              </form>

              <div style={{ marginTop: 'var(--space-lg)', paddingTop: 'var(--space-lg)', borderTop: '1px solid var(--border-subtle)' }}>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                  Built for Google Hackathon 2026 • Physical Event Experience
                </p>
              </div>
            </div>
          </div>
        </aside>
      </section>
    </div>
  )
}
