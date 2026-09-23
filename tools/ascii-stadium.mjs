import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const src = (p) => resolve(root, 'assets', p)

const hexToRgb = (hex) => {
  const h = hex.replace('#', '')
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)]
}

// Palette (in render-approximate order); letter used in ASCII map
const palette = [
  ['s', 'sur-sup-green', '#2e8b3d'],
  ['E', 'este-sup-navy', '#133a8e'],
  ['e', 'este-inf-blue', '#3d9be9'],
  ['R', 'sur-inf-red', '#b3141c'],
  ['W', 'oeste-sup-pink', '#f5a0bc'],
  ['M', 'oeste-inf-magenta', '#e0008a'],
  ['B', 'balboa-pink', '#f5b0b4'],
  ['K', 'parking-cyan', '#22b8e8'],
  ['G', 'pitch-grass', '#4caf50'],
  ['w', 'white/concrete', '#f5f7fa'],
  ['x', 'gray-shadow', '#8a97a8'],
]

const dist = (a, b) => Math.sqrt((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2)

async function ascii(name, cols, rows) {
  const img = sharp(src(name))
  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true })
  const W = info.width
  const H = info.height
  const ch = info.channels

  console.log(`\n=== ${name} ${W}x${H} (grid ${cols}x${rows}) ===`)
  const cellW = W / cols
  const cellH = H / rows
  const lines = []
  for (let gy = 0; gy < rows; gy++) {
    let line = ''
    for (let gx = 0; gx < cols; gx++) {
      let r = 0, g = 0, b = 0, n = 0, aSum = 0
      const x0 = Math.floor(gx * cellW)
      const x1 = Math.floor((gx + 1) * cellW)
      const y0 = Math.floor(gy * cellH)
      const y1 = Math.floor((gy + 1) * cellH)
      const total = (y1 - y0) * (x1 - x0)
      for (let y = y0; y < y1; y++) {
        for (let x = x0; x < x1; x++) {
          const i = (y * W + x) * ch
          const a = ch === 4 ? data[i + 3] : 255
          aSum += a
          if (a > 64) {
            r += data[i]
            g += data[i + 1]
            b += data[i + 2]
            n++
          }
        }
      }
      const alphaAvg = aSum / total
      if (n < total * 0.3 || alphaAvg < 48) {
        line += '.'
        continue
      }
      const avg = [r / n, g / n, b / n]
      let best = '?'
      let bestD = Infinity
      for (const [letter, , hex] of palette) {
        const d = dist(avg, hexToRgb(hex))
        if (d < bestD) {
          bestD = d
          best = letter
        }
      }
      line += bestD < 90 ? best : '?'
    }
    lines.push(line)
  }
  console.log(lines.join('\n'))
  console.log('\nLegend:')
  for (const [letter, label, hex] of palette) console.log(`  ${letter} = ${label} (${hex})`)
  console.log('  . = transparent, ? = unknown')
}

await ascii('estadio-3d.webp', 60, 45)
