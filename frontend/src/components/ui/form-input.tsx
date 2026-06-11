'use client'

import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string | null
  hint?: string
  required?: boolean
  counter?: boolean
  maxLength?: number
  prefix?: string
  suffix?: string
}

const FormInput = forwardRef<HTMLInputElement, FormInputProps>(({
  label,
  error,
  hint,
  required,
  counter,
  maxLength,
  prefix,
  suffix,
  className,
  value,
  ...props
}, ref) => {
  const val = typeof value === 'string' ? value : ''

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-xs font-medium text-gray-700 flex items-center gap-1">
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative">
        {prefix && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2
            text-xs text-gray-400 pointer-events-none select-none">
            {prefix}
          </span>
        )}
        <input
          ref={ref}
          value={value}
          maxLength={maxLength}
          className={cn(
            'w-full h-10 text-sm rounded-lg border bg-white',
            'text-gray-900 placeholder:text-gray-300',
            'focus:outline-none focus:ring-2 focus:ring-[#1a3f7a]/20',
            'focus:border-[#1a3f7a] transition-all',
            'disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed',
            prefix ? 'pl-8' : 'pl-3',
            suffix ? 'pr-8' : 'pr-3',
            error
              ? 'border-red-300 focus:border-red-400 focus:ring-red-100'
              : 'border-gray-200 hover:border-gray-300',
            className
          )}
          {...props}
        />
        {suffix && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2
            text-xs text-gray-400 pointer-events-none select-none">
            {suffix}
          </span>
        )}
      </div>
      <div className="flex items-start justify-between gap-2 min-h-[16px]">
        <div>
          {error && (
            <p className="text-xs text-red-500">{error}</p>
          )}
          {!error && hint && (
            <p className="text-xs text-gray-400">{hint}</p>
          )}
        </div>
        {counter && maxLength && (
          <p className={cn(
            'text-xs shrink-0',
            val.length >= maxLength ? 'text-red-500' : 'text-gray-300'
          )}>
            {val.length}/{maxLength}
          </p>
        )}
      </div>
    </div>
  )
})

FormInput.displayName = 'FormInput'
export default FormInput