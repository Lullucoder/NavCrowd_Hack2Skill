import { ShieldCheck, TimerReset, Waypoints } from 'lucide-react'
import { useState } from 'react'

interface LandingPageProps {
  onSignIn: (name: string) => void
}

export const LandingPage = ({ onSignIn }: LandingPageProps) => {
  const [name, setName] = useState('')

  return (
    <div className="vf-landing">
      <div className="vf-landing-overlay" />

      <section className="vf-landing-main">
        <div className="vf-landing-copy animate-slideUp">
          <p className="badge badge-blue">NexGen Arena • Live Event Mode</p>
          <h1>
            Your Stadium,<br />
            Smarter.
          </h1>
          <p>
            VenueFlow helps attendees avoid crowd bottlenecks, join virtual queues, order food faster, and stay safe with live
            guidance.
          </p>

          <div className="vf-feature-row">
            <article className="glass-card vf-feature-chip">
              <TimerReset size={18} />
              <span>Smart Virtual Queues</span>
            </article>
            <article className="glass-card vf-feature-chip">
              <Waypoints size={18} />
              <span>Parking + Navigation</span>
            </article>
            <article className="glass-card vf-feature-chip">
              <ShieldCheck size={18} />
              <span>Emergency Response</span>
            </article>
          </div>
        </div>

        <aside className="vf-auth-card gradient-border animate-fadeIn">
          <div className="vf-auth-inner">
            <h2>Enter Your Arena</h2>
            <p>Use a display name to continue into the live dashboard.</p>
            <input
              className="input"
              placeholder="Your name"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
            <button className="btn btn-primary btn-lg" onClick={() => onSignIn(name.trim() || 'Guest Fan')}>
              Continue
            </button>
          </div>
        </aside>
      </section>
    </div>
  )
}
