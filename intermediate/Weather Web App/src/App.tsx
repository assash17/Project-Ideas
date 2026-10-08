import { AnimatePresence } from 'framer-motion'
import { CurrentWeatherCard } from './components/CurrentWeatherCard.tsx'
import { ErrorBanner } from './components/ErrorBanner.tsx'
import { HourlyOutlook } from './components/HourlyOutlook.tsx'
import { LoadingPanel } from './components/LoadingPanel.tsx'
import { LocationSearch } from './components/LocationSearch.tsx'
import { useInitialLocationWeather } from './hooks/useInitialLocationWeather.ts'
import { useWeatherStore } from './store/weatherStore.ts'

function App() {
  useInitialLocationWeather()

  const status = useWeatherStore(s => s.status)
  const weather = useWeatherStore(s => s.weather)
  const errorMessage = useWeatherStore(s => s.errorMessage)
  const refreshWeather = useWeatherStore(s => s.refreshWeather)

  const loading = status === 'loading'
  const showWeather = status === 'success' && weather

  return (
    <div className="app">
      <main className="weather-app">
        <header className="app-header">
          <p className="eyebrow">Weather Web App</p>
          <p className="subtitle">
            Search any location or allow access to see weather near you.
          </p>
        </header>

        <LocationSearch disabled={loading} />

        <AnimatePresence mode="wait">
          {errorMessage && status === 'error' && (
            <ErrorBanner key="error" message={errorMessage} />
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {loading && !weather && <LoadingPanel key="loading-full" />}
          {loading && weather && (
            <p className="loading-inline" key="loading-inline">
              Updating forecast…
            </p>
          )}
        </AnimatePresence>

        {showWeather && (
          <>
            <CurrentWeatherCard
              resolvedAddress={weather.resolvedAddress}
              timezone={weather.timezone}
              current={weather.current}
              onRefresh={() => void refreshWeather()}
              refreshing={loading}
            />
            <HourlyOutlook
              past24Hours={weather.past24Hours}
              next24Hours={weather.next24Hours}
            />
          </>
        )}

        {status === 'idle' && !weather && (
          <p className="idle-hint muted">
            Enter a location above, or allow location access when prompted.
          </p>
        )}
      </main>
    </div>
  )
}

export default App
