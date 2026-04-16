interface StatsCardProps {
  label: string
  value: string
  trend?: string
  trendDirection?: 'positive' | 'negative'
}

export const StatsCard = ({ label, value, trend, trendDirection = 'positive' }: StatsCardProps) => (
  <article className="glass-card stat-card">
    <p className="stat-label">{label}</p>
    <p className="stat-value">{value}</p>
    {trend ? <p className={`stat-change ${trendDirection}`}>{trend}</p> : null}
  </article>
)
