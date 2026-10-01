import { useState } from 'react'

const WEATHER_LABELS = {
  0: 'Clear',
  1: 'Mainly clear',
  2: 'Partly cloudy',
  3: 'Cloudy',
  45: 'Fog',
  48: 'Fog',
  51: 'Drizzle',
  53: 'Drizzle',
  55: 'Drizzle',
  61: 'Rain',
  63: 'Rain',
  65: 'Rain',
  66: 'Rain',
  67: 'Rain',
  71: 'Snow',
  73: 'Snow',
  75: 'Snow',
  77: 'Snow',
  80: 'Rain',
  81: 'Rain',
  82: 'Rain',
  85: 'Snow',
  86: 'Snow',
  95: 'Thunder',
  96: 'Thunder',
  99: 'Thunder',
}

function weatherLabel(code) {
  if (code == null) return 'Unknown'
  if (WEATHER_LABELS[code]) return WEATHER_LABELS[code]
  if (code <= 3) return 'Cloudy'
  if (code >= 45 && code <= 48) return 'Fog'
  if (code >= 51 && code <= 67) return 'Rain'
  if (code >= 71 && code <= 86) return 'Snow'
  if (code >= 95) return 'Thunder'
  return 'Unknown'
}

export default function App() {
  const [city, setCity] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [weather, setWeather] = useState(null)

  async function handleSearch(e) {
    e.preventDefault()
    const query = city.trim()
    if (!query) {
      setError('Enter a city name.')
      setWeather(null)
      return
    }

    setLoading(true)
    setError('')
    setWeather(null)

    try {
      const geoRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=1&language=en&format=json`,
      )
      if (!geoRes.ok) throw new Error('Geocoding request failed.')
      const geoData = await geoRes.json()
      const place = geoData.results?.[0]
      if (!place) throw new Error('City not found. Try another name.')

      const { latitude, longitude, name, country, admin1 } = place
      const forecastRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code,wind_speed_10m&timezone=auto`,
      )
      if (!forecastRes.ok) throw new Error('Forecast request failed.')
      const forecast = await forecastRes.json()
      const current = forecast.current
      if (!current) throw new Error('No current weather data.')

      const location = [name, admin1, country].filter(Boolean).join(', ')
      setWeather({
        location,
        temperature: current.temperature_2m,
        weatherCode: current.weather_code,
        windSpeed: current.wind_speed_10m,
      })
    } catch (err) {
      setError(err.message || 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page">
      <main className="card">
        <h1>Weather</h1>
        <p className="subtitle">Search any city · Open-Meteo</p>

        <form className="search" onSubmit={handleSearch}>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="City name"
            aria-label="City name"
            autoComplete="off"
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Searching…' : 'Search'}
          </button>
        </form>

        {loading && <p className="status">Loading…</p>}
        {error && <p className="error" role="alert">{error}</p>}

        {weather && !loading && (
          <section className="result" aria-live="polite">
            <h2>{weather.location}</h2>
            <p className="temp">
              {Math.round(weather.temperature)}
              <span className="unit">°C</span>
            </p>
            <p className="condition">{weatherLabel(weather.weatherCode)}</p>
            {weather.windSpeed != null && (
              <p className="wind">Wind {Math.round(weather.windSpeed)} km/h</p>
            )}
          </section>
        )}
      </main>
    </div>
  )
}
