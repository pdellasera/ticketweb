import { useQuery } from '@tanstack/react-query'

import { getCalendarEvents } from '@/data/api'

export function useCalendarEvents() {
  return useQuery({ queryKey: ['calendar-events'], queryFn: getCalendarEvents })
}
