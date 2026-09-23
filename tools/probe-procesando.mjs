import sharp from 'sharp'

const SRC = 'assets/procesando_pago.png'
const { data, info } = await sharp(SRC).raw().toBuffer({ resolveWithObject: true })
const W = info.width
const H = info.height
const px = (x, y) => {
  const i = (y * W + x) * C
  return [data[i], data[i + 1], data[i + 2]]
}
const C = info.channels
console.log('dims', W, 'x', H)

// 1) Loader disc (light-blue fill) bbox.
console.log('\n--- loader disc bbox ---')
let minX = W, maxX = 0, minY = H, maxY = 0
for (let y = 470; y <= 830; y++) {
  for (let x = 0; x < W; x++) {
    const [R, G, B] = px(x, y)
    if (B > 244 && B - R >= 7 && G > R && G < R + 45) {
      if (x < minX) minX = x
      if (x > maxX) maxX = x
      if (y < minY) minY = y
      if (y > maxY) maxY = y
    }
  }
}
console.log(`  x=${minX}..${maxX} y=${minY}..${maxY} w=${maxX - minX} h=${maxY - minY}`)
const cx = (minX + maxX) / 2
const cy = (minY + maxY) / 2
const Rr = (maxX - minX) / 2
console.log(`  center=(${cx.toFixed(1)},${cy.toFixed(1)}) radius=${Rr.toFixed(1)}`)

// 2) White card icon bbox (near-white inside disc).
console.log('\n--- white card icon bbox (r,g,b>248 inside disc) ---')
let wminX = W, wmaxX = 0, wminY = H, wmaxY = 0
for (let y = minY; y <= maxY; y++) {
  for (let x = minX; x <= maxX; x++) {
    const [R, G, B] = px(x, y)
    if (R > 248 && G > 248 && B > 248) {
      if (x < wminX) wminX = x
      if (x > wmaxX) wmaxX = x
      if (y < wminY) wminY = y
      if (y > wmaxY) wmaxY = y
    }
  }
}
console.log(`  x=${wminX}..${wmaxX} y=${wminY}..${wmaxY} w=${wmaxX - wminX} h=${wmaxY - wminY}`)

// 3) Blue card icon bbox (blue inside white card).
console.log('\n--- blue card icon bbox ---')
let bminX = W, bmaxX = 0, bminY = H, bmaxY = 0
for (let y = wminY; y <= wmaxY; y++) {
  for (let x = wminX; x <= wmaxX; x++) {
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

// 4) Arc angular coverage: sweep at radius ~ Rr-5 from center.
console.log('\n--- arc angular coverage (radius', (Rr - 5).toFixed(0), ') ---')
const R = Rr - 5
const arcs = []
let start = -1
for (let deg = 0; deg < 360; deg++) {
  const rad = (deg * Math.PI) / 180
  const x = Math.round(cx + R * Math.cos(rad))
  const y = Math.round(cy - R * Math.sin(rad))
  const [Rr2, G2, B2] = px(x, y)
  const on = B2 > 130 && B2 - Rr2 > 45 && B2 - G2 > 25
  if (on && start < 0) start = deg
  else if (!on && start >= 0) {
    arcs.push([start, deg - 1])
    start = -1
  }
}
if (start >= 0) arcs.push([start, 359])
console.log('  arc segments (deg):', JSON.stringify(arcs))

// 5) Title + subtitle: find dark navy text rows in y 730..900.
console.log('\n--- dark text rows y 730..900 (R<80 count) ---')
for (let y = 730; y <= 900; y += 2) {
  let cnt = 0
  let xs = []
  for (let x = 0; x < W; x += 2) {
    const [R, G, B] = px(x, y)
    if (R < 80 && G < 80 && B < 110) {
      cnt++
      if (xs.length < 2) xs.push(x)
    }
  }
  if (cnt > 3) console.log(`  y=${y} darkCount=${cnt} x=${xs.join(',')}`)
}

// 6) Card border: sample left edge column x 30..50 at y=1000 and y=1040.
console.log('\n--- card left border sample (y=1000) x 30..50 ---')
for (let x = 30; x <= 50; x++) console.log(`  x=${x} ${px(x, 1000).join(',')}`)
console.log('--- card top border sample (x=443) y 890..930 ---')
for (let y = 890; y <= 930; y += 2) console.log(`  y=${y} ${px(443, y).join(',')}`)

// 7) Secure box bounds (light blue fill y 1480..1620).
console.log('\n--- secure box bbox (y 1480..1620) ---')
let sminX = W, smaxX = 0, sminY = H, smaxY = 0
for (let y = 1480; y <= 1620; y++) {
  for (let x = 0; x < W; x += 2) {
    const [R, G, B] = px(x, y)
    if (B > 244 && B - R >= 7 && G > R && R > 225 && R < 246) {
      if (x < sminX) sminX = x
      if (x > smaxX) smaxX = x
      if (y < sminY) sminY = y
      if (y > smaxY) smaxY = y
    }
  }
}
console.log(`  x=${sminX}..${smaxX} y=${sminY}..${smaxY} w=${smaxX - sminX} h=${smaxY - sminY}`)
console.log('  bg(60,1540)=', px(60, 1540).join(','))
console.log('  icon(200,1540)=', px(200, 1540).join(','))
// find green lock icon pixels in secure box
console.log('  green pixels in secure box:')
for (let y = sminY; y <= smaxY; y += 3) {
  for (let x = 60; x <= 300; x += 3) {
    const [R, G, B] = px(x, y)
    if (G > 120 && G - R > 30 && G - B > 30) {
      console.log(`    (${x},${y}) ${R},${G},${B}`)
    }
  }
}


