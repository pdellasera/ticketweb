import { ArrowRight, CalendarDays, Clock, MapPin } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import type { HomeEvent } from '@/data/types'
import { formatUSD } from '@/lib/format'

export function EventListCard({ event }: { event: HomeEvent }) {
  const navigate = useNavigate()
  return (
    <div
      style={{
        borderRadius: 16,
        border: '1px solid var(--color-mobile-line)',
        background: '#fff',
        boxShadow: '0 6px 18px -12px rgba(11,31,56,0.12)',
        overflow: 'hidden',
      }}
    >
      <img
        src={event.thumbnail}
        alt=""
        style={{ width: '100%', height: 140, objectFit: 'cover', display: 'block' }}
      />

      <div style={{ padding: 12 }}>
        <h3
          className="font-semibold text-mobile-ink"
          style={{
            fontSize: 16,
            lineHeight: 1.25,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {event.title}
        </h3>

        <p className="text-mobile-meta" style={{ fontSize: 13, lineHeight: 1.2, marginTop: 2 }}>
          {event.competition}
        </p>

        {/* Meta */}
        <div style={{ marginTop: 6, display: 'flex', flexDirection: 'column', gap: 3 }}>
          <div className="flex items-center text-mobile-meta" style={{ fontSize: 13, lineHeight: 1.2, gap: 6 }}>
            <CalendarDays style={{ width: 15, height: 15, flexShrink: 0 }} strokeWidth={2} />
            <span>{event.dateLabel}</span>
            <Clock style={{ width: 15, height: 15, flexShrink: 0, marginLeft: 8 }} strokeWidth={2} />
            <span>{event.time}</span>
          </div>
          <div className="flex items-start text-mobile-meta" style={{ fontSize: 13, lineHeight: 1.25, gap: 6 }}>
            <MapPin style={{ width: 15, height: 15, flexShrink: 0, marginTop: 1 }} strokeWidth={2} />
            <span>
              {event.venue}, {event.city}
            </span>
          </div>
        </div>

        {/* Footer: price + CTA */}
        <div
          style={{
            marginTop: 10,
            paddingTop: 10,
            borderTop: '1px solid var(--color-mobile-line)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 8,
          }}
        >
          <div style={{ minWidth: 0 }}>
            <p className="text-mobile-meta" style={{ fontSize: 11, lineHeight: 1 }}>
              Desde
            </p>
            <p className="font-bold text-mobile-price" style={{ fontSize: 16, lineHeight: 1.15, marginTop: 2, whiteSpace: 'nowrap' }}>
              {formatUSD(event.priceFrom)}
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate(`/comprar/${event.id}`)}
            className="flex shrink-0 items-center justify-center bg-mobile-azul font-semibold text-white"
            style={{ height: 40, borderRadius: 10, fontSize: 13, gap: 6, paddingLeft: 14, paddingRight: 14 }}
          >
            Comprar entradas
            <ArrowRight style={{ width: 16, height: 16 }} strokeWidth={2.4} />
          </button>
        </div>
      </div>
    </div>
  )
}



