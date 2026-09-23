import { mkdir } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import sharp from 'sharp'

// Extracts the stadium plan + club crests from assets/Seleccion1.png (ticket screen).

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const src = resolve(root, 'assets', 'Seleccion1.png')

const stadiumDir = resolve(root, 'public', 'assets', 'stadium')
const teamsDir = resolve(root, 'public', 'assets', 'teams')
await mkdir(stadiumDir, { recursive: true })
await mkdir(teamsDir, { recursive: true })

// ---- Stadium plan: full width, y 628..1037 (measured) ----
await sharp(src)
  .extract({ left: 0, top: 628, width: 887, height: 409 })
  .webp({ quality: 90, effort: 6 })
  .toFile(resolve(stadiumDir, 'secciones-estadio.webp'))
console.log('secciones-estadio.webp  (887x409)')

// ---- Club crests: white/colored logos on a dark navy hero background ----
// Fixed crops measured from the source ASCII (crest positions are stable).
async function extractCrest(crop, outName, label) {
  const { data, info } = await sharp(src)
    .extract(crop)
    .raw()
    .toBuffer({ resolveWithObject: true })
  const { width, height, channels } = info
  const rgba = Buffer.alloc(width * height * 4)
  for (let i = 0; i < width * height; i++) {
    const r = data[i * channels]
    const g = data[i * channels + 1]
    const b = data[i * channels + 2]
    const v = (r + g + b) / 3
    const a = Math.max(0, Math.min(255, Math.round((v - 75) * 4)))
    rgba[i * 4] = r
    rgba[i * 4 + 1] = g
    rgba[i * 4 + 2] = b
    rgba[i * 4 + 3] = a
  }
  await sharp(rgba, { raw: { width, height, channels: 4 } })
    .webp({ quality: 92 })
    .toFile(resolve(teamsDir, outName))
  console.log(`${outName}  ${width}x${height} (${label})`)
}

await extractCrest({ left: 226, top: 152, width: 100, height: 116 }, 'nacional.webp', 'nacional')
await extractCrest({ left: 556, top: 152, width: 112, height: 116 }, 'millonarios.webp', 'millonarios')

console.log('done -> public/assets/stadium + public/assets/teams')
