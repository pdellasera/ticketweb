import sharp from 'sharp'

// Verify extracted crests: opaque-pixel bounding box (alpha > 60) + centering.
for (const name of ['nacional', 'millonarios']) {
  const p = `public/assets/teams/${name}.webp`
  const { data, info } = await sharp(p).raw().toBuffer({ resolveWithObject: true })
  const { width, height, channels } = info
  let minX = width, minY = height, maxX = -1, maxY = -1, n = 0
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const a = data[(y * width + x) * channels + (channels - 1)]
      if (a > 60) {
        n++
        if (x < minX) minX = x
        if (x > maxX) maxX = x
        if (y < minY) minY = y
        if (y > maxY) maxY = y
      }
    }
  }
  const cut = minX <= 1 || maxX >= width - 2 || minY <= 1 || maxY >= height - 2
  console.log(`${name}: ${width}x${height} opaque=${n} bbox x=${minX}..${maxX} y=${minY}..${maxY} CUT=${cut}`)
}


