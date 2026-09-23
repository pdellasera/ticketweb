import { ChevronDown, ChevronLeft, MapPin } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { GameGateLogo } from '@/components/ui/GameGateLogo'

export function CalendarHeroHeader() {
  const navigate = useNavigate()

  return (
    <header
      style={{
        position: 'relative',
        zIndex: 2,
        height: 60,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: 16,
        paddingRight: 16,
      }}
    >
      <button
        type="button"
        onClick={() => navigate('/')}
        className="flex items-center text-white"
        style={{ gap: 2, justifyContent: 'flex-start', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
      >
        <ChevronLeft style={{ width: 26, height: 26 }} strokeWidth={2.4} />
        <span style={{ fontSize: 15, fontWeight: 500 }}>Atrás</span>
      </button>

      <span
        style={{
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
          pointerEvents: 'none',
        }}
      >
        <GameGateLogo variant="light" className="text-[19px]" />
      </span>

      <button
        type="button"
        className="flex items-center justify-end text-white"
        style={{
          gap: 4,
          height: 34,
          paddingLeft: 10,
          paddingRight: 10,
          borderRadius: 999,
          background: 'rgba(255,255,255,0.16)',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        <MapPin style={{ width: 15, height: 15 }} strokeWidth={2.2} />
        <span style={{ fontSize: 14, fontWeight: 600 }}>Panamá</span>
        <ChevronDown style={{ width: 16, height: 16 }} strokeWidth={2.4} />
      </button>
    </header>
  )
}
