import { useEffect, useState } from 'react'
import { ArrowRight, Info } from 'lucide-react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'

import type { MobileZone, MobileZoneId } from '@/data/types'
import { useHomeEvent, useMobileZones } from '@/hooks/useCheckout'
import { formatUSD } from '@/lib/format'
import { CheckoutStepper } from './CheckoutStepper'
import { EventHeroPanel } from './EventHeroPanel'
import { StadiumInfoSheet } from './StadiumInfoSheet'
import { TicketQuantityCard } from './TicketQuantityCard'
import { ZonaStadiumPlan } from './ZonaStadiumPlan'

const MAX_QUANTITY = 8

/** Single purchase screen: pick a zone + quantity + summary (steps 1 + 2 merged). */
export default function CheckoutScreen() {
  const { eventId } = useParams()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const { data: event } = useHomeEvent(eventId)
  const { data: zones } = useMobileZones(eventId)

  const [selectedId, setSelectedId] = useState<MobileZoneId | null>(() => (params.get('zona') as MobileZoneId) ?? null)
  const [quantity, setQuantity] = useState(2)
  const [showInfo, setShowInfo] = useState(false)

  useEffect(() => {
    if (!zones?.length) return
    const fromParam = params.get('zona') as MobileZoneId | null
    if (fromParam && zones.some((z) => z.id === fromParam)) {
      setSelectedId(fromParam)
    } else if (!zones.some((z) => z.id === selectedId)) {
      setSelectedId(zones[0].id)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zones])

  const selected = zones?.find((z) => z.id === selectedId) ?? null
  const total = (selected?.price ?? 0) * quantity

  function handleSelect(zone: MobileZone) {
    setSelectedId(zone.id)
  }

  function handleContinue() {
    if (!eventId || !selected) return
    navigate(`/comprar/${eventId}/pago?zona=${selected.id}&cantidad=${quantity}`)
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <EventHeroPanel event={event} />

      <div
        style={{
          marginTop: -28,
          background: 'var(--color-mobile-sheet)',
          borderTopLeftRadius: 28,
          borderTopRightRadius: 28,
          flex: 1,
          paddingBottom: 16,
        }}
      >
        <CheckoutStepper current={0} />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, paddingLeft: 24, paddingRight: 24, marginTop: 18 }}>
          <h1 style={{ fontSize: 20, fontWeight: 700, lineHeight: 1.2, color: 'var(--color-mobile-ink)', flex: 1, minWidth: 0 }}>
            Selecciona la zona
          </h1>
          <button
            type="button"
            onClick={() => setShowInfo(true)}
            className="flex items-center"
            style={{ gap: 4, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-zona-radio)', padding: 0, flexShrink: 0, whiteSpace: 'nowrap' }}
          >
            <Info style={{ width: 15, height: 15 }} strokeWidth={2.2} />
            <span style={{ fontSize: 12, fontWeight: 600 }}>Ver información del estadio</span>
          </button>
        </div>

        <div style={{ marginTop: 12 }}>
          <ZonaStadiumPlan zones={zones ?? []} selectedId={selectedId} onSelect={handleSelect} />
        </div>

        <div style={{ marginTop: 12, padding: '0 16px' }}>
          <TicketQuantityCard quantity={quantity} onChange={setQuantity} max={MAX_QUANTITY} />
        </div>

      </div>

      <div
        style={{
          position: 'sticky',
          bottom: 0,
          zIndex: 10,
          background: '#fff',
          borderTop: '1px solid var(--color-mobile-line)',
          padding: '12px 16px 16px',
          boxShadow: '0 -8px 24px -18px rgba(11,31,56,0.5)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12, marginBottom: 10 }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-zona-sub)' }}>
            {selected ? `${selected.name} × ${quantity}` : 'Selecciona una zona'}
          </span>
          <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-zona-sub)', whiteSpace: 'nowrap' }}>
            Total{' '}
            <span style={{ fontSize: 18, fontWeight: 800, color: 'var(--color-zona-ink)' }}>{formatUSD(total)}</span>
          </span>
        </div>
        <button
          type="button"
          onClick={handleContinue}
          disabled={!selected}
          style={{
            width: '100%',
            height: 48,
            borderRadius: 10,
            background: 'var(--color-mobile-cta)',
            color: '#fff',
            fontSize: 15,
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            border: 'none',
            cursor: selected ? 'pointer' : 'default',
            opacity: selected ? 1 : 0.5,
          }}
        >
          Continuar
          <ArrowRight style={{ width: 18, height: 18 }} strokeWidth={2.4} />
        </button>
      </div>

      {showInfo && <StadiumInfoSheet event={event} onClose={() => setShowInfo(false)} />}
    </div>
  )
}
