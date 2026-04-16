import { BrainCircuit, RefreshCw } from 'lucide-react'
import { useEffect, useState } from 'react'
import type { MlInsightsResponse } from '../types'

type Intent = 'quick' | 'merch' | 'comfort'

const riskBadgeClass = (risk: MlInsightsResponse['predictions']['crowdRiskLevel']) => {
  if (risk === 'low') {
    return 'badge badge-green'
  }
  if (risk === 'medium') {
    return 'badge badge-amber'
  }
  if (risk === 'high') {
    return 'badge badge-red'
  }
  return 'badge badge-purple'
}

export const AiInsightsPanel = () => {
  const [seat, setSeat] = useState('B-127')
  const [intent, setIntent] = useState<Intent>('quick')
  const [mobilityNeed, setMobilityNeed] = useState(false)
  const [firstVisit, setFirstVisit] = useState(true)
  const [insights, setInsights] = useState<MlInsightsResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchInsights = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/ml/insights', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          seat,
          intent,
          mobilityNeed,
          firstVisit
        })
      })

      if (!response.ok) {
        throw new Error('AI/ML insights service unavailable')
      }

      const payload = (await response.json()) as MlInsightsResponse
      setInsights(payload)
    } catch {
      setError('Could not fetch AI insights from backend. Start backend server to enable this panel.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void fetchInsights()
  }, [])

  return (
    <section className="glass-card vf-ai-panel">
      <div className="vf-panel-head">
        <div>
          <h3>
            <BrainCircuit size={18} /> AI/ML Decision Engine
          </h3>
          <p>Context-aware recommendations for gates, queues, and parking based on risk modeling.</p>
        </div>

        <button className="btn btn-secondary" onClick={() => void fetchInsights()} disabled={isLoading}>
          <RefreshCw size={16} />
          {isLoading ? 'Running...' : 'Re-run Model'}
        </button>
      </div>

      <div className="vf-ai-form-row">
        <label>
          Seat
          <input className="input" value={seat} onChange={(event) => setSeat(event.target.value.toUpperCase())} />
        </label>

        <label>
          Intent
          <select className="input" value={intent} onChange={(event) => setIntent(event.target.value as Intent)}>
            <option value="quick">Quick food run</option>
            <option value="merch">Merchandise shopping</option>
            <option value="comfort">Comfort and restroom</option>
          </select>
        </label>

        <label className="vf-checkbox-row">
          <input type="checkbox" checked={mobilityNeed} onChange={(event) => setMobilityNeed(event.target.checked)} />
          Mobility support needed
        </label>

        <label className="vf-checkbox-row">
          <input type="checkbox" checked={firstVisit} onChange={(event) => setFirstVisit(event.target.checked)} />
          First time at this venue
        </label>
      </div>

      {error ? <p className="vf-muted">{error}</p> : null}

      {insights ? (
        <div className="vf-ai-content">
          <div className="vf-ai-kpis">
            <article className="vf-ai-kpi">
              <p>Risk Level</p>
              <span className={riskBadgeClass(insights.predictions.crowdRiskLevel)}>{insights.predictions.crowdRiskLevel}</span>
            </article>
            <article className="vf-ai-kpi">
              <p>Risk Score</p>
              <strong>{insights.predictions.crowdRiskScore}</strong>
            </article>
            <article className="vf-ai-kpi">
              <p>Expected Queue Wait</p>
              <strong>{insights.predictions.expectedQueueWaitMinutes} min</strong>
            </article>
            <article className="vf-ai-kpi">
              <p>Arrival Offset</p>
              <strong>{insights.predictions.recommendedArrivalOffsetMinutes} min early</strong>
            </article>
          </div>

          <div className="vf-ai-reco-grid">
            <article className="vf-ai-reco glass-card">
              <p className="vf-muted">Recommended Gate</p>
              <strong>{insights.recommendations.gate}</strong>
            </article>
            <article className="vf-ai-reco glass-card">
              <p className="vf-muted">Recommended Queue</p>
              <strong>{insights.recommendations.queue}</strong>
            </article>
            <article className="vf-ai-reco glass-card">
              <p className="vf-muted">Recommended Parking</p>
              <strong>{insights.recommendations.parking}</strong>
            </article>
          </div>

          <ul className="vf-ai-actions">
            {insights.recommendations.actions.map((action) => (
              <li key={action}>{action}</li>
            ))}
          </ul>

          {insights.narrative ? (
            <article className="vf-ai-narrative">
              <p className="vf-muted">Gemini Summary</p>
              <p>{insights.narrative}</p>
            </article>
          ) : null}
        </div>
      ) : null}
    </section>
  )
}
