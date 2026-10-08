import { create } from 'zustand'
import { fetchTimelineWeather, WeatherApiError } from '../api/visualCrossing.ts'
import { mapTimelineToViewModel } from '../lib/weatherMapper.ts'
import type { FetchStatus, WeatherViewModel } from '../types/weather.ts'

type WeatherState = {
  status: FetchStatus
  locationInput: string
  activeLocation: string | null
  weather: WeatherViewModel | null
  errorMessage: string | null
  lastFetchedAt: number | null
  hasAttemptedInitialLoad: boolean
  setLocationInput: (value: string) => void
  fetchWeather: (location: string) => Promise<void>
  refreshWeather: () => Promise<void>
  markInitialLoadAttempted: () => void
}

export const useWeatherStore = create<WeatherState>((set, get) => ({
  status: 'idle',
  locationInput: '',
  activeLocation: null,
  weather: null,
  errorMessage: null,
  lastFetchedAt: null,
  hasAttemptedInitialLoad: false,

  setLocationInput: value => set({ locationInput: value }),

  fetchWeather: async location => {
    const trimmed = location.trim()
    if (!trimmed) {
      set({
        status: 'error',
        errorMessage: 'Enter a city, address, or coordinates.',
      })
      return
    }

    set({
      status: 'loading',
      errorMessage: null,
      locationInput: trimmed,
      activeLocation: trimmed,
    })

    try {
      const response = await fetchTimelineWeather(trimmed)
      const weather = mapTimelineToViewModel(response, trimmed)
      set({
        status: 'success',
        weather,
        errorMessage: null,
        lastFetchedAt: Date.now(),
      })
    } catch (err) {
      const message =
        err instanceof WeatherApiError
          ? err.message
          : err instanceof Error
            ? err.message
            : 'Something went wrong fetching weather.'
      set({
        status: 'error',
        errorMessage: message,
        weather: get().weather,
      })
    }
  },

  refreshWeather: async () => {
    const { activeLocation } = get()
    if (!activeLocation) {
      set({
        status: 'error',
        errorMessage: 'Search for a location before refreshing.',
      })
      return
    }
    await get().fetchWeather(activeLocation)
  },

  markInitialLoadAttempted: () => set({ hasAttemptedInitialLoad: true }),
}))
