import { ArrowRight } from 'lucide-react'

import { formatUSD } from '@/lib/format'

interface Props {
  total: number
  onPay: () => void
  onTerms: () => void
  onPrivacy: () => void
}

/** Sticky bottom bar: Pay CTA + legal line. */
export function PaymentFooter({ total, onPay, onTerms, onPrivacy }: Props) {
  return (
    <div
      style={{
        position: 'sticky',
        bottom: 0,
        zIndex: 10,
        background: '#fff',
        borderTop: '1px solid var(--color-mobile-line)',
        padding: '12px 20px 16px',
        boxShadow: '0 -8px 24px -18px rgba(11,31,56,0.5)',
      }}
    >
      <button
        type="button"
        onClick={onPay}
        style={{
          width: '100%',
          height: 48,
          borderRadius: 10,
          background: 'var(--color-pago-blue)',
          color: '#fff',
          fontSize: 15,
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          border: 'none',
          cursor: 'pointer',
        }}
      >
        Pagar {formatUSD(total)}
        <ArrowRight style={{ width: 18, height: 18 }} strokeWidth={2.4} />
      </button>

      <p style={{ fontSize: 11, lineHeight: 1.4, marginTop: 10, textAlign: 'center', color: 'var(--color-pago-label)' }}>
        Al continuar aceptas nuestros{' '}
        <button type="button" onClick={onTerms} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: 'var(--color-pago-blue)', fontWeight: 600, textDecoration: 'underline' }}>
          Términos
        </button>{' '}
        y{' '}
        <button type="button" onClick={onPrivacy} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: 'var(--color-pago-blue)', fontWeight: 600, textDecoration: 'underline' }}>
          Política de privacidad
        </button>
      </p>
    </div>
  )
}
