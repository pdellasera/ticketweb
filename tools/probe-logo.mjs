import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import sharp from 'sharp'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const src = (p) => resolve(root, 'assets', p)

async function render(name, S) {
  const img = sharp(src(name))
  const { width, height } = await img.metadata()
  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true })
  const ch = info.channels
  const px = (x, y) => {
    const i = (y * width + x) * ch
    return [data[i], data[i + 1], data[i + 2], ch === 4 ? data[i + 3] : 255]
  }
  console.log(`\n=== ${name} ${width}x${height} (S=${S}) ===`)
  const rows = []
  for (let y = 0; y + S <= height; y += S) {
    let line = ''
    for (let x = 0; x + S <= width; x += S) {
      let opaque = 0, dark = 0, blue = 0, white = 0
      for (let dy = 0; dy < S; dy++)
        for (let dx = 0; dx < S; dx++) {
          const p = px(x + dx, y + dy)
          if (p[3] < 128) continue
          opaque++
          const l = (p[0] + p[1] + p[2]) / 3
          if (l < 90) dark++
          else if (l > 200) white++
          else if (p[2] > 100 && p[2] > p[0] + 30) blue++
        }
      const n = S * S
      if (opaque < n * 0.15) line += '.'
      else if (white > n * 0.3) line += 'W'
      else if (blue > n * 0.3) line += 'B'
      else if (dark > n * 0.3) line += '#'
      else line += 'o'
    }
    rows.push(line)
  }
  console.log(rows.join('\n'))
}

await render('logo.png', 20)
await render('logo_white.webp', 4)
