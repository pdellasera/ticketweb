import { CreditCard } from 'lucide-react'

const SIZE = 158
const R = 70
const CIRC = 2 * Math.PI * R

/** Animated processing spinner: light track ring + blue arc + centered card glyph. */
export function ProcessingLoader() {
  return (
    <div className="relative" style={{ width: SIZE, height: SIZE, margin: '0 auto' }}>
      <div className="animate-gg-spin" style={{ width: SIZE, height: SIZE }}>
        <svg viewBox={`0 0 ${SIZE} ${SIZE}`} width={SIZE} height={SIZE}>
          <circle cx={SIZE / 2} cy={SIZE / 2} r={R} fill="none" stroke="var(--color-pago-track)" strokeWidth={11} />
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={R}
            fill="none"
            stroke="var(--color-pago-blue)"
            strokeWidth={11}
            strokeLinecap="round"
            strokeDasharray={`${CIRC * 0.72} ${CIRC}`}
            transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
          />
        </svg>
      </div>

      <div
        className="absolute grid place-items-center"
        style={{
          inset: 0,
          margin: 'auto',
          width: 84,
          height: 82,
          background: '#fff',
          borderRadius: 14,
          boxShadow: '0 10px 26px -12px rgba(11,31,56,0.28)',
        }}
      >
        <CreditCard style={{ width: 40, height: 30 }} strokeWidth={2} color="var(--color-pago-blue)" />
      </div>
    </div>
  )
}
