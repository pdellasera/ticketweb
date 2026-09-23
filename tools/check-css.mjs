import { readdir, readFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const dir = resolve('dist/assets')
const files = await readdir(dir)
const css = files.find((f) => f.endsWith('.css'))
if (!css) throw new Error('no css file found')
const content = await readFile(resolve(dir, css), 'utf8')

const checks = [
  ['--color-brand-500', '#007ef5'],
  ['--color-navy-900', '#08192e'],
  ['--radius-card', '12px'],
  ['linear-gradient', 'bg-linear-to-br'],
  ['--color-zone-sursup', '#2e8b3d'],
]

console.log(`CSS file: ${css} (${(content.length / 1024).toFixed(1)} KB)\n`)
for (const [needle, label] of checks) {
  console.log(`${content.includes(needle) ? 'OK ' : 'MISS'}  ${label}  (${needle})`)
}
