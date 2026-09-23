const ES_MONTHS_ABBR: Record<string, string> = {
  '01': 'ENE',
  '02': 'FEB',
  '03': 'MAR',
  '04': 'ABR',
  '05': 'MAY',
  '06': 'JUN',
  '07': 'JUL',
  '08': 'AGO',
  '09': 'SEP',
  '10': 'OCT',
  '11': 'NOV',
  '12': 'DIC',
}

/** "8:00 PM" / "20:00" / "20:00 " -> "8 PM". */
function normalizeTime(time: string): string {
  const clean = (time ?? '').trim()
  const m = /^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i.exec(clean)
  if (!m) return clean || '—'
  let hour = Number(m[1])
  const period = (m[3] ?? '').toUpperCase() || (hour >= 12 ? 'PM' : 'AM')
  hour = hour % 12 || 12
  return `${hour} ${period}`
}

export interface TicketDateParts {
  day: string
  month: string
  hour: string
}

/** Split a ticket dateISO + time into the DÍA / MES / HORA stat boxes. */
export function splitTicketDate(dateISO: string, time: string): TicketDateParts {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateISO ?? '')
  return {
    day: m ? String(Number(m[3])) : '—',
    month: m ? ES_MONTHS_ABBR[m[2]] ?? '—' : '—',
    hour: normalizeTime(time),
  }
}