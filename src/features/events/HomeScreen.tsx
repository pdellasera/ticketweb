import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, MapPin, Ticket } from 'lucide-react'

import type { Section, Zone } from '@/data/types'
import { Button } from '@/components/ui/Button'
import { Skeleton } from '@/components/ui/Skeleton'
import { TeamBadge } from '@/components/ui/TeamBadge'
import { Legend } from '@/features/stadium/Legend'
import { StadiumMap } from '@/features/stadium/StadiumMap'
import { useEventos } from '@/hooks/useEventos'
import { useSections, useZones } from '@/hooks/useStadium'
import { cn } from '@/lib/cn'
import { formatUSD, formatDate } from '@/lib/format'
import { EventHeader } from './EventHeader'

export default function HomeScreen() {
  const navigate = useNavigate()
  const { data: eventos, isLoading } = useEventos()
  const [eventIndex, setEventIndex] = useState(0)
  const event = eventos?.[eventIndex]

  const { data: zones } = useZones()
  const { data: sections } = useSections(event?.id)
  const [selectedZoneId, setSelectedZoneId] = useState<string | null>(null)

  const selectedZone: Zone | null = zones?.find((z) => z.id === selectedZoneId) ?? null
  const zoneSections = sections?.filter((s) => s.zoneId === selectedZoneId) ?? []
  const zoneAvailable = zoneSections.reduce((sum, s) => sum + s.availableSeats, 0)

  function handleSectionSelect(section: Section) {
    navigate(`/consola/asientos?evento=${event?.id}&seccion=${section.id}`)
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      {/* Event selector */}
      {isLoading || !eventos ? (
        <div className="flex gap-2 overflow-hidden">
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-16 w-40 shrink-0" />
          ))}
        </div>
      ) : (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {eventos.map((ev, i) => {
            const active = i === eventIndex
            return (
              <button
                key={ev.id}
                type="button"
                onClick={() => {
                  setEventIndex(i)
                  setSelectedZoneId(null)
                }}
                className={cn(
                  'flex shrink-0 items-center gap-3 rounded-control border px-3 py-2.5 text-left transition-colors',
                  active ? 'border-brand-500 bg-brand-500/5' : 'border-line bg-card hover:border-brand-300',
                )}
              >
                <div className="flex items-center -space-x-2">
                  <TeamBadge code={ev.homeCode} className="h-8 w-8 text-[10px] ring-2 ring-card" />
                  <TeamBadge code={ev.awayCode} className="h-8 w-8 text-[10px] ring-2 ring-card" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-ink-900">
                    {ev.homeTeam} vs {ev.awayTeam}
                  </p>
                  <p className="text-[11px] text-ink-400">{formatDate(ev.dateISO)}</p>
                </div>
              </button>
            )
          })}
        </div>
      )}

      {/* Event header */}
      <div className="mt-4">
        {event ? <EventHeader event={event} /> : <Skeleton className="h-40 w-full" />}
      </div>

      {/* Map + side panel */}
      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[1fr_320px]">
        <div className="min-w-0">
          {zones && sections ? (
            <StadiumMap
              zones={zones}
              sections={sections}
              selectedZoneId={selectedZoneId}
              onZoneSelect={(z) => setSelectedZoneId(z.id)}
              onSectionSelect={handleSectionSelect}
            />
          ) : (
            <Skeleton className="aspect-[4/3] w-full" />
          )}
          {zones ? (
            <Legend
              zones={zones}
              selectedZoneId={selectedZoneId}
              onSelect={(z) => setSelectedZoneId(z.id)}
              className="mt-4"
            />
          ) : (
            <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
                <Skeleton key={i} className="h-12" />
              ))}
            </div>
          )}
        </div>

        {/* Zone detail */}
        <aside className="space-y-4">
          <div className="rounded-card border border-line bg-card p-5 shadow-card">
            <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-ink-400">
              <Ticket className="h-4 w-4" />
              Tu selección
            </h2>

            {selectedZone && zones ? (
              <div className="mt-4">
                <div className="flex items-center gap-3">
                  <span className="h-10 w-10 rounded-control" style={{ backgroundColor: selectedZone.color }} />
                  <div>
                    <p className="font-display text-lg font-bold text-ink-900">{selectedZone.name}</p>
                    <p className="text-sm font-semibold text-brand-600">
                      {formatUSD(selectedZone.price)} <span className="font-normal text-ink-400">por boleto</span>
                    </p>
                  </div>
                </div>

                <dl className="mt-4 space-y-2 border-t border-line pt-4 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-ink-600">Secciones</dt>
                    <dd className="font-semibold text-ink-900">{zoneSections.length}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-ink-600">Disponibles</dt>
                    <dd className="font-semibold text-ink-900">{zoneAvailable}</dd>
                  </div>
                </dl>

                <div className="mt-4 flex flex-wrap gap-1.5">
                  {zoneSections.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => handleSectionSelect(s)}
                      className="rounded-control border border-line bg-canvas-soft px-2.5 py-1 text-xs font-semibold text-ink-900 transition-colors hover:border-brand-400 hover:text-brand-600"
                    >
                      {s.number}
                    </button>
                  ))}
                </div>

                <Button
                  size="lg"
                  className="mt-5 w-full"
                  onClick={() => zoneSections[0] && navigate(`/consola/asientos?evento=${event?.id}&seccion=${zoneSections[0].id}`)}
                >
                  Ver asientos
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <p className="mt-3 flex items-start gap-2 text-sm text-ink-600">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-ink-400" />
                Selecciona una zona en el mapa o en la leyenda para ver precios y disponibilidad.
              </p>
            )}
          </div>
        </aside>
      </div>
    </div>
  )
}

