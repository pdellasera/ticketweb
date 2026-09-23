import { Info } from 'lucide-react'

import { formatUSD } from '@/lib/format'

interface Props {
  zoneName: string
  unitPrice: number
  quantity: number
  subtotal: number
  fee: number
  total: number
}

/** Ticket breakdown: zone + per-ticket rows + subtotal + service fee + total bar. */
export function TicketsSummaryCard({ zoneName, unitPrice, quantity, subtotal, fee, total }: Props) {
  const tickets = Array.from({ length: quantity }, (_, i) => i + 1)

  return (
    <div style={{ background: 'var(--color-zona-card)', borderRadius: 11, padding: '14px 16px 0', overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12 }}>
        <span style={{ fontSize: 15.5, fontWeight: 700, lineHeight: 1.2, color: 'var(--color-checkout-ink)' }}>{zoneName}</span>
        <span style={{ fontSize: 13.5, fontWeight: 700, lineHeight: 1.2, color: 'var(--color-checkout-ink)', whiteSpace: 'nowrap' }}>
          {formatUSD(unitPrice)} c/u
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 12 }}>
        {tickets.map((n) => (
          <div key={n} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <span style={{ fontSize: 13.5, fontWeight: 500, color: 'var(--color-pago-label)' }}>Entrada {n}</span>
            <span style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--color-pago-label)' }}>{formatUSD(unitPrice)}</span>
          </div>
        ))}
      </div>

      <div style={{ height: 1, background: 'var(--color-zona-line)', marginTop: 12 }} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <span style={{ fontSize: 13.5, fontWeight: 500, color: 'var(--color-pago-label)' }}>Subtotal ({quantity} {quantity === 1 ? 'entrada' : 'entradas'})</span>
          <span style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--color-checkout-ink)' }}>{formatUSD(subtotal)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span className="flex items-center" style={{ gap: 5, fontSize: 13.5, fontWeight: 500, color: 'var(--color-pago-label)' }}>
            Cargo por servicio
            <Info style={{ width: 13, height: 13, color: 'var(--color-pago-blue)' }} strokeWidth={2} />
          </span>
          <span style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--color-checkout-ink)' }}>{formatUSD(fee)}</span>
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          margin: '14px -16px 0',
          padding: '13px 16px',
          background: 'var(--color-pago-total-bg)',
        }}
      >
        <span style={{ fontSize: 15.5, fontWeight: 700, color: 'var(--color-checkout-ink)' }}>Total a pagar</span>
        <span style={{ fontSize: 17.5, fontWeight: 800, color: 'var(--color-checkout-ink)' }}>{formatUSD(total)}</span>
      </div>
    </div>
  )
}
