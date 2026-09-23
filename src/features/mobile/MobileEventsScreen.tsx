import { useMemo, useState } from 'react'

import { CategoryPills, type CategoryKey } from '@/features/home/CategoryPills'
import { EventListCard } from '@/features/home/EventListCard'
import { useHomeFeed } from '@/hooks/useHomeFeed'

export default function MobileEventsScreen() {
  const { data: events, isLoading } = useHomeFeed()
  const [category, setCategory] = useState<CategoryKey>('todos')

  const filtered = useMemo(
    () => (events ?? []).filter((e) => category === 'todos' || e.category === category),
    [events, category],
  )

  return (
    <div>
      <header style={{ paddingTop: 24, paddingLeft: 20, paddingRight: 20, paddingBottom: 16 }}>
        <h1 className="font-bold text-mobile-ink" style={{ fontSize: 26 }}>
          Eventos
        </h1>
      </header>

      <CategoryPills value={category} onChange={setCategory} />

      <div
        style={{
          marginTop: 16,
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          paddingLeft: 20,
          paddingRight: 20,
          paddingBottom: 20,
        }}
      >
        {isLoading
          ? [0, 1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse rounded-card border border-mobile-line bg-white" style={{ height: 136 }} />
            ))
          : filtered.map((event) => <EventListCard key={event.id} event={event} />)}
      </div>
    </div>
  )
}

