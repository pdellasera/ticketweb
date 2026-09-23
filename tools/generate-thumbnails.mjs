import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const homeDir = resolve(root, 'public', 'assets', 'home')
const teamsDir = resolve(root, 'public', 'assets', 'teams')

const MATCHES = [
  ['Tauro FC', 'Plaza Amador'],
  ['Sporting San Miguelito', 'Alianza FC'],
  ['CA Independiente', 'San Francisco FC'],
  ['Árabe Unido', 'Potros del Este'],
  ['Herrera FC', 'Veraguas United'],
  ['Universitario', 'Independiente FC'],
]

// teams with a real downloaded crest
const CREST = {
  'Tauro FC': 'tauro-fc',
  'Plaza Amador': 'plaza-amador',
  'Sporting San Miguelito': 'sporting-san-miguelito',
  'Alianza FC': 'alianza-fc',
  'CA Independiente': 'ca-independiente',
  'San Francisco FC': 'san-francisco-fc',
  'Potros del Este': 'potros-del-este',
  'Universitario': 'universitario',
  'Independiente FC': 'independiente-fc',
}

// fallback badge for the 3 clubs without a crest
const BADGE = {
  'Árabe Unido': { code: 'ARU', bg: '#123b8c', fg: '#ffffff' },
  'Herrera FC': { code: 'HER', bg: '#e0a800', fg: '#111111' },
  'Veraguas United': { code: 'VER', bg: '#0f7a3d', fg: '#ffffff' },
}

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

function backgroundSvg([a, b]) {
  return `<svg width="800" height="400" viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#032a5c"/>
      <stop offset="1" stop-color="#010c1e"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.5" cy="0.35" r="0.6">
      <stop offset="0" stop-color="#0b3d7c" stop-opacity="0.6"/>
      <stop offset="1" stop-color="#010c1e" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="800" height="400" fill="url(#bg)"/>
  <rect width="800" height="400" fill="url(#glow)"/>
  <text x="400" y="160" dy="0.35em" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="46" font-weight="800" fill="#ffffff">VS</text>
  <text x="240" y="278" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="600" fill="#ffffff">${esc(a)}</text>
  <text x="560" y="278" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="600" fill="#ffffff">${esc(b)}</text>
  <text x="400" y="360" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="14" font-weight="600" fill="rgba(255,255,255,0.55)" letter-spacing="4">LIGA PANAMEÑA DE FÚTBOL</text>
</svg>`
}

const WHITE_CIRCLE = `<svg width="160" height="160" xmlns="http://www.w3.org/2000/svg"><circle cx="80" cy="80" r="76" fill="#ffffff" stroke="rgba(255,255,255,0.6)" stroke-width="2"/></svg>`

function badgeSvg({ code, bg, fg }) {
  return `<svg width="160" height="160" xmlns="http://www.w3.org/2000/svg"><circle cx="80" cy="80" r="76" fill="${bg}" stroke="rgba(255,255,255,0.7)" stroke-width="3"/><text x="80" y="80" dy="0.35em" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="40" font-weight="700" fill="${fg}">${code}</text></svg>`
}

async function crestBuffer(name) {
  if (CREST[name]) {
    return sharp(resolve(teamsDir, `${CREST[name]}.webp`))
      .resize(140, 140, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toBuffer()
  }
  return Buffer.from(badgeSvg(BADGE[name]))
}

for (let i = 0; i < MATCHES.length; i++) {
  const [a, b] = MATCHES[i]
  const bg = Buffer.from(backgroundSvg([a, b]))
  const leftCrest = await crestBuffer(a)
  const rightCrest = await crestBuffer(b)

  const layers = []
  const leftX = 160
  const rightX = 480
  const top = 80

  if (CREST[a]) {
    layers.push({ input: Buffer.from(WHITE_CIRCLE), left: leftX, top })
    layers.push({ input: leftCrest, left: leftX + 10, top: top + 10 })
  } else {
    layers.push({ input: leftCrest, left: leftX, top })
  }

  if (CREST[b]) {
    layers.push({ input: Buffer.from(WHITE_CIRCLE), left: rightX, top })
    layers.push({ input: rightCrest, left: rightX + 10, top: top + 10 })
  } else {
    layers.push({ input: rightCrest, left: rightX, top })
  }

  await sharp(bg).composite(layers).webp({ quality: 92 }).toFile(resolve(homeDir, `evento-${i + 1}.webp`))
  console.log(`evento-${i + 1}.webp  (${a} vs ${b})`)
}
console.log('done ->', homeDir)
