interface TeamInfo {
  code: string
  bg: string
  fg: string
}

/** Real club crest images (downloaded from Wikipedia, fair-use logos). */
const CREST_MAP: Record<string, string> = {
  'Tauro FC': '/assets/teams/tauro-fc.webp',
  'Plaza Amador': '/assets/teams/plaza-amador.webp',
  'Sporting San Miguelito': '/assets/teams/sporting-san-miguelito.webp',
  'Alianza FC': '/assets/teams/alianza-fc.webp',
  'CA Independiente': '/assets/teams/ca-independiente.webp',
  'San Francisco FC': '/assets/teams/san-francisco-fc.webp',
  'Potros del Este': '/assets/teams/potros-del-este.webp',
  'Universitario': '/assets/teams/universitario.webp',
  'Independiente FC': '/assets/teams/independiente-fc.webp',
}

/** Fallback badge for clubs without a downloaded crest. */
const TEAMS: Record<string, TeamInfo> = {
  'Árabe Unido': { code: 'ARU', bg: '#123b8c', fg: '#ffffff' },
  'Herrera FC': { code: 'HER', bg: '#e0a800', fg: '#111111' },
  'Veraguas United': { code: 'VER', bg: '#0f7a3d', fg: '#ffffff' },
}

const FALLBACK: TeamInfo = { code: 'GG', bg: '#12306b', fg: '#ffffff' }

/** Team crest: real image when available, else a colored badge. */
export function TeamCrest({ name, size = 38 }: { name: string; size?: number }) {
  const src = CREST_MAP[name]
  if (src) {
    return (
      <img
        src={src}
        alt={`Escudo de ${name}`}
        style={{ width: size, height: size, objectFit: 'contain', flexShrink: 0, display: 'block' }}
      />
    )
  }

  const info = TEAMS[name] ?? FALLBACK
  return (
    <span
      role="img"
      aria-label={`Escudo de ${name}`}
      className="grid place-items-center rounded-full font-display font-bold"
      style={{
        width: size,
        height: size,
        background: info.bg,
        color: info.fg,
        fontSize: size * 0.3,
        letterSpacing: 0.5,
        lineHeight: 1,
        border: '1.5px solid rgba(255,255,255,0.6)',
        flexShrink: 0,
      }}
    >
      {info.code}
    </span>
  )
}
