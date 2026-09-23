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

// Map lower half content.
console.log('\n--- content map y 700..1774 (step 3) ---')
for (let y = 700; y <= 1774; y += 3) {
  let dark = 0
  let darkX = []
  let green = 0
  let blue = 0
  let lightBlue = 0
  let border = 0
  for (let x = 0; x < W; x += 2) {
    const [R, G, B] = px(x, y)
    if (R < 90 && G < 90 && B < 120) {
      dark++
      if (darkX.length < 2) darkX.push(x)
    }
    if (G > 120 && G - R > 25 && G - B > 25) green++
    if (B > 140 && B - R > 60 && B - G > 40) blue++
    if (B > 244 && B - R >= 7 && G > R && G < R + 45 && R > 220) lightBlue++
    if (Math.abs(R - G) < 5 && B - R >= 6 && B - R <= 18 && R > 210) border++
  }
  if (dark > 4 || green > 2 || blue > 300 || lightBlue > 300 || border > 300) {
    console.log(
      `  y=${y} dark=${dark}${darkX.length ? ` x${darkX.join(',')}` : ''} green=${green} blue=${blue} lightBlue=${lightBlue} border=${border}  sample443=${px(443, y).join(',')}`,
    )
  }
}
