import { useMemo, useState } from 'react'

import { useHomeFeed } from '@/hooks/useHomeFeed'
import { CategoryPills, type CategoryKey } from './CategoryPills'
import { EventListCard } from './EventListCard'
import { HeroCopy } from './HeroCopy'
import { HeroHeader } from './HeroHeader'
import { SearchRow } from './SearchRow'
import { SectionHeading } from './SectionHeading'

export default function HomeMobileScreen() {
  const { data: events, isLoading } = useHomeFeed()
  const [category, setCategory] = useState<CategoryKey>('todos')
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    if (!events) return []
    const q = query.trim().toLowerCase()
    return events.filter((e) => {
      const catOk = category === 'todos' || e.category === category
      const qOk = !q || `${e.title} ${e.competition} ${e.venue} ${e.city}`.toLowerCase().includes(q)
      return catOk && qOk
    })
  }, [events, category, query])

  return (
    <div>
      {/* Sticky header */}
      <HeroHeader />

      {/* Hero content */}
      <div
        className="relative"
        style={{ height: 180, overflow: 'hidden', background: 'linear-gradient(180deg, #01244d 0%, #021127 62%, #030915 100%)' }}
      >
        <img
          src="/assets/home/hero-stadium.webp"
          alt=""
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', opacity: 0.5 }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(1,36,77,0.55) 0%, rgba(3,9,21,0.82) 100%)' }} />
        <HeroCopy />
      </div>

      {/* Search row — overlaps the hero's bottom edge */}
      <div style={{ marginTop: -24, position: 'relative' }}>
        <SearchRow value={query} onChange={setQuery} />
      </div>

      {/* Category pills */}
      <div style={{ marginTop: 16 }}>
        <CategoryPills value={category} onChange={setCategory} />
      </div>

      {/* Section heading */}
      <div style={{ marginTop: 22 }}>
        <SectionHeading />
      </div>

      {/* Event cards */}
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
          ? [0, 1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="animate-pulse rounded-card border border-mobile-line bg-white" style={{ height: 136 }} />
            ))
          : filtered.map((event) => <EventListCard key={event.id} event={event} />)}
        {!isLoading && filtered.length === 0 && (
          <p className="text-center text-mobile-meta" style={{ fontSize: 14, padding: '24px 0' }}>
            No hay eventos que coincidan con tu búsqueda.
          </p>
        )}
      </div>
    </div>
  )
}

