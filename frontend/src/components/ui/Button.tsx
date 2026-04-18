'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  icon?: React.ReactNode
  children: React.ReactNode
}

const variantStyles: Record<ButtonVariant, React.CSSProperties> = {
  primary: {
    background: 'linear-gradient(135deg, #10b981, #059669)',
    color: 'white',
    border: 'none',
    boxShadow: '0 4px 16px rgba(16,185,129,0.3)',
  },
  secondary: {
    background: 'rgba(255,255,255,0.06)',
    color: '#e2e8f0',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: 'rgba(255,255,255,0.12)',
    boxShadow: 'none',
  },
  danger: {
    background: 'rgba(244,63,94,0.12)',
    color: '#fb7185',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: 'rgba(244,63,94,0.25)',
    boxShadow: 'none',
  },
  ghost: {
    background: 'transparent',
    color: '#94a3b8',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: 'transparent',
    boxShadow: 'none',
  },
}

const hoverStyles: Record<ButtonVariant, React.CSSProperties> = {
  primary: { boxShadow: '0 6px 24px rgba(16,185,129,0.5)', filter: 'brightness(1.1)' },
  secondary: { background: 'rgba(255,255,255,0.1)', borderColor: 'rgba(255,255,255,0.2)' },
  danger: { background: 'rgba(244,63,94,0.2)', borderColor: 'rgba(244,63,94,0.4)' },
  ghost: { background: 'rgba(255,255,255,0.05)', color: '#f8fafc' },
}

const sizeStyles: Record<ButtonSize, React.CSSProperties> = {
  sm: { padding: '6px 12px', fontSize: '0.8rem', borderRadius: '8px' },
  md: { padding: '9px 18px', fontSize: '0.875rem', borderRadius: '10px' },
  lg: { padding: '12px 24px', fontSize: '0.95rem', borderRadius: '12px' },
}

export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  children,
  disabled,
  style,
  ...props
}: ButtonProps) {
  const [hovered, setHovered] = React.useState(false)

  return (
    <motion.button
      whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.97 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      disabled={disabled || loading}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '7px',
        fontWeight: 600,
        cursor: disabled || loading ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.55 : 1,
        transition: 'all 0.18s ease',
        fontFamily: 'Inter, system-ui, sans-serif',
        outline: 'none',
        ...variantStyles[variant],
        ...(hovered && !disabled && !loading ? hoverStyles[variant] : {}),
        ...sizeStyles[size],
        ...style,
      }}
      {...(props as React.ComponentPropsWithoutRef<typeof motion.button>)}
    >
      {loading ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : icon}
      {children}
    </motion.button>
  )
}
