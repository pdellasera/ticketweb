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

function render(x0, y0, x1, y1, S, mode) {
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
          if (l > 168) bright++
          if (p[2] > 120 && p[2] > p[0] + 25 && p[0] < 130) azure++
        }
      const n = S * S
      if (mode === 'white') line += bright > n * 0.3 ? '#' : '.'
      else line += azure > n * 0.3 ? '@' : '.'
    }
    rows.push(line)
  }
  return rows.join('\n')
}

console.log('WHITE line (y165..222):')
console.log(render(40, 165, 710, 222, 2, 'white'))
console.log('\nAZURE line (y222..290):')
console.log(render(40, 222, 710, 290, 2, 'azure'))
