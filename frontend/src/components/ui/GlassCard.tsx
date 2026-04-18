import React from 'react'

interface GlassCardProps {
  children: React.ReactNode
  className?: string
  padding?: string
  style?: React.CSSProperties
  hoverable?: boolean
}

export default function GlassCard({
  children,
  padding = '24px',
  style = {},
  hoverable = false,
}: GlassCardProps) {
  const [hovered, setHovered] = React.useState(false)

  return (
    <div
      onMouseEnter={() => hoverable && setHovered(true)}
      onMouseLeave={() => hoverable && setHovered(false)}
      style={{
        background: hovered ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.04)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: hovered
          ? '1px solid rgba(255,255,255,0.14)'
          : '1px solid rgba(255,255,255,0.08)',
        borderRadius: '16px',
        padding,
        boxShadow: hovered
          ? '0 16px 40px rgba(0,0,0,0.3)'
          : '0 4px 24px rgba(0,0,0,0.2)',
        transition: 'all 0.2s ease',
        ...style,
      }}
    >
      {children}
    </div>
  )
}
