'use client'

import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface FormAmountProps {
  label?: string
  value: string
  onChange: (value: string) => void
  onBlur?: () => void
  error?: string | null
  required?: boolean
  disabled?: boolean
  placeholder?: string
}

const FormAmount = forwardRef<HTMLInputElement, FormAmountProps>(({
  label,
  value,
  onChange,
  onBlur,
  error,
  required,
  disabled,
  placeholder = '0.00',
}, ref) => {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-xs font-medium text-gray-700
          flex items-center gap-1">
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className={cn(
        'flex items-center h-10 rounded-lg border bg-white',
        'focus-within:ring-2 focus-within:ring-[#1a3f7a]/20',
        'focus-within:border-[#1a3f7a] transition-all',
        'hover:border-gray-300',
        error
          ? 'border-red-300 focus-within:border-red-400 focus-within:ring-red-100'
          : 'border-gray-200',
        disabled && 'bg-gray-50'
      )}>
        <span className="pl-3 pr-1.5 text-xs font-medium text-gray-400
          select-none shrink-0">
          S/.
        </span>
        <div className="w-px h-4 bg-gray-200 shrink-0" />
        <input
          ref={ref}
          type="number"
          step="0.01"
          min="0"
          max="9999999.99"
          value={value}
          onChange={e => onChange(e.target.value)}
          onBlur={onBlur}
          disabled={disabled}
          placeholder={placeholder}
          className="flex-1 h-full px-2.5 text-sm text-gray-900 bg-transparent
            focus:outline-none placeholder:text-gray-300
            disabled:cursor-not-allowed"
        />
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
})

FormAmount.displayName = 'FormAmount'
export default FormAmount