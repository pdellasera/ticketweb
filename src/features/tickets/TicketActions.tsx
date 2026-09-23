import type { CSSProperties } from 'react'

import { Eye, QrCode, Send } from 'lucide-react'

interface Props {
  sent: boolean
  onDetails: () => void
  onSend: () => void
  onQr: () => void
}

const base: CSSProperties = {
  flex: 1,
  height: 34,
  borderRadius: 10,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 5,
  fontSize: 11.5,
  fontWeight: 600,
  cursor: 'pointer',
  border: '1px solid transparent',
  padding: 0,
}

const outline: CSSProperties = {
  background: '#fff',
  border: '1px solid var(--color-ticket-border)',
  color: 'var(--color-mobile-ink)',
}

export function TicketActions({ sent, onDetails, onSend, onQr }: Props) {
  return (
    <div style={{ display: 'flex', gap: 6 }}>
      <button type="button" onClick={onDetails} style={{ ...base, ...outline }}>
        <Eye style={{ width: 15, height: 15 }} strokeWidth={2.1} color="var(--color-mobile-meta)" />
        Ver detalles
      </button>
      <button type="button" onClick={onSend} style={{ ...base, ...outline }}>
        <Send style={{ width: 15, height: 15 }} strokeWidth={2.1} color="var(--color-mobile-meta)" />
        {sent ? 'Enviado ✓' : 'Enviar'}
      </button>
      <button
        type="button"
        onClick={onQr}
        style={{ ...base, background: 'var(--color-mobile-azul)', border: '1px solid var(--color-mobile-azul)', color: '#fff' }}
      >
        <QrCode style={{ width: 15, height: 15 }} strokeWidth={2.2} color="#fff" />
        Ver QR
      </button>
    </div>
  )
}
