import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, CheckCircle2, CreditCard, ShieldCheck, Ticket, Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { TeamBadge } from '@/components/ui/TeamBadge'
import { useCart, type CartLine } from '@/features/cart/CartContext'
import { formatUSD } from '@/lib/format'

function LineCard({ line, onRemove }: { line: CartLine; onRemove: () => void }) {
  return (
    <div className="rounded-card border border-line bg-card p-5 shadow-card">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <TeamBadge code={line.badgeCode ?? 'GG'} className="h-10 w-10 text-xs" />
          <div>
            <p className="font-display font-bold text-ink-900">
              {line.eventTitle}
            </p>
            <p className="text-sm text-ink-600">
              {line.zoneLabel} · {formatUSD(line.unitPrice)} c/u
            </p>
          </div>
        </div>
        <button type="button" onClick={onRemove} className="text-ink-400 transition-colors hover:text-danger" aria-label="Eliminar">
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {line.seatIds.map((label) => (
          <span key={label} className="rounded-control bg-canvas px-2 py-0.5 text-xs font-semibold text-ink-900">
            {label}
          </span>
        ))}
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-line pt-3 text-sm">
        <span className="text-ink-600">{line.seatIds.length} boleto(s)</span>
        <span className="font-semibold text-ink-900">{formatUSD(line.seatIds.length * line.unitPrice)}</span>
      </div>
    </div>
  )
}

export default function PosScreen() {
  const navigate = useNavigate()
  const { lines, itemCount, subtotal, fees, total, removeLine, clear } = useCart()
  const [done, setDone] = useState(false)

  if (done) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-20 text-center">
        <CheckCircle2 className="h-16 w-16 text-success" />
        <h1 className="mt-4 font-display text-2xl font-bold text-ink-900">¡Compra confirmada!</h1>
        <p className="mt-2 text-sm text-ink-600">Tus boletos digitales fueron enviados a tu correo.</p>
        <Button
          className="mt-6"
          onClick={() => {
            clear()
            navigate('/consola')
          }}
        >
          Volver al inicio
        </Button>
      </div>
    )
  }

  if (lines.length === 0) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-20 text-center">
        <Ticket className="h-16 w-16 text-ink-400" />
        <h1 className="mt-4 font-display text-2xl font-bold text-ink-900">Tu carrito está vacío</h1>
        <p className="mt-2 text-sm text-ink-600">Selecciona tus asientos para comenzar la compra.</p>
        <Button className="mt-6" onClick={() => navigate('/consola')}>
          Ver eventos
        </Button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-600 transition-colors hover:text-ink-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver
      </button>

      <h1 className="mt-4 font-display text-2xl font-bold text-ink-900">Venta de tickets</h1>
      <p className="text-sm text-ink-600">Revisa tu pedido y completa el pago.</p>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          {lines.map((line) => (
            <LineCard key={line.key} line={line} onRemove={() => removeLine(line.key)} />
          ))}
        </div>

        {/* Payment */}
        <aside>
          <div className="rounded-card border border-line bg-card p-5 shadow-card">
            <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-ink-400">
              <CreditCard className="h-4 w-4" />
              Pago
            </h2>

            <div className="mt-4 space-y-3">
              <Input label="Nombre en la tarjeta" placeholder="Carlos Pérez" />
              <Input label="Número de tarjeta" placeholder="0000 0000 0000 0000" inputMode="numeric" />
              <div className="grid grid-cols-2 gap-3">
                <Input label="Vence" placeholder="MM/AA" />
                <Input label="CVC" placeholder="123" inputMode="numeric" />
              </div>
            </div>

            <div className="mt-5 space-y-2 border-t border-line pt-4 text-sm">
              <div className="flex justify-between">
                <span className="text-ink-600">Subtotal ({itemCount} boleto(s))</span>
                <span className="font-semibold text-ink-900">{formatUSD(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-600">Cargo por servicio</span>
                <span className="font-semibold text-ink-900">{formatUSD(fees)}</span>
              </div>
              <div className="flex justify-between border-t border-line pt-2 text-base">
                <span className="font-semibold text-ink-900">Total</span>
                <span className="font-bold text-brand-600">{formatUSD(total)}</span>
              </div>
            </div>

            <Button size="lg" className="mt-5 w-full" onClick={() => setDone(true)}>
              <ShieldCheck className="h-4 w-4" />
              Confirmar pago
            </Button>

            <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-ink-400">
              <ShieldCheck className="h-3.5 w-3.5" />
              Pago seguro cifrado
            </p>
          </div>
        </aside>

      </div>
    </div>
  )
}
