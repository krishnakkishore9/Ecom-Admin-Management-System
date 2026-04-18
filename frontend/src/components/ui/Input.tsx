import React from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  icon?: React.ReactNode
  hint?: string
}

export default function Input({
  label,
  error,
  icon,
  hint,
  id,
  style,
  ...props
}: InputProps) {
  const [focused, setFocused] = React.useState(false)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontFamily: 'Inter, system-ui, sans-serif' }}>
      {label && (
        <label
          htmlFor={id}
          style={{
            fontSize: '0.7rem',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: error ? '#fb7185' : '#64748b',
          }}
        >
          {label}
        </label>
      )}
      <div style={{ position: 'relative' }}>
        {icon && (
          <div style={{
            position: 'absolute', left: '12px', top: '50%',
            transform: 'translateY(-50%)',
            color: focused ? '#818cf8' : '#475569',
            display: 'flex', alignItems: 'center',
            transition: 'color 0.15s',
            pointerEvents: 'none',
          }}>
            {icon}
          </div>
        )}
        <input
          id={id}
          onFocus={(e) => { setFocused(true); props.onFocus?.(e) }}
          onBlur={(e) => { setFocused(false); props.onBlur?.(e) }}
          style={{
            width: '100%',
            boxSizing: 'border-box',
            paddingLeft: icon ? '38px' : '14px',
            paddingRight: '14px',
            paddingTop: '10px',
            paddingBottom: '10px',
            background: 'rgba(0,0,0,0.25)',
            border: error
              ? '1px solid rgba(244,63,94,0.5)'
              : focused
              ? '1px solid rgba(99,102,241,0.6)'
              : '1px solid rgba(255,255,255,0.1)',
            borderRadius: '10px',
            color: '#f8fafc',
            fontSize: '0.875rem',
            outline: 'none',
            transition: 'border-color 0.15s, box-shadow 0.15s',
            boxShadow: focused
              ? error
                ? '0 0 0 3px rgba(244,63,94,0.15)'
                : '0 0 0 3px rgba(99,102,241,0.15)'
              : 'none',
            fontFamily: 'inherit',
            ...style,
          }}
          {...props}
        />
      </div>
      {error && (
        <p style={{ fontSize: '0.75rem', color: '#fb7185', margin: 0 }}>{error}</p>
      )}
      {hint && !error && (
        <p style={{ fontSize: '0.75rem', color: '#475569', margin: 0 }}>{hint}</p>
      )}
    </div>
  )
}
