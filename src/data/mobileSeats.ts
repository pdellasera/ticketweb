import type { MobileZone } from './types'

/**
 * Ticket tiers shown on the mobile purchase flow.
 * Prices are in US dollars (Panamá).
 */
export const MOBILE_ZONES: MobileZone[] = [
  {
    id: 'norte',
    name: 'Norte',
    description: 'Buena visibilidad',
    color: '#0064FD',
    price: 12,
    available: 892,
    points: [
      [16, 22],
      [32, 22],
      [32, 76],
      [16, 76],
    ],
    labelPos: [24, 49],
  },
  {
    id: 'oriental',
    name: 'Oriental',
    description: 'Vista privilegiada',
    color: '#FCA227',
    price: 20,
    available: 1248,
    points: [
      [30, 8],
      [70, 8],
      [70, 27],
      [30, 27],
    ],
    labelPos: [50, 17],
  },
  {
    id: 'sur',
    name: 'Sur',
    description: 'Alienta sin parar',
    color: '#EC4C46',
    price: 12,
    available: 756,
    points: [
      [68, 22],
      [84, 22],
      [84, 76],
      [68, 76],
    ],
    labelPos: [76, 49],
  },
  {
    id: 'occidental',
    name: 'Occidental',
    description: 'La mejor experiencia',
    color: '#109648',
    price: 30,
    available: 430,
    points: [
      [32, 30],
      [68, 30],
      [68, 75],
      [32, 75],
    ],
    labelPos: [50, 52],
  },
  {
    id: 'occidental-alta',
    name: 'Occidental Alta',
    description: 'Vista panorámica',
    color: '#8635C6',
    price: 22,
    available: 621,
    points: [
      [28, 74],
      [70, 74],
      [70, 92],
      [28, 92],
    ],
    labelPos: [50, 83],
  },
]
