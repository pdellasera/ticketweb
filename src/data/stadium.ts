import type { Point, Section, Zone, ZoneId } from './types'

/** Zone geometry extracted from the 3D stadium render (percent coords). */
export const ZONES: Zone[] = [
  {
    id: 'balboa',
    name: 'Balboa',
    shortName: 'BAL',
    color: '#f5b0b4',
    price: 25,
    points: [[30, 33], [40, 30], [52, 29], [64, 31], [67, 39], [56, 44], [40, 43], [28, 41]],
    labelPos: [47, 34],
  },
  {
    id: 'este-sup',
    name: 'Este Superior',
    shortName: 'EST-SUP',
    color: '#133a8e',
    price: 15,
    points: [[50, 34], [64, 32], [68, 41], [52, 43]],
    labelPos: [59, 38],
  },
  {
    id: 'este-inf',
    name: 'Este Inferior',
    shortName: 'EST-INF',
    color: '#3d9be9',
    price: 20,
    points: [[54, 43], [68, 41], [71, 59], [57, 61]],
    labelPos: [63, 51],
  },
  {
    id: 'sur-sup',
    name: 'Sur Superior',
    shortName: 'SUR-SUP',
    color: '#2e8b3d',
    price: 12,
    points: [[31, 43], [40, 41], [48, 46], [46, 57], [32, 57]],
    labelPos: [39, 49],
  },
  {
    id: 'sur-inf',
    name: 'Sur Inferior',
    shortName: 'SUR-INF',
    color: '#b3141c',
    price: 18,
    points: [[32, 58], [50, 54], [64, 58], [60, 69], [36, 69]],
    labelPos: [47, 62],
  },
  {
    id: 'oeste-sup',
    name: 'Oeste Superior',
    shortName: 'OES-SUP',
    color: '#f5a0bc',
    price: 30,
    points: [[23, 41], [31, 38], [34, 47], [25, 51]],
    labelPos: [27, 44],
  },
  {
    id: 'oeste-inf',
    name: 'Oeste Inferior',
    shortName: 'OES-INF',
    color: '#e0008a',
    price: 40,
    points: [[25, 52], [34, 49], [37, 64], [26, 68]],
    labelPos: [29, 58],
  },
  {
    id: 'parking',
    name: 'Parking',
    shortName: 'PARK',
    color: '#22b8e8',
    price: 5,
    points: [[18, 69], [30, 65], [29, 78], [16, 78]],
    labelPos: [22, 73],
  },
]

/** Rows × seats-per-row per zone (used for the seat map). */
const SEAT_PLAN: Record<ZoneId, [rows: number, seatsPerRow: number]> = {
  'sur-inf': [8, 12],
  'este-inf': [8, 12],
  'oeste-inf': [6, 10],
  'sur-sup': [6, 14],
  'este-sup': [6, 14],
  'oeste-sup': [5, 12],
  balboa: [4, 10],
  parking: [1, 20],
}

/** Tier-based section numbering (34 sections total). */
const SECTION_LAYOUT: Array<{ zoneId: ZoneId; numbers: string[] }> = [
  { zoneId: 'sur-inf', numbers: ['101', '102', '103', '104', '105', '106'] },
  { zoneId: 'este-inf', numbers: ['107', '108', '109', '110', '111'] },
  { zoneId: 'oeste-inf', numbers: ['112', '113', '114', '115'] },
  { zoneId: 'sur-sup', numbers: ['201', '202', '203', '204', '205', '206'] },
  { zoneId: 'este-sup', numbers: ['207', '208', '209', '210', '211'] },
  { zoneId: 'oeste-sup', numbers: ['212', '213', '214', '215'] },
  { zoneId: 'balboa', numbers: ['301', '302', '303'] },
  { zoneId: 'parking', numbers: ['PK'] },
]

function spreadPoints(points: Point[], n: number): Point[] {
  const xs = points.map((p) => p[0])
  const ys = points.map((p) => p[1])
  const minX = Math.min(...xs)
  const maxX = Math.max(...xs)
  const minY = Math.min(...ys)
  const maxY = Math.max(...ys)
  const cols = Math.ceil(Math.sqrt(n))
  const rows = Math.ceil(n / cols)
  const result: Point[] = []
  for (let i = 0; i < n; i++) {
    const col = i % cols
    const row = Math.floor(i / cols)
    const x = cols === 1 ? (minX + maxX) / 2 : minX + ((col + 0.5) / cols) * (maxX - minX)
    const y = rows === 1 ? (minY + maxY) / 2 : minY + ((row + 0.5) / rows) * (maxY - minY)
    result.push([Math.round(x * 10) / 10, Math.round(y * 10) / 10])
  }
  return result
}

function buildSections(): Section[] {
  const zoneById = new Map(ZONES.map((z) => [z.id, z]))
  const out: Section[] = []
  for (const { zoneId, numbers } of SECTION_LAYOUT) {
    const zone = zoneById.get(zoneId)!
    const [rows, seatsPerRow] = SEAT_PLAN[zoneId]
    const total = rows * seatsPerRow
    const positions = spreadPoints(zone.points, numbers.length)
    numbers.forEach((number, i) => {
      out.push({
        id: `${zoneId}-${number}`,
        zoneId,
        number,
        position: positions[i],
        price: zone.price,
        rows,
        seatsPerRow,
        totalSeats: total,
        availableSeats: total,
      })
    })
  }
  return out
}

export const SECTIONS: Section[] = buildSections()
