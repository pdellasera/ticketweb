import { cn } from '@/lib/cn'

export type CategoryKey = 'todos' | 'futbol' | 'conciertos' | 'otros'

const PILLS: { key: CategoryKey; label: string }[] = [
  { key: 'todos', label: 'Todos' },
  { key: 'futbol', label: 'Fútbol' },
  { key: 'conciertos', label: 'Conciertos' },
  { key: 'otros', label: 'Otros' },
]

export function CategoryPills({
  value,
  onChange,
}: {
  value: CategoryKey
  onChange: (key: CategoryKey) => void
}) {
  return (
    <div className="flex items-center" style={{ paddingLeft: 20, gap: 8 }}>
      {PILLS.map((pill) => {
        const active = pill.key === value
        return (
          <button
            key={pill.key}
            type="button"
            onClick={() => onChange(pill.key)}
            className={cn('flex shrink-0 items-center rounded-full font-semibold transition-colors')}
            style={{
              height: 36,
              fontSize: 14,
              lineHeight: 1,
              paddingLeft: 16,
              paddingRight: 16,
              backgroundColor: active ? 'var(--color-mobile-azul)' : 'var(--color-mobile-pill)',
              color: active ? '#fff' : 'var(--color-mobile-ink-soft)',
            }}
          >
            {pill.label}
          </button>
        )
      })}
    </div>
  )
}

