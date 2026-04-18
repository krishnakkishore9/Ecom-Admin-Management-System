import React from 'react'
import { ChevronDown } from 'lucide-react'

interface SelectOption {
  value: string
  label: string
}

interface SelectDropdownProps {
  label?: string
  options: SelectOption[]
  value?: string
  onChange?: (value: string) => void
  error?: string
  placeholder?: string
  disabled?: boolean
  id?: string
}

export default function SelectDropdown({
  label,
  options,
  value,
  onChange,
  error,
  placeholder = 'Select an option',
  disabled = false,
  id,
}: SelectDropdownProps) {
  const [focused, setFocused] = React.useState(false)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontFamily: 'Inter, system-ui, sans-serif' }}>
      {label && (
        <label
          htmlFor={id}
          style={{
            fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase',
            letterSpacing: '0.08em', color: error ? '#fb7185' : '#64748b',
          }}
        >
          {label}
        </label>
      )}
      <div style={{ position: 'relative' }}>
        <select
          id={id}
          value={value}
          disabled={disabled}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onChange={(e) => onChange?.(e.target.value)}
          style={{
            width: '100%',
            padding: '10px 36px 10px 14px',
            background: 'rgba(0,0,0,0.25)',
            border: error
              ? '1px solid rgba(244,63,94,0.5)'
              : focused
              ? '1px solid rgba(99,102,241,0.6)'
              : '1px solid rgba(255,255,255,0.1)',
            borderRadius: '10px',
            color: value ? '#f8fafc' : '#64748b',
            fontSize: '0.875rem',
            outline: 'none',
            appearance: 'none',
            WebkitAppearance: 'none',
            cursor: disabled ? 'not-allowed' : 'pointer',
            opacity: disabled ? 0.55 : 1,
            transition: 'border-color 0.15s, box-shadow 0.15s',
            boxShadow: focused ? '0 0 0 3px rgba(99,102,241,0.15)' : 'none',
            fontFamily: 'inherit',
          }}
        >
          <option value="" disabled style={{ background: '#1e1b4b', color: '#94a3b8' }}>
            {placeholder}
          </option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} style={{ background: '#1e1b4b', color: '#f8fafc' }}>
              {opt.label}
            </option>
          ))}
        </select>
        <div style={{
          position: 'absolute', right: '12px', top: '50%',
          transform: `translateY(-50%) rotate(${focused ? '180deg' : '0deg'})`,
          color: '#475569', pointerEvents: 'none', transition: 'transform 0.2s',
        }}>
          <ChevronDown size={16} />
        </div>
      </div>
      {error && <p style={{ fontSize: '0.75rem', color: '#fb7185', margin: 0 }}>{error}</p>}
    </div>
  )
}
