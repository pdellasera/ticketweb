import { ChevronRight, CreditCard } from 'lucide-react'

import type { PaymentBrand, PaymentMethod } from '@/data/types'
import { PaymentBrandMarks } from './PaymentBrandMarks'

interface Props {
  methods: PaymentMethod[]
  selectedId: PaymentBrand
  onSelect: (id: PaymentBrand) => void
}

function MethodLogo({ method }: { method: PaymentMethod }) {
  if (method.id === 'card') {
    return (
      <span className="grid shrink-0 place-items-center rounded-lg" style={{ width: 32, height: 32, background: 'rgba(1,103,251,0.1)', color: 'var(--color-pago-blue)' }}>
        <CreditCard style={{ width: 17, height: 17 }} strokeWidth={2} />
      </span>
    )
  }
  return (
    <span
      className="grid shrink-0 place-items-center rounded-lg"
      style={{ width: 32, height: 32, background: 'linear-gradient(135deg, #5b2d86, #7b2ff7)', color: '#fff' }}
    >
      <span style={{ fontSize: 8.5, fontWeight: 800, letterSpacing: 0.1 }}>Yappy</span>
    </span>
  )
}

/** Radio group of payment method rows (mock's "Método de pago" list). */
export function PaymentMethodsCard({ methods, selectedId, onSelect }: Props) {
  return (
    <div role="radiogroup" aria-label="Método de pago" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {methods.map((m) => {
        const selected = m.id === selectedId
        return (
          <button
            key={m.id}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onSelect(m.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              width: '100%',
              padding: '12px 14px',
              background: '#fff',
              border: selected ? '2px solid var(--color-pago-blue)' : '1px solid var(--color-zona-line)',
              borderRadius: 11,
              textAlign: 'left',
              cursor: 'pointer',
            }}
          >
            <span
              className="grid shrink-0 place-items-center rounded-full"
              style={{
                width: 20,
                height: 20,
                border: `2px solid ${selected ? 'var(--color-pago-blue)' : '#c9d2e3'}`,
                background: '#fff',
              }}
            >
              {selected && <span style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--color-pago-blue)' }} />}
            </span>

            <MethodLogo method={m} />

            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.25, color: 'var(--color-checkout-ink)' }}>{m.title}</p>
              <p style={{ fontSize: 12.5, lineHeight: 1.3, marginTop: 1, color: 'var(--color-pago-sub)' }}>{m.hint}</p>
            </div>

            {m.brands ? (
              <PaymentBrandMarks brands={m.brands} />
            ) : (
              <ChevronRight style={{ width: 20, height: 20, color: 'var(--color-pago-sub)', flexShrink: 0 }} strokeWidth={2.2} />
            )}
          </button>
        )
      })}
    </div>
  )
}
