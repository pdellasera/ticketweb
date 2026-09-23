import { Bell, ChevronLeft, ShoppingCart } from 'lucide-react'
import { Link } from 'react-router-dom'

import { useCart } from '@/features/cart/CartContext'

interface HeroHeaderProps {
  /** 'home' = logo left + bell/cart · 'flow' = back + centered logo + cart · 'tabs' = logo left + avatar right. */
  variant?: 'home' | 'flow' | 'tabs'
  /** Back destination for the flow variant. */
  backTo?: string
}

export function HeroHeader({ variant = 'home', backTo = '/eventos' }: HeroHeaderProps) {
  const { itemCount } = useCart()

  const cart = (
    <Link to="/mis-entradas" className="relative text-white" aria-label="Carrito">
      <ShoppingCart style={{ width: 22, height: 22 }} strokeWidth={2.2} />
      {itemCount > 0 && (
        <span className="absolute -right-2 -top-2 grid h-4 min-w-4 place-items-center rounded-full bg-[#0167fb] px-1 text-[10px] font-bold text-white">
          {itemCount}
        </span>
      )}
    </Link>
  )

  if (variant === 'tabs') {
    return (
      <header
        className="flex items-center justify-between"
        style={{
          height: 52,
          paddingLeft: 16,
          paddingRight: 16,
          background: 'linear-gradient(180deg, #01244d 0%, #021127 100%)',
        }}
      >
        <img
          src="/assets/brand/logo_white.webp"
          alt="GameGate"
          style={{ height: 34, width: 'auto', display: 'block' }}
        />
        <Link to="/perfil" aria-label="Perfil">
          <span
            className="grid place-items-center rounded-full font-display font-bold"
            style={{
              width: 30,
              height: 30,
              background: '#12306b',
              color: '#fff',
              fontSize: 12,
              letterSpacing: 0.3,
              border: '1.5px solid rgba(255,255,255,0.4)',
            }}
          >
            GG
          </span>
        </Link>
      </header>
    )
  }

  if (variant === 'flow') {
    return (
      <header
        className="relative flex items-center justify-center"
        style={{
          height: 45,
          paddingLeft: 16,
          paddingRight: 16,
          background: 'linear-gradient(180deg, #01244d 0%, #021127 100%)',
        }}
      >
        <Link
          to={backTo}
          className="absolute left-0 flex items-center text-white"
          style={{ gap: 2, height: 45, paddingLeft: 12, paddingRight: 12 }}
          aria-label="Volver"
        >
          <ChevronLeft style={{ width: 24, height: 24 }} strokeWidth={2.4} />
          <span style={{ fontSize: 15, fontWeight: 600, lineHeight: 1 }}>Atrás</span>
        </Link>

        <img
          src="/assets/brand/logo_white.webp"
          alt="GameGate"
          style={{ height: 30, width: 'auto', display: 'block' }}
        />

        <div className="absolute right-0 flex items-center" style={{ paddingRight: 16 }}>
          {cart}
        </div>
      </header>
    )
  }

  return (
    <header
      className="flex items-center justify-between"
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 20,
        height: 80,
        paddingLeft: 20,
        paddingRight: 20,
        background: 'linear-gradient(180deg, #01244d 0%, #021127 100%)',
      }}
    >
      <img
        src="/assets/brand/logo_white.webp"
        alt="GameGate"
        style={{ height: 60, width: 'auto', display: 'block' }}
      />

      <div className="flex items-center" style={{ gap: 20 }}>
        <button type="button" className="relative text-white" aria-label="Notificaciones">
          <Bell style={{ width: 22, height: 22 }} strokeWidth={2.2} />
        </button>

        {cart}
      </div>
    </header>
  )
}



