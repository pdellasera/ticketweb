import { useState } from 'react'
import { ShieldCheck } from 'lucide-react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'

import type { Buyer, PaymentBrand } from '@/data/types'
import { DEFAULT_BUYER } from '@/data/buyer'
import { PAYMENT_METHODS } from '@/data/paymentMethods'
import { useCart } from '@/features/cart/CartContext'
import { useHomeEvent, useMobileZones } from '@/hooks/useCheckout'
import { BuyerCard } from './BuyerCard'
import { BuyerEditSheet } from './BuyerEditSheet'
import { CheckoutStepper } from './CheckoutStepper'
import { LegalSheet } from './LegalSheet'
import { OrderEventCard } from './OrderEventCard'
import { PaymentFooter } from './PaymentFooter'
import { PaymentHero } from './PaymentHero'
import { PaymentMethodsCard } from './PaymentMethodsCard'
import { SectionHeadingRow } from './SectionHeadingRow'
import { TicketsSummaryCard } from './TicketsSummaryCard'

const SERVICE_FEE = 1.5
const MAX_QUANTITY = 8

const TERMS = [
  'Al completar tu compra aceptas los términos y condiciones de GameGate.',
  'Las entradas son personales e intransferibles. Deberás presentar un documento de identidad válido al ingresar al estadio.',
  'Los reembolsos solo se procesan en caso de cancelación del evento.',
]

const PRIVACY = [
  'Tu información personal se utiliza únicamente para procesar tu compra y enviarte tus entradas.',
  'No compartimos tus datos con terceros sin tu consentimiento.',
  'Puedes solicitar la eliminación de tus datos escribiéndonos a soporte@gamegate.com.',
]

function clampQuantity(raw: string | null): number {
  if (raw === null) return 2
  const value = Number(raw)
  if (Number.isNaN(value)) return 2
  return Math.max(1, Math.min(MAX_QUANTITY, Math.floor(value)))
}

/** Payment screen (checkout step 2): review order, buyer, payment method, pay. */
export default function PaymentScreen() {
  const { eventId } = useParams()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const { data: event } = useHomeEvent(eventId)
  const { data: zones } = useMobileZones(eventId)
  const { addLine } = useCart()

  const quantity = clampQuantity(params.get('cantidad'))
  const zone = zones?.find((z) => z.id === params.get('zona')) ?? zones?.[0] ?? null

  const unitPrice = zone?.price ?? 0
  const subtotal = unitPrice * quantity
  const fee = quantity * SERVICE_FEE
  const total = subtotal + fee

  const [buyer, setBuyer] = useState<Buyer>(DEFAULT_BUYER)
  const [method, setMethod] = useState<PaymentBrand>('card')
  const [showBuyer, setShowBuyer] = useState(false)
  const [legal, setLegal] = useState<'terms' | 'privacy' | null>(null)

  function handlePay() {
    if (!eventId || !zone) return
    addLine({
      key: `${eventId}:${zone.id}`,
      eventTitle: event?.title ?? 'Evento',
      eventMeta: `${event?.dateLabel ?? ''} · ${event?.time ?? ''}`,
      zoneLabel: zone.name,
      seatIds: [],
      quantity,
      unitPrice: zone.price,
      currency: 'USD',
    })
    navigate(`/comprar/${eventId}/procesando?zona=${zone.id}&cantidad=${quantity}`)
  }

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

        <div style={{ paddingLeft: 20, paddingRight: 20, marginTop: 18 }}>
          <h1 style={{ fontSize: 21, fontWeight: 700, lineHeight: 1.2, color: 'var(--color-checkout-ink)' }}>
            Revisa tu pedido
          </h1>
          <p style={{ fontSize: 13.5, lineHeight: 1.35, marginTop: 5, color: 'var(--color-pago-sub)' }}>
            Revisa los detalles y elige tu método de pago.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, paddingLeft: 20, paddingRight: 20, marginTop: 18 }}>
          <OrderEventCard event={event} />

          <div style={{ marginTop: 4 }}>
            <SectionHeadingRow
              title="Entradas seleccionadas"
              onEdit={() => navigate(`/comprar/${eventId}${zone ? `?zona=${zone.id}` : ''}`)}
            />
          </div>
          <TicketsSummaryCard zoneName={zone?.name ?? 'Zona'} unitPrice={unitPrice} quantity={quantity} subtotal={subtotal} fee={fee} total={total} />

          <div style={{ marginTop: 4 }}>
            <SectionHeadingRow title="Datos del comprador" onEdit={() => setShowBuyer(true)} />
          </div>
          <BuyerCard buyer={buyer} />

          <div style={{ marginTop: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
            <h2 style={{ fontSize: 17, fontWeight: 700, lineHeight: 1.2, color: 'var(--color-checkout-ink)' }}>Método de pago</h2>
            <span className="flex items-center" style={{ gap: 5, color: 'var(--color-pago-safe)', flexShrink: 0 }}>
              <ShieldCheck style={{ width: 15, height: 15 }} strokeWidth={2.2} />
              <span style={{ fontSize: 12.5, fontWeight: 600, whiteSpace: 'nowrap' }}>Pago 100% seguro</span>
            </span>
          </div>
          <PaymentMethodsCard methods={PAYMENT_METHODS} selectedId={method} onSelect={setMethod} />
        </div>
      </div>

      <PaymentFooter
        total={total}
        onPay={handlePay}
        onTerms={() => setLegal('terms')}
        onPrivacy={() => setLegal('privacy')}
      />

      {showBuyer && <BuyerEditSheet buyer={buyer} onSave={setBuyer} onClose={() => setShowBuyer(false)} />}
      {legal && (
        <LegalSheet
          title={legal === 'terms' ? 'Términos y condiciones' : 'Política de privacidad'}
          body={legal === 'terms' ? TERMS : PRIVACY}
          onClose={() => setLegal(null)}
        />
      )}
    </div>
  )
}
