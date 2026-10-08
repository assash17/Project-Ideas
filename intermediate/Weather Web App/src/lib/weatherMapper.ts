import { emojiForConditions } from './conditionIcons.ts'
import { formatHourLabel } from './dateRange.ts'
import type {
  HourlySnapshot,
  TimelineDayRaw,
  TimelineHourRaw,
  TimelineResponse,
  WeatherViewModel,
} from '../types/weather.ts'

const MS_PER_HOUR = 60 * 60 * 1000

function parseHourInstant(dayDate: string, hourDatetime: string): Date {
  if (hourDatetime.includes('T') || /^\d{4}-\d{2}-\d{2}/.test(hourDatetime)) {
    return new Date(hourDatetime)
  }
  return new Date(`${dayDate}T${hourDatetime}`)
}

function parseCurrentInstant(raw: string): Date {
  if (/^\d{4}-\d{2}-\d{2}/.test(raw)) {
    return new Date(raw)
  }
  const today = new Date()
  const day = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
  return new Date(`${day}T${raw}`)
}

function flattenHours(days: TimelineDayRaw[]): { instant: Date; hour: TimelineHourRaw }[] {
  const result: { instant: Date; hour: TimelineHourRaw }[] = []
  for (const day of days) {
    if (!day.hours?.length) continue
    for (const hour of day.hours) {
      result.push({
        instant: parseHourInstant(day.datetime, hour.datetime),
        hour,
      })
    }
  }
  result.sort((a, b) => a.instant.getTime() - b.instant.getTime())
  return result
}

function toHourlySnapshot(
  instant: Date,
  hour: TimelineHourRaw,
  ref: Date,
): HourlySnapshot {
  const diffMs = Math.abs(instant.getTime() - ref.getTime())
  const isNow = diffMs < MS_PER_HOUR / 2
  return {
    instant,
    label: formatHourLabel(instant),
    temp: hour.temp,
    windspeed: hour.windspeed,
    precipprob: hour.precipprob,
    conditions: hour.conditions,
    iconEmoji: emojiForConditions(hour.conditions, hour.icon),
    isNow,
  }
}

function nearestHour(
  flat: { instant: Date; hour: TimelineHourRaw }[],
  ref: Date,
): TimelineHourRaw | undefined {
  if (!flat.length) return undefined
  let best = flat[0]!
  let bestDiff = Math.abs(best.instant.getTime() - ref.getTime())
  for (const entry of flat) {
    const diff = Math.abs(entry.instant.getTime() - ref.getTime())
    if (diff < bestDiff) {
      best = entry
      bestDiff = diff
    }
  }
  return best.hour
}

export function mapTimelineToViewModel(
  response: TimelineResponse,
  locationQuery: string,
): WeatherViewModel {
  const ref = response.currentConditions
    ? parseCurrentInstant(response.currentConditions.datetime)
    : new Date()

  const flat = flattenHours(response.days)

  const past24Hours: HourlySnapshot[] = []
  const next24Hours: HourlySnapshot[] = []
  const pastStart = ref.getTime() - 24 * MS_PER_HOUR
  const futureEnd = ref.getTime() + 24 * MS_PER_HOUR

  for (const { instant, hour } of flat) {
    const t = instant.getTime()
    if (t > pastStart && t <= ref.getTime()) {
      past24Hours.push(toHourlySnapshot(instant, hour, ref))
    }
    if (t >= ref.getTime() && t < futureEnd) {
      next24Hours.push(toHourlySnapshot(instant, hour, ref))
    }
  }

  const currentRaw = response.currentConditions
  const fallbackHour = nearestHour(flat, ref)

  const current = currentRaw
    ? {
        temp: currentRaw.temp,
        windspeed: currentRaw.windspeed,
        precipprob: currentRaw.precipprob,
        conditions: currentRaw.conditions,
        iconEmoji: emojiForConditions(currentRaw.conditions, currentRaw.icon),
        observedAt: ref,
      }
    : fallbackHour
      ? {
          temp: fallbackHour.temp,
          windspeed: fallbackHour.windspeed,
          precipprob: fallbackHour.precipprob,
          conditions: fallbackHour.conditions,
          iconEmoji: emojiForConditions(fallbackHour.conditions, fallbackHour.icon),
          observedAt: ref,
        }
      : {
          temp: 0,
          windspeed: 0,
          precipprob: 0,
          conditions: 'Unknown',
          iconEmoji: '🌡️',
          observedAt: ref,
        }

  return {
    locationQuery,
    resolvedAddress: response.resolvedAddress,
    timezone: response.timezone,
    current,
    past24Hours,
    next24Hours,
  }
}
