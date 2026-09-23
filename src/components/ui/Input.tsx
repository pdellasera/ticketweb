import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from 'react'

import { cn } from '@/lib/cn'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  hint?: string
  error?: string
  icon?: ReactNode
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, hint, error, icon, id, className, ...props },
  ref,
) {
  const autoId = useId()
  const inputId = id ?? autoId
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium text-ink-900">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400">
            {icon}
          </span>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'h-11 w-full rounded-control border bg-card px-3.5 text-sm text-ink-900 placeholder:text-ink-400',
            'transition-colors focus:outline-none focus:ring-2',
            icon ? 'pl-10' : undefined,
            error
              ? 'border-danger focus:ring-danger/20'
              : 'border-line focus:border-brand-500 focus:ring-brand-500/20',
            className,
          )}
          {...props}
        />
      </div>
      {(hint || error) && (
        <p className={cn('mt-1.5 text-xs', error ? 'text-danger' : 'text-ink-400')}>{error ?? hint}</p>
      )}
    </div>
  )
})
