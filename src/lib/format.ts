/** Format a number as US dollars (e.g. "$ 12.00"). */
export function formatUSD(value: number, decimals = 2): string {
  return `$ ${value.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}`
}

/** Compact thousands (e.g. 12.5K). */
export function formatCompact(value: number): string {
  return new Intl.NumberFormat('es-PA', { notation: 'compact', maximumFractionDigits: 1 }).format(value)
}

/** Human-friendly date, Panamá locale. */
export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('es-PA', { weekday: 'short', day: 'numeric', month: 'short' })
}

/** Format seat ids like ["E5","E6","A3"] -> "Fila E • Asientos 5, 6". */
export function formatSeatSelection(seatIds: string[]): string {
  const byRow = new Map<string, number[]>()
  for (const id of seatIds) {
    const m = /^([A-Za-z]+)(\d+)$/.exec(id)
    if (!m) continue
    const row = m[1].toUpperCase()
    const cols = byRow.get(row) ?? []
    cols.push(Number(m[2]))
    byRow.set(row, cols)
  }
  return [...byRow.entries()]
    .map(([row, cols]) => `Fila ${row} • Asientos ${cols.sort((a, b) => a - b).join(', ')}`)
    .join('  ·  ')
}

