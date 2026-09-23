import { Check } from 'lucide-react'

const LABELS = ['Zona', 'Pago', 'Confirmación']
const STEP_COUNT = LABELS.length
const INSET = `${100 / (STEP_COUNT * 2)}%`

/** 4-step progress indicator: equal columns, 1px connector, 26px circles. */
export function CheckoutStepper({ current = 0 }: { current?: number }) {
  return (
    <div style={{ paddingTop: 12 }}>
      <div style={{ position: 'relative' }}>
        <div
          style={{
            position: 'absolute',
            top: 12.5,
            left: INSET,
            right: INSET,
            height: 1,
            background: 'var(--color-stepper-line)',
          }}
        />

        <div className="flex">
          {LABELS.map((label, i) => {
            const done = i < current
            const active = i === current
            const on = done || active
            return (
              <div key={label} className="flex flex-col items-center" style={{ flex: 1, gap: 7 }}>
                <span
                  className="relative z-10 grid place-items-center rounded-full font-bold"
                  style={{
                    width: 26,
                    height: 26,
                    fontSize: 13,
                    lineHeight: 1,
                    background: on ? 'var(--color-mobile-step)' : 'var(--color-mobile-step-inactive)',
                    color: on ? '#fff' : 'var(--color-mobile-step-num)',
                  }}
                >
                  {done ? <Check style={{ width: 15, height: 15 }} strokeWidth={3} /> : i + 1}
                </span>
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: active ? 700 : done ? 600 : 500,
                    lineHeight: 1,
                    color: on ? 'var(--color-checkout-ink)' : 'var(--color-mobile-meta)',
                  }}
                >
                  {label}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
