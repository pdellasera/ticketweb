import { UserRound } from 'lucide-react'

import type { Buyer } from '@/data/types'

/** Buyer summary card (light-blue) with person icon + name + contact. */
export function BuyerCard({ buyer }: { buyer: Buyer }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '13px 14px',
        background: 'var(--color-pago-buyer-bg)',
        borderRadius: 11,
      }}
    >
      <span
        className="grid shrink-0 place-items-center rounded-full"
        style={{ width: 40, height: 40, background: 'rgba(1,103,251,0.12)', color: 'var(--color-pago-blue)' }}
      >
        <UserRound style={{ width: 21, height: 21 }} strokeWidth={2} />
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 15.5, fontWeight: 700, lineHeight: 1.2, color: 'var(--color-checkout-ink)' }}>{buyer.name}</p>
        <p style={{ fontSize: 13, lineHeight: 1.3, marginTop: 2, color: 'var(--color-pago-sub)' }}>
          {buyer.email} · {buyer.phone}
        </p>
      </div>
    </div>
  )
}
