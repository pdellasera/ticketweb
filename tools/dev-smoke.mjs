import { spawn } from 'node:child_process'

const server = spawn('node', ['node_modules/vite/bin/vite.js', '--port', '5174', '--strictPort'], {
  stdio: ['ignore', 'pipe', 'pipe'],
})
let output = ''
server.stdout.on('data', (d) => (output += d.toString()))
server.stderr.on('data', (d) => (output += d.toString()))

setTimeout(async () => {
  try {
    const r = await fetch('http://localhost:5174/')
    const html = await r.text()
    console.log('GET / ->', r.status, 'root div:', html.includes('id="root"'))
    const r2 = await fetch('http://localhost:5174/src/features/checkout/CheckoutScreen.tsx')
    console.log('GET CheckoutScreen.tsx (dev transform) ->', r2.status)
    const r4 = await fetch('http://localhost:5174/src/features/checkout/PaymentScreen.tsx')
    console.log('GET PaymentScreen.tsx (dev transform) ->', r4.status)
    const r5 = await fetch('http://localhost:5174/src/features/checkout/PaymentProcessingScreen.tsx')
    console.log('GET PaymentProcessingScreen.tsx (dev transform) ->', r5.status)
    const r6 = await fetch('http://localhost:5174/src/features/checkout/PaymentCompleteScreen.tsx')
    console.log('GET PaymentCompleteScreen.tsx (dev transform) ->', r6.status)
    const r7 = await fetch('http://localhost:5174/src/features/mobile/MobileTicketsScreen.tsx')
    console.log('GET MobileTicketsScreen.tsx (dev transform) ->', r7.status)
    const r8 = await fetch('http://localhost:5174/src/features/tickets/TicketCard.tsx')
    console.log('GET tickets/TicketCard.tsx (dev transform) ->', r8.status)
    const r9 = await fetch('http://localhost:5174/src/data/tickets.ts')
    console.log('GET data/tickets.ts (dev transform) ->', r9.status)
    const r10 = await fetch('http://localhost:5174/src/features/tickets/TicketStub.tsx')
    console.log('GET tickets/TicketStub.tsx (dev transform) ->', r10.status)
    const r11 = await fetch('http://localhost:5174/src/features/tickets/TicketDetailSheet.tsx')
    console.log('GET tickets/TicketDetailSheet.tsx (dev transform) ->', r11.status)
    const r3 = await fetch('http://localhost:5174/assets/Seleccion1.png')
    console.log('GET assets/Seleccion1.png (dev import) ->', r3.status)
  } catch (e) {
    console.log('ERR', e.message)
  }
  console.log(output.split('\n').slice(0, 10).join('\n'))
  server.kill()
  process.exit(0)
}, 4000)
