import { Search, SlidersHorizontal } from 'lucide-react'

export function SearchRow({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <div className="flex items-center" style={{ paddingLeft: 20, paddingRight: 20, gap: 8 }}>
      <div
        className="flex flex-1 items-center bg-white"
        style={{
          height: 48,
          borderRadius: 12,
          boxShadow: '0 8px 24px -10px rgba(11,31,56,0.18)',
          paddingLeft: 14,
          paddingRight: 14,
        }}
      >
        <Search className="shrink-0 text-mobile-meta" style={{ width: 20, height: 20 }} strokeWidth={2.2} />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Buscar eventos, equipos o estadios…"
          aria-label="Buscar eventos"
          className="w-full bg-transparent text-mobile-ink outline-none placeholder:text-mobile-meta"
          style={{ fontSize: 15, marginLeft: 10 }}
        />
      </div>

      <button
        type="button"
        className="flex shrink-0 items-center justify-center bg-white"
        style={{
          height: 48,
          borderRadius: 12,
          boxShadow: '0 8px 24px -10px rgba(11,31,56,0.18)',
          gap: 8,
          paddingLeft: 14,
          paddingRight: 14,
        }}
      >
        <SlidersHorizontal className="text-mobile-azul" style={{ width: 18, height: 18 }} strokeWidth={2.4} />
        <span className="font-semibold text-mobile-azul" style={{ fontSize: 15 }}>
          Filtros
        </span>
      </button>
    </div>
  )
}

