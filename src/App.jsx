import { useState } from 'react'
import WeatherIcon from './WeatherIcon.jsx'
import {
  weatherLabel,
  weatherKind,
  roundOrDash,
  formatHour,
  nextHours,
} from './weatherUtils.js'

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
      const params = new URLSearchParams({
        latitude: String(latitude),
        longitude: String(longitude),
        current: 'temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m',
        daily: 'temperature_2m_max,temperature_2m_min,weather_code',
        hourly: 'temperature_2m,weather_code',
        timezone: 'auto',
        forecast_days: '2',
      })
      const forecastRes = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`)
      if (!forecastRes.ok) throw new Error('Forecast request failed.')
      const forecast = await forecastRes.json()
      const current = forecast.current
      if (!current) throw new Error('No current weather data.')

      const parts = [name]
      if (admin1 && admin1 !== name) parts.push(admin1)
      if (country) parts.push(country)

      setWeather({
        location: parts.filter(Boolean).join(', '),
        temperature: current.temperature_2m,
        feelsLike: current.apparent_temperature,
        humidity: current.relative_humidity_2m,
        weatherCode: current.weather_code,
        windSpeed: current.wind_speed_10m,
        windUnit: forecast.current_units?.wind_speed_10m || 'km/h',
        high: forecast.daily?.temperature_2m_max?.[0],
        low: forecast.daily?.temperature_2m_min?.[0],
        hours: nextHours(forecast.hourly, current.time),
        observed: current.time,
      })
    } catch (err) {
      setError(err.message || 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  const theme = weather ? weatherKind(weather.weatherCode) : 'sky'
  const condition = weather ? weatherLabel(weather.weatherCode) : ''

  return (
    <div className={`page theme-${theme}`}>
      <div className="glow glow-a" />
      <div className="glow glow-b" />

      <main className="shell">
        <header className="top">
          <div className="brand">
            <WeatherIcon code={weather ? weather.weatherCode : 0} size={36} />
            <div>
              <p className="eyebrow">Open-Meteo</p>
              <h1>Weather</h1>
            </div>
          </div>

          <form className="search" onSubmit={handleSearch}>
            <label className="sr-only" htmlFor="city">
              City name
            </label>
            <input
              id="city"
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Search a city"
              autoComplete="off"
              enterKeyHint="search"
            />
            <button type="submit" disabled={loading}>
              {loading ? <span className="spinner" aria-hidden="true" /> : null}
              {loading ? 'Searching' : 'Search'}
            </button>
          </form>
        </header>

        <section className="panel" aria-live="polite">
          {loading && (
            <div className="state">
              <span className="spinner spinner-lg" aria-hidden="true" />
              <p>Fetching the latest conditions…</p>
            </div>
          )}

          {!loading && error && (
            <p className="error" role="alert">
              {error}
            </p>
          )}

          {!loading && !error && !weather && (
            <div className="state empty">
              <WeatherIcon code={1} size={84} />
              <h2>Look up any city</h2>
              <p>Current conditions, today’s range, and the next 12 hours.</p>
            </div>
          )}

          {weather && !loading && (
            <div className="dashboard">
              <div className="hero">
                <div className="hero-icon">
                  <WeatherIcon code={weather.weatherCode} size={96} />
                </div>
                <div className="hero-copy">
                  <p className="place">{weather.location}</p>
                  <p className="temp">
                    {roundOrDash(weather.temperature)}
                    <span className="unit">°</span>
                  </p>
                  <p className="condition">{condition}</p>
                  {weather.observed && (
                    <p className="observed">Updated {formatHour(weather.observed)}</p>
                  )}
                </div>
              </div>

              <ul className="stats">
                <li>
                  <span>Feels like</span>
                  <strong>{roundOrDash(weather.feelsLike)}°</strong>
                </li>
                <li>
                  <span>Humidity</span>
                  <strong>{roundOrDash(weather.humidity)}%</strong>
                </li>
                <li>
                  <span>Wind</span>
                  <strong>
                    {roundOrDash(weather.windSpeed)}
                    <small>{weather.windUnit}</small>
                  </strong>
                </li>
                <li>
                  <span>Today</span>
                  <strong>
                    {roundOrDash(weather.high)}°
                    <small className="low">/ {roundOrDash(weather.low)}°</small>
                  </strong>
                </li>
              </ul>

              {weather.hours.length > 0 && (
                <div className="hourly">
                  <h2>Next 12 hours</h2>
                  <div className="hours">
                    {weather.hours.map((hour) => (
                      <article key={hour.time} className="hour">
                        <p>{hour.label}</p>
                        <WeatherIcon code={hour.code} size={32} />
                        <strong>{roundOrDash(hour.temp)}°</strong>
                      </article>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
