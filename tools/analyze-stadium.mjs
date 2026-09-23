import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const src = (p) => resolve(root, 'assets', p)

const zones = [
  ['sur-sup', '#2e8b3d'],
  ['este-sup', '#133a8e'],
  ['este-inf', '#3d9be9'],
  ['sur-inf', '#b3141c'],
  ['oeste-sup', '#f5a0bc'],
  ['oeste-inf', '#e0008a'],
  ['balboa', '#f5b0b4'],
  ['parking', '#22b8e8'],
]

const hexToRgb = (hex) => {
  const h = hex.replace('#', '')
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)]
}

const dist = (a, b) => Math.sqrt((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2)

async function opaqueBounds(name) {
  const { data, info } = await sharp(src(name)).raw().toBuffer({ resolveWithObject: true })
  const { width, height, channels } = info
  let minX = width, minY = height, maxX = 0, maxY = 0, opaque = 0
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const a = channels === 4 ? data[(y * width + x) * channels + 3] : 255
      if (a > 16) {
        opaque++
        if (x < minX) minX = x
        if (x > maxX) maxX = x
        if (y < minY) minY = y
        if (y > maxY) maxY = y
      }
    }
  }
  const pct = (n, d) => ((n / d) * 100).toFixed(1)
  console.log(`\n${name} ${width}x${height}  opaquePx=${opaque}`)
  console.log(`  opaque bbox: x ${pct(minX, width)}–${pct(maxX, width)}%  y ${pct(minY, height)}–${pct(maxY, height)}%`)
  return { data, info }
}

async function analyze(name, threshold = 70) {
  const { data, info } = await opaqueBounds(name)
  const { width, height, channels } = info
  console.log(`  (zone match threshold=${threshold})`)
  for (const [label, hex] of zones) {
    const target = hexToRgb(hex)
    let minX = width, minY = height, maxX = 0, maxY = 0, count = 0
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const i = (y * width + x) * channels
        const a = channels === 4 ? data[i + 3] : 255
        if (a < 128) continue
        const px = [data[i], data[i + 1], data[i + 2]]
        if (dist(px, target) < threshold) {
          count++
          if (x < minX) minX = x
          if (x > maxX) maxX = x
          if (y < minY) minY = y
          if (y > maxY) maxY = y
        }
      }
    }
    const pct = (n, d) => ((n / d) * 100).toFixed(1)
    if (count > 200) {
      console.log(
        `${label.padEnd(10)} ${hex}  n=${String(count).padStart(7)}  x:${pct(minX, width)}–${pct(maxX, width)}%  y:${pct(minY, height)}–${pct(maxY, height)}%  ctr:${pct((minX + maxX) / 2, width)}%,${pct((minY + maxY) / 2, height)}%`,
      )
    } else {
      console.log(`${label.padEnd(10)} ${hex}  n=${String(count).padStart(7)}  (below noise floor)`)
    }
  }
}

await analyze('estadio-3d.webp', 70)
await analyze('mapa de estadio.png', 70)
