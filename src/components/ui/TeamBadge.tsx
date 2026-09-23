import { hashString } from '@/lib/random'
import { cn } from '@/lib/cn'

const PALETTE = ['#007ef5', '#b3141c', '#2e8b3d', '#e0008a', '#f59e0b', '#133a8e', '#22b8e8', '#7c3aed']

export interface TeamBadgeProps {
  code: string
  className?: string
}

/** Colored circular monogram for a team (deterministic color per code). */
export function TeamBadge({ code, className }: TeamBadgeProps) {
  const color = PALETTE[hashString(code) % PALETTE.length]
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-full font-display font-bold text-white',
        className,
      )}
      style={{ backgroundColor: color }}
    >
      {code}
    </span>
  )
}
