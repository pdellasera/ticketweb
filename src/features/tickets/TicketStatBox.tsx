export function TicketStatBox({ label, value }: { label: string; value: string }) {
  const compact = value.length > 5
  return (
    <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
      <span
        style={{
          fontSize: 12,
          fontWeight: 600,
          letterSpacing: 0.8,
          color: 'var(--color-mobile-meta)',
          textTransform: 'uppercase',
          lineHeight: 1,
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontSize: compact ? 16 : 29,
          fontWeight: 800,
          color: 'var(--color-ticket-stub-ink)',
          lineHeight: 1,
          textAlign: 'center',
          whiteSpace: 'nowrap',
        }}
      >
        {value}
      </span>
    </div>
  )
}