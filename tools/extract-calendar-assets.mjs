import { mkdir } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import sharp from 'sharp'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const src = resolve(root, 'assets', 'calendario_screem.png')
const outDir = resolve(root, 'public', 'assets', 'calendar')

const base = sharp(src)
const { width, height } = await base.metadata()
const { data, info } = await base.clone().raw().toBuffer({ resolveWithObject: true })
const ch = info.channels
const lum = (x, y) => {
  const i = (y * width + x) * ch
  return (data[i] + data[i + 1] + data[i + 2]) / 3
}

await mkdir(outDir, { recursive: true })

// Reference: 887x1774 px = 430x860 CSS (scale 2.0628).
// Event cards on the selected day (Oct 12) measured at card tops 942 / 1162 / 1387:
//   card 1 = football  -> rendered dynamically in JSX (skip)
//   card 2 = concert   -> concierto.webp
//   card 3 = theatre   -> teatro.webp
// Thumbnails are the dark photo region inside each card (x ~44..303).
const CARDS = [
  { top: 1162, name: 'concierto' },
  { top: 1387, name: 'teatro' },
]
const T = 246 // below card-white (~252) -> photo content

for (const { top, name } of CARDS) {
  const midY = top + 92
  let x0 = -1
  let x1 = -1
  for (let x = 40; x < 320; x++) if (lum(x, midY) < T) { x0 = x; break }
  for (let x = 320; x >= 40; x--) if (lum(x, midY) < T) { x1 = x; break }
  let y0 = -1
  let y1 = -1
  for (let y = top; y < top + 190; y++) if (lum(150, y) < T) { y0 = y; break }
  for (let y = top + 190; y >= top; y--) if (lum(150, y) < T) { y1 = y; break }

  const left = Math.max(40, x0 - 1)
  const w = x1 - left + 2
  const t = Math.max(top, y0 - 1)
  const h = y1 - t + 2
  console.log(`${name}  x=${x0}..${x1} y=${y0}..${y1}  -> crop(${left},${t},${w},${h})`)

  await sharp(src)
    .extract({ left, top: t, width: w, height: h })
    .resize(252, 182, { fit: 'fill' })
    .webp({ quality: 88, effort: 6 })
    .toFile(resolve(outDir, `${name}.webp`))
}

// "otros" has no reference thumbnail in the mock -> generated brand placeholder.
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="252" height="182" viewBox="0 0 252 182">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#0e3a6e"/>
      <stop offset="1" stop-color="#051d3d"/>
    </linearGradient>
  </defs>
  <rect width="252" height="182" fill="url(#g)"/>
  <circle cx="126" cy="76" r="30" fill="rgba(255,255,255,0.10)"/>
  <circle cx="126" cy="76" r="21" fill="rgba(255,255,255,0.16)"/>
  <text x="126" y="150" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="16" font-weight="700" fill="rgba(255,255,255,0.92)">GameGate</text>
</svg>`
await sharp(Buffer.from(svg)).webp({ quality: 88, effort: 6 }).toFile(resolve(outDir, 'otros.webp'))

console.log('done -> public/assets/calendar/')
