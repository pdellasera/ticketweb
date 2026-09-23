import { CalendarDays } from 'lucide-react'
import { Link } from 'react-router-dom'

export function SectionHeading() {
  return (
    <div className="flex items-center justify-between" style={{ paddingLeft: 20, paddingRight: 20 }}>
      <h2 className="font-bold text-mobile-ink" style={{ fontSize: 20 }}>
        Próximos eventos
      </h2>
      <Link to="/eventos/calendario" className="flex items-center text-mobile-azul" style={{ gap: 6 }}>
        <CalendarDays style={{ width: 18, height: 18 }} strokeWidth={2.2} />
        <span className="font-semibold" style={{ fontSize: 14 }}>
          Ver calendario
        </span>
      </Link>
    </div>
  )
}

