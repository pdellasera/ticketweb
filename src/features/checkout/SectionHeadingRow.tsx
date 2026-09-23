import { Pencil } from 'lucide-react'

interface Props {
  title: string
  onEdit?: () => void
  editLabel?: string
}

/** Section heading with an optional blue "Editar" affordance on the right. */
export function SectionHeadingRow({ title, onEdit, editLabel = 'Editar' }: Props) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
      <h2 style={{ fontSize: 17, fontWeight: 700, lineHeight: 1.2, color: 'var(--color-checkout-ink)' }}>{title}</h2>
      {onEdit && (
        <button
          type="button"
          onClick={onEdit}
          className="flex items-center"
          style={{ gap: 4, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-pago-blue)', padding: 0, flexShrink: 0 }}
        >
          <Pencil style={{ width: 13, height: 13 }} strokeWidth={2.2} />
          <span style={{ fontSize: 13, fontWeight: 600 }}>{editLabel}</span>
        </button>
      )}
    </div>
  )
}
