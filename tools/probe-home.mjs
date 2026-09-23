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
const lum = (x, y) => {
  const p = px(x, y)
  return (p[0] + p[1] + p[2]) / 3
}
const hex = (x, y) => {
  const p = px(x, y)
  return '#' + p.slice(0, 3).map((c) => c.toString(16).padStart(2, '0')).join('')
}

// Run-length scan along a horizontal line: returns segments [x0,x1] where predicate true.
function hseg(y, y1pred) {
  const segs = []
  let start = -1
  for (let x = 0; x < width; x++) {
    if (y1pred(x)) {
      if (start < 0) start = x
    } else if (start >= 0) {
      segs.push([start, x - 1])
      start = -1
    }
  }
  if (start >= 0) segs.push([start, width - 1])
  return segs
}

// Vertical scan at column x: returns segments [y0,y1] where predicate true.
function vseg(x, pred, y0 = 0, y1 = height - 1) {
  const segs = []
  let start = -1
  for (let y = y0; y <= y1; y++) {
    if (pred(y)) {
      if (start < 0) start = y
    } else if (start >= 0) {
      segs.push([start, y - 1])
      start = -1
    }
  }
  if (start >= 0) segs.push([start, y1])
  return segs
}

const isWhite = (x) => lum(x, 0) > 246 // placeholder; replaced inline where needed

console.log('size', width, 'x', height, 'channels', ch)

// A) Hero bottom / sheet top at the far left and far right edges.
console.log('\nA. sheet top (first light y>200) at left/right edges:')
for (const x of [2, 10, 20, 30, 40, 50, 60, 820, 830, 840, 850, 860, 870, 880]) {
  let top = -1
  for (let y = 330; y < 430; y++) if (lum(x, y) > 200) { top = y; break }
  console.log('  x=' + String(x).padStart(3), 'sheetTop~', top)
}

// B) Search bar + Filtros (horizontal white runs at y=415)
console.log('\nB. y=415 white runs (lum>245):')
console.log('  ', hseg(415, (x) => lum(x, 415) > 245).map((s) => s.join('..')).join('  '))
console.log('   Filtros right edge probe y=415 lum at x=700..886 (first light):')
{
  const l = []
  for (let x = 695; x < 887; x++) l.push(lum(x, 415))
  console.log('   ', l.join(','))
}

// C) Card outer box: find border-color band (lum in 232..244) at several y
console.log('\nC. card outer edges (border lum 230..246) rows:')
for (const y of [586, 754, 922]) {
  const segs = hseg(y, (x) => { const v = lum(x, y); return v > 228 && v < 247 })
  console.log('  y=' + y, segs.map((s) => s.join('..')).join('  '))
}

// D) Thumbnails (dark segments) per card
console.log('\nD. thumbnail dark boxes (lum<110) per card:')
const cardTops = [586, 754, 922, 1090, 1258, 1426]
for (const top of cardTops) {
  const midY = top + 70
  const h = hseg(midY, (x) => lum(x, midY) < 110)
  const v = vseg(140, (y) => lum(140, y) < 110, top, top + 160)
  console.log('  cardTop=' + top, 'thumbX=' + (h[0] ? h[0].join('..') : '?'), 'thumbY=' + (v[0] ? v[0].join('..') : '?'))
}

// E) Pills row y=485 (non-page-bg segments, page bg ~ lum 251)
console.log('\nE. pills y=485 (lum<250):')
console.log('  ', hseg(485, (x) => lum(x, 485) < 250).map((s) => s.join('..')).join('  '))

// F) Header row (bell + avatar) y=95 white runs
console.log('\nF. header y=95 white runs (lum>245):')
console.log('  ', hseg(95, (x) => lum(x, 95) > 245).map((s) => s.join('..')).join('  '))

// G) Text baselines inside card 1: dark text runs
console.log('\nG. card1 dark text rows (lum<140) x=330..600:')
for (const y of [596, 600, 604, 608, 612, 624, 628, 632, 650, 654, 658, 676, 680, 684, 700, 704, 708, 726, 730]) {
  const segs = hseg(y, (x) => lum(x, y) < 140).filter((s) => s[0] >= 320 && s[1] <= 620)
  if (segs.length) console.log('  y=' + y, segs.map((s) => s.join('..')).join('  '))
}

// H) price + button on right column of card 1
console.log('\nH. card1 right col:')
console.log('  price dark at y=645..665 x 620..860:', hseg(652, (x) => lum(x, 652) < 120).map((s) => s.join('..')).join('  '))
console.log('  button (blue) at y=700 x 300..880:', hseg(700, (x) => { const p = px(x, 700); return p[2] > 200 && p[0] < 80 }).map((s) => s.join('..')).join('  '))

// I) Nav bar geometry
console.log('\nI. nav bar y=1662 icon rows (lum<220) + labels y=1698:')
console.log('  icons y=1662:', hseg(1662, (x) => lum(x, 1662) < 220).map((s) => s.join('..')).join('  '))
console.log('  labels y=1698:', hseg(1698, (x) => lum(x, 1698) < 200).map((s) => s.join('..')).join('  '))
console.log('  home indicator y=1750:', hseg(1750, (x) => lum(x, 1750) < 120).map((s) => s.join('..')).join('  '))

// J) Key colors
console.log('\nJ. sampled colors:')
const samples = [
  ['page bg', 443, 500],
  ['hero top', 443, 10],
  ['hero mid', 443, 200],
  ['search bar', 100, 415],
  ['search icon', 92, 415],
  ['search placeholder', 150, 416],
  ['filtros bg', 760, 415],
  ['pill active', 90, 485],
  ['pill inactive', 250, 485],
  ['heading', 90, 554],
  ['ver calendario', 760, 554],
  ['card bg', 443, 650],
  ['title', 340, 606],
  ['competition', 340, 632],
  ['meta text', 360, 660],
  ['price', 660, 652],
  ['button blue', 700, 700],
  ['button label', 700, 700],
  ['nav active icon', 111, 1662],
  ['nav active label', 111, 1698],
  ['nav inactive icon', 333, 1662],
  ['nav bg', 443, 1630],
  ['logo mark', 60, 90],
  ['logo wordmark white', 140, 90],
  ['logo wordmark azure', 210, 90],
]
for (const [name, x, y] of samples) console.log('  ' + name.padEnd(22), hex(x, y))
