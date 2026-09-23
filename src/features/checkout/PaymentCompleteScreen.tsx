import { useState } from 'react'
import { ArrowRight, Mail, ShieldCheck, Ticket } from 'lucide-react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'

import { useHomeEvent, useMobileZones } from '@/hooks/useCheckout'
import { formatUSD } from '@/lib/format'
import { makeTicketCode, mockSeatSplit } from '@/lib/ticketCode'
import { CheckoutStepper } from './CheckoutStepper'
import { OrderDetailCard } from './OrderDetailCard'
import { PaymentHero } from './PaymentHero'
import { PaymentSuccessMark } from './PaymentSuccessMark'
import { SecurePaymentNote } from './SecurePaymentNote'
import { TicketQr } from './TicketQr'

const SERVICE_FEE = 1.5
const MAX_QUANTITY = 8

function clampQuantity(raw: string | null): number {
  if (raw === null) return 2
  const value = Number(raw)
  if (Number.isNaN(value)) return 2
  return Math.max(1, Math.min(MAX_QUANTITY, Math.floor(value)))
}

/** Payment-complete screen (checkout step 3): success mark + ticket QR + actions. */
export default function PaymentCompleteScreen() {
  const { eventId } = useParams()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const { data: event } = useHomeEvent(eventId)
  const { data: zones } = useMobileZones(eventId)
  const [sent, setSent] = useState(false)

  const quantity = clampQuantity(params.get('cantidad'))
  const zone = zones?.find((z) => z.id === params.get('zona')) ?? zones?.[0] ?? null

  const unitPrice = zone?.price ?? 0
  const fee = quantity * SERVICE_FEE
  const total = unitPrice * quantity + fee
  const seats = mockSeatSplit(`${eventId}:${zone?.id ?? ''}`, quantity)
  const code = makeTicketCode(eventId ?? '', zone?.id ?? '', event?.dateLabel)

  const rows = [
    { label: 'Sección', value: zone?.name ?? 'Zona' },
    { label: 'Fila', value: seats.row },
    { label: 'Asientos', value: seats.seats.join(', ') },
    { label: 'Entradas', value: String(quantity) },
    { label: 'Valor por entrada', value: formatUSD(unitPrice) },
    { label: 'Cargo por servicio', value: formatUSD(fee) },
  ]

  function handleSendEmail() {
    if (sent) return
    setSent(true)
    window.setTimeout(() => setSent(false), 2500)
  }

  const qrPanel = (
    <div
      className="flex flex-col items-center"
      style={{ width: 132, flexShrink: 0, background: 'var(--color-done-qr-bg)', borderRadius: 10, padding: '10px 10px 12px', gap: 8, alignSelf: 'stretch', justifyContent: 'center' }}
    >
      <div style={{ background: '#fff', borderRadius: 6, padding: 4, lineHeight: 0 }}>
        <TicketQr code={code} size={88} />
      </div>
      <p style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: 0.3, color: 'var(--color-checkout-ink)', textAlign: 'center' }}>{code}</p>
      <p style={{ fontSize: 10, lineHeight: 1.3, textAlign: 'center', color: 'var(--color-pago-sub)' }}>Presenta este código en el ingreso</p>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <PaymentHero event={event} backTo="/eventos" />

      <div
        style={{
          marginTop: -22,
          background: 'var(--color-mobile-sheet)',
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          flex: 1,
          paddingBottom: 28,
        }}
      >
        <CheckoutStepper current={2} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, paddingLeft: 20, paddingRight: 20, marginTop: 20 }}>
          <PaymentSuccessMark />

          <div className="text-center" style={{ marginTop: -6 }}>
            <h1 style={{ fontSize: 18, fontWeight: 800, lineHeight: 1.25, color: 'var(--color-checkout-ink)' }}>¡Pago procesado con éxito!</h1>
            <p style={{ fontSize: 13.5, lineHeight: 1.4, marginTop: 6, color: 'var(--color-pago-sub)' }}>
              Tu compra ha sido confirmada. Hemos enviado tus entradas
              <br />a tu correo electrónico.
            </p>
          </div>

          <OrderDetailCard event={event} rows={rows} totalLabel="Total pagado" totalValue={formatUSD(total)} aside={qrPanel} />

          <button
            type="button"
            onClick={() => navigate('/mis-entradas')}
            className="flex items-center justify-center"
            style={{ width: '100%', height: 48, borderRadius: 12, background: 'var(--color-pago-blue)', color: '#fff', fontSize: 15, fontWeight: 700, gap: 8, border: 'none', cursor: 'pointer' }}
          >
            <Ticket style={{ width: 18, height: 18 }} strokeWidth={2.2} />
            Ver mis entradas
            <ArrowRight style={{ width: 18, height: 18, marginLeft: 4 }} strokeWidth={2.4} />
          </button>

          <button
            type="button"
            onClick={handleSendEmail}
            className="flex items-center justify-center"
            style={{ width: '100%', height: 46, borderRadius: 12, background: '#fff', border: '1.5px solid var(--color-pago-blue)', color: 'var(--color-pago-blue)', fontSize: 14.5, fontWeight: 700, gap: 8, cursor: 'pointer' }}
          >
            <Mail style={{ width: 18, height: 18 }} strokeWidth={2.2} />
            {sent ? 'Entradas enviadas ✓' : 'Enviar entradas por correo'}
          </button>

          <SecurePaymentNote
            variant="stacked"
            icon={<ShieldCheck style={{ width: 24, height: 24 }} strokeWidth={2} color="var(--color-pago-blue)" />}
            title="Tu pago está 100% seguro"
            body="Gracias por confiar en GameGate"
          />

          <button
            type="button"
            onClick={() => navigate('/')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: 14, fontWeight: 600, color: 'var(--color-pago-blue)', alignSelf: 'center', marginTop: 2 }}
          >
            Volver al inicio
          </button>
        </div>
      </div>
    </div>
  )
}
