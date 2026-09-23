import type { EventCategory } from '@/data/types'

export interface CategoryMeta {
  label: string
  color: string
  /** Badge pill background tint. */
  tint: string
}

export const CATEGORY_META: Record<EventCategory, CategoryMeta> = {
  futbol: { label: 'Deportes', color: 'var(--color-cat-deportes)', tint: '#eaf2fe' },
  conciertos: { label: 'Conciertos', color: 'var(--color-cat-conciertos)', tint: '#f4ecfd' },
  teatro: { label: 'Teatro', color: 'var(--color-cat-teatro)', tint: '#e8f8ee' },
  otros: { label: 'Otros', color: 'var(--color-cat-otros)', tint: '#feecec' },
}

export const LEGEND_ORDER: EventCategory[] = ['futbol', 'conciertos', 'teatro', 'otros']

/** Stable ordering for the selected day's list (Deportes → Conciertos → Teatro → Otros). */
export const CATEGORY_ORDER: Record<EventCategory, number> = {
  futbol: 0,
  conciertos: 1,
  teatro: 2,
  otros: 3,
}
