import { CalendarDays, MapPin } from 'lucide-react'
import type { ReactNode } from 'react'

import type { HomeEvent } from '@/data/types'
import { TeamCrest } from '@/components/ui/TeamCrest'

interface Row {
  label: string
  value: string
}

interface Props {
  event?: HomeEvent
  rows: Row[]
  totalLabel: string
  totalValue: string
  /** Optional right-side panel (e.g. the QR ticket code). */
  aside?: ReactNode
}

/** Bordered order summary card: crests header + rows + highlighted total row. */
export function OrderDetailCard({ event, rows, totalLabel, totalValue, aside }: Props) {
  const teams = event?.title ? event.title.split(/\s+vs\s+/i) : []
  const isMatch = teams.length === 2

  return (
    <div style={{ background: '#fff', border: '1px solid var(--color-zona-line)', borderRadius: 14, overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px' }}>
        {isMatch ? (
          <div className="flex items-center" style={{ flexShrink: 0 }}>
            <TeamCrest name={teams[0]} size={30} />
            <span style={{ width: 1, height: 22, background: 'var(--color-zona-line)', margin: '0 6px' }} />
            <TeamCrest name={teams[1]} size={30} />
          </div>
        ) : (
          <span className="grid shrink-0 place-items-center rounded-full" style={{ width: 30, height: 30, background: 'var(--color-zona-card)' }}>
            <span style={{ fontSize: 10, fontWeight: 800, color: 'var(--color-pago-blue)' }}>GG</span>
          </span>
        )}

        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: 14.5, fontWeight: 700, lineHeight: 1.25, color: 'var(--color-checkout-ink)' }}>{event?.title ?? 'Evento'}</p>
          <p className="flex items-center" style={{ gap: 6, fontSize: 12, lineHeight: 1.3, marginTop: 3, color: 'var(--color-pago-sub)' }}>
            <CalendarDays style={{ width: 12, height: 12, flexShrink: 0 }} strokeWidth={2} />
            <span>
              {event?.dateLabel ?? ''}
              {event?.time ? ` · ${event.time}` : ''}
            </span>
          </p>
          <p className="flex items-center" style={{ gap: 6, fontSize: 12, lineHeight: 1.3, marginTop: 2, color: 'var(--color-pago-sub)' }}>
            <MapPin style={{ width: 12, height: 12, flexShrink: 0 }} strokeWidth={2} />
            <span>{event?.venue ?? ''}</span>
          </p>
        </div>
      </div>

      <div style={{ height: 1, background: 'var(--color-zona-line)' }} />

      <div style={{ display: 'flex', gap: 16, padding: '14px 16px 16px' }}>
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 11 }}>
          {rows.map((row) => (
            <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12 }}>
              <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-pago-label)' }}>{row.label}</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-checkout-ink)', textAlign: 'right' }}>{row.value}</span>
            </div>
          ))}
        </div>
        {aside}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, background: 'var(--color-pago-total-bg)', padding: '13px 16px' }}>
        <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--color-checkout-ink)' }}>{totalLabel}</span>
        <span style={{ fontSize: 17, fontWeight: 800, color: 'var(--color-checkout-ink)' }}>{totalValue}</span>
      </div>
    </div>
  )
}
