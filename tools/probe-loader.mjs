import sharp from 'sharp'

const SRC = 'assets/procesando_pago.png'
const { data, info } = await sharp(SRC).raw().toBuffer({ resolveWithObject: true })
const W = info.width
const H = info.height
const C = info.channels
const px = (x, y) => {
  const i = (y * W + x) * C
  return [data[i], data[i + 1], data[i + 2]]
}
console.log('dims', W, 'x', H)

// Horizontal radial profile at disc center y=672.
console.log('\n--- horizontal profile y=672, x 260..640 (color transitions) ---')
{
  let prev = ''
  let s = 260
  for (let x = 260; x <= 640; x++) {
    const key = px(x, 672).join(',')
    if (x === 260) prev = key
    else if (key !== prev) {
      console.log(`  x=${s}..${x - 1} ${prev}`)
      s = x
      prev = key
    }
  }
  console.log(`  x=${s}..640 ${prev}`)
}

// Blue card icon bbox (center region x 340..560, y 590..760 — excludes arc).
console.log('\n--- blue card icon bbox (center region) ---')
let bminX = W, bmaxX = 0, bminY = H, bmaxY = 0
for (let y = 590; y <= 760; y++) {
  for (let x = 340; x <= 560; x++) {
    const [R, G, B] = px(x, y)
    if (B > 130 && B - R > 45 && B - G > 25) {
      if (x < bminX) bminX = x
      if (x > bmaxX) bmaxX = x
      if (y < bminY) bminY = y
      if (y > bmaxY) bmaxY = y
    }
  }
}
console.log(`  x=${bminX}..${bmaxX} y=${bminY}..${bmaxY} w=${bmaxX - bminX} h=${bmaxY - bminY}`)

// White card square: pure white (>=253) inside center region, bbox.
console.log('\n--- white square bbox (r,g,b>=253, center region) ---')
let wminX = W, wmaxX = 0, wminY = H, wmaxY = 0
for (let y = 590; y <= 760; y++) {
  for (let x = 340; x <= 560; x++) {
    const [R, G, B] = px(x, y)
    if (R >= 253 && G >= 253 && B >= 253) {
      if (x < wminX) wminX = x
      if (x > wmaxX) wmaxX = x
      if (y < wminY) wminY = y
      if (y > wmaxY) wmaxY = y
    }
  }
}
console.log(`  x=${wminX}..${wmaxX} y=${wminY}..${wmaxY} w=${wmaxX - wminX} h=${wmaxY - wminY}`)

// Arc angular coverage: sweep at multiple radii.
console.log('\n--- arc angular coverage (radius 135..160 step 5) ---')
for (let R = 135; R <= 160; R += 5) {
  const arcs = []
  let start = -1
  for (let deg = 0; deg < 360; deg++) {
    const rad = (deg * Math.PI) / 180
    const x = Math.round(444.5 + R * Math.cos(rad))
    const y = Math.round(672 - R * Math.sin(rad))
    const [Rr2, G2, B2] = px(x, y)
    const on = B2 > 130 && B2 - Rr2 > 45 && B2 - G2 > 25
    if (on && start < 0) start = deg
    else if (!on && start >= 0) {
      arcs.push([start, deg - 1])
      start = -1
    }
  }
  if (start >= 0) arcs.push([start, 359])
  console.log(`  R=${R}: ${JSON.stringify(arcs)}`)
}

// Sample key colors.
console.log('\n--- key colors ---')
console.log('  track top (443,518)=', px(443, 518).join(','))
console.log('  arc top (443,526)=', px(443, 526).join(','))
console.log('  disc interior (443,580)=', px(443, 580).join(','))
console.log('  title ink (443,892)=', px(443, 892).join(','))
console.log('  subtitle (443,942)=', px(443, 942).join(','))
console.log('  secure bg (60,1540)=', px(60, 1540).join(','))
console.log('  card header crest area (200,945)=', px(200, 945).join(','))
