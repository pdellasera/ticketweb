import { CalendarDays, Clock, MapPin } from 'lucide-react'

import type { Evento } from '@/data/types'
import { Badge } from '@/components/ui/Badge'
import { TeamBadge } from '@/components/ui/TeamBadge'
import { formatDate } from '@/lib/format'

const STATUS: Record<Evento['status'], { label: string; tone: 'success' | 'warning' | 'danger' }> = {
  'on-sale': { label: 'A la venta', tone: 'success' },
  soon: { label: 'Próximamente', tone: 'warning' },
  'sold-out': { label: 'Agotado', tone: 'danger' },
}

function Team({ code, name, align }: { code: string; name: string; align: 'left' | 'right' }) {
  return (
    <div className={align === 'left' ? 'flex flex-col items-start gap-2' : 'flex flex-col items-end gap-2'}>
      <TeamBadge code={code} className="h-12 w-12 text-sm" />
      <span className="font-display text-base font-bold text-ink-900">{name}</span>
    </div>
  )
}

export function EventHeader({ event }: { event: Evento }) {
  const status = STATUS[event.status]
  return (
    <div className="rounded-card border border-line bg-card p-5 shadow-card sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <Badge tone="info">{event.competition}</Badge>
        <Badge tone={status.tone}>{status.label}</Badge>
      </div>

      <div className="mt-5 flex items-center justify-center gap-6 sm:gap-10">
        <Team code={event.homeCode} name={event.homeTeam} align="left" />
        <div className="shrink-0 text-center">
          <span className="font-display text-3xl font-extrabold text-ink-400">VS</span>
          <p className="mt-1 text-sm font-semibold text-ink-600">{event.time}</p>
        </div>
        <Team code={event.awayCode} name={event.awayTeam} align="right" />
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 border-t border-line pt-4 text-sm text-ink-600">
        <span className="inline-flex items-center gap-1.5">
          <CalendarDays className="h-4 w-4 text-ink-400" />
          {formatDate(event.dateISO)}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Clock className="h-4 w-4 text-ink-400" />
          {event.time}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <MapPin className="h-4 w-4 text-ink-400" />
          {event.venue}
        </span>
      </div>
    </div>
  )
}
