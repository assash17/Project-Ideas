export type FetchStatus = 'idle' | 'loading' | 'success' | 'error'

export type TimelineHourRaw = {
  datetime: string
  temp: number
  windspeed: number
  precipprob: number
  conditions: string
  icon?: string
}

export type TimelineDayRaw = {
  datetime: string
  hours?: TimelineHourRaw[]
}

export type TimelineCurrentRaw = {
  datetime: string
  temp: number
  windspeed: number
  precipprob: number
  conditions: string
  icon?: string
}

export type TimelineResponse = {
  queryCost?: number
  resolvedAddress: string
  address: string
  timezone: string
  currentConditions?: TimelineCurrentRaw
  days: TimelineDayRaw[]
}

export type HourlySnapshot = {
  instant: Date
  label: string
  temp: number
  windspeed: number
  precipprob: number
  conditions: string
  iconEmoji: string
  isNow: boolean
}

export type CurrentSnapshot = {
  temp: number
  windspeed: number
  precipprob: number
  conditions: string
  iconEmoji: string
  observedAt: Date
}

export type WeatherViewModel = {
  locationQuery: string
  resolvedAddress: string
  timezone: string
  current: CurrentSnapshot
  past24Hours: HourlySnapshot[]
  next24Hours: HourlySnapshot[]
}
