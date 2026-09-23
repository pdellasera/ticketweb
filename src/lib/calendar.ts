export const MESES = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
] as const

export interface DayCell {
  iso: string
  day: number
  inMonth: boolean
}

const pad = (n: number) => String(n).padStart(2, '0')

/** Local "YYYY-MM-DD" (timezone-safe, no UTC shift). */
export function toISO(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

/** Monday-first month grid. Returns only the weeks that contain in-month days. */
export function monthMatrix(year: number, month: number): DayCell[][] {
  const firstDow = (new Date(year, month, 1).getDay() + 6) % 7
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const weeks = Math.ceil((firstDow + daysInMonth) / 7)
  const start = new Date(year, month, 1 - firstDow)

  const grid: DayCell[][] = []
  for (let w = 0; w < weeks; w++) {
    const row: DayCell[] = []
    for (let c = 0; c < 7; c++) {
      const d = new Date(start.getFullYear(), start.getMonth(), start.getDate() + w * 7 + c)
      row.push({ iso: toISO(d), day: d.getDate(), inMonth: d.getMonth() === month })
    }
    grid.push(row)
  }
  return grid
}

export function monthLabel(year: number, month: number): string {
  return `${MESES[month]} ${year}`
}

export function addMonths(year: number, month: number, delta: number): { year: number; month: number } {
  const d = new Date(year, month + delta, 1)
  return { year: d.getFullYear(), month: d.getMonth() }
}

/** "12 de octubre" (no year). */
export function dayAndMonthLabel(iso: string): string {
  const [, m, d] = iso.split('-').map(Number)
  return `${d} de ${MESES[m - 1].toLowerCase()}`
}

/** "12 de octubre de 2026". */
export function longDateLabel(iso: string): string {
  return `${dayAndMonthLabel(iso)} de ${iso.split('-')[0]}`
}
