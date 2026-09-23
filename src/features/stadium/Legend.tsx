import { formatUSD } from '@/lib/format'
import type { Zone } from '@/data/types'
import { cn } from '@/lib/cn'

export interface LegendProps {
  zones: Zone[]
  selectedZoneId?: string | null
  onSelect?: (zone: Zone) => void
  className?: string
}

/** Color swatch legend mapping zone → color → price. */
export function Legend({ zones, selectedZoneId, onSelect, className }: LegendProps) {
  return (
    <div className={cn('grid grid-cols-2 gap-2 sm:grid-cols-4', className)}>
      {zones.map((zone) => {
        const active = selectedZoneId === zone.id
        return (
          <button
            key={zone.id}
            type="button"
            onClick={() => onSelect?.(zone)}
            className={cn(
              'flex items-center gap-2.5 rounded-control border px-2.5 py-2 text-left transition-colors',
              active ? 'border-brand-500 bg-brand-500/5' : 'border-line bg-card hover:border-brand-300',
            )}
          >
            <span className="h-3.5 w-3.5 shrink-0 rounded-full" style={{ backgroundColor: zone.color }} />
            <span className="min-w-0">
              <span className="block truncate text-xs font-semibold text-ink-900">{zone.name}</span>
              <span className="block text-[11px] font-medium text-ink-400">{formatUSD(zone.price, 0)}</span>
            </span>
          </button>
        )
      })}
    </div>
  )
}
