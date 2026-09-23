import { useMemo, useState } from 'react'

import { CALENDAR_EVENTS, DEMO_MONTH, DEMO_TODAY, DEMO_YEAR } from '@/data/calendar'
import type { CalendarEvent } from '@/data/types'
import { useCalendarEvents } from '@/hooks/useCalendar'
import { addMonths, dayAndMonthLabel, monthMatrix } from '@/lib/calendar'
import { CalendarEventCard } from './CalendarEventCard'
import { CalendarHeroHeader } from './CalendarHeroHeader'
import { CategoryLegend } from './CategoryLegend'
import { CATEGORY_ORDER } from './categoryMeta'
import { MonthGrid } from './MonthGrid'
import { MonthNavigator } from './MonthNavigator'

export default function CalendarScreen() {
  const { data: events } = useCalendarEvents()
  const allEvents = events ?? CALENDAR_EVENTS
  const [view, setView] = useState({ year: DEMO_YEAR, month: DEMO_MONTH })
  const [selectedISO, setSelectedISO] = useState(DEMO_TODAY)
  const [pickerOpen, setPickerOpen] = useState(false)

  const eventsByDay = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>()
    for (const e of allEvents) {
      const list = map.get(e.dateISO) ?? []
      list.push(e)
      map.set(e.dateISO, list)
    }
    return map
  }, [allEvents])

  const selectedEvents = useMemo(() => {
    const list = eventsByDay.get(selectedISO) ?? []
    return [...list].sort((a, b) => CATEGORY_ORDER[a.category] - CATEGORY_ORDER[b.category])
  }, [eventsByDay, selectedISO])

  const grid = useMemo(() => monthMatrix(view.year, view.month), [view.year, view.month])

  function goPrev() {
    setView((v) => addMonths(v.year, v.month, -1))
  }
  function goNext() {
    setView((v) => addMonths(v.year, v.month, 1))
  }
  function goToday() {
    setView({ year: DEMO_YEAR, month: DEMO_MONTH })
    setSelectedISO(DEMO_TODAY)
    setPickerOpen(false)
  }
  function pickMonth(month: number) {
    setView((v) => ({ ...v, month }))
    setPickerOpen(false)
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--color-cal-bg)' }}>
      {/* Hero */}
      <div
        style={{
          position: 'relative',
          height: 140,
          overflow: 'hidden',
          background: 'linear-gradient(180deg, #052340 0%, #04213d 55%, #031e38 100%)',
        }}
      >
        <img
          src="/assets/home/hero-stadium.webp"
          alt=""
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.5 }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, rgba(4,26,52,0.55) 0%, rgba(3,9,21,0.82) 100%)',
          }}
        />

        <CalendarHeroHeader />

        <div style={{ position: 'relative', zIndex: 2, paddingLeft: 20, paddingRight: 20, marginTop: 2 }}>
          <h1 className="font-bold text-white" style={{ fontSize: 26, lineHeight: 1.1 }}>
            Ver calendario
          </h1>
          <p style={{ fontSize: 13.5, lineHeight: 1.4, marginTop: 6, color: 'rgba(255,255,255,0.92)' }}>
            Descubre todos los eventos por fecha
          </p>
        </div>
      </div>

      {/* White sheet: month nav + grid + legend */}
      <div
        style={{
          position: 'relative',
          marginTop: -14,
          background: 'var(--color-cal-card)',
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          boxShadow: '0 8px 26px -14px rgba(11,31,56,0.16)',
          paddingTop: 16,
          paddingBottom: 16,
        }}
      >
        <MonthNavigator
          year={view.year}
          month={view.month}
          pickerOpen={pickerOpen}
          onPrev={goPrev}
          onNext={goNext}
          onToday={goToday}
          onPickMonth={pickMonth}
          onTogglePicker={() => setPickerOpen((o) => !o)}
        />

        <div style={{ marginTop: 10, paddingLeft: 10, paddingRight: 10 }}>
          <MonthGrid
            grid={grid}
            selectedISO={selectedISO}
            todayISO={DEMO_TODAY}
            eventsByDay={eventsByDay}
            onSelect={setSelectedISO}
          />
        </div>

        <div style={{ marginTop: 12, paddingLeft: 16, paddingRight: 16 }}>
          <CategoryLegend />
        </div>
      </div>

      {/* Day's event list (page background) */}
      <div style={{ flex: 1 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'space-between',
            marginTop: 16,
            paddingLeft: 16,
            paddingRight: 16,
          }}
        >
          <h2 className="font-bold" style={{ fontSize: 18, color: 'var(--color-cal-ink)', lineHeight: 1.2 }}>
            Eventos del {dayAndMonthLabel(selectedISO)}
          </h2>
          <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-cal-count)', whiteSpace: 'nowrap' }}>
            {selectedEvents.length === 1 ? '1 evento' : `${selectedEvents.length} eventos`}
          </span>
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
            marginTop: 12,
            paddingLeft: 13,
            paddingRight: 13,
            paddingBottom: 24,
          }}
        >
          {selectedEvents.map((e) => (
            <CalendarEventCard key={e.id} event={e} />
          ))}
          {selectedEvents.length === 0 && (
            <p style={{ fontSize: 14, color: 'var(--color-mobile-meta)', padding: '24px 0', textAlign: 'center' }}>
              Sin eventos este día
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
