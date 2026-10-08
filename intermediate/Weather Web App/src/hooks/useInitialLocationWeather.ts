import { useEffect } from 'react'
import { useWeatherStore } from '../store/weatherStore.ts'

const GEO_TIMEOUT_MS = 10_000

function getCurrentPosition(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported in this browser.'))
      return
    }
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: false,
      timeout: GEO_TIMEOUT_MS,
      maximumAge: 5 * 60_000,
    })
  })
}

export function useInitialLocationWeather() {
  const hasAttemptedInitialLoad = useWeatherStore(s => s.hasAttemptedInitialLoad)
  const fetchWeather = useWeatherStore(s => s.fetchWeather)
  const markInitialLoadAttempted = useWeatherStore(s => s.markInitialLoadAttempted)

  useEffect(() => {
    if (hasAttemptedInitialLoad) return

    markInitialLoadAttempted()

    void (async () => {
      try {
        const position = await getCurrentPosition()
        const { latitude, longitude } = position.coords
        await fetchWeather(`${latitude},${longitude}`)
      } catch {
        /* User denied or geolocation failed — stay idle until manual search */
      }
    })()
  }, [hasAttemptedInitialLoad, fetchWeather, markInitialLoadAttempted])
}
