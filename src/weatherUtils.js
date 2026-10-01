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

export function weatherLabel(code) {
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

export function weatherKind(code) {
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

export function roundOrDash(value) {
  if (value == null || Number.isNaN(Number(value))) return '—'
  return String(Math.round(Number(value)))
}

export function formatHour(iso) {
  const hour = Number(String(iso).slice(11, 13))
  if (Number.isNaN(hour)) return ''
  const suffix = hour >= 12 ? 'pm' : 'am'
  const h12 = hour % 12 || 12
  return `${h12}${suffix}`
}

export function nextHours(hourly, currentTime) {
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
