import sharp from 'sharp'

const SRC = 'assets/revisar_pago.png'
const { data, info } = await sharp(SRC).raw().toBuffer({ resolveWithObject: true })
const W = info.width
const H = info.height
const C = info.channels
const px = (x, y) => {
  const i = (y * W + x) * C
  return [data[i], data[i + 1], data[i + 2]]
}

const samples = {
  'title (150,505)': [150, 505],
  'subtitle (150,542)': [150, 542],
  'event card bg (600,640)': [600, 640],
  'event title (220,635)': [220, 635],
  'tickets card bg (600,800)': [600, 800],
  'zone name (80,800)': [80, 800],
  'price c/u (780,800)': [780, 800],
  'editar link (760,745)': [760, 745],
  'ticket row label (100,850)': [100, 850],
  'subtotal label (80,930)': [80, 930],
  'fee label (80,965)': [80, 965],
  'total bar bg (300,1100)': [300, 1100],
  'total label (80,1105)': [80, 1105],
  'total amount (780,1105)': [780, 1105],
  'buyer icon (70,1300)': [70, 1300],
  'buyer name (160,1290)': [160, 1290],
  'buyer contact (160,1315)': [160, 1315],
  'payment heading (40,1400)': [40, 1400],
  'payment card logo bg (140,1480)': [140, 1480],
  'radio ring (85,1480)': [85, 1480],
  'payment title (200,1470)': [200, 1470],
  'payment hint (200,1495)': [200, 1495],
  'brand area (700,1480)': [700, 1480],
  'cta btn (443,1600)': [443, 1600],
  'legal link (470,1668)': [470, 1668],
  'legal plain (250,1668)': [250, 1668],
}
console.log('color samples (r,g,b):')
for (const [name, [x, y]] of Object.entries(samples)) {
  console.log(`  ${name.padEnd(26)} (${x},${y}) = ${px(x, y).join(',')}`)
}

// Find green "Pago 100% seguro" text: scan y 1360..1435 for green-ish pixels (loose).
console.log('\ngreen-ish pixel rows y 1360..1435 (g>120, g-r>25, g-b>25):')
for (let y = 1360; y <= 1435; y++) {
  let xs = []
  for (let x = 0; x < W; x += 2) {
    const [r, g, b] = px(x, y)
    if (g > 120 && g - r > 25 && g - b > 25) xs.push(x)
  }
  if (xs.length) console.log(`  y=${y}  n=${xs.length}  x=${Math.min(...xs)}..${Math.max(...xs)}  sample=${px(Math.min(...xs) + 3, y).join(',')}`)
}

// Confirm stepper circle diameter: blue columns at y=400
console.log('\nstepper blue runs at y=400 (circle diameters):')
let run = 0
let start = -1
const runs = []
for (let x = 0; x < W; x++) {
  const [r, g, b] = px(x, y400())
  if (b > 130 && b - r > 45 && b - g > 25) { if (start < 0) start = x; run++ } else if (start >= 0) { runs.push([start, x - 1]); start = -1; run = 0 }
}
function y400() { return 400 }
console.log('  runs:', JSON.stringify(runs))
