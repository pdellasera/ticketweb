import { useQuery } from '@tanstack/react-query'

import { getEvento } from '@/data/api'

export function useEvento(id: string | undefined) {
  return useQuery({
    queryKey: ['evento', id],
    queryFn: () => getEvento(id ?? ''),
    enabled: Boolean(id),
  })
}
