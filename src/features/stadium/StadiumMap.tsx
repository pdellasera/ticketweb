import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

import type { Section, Zone } from '@/data/types'
import { formatUSD } from '@/lib/format'
import { SectionChip } from './SectionChip'
import { ZonePill } from './ZonePill'

interface HoverState {
  zone: Zone
  section?: Section
  x: number
  y: number
}

export interface StadiumMapProps {
  zones: Zone[]
  sections: Section[]
  selectedZoneId?: string | null
  onZoneSelect?: (zone: Zone) => void
  onSectionSelect?: (section: Section) => void
}

const clampPct = (v: number, min = 14, max = 86) => Math.min(max, Math.max(min, v))

export function StadiumMap({ zones, sections, selectedZoneId, onZoneSelect, onSectionSelect }: StadiumMapProps) {
  const [hover, setHover] = useState<HoverState | null>(null)
  const zoneById = useMemo(() => new Map(zones.map((z) => [z.id, z])), [zones])

  const tooltip = hover
  const tooltipZone = tooltip?.zone

  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-card bg-linear-to-b from-[#e6f4fa] via-[#cdeaf4] to-[#a9dced] ring-1 ring-brand-300/30">
      <img
        src="/assets/stadium/estadio-3d-hires.webp"
        alt="Mapa 3D del estadio"
        draggable={false}
        className="absolute inset-0 z-0 h-full w-full object-cover"
      />

      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 z-10 h-full w-full">
        {zones.map((zone) => {
          const isSelected = selectedZoneId === zone.id
          const isZoneHovered = hover?.section == null && hover?.zone.id === zone.id
          return (
            <polygon
              key={zone.id}
              points={zone.points.map((p) => p.join(',')).join(' ')}
              className="cursor-pointer transition-[fill-opacity,stroke-opacity] duration-150"
              fill={zone.color}
              fillOpacity={isSelected ? 0.32 : isZoneHovered ? 0.2 : 0}
              stroke={zone.color}
              strokeOpacity={isSelected ? 0.9 : isZoneHovered ? 0.7 : 0}
              strokeWidth={0.6}
              onClick={() => onZoneSelect?.(zone)}
              onMouseEnter={() => setHover({ zone, x: zone.labelPos[0], y: zone.labelPos[1] })}
              onMouseLeave={() => setHover(null)}
            />
          )
        })}
      </svg>

      {zones.map((zone) => (
        <ZonePill
          key={zone.id}
          zone={zone}
          active={selectedZoneId === zone.id}
          onClick={() => onZoneSelect?.(zone)}
        />
      ))}

      {sections.map((section) => {
        const zone = zoneById.get(section.zoneId)
        if (!zone) return null
        return (
          <SectionChip
            key={section.id}
            section={section}
            color={zone.color}
            onClick={() => onSectionSelect?.(section)}
            onHover={(h) =>
              setHover(h ? { zone, section, x: section.position[0], y: section.position[1] } : null)
            }
          />
        )
      })}

      <AnimatePresence>
        {tooltip && tooltipZone && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.97 }}
            transition={{ duration: 0.16, ease: 'easeOut' }}
            className="pointer-events-none absolute z-40 w-44 -translate-x-1/2 -translate-y-full rounded-card border border-line bg-card p-3 shadow-pop"
            style={{ left: `${clampPct(tooltip.x)}%`, top: `${clampPct(tooltip.y - 4, 8, 90)}%` }}
          >
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: tooltipZone.color }} />
              <span className="truncate text-sm font-bold text-ink-900">{tooltipZone.name}</span>
            </div>
            <div className="mt-1 flex items-center justify-between text-xs">
              <span className="text-ink-400">{tooltip.section ? `Sección ${tooltip.section.number}` : 'Zona'}</span>
              <span className="font-semibold text-ink-900">{formatUSD(tooltipZone.price)}</span>
            </div>
            {tooltip.section && (
              <div className="mt-0.5 text-[11px] text-ink-400">
                {tooltip.section.availableSeats} de {tooltip.section.totalSeats} disponibles
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
