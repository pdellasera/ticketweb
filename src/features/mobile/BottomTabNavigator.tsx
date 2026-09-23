import { NavLink } from 'react-router-dom'
import { House, Search, Ticket, User } from 'lucide-react'

const TABS = [
  { to: '/', label: 'Inicio', icon: House, end: true },
  { to: '/eventos', label: 'Explorar', icon: Search, end: false },
  { to: '/mis-entradas', label: 'Mis tickets', icon: Ticket, end: false },
  { to: '/perfil', label: 'Perfil', icon: User, end: false },
]

export function BottomTabNavigator() {
  return (
    <nav
      style={{
        position: 'relative',
        height: 80,
        background: 'var(--color-ticket-nav)',
        borderTop: '1px solid var(--color-ticket-nav-line)',
        boxShadow: '0 -6px 16px -12px rgba(11,31,56,0.16)',
      }}
    >
      <div className="flex" style={{ paddingTop: 8 }}>
        {TABS.map((tab) => (
          <NavLink key={tab.to} to={tab.to} end={tab.end} className="flex flex-col items-center" style={{ flex: 1, gap: 3 }}>
            {({ isActive }) => {
              const color = isActive ? 'var(--color-mobile-azul)' : 'var(--color-ticket-icon)'
              return (
                <>
                  <span
                    className="grid place-items-center"
                    style={{ width: 56, height: 30, borderRadius: 14, background: isActive ? 'var(--color-ticket-pill)' : 'transparent' }}
                  >
                    <tab.icon
                      style={{ width: 24, height: 24 }}
                      strokeWidth={isActive ? 2.4 : 2}
                      fill={isActive ? 'currentColor' : 'none'}
                      color={color}
                    />
                  </span>
                  <span style={{ fontSize: 12, fontWeight: isActive ? 600 : 500, lineHeight: 1, color }}>{tab.label}</span>
                </>
              )
            }}
          </NavLink>
        ))}
      </div>

      {/* Home indicator */}
      <div
        style={{
          position: 'absolute',
          bottom: 6,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 120,
          height: 4,
          background: 'var(--color-mobile-ink)',
          borderRadius: 2,
        }}
      />
    </nav>
  )
}

