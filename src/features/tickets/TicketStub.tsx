import { MapPin } from 'lucide-react'

import { TicketQr } from '@/features/checkout/TicketQr'

import type { Ticket } from '@/data/types'
import { splitTicketDate } from '@/lib/ticketDate'
import { TicketStatBox } from './TicketStatBox'

const NOTCH = 'var(--color-ticket-sheet)'

/** Full designed ticket (stub style) shown in the "Ver QR" detail sheet. */
export function TicketStub({ ticket }: { ticket: Ticket }) {
  const { day, month, hour } = splitTicketDate(ticket.dateISO, ticket.time)
  const province = ticket.city.split(', ').pop() ?? ticket.city

  return (
    <div
      style={{
        position: 'relative',
        borderRadius: 14,
        background: 'rgba(0,0,0,0.92)',
        border: '1px solid var(--color-ticket-border)',
        boxShadow: '0 12px 32px -18px rgba(11,31,56,0.35)',
      }}
    >
      {/* Header */}
      <div style={{ position: 'relative', height: 293, overflow: 'hidden', borderRadius: '13px 13px 0 0' }}>
        <img
          src={ticket.thumbnail}
          alt=""
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(2,17,39,0.3) 0%, rgba(2,17,39,0.62) 100%)' }} />

        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0 24px',
            textAlign: 'center',
          }}
        >
          <h2 style={{ fontSize: 22, fontWeight: 800, lineHeight: 1.2, color: '#fff', fontFamily: 'var(--font-display)' }}>{ticket.title}</h2>
          <p style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.75)', marginTop: 7, letterSpacing: 0.3 }}>{ticket.competition}</p>
        </div>
      </div>

      {/* Top notch */}
      <span
        style={{
          position: 'absolute',
          top: -11,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 34,
          height: 22,
          borderRadius: '50%',
          background: NOTCH,
          zIndex: 3,
        }}
      />

      {/* Bottom notch (light, visible against the dark code area) */}
      <span
        style={{
          position: 'absolute',
          bottom: -11,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 34,
          height: 22,
          borderRadius: '50%',
          background: NOTCH,
          zIndex: 3,
        }}
      />

      {/* Body */}
      <div style={{ padding: '22px 24px 18px' }}>
        <div style={{ display: 'flex', margin: '0 29px', background: 'var(--color-ticket-stub-bg)', borderRadius: 12, padding: '16px 0' }}>
          <TicketStatBox label="Día" value={day} />
          <TicketStatBox label="Mes" value={month} />
          <TicketStatBox label="Hora" value={hour} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, marginTop: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <MapPin style={{ width: 14, height: 14, flexShrink: 0 }} strokeWidth={2.2} color="rgba(255,255,255,0.8)" />
            <span style={{ fontSize: 13, fontWeight: 700, color: '#fff', lineHeight: 1.3 }}>{ticket.venue}</span>
          </div>
          <span style={{ fontSize: 12, fontWeight: 500, color: 'rgba(255,255,255,0.75)', lineHeight: 1.3 }}>{province}</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, marginTop: 24 }}>
          <div style={{ background: '#fff', border: '1px solid var(--color-ticket-border)', borderRadius: 14, padding: 12, lineHeight: 0 }}>
            <TicketQr code={ticket.code} size={150} />
          </div>
          <p style={{ fontSize: 11, color: 'var(--color-mobile-meta)' }}>Presenta este código en el ingreso</p>
        </div>
      </div>

      {/* Perforation */}
      <div style={{ position: 'relative', padding: '0 16px' }}>
        <div style={{ borderTop: '2px dashed var(--color-ticket-tear)' }} />
        <span style={{ position: 'absolute', top: -15, left: -15, width: 30, height: 30, borderRadius: '50%', background: NOTCH }} />
        <span style={{ position: 'absolute', top: -15, right: -15, width: 30, height: 30, borderRadius: '50%', background: NOTCH }} />
      </div>

      {/* Stub code (dark, mirrors the header) */}
      <div
        style={{
          padding: '20px 24px 22px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          background: 'linear-gradient(180deg, #021127 0%, #06203f 100%)',
          borderRadius: '0 0 13px 13px',
        }}
      >
        <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: 0.5, color: '#fff' }}>{ticket.code}</p>
      </div>
    </div>
  )
}