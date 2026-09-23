import { Minus, Plus, Ticket } from 'lucide-react'

interface Props {
  quantity: number
  onChange: (next: number) => void
  max?: number
}

/** "Cantidad de entradas" card with a − / + stepper (1..max). */
export function TicketQuantityCard({ quantity, onChange, max = 8 }: Props) {
  const dec = () => onChange(Math.max(1, quantity - 1))
  const inc = () => onChange(Math.min(max, quantity + 1))

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '14px 16px',
        background: 'var(--color-zona-card)',
        borderRadius: 12,
      }}
    >
      <span
        className="grid place-items-center"
        style={{ width: 40, height: 40, borderRadius: 12, background: 'var(--color-zona-radio)', flexShrink: 0 }}
      >
        <Ticket style={{ width: 20, height: 20, color: '#fff' }} strokeWidth={2} />
      </span>

      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 14, fontWeight: 700, lineHeight: 1.2, color: 'var(--color-zona-ink)' }}>Cantidad de entradas</p>
        <p style={{ fontSize: 12, lineHeight: 1.25, marginTop: 2, color: 'var(--color-zona-sub)' }}>
          Puedes comprar hasta {max} entradas por transacción.
        </p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
        <button
          type="button"
          onClick={dec}
          disabled={quantity <= 1}
          aria-label="Quitar una entrada"
          className="grid place-items-center"
          style={{
            width: 34,
            height: 34,
            borderRadius: '50%',
            background: quantity <= 1 ? '#eef1f6' : '#fff',
            border: '1px solid var(--color-zona-line)',
            color: quantity <= 1 ? '#b9c2d4' : 'var(--color-zona-ink)',
            cursor: quantity <= 1 ? 'default' : 'pointer',
          }}
        >
          <Minus style={{ width: 16, height: 16 }} strokeWidth={2.4} />
        </button>
        <span style={{ fontSize: 17, fontWeight: 700, lineHeight: 1, color: 'var(--color-zona-ink)', minWidth: 20, textAlign: 'center' }}>
          {quantity}
        </span>
        <button
          type="button"
          onClick={inc}
          disabled={quantity >= max}
          aria-label="Añadir una entrada"
          className="grid place-items-center"
          style={{
            width: 34,
            height: 34,
            borderRadius: '50%',
            background: quantity >= max ? '#eef1f6' : 'var(--color-zona-cta)',
            border: 'none',
            color: quantity >= max ? '#b9c2d4' : '#fff',
            cursor: quantity >= max ? 'default' : 'pointer',
          }}
        >
          <Plus style={{ width: 16, height: 16 }} strokeWidth={2.6} />
        </button>
      </div>
    </div>
  )
}
