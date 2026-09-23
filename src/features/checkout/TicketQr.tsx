import { hashString } from '@/lib/random'
import type { ReactNode } from 'react'

interface Props {
  code: string
  size?: number
}

const N = 21

/** Deterministic QR-look SVG (demo only — not scannable). */
export function TicketQr({ code, size = 76 }: Props) {
  const seed = hashString(code)
  const cells: boolean[] = []
  let s = seed >>> 0
  for (let i = 0; i < N * N; i++) {
    s ^= s << 13
    s >>>= 0
    s ^= s >> 17
    s ^= s << 5
    s >>>= 0
    cells.push(((s ^ (s >> 15)) >>> 0 & 1) === 1)
  }

  const finderOn = (rr: number, cc: number): boolean => {
    const border = rr === 0 || rr === 6 || cc === 0 || cc === 6
    const core = rr >= 2 && rr <= 4 && cc >= 2 && cc <= 4
    return border || core
  }

  const cell = size / N
  const rects: ReactNode[] = []
  for (let r = 0; r < N; r++) {
    for (let c = 0; c < N; c++) {
      let on = cells[r * N + c]
      if (r < 7 && c < 7) on = finderOn(r, c)
      else if (r < 7 && c >= N - 7) on = finderOn(r, c - (N - 7))
      else if (r >= N - 7 && c < 7) on = finderOn(r - (N - 7), c)
      if (on) {
        rects.push(<rect key={`${r}-${c}`} x={c * cell} y={r * cell} width={cell} height={cell} fill="#0a0e2e" />)
      }
    }
  }

  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} style={{ display: 'block' }}>
      <rect x={0} y={0} width={size} height={size} fill="#fff" rx={Math.round(size * 0.04)} />
      {rects}
    </svg>
  )
}
