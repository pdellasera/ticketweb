import { useQuery } from '@tanstack/react-query'

import { getSection, getSections, getSeats, getZones } from '@/data/api'
import type { Section } from '@/data/types'

export function useZones() {
  return useQuery({ queryKey: ['zones'], queryFn: getZones })
}

export function useSections(eventId: string | undefined) {
  return useQuery({
    queryKey: ['sections', eventId],
    queryFn: () => getSections(eventId ?? ''),
    enabled: Boolean(eventId),
  })
}

export function useSection(eventId: string | undefined, sectionId: string | undefined) {
  return useQuery({
    queryKey: ['section', eventId, sectionId],
    queryFn: () => getSection(eventId ?? '', sectionId ?? ''),
    enabled: Boolean(eventId && sectionId),
  })
}

export function useSeats(eventId: string | undefined, section: Section | undefined) {
  return useQuery({
    queryKey: ['seats', eventId, section?.id],
    queryFn: () => getSeats(eventId ?? '', section as Section),
    enabled: Boolean(eventId && section),
  })
}

