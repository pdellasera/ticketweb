import { hashString, mulberry32 } from '@/lib/random'

import { CALENDAR_EVENTS } from './calendar'
import { EVENTOS } from './events'
import { HOME_EVENTS } from './homeFeed'
import { MOBILE_ZONES } from './mobileSeats'
import { SECTIONS, ZONES } from './stadium'
import { DEMO_TICKETS } from './tickets'
import type { CalendarEvent, Evento, HomeEvent, MobileZone, Seat, SeatState, Section, Ticket, Zone } from './types'

const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms))
const jitter = () => 200 + Math.random() * 220

/** Deterministic fill ratio (0.25–0.95) per event+section. */
function fillRatio(eventId: string, sectionId: string): number {
  const rand = mulberry32(hashString(`${eventId}:${sectionId}`))
  return 0.25 + rand() * 0.7
}

export async function getEventos(): Promise<Evento[]> {
  await delay(jitter())
  return EVENTOS
}

export async function getHomeFeed(): Promise<HomeEvent[]> {
  await delay(jitter())
  return HOME_EVENTS
}

export async function getHomeEvent(id: string): Promise<HomeEvent | undefined> {
  await delay(jitter())
  return HOME_EVENTS.find((e) => e.id === id) ?? CALENDAR_EVENTS.find((e) => e.id === id)
}

export async function getCalendarEvents(): Promise<CalendarEvent[]> {
  await delay(jitter())
  return CALENDAR_EVENTS
}

export async function getTickets(): Promise<Ticket[]> {
  await delay(jitter())
  return DEMO_TICKETS
}

export async function getMobileZones(_eventId: string): Promise<MobileZone[]> {
  await delay(jitter())
  return MOBILE_ZONES
}

export async function getEvento(id: string): Promise<Evento | undefined> {
  await delay(jitter())
  return EVENTOS.find((e) => e.id === id)
}

export async function getZones(): Promise<Zone[]> {
  await delay(240)
  return ZONES
}

export async function getSections(eventId: string): Promise<Section[]> {
  await delay(jitter())
  return SECTIONS.map((s) => {
    const fill = fillRatio(eventId, s.id)
    return { ...s, availableSeats: Math.max(0, Math.round(s.totalSeats * (1 - fill))) }
  })
}

export async function getSection(eventId: string, sectionId: string): Promise<Section | undefined> {
  const sections = await getSections(eventId)
  return sections.find((s) => s.id === sectionId)
}

/** Deterministic per-seat state grid for a section. */
export async function getSeats(eventId: string, section: Section): Promise<Seat[]> {
  await delay(jitter())
  const rand = mulberry32(hashString(`${eventId}:${section.id}:seats`))
  const seats: Seat[] = []
  for (let r = 0; r < section.rows; r++) {
    for (let c = 0; c < section.seatsPerRow; c++) {
      const roll = rand()
      const state: SeatState = roll < 0.34 ? 'occupied' : roll < 0.4 ? 'reserved' : 'available'
      seats.push({ id: `${section.id}-r${r}c${c}`, rowLabel: String.fromCharCode(65 + r), col: c + 1, state })
    }
  }
  return seats
}

