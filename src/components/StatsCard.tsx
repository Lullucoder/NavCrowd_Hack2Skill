import { TrendingDown, TrendingUp } from 'lucide-react'
import { useEffect, useState } from 'react'

interface StatsCardProps {
  label: string
  value: string
  trend?: string
  trendDirection?: 'positive' | 'negative'
  icon?: React.ReactNode
  delay?: number
}

export const StatsCard = ({ label, value, trend, trendDirection = 'positive', icon, delay = 0 }: StatsCardProps) => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay)
    return () => clearTimeout(timer)
  }, [delay])

  return (
    <article
      className={`glass-card stat-card hover-lift ${isVisible ? 'animate-scaleIn' : ''}`}
      style={{
        opacity: isVisible ? 1 : 0,
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {icon && (
        <div
          style={{
            position: 'absolute',
            top: 'var(--space-md)',
            right: 'var(--space-md)',
            opacity: 0.15,
            transform: 'scale(1.5)'
          }}
        >
          {icon}
        </div>
      )}
      <p className="stat-label">{label}</p>
      <p className="stat-value" style={{ position: 'relative', zIndex: 1 }}>
        {value}
      </p>
      {trend ? (
        <p className={`stat-change ${trendDirection}`}>
          {trendDirection === 'positive' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
          {trend}
        </p>
      ) : null}
    </article>
  )
}
