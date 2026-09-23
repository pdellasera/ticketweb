import { useQuery } from '@tanstack/react-query'

import { getEventos } from '@/data/api'

export function useEventos() {
  return useQuery({ queryKey: ['eventos'], queryFn: getEventos })
}
