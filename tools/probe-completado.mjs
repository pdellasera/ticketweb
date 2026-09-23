import sharp from 'sharp'

const SRC = 'assets/pago_completado.png'
const { data, info } = await sharp(SRC).raw().toBuffer({ resolveWithObject: true })
const W = info.width
const H = info.height
const C = info.channels
const px = (x, y) => {
  const i = (y * W + x) * C
  return [data[i], data[i + 1], data[i + 2]]
}
console.log('dims', W, 'x', H)

// 1) Confetti: positions + colors, EXCLUDING success discs (x 330..555, y 460..680).
console.log('\n--- confetti (exclude discs) ---')
const found = []
for (let y = 440; y <= 720; y += 2) {
  for (let x = 60; x < W - 60; x += 2) {
    if (x > 330 && x < 555 && y > 460 && y < 680) continue
    const [R, G, B] = px(x, y)
    const blue = B > 140 && B - R > 60 && B - G > 40
    const green = G > 150 && G - R > 50 && G - B > 40
    const teal = G > 150 && B > 140 && G - R > 30 && Math.abs(G - B) < 50
    if (blue || green || teal) {
      const key = `${x},${y}:${R},${G},${B}`
      if (!found.some((f) => f.endsWith(`${R},${G},${B}`)) || found.length < 60) found.push(key)
    }
  }
}
console.log(`  total colored specks sampled: ${found.length}`)
for (const f of found.slice(0, 60)) console.log(`  ${f}`)

// 2) Card border color: sample left edge at y=900, y=1050, y=1200.
console.log('\n--- card border samples x 28..50 ---')
for (const y of [880, 900, 1050, 1200, 1280]) {
  console.log(`  y=${y}:`, [30, 34, 36, 38, 40, 42].map((x) => `${x}=${px(x, y).join(',')}`).join('  '))
}

// 3) Secondary (outline) button bounds.
console.log('\n--- secondary outline button bounds (blue border, y 1440..1560) ---')
let ominX = W, omaxX = 0, ominY = H, omaxY = 0
for (let y = 1440; y <= 1560; y++) {
  for (let x = 0; x < W; x += 2) {
    const [R, G, B] = px(x, y)
    if (B > 120 && B - R > 40 && R > 180) {
      if (x < ominX) ominX = x
      if (x > omaxX) omaxX = x
      if (y < ominY) ominY = y
      if (y > omaxY) omaxY = y
    }
  }
}
console.log(`  x=${ominX}..${omaxX} y=${ominY}..${omaxY} w=${omaxX - ominX} h=${omaxY - ominY}`)

// 4) Secure box (light gray-blue) + icon, y 1580..1720.
console.log('\n--- secure box bbox (y 1580..1740) ---')
let sminX = W, smaxX = 0, sminY = H, smaxY = 0
for (let y = 1580; y <= 1740; y++) {
  for (let x = 0; x < W; x += 2) {
    const [R, G, B] = px(x, y)
    if (B > 242 && R > 228 && R < 248 && G > 236 && G < 252 && B - R >= 5) {
      if (x < sminX) sminX = x
      if (x > smaxX) smaxX = x
      if (y < sminY) sminY = y
      if (y > smaxY) smaxY = y
    }
  }
}
console.log(`  x=${sminX}..${smaxX} y=${sminY}..${smaxY} w=${smaxX - sminX} h=${smaxY - sminY}`)
console.log('  bg(443,1660)=', px(443, 1660).join(','))
console.log('  bg(60,1660)=', px(60, 1660).join(','))

// 5) Shield icon color (blue shield in secure box).
console.log('\n--- shield icon pixels (y 1600..1700, x 40..140) ---')
for (let y = 1600; y <= 1700; y += 2) {
  for (let x = 40; x <= 140; x += 2) {
    const [R, G, B] = px(x, y)
    if (B > 120 && B - R > 50 && B - G > 30) {
      console.log(`  (${x},${y}) ${R},${G},${B}`)
      break
    }
  }
}

// 6) "Volver al inicio" link color, y 1740..1774.
console.log('\n--- volver al inicio pixels (y 1745..1770, blue) ---')
let foundV = 0
for (let y = 1745; y <= 1770; y++) {
  for (let x = 0; x < W; x += 2) {
    const [R, G, B] = px(x, y)
    if (B > 120 && B - R > 40 && R < 120) {
      console.log(`  (${x},${y}) ${R},${G},${B}`)
      foundV++
      if (foundV > 8) break
    }
  }
  if (foundV > 8) break
}


