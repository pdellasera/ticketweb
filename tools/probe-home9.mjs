import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import sharp from 'sharp'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const img = sharp(resolve(root, 'assets', 'home_example.png'))
const { width, height } = await img.metadata()
const { data, info } = await img.raw().toBuffer({ resolveWithObject: true })
const ch = info.channels
const hex = (x, y) => {
  const i = (y * width + x) * ch
  return '#' + [data[i], data[i + 1], data[i + 2]].map((c) => c.toString(16).padStart(2, '0')).join('')
}

for (const y of [455, 465, 475, 478, 485, 490, 500, 505]) {
  let line = 'y=' + y + '  '
  for (let x = 40; x <= 620; x += 6) line += hex(x, y) + ' '
  console.log(line + '\n')
}
