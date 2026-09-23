import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react'
import type { CSSProperties } from 'react'

import { MESES, monthLabel } from '@/lib/calendar'

interface Props {
  year: number
  month: number
  pickerOpen: boolean
  onPrev: () => void
  onNext: () => void
  onToday: () => void
  onPickMonth: (month: number) => void
  onTogglePicker: () => void
}

const ARROW_BTN: CSSProperties = {
  width: 30,
  height: 30,
  borderRadius: '50%',
  background: 'var(--color-cal-arrow-bg)',
  color: 'var(--color-cal-ink)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: 'none',
  cursor: 'pointer',
  flexShrink: 0,
  padding: 0,
}

export function MonthNavigator({ year, month, pickerOpen, onPrev, onNext, onToday, onPickMonth, onTogglePicker }: Props) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingLeft: 10, paddingRight: 10 }}>
      <button type="button" onClick={onPrev} aria-label="Mes anterior" style={ARROW_BTN}>
        <ChevronLeft style={{ width: 20, height: 20 }} strokeWidth={2.4} />
      </button>

      <div style={{ position: 'relative' }}>
        <button
          type="button"
          onClick={onTogglePicker}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
            color: 'var(--color-cal-ink)',
            fontFamily: 'var(--font-display)',
            fontSize: 17,
            fontWeight: 700,
            lineHeight: 1,
          }}
        >
          {monthLabel(year, month)}
          <ChevronDown style={{ width: 16, height: 16 }} strokeWidth={2.4} />
        </button>

        {pickerOpen && (
          <div
            style={{
              position: 'absolute',
              top: 30,
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 30,
              background: '#fff',
              borderRadius: 12,
              boxShadow: 'var(--shadow-pop)',
              padding: 6,
              width: 172,
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 2,
            }}
          >
            {MESES.map((m, i) => (
              <button
                key={m}
                type="button"
                onClick={() => onPickMonth(i)}
                style={{
                  padding: '7px 8px',
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: i === month ? 700 : 500,
                  textAlign: 'center',
                  color: i === month ? '#fff' : 'var(--color-cal-ink)',
                  background: i === month ? 'var(--color-cal-blue)' : 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                {m}
              </button>
            ))}
          </div>
        )}
      </div>

      <button type="button" onClick={onNext} aria-label="Mes siguiente" style={ARROW_BTN}>
        <ChevronRight style={{ width: 20, height: 20 }} strokeWidth={2.4} />
      </button>

      <button
        type="button"
        onClick={onToday}
        style={{
          height: 28,
          paddingLeft: 14,
          paddingRight: 14,
          borderRadius: 8,
          background: 'var(--color-cal-pill)',
          color: 'var(--color-cal-pill-text)',
          fontSize: 13,
          fontWeight: 600,
          lineHeight: 1,
          border: 'none',
          cursor: 'pointer',
        }}
      >
        Hoy
      </button>
    </div>
  )
}
