import { CalendarDays, Clock, MapPin } from 'lucide-react'

import type { HomeEvent } from '@/data/types'
import { TeamCrest } from '@/components/ui/TeamCrest'
import { HeroHeader } from '@/features/home/HeroHeader'

/** Compact hero for the Pago screen: photo + crests left · divider · 3 meta rows right. */
export function PaymentHero({ event, backTo }: { event?: HomeEvent; backTo: string }) {
  const teams = event?.title ? event.title.split(/\s+vs\s+/i) : []
  const isMatch = teams.length === 2

  return (
    <div style={{ position: 'relative' }}>
      <HeroHeader variant="flow" backTo={backTo} />

      <div style={{ position: 'relative', height: 110, overflow: 'hidden' }}>
        <img
          src="/assets/home/hero-stadium.webp"
          alt=""
          aria-hidden="true"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 40%' }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, rgba(1,26,52,0.82) 0%, rgba(3,20,42,0.88) 55%, rgba(3,20,42,0.94) 100%)',
          }}
        />

        <div style={{ position: 'relative', height: '100%', display: 'flex', alignItems: 'center', paddingLeft: 20, paddingRight: 20 }}>
          {isMatch ? (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, width: 60 }}>
                  <TeamCrest name={teams[0]} size={34} />
                  <span style={{ color: '#fff', fontSize: 10, fontWeight: 600, lineHeight: 1.1, textAlign: 'center' }}>{teams[0]}</span>
                </div>
                <span style={{ color: '#fff', fontSize: 15, fontWeight: 800, letterSpacing: 0.5 }}>VS</span>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, width: 60 }}>
                  <TeamCrest name={teams[1]} size={34} />
                  <span style={{ color: '#fff', fontSize: 10, fontWeight: 600, lineHeight: 1.1, textAlign: 'center' }}>{teams[1]}</span>
                </div>
              </div>

              <span style={{ width: 1, height: 62, background: 'rgba(255,255,255,0.3)', marginLeft: 16, marginRight: 16, flexShrink: 0 }} />
            </>
          ) : (
            <h1 style={{ color: '#fff', fontSize: 18, fontWeight: 700, maxWidth: 190, lineHeight: 1.2, flexShrink: 0 }}>{event?.title ?? 'Evento'}</h1>
          )}

          <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 8, color: 'rgba(255,255,255,0.92)' }}>
            <span className="flex items-center" style={{ gap: 7 }}>
              <CalendarDays style={{ width: 14, height: 14, flexShrink: 0 }} strokeWidth={2} />
              <span style={{ fontSize: 12, fontWeight: 500, lineHeight: 1.2 }}>{event?.dateLabel ?? ''}</span>
            </span>
            <span className="flex items-center" style={{ gap: 7 }}>
              <Clock style={{ width: 14, height: 14, flexShrink: 0 }} strokeWidth={2} />
              <span style={{ fontSize: 12, fontWeight: 500, lineHeight: 1.2 }}>{event?.time ?? ''}</span>
            </span>
            <span className="flex items-start" style={{ gap: 7 }}>
              <MapPin style={{ width: 14, height: 14, flexShrink: 0, marginTop: 1 }} strokeWidth={2} />
              <span style={{ fontSize: 12, fontWeight: 500, lineHeight: 1.25 }}>
                {event?.venue ?? ''}
                {event?.city ? ` · ${event.city}` : ''}
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
