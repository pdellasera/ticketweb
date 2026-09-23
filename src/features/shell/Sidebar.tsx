import { NavLink } from 'react-router-dom'
import { CalendarDays, Home, LogOut, Map, Ticket } from 'lucide-react'

import { GameGateLogo } from '@/components/ui/GameGateLogo'
import { cn } from '@/lib/cn'

const NAV = [
  { to: '/consola', label: 'Inicio', icon: Home, end: false },
  { to: '/consola/eventos', label: 'Eventos', icon: CalendarDays, end: false },
  { to: '/consola/asientos', label: 'Mapa de asientos', icon: Map, end: false },
  { to: '/consola/venta', label: 'Venta de tickets', icon: Ticket, end: false },
]

export function Sidebar() {
  return (
    <aside className="relative hidden w-60 shrink-0 flex-col overflow-hidden bg-navy-900 lg:flex">
      <img
        src="/assets/photos/sidebar_background.webp"
        alt=""
        className="absolute inset-0 h-full w-full object-cover opacity-25"
      />
      <div className="absolute inset-0 bg-navy-900/70" />
      <div className="relative flex h-full flex-col p-5">
        <div className="px-2 pb-4 pt-2">
          <GameGateLogo variant="light" className="text-2xl" />
        </div>

        <nav className="mt-4 flex-1 space-y-1">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-control px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive ? 'bg-white/10 text-white' : 'text-white/60 hover:bg-white/5 hover:text-white',
                )
              }
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="rounded-control border border-white/10 bg-white/5 p-3">
          <div className="flex items-center gap-3">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand-500 font-display font-bold text-white">
              CP
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white">Carlos Pérez</p>
              <p className="truncate text-xs text-white/50">carlos@correo.com</p>
            </div>
            <button className="ml-auto text-white/50 transition-colors hover:text-white" aria-label="Cerrar sesión">
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  )
}
