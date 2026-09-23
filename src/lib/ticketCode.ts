import { hashString, mulberry32 } from '@/lib/random'

const ES_MONTHS: Record<string, string> = {
  enero: '01',
  febrero: '02',
  marzo: '03',
  abril: '04',
  mayo: '05',
  junio: '06',
  julio: '07',
  agosto: '08',
  septiembre: '09',
  octubre: '10',
  noviembre: '11',
  diciembre: '12',
}

/** "15 de octubre de 2026" -> "20261015". Falls back to the demo date. */
export function dateDigits(dateLabel: string | undefined): string {
  if (!dateLabel) return '20261015'
  const m = /(\d{1,2})\s+de\s+([a-záéíóúñ]+)\s+de\s+(\d{4})/i.exec(dateLabel)
  if (!m) return '20261015'
  const month = ES_MONTHS[m[2].toLowerCase()]
  if (!month) return '20261015'
  return `${m[3]}${month}${m[1].padStart(2, '0')}`
}

/** Stable, deterministic ticket code: GG-YYYYMMDD-#### (demo only, not a real barcode). */
export function makeTicketCode(eventId: string, zoneId: string, dateLabel?: string): string {
  const suffix = String(hashString(`${eventId}:${zoneId}`) % 10000).padStart(4, '0')
  return `GG-${dateDigits(dateLabel)}-${suffix}`
}

/** Deterministic mock seat split (row letter + consecutive seat numbers). */
export function mockSeatSplit(key: string, quantity: number): { row: string; seats: number[] } {
  const rand = mulberry32(hashString(`${key}:seats`))
  const row = String.fromCharCode(65 + Math.floor(rand() * 10)) // A..J
  const start = 1 + Math.floor(rand() * 18) // 1..18
  const seats = Array.from({ length: Math.max(1, quantity) }, (_, i) => start + i)
  return { row, seats }
}
