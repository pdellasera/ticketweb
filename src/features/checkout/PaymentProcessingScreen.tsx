import { useEffect } from 'react'
import { Lock } from 'lucide-react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'

import { useHomeEvent, useMobileZones } from '@/hooks/useCheckout'
import { formatUSD } from '@/lib/format'
import { mockSeatSplit } from '@/lib/ticketCode'
import { CheckoutStepper } from './CheckoutStepper'
import { OrderDetailCard } from './OrderDetailCard'
import { PaymentHero } from './PaymentHero'
import { ProcessingLoader } from './ProcessingLoader'
import { SecurePaymentNote } from './SecurePaymentNote'

const SERVICE_FEE = 1.5
const MAX_QUANTITY = 8
const PROCESS_MS = 2800

function clampQuantity(raw: string | null): number {
  if (raw === null) return 2
  const value = Number(raw)
  if (Number.isNaN(value)) return 2
  return Math.max(1, Math.min(MAX_QUANTITY, Math.floor(value)))
}

/** Payment-processing screen (checkout step 2): spinner → auto-redirect to confirmation. */
export default function PaymentProcessingScreen() {
  const { eventId } = useParams()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const { data: event } = useHomeEvent(eventId)
  const { data: zones } = useMobileZones(eventId)

  const quantity = clampQuantity(params.get('cantidad'))
  const zone = zones?.find((z) => z.id === params.get('zona')) ?? zones?.[0] ?? null

  useEffect(() => {
    if (!eventId) return
    const timer = setTimeout(() => {
      navigate(`/comprar/${eventId}/confirmacion?zona=${zone?.id ?? ''}&cantidad=${quantity}`, { replace: true })
    }, PROCESS_MS)
    return () => clearTimeout(timer)
  }, [eventId, zone?.id, quantity, navigate])

  const unitPrice = zone?.price ?? 0
  const fee = quantity * SERVICE_FEE
  const total = unitPrice * quantity + fee
  const seats = mockSeatSplit(`${eventId}:${zone?.id ?? ''}`, quantity)

  const rows = [
    { label: 'Sección', value: zone?.name ?? 'Zona' },
    { label: 'Asientos', value: `Fila ${seats.row} • ${seats.seats.join(', ')}` },
    { label: 'Entradas', value: `${quantity} x ${formatUSD(unitPrice)}` },
    { label: 'Cargo por servicio', value: formatUSD(fee) },
  ]

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <PaymentHero event={event} backTo={`/comprar/${eventId}${zone ? `?zona=${zone.id}` : ''}`} />

      <div
        style={{
          marginTop: -22,
          background: 'var(--color-mobile-sheet)',
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          flex: 1,
          paddingBottom: 20,
        }}
      >
        <CheckoutStepper current={1} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, paddingLeft: 20, paddingRight: 20, marginTop: 26 }}>
          <ProcessingLoader />

          <div className="text-center">
            <h1 style={{ fontSize: 20, fontWeight: 700, lineHeight: 1.2, color: 'var(--color-checkout-ink)' }}>Procesando tu pago</h1>
            <p style={{ fontSize: 13.5, lineHeight: 1.4, marginTop: 6, color: 'var(--color-pago-sub)' }}>
              Estamos validando la información con tu entidad financiera.
              <br />
              Esto puede tardar unos segundos…
            </p>
          </div>

          <OrderDetailCard event={event} rows={rows} totalLabel="Total" totalValue={formatUSD(total)} />

          <SecurePaymentNote
            variant="centered"
            icon={<Lock style={{ width: 20, height: 20 }} strokeWidth={2.2} color="var(--color-pago-safe)" />}
            title="Pago 100% seguro"
            body="Tu información está protegida con encriptación SSL."
          />
        </div>
      </div>
    </div>
  )
}
