import { useQuery } from '@tanstack/react-query'

import { getHomeFeed } from '@/data/api'

export function useHomeFeed() {
  return useQuery({ queryKey: ['home-feed'], queryFn: getHomeFeed })
}
