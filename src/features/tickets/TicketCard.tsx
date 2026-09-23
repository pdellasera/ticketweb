import { useState } from 'react'

import type { Ticket } from '@/data/types'
import { TicketActions } from './TicketActions'
import { TicketBanner } from './TicketBanner'
import { TicketInfoRows } from './TicketInfoRows'
import { TicketQrPanel } from './TicketQrPanel'

interface Props {
  ticket: Ticket
  onOpenQr: (ticket: Ticket) => void
  onDetails: (ticket: Ticket) => void
}

export function TicketCard({ ticket, onOpenQr, onDetails }: Props) {
  const [sent, setSent] = useState(false)

  function handleSend() {
    if (sent) return
    setSent(true)
    window.setTimeout(() => setSent(false), 2500)
  }

  return (
    <div
      style={{
        borderRadius: 13,
        border: '1px solid var(--color-ticket-border)',
        background: 'rgba(0,0,0,0.92)',
        overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(11,31,56,0.05)',
      }}
    >
      <TicketBanner ticket={ticket} />

      <div style={{ padding: '14px 14px 12px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <TicketInfoRows ticket={ticket} />
          <TicketQrPanel ticket={ticket} />
        </div>
        <TicketActions sent={sent} onDetails={() => onDetails(ticket)} onSend={handleSend} onQr={() => onOpenQr(ticket)} />
      </div>
    </div>
  )
}
