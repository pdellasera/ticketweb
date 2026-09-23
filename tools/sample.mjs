import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const src = (p) => resolve(root, 'assets', p)

async function avgOpaque(name) {
  const img = sharp(src(name))
  const { width, height } = await img.metadata()
  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true })
  const ch = info.channels
  let r = 0
  let g = 0
  let b = 0
  let n = 0
  for (let i = 0; i < data.length; i += ch) {
    const a = ch === 4 ? data[i + 3] : 255
    if (a > 128) {
      r += data[i]
      g += data[i + 1]
      b += data[i + 2]
      n++
    }
  }
  const avg = n ? [Math.round(r / n), Math.round(g / n), Math.round(b / n)] : [0, 0, 0]
  const lum = 0.2126 * avg[0] + 0.7152 * avg[1] + 0.0722 * avg[2]
  console.log(`${name.padEnd(26)} ${String(width).padStart(5)}x${String(height).padEnd(5)} avgOpaque=rgb(${avg.join(', ')}) luminance=${lum.toFixed(0)}`)
}

console.log('\n== Brand / photo color sampling ==')
await avgOpaque('logo.png')
await avgOpaque('logo_white.png')
await avgOpaque('icon.png')
await avgOpaque('background_login.png')
await avgOpaque('sidebar_background.webp')
await avgOpaque('mapa de estadio.png')
