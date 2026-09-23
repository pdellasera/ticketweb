import { NavLink } from 'react-router-dom'
import { CalendarDays, Home, Map, Ticket } from 'lucide-react'

import { useCart } from '@/features/cart/CartContext'
import { cn } from '@/lib/cn'

const NAV = [
  { to: '/consola', label: 'Inicio', icon: Home, end: true },
  { to: '/consola/eventos', label: 'Eventos', icon: CalendarDays, end: false },
  { to: '/consola/asientos', label: 'Asientos', icon: Map, end: false },
  { to: '/consola/venta', label: 'Boletos', icon: Ticket, end: false },
]

/** Bottom navigation bar — visible only on mobile. */
export function MobileNav() {
  const { itemCount } = useCart()
  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 flex border-t border-line bg-card/95 backdrop-blur lg:hidden">
      {NAV.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          className={({ isActive }) =>
            cn(
              'relative flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition-colors',
              isActive ? 'text-brand-600' : 'text-ink-400 hover:text-ink-600',
            )
          }
        >
          <span className="relative">
            <item.icon className="h-5 w-5" />
            {item.to === '/consola/venta' && itemCount > 0 && (
              <span className="absolute -right-2 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-danger px-1 text-[9px] font-bold text-white">
                {itemCount}
              </span>
            )}
          </span>
          {item.label}
        </NavLink>
      ))}
    </nav>
  )
}
