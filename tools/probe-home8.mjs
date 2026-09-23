import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import sharp from 'sharp'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const img = sharp(resolve(root, 'assets', 'home_example.png'))
const { width, height } = await img.metadata()
const { data, info } = await img.raw().toBuffer({ resolveWithObject: true })
const ch = info.channels
const lum = (x, y) => {
  const i = (y * width + x) * ch
  return (data[i] + data[i + 1] + data[i + 2]) / 3
}
const hex = (x, y) => {
  const i = (y * width + x) * ch
  return '#' + [data[i], data[i + 1], data[i + 2]].map((c) => c.toString(16).padStart(2, '0')).join('')
}

// pills: find segments at y=485 where color != page bg (lum < 248)
function segs(y, pred) {
  const out = []
  let s = -1
  for (let x = 0; x < width; x++) {
    if (pred(x)) { if (s < 0) s = x } else if (s >= 0) { out.push([s, x - 1]); s = -1 }
  }
  if (s >= 0) out.push([s, width - 1])
  return out
}

console.log('pills y=485 (lum<248):', segs(485, (x) => lum(x, 485) < 248).map((s) => s.join('..')).join('  '))
console.log('pills y=486:', segs(486, (x) => lum(x, 486) < 248).map((s) => s.join('..')).join('  '))
// colors at each pill center
console.log('sample colors:')
for (const [x, y] of [[90, 485], [250, 485], [400, 485], [540, 485]])
  console.log('  ', x + ',' + y, hex(x, y), 'lum=' + lum(x, y).toFixed(0))
// pill vertical extent
for (const x of [90, 250, 400, 540]) {
  let y0 = -1, y1 = -1
  for (let y = 440; y < 530; y++) if (lum(x, y) < 248) { y0 = y; break }
  for (let y = 530; y >= 440; y--) if (lum(x, y) < 248) { y1 = y; break }
  console.log('  pill x=' + x, 'y', y0, '..', y1)
}
