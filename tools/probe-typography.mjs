import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import sharp from 'sharp'

/**
 * Typography probe — measures the ink profile (row by row) of the reference
 * mockup to derive ascender-top, x-height-top and baseline, then infers the
 * font size (using Inter's cap ratio ~0.727).
 *
 * Usage: node tools/probe-typography.mjs
 */
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const img = sharp(resolve(root, 'assets', 'home_example.png'))
const { width } = await img.metadata()
const { data, info } = await img.raw().toBuffer({ resolveWithObject: true })
const ch = info.channels

// mode 'light' = light glyphs on a dark surface; 'dark' = dark glyphs on light.
function profile(x0, x1, y0, y1, mode, threshold) {
  const rows = []
  for (let y = y0; y <= y1; y++) {
    let ink = 0
    for (let x = x0; x <= x1; x++) {
      const i = (y * width + x) * ch
      const s = data[i] + data[i + 1] + data[i + 2]
      ink += mode === 'dark' ? Math.max(0, threshold - s) : Math.max(0, s - threshold)
    }
    rows.push([y, ink])
  }
  return rows
}

function report(name, x0, x1, y0, y1, mode, threshold) {
  const rows = profile(x0, x1, y0, y1, mode, threshold)
  const max = Math.max(...rows.map(([, v]) => v))
  let asc = -1
  let xTop = -1
  let base = -1
  for (const [y, v] of rows) {
    if (asc < 0 && v > max * 0.05) asc = y
    if (xTop < 0 && v > max * 0.35) xTop = y
    if (v > max * 0.5) base = y
  }
  const cap = base - asc
  const xH = base - xTop
  const em = cap / 0.727
  console.log(`${name.padEnd(24)} asc=${asc} xTop=${xTop} base=${base}  cap=${cap}px xH=${xH}px  -> ~${em.toFixed(1)}px`)
}

console.log('== Typography metrics (reference mockup) ==')
report('hero headline', 46, 480, 165, 240, 'light', 540)
report('hero paragraph', 46, 660, 296, 356, 'light', 540)
report('section heading', 46, 300, 538, 570, 'dark', 360)
report('card title', 322, 570, 596, 620, 'dark', 360)
report('competition', 322, 500, 622, 642, 'dark', 600)
report('price', 644, 814, 638, 664, 'dark', 360)
report('placeholder', 128, 440, 400, 430, 'dark', 600)
report('pills', 46, 172, 470, 500, 'light', 620)
report('nav label', 80, 148, 1688, 1710, 'dark', 600)
