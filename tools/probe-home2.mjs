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
const hex = (x, y) => '#' + px(x, y).slice(0, 3).map((c) => c.toString(16).padStart(2, '0')).join('')

// Hero bottom edge (scan up from y=430, first dark = hero edge). Text is white so ignored.
console.log('HERO bottom edge (x -> y where hero ends):')
for (let x = 2; x <= 140; x += 2) {
  let edge = -1
  for (let y = 430; y >= 320; y--) if (lum(x, y) < 200) { edge = y; break }
  process.stdout.write(x + ':' + edge + ' ')
  if (x % 20 === 0) process.stdout.write('\n')
}
process.stdout.write('\n')

// Right side hero edge
console.log('HERO bottom edge right (x -> y):')
for (const x of [600, 640, 680, 700, 720, 760, 800, 830, 845, 860, 875, 885]) {
  let edge = -1
  for (let y = 430; y >= 320; y--) if (lum(x, y) < 200) { edge = y; break }
  console.log('  x=' + x, 'edge=' + edge)
}

// Clean page bg samples
console.log('\nPAGE BG samples (should be ~#fafcfd):')
for (const [x, y] of [[880, 470], [880, 980], [443, 470], [880, 1520], [443, 1460], [443, 1520]])
  console.log('  ', x + ',' + y, hex(x, y))

// Card 1 exact samples (edges + interior)
console.log('\nCARD1 edges:')
for (const [x, y] of [[46, 586], [45, 586], [56, 586], [100, 586], [300, 586], [500, 586], [700, 586], [838, 586], [839, 586], [840, 586], [841, 586], [843, 586], [46, 700], [840, 700], [841, 700], [443, 620], [443, 740], [46, 741], [840, 741]])
  console.log('  ', x + ',' + y, hex(x, y), 'lum=' + lum(x, y).toFixed(1))

// Thumbnail box card1: scan center vertical (x=172) and horizontal (y=656)
console.log('\nTHUMB card1 center col x=172 (y -> color):')
for (let y = 584; y <= 745; y += 2) {
  const l = lum(172, y)
  if (y % 4 === 0) process.stdout.write(y + ':' + (l < 244 ? 'P' : '.') + ' ')
}
process.stdout.write('\n')
console.log('THUMB card1 row y=656 (x -> color) left zone:')
for (let x = 40; x <= 300; x += 2) {
  const l = lum(x, 656)
  process.stdout.write(x + ':' + (l < 244 ? 'P' : '.') + ' ')
  if (x % 40 === 0) process.stdout.write('\n')
}
process.stdout.write('\n')

// Search bar edges via exact samples (left + right + Filtros right)
console.log('\nSEARCH bar left edge samples y=415:')
for (const x of [50, 52, 54, 55, 56, 57, 58, 60, 62]) console.log('  x=' + x, hex(x, 415), 'lum=' + lum(x, 415).toFixed(1))
console.log('SEARCH bar right edge samples y=415:')
for (const x of [692, 694, 695, 696, 697, 698, 700, 702, 704]) console.log('  x=' + x, hex(x, 415), 'lum=' + lum(x, 415).toFixed(1))
console.log('FILTROS button right edge samples y=415:')
for (const x of [826, 828, 830, 832, 836, 840, 844, 848, 852, 856, 860, 864, 868, 872, 876, 880]) console.log('  x=' + x, hex(x, 415), 'lum=' + lum(x, 415).toFixed(1))

// Search bar + Filtros top/bottom (vertical scan at x=443 for bar, x=760 for Filtros)
console.log('\nSEARCH bar vertical x=443 (y=360..460):')
for (let y = 360; y <= 460; y += 2) process.stdout.write(y + ':' + (lum(443, y) < 246 ? 'B' : '.') + ' ')
process.stdout.write('\nFILTROS vertical x=760 (y=360..460):')
for (let y = 360; y <= 460; y += 2) process.stdout.write(y + ':' + (lum(760, y) < 246 ? 'B' : '.') + ' ')
process.stdout.write('\n')

// Card 2 / 3 border verification (what does the border look like)
console.log('\nCARD2/3 top border samples:')
for (const [x, y] of [[46, 754], [300, 754], [500, 754], [839, 754], [46, 922], [300, 922], [500, 922], [839, 922], [46, 923], [46, 921]])
  console.log('  ', x + ',' + y, hex(x, y), 'lum=' + lum(x, y).toFixed(1))

// Card vertical structure (x=443, scan y 570..760 to find card top/bottom + gaps)
console.log('\nCARD1 vertical structure x=443 (y=560..760, "|"=border-ish lum<248, "."=white):')
for (let y = 560; y <= 760; y++) {
  const l = lum(443, y)
  process.stdout.write(y + ':' + (l < 248 ? '|' : '.') + ' ')
  if (y % 20 === 19) process.stdout.write('\n')
}
process.stdout.write('\n')
