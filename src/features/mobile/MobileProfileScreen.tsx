import { ChevronRight, LogOut, UserRound } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function MobileProfileScreen() {
  const navigate = useNavigate()

  return (
    <div>
      <header style={{ paddingTop: 24, paddingLeft: 20, paddingRight: 20, paddingBottom: 16 }}>
        <h1 className="font-bold text-mobile-ink" style={{ fontSize: 26 }}>
          Perfil
        </h1>
      </header>

      <div style={{ paddingLeft: 20, paddingRight: 20 }}>
        <div className="flex items-center rounded-card border border-mobile-line bg-white" style={{ padding: 18, gap: 16 }}>
          <span className="grid shrink-0 place-items-center rounded-full" style={{ width: 64, height: 64, background: 'var(--color-mobile-pill)' }}>
            <UserRound className="text-mobile-azul" style={{ width: 32, height: 32 }} strokeWidth={1.8} />
          </span>
          <div>
            <p className="font-semibold text-mobile-ink" style={{ fontSize: 18 }}>
              US1234
            </p>
            <p className="text-mobile-meta" style={{ fontSize: 14, marginTop: 4 }}>
              Taquilla 1 - Principal
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigate('/login')}
          className="flex w-full items-center justify-between rounded-card border border-mobile-line bg-white text-left"
          style={{ padding: '18px 20px', marginTop: 12 }}
        >
          <span className="flex items-center text-danger" style={{ fontSize: 15, fontWeight: 500, gap: 10 }}>
            <LogOut style={{ width: 20, height: 20 }} />
            Cerrar sesión
          </span>
          <ChevronRight className="text-mobile-meta" style={{ width: 20, height: 20 }} />
        </button>
      </div>
    </div>
  )
}

