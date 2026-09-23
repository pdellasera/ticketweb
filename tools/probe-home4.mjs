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
  return [data[i], data[i + 1], data[i + 2], ch === 4 ? data[i + 3] : 255]
}
const lum = (x, y) => (px(x, y)[0] + px(x, y)[1] + px(x, y)[2]) / 3

function bbox(x0, x1, y0, y1, pred) {
  let X0 = Infinity, X1 = -Infinity, Y0 = Infinity, Y1 = -Infinity
  for (let y = y0; y <= y1; y++)
    for (let x = x0; x <= x1; x++)
      if (pred(x, y)) {
        if (x < X0) X0 = x
        if (x > X1) X1 = x
        if (y < Y0) Y0 = y
        if (y > Y1) Y1 = y
      }
  return X0 === Infinity ? null : [X0, X1, Y0, Y1]
}
const bright = (x, y) => lum(x, y) > 200
const azure = (x, y) => {
  const p = px(x, y)
  return p[2] > 130 && p[2] > p[0] + 30 && p[0] < 110
}
const red = (x, y) => {
  const p = px(x, y)
  return p[0] > 180 && p[1] < 100 && p[2] < 100
}

console.log('logo mark (azure):', bbox(28, 115, 60, 132, azure))
console.log('wordmark bright (white "Ticket"):', bbox(115, 200, 80, 115, bright))
console.log('wordmark azure ("Gest"):', bbox(115, 275, 80, 115, azure))
console.log('bell (bright):', bbox(640, 720, 70, 125, bright))
console.log('bell red dot:', bbox(640, 720, 70, 125, red))
console.log('avatar circle (bright):', bbox(700, 790, 70, 130, bright))
console.log('profile name bright:', bbox(760, 885, 70, 100, bright))
console.log('profile subtitle:', bbox(760, 885, 100, 130, (x, y) => { const p = px(x, y); return lum(x, y) > 120 && lum(x, y) < 190 }))
console.log('chevron (bright):', bbox(845, 885, 80, 120, bright))
console.log('headline line1 (white):', bbox(40, 700, 160, 230, bright))
console.log('headline line2 (azure):', bbox(40, 700, 215, 285, azure))
console.log('paragraph (white):', bbox(40, 720, 288, 352, bright))
console.log('status time (bright):', bbox(40, 130, 20, 60, bright))
console.log('status right icons (bright):', bbox(760, 885, 20, 60, bright))
