'use client'

import { cn } from '@/lib/utils'

interface FormToggleProps {
  label: string
  description?: string
  checked: boolean
  onChange: (checked: boolean) => void
  disabled?: boolean
}

export default function FormToggle({
  label,
  description,
  checked,
  onChange,
  disabled,
}: FormToggleProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className="flex items-center justify-between gap-3 w-full
        disabled:cursor-not-allowed disabled:opacity-50"
    >
      <div className="text-left">
        <p className="text-xs font-medium text-gray-700">{label}</p>
        {description && (
          <p className="text-xs text-gray-400 mt-0.5">{description}</p>
        )}
      </div>
      <div className={cn(
        'w-9 h-5 rounded-full transition-colors shrink-0 relative',
        checked ? 'bg-[#1a3f7a]' : 'bg-gray-200'
      )}>
        <div className={cn(
          'absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm',
          'transition-transform duration-150',
          checked ? 'translate-x-4' : 'translate-x-0.5'
        )} />
      </div>
    </button>
  )
}