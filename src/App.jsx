import { useState } from 'react'

const LABELS = {
  0: 'Clear sky',
  1: 'Mainly clear',
  2: 'Partly cloudy',
  3: 'Overcast',
  45: 'Fog',
  48: 'Fog',
  51: 'Light drizzle',
  53: 'Drizzle',
  55: 'Dense drizzle',
  61: 'Light rain',
  63: 'Rain',
  65: 'Heavy rain',
  66: 'Freezing rain',
  67: 'Freezing rain',
  71: 'Light snow',
  73: 'Snow',
  75: 'Heavy snow',
  77: 'Snow grains',
  80: 'Rain showers',
  81: 'Rain showers',
  82: 'Heavy showers',
  85: 'Snow showers',
  86: 'Snow showers',
  95: 'Thunderstorm',
  96: 'Thunderstorm',
  99: 'Thunderstorm',
}

function weatherLabel(code) {
  if (code == null) return 'Unknown'
  if (LABELS[code]) return LABELS[code]
  if (code <= 1) return 'Clear'
  if (code === 2) return 'Partly cloudy'
  if (code === 3) return 'Overcast'
  if (code >= 45 && code <= 48) return 'Fog'
  if (code >= 51 && code <= 67) return 'Rain'
  if (code >= 71 && code <= 77) return 'Snow'
  if (code >= 80 && code <= 82) return 'Rain'
  if (code === 85 || code === 86) return 'Snow'
  if (code >= 95) return 'Thunderstorm'
  return 'Unknown'
}

function weatherKind(code) {
  if (code == null) return 'cloudy'
  if (code <= 1) return 'sunny'
  if (code === 2) return 'partly'
  if (code === 3) return 'cloudy'
  if (code === 45 || code === 48) return 'fog'
  if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) return 'rain'
  if ((code >= 71 && code <= 77) || code === 85 || code === 86) return 'snow'
  if (code >= 95) return 'thunder'
  return 'cloudy'
}

function roundOrDash(value) {
  if (value == null || Number.isNaN(Number(value))) return '—'
  return String(Math.round(Number(value)))
}

function formatHour(iso) {
  const hour = Number(String(iso).slice(11, 13))
  if (Number.isNaN(hour)) return ''
  const suffix = hour >= 12 ? 'pm' : 'am'
  const h12 = hour % 12 || 12
  return `${h12}${suffix}`
}

function nextHours(hourly, currentTime) {
  const times = hourly?.time || []
  const temps = hourly?.temperature_2m || []
  const codes = hourly?.weather_code || []
  if (!times.length) return []

  let start = currentTime ? times.findIndex((t) => t >= currentTime) : 0
  if (start < 0) start = Math.max(0, times.length - 12)

  return times.slice(start, start + 12).map((time, i) => ({
    time,
    label: i === 0 ? 'Now' : formatHour(time),
    temp: temps[start + i],
    code: codes[start + i],
  }))
}

function WeatherIcon({ code, size = 64 }) {
  const kind = weatherKind(code)
  const props = {
    width: size,
    height: size,
    viewBox: '0 0 64 64',
    fill: 'none',
    'aria-hidden': true,
    className: 'wx-icon',
  }

  if (kind === 'sunny') {
    const rays = [0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
      const a = (deg * Math.PI) / 180
      return (
        <line
          key={deg}
          x1={32 + Math.cos(a) * 18}
          y1={32 + Math.sin(a) * 18}
          x2={32 + Math.cos(a) * 27}
          y2={32 + Math.sin(a) * 27}
        />
      )
    })
    return (
      <svg {...props}>
        <circle cx="32" cy="32" r="11" fill="currentColor" />
        <g stroke="currentColor" strokeWidth="3" strokeLinecap="round">
          {rays}
        </g>
      </svg>
    )
  }

  if (kind === 'partly') {
    return (
      <svg {...props}>
        <circle cx="24" cy="22" r="9" fill="currentColor" opacity="0.9" />
        <g fill="currentColor">
          <circle cx="28" cy="38" r="10" />
          <circle cx="40" cy="36" r="12" />
          <ellipse cx="36" cy="44" rx="16" ry="9" />
        </g>
      </svg>
    )
  }

  if (kind === 'fog') {
    return (
      <svg {...props}>
        <g stroke="currentColor" strokeWidth="3.5" strokeLinecap="round">
          <line x1="12" y1="24" x2="52" y2="24" />
          <line x1="16" y1="34" x2="48" y2="34" opacity="0.75" />
          <line x1="12" y1="44" x2="44" y2="44" opacity="0.5" />
        </g>
      </svg>
    )
  }

  if (kind === 'rain') {
    return (
      <svg {...props}>
        <g fill="currentColor">
          <circle cx="26" cy="26" r="9" />
          <circle cx="38" cy="24" r="11" />
          <ellipse cx="34" cy="32" rx="16" ry="9" />
        </g>
        <g stroke="currentColor" strokeWidth="3" strokeLinecap="round">
          <line x1="24" y1="44" x2="21" y2="54" />
          <line x1="34" y1="44" x2="31" y2="54" />
          <line x1="44" y1="44" x2="41" y2="54" />
        </g>
      </svg>
    )
  }

  if (kind === 'snow') {
    return (
      <svg {...props}>
        <g fill="currentColor">
          <circle cx="26" cy="26" r="9" />
          <circle cx="38" cy="24" r="11" />
          <ellipse cx="34" cy="32" rx="16" ry="9" />
          <circle cx="22" cy="48" r="2.2" />
          <circle cx="34" cy="52" r="2.2" />
          <circle cx="46" cy="47" r="2.2" />
        </g>
      </svg>
    )
  }

  if (kind === 'thunder') {
    return (
      <svg {...props}>
        <g fill="currentColor">
          <circle cx="26" cy="24" r="9" />
          <circle cx="38" cy="22" r="11" />
          <ellipse cx="34" cy="30" rx="16" ry="9" />
          <path d="M34 34 L26 48 H33 L28 60 L44 42 H35 L40 34 Z" />
        </g>
      </svg>
    )
  }

  return (
    <svg {...props}>
      <g fill="currentColor">
        <circle cx="24" cy="34" r="10" />
        <circle cx="36" cy="30" r="13" />
        <ellipse cx="38" cy="40" rx="16" ry="9" />
      </g>
    </svg>
  )
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
