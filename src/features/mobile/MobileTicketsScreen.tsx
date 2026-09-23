import { useMemo, useState } from 'react'
import { Ticket as TicketIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { CALENDAR_EVENTS, DEMO_TODAY } from '@/data/calendar'
import { HOME_EVENTS } from '@/data/homeFeed'
import type { CalendarEvent, HomeEvent, Ticket, TicketStatus } from '@/data/types'
import { useCart, type CartLine } from '@/features/cart/CartContext'
import { HeroHeader } from '@/features/home/HeroHeader'
import { TicketCard } from '@/features/tickets/TicketCard'
import { TicketDetailSheet } from '@/features/tickets/TicketDetailSheet'
import { TicketStatusTabs } from '@/features/tickets/TicketStatusTabs'
import { useTickets } from '@/hooks/useTickets'
import { makeTicketCode, mockSeatSplit } from '@/lib/ticketCode'

const SUBTITLE = 'Aquí puedes ver todos tus boletos y su estado'

function isCalendarEvent(event: HomeEvent | CalendarEvent | undefined): event is CalendarEvent {
  return event !== undefined && 'dateISO' in event
}

/** Map a cart line to a Ticket (resolving event metadata from the catalogue). */
function cartTicket(line: CartLine): Ticket {
  const [eventId, zoneId] = line.key.split(':')
  const event = HOME_EVENTS.find((e) => e.id === eventId) ?? CALENDAR_EVENTS.find((e) => e.id === eventId)
  const quantity = line.quantity ?? line.seatIds.length
  const split = mockSeatSplit(line.key, quantity)
  return {
    id: line.key,
    eventId,
    title: line.eventTitle,
    competition: event?.competition ?? '',
    category: event?.category ?? 'otros',
    dateISO: isCalendarEvent(event) ? event.dateISO : DEMO_TODAY,
    dateLabel: event?.dateLabel ?? line.eventMeta.split(' · ')[0] ?? '',
    time: event?.time ?? line.eventMeta.split(' · ')[1] ?? '',
    venue: event?.venue ?? 'Estadio Rommel Fernández Gutiérrez',
    city: event?.city ?? 'Panamá, Panamá',
    thumbnail: event?.thumbnail ?? '/assets/home/hero-stadium.webp',
    zoneLabel: line.zoneLabel,
    row: split.row,
    seats: split.seats,
    quantity,
    typeLabel: /occidental|vip/i.test(line.zoneLabel) ? 'VIP' : 'General',
    status: 'upcoming',
    code: makeTicketCode(eventId, zoneId ?? '', event?.dateLabel),
  }
}

function EmptyState({ tab }: { tab: TicketStatus }) {
  const copy = {
    upcoming: 'No tienes boletos próximos',
    past: 'No tienes boletos pasados',
    cancelled: 'No tienes boletos cancelados',
  }[tab]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '44px 16px' }}>
      <span className="grid place-items-center rounded-full" style={{ width: 64, height: 64, background: 'var(--color-mobile-pill)' }}>
        <TicketIcon style={{ width: 28, height: 28 }} strokeWidth={1.8} color="var(--color-mobile-azul)" />
      </span>
      <p style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-mobile-ink)', marginTop: 14 }}>{copy}</p>
      <p style={{ fontSize: 13, color: 'var(--color-mobile-meta)', marginTop: 6, maxWidth: 260 }}>
        Cuando compres entradas aparecerán aquí, listas para escanear en el estadio.
      </p>
    </div>
  )
}

export default function MobileTicketsScreen() {
  const { lines } = useCart()
  const { data: demo, isLoading } = useTickets()
  const navigate = useNavigate()
  const [tab, setTab] = useState<TicketStatus>('upcoming')
  const [qrTicket, setQrTicket] = useState<Ticket | null>(null)

  const buckets = useMemo(() => {
    const cart = lines.map(cartTicket)
    const demoTickets = demo ?? []
    return {
      upcoming: [...cart, ...demoTickets.filter((t) => t.status === 'upcoming')],
      past: demoTickets.filter((t) => t.status === 'past'),
      cancelled: demoTickets.filter((t) => t.status === 'cancelled'),
    }
  }, [lines, demo])

  const list = buckets[tab]

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--color-mobile-bg)' }}>
      <div style={{ background: 'linear-gradient(180deg, #01244d 0%, #021127 100%)' }}>
        <HeroHeader variant="tabs" />
        <div style={{ padding: '6px 16px 26px' }}>
          <h1 style={{ fontSize: 20, fontWeight: 800, lineHeight: 1.2, color: '#fff' }}>Mis tickets</h1>
          <p style={{ fontSize: 11, lineHeight: 1.4, color: 'rgba(255,255,255,0.72)', marginTop: 4 }}>{SUBTITLE}</p>
        </div>
      </div>

      <div
        style={{
          marginTop: -20,
          background: 'var(--color-ticket-sheet)',
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          flex: 1,
          paddingTop: 10,
          paddingBottom: 24,
        }}
      >
        <TicketStatusTabs value={tab} onChange={setTab} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: '12px 16px 0' }}>
          {isLoading && demo === undefined ? (
            <p style={{ textAlign: 'center', color: 'var(--color-mobile-meta)', fontSize: 13, padding: '36px 0' }}>Cargando tus boletos…</p>
          ) : list.length === 0 ? (
            <EmptyState tab={tab} />
          ) : (
            list.map((ticket) => (
              <TicketCard
                key={ticket.id}
                ticket={ticket}
                onOpenQr={setQrTicket}
                onDetails={(t) => navigate(`/comprar/${t.eventId}`)}
              />
            ))
          )}
        </div>
      </div>

      {qrTicket && <TicketDetailSheet ticket={qrTicket} onClose={() => setQrTicket(null)} />}
    </div>
  )
}

