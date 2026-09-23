import type { ReactNode } from 'react'

interface Props {
  variant: 'centered' | 'stacked'
  icon: ReactNode
  title: ReactNode
  body: ReactNode
}

/** Reusable security reassurance note. "centered" = green lock (Procesando); "stacked" = shield (Confirmación). */
export function SecurePaymentNote({ variant, icon, title, body }: Props) {
  if (variant === 'centered') {
    return (
      <div
        className="flex flex-col items-center text-center"
        style={{ background: 'var(--color-pago-secure-bg)', borderRadius: 12, padding: '14px 16px', gap: 6 }}
      >
        {icon}
        <p style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--color-pago-safe)' }}>{title}</p>
        <p style={{ fontSize: 12.5, lineHeight: 1.35, color: 'var(--color-pago-sub)' }}>{body}</p>
      </div>
    )
  }

  return (
    <div className="flex items-center" style={{ background: 'var(--color-pago-secure-bg)', borderRadius: 12, padding: '14px 16px', gap: 12 }}>
      <span className="shrink-0">{icon}</span>
      <div>
        <p style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--color-checkout-ink)' }}>{title}</p>
        <p style={{ fontSize: 12.5, lineHeight: 1.35, marginTop: 2, color: 'var(--color-pago-sub)' }}>{body}</p>
      </div>
    </div>
  )
}
