import type { Section } from '@/data/types'

export interface SectionChipProps {
  section: Section
  color: string
  onClick?: () => void
  onHover?: (hovered: boolean) => void
}

/** Numbered seat-section chip overlaid on the stadium map. */
export function SectionChip({ section, color, onClick, onHover }: SectionChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => onHover?.(true)}
      onMouseLeave={() => onHover?.(false)}
      className="absolute z-30 flex h-[18px] min-w-[18px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full px-1 text-[9px] font-bold text-white shadow-sm ring-1 ring-white/60 transition-transform hover:scale-125"
      style={{ left: `${section.position[0]}%`, top: `${section.position[1]}%`, backgroundColor: color }}
    >
      {section.number}
    </button>
  )
}
