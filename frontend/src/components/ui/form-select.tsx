'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface SelectOption {
  value: string
  label: string
  description?: string
}

interface FormSelectProps {
  label?: string
  options: SelectOption[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
  error?: string | null
  required?: boolean
  disabled?: boolean
}

export default function FormSelect({
  label,
  options,
  value,
  onChange,
  placeholder = 'Seleccionar...',
  error,
  required,
  disabled,
}: FormSelectProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const selected = options.find(o => o.value === value)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div className="flex flex-col gap-1.5" ref={ref}>
      {label && (
        <label className="text-xs font-medium text-gray-700
          flex items-center gap-1">
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative">
        <button
          type="button"
          disabled={disabled}
          onClick={() => setOpen(o => !o)}
          className={cn(
            'w-full h-10 px-3 text-sm rounded-lg border bg-white',
            'flex items-center justify-between gap-2',
            'focus:outline-none focus:ring-2 focus:ring-[#1a3f7a]/20',
            'focus:border-[#1a3f7a] transition-all text-left',
            'disabled:bg-gray-50 disabled:cursor-not-allowed',
            error
              ? 'border-red-300'
              : open
              ? 'border-[#1a3f7a] ring-2 ring-[#1a3f7a]/20'
              : 'border-gray-200 hover:border-gray-300'
          )}
        >
          <span className={cn(
            'truncate',
            selected ? 'text-gray-900' : 'text-gray-300'
          )}>
            {selected?.label ?? placeholder}
          </span>
          <ChevronDown className={cn(
            'w-4 h-4 text-gray-400 shrink-0 transition-transform duration-150',
            open && 'rotate-180'
          )} />
        </button>

        {/* Dropdown */}
        {open && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white
            border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden
            py-1">
            {options.map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => { onChange(opt.value); setOpen(false) }}
                className={cn(
                  'w-full px-3 py-2.5 text-left flex items-center',
                  'justify-between gap-2 transition-colors',
                  'hover:bg-gray-50',
                  opt.value === value && 'bg-blue-50'
                )}
              >
                <div>
                  <p className={cn(
                    'text-sm',
                    opt.value === value
                      ? 'text-[#1a3f7a] font-medium'
                      : 'text-gray-700'
                  )}>
                    {opt.label}
                  </p>
                  {opt.description && (
                    <p className="text-xs text-gray-400 mt-0.5">
                      {opt.description}
                    </p>
                  )}
                </div>
                {opt.value === value && (
                  <Check className="w-3.5 h-3.5 text-[#1a3f7a] shrink-0" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}