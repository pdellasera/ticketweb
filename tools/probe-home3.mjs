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

// Most common "dark text" color in a region (pixels with lum<180, the glyphs)
function textColor(x0, x1, y0, y1) {
  const map = new Map()
  for (let y = y0; y <= y1; y++) {
    for (let x = x0; x <= x1; x++) {
      if (lum(x, y) < 170) {
        const p = px(x, y)
        const key = p.slice(0, 3).join(',')
        map.set(key, (map.get(key) ?? 0) + 1)
      }
    }
  }
  const sorted = [...map.entries()].sort((a, b) => b[1] - a[1])
  return sorted.slice(0, 4).map(([k, n]) => '#' + k.split(',').map((v) => Number(v).toString(16).padStart(2, '0')).join('') + `(${n})`).join(' ')
}

console.log('TITLE (card1):', textColor(328, 610, 598, 616))
console.log('COMPETITION:', textColor(328, 500, 625, 640))
console.log('META text:', textColor(350, 620, 652, 732))
console.log('DESDE label:', textColor(640, 720, 612, 634))
console.log('PRICE:', textColor(640, 810, 638, 664))
console.log('BUTTON label (white on blue):', textColor(650, 830, 676, 724))
console.log('NAV inactive label:', textColor(280, 400, 1690, 1706))
console.log('NAV active label:', textColor(70, 150, 1690, 1706))
console.log('PILL inactive text:', textColor(192, 304, 468, 502))
console.log('PILL active text (white):', textColor(46, 176, 468, 502))
console.log('HEADING:', textColor(46, 300, 541, 567))
console.log('VER CALENDARIO:', textColor(680, 840, 541, 567))
console.log('SEARCH placeholder:', textColor(130, 440, 402, 430))
console.log('HERO paragraph (white):', textColor(46, 700, 296, 340))
console.log('HEADER subtitle (taquilla):', textColor(718, 860, 100, 130))
