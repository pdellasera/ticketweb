import { spawn } from 'node:child_process'

const server = spawn(
  'node',
  ['node_modules/vite/bin/vite.js', 'preview', '--port', '4173', '--strictPort'],
  { stdio: ['ignore', 'pipe', 'pipe'] },
)

let output = ''
server.stdout.on('data', (d) => (output += d.toString()))
server.stderr.on('data', (d) => (output += d.toString()))

async function waitReady() {
  for (let i = 0; i < 30; i++) {
    try {
      const r = await fetch('http://localhost:4173/')
      if (r.ok) return true
    } catch {
      /* retry */
    }
    await new Promise((r) => setTimeout(r, 300))
  }
  return false
}

const ok = await waitReady()
console.log(ok ? 'preview server READY' : 'preview server NOT READY')
if (!ok) console.log(output)

if (ok) {
  const res = await fetch('http://localhost:4173/')
  const html = await res.text()
  console.log(`GET /  -> HTTP ${res.status}  (root div: ${html.includes('<div id="root"></div>') ? 'OK' : 'MISSING'})`)

  const checks = [
    '/assets/stadium/estadio-3d-hires.webp',
    '/assets/stadium/estadio-3d.webp',
    '/assets/stadium/mapa-estadio-cyan.webp',
    '/assets/photos/background_login.webp',
    '/assets/photos/sidebar_background.webp',
    '/assets/brand/icon.png',
    '/assets/brand/logo_white.webp',
    '/assets/home/hero-stadium.webp',
    '/assets/home/evento-1.webp',
    '/assets/home/evento-2.webp',
    '/assets/home/evento-3.webp',
    '/assets/home/evento-4.webp',
    '/assets/home/evento-5.webp',
    '/assets/home/evento-6.webp',
    '/assets/stadium/secciones-estadio.webp',
    '/assets/teams/tauro-fc.webp',
    '/assets/teams/plaza-amador.webp',
    '/assets/teams/sporting-san-miguelito.webp',
    '/assets/teams/alianza-fc.webp',
    '/assets/teams/ca-independiente.webp',
    '/assets/teams/san-francisco-fc.webp',
    '/assets/teams/potros-del-este.webp',
    '/assets/teams/universitario.webp',
    '/assets/teams/independiente-fc.webp',
    '/assets/calendar/concierto.webp',
    '/assets/calendar/teatro.webp',
    '/assets/calendar/otros.webp',
  ]
  for (const path of checks) {
    const r = await fetch(`http://localhost:4173${path}`)
    console.log(`GET ${path}  -> HTTP ${r.status}`)
  }
}

server.kill()
process.exit(0)

