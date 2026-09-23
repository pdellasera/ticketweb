import { cn } from '@/lib/cn'

export interface GameGateLogoProps {
  /**
   * 'light' = white "Game" + light-blue "Gate" (for dark surfaces).
   * 'dark'  = navy "Game" + brand-blue "Gate" (for light surfaces).
   */
  variant?: 'light' | 'dark'
  className?: string
}

export function GameGateLogo({ variant = 'dark', className }: GameGateLogoProps) {
  const isLight = variant === 'light'
  return (
    <span
      className={cn(
        'inline-flex items-baseline font-display font-extrabold tracking-tight',
        isLight ? 'text-white' : 'text-ink-900',
        className,
      )}
    >
      Game<span className={isLight ? 'text-brand-400' : 'text-brand-500'}>Gate</span>
    </span>
  )
}
