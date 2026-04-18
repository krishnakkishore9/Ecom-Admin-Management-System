interface SkeletonLoaderProps {
  rows?: number
  height?: string
  borderRadius?: string
  style?: React.CSSProperties
}

export function SkeletonLine({ height = '14px', borderRadius = '6px', style = {} }: {
  height?: string
  borderRadius?: string
  style?: React.CSSProperties
}) {
  return (
    <div style={{
      height,
      borderRadius,
      background: 'linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.09) 50%, rgba(255,255,255,0.04) 75%)',
      backgroundSize: '200% 100%',
      animation: 'shimmer 1.5s infinite ease-in-out',
      ...style,
    }}>
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </div>
  )
}

export function SkeletonCard({ style = {} }: { style?: React.CSSProperties }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.04)',
      border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: '16px',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      ...style,
    }}>
      <SkeletonLine height="12px" style={{ width: '40%' }} />
      <SkeletonLine height="28px" style={{ width: '60%' }} />
      <SkeletonLine height="10px" style={{ width: '80%' }} />
    </div>
  )
}

export default function SkeletonLoader({ rows = 3, height = '14px', borderRadius = '6px', style = {} }: SkeletonLoaderProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', ...style }}>
      {Array.from({ length: rows }).map((_, i) => (
        <SkeletonLine
          key={i}
          height={height}
          borderRadius={borderRadius}
          style={{ width: `${70 + (i % 3) * 10}%` }}
        />
      ))}
    </div>
  )
}
