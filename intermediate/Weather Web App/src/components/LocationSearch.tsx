import type { FormEvent } from 'react'
import { useWeatherStore } from '../store/weatherStore.ts'

type Props = {
  disabled?: boolean
}

export function LocationSearch({ disabled }: Props) {
  const locationInput = useWeatherStore(s => s.locationInput)
  const setLocationInput = useWeatherStore(s => s.setLocationInput)
  const fetchWeather = useWeatherStore(s => s.fetchWeather)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    void fetchWeather(locationInput)
  }

  return (
    <form className="search-form" onSubmit={handleSubmit}>
      <label className="search-label" htmlFor="location">
        Location
      </label>
      <div className="search-row">
        <input
          id="location"
          className="search-input"
          type="text"
          placeholder="e.g. Seoul, KR or 37.56,126.98"
          value={locationInput}
          disabled={disabled}
          onChange={e => setLocationInput(e.target.value)}
          autoComplete="off"
        />
        <button type="submit" className="btn btn-primary" disabled={disabled}>
          Search
        </button>
      </div>
    </form>
  )
}
