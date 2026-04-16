export const predictWaitTime = ({ peopleWaiting, zoneLoad }) => {
  const baseServiceRatePerMinute = 1.7
  const adjustedRate = Math.max(0.9, baseServiceRatePerMinute - zoneLoad * 0.6)
  return Math.max(1, Math.round(peopleWaiting / adjustedRate))
}

export const predictCrowdForHorizon = ({ occupancy, capacity, trend, minutesAhead }) => {
  const drift = Math.round(trend * minutesAhead * 11)
  const wave = Math.round(Math.sin(minutesAhead / 6) * capacity * 0.03)
  const prediction = occupancy + drift + wave
  return Math.max(0, Math.min(capacity, prediction))
}
