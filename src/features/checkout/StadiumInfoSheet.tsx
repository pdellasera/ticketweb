import { MapPin, X } from 'lucide-react'

import type { HomeEvent } from '@/data/types'

interface Props {
  event?: HomeEvent
  onClose: () => void
}

/** Bottom sheet shown by "Ver información del estadio" (no reference mock). */
export function StadiumInfoSheet({ event, onClose }: Props) {
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
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--color-zona-ink)' }}>Información del estadio</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="grid place-items-center"
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: '#eef1f6',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--color-zona-sub)',
            }}
          >
            <X style={{ width: 18, height: 18 }} strokeWidth={2.4} />
          </button>
        </div>

        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginTop: 16 }}>
          <span
            className="grid place-items-center rounded-xl"
            style={{ width: 44, height: 44, background: 'var(--color-zona-card)', color: 'var(--color-zona-radio)', flexShrink: 0 }}
          >
            <MapPin style={{ width: 22, height: 22 }} strokeWidth={2} />
          </span>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 16, fontWeight: 700, lineHeight: 1.25, color: 'var(--color-zona-ink)' }}>
              {event?.venue ?? 'Estadio'}
            </p>
            <p style={{ fontSize: 13, lineHeight: 1.3, marginTop: 3, color: 'var(--color-zona-sub)' }}>{event?.city ?? ''}</p>
          </div>
        </div>

        <p style={{ fontSize: 13, lineHeight: 1.5, marginTop: 16, color: 'var(--color-zona-sub)' }}>
          Te recomendamos llegar con 60 minutos de anticipación. Las puertas abren 2 horas antes del evento.
        </p>
      </div>
    </div>
  )
}
