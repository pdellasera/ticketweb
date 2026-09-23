import type { Ticket } from '@/data/types'

export function TicketInfoRows({ ticket }: { ticket: Ticket }) {
  const rows = [
    { label: 'Sección', value: ticket.zoneLabel },
    { label: 'Fila', value: ticket.row },
    { label: 'Asientos', value: ticket.seats.join(', ') },
    { label: 'Tipo', value: ticket.typeLabel },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 9, flex: 1, minWidth: 0 }}>
      {rows.map((r) => (
        <div key={r.label} style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12 }}>
          <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--color-mobile-meta)', whiteSpace: 'nowrap' }}>{r.label}</span>
          <span style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--color-mobile-ink)', textAlign: 'right' }}>{r.value}</span>
        </div>
      ))}
    </div>
  )
}
