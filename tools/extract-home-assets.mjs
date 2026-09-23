import { mkdir } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import sharp from 'sharp'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const src = resolve(root, 'assets', 'home_example.png')
const outDir = resolve(root, 'public', 'assets', 'home')

const base = sharp(src)
const { width, height } = await base.metadata()
const { data, info } = await base.clone().raw().toBuffer({ resolveWithObject: true })
const ch = info.channels
const lum = (x, y) => {
  const i = (y * width + x) * ch
  return (data[i] + data[i + 1] + data[i + 2]) / 3
}

await mkdir(outDir, { recursive: true })

// Thumbnail boxes are inside each card: card tops measured at 586 + 168*n,
// thumbnails inset ~6px from the card top. Detect exact edges via lum threshold.
const CARD_TOPS = [586, 754, 922, 1090, 1258, 1426]
const T = 246 // below card-white (~252) -> photo content

for (let i = 0; i < CARD_TOPS.length; i++) {
  const top = CARD_TOPS[i]
  const midY = top + 70
  let x0 = -1
  let x1 = -1
  for (let x = 40; x < 300; x++) if (lum(x, midY) < T) { x0 = x; break }
  for (let x = 300; x >= 40; x--) if (lum(x, midY) < T) { x1 = x; break }
  let y0 = -1
  let y1 = -1
  for (let y = top; y < top + 160; y++) if (lum(150, y) < T) { y0 = y; break }
  for (let y = top + 160; y >= top; y--) if (lum(150, y) < T) { y1 = y; break }

  const left = Math.max(40, x0 - 1)
  const w = x1 - left + 2
  const t = Math.max(top, y0 - 1)
  const h = y1 - t + 2
  console.log(`evento-${i + 1}  x=${x0}..${x1} y=${y0}..${y1}  -> crop(${left},${t},${w},${h})`)

  await sharp(src)
    .extract({ left, top: t, width: w, height: h })
    .webp({ quality: 88, effort: 6 })
    .toFile(resolve(outDir, `evento-${i + 1}.webp`))
}

// Hero strip: clean region (right of the headline/paragraph, below header, above search bar)
await sharp(src)
  .extract({ left: 380, top: 122, width: 507, height: 168 })
  .webp({ quality: 82, effort: 6 })
  .toFile(resolve(outDir, 'hero-stadium.webp'))

console.log('done -> public/assets/home/')
