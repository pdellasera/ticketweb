import type { HTMLAttributes } from 'react'

import { cn } from '@/lib/cn'

type BadgeTone = 'success' | 'warning' | 'danger' | 'info' | 'neutral'

const tones: Record<BadgeTone, string> = {
  success: 'bg-success/12 text-success',
  warning: 'bg-warning/15 text-[#b45309]',
  danger: 'bg-danger/10 text-danger',
  info: 'bg-brand-500/10 text-brand-600',
  neutral: 'bg-canvas text-ink-600',
}

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone
}

export function Badge({ tone = 'neutral', className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold',
        tones[tone],
        className,
      )}
      {...props}
    />
  )
}
