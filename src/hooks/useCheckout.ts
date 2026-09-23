import { useQuery } from '@tanstack/react-query'

import { getHomeEvent, getMobileZones } from '@/data/api'

export function useHomeEvent(id: string | undefined) {
  return useQuery({
    queryKey: ['home-event', id],
    queryFn: () => getHomeEvent(id ?? ''),
    enabled: Boolean(id),
  })
}

export function useMobileZones(eventId: string | undefined) {
  return useQuery({
    queryKey: ['mobile-zones', eventId],
    queryFn: () => getMobileZones(eventId ?? ''),
    enabled: Boolean(eventId),
  })
}
