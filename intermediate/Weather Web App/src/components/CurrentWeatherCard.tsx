import { motion } from 'framer-motion'
import type { CurrentSnapshot } from '../types/weather.ts'

type Props = {
  resolvedAddress: string
  timezone: string
  current: CurrentSnapshot
  onRefresh: () => void
  refreshing: boolean
}

export function CurrentWeatherCard({
  resolvedAddress,
  timezone,
  current,
  onRefresh,
  refreshing,
}: Props) {
  return (
    <motion.section
      className="card current-card"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <div className="current-header">
        <div>
          <h1 className="location-title">{resolvedAddress}</h1>
          <p className="location-meta">{timezone}</p>
        </div>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={onRefresh}
          disabled={refreshing}
        >
          {refreshing ? 'Refreshing…' : 'Refresh'}
        </button>
      </div>

      <div className="current-main">
        <span className="weather-icon-lg" aria-hidden>
          {current.iconEmoji}
        </span>
        <div>
          <p className="temp-display">{Math.round(current.temp)}°C</p>
          <p className="conditions-text">{current.conditions}</p>
        </div>
      </div>

      <dl className="stats-grid">
        <div>
          <dt>Wind</dt>
          <dd>{Math.round(current.windspeed)} km/h</dd>
        </div>
        <div>
          <dt>Rain likelihood</dt>
          <dd>{Math.round(current.precipprob)}%</dd>
        </div>
      </dl>
    </motion.section>
  )
}
