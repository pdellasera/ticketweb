import { useEffect } from 'react'
import { X } from 'lucide-react'

import type { Ticket } from '@/data/types'
import { TicketStub } from './TicketStub'

/** Centered ticket modal with a transparent black overlay, shown from the "Ver QR" action. */
export function TicketDetailSheet({ ticket, onClose }: { ticket: Ticket; onClose: () => void }) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, background: 'var(--color-ticket-sheet)', overflowY: 'auto' }}>
      <div style={{ minHeight: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px 16px' }}>
        <div style={{ position: 'relative', width: '100%', maxWidth: 430 }}>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            style={{
              position: 'absolute',
              top: 12,
              right: 12,
              zIndex: 4,
              width: 36,
              height: 36,
              borderRadius: 999,
              background: 'rgba(255,255,255,0.92)',
              border: '1px solid var(--color-ticket-border)',
              cursor: 'pointer',
              display: 'grid',
              placeItems: 'center',
              color: 'var(--color-mobile-ink)',
              boxShadow: '0 4px 12px -4px rgba(0,0,0,0.4)',
            }}
          >
            <X style={{ width: 18, height: 18 }} strokeWidth={2.4} />
          </button>

          <TicketStub ticket={ticket} />
        </div>
      </div>
    </div>
  )
}