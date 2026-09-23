import type { HomeEvent } from '@/data/types'
import { TeamCrest } from '@/components/ui/TeamCrest'

/** Compact event summary card shown at the top of the Pago sheet. */
export function OrderEventCard({ event }: { event?: HomeEvent }) {
  const teams = event?.title ? event.title.split(/\s+vs\s+/i) : []
  const isMatch = teams.length === 2

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '12px 14px',
        background: '#fff',
        border: '1px solid var(--color-zona-line)',
        borderRadius: 11,
      }}
    >
      {isMatch ? (
        <div className="flex items-center" style={{ flexShrink: 0 }}>
          <TeamCrest name={teams[0]} size={34} />
          <span style={{ width: 1, height: 26, background: 'var(--color-zona-line)', marginLeft: 6, marginRight: 6 }} />
          <TeamCrest name={teams[1]} size={34} />
        </div>
      ) : (
        <span className="grid shrink-0 place-items-center rounded-full" style={{ width: 34, height: 34, background: 'var(--color-zona-card)' }}>
          <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--color-pago-blue)' }}>GG</span>
        </span>
      )}

      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 14.5, fontWeight: 700, lineHeight: 1.25, color: 'var(--color-checkout-ink)' }}>
          {event?.title ?? 'Evento'}
        </p>
        <p style={{ fontSize: 12.5, lineHeight: 1.3, marginTop: 2, color: 'var(--color-pago-sub)' }}>
          {event?.dateLabel ?? ''} · {event?.time ?? ''}
        </p>
        <p style={{ fontSize: 12.5, lineHeight: 1.3, marginTop: 1, color: 'var(--color-pago-sub)' }}>
          {event?.venue ?? ''}
        </p>
      </div>
    </div>
  )
}
