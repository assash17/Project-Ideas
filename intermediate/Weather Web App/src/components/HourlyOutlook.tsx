import { motion } from 'framer-motion'
import type { HourlySnapshot } from '../types/weather.ts'

type Props = {
  past24Hours: HourlySnapshot[]
  next24Hours: HourlySnapshot[]
}

function HourlySection({ title, hours }: { title: string; hours: HourlySnapshot[] }) {
  if (!hours.length) {
    return (
      <section className="hourly-section">
        <h2 className="section-title">{title}</h2>
        <p className="muted">No hourly data in this window.</p>
      </section>
    )
  }

  return (
    <section className="hourly-section">
      <h2 className="section-title">{title}</h2>
      <div className="hourly-scroll" role="list">
        {hours.map(hour => (
          <motion.article
            key={hour.instant.toISOString()}
            className={`hour-chip${hour.isNow ? ' hour-chip-now' : ''}`}
            role="listitem"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            <p className="hour-time">
              {hour.isNow ? 'Now' : hour.label}
            </p>
            <span className="hour-icon" aria-hidden>
              {hour.iconEmoji}
            </span>
            <p className="hour-temp">{Math.round(hour.temp)}°</p>
            <p className="hour-meta">{Math.round(hour.precipprob)}% rain</p>
            <p className="hour-conditions">{hour.conditions}</p>
          </motion.article>
        ))}
      </div>
    </section>
  )
}

export function HourlyOutlook({ past24Hours, next24Hours }: Props) {
  return (
    <motion.div
      className="hourly-outlook"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.1, duration: 0.35 }}
    >
      <HourlySection title="Past 24 hours" hours={past24Hours} />
      <HourlySection title="Next 24 hours" hours={next24Hours} />
    </motion.div>
  )
}
