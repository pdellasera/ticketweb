import { CalendarDays, ChevronRight, Clock, MapPin } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import type { CalendarEvent } from '@/data/types'
import { CATEGORY_META } from './categoryMeta'
import { MatchThumbnail } from './MatchThumbnail'

export function CalendarEventCard({ event }: { event: CalendarEvent }) {
  const navigate = useNavigate()
  const meta = CATEGORY_META[event.category]

  return (
    <button
      type="button"
      onClick={() => navigate(`/comprar/${event.id}`)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        padding: '1px 14px 1px 9px',
        borderRadius: 14,
        background: 'var(--color-cal-card)',
        boxShadow: '0 6px 18px -12px rgba(11,31,56,0.14)',
        textAlign: 'left',
        border: 'none',
        cursor: 'pointer',
        width: '100%',
      }}
    >
      {event.category === 'futbol' ? (
        <MatchThumbnail title={event.title} />
      ) : (
        <img
          src={event.thumbnail}
          alt=""
          style={{ width: 126, height: 90, borderRadius: 10, objectFit: 'cover', flexShrink: 0, display: 'block' }}
        />
      )}

      <div style={{ flex: 1, minWidth: 0 }}>
        <span
          className="inline-flex items-center"
          style={{
            height: 20,
            paddingLeft: 9,
            paddingRight: 9,
            borderRadius: 999,
            background: meta.tint,
            color: meta.color,
            fontSize: 11,
            fontWeight: 600,
            lineHeight: 1,
          }}
        >
          {meta.label}
        </span>

        <h3
          className="font-semibold"
          style={{
            fontSize: 15,
            lineHeight: 1.18,
            color: 'var(--color-cal-ink)',
            marginTop: 4,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {event.title}
        </h3>

        <div style={{ marginTop: 4, display: 'flex', flexDirection: 'column', gap: 3 }}>
          <div className="flex items-center" style={{ gap: 5, color: 'var(--color-mobile-meta)', fontSize: 12, lineHeight: 1.2 }}>
            <CalendarDays style={{ width: 13, height: 13, flexShrink: 0 }} strokeWidth={2} />
            <span>{event.dateLabel}</span>
            <Clock style={{ width: 13, height: 13, flexShrink: 0, marginLeft: 4 }} strokeWidth={2} />
            <span>{event.time}</span>
          </div>
          <div className="flex items-start" style={{ gap: 5, color: 'var(--color-mobile-meta)', fontSize: 12, lineHeight: 1.2 }}>
            <MapPin style={{ width: 13, height: 13, flexShrink: 0, marginTop: 1 }} strokeWidth={2} />
            <span
              style={{
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {event.venue}, {event.city}
            </span>
          </div>
        </div>
      </div>

      <ChevronRight style={{ width: 20, height: 20, flexShrink: 0, color: 'var(--color-mobile-meta)' }} strokeWidth={2.2} />
    </button>
  )
}
