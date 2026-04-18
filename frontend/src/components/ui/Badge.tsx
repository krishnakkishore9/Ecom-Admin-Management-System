type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'default' | 'purple'

interface BadgeProps {
  variant?: BadgeVariant
  children: React.ReactNode
  dot?: boolean
}

const variantMap: Record<BadgeVariant, { bg: string; color: string; border: string; dot: string }> = {
  success: {
    bg: 'rgba(16,185,129,0.12)',
    color: '#34d399',
    border: 'rgba(16,185,129,0.25)',
    dot: '#10b981',
  },
  warning: {
    bg: 'rgba(245,158,11,0.12)',
    color: '#fbbf24',
    border: 'rgba(245,158,11,0.25)',
    dot: '#f59e0b',
  },
  danger: {
    bg: 'rgba(244,63,94,0.12)',
    color: '#fb7185',
    border: 'rgba(244,63,94,0.25)',
    dot: '#f43f5e',
  },
  info: {
    bg: 'rgba(14,165,233,0.12)',
    color: '#38bdf8',
    border: 'rgba(14,165,233,0.25)',
    dot: '#0ea5e9',
  },
  default: {
    bg: 'rgba(100,116,139,0.12)',
    color: '#94a3b8',
    border: 'rgba(100,116,139,0.2)',
    dot: '#64748b',
  },
  purple: {
    bg: 'rgba(168,85,247,0.12)',
    color: '#c084fc',
    border: 'rgba(168,85,247,0.25)',
    dot: '#a855f7',
  },
}

export default function Badge({ variant = 'default', children, dot = false }: BadgeProps) {
  const v = variantMap[variant]
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '5px',
      padding: '3px 10px',
      borderRadius: '20px',
      background: v.bg,
      border: `1px solid ${v.border}`,
      color: v.color,
      fontSize: '0.72rem',
      fontWeight: 600,
      letterSpacing: '0.02em',
      whiteSpace: 'nowrap',
      fontFamily: 'Inter, system-ui, sans-serif',
    }}>
      {dot && (
        <span style={{
          width: '6px', height: '6px', borderRadius: '50%',
          background: v.dot, display: 'inline-block', flexShrink: 0,
        }} />
      )}
      {children}
    </span>
  )
}
