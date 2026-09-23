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

function render(x0, x1, y0, y1, S, mode) {
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
          if (l > 165) bright++
          if (p[2] > 120 && p[2] > p[0] + 25 && p[0] < 130) azure++
        }
      const n = S * S
      if (mode === 'white') line += bright > n * 0.25 ? '#' : '.'
      else line += azure > n * 0.25 ? '@' : '.'
    }
    rows.push(line)
  }
  return rows.join('\n')
}

console.log('=== WHITE line (y168..220) LEFT ===')
console.log(render(40, 380, 168, 220, 3, 'white'))
console.log('=== WHITE line (y168..220) RIGHT ===')
console.log(render(380, 712, 168, 220, 3, 'white'))
console.log('=== AZURE line (y222..288) LEFT ===')
console.log(render(40, 380, 222, 288, 3, 'azure'))
console.log('=== AZURE line (y222..288) RIGHT ===')
console.log(render(380, 712, 222, 288, 3, 'azure'))
