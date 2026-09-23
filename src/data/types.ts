export type ZoneId =
  | 'balboa'
  | 'este-sup'
  | 'este-inf'
  | 'sur-sup'
  | 'sur-inf'
  | 'oeste-sup'
  | 'oeste-inf'
  | 'parking'

export type Point = [number, number]

export interface Zone {
  id: ZoneId
  name: string
  shortName: string
  color: string
  price: number
  /** SVG polygon points, percent of image width/height. */
  points: Point[]
  /** Anchor for the floating pill label, percent. */
  labelPos: Point
}

export interface Section {
  id: string
  zoneId: ZoneId
  number: string
  position: Point
  price: number
  rows: number
  seatsPerRow: number
  totalSeats: number
  availableSeats: number
}

export type SeatState = 'available' | 'occupied' | 'reserved'

export interface Seat {
  id: string
  rowLabel: string
  col: number
  state: SeatState
}

export type MobileZoneId = 'norte' | 'oriental' | 'sur' | 'occidental' | 'occidental-alta'

export interface MobileZone {
  id: MobileZoneId
  name: string
  description: string
  color: string
  price: number
  available: number
  /** SVG polygon points, percent of the stadium plan image (0-100). */
  points: Point[]
  /** Anchor for the floating label, percent. */
  labelPos: Point
}


export type EventCategory = 'futbol' | 'conciertos' | 'teatro' | 'otros'

export interface HomeEvent {
  id: string
  title: string
  competition: string
  category: EventCategory
  dateLabel: string
  time: string
  venue: string
  city: string
  priceFrom: number
  currency: 'USD'
  thumbnail: string
}

export interface CalendarEvent extends HomeEvent {
  /** Local date "YYYY-MM-DD" used to place the event on the calendar grid. */
  dateISO: string
}

export interface Buyer {
  name: string
  email: string
  phone: string
}

export type PaymentBrand = 'card' | 'yappy'

export type CardBrand = 'visa' | 'mastercard' | 'amex'

export interface PaymentMethod {
  id: PaymentBrand
  title: string
  hint: string
  brands?: CardBrand[]
}

export type EventStatus = 'on-sale' | 'soon' | 'sold-out'

export interface Evento {
  id: string
  competition: string
  homeTeam: string
  awayTeam: string
  homeCode: string
  awayCode: string
  dateISO: string
  time: string
  venue: string
  city: string
  status: EventStatus
}

export type TicketStatus = 'upcoming' | 'past' | 'cancelled'

export interface Ticket {
  id: string
  eventId: string
  title: string
  competition: string
  category: EventCategory
  dateISO: string
  dateLabel: string
  time: string
  venue: string
  city: string
  thumbnail: string
  zoneLabel: string
  row: string
  seats: number[]
  quantity: number
  typeLabel: string
  status: TicketStatus
  code: string
  isNext?: boolean
}
