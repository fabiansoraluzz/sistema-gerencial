'use client'

import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FormCheckboxProps {
  label: string
  description?: string
  checked: boolean
  onChange: (checked: boolean) => void
  disabled?: boolean
}

export default function FormCheckbox({
  label,
  description,
  checked,
  onChange,
  disabled,
}: FormCheckboxProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        'flex items-start gap-2.5 text-left w-full',
        'disabled:cursor-not-allowed disabled:opacity-50'
      )}
    >
      <div className={cn(
        'w-4 h-4 rounded border-1.5 flex items-center justify-center',
        'shrink-0 mt-0.5 transition-all',
        checked
          ? 'bg-[#1a3f7a] border-[#1a3f7a]'
          : 'border-gray-300 bg-white hover:border-gray-400'
      )}
        style={{ border: checked ? 'none' : '1.5px solid' }}
      >
        {checked && <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />}
      </div>
      <div>
        <p className="text-xs font-medium text-gray-700">{label}</p>
        {description && (
          <p className="text-xs text-gray-400 mt-0.5">{description}</p>
        )}
      </div>
    </button>
  )
}