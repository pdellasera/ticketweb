import { useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight } from 'lucide-react'

import type { Seat } from '@/data/types'
import { Button } from '@/components/ui/Button'
import { Skeleton } from '@/components/ui/Skeleton'
import { useCart } from '@/features/cart/CartContext'
import { useEvento } from '@/hooks/useEvento'
import { useSection, useSeats } from '@/hooks/useStadium'
import { cn } from '@/lib/cn'
import { formatUSD } from '@/lib/format'

function SeatButton({ seat, selected, onToggle }: { seat: Seat; selected: boolean; onToggle: () => void }) {
  const disabled = seat.state !== 'available'
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onToggle}
      className={cn(
        'h-7 w-7 rounded-[4px] border text-[10px] font-semibold transition-colors',
        seat.state === 'occupied' && 'cursor-not-allowed border-transparent bg-seat-occupied',
        seat.state === 'reserved' && 'cursor-not-allowed border-transparent bg-seat-blocked',
        seat.state === 'available' && !selected && 'border-line bg-white hover:border-brand-500',
        selected && 'border-brand-600 bg-brand-500 text-white',
      )}
    />
  )
}

export default function SeatMapScreen() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const eventId = params.get('evento') ?? undefined
  const sectionId = params.get('seccion') ?? undefined

  const { data: event } = useEvento(eventId)
  const { data: section } = useSection(eventId, sectionId)
  const { data: seats, isLoading } = useSeats(eventId, section)
  const { addLine } = useCart()

  const [selected, setSelected] = useState<Set<string>>(new Set())

  const rows = useMemo(() => {
    const map = new Map<string, Seat[]>()
    for (const seat of seats ?? []) {
      const arr = map.get(seat.rowLabel) ?? []
      arr.push(seat)
      map.set(seat.rowLabel, arr)
    }
    return [...map.entries()]
  }, [seats])

  function toggleSeat(seat: Seat) {
    if (seat.state !== 'available') return
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(seat.id)) next.delete(seat.id)
      else next.add(seat.id)
      return next
    })
  }

  function handleContinue() {
    if (!event || !section || selected.size === 0) return
    const labels = (seats ?? []).filter((s) => selected.has(s.id)).map((s) => `${s.rowLabel}${s.col}`)
    addLine({
      key: `${event.id}:${section.id}`,
      eventTitle: `${event.homeTeam} vs ${event.awayTeam}`,
      eventMeta: event.competition,
      zoneLabel: `Sección ${section.number}`,
      seatIds: labels,
      unitPrice: section.price,
      currency: 'USD',
      badgeCode: event.homeCode,
    })
    navigate('/consola/venta')
  }

  const total = (section?.price ?? 0) * selected.size

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-600 transition-colors hover:text-ink-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver al mapa
      </button>

      <div className="mt-4 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        {/* Seat grid */}
        <div className="rounded-card border border-line bg-card p-5 shadow-card sm:p-6">
          {event && section ? (
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h1 className="font-display text-xl font-bold text-ink-900">Sección {section.number}</h1>
                <p className="text-sm text-ink-600">
                  {event.homeTeam} vs {event.awayTeam}
                </p>
              </div>
              <span className="rounded-control bg-brand-500/10 px-3 py-1 text-sm font-semibold text-brand-600">
                {formatUSD(section.price)}
              </span>
            </div>
          ) : (
            <Skeleton className="h-14 w-full" />
          )}

          {isLoading ? (
            <Skeleton className="h-64 w-full" />
          ) : (
            <div className="overflow-x-auto">
              <div className="mx-auto mb-5 w-fit rounded-control bg-canvas px-8 py-2 text-center text-xs font-semibold uppercase tracking-widest text-ink-400">
                Cancha
              </div>
              <div className="mx-auto w-fit space-y-1.5">
                {rows.map(([rowLabel, rowSeats]) => (
                  <div key={rowLabel} className="flex items-center gap-3">
                    <span className="w-6 text-center text-xs font-semibold text-ink-400">{rowLabel}</span>
                    <div className="flex gap-1.5">
                      {rowSeats.map((seat) => (
                        <SeatButton
                          key={seat.id}
                          seat={seat}
                          selected={selected.has(seat.id)}
                          onToggle={() => toggleSeat(seat)}
                        />
                      ))}
                    </div>
                    <span className="w-6 text-center text-xs font-semibold text-ink-400">{rowLabel}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 border-t border-line pt-4 text-xs text-ink-600">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-3.5 w-3.5 rounded-[4px] border border-line bg-white" /> Disponible
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-3.5 w-3.5 rounded-[4px] bg-seat-occupied" /> Ocupado
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-3.5 w-3.5 rounded-[4px] bg-seat-blocked" /> Reservado
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-3.5 w-3.5 rounded-[4px] bg-brand-500" /> Seleccionado
            </span>
          </div>
        </div>

        {/* Summary */}
        <aside>
          <div className="rounded-card border border-line bg-card p-5 shadow-card">
            <h2 className="text-sm font-bold uppercase tracking-wide text-ink-400">Tu selección</h2>

            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-ink-600">Asientos</span>
                <span className="font-semibold text-ink-900">{selected.size > 0 ? selected.size : '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-600">Precio unitario</span>
                <span className="font-semibold text-ink-900">{formatUSD(section?.price ?? 0)}</span>
              </div>
              <div className="flex justify-between border-t border-line pt-2 text-base">
                <span className="font-semibold text-ink-900">Total</span>
                <span className="font-bold text-brand-600">{formatUSD(total)}</span>
              </div>
            </div>

            {selected.size > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {[...selected].map((id) => {
                  const seat = seats?.find((s) => s.id === id)
                  return (
                    <span key={id} className="rounded-control bg-canvas px-2 py-0.5 text-xs font-semibold text-ink-900">
                      {seat ? `${seat.rowLabel}${seat.col}` : id}
                    </span>
                  )
                })}
              </div>
            )}

            <Button size="lg" className="mt-5 w-full" disabled={selected.size === 0} onClick={handleContinue}>
              Continuar
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </aside>
      </div>
    </div>
  )
}

