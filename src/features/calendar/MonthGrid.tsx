import type { CalendarEvent } from '@/data/types'
import type { DayCell } from '@/lib/calendar'
import { CATEGORY_META } from './categoryMeta'

const WEEKDAYS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']

interface Props {
  grid: DayCell[][]
  selectedISO: string
  todayISO: string
  eventsByDay: Map<string, CalendarEvent[]>
  onSelect: (iso: string) => void
}

export function MonthGrid({ grid, selectedISO, todayISO, eventsByDay, onSelect }: Props) {
  return (
    <div>
      <div style={{ display: 'flex' }}>
        {WEEKDAYS.map((d) => (
          <div
            key={d}
            style={{
              flex: 1,
              textAlign: 'center',
              fontSize: 12.5,
              fontWeight: 500,
              color: 'var(--color-cal-label)',
              paddingBottom: 8,
            }}
          >
            {d}
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {grid.map((row, ri) => (
          <div key={ri} style={{ display: 'flex' }}>
            {row.map((cell) => {
              const events = eventsByDay.get(cell.iso)
              const selected = cell.iso === selectedISO
              const today = cell.iso === todayISO
              const muted = !cell.inMonth && !selected
              const dotColor = events && events.length > 0 ? CATEGORY_META[events[0].category].color : undefined

              return (
                <button
                  key={cell.iso}
                  type="button"
                  onClick={() => onSelect(cell.iso)}
                  style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 3,
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0,
                  }}
                >
                  <span
                    style={{
                      width: 46,
                      height: 28,
                      borderRadius: 12,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: selected ? 'var(--color-cal-blue)' : 'transparent',
                      boxShadow: today && !selected ? 'inset 0 0 0 1.5px var(--color-cal-blue)' : 'none',
                      color: selected ? '#fff' : muted ? 'var(--color-cal-muted)' : 'var(--color-cal-ink)',
                      fontSize: 15,
                      fontWeight: selected ? 700 : 500,
                      lineHeight: 1,
                    }}
                  >
                    {cell.day}
                  </span>
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      background: selected ? '#fff' : (dotColor ?? 'transparent'),
                    }}
                  />
                </button>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}
