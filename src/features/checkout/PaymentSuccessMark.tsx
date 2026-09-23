import { Check } from 'lucide-react'

interface Confetti {
  left: string
  top: string
  rotate: number
  width: number
  color: string
}

const CONFETTI: Confetti[] = [
  { left: '18%', top: '0%', rotate: -18, width: 11, color: 'var(--color-confetti-green)' },
  { left: '42%', top: '-4%', rotate: 16, width: 10, color: 'var(--color-confetti-blue)' },
  { left: '72%', top: '0%', rotate: 26, width: 11, color: 'var(--color-confetti-mint)' },
  { left: '2%', top: '22%', rotate: -38, width: 10, color: 'var(--color-confetti-blue)' },
  { left: '88%', top: '18%', rotate: 34, width: 11, color: 'var(--color-confetti-green)' },
  { left: '-2%', top: '56%', rotate: -24, width: 9, color: 'var(--color-confetti-mint)' },
  { left: '92%', top: '54%', rotate: 20, width: 10, color: 'var(--color-confetti-blue)' },
  { left: '10%', top: '86%', rotate: 22, width: 10, color: 'var(--color-confetti-mint)' },
  { left: '40%', top: '96%', rotate: -14, width: 11, color: 'var(--color-confetti-green)' },
  { left: '70%', top: '88%', rotate: 12, width: 10, color: 'var(--color-confetti-blue)' },
  { left: '30%', top: '10%', rotate: 40, width: 8, color: 'var(--color-confetti-mint)' },
  { left: '60%', top: '6%', rotate: -30, width: 8, color: 'var(--color-confetti-green)' },
  { left: '82%', top: '36%', rotate: 44, width: 8, color: 'var(--color-confetti-green)' },
  { left: '6%', top: '38%', rotate: 18, width: 8, color: 'var(--color-confetti-blue)' },
]

/** Success mark: three concentric green circles + white check + scattered confetti. */
export function PaymentSuccessMark() {
  return (
    <div className="relative" style={{ width: 150, height: 150, margin: '0 auto' }}>
      {CONFETTI.map((c, i) => (
        <span
          key={i}
          style={{
            position: 'absolute',
            left: c.left,
            top: c.top,
            width: c.width,
            height: Math.round(c.width * 0.6),
            borderRadius: 2,
            background: c.color,
            transform: `rotate(${c.rotate}deg)`,
          }}
        />
      ))}

      <div
        className="absolute"
        style={{ left: 26, top: 26, width: 98, height: 98, borderRadius: '50%', background: 'var(--color-done-ring-outer)' }}
      />
      <div
        className="absolute"
        style={{ left: 36, top: 36, width: 78, height: 78, borderRadius: '50%', background: 'var(--color-done-ring)' }}
      />
      <div
        className="absolute grid place-items-center"
        style={{ left: 47.5, top: 47.5, width: 55, height: 55, borderRadius: '50%', background: 'var(--color-done-green)' }}
      >
        <Check style={{ width: 30, height: 30 }} strokeWidth={3.4} color="#fff" />
      </div>
    </div>
  )
}
