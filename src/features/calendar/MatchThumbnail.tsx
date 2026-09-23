import { TeamCrest } from '@/components/ui/TeamCrest'

export function MatchThumbnail({ title }: { title: string }) {
  const teams = title.split(/\s+vs\s+/i)
  const a = teams[0] ?? title
  const b = teams.length === 2 ? teams[1] : 'GG'

  return (
    <div
      style={{
        position: 'relative',
        width: 126,
        height: 90,
        borderRadius: 10,
        overflow: 'hidden',
        flexShrink: 0,
        background: '#0a2a4e',
      }}
    >
      <img
        src="/assets/home/hero-stadium.webp"
        alt=""
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(3,17,38,0.35) 0%, rgba(3,17,38,0.72) 100%)',
        }}
      />
      <div
        style={{
          position: 'relative',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 6,
        }}
      >
        <span className="grid place-items-center rounded-full" style={{ width: 34, height: 34, background: '#fff' }}>
          <TeamCrest name={a} size={30} />
        </span>
        <span style={{ color: '#fff', fontSize: 12, fontWeight: 800, letterSpacing: 0.5 }}>VS</span>
        <span className="grid place-items-center rounded-full" style={{ width: 34, height: 34, background: '#fff' }}>
          <TeamCrest name={b} size={30} />
        </span>
      </div>
    </div>
  )
}
