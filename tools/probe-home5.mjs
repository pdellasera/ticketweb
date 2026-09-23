import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import sharp from 'sharp'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const img = sharp(resolve(root, 'assets', 'home_example.png'))
const { width, height } = await img.metadata()
const { data, info } = await img.raw().toBuffer({ resolveWithObject: true })
const ch = info.channels
const px = (x, y) => {
  const i = (y * width + x) * ch
  return [data[i], data[i + 1], data[i + 2]]
}

// ASCII render of a region, downsampled by factor S
function render(x0, y0, x1, y1, S) {
  const rows = []
  for (let y = y0; y + S <= y1; y += S) {
    let line = ''
    for (let x = x0; x + S <= x1; x += S) {
      let bright = 0
      let azure = 0
      for (let dy = 0; dy < S; dy++)
        for (let dx = 0; dx < S; dx++) {
          const p = px(x + dx, y + dy)
          const l = (p[0] + p[1] + p[2]) / 3
          if (l > 175) bright++
          if (p[2] > 120 && p[2] > p[0] + 25 && p[0] < 120) azure++
        }
      const n = S * S
      if (azure > n * 0.25) line += 'A'
      else if (bright > n * 0.35) line += '#'
      else line += '.'
    }
    rows.push(line)
  }
  return rows.join('\n')
}

console.log('HEADLINE (y160..292):')
console.log(render(40, 160, 710, 292, 5))
console.log('\nPARAGRAPH (y288..358):')
console.log(render(40, 288, 720, 358, 5))
