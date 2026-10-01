import { weatherKind } from './weatherUtils.js'

export default function WeatherIcon({ code, size = 64 }) {
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
