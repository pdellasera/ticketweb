import { Smartphone } from 'lucide-react'

import { GameGateLogo } from '@/components/ui/GameGateLogo'

/**
 * Full-screen notice shown when the site is opened on a non-mobile device.
 * The GameGate ticketera is mobile-only, so desktop visitors are asked to open
 * the site from their phone instead.
 */
export default function MobileOnlyScreen() {
  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center gap-7 px-8 text-center"
      style={{
        background:
          'radial-gradient(120% 100% at 50% 0%, #0b1f38 0%, #08192e 55%, #061527 100%)',
        color: '#fff',
      }}
    >
      <GameGateLogo variant="light" className="text-4xl" />

      <span className="grid h-24 w-24 place-items-center rounded-[28px] border border-white/10 bg-white/5">
        <Smartphone className="h-12 w-12 text-brand-400" strokeWidth={1.6} />
      </span>

      <div className="flex flex-col items-center gap-3">
        <h1 className="font-display text-[26px] font-extrabold leading-tight text-white">
          Disponible solo en celular
        </h1>
        <p className="max-w-sm text-[15px] leading-relaxed text-white/70">
          Abre este sitio desde tu teléfono para descubrir eventos, comprar tus entradas y llevar tus
          boletos siempre contigo.
        </p>
      </div>
    </div>
  )
}
