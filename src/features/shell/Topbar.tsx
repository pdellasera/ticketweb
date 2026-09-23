import { Bell, Menu, Search } from 'lucide-react'

import { Input } from '@/components/ui/Input'

export function Topbar() {
  return (
    <header className="flex h-16 shrink-0 items-center gap-4 border-b border-line bg-card px-4 sm:px-6">
      <button
        type="button"
        className="grid h-10 w-10 place-items-center rounded-control text-ink-600 hover:bg-canvas lg:hidden"
        aria-label="Abrir menú"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="max-w-md flex-1">
        <Input
          placeholder="Buscar evento o equipo…"
          icon={<Search className="h-4 w-4" />}
          className="h-10 bg-canvas-soft"
          aria-label="Buscar"
        />
      </div>

      <div className="ml-auto flex items-center gap-1 sm:gap-2">
        <button
          type="button"
          className="relative grid h-10 w-10 place-items-center rounded-full text-ink-600 transition-colors hover:bg-canvas"
          aria-label="Notificaciones"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-danger ring-2 ring-card" />
        </button>

        <div className="ml-1 flex items-center gap-3 border-l border-line pl-3">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-semibold leading-4 text-ink-900">Carlos Pérez</p>
            <p className="text-xs text-ink-400">Aficionado</p>
          </div>
          <span className="grid h-9 w-9 place-items-center rounded-full bg-brand-500 font-display font-bold text-white">
            CP
          </span>
        </div>
      </div>
    </header>
  )
}
