import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import sharp from 'sharp'

/**
 * Mis tickets probe — reads assets/mis_tickets.png (887x1774).
 *
 * Usage:
 *   node tools/probe-tickets.mjs tabs | hero | banner | body | qr | buttons | card2 | type | geom
 */
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const img = sharp(resolve(root, 'assets', 'mis_tickets.png'))
const { width } = await img.metadata()
const { data, info } = await img.raw().toBuffer({ resolveWithObject: true })
const ch = info.channels
const section = process.argv[2] ?? 'all'

const avg = (x, y) => {
  const i = (y * width + x) * ch
  return (data[i] + data[i + 1] + data[i + 2]) / 3
}
const sum = (x, y) => {
  const i = (y * width + x) * ch
  return data[i] + data[i + 1] + data[i + 2]
}

function ascii(x0, x1, y0, y1, { dark = true, step = 1 } = {}) {
  const lines = []
  for (let y = y0; y <= y1; y += step) {
    let line = ''
    for (let x = x0; x <= x1; x += step) {
      const l = avg(x, y)
      let c
      if (dark) c = l < 90 ? '#' : l < 160 ? '+' : l < 215 ? '.' : ' '
      else c = l > 215 ? '#' : l > 130 ? '+' : l > 70 ? '.' : ' '
      line += c
    }
    lines.push(line)
  }
  return lines.join('\n')
}

function report(name, x0, x1, y0, y1, dark, threshold) {
  const rows = []
  for (let y = y0; y <= y1; y++) {
    let ink = 0
    for (let x = x0; x <= x1; x++) ink += dark ? Math.max(0, threshold - sum(x, y)) : Math.max(0, sum(x, y) - threshold)
    rows.push([y, ink])
  }
  const max = Math.max(...rows.map(([, v]) => v))
  let asc = -1
  let xTop = -1
  let base = -1
  for (const [y, v] of rows) {
    if (asc < 0 && v > max * 0.05) asc = y
    if (xTop < 0 && v > max * 0.35) xTop = y
    if (v > max * 0.5) base = y
  }
  if (asc < 0) return console.log(`${name.padEnd(26)} (no ink)`)
  const cap = base - asc
  const em = cap / 0.727
  console.log(`${name.padEnd(26)} asc=${asc} xTop=${xTop} base=${base} cap=${cap} xH=${base - xTop} -> ~${em.toFixed(1)}px`)
}

if (section === 'tabs' || section === 'all') {
  console.log('===== TABS =====')
  console.log(ascii(30, 860, 302, 356, { step: 2 }))
}

if (section === 'tab3' || section === 'all') {
  console.log('===== TAB 3 =====')
  console.log(ascii(540, 720, 302, 340, { step: 1 }))
}

if (section === 'hero' || section === 'all') {
  console.log('\n===== HERO TITLE + SUBTITLE =====')
  console.log(ascii(26, 700, 168, 262, { dark: false, step: 2 }))
}

if (section === 'subtitle' || section === 'all') {
  console.log('===== SUBTITLE =====')
  console.log(ascii(28, 620, 232, 260, { dark: false, step: 1 }))
}

if (section === 'nav' || section === 'all') {
  console.log('===== NAV (4 tabs) =====')
  const which = process.argv[3]
  for (const [n, a, b] of [['1', 20, 200], ['2', 200, 380], ['3', 380, 560], ['4', 560, 760]]) {
    if (which && which !== n) continue
    console.log(`--- nav ${n} (icon+label) ---`)
    console.log(ascii(a, b, 1600, 1700, { step: 1 }))
  }
}

if (section === 'wordscan' || section === 'all') {
  console.log('===== SUBTITLE WORD GAPS (columns with no ink) =====')
  const gaps = []
  let inGap = false
  let gapStart = 0
  for (let x = 28; x <= 624; x++) {
    let hasInk = false
    for (let y = 240; y <= 248; y++) if (sum(x, y) > 540) hasInk = true
    if (!hasInk && !inGap) { inGap = true; gapStart = x }
    else if (hasInk && inGap) { inGap = false; if (x - gapStart >= 4) gaps.push([gapStart, x - 1]) }
  }
  let words = []
  let cur = 28
  for (const [g0, g1] of gaps) {
    if (g0 - cur >= 4) words.push([cur, g0 - 1])
    cur = g1 + 1
  }
  if (624 - cur >= 4) words.push([cur, 624])
  console.log(words.map(([a, b]) => `[${a}-${b} w=${b - a + 1}]`).join(' '))
}

