import { CalendarDays, Clock, XCircle } from 'lucide-react'

import type { TicketStatus } from '@/data/types'

const TABS: { key: TicketStatus; label: string; icon: typeof CalendarDays }[] = [
  { key: 'upcoming', label: 'Próximos', icon: CalendarDays },
  { key: 'past', label: 'Pasados', icon: Clock },
  { key: 'cancelled', label: 'Cancelados', icon: XCircle },
]

export function TicketStatusTabs({ value, onChange }: { value: TicketStatus; onChange: (v: TicketStatus) => void }) {
  return (
    <div style={{ display: 'flex', padding: '0 16px' }}>
      {TABS.map((tab) => {
        const active = tab.key === value
        const Icon = tab.icon
        return (
          <button
            key={tab.key}
            type="button"
            onClick={() => onChange(tab.key)}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 4,
              paddingTop: 4,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            <Icon
              style={{ width: 15, height: 15 }}
              strokeWidth={2.2}
              color={active ? 'var(--color-mobile-azul)' : 'var(--color-mobile-meta)'}
            />
            <span
              style={{
                fontSize: 12,
                fontWeight: 600,
                lineHeight: 1,
                color: active ? 'var(--color-mobile-azul)' : 'var(--color-mobile-meta)',
              }}
            >
              {tab.label}
            </span>
            <span
              style={{
                height: 3,
                alignSelf: 'stretch',
                margin: '6px 2px 0',
                borderRadius: 999,
                background: active ? 'var(--color-mobile-azul)' : 'transparent',
              }}
            />
          </button>
        )
      })}
    </div>
  )
}
