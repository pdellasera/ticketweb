import { CATEGORY_META, LEGEND_ORDER } from './categoryMeta'

export function CategoryLegend() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 21, flexWrap: 'wrap' }}>
      {LEGEND_ORDER.map((cat) => (
        <div key={cat} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 9, height: 9, borderRadius: '50%', background: CATEGORY_META[cat].color }} />
          <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-cal-legend)' }}>{CATEGORY_META[cat].label}</span>
        </div>
      ))}
    </div>
  )
}
