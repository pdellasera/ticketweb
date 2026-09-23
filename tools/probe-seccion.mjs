import sharp from 'sharp'

// Calibration / geometry probe for assets/Seleccion1.png (ticket purchase screen).
// Prints: (1) bounding boxes of the 5 painted zone colors inside the stadium art,
// (2) the exact RGB at each zone's label anchor, to confirm the art colors.

const SRC = 'assets/Seleccion1.png'

// Art region (measured): full width, y 616..1045.
const ART = { left: 0, top: 616, width: 887, height: 429 }

// Swatch colors measured from the list cards.
const TARGETS = [
  ['norte', [0, 100, 253]],
  ['oriental', [252, 162, 39]],
  ['sur', [236, 75, 70]],
  ['occidental', [16, 150, 72]],
  ['occidental-alta', [134, 56, 198]],
]

const { data, info } = await sharp(SRC).extract(ART).raw().toBuffer({ resolveWithObject: true })
const { width, height, channels } = info
const idx = (x, y) => (y * width + x) * channels
const rgb = (x, y) => [data[idx(x, y)], data[idx(x, y) + 1], data[idx(x, y) + 2]]
const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2])

const TOL = 42

console.log(`art region ${width}x${height}`)
for (const [name, c] of TARGETS) {
  let minX = width, minY = height, maxX = -1, maxY = -1, n = 0
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (dist(rgb(x, y), c) < TOL) {
        n++
        if (x < minX) minX = x
        if (x > maxX) maxX = x
        if (y < minY) minY = y
        if (y > maxY) maxY = y
      }
    }
  }
  const pct = (v, d) => `${Math.round((v / d) * 100)}%`
  console.log(
    `${name.padEnd(16)} n=${String(n).padStart(5)}  x=${minX}..${maxX} (${pct(minX, width)}..${pct(maxX, width)})  y=${minY}..${maxY} (${pct(minY, height)}..${pct(maxY, height)})`,
  )
}

// Coarse ASCII map: nearest target color per cell.
const COLS = 36
const ROWS = 18
const KEYS = ['N', 'O', 'S', 'C', 'A']
console.log('\nascii map (N=norte O=oriental S=sur C=occidental A=occidental-alta .=neutral):')
for (let gy = 0; gy < ROWS; gy++) {
  let line = ''
  for (let gx = 0; gx < COLS; gx++) {
    const x = Math.round(((gx + 0.5) / COLS) * width)
    const y = Math.round(((gy + 0.5) / ROWS) * height)
    const c = rgb(x, y)
    let best = -1
    let bestD = Infinity
    TARGETS.forEach(([, tc], i) => {
      const d = dist(c, tc)
      if (d < bestD) { bestD = d; best = i }
    })
    line += bestD < 80 ? KEYS[best] : '.'
  }
  console.log(line)
}

// Vertical scan of the center column (x=443) to find the art's top/bottom edges.
console.log('\ncenter-column luminance (y 600..1060, step 2):')
const cx = 443
const full = await sharp(SRC).raw().toBuffer({ resolveWithObject: true })
const FW = full.info.width
const FC = full.info.channels
for (let y = 600; y <= 1060; y += 2) {
  const i = (y * FW + cx) * FC
  const v = Math.round((full.data[i] + full.data[i + 1] + full.data[i + 2]) / 3)
  console.log(y, v)
}

// Left/right edges of title & subtitle (dark text threshold) + art top/bottom.
console.log('\ntext edges:')
function darkX(y, dir) {
  for (let x = dir > 0 ? 0 : FW - 1; dir > 0 ? x < FW : x >= 0; x += dir) {
    const i = (y * FW + cx * 0 + x) * FC
    const v = full.data[i] + full.data[i + 1] + full.data[i + 2]
    if (v < 330) return x
  }
  return -1
}
// Hero structure probe (y 72..376): luminance ascii map (36x12) + sample points.
console.log('\nhero ascii (lum: .=dark navy <60, :=60-120, o=120-180, #=180-240, W=240+):')
for (let gy = 0; gy < 12; gy++) {
  let line = ''
  for (let gx = 0; gx < 36; gx++) {
    const x = Math.round(((gx + 0.5) / 36) * FW)
    const y = 72 + Math.round(((gy + 0.5) / 12) * (376 - 72))
    const i = (y * FW + x) * FC
    const v = Math.round((full.data[i] + full.data[i + 1] + full.data[i + 2]) / 3)
    line += v < 60 ? '.' : v < 120 ? ':' : v < 180 ? 'o' : v < 240 ? '#' : 'W'
  }
  console.log(line)
}
// Horizontal luminance profile at art vertical center (y=830) to check full-bleed vs inset.
console.log('\nart horizontal profile y=830 (x step 8):')
for (let x = 0; x < FW; x += 8) {
  const i = (830 * FW + x) * FC
  const v = Math.round((full.data[i] + full.data[i + 1] + full.data[i + 2]) / 3)
  process.stdout.write(`${x}:${v} `)
}
console.log()


console.log('subtitle y596 left', darkX(596, 1))
console.log('art y628 lum', (() => { const i = (628 * FW + 443) * FC; return Math.round((full.data[i] + full.data[i + 1] + full.data[i + 2]) / 3) })())
console.log('art y1042 lum', (() => { const i = (1042 * FW + 443) * FC; return Math.round((full.data[i] + full.data[i + 1] + full.data[i + 2]) / 3) })())

