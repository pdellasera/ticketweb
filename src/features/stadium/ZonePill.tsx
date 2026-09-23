import { formatUSD } from '@/lib/format'
import type { Zone } from '@/data/types'
import { cn } from '@/lib/cn'

export interface ZonePillProps {
  zone: Zone
  active?: boolean
  onClick?: () => void
}

/** Floating zone label overlaid on the stadium map. */
export function ZonePill({ zone, active, onClick }: ZonePillProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'absolute z-20 -translate-x-1/2 -translate-y-1/2 rounded-full border px-2 py-0.5 text-[10px] font-semibold leading-4 shadow-sm transition-colors',
        active
          ? 'border-brand-500 bg-brand-500 text-white'
          : 'border-line/80 bg-white/90 text-ink-900 hover:border-brand-400',
      )}
      style={{ left: `${zone.labelPos[0]}%`, top: `${zone.labelPos[1]}%` }}
    >
      <span className="mr-1 inline-block h-2 w-2 rounded-full align-middle" style={{ backgroundColor: zone.color }} />
      {zone.shortName}
      <span className={cn('ml-1 font-medium', active ? 'text-white/80' : 'text-ink-400')}>
        {formatUSD(zone.price, 0)}
      </span>
    </button>
  )
}
