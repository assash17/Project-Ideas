import { getTimelineDateRange } from '../lib/dateRange.ts'
import type { TimelineResponse } from '../types/weather.ts'

const BASE =
  'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline'

export class WeatherApiError extends Error {
  status?: number

  constructor(message: string, status?: number) {
    super(message)
    this.name = 'WeatherApiError'
    this.status = status
  }
}

function getApiKey(): string {
  const key = import.meta.env.VITE_VISUAL_CROSSING_API_KEY
  if (!key?.trim()) {
    throw new WeatherApiError(
      'Missing API key. Add VITE_VISUAL_CROSSING_API_KEY to .env.local (see .env.example).',
    )
  }
  return key.trim()
}

export function buildTimelineUrl(location: string): string {
  const trimmed = location.trim()
  if (!trimmed) {
    throw new WeatherApiError('Enter a city, address, or coordinates.')
  }

  const { start, end } = getTimelineDateRange()
  const path = `${BASE}/${encodeURIComponent(trimmed)}/${start}/${end}`
  const params = new URLSearchParams({
    key: getApiKey(),
    unitGroup: 'metric',
    contentType: 'json',
    include: 'current,days,hours',
    elements: 'datetime,temp,windspeed,precipprob,conditions,icon',
  })
  return `${path}?${params.toString()}`
}

export async function fetchTimelineWeather(location: string): Promise<TimelineResponse> {
  const url = buildTimelineUrl(location)
  const response = await fetch(url)

  if (!response.ok) {
    let detail = response.statusText
    try {
      const body = (await response.json()) as { message?: string }
      if (body.message) detail = body.message
    } catch {
      /* ignore */
    }
    throw new WeatherApiError(
      detail || `Weather request failed (${response.status}).`,
      response.status,
    )
  }

  return (await response.json()) as TimelineResponse
}
