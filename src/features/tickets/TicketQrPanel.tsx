import { TicketQr } from '@/features/checkout/TicketQr'

import type { Ticket } from '@/data/types'

export function TicketQrPanel({ ticket }: { ticket: Ticket }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, flexShrink: 0, width: 72 }}>
      <div style={{ background: '#fff', border: '1px solid var(--color-ticket-border)', borderRadius: 7, padding: 3, lineHeight: 0 }}>
        <TicketQr code={ticket.code} size={48} />
      </div>
      <p style={{ fontSize: 8, fontWeight: 700, letterSpacing: 0.2, color: 'var(--color-mobile-ink)', whiteSpace: 'nowrap', lineHeight: 1 }}>{ticket.code}</p>
      <p style={{ fontSize: 8.5, color: 'var(--color-mobile-meta)', whiteSpace: 'nowrap', lineHeight: 1 }}>
        {ticket.quantity} de {ticket.quantity} entradas
      </p>
    </div>
  )
}
