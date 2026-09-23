import { X } from 'lucide-react'

interface Props {
  title: string
  body: string[]
  onClose: () => void
}

/** Informational bottom sheet for legal content (Términos / Privacidad). */
export function LegalSheet({ title, body, onClose }: Props) {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        background: 'rgba(8,18,45,0.5)',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 430,
          background: '#fff',
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          padding: '20px 20px 28px',
          maxHeight: '80vh',
          overflowY: 'auto',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--color-checkout-ink)' }}>{title}</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="grid place-items-center"
            style={{ width: 32, height: 32, borderRadius: '50%', background: '#eef1f6', border: 'none', cursor: 'pointer', color: 'var(--color-pago-sub)' }}
          >
            <X style={{ width: 18, height: 18 }} strokeWidth={2.4} />
          </button>
        </div>

        <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {body.map((p, i) => (
            <p key={i} style={{ fontSize: 13.5, lineHeight: 1.55, color: 'var(--color-pago-sub)' }}>
              {p}
            </p>
          ))}
        </div>
      </div>
    </div>
  )
}
