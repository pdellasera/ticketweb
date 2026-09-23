import { copyFile, mkdir, stat } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import sharp from 'sharp'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const src = (p) => resolve(root, 'assets', p)
const out = (p) => resolve(root, 'public', p)

const kb = (bytes) => `${(bytes / 1024).toFixed(1)} KB`

async function inspect() {
  const files = [
    'estadio-3d.webp',
    'estadio-3d.png',
    'mapa de estadio.png',
    'label_example.png',
    'logo_white.webp',
    'logo.png',
    'icon.png',
    'sidebar_background.webp',
    'background_login.png',
  ]
  console.log('\n== Inspection ==')
  for (const f of files) {
    try {
      const meta = await sharp(src(f)).metadata()
      console.log(
        `${f.padEnd(24)} ${String(meta.width).padStart(5)}x${String(meta.height).padEnd(5)} ${meta.format.padEnd(4)} alpha=${meta.hasAlpha}`,
      )
    } catch (err) {
      console.log(`${f.padEnd(24)} ERROR: ${err.message}`)
    }
  }
}

async function reencode(name, outPath, { width, quality }) {
  await mkdir(dirname(out(outPath)), { recursive: true })
  let pipeline = sharp(src(name))
  if (width) pipeline = pipeline.resize({ width, withoutEnlargement: true })
  await pipeline.webp({ quality, effort: 6 }).toFile(out(outPath))
  const s = await stat(out(outPath))
  console.log(`encoded  ${name.padEnd(24)} -> ${outPath.padEnd(44)} ${kb(s.size)}`)
}

async function copy(name, outPath) {
  await mkdir(dirname(out(outPath)), { recursive: true })
  await copyFile(src(name), out(outPath))
  const s = await stat(out(outPath))
  console.log(`copied   ${name.padEnd(24)} -> ${outPath.padEnd(44)} ${kb(s.size)}`)
}

async function main() {
  await inspect()

  console.log('\n== Processing ==')
  await reencode('background_login.png', 'assets/photos/background_login.webp', {
    width: 1400,
    quality: 78,
  })
  await reencode('mapa de estadio.png', 'assets/stadium/mapa-estadio-cyan.webp', {
    quality: 82,
  })
  await reencode('estadio-3d.png', 'assets/stadium/estadio-3d-hires.webp', {
    width: 1536,
    quality: 84,
  })

  await copy('estadio-3d.webp', 'assets/stadium/estadio-3d.webp')
  await copy('logo_white.webp', 'assets/brand/logo_white.webp')
  await copy('logo_white.png', 'assets/brand/logo_white.png')
  await copy('icon.png', 'assets/brand/icon.png')
  await copy('sidebar_background.webp', 'assets/photos/sidebar_background.webp')

  console.log('\nDone. Assets written to public/assets/')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
