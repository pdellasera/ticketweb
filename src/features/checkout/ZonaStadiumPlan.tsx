import type { MobileZone, MobileZoneId } from '@/data/types'
import { formatUSD } from '@/lib/format'

interface Props {
  zones: MobileZone[]
  selectedId: MobileZoneId | null
  onSelect: (zone: MobileZone) => void
}

/** Stadium plan (existing secciones-estadio.webp) with clickable zone polygons + a floating tooltip. */
export function ZonaStadiumPlan({ zones, selectedId, onSelect }: Props) {
  const selected = zones.find((z) => z.id === selectedId)
  const tooltipBelow = selected ? selected.labelPos[1] < 30 : false

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <img
        src="/assets/stadium/secciones-estadio.webp"
        alt="Mapa de secciones del estadio"
        style={{ width: '100%', height: 'auto', display: 'block' }}
      />

      <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
        {zones.map((zone) => {
          const active = selectedId === zone.id
          return (
            <polygon
              key={zone.id}
              points={zone.points.map((p) => p.join(',')).join(' ')}
              fill={zone.color}
              fillOpacity={active ? 0.28 : 0}
              stroke={zone.color}
              strokeOpacity={active ? 0.95 : 0}
              strokeWidth={0.7}
              role="button"
              tabIndex={0}
              aria-label={`Seleccionar zona ${zone.name}`}
              onClick={() => onSelect(zone)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  onSelect(zone)
                }
              }}
              style={{ cursor: 'pointer', outline: 'none' }}
            />
          )
        })}
      </svg>

      {selected && (
        <>
          <span
            style={{
              position: 'absolute',
              left: `${selected.labelPos[0]}%`,
              top: `${selected.labelPos[1]}%`,
              width: 12,
              height: 12,
              borderRadius: '50%',
              background: '#fff',
              border: '3px solid var(--color-zona-radio)',
              transform: 'translate(-50%, -50%)',
              boxShadow: '0 1px 4px rgba(0,0,0,0.35)',
              pointerEvents: 'none',
              zIndex: 2,
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: `${selected.labelPos[0]}%`,
              top: `${selected.labelPos[1]}%`,
              transform: tooltipBelow ? 'translate(-50%, 16px)' : 'translate(-50%, calc(-100% - 10px))',
              pointerEvents: 'none',
              zIndex: 2,
            }}
          >
            <div
              style={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                gap: 3,
                background: 'var(--color-zona-tooltip)',
                color: '#fff',
                padding: '7px 11px',
                borderRadius: 8,
                whiteSpace: 'nowrap',
                boxShadow: '0 4px 12px rgba(8,18,45,0.35)',
              }}
            >
              <span style={{ fontSize: 12, fontWeight: 700, lineHeight: 1 }}>{selected.name}</span>
              <span style={{ fontSize: 11, fontWeight: 600, lineHeight: 1 }}>
                {formatUSD(selected.price)}
                <span style={{ fontWeight: 500, opacity: 0.72 }}> · {selected.available.toLocaleString('es-PA')} disp.</span>
              </span>
              <span
                style={{
                  position: 'absolute',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 0,
                  height: 0,
                  ...(tooltipBelow
                    ? {
                        bottom: '100%',
                        borderLeft: '6px solid transparent',
                        borderRight: '6px solid transparent',
                        borderBottom: '6px solid var(--color-zona-tooltip)',
                      }
                    : {
                        top: '100%',
                        borderLeft: '6px solid transparent',
                        borderRight: '6px solid transparent',
                        borderTop: '6px solid var(--color-zona-tooltip)',
                      }),
                }}
              />
            </div>
          </div>
        </>
      )}
    </div>
  )
}