if (section === 'subrow' || section === 'all') {
  console.log('===== SUBTITLE (single line) =====')
  console.log(ascii(28, 624, 240, 250, { dark: false, step: 1 }))
}

if (section === 'subL' || section === 'all') {
  console.log('===== SUBTITLE LEFT =====')
  console.log(ascii(28, 330, 234, 258, { dark: false, step: 1 }))
}

if (section === 'subR' || section === 'all') {
  console.log('===== SUBTITLE RIGHT =====')
  console.log(ascii(330, 624, 234, 258, { dark: false, step: 1 }))
}

if (section === 'tab2' || section === 'all') {
  console.log('===== TAB 2 =====')
  console.log(ascii(300, 480, 302, 340, { step: 1 }))
}

if (section === 'banner' || section === 'all') {
  console.log('\n===== CARD1 BANNER INFO COLUMN =====')
  console.log(ascii(548, 850, 490, 602, { dark: false, step: 1 }))
}

if (section === 'body' || section === 'all') {
  console.log('\n===== CARD1 BODY ROWS =====')
  console.log(ascii(45, 600, 630, 812, { step: 2 }))
}

if (section === 'qr' || section === 'all') {
  console.log('\n===== CARD1 QR PANEL =====')
  console.log(ascii(600, 850, 622, 812, { step: 2 }))
}

if (section === 'btn' || section === 'buttons' || section === 'all') {
  const which = process.argv[3]
  const buttons = [['A', 50, 325], ['B', 325, 585], ['C', 580, 845]]
  for (const [n, a, b] of buttons) {
    if (which && which !== n) continue
    console.log(`--- button ${n} ---`)
    console.log(ascii(a, b, 838, 876, { step: 1 }))
  }
}

if (section === 'card2' || section === 'all') {
  console.log('\n===== CARD2 BANNER INFO =====')
  console.log(ascii(548, 850, 1002, 1120, { dark: false, step: 1 }))
  console.log('\n===== CARD2 BODY ROWS =====')
  console.log(ascii(45, 600, 1142, 1330, { step: 2 }))
}

if (section === 'type' || section === 'all') {
  console.log('\n===== TYPOGRAPHY =====')
  report('h1 "Mis tickets"', 30, 420, 172, 224, false, 540)
  report('subtitle', 30, 620, 230, 260, false, 540)
  report('tab label (Próximos)', 94, 240, 302, 340, true, 360)
  report('detail label (Sección)', 58, 200, 636, 662, true, 360)
  report('detail value (Norte)', 282, 340, 636, 662, true, 360)
  report('QR code text', 600, 800, 748, 772, true, 360)
  report('button label A', 70, 320, 840, 872, true, 360)
}

if (section === 'geom' || section === 'all') {
  console.log('\n===== GEOMETRY =====')
  function colDark(x, y0, y1) {
    let top = -1
    let bottom = -1
    for (let y = y0; y <= y1; y++) if (avg(x, y) < 140) { if (top < 0) top = y; bottom = y }
    return top < 0 ? null : [top, bottom]
  }
  for (const x of [60, 200, 443]) {
    console.log(`x=${x} card1 banner:`, colDark(x, 360, 620), ' card2 banner:', colDark(x, 920, 1140), ' card3 banner:', colDark(x, 1440, 1580))
  }
  console.log('card gap x=60 y=926..952:', Array.from({ length: 27 }, (_, k) => `${926 + k}:${avg(60, 926 + k).toFixed(0)}`).join(' '))
  console.log('nav pill y=1640 x=430..680:', Array.from({ length: 13 }, (_, k) => `${430 + k * 20}:${avg(430 + k * 20, 1640).toFixed(0)}`).join(' '))
}

// ---- TICKET.png (ticket stub reference, 464x683) ----
if (section === 'stub' || section === 'all') {
  const img2 = sharp(resolve(root, 'assets', 'TICKET.png'))
  const m2 = await img2.metadata()
  const b2 = await img2.raw().toBuffer({ resolveWithObject: true })
  const d2 = b2.data
  const w2 = b2.info.width
  const c2 = b2.info.channels
  const px2 = (x, y) => {
    const i = (y * w2 + x) * c2
    return [d2[i], d2[i + 1], d2[i + 2]]
  }
  console.log('\n===== TICKET.png (ticket stub) =====')
  console.log('size', m2.width, m2.height)
  console.log('card ~x68..364 (296px), header y58..276 (218), boxes y292..348 (single continuous block x115..332, NO gaps), map y388..490 (137), tear y503, barcode y528..570')
  console.log('box bg', px2(216, 300), ' map bg', px2(216, 470), ' label ink', px2(128, 376), ' tear', px2(216, 503))
}
