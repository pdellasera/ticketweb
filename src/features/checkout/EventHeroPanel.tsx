import { CalendarDays, Clock, MapPin } from 'lucide-react'

import type { HomeEvent } from '@/data/types'
import { TeamCrest } from '@/components/ui/TeamCrest'
import { HeroHeader } from '@/features/home/HeroHeader'

/** Dark navy hero panel with crests, VS, and event meta (mock y 0..376 clone). */
export function EventHeroPanel({ event }: { event?: HomeEvent }) {
  const teams = event?.title ? event.title.split(/\s+vs\s+/i) : []
  const isMatch = teams.length === 2

  return (
    <div
      style={{
        position: 'relative',
        height: 236,
        paddingTop: 'env(safe-area-inset-top, 0px)',
        background: 'linear-gradient(180deg, #0a2a4e 0%, #06203c 38%, #041424 70%, #020c1a 100%)',
        overflow: 'hidden',
      }}
    >
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(120% 90% at 50% 0%, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0) 46%)' }} />

      <HeroHeader />

      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 10 }}>
        {isMatch ? (
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', gap: 22 }}>
            <div className="flex flex-col items-center" style={{ gap: 5, width: 120 }}>
              <TeamCrest name={teams[0]} />
              <span style={{ color: '#fff', fontSize: 12, fontWeight: 600, lineHeight: 1.15, textAlign: 'center' }}>{teams[0]}</span>
            </div>
            <span style={{ color: '#fff', fontSize: 24, fontWeight: 800, letterSpacing: 1, marginTop: 9 }}>VS</span>
            <div className="flex flex-col items-center" style={{ gap: 5, width: 120 }}>
              <TeamCrest name={teams[1]} />
              <span style={{ color: '#fff', fontSize: 12, fontWeight: 600, lineHeight: 1.15, textAlign: 'center' }}>{teams[1]}</span>
            </div>
          </div>
        ) : (
          <h1 style={{ color: '#fff', fontSize: 22, fontWeight: 700, textAlign: 'center', maxWidth: 300, lineHeight: 1.2 }}>{event?.title ?? 'Evento'}</h1>
        )}

        <div style={{ marginTop: isMatch ? 10 : 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, color: 'rgba(255,255,255,0.92)' }}>
          <span className="flex items-center" style={{ gap: 6 }}>
            <CalendarDays style={{ width: 15, height: 15 }} strokeWidth={2} />
            <span style={{ fontSize: 11, fontWeight: 500, whiteSpace: 'nowrap' }}>{event?.dateLabel ?? ''}</span>
          </span>
          <span style={{ width: 1, height: 24, background: 'rgba(255,255,255,0.28)' }} />
          <span className="flex items-center" style={{ gap: 6 }}>
            <Clock style={{ width: 15, height: 15 }} strokeWidth={2} />
            <span style={{ fontSize: 11, fontWeight: 500, whiteSpace: 'nowrap' }}>{event?.time ?? ''}</span>
          </span>
        </div>

        <div className="flex items-center" style={{ marginTop: 5, gap: 6, color: 'rgba(255,255,255,0.92)', maxWidth: 320, textAlign: 'center' }}>
          <MapPin style={{ width: 15, height: 15, flexShrink: 0 }} strokeWidth={2} />
          <span style={{ fontSize: 11, fontWeight: 500, lineHeight: 1.3 }}>
            {event?.venue ?? ''}
            {event?.city ? `, ${event.city}` : ''}
          </span>
        </div>
      </div>
    </div>
  )
}
