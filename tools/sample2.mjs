import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const src = (p) => resolve(root, 'assets', p)

async function classify(name) {
  const img = sharp(src(name))
  const { width, height } = await img.metadata()
  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true })
  const ch = info.channels
  let white = 0
  let dark = 0
  let blue = 0
  let opaque = 0
  const samples = []
  for (let i = 0; i < data.length; i += ch) {
    const a = ch === 4 ? data[i + 3] : 255
    if (a < 128) continue
    opaque++
    const r = data[i]
    const g = data[i + 1]
    const b = data[i + 2]
    if (r > 210 && g > 210 && b > 210) white++
    else if (r < 80 && g < 80 && b < 80) dark++
    else if (b > r && b > 100 && r < 120) blue++
    if (samples.length < 6) samples.push(`(${r},${g},${b})`)
  }
  const pct = (n) => `${((n / opaque) * 100).toFixed(1)}%`
  console.log(
    `${name.padEnd(24)} ${String(width).padStart(5)}x${String(height).padEnd(5)} opaque=${opaque}  white=${pct(white)} dark=${pct(dark)} blue=${pct(blue)}  firstPx=[${samples.join(' ')}]`,
  )
}

console.log('\n== Pixel classification ==')
await classify('logo.png')
await classify('logo_white.png')
await classify('logo_white.webp')
await classify('icon.png')
