import { makeTicketCode } from '@/lib/ticketCode'

import { CALENDAR_EVENTS, DEMO_TODAY } from './calendar'
import type { Ticket, TicketStatus } from './types'

interface TicketSeed {
  eventId: string
  zoneLabel: string
  row: string
  seats: number[]
  typeLabel: string
  status?: TicketStatus
  isNext?: boolean
}

function build(seed: TicketSeed): Ticket {
  const event = CALENDAR_EVENTS.find((e) => e.id === seed.eventId)
  if (!event) throw new Error(`Unknown calendar event: ${seed.eventId}`)
  const status = seed.status ?? (event.dateISO < DEMO_TODAY ? 'past' : 'upcoming')
  return {
    id: `${event.id}:demo`,
    eventId: event.id,
    title: event.title,
    competition: event.competition,
    category: event.category,
    dateISO: event.dateISO,
    dateLabel: event.dateLabel,
    time: event.time,
    venue: event.venue,
    city: event.city,
    thumbnail: event.thumbnail,
    zoneLabel: seed.zoneLabel,
    row: seed.row,
    seats: seed.seats,
    quantity: seed.seats.length,
    typeLabel: seed.typeLabel,
    status,
    code: makeTicketCode(event.id, seed.zoneLabel, event.dateLabel),
    isNext: seed.isNext,
  }
}

/** Curated demo ticket catalogue (mirrors the reference mock's 3 tickets + past/cancelled tabs). */
export const DEMO_TICKETS: Ticket[] = [
  // Próximos
  build({ eventId: 'cal-sporting-alianza', zoneLabel: 'Norte', row: 'E', seats: [5, 6], typeLabel: 'General', isNext: true }),
  build({ eventId: 'cal-sech-22', zoneLabel: 'Occidental', row: 'B', seats: [12, 13, 14], typeLabel: 'VIP' }),
  build({ eventId: 'cal-principito-31', zoneLabel: 'Platea', row: 'C', seats: [7, 8], typeLabel: 'General' }),
  // Pasados
  build({ eventId: 'cal-principito-03', zoneLabel: 'Platea', row: 'A', seats: [3, 4], typeLabel: 'General' }),
  build({ eventId: 'cal-sech-06', zoneLabel: 'Occidental', row: 'D', seats: [9, 10], typeLabel: 'VIP' }),
  // Cancelado
  build({ eventId: 'cal-comedy-10', zoneLabel: 'General', row: 'A', seats: [11, 12], typeLabel: 'General', status: 'cancelled' }),
]
