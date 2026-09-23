import { CalendarDays, Clock, MapPin, type LucideIcon } from 'lucide-react'

import { TeamCrest } from '@/components/ui/TeamCrest'
import type { Ticket } from '@/data/types'

function MetaRow({ icon: Icon, text }: { icon: LucideIcon; text: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 5, minWidth: 0 }}>
      <Icon style={{ width: 13, height: 13, flexShrink: 0 }} strokeWidth={2.2} color="rgba(255,255,255,0.9)" />
      <span
        style={{
          fontSize: 11,
          fontWeight: 600,
          color: '#fff',
          lineHeight: 1.2,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {text}
      </span>
    </div>
  )
}

/** Event banner: stadium/artwork background + (match) crests + date/time/venue column. */
export function TicketBanner({ ticket }: { ticket: Ticket }) {
  const isMatch = ticket.category === 'futbol'
  const teams = isMatch ? ticket.title.split(/\s+vs\s+/i) : []
  const height = isMatch ? 104 : 88

  return (
    <div style={{ position: 'relative', height, overflow: 'hidden' }}>
      <img
        src={ticket.thumbnail}
        alt=""
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
      />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(2,17,39,0.32) 0%, rgba(2,17,39,0.58) 100%)' }} />

      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          gap: 12,
          padding: '12px 14px',
        }}
      >
        {isMatch ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, flexShrink: 0 }}>
            <TeamCrest name={teams[0] ?? ''} size={34} />
            <span style={{ color: '#fff', fontSize: 12, fontWeight: 800, letterSpacing: 0.5 }}>VS</span>
            <TeamCrest name={teams[1] ?? ''} size={34} />
          </div>
        ) : (
          <div style={{ flex: 1 }} />
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 5, minWidth: 0, maxWidth: '60%', flexShrink: 1 }}>
          <MetaRow icon={CalendarDays} text={ticket.dateLabel} />
          <MetaRow icon={Clock} text={ticket.time} />
          <MetaRow icon={MapPin} text={ticket.venue} />
        </div>
      </div>

      {ticket.isNext && (
        <span
          style={{
            position: 'absolute',
            top: 10,
            right: 10,
            background: 'var(--color-ticket-badge)',
            color: '#fff',
            fontSize: 10,
            fontWeight: 700,
            padding: '4px 9px',
            borderRadius: 999,
            lineHeight: 1,
          }}
        >
          Próximo evento
        </span>
      )}
    </div>
  )
}
