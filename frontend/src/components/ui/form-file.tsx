'use client'

import { useRef, useState } from 'react'
import { Upload, X, FileText, Image } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FormFileProps {
  label?: string
  accept?: string
  value?: File | null
  onChange: (file: File | null) => void
  error?: string | null
  hint?: string
  maxSizeMB?: number
}

export default function FormFile({
  label,
  accept = '.pdf,.jpg,.jpeg,.png',
  value,
  onChange,
  error,
  hint,
  maxSizeMB = 5,
}: FormFileProps) {
  const ref = useRef<HTMLInputElement>(null)
  const [dragOver, setDragOver] = useState(false)
  const [sizeError, setSizeError] = useState<string | null>(null)

  const handleFile = (file: File) => {
    if (file.size > maxSizeMB * 1024 * 1024) {
      setSizeError(`El archivo no puede superar ${maxSizeMB}MB`)
      return
    }
    setSizeError(null)
    onChange(file)
  }

  const isImage = value?.type.startsWith('image/')

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-xs font-medium text-gray-700">{label}</label>
      )}

      {value ? (
        <div className="flex items-center gap-3 p-3 border border-gray-200
          rounded-lg bg-gray-50">
          <div className="w-8 h-8 bg-white border border-gray-200 rounded-lg
            flex items-center justify-center shrink-0">
            {isImage
              ? <Image className="w-4 h-4 text-blue-500" />
              : <FileText className="w-4 h-4 text-gray-500" />}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-gray-800 truncate">
              {value.name}
            </p>
            <p className="text-[10px] text-gray-400 mt-0.5">
              {(value.size / 1024).toFixed(0)} KB
            </p>
          </div>
          <button
            type="button"
            onClick={() => onChange(null)}
            className="text-gray-400 hover:text-gray-700 transition-colors p-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <div
          onClick={() => ref.current?.click()}
          onDragOver={e => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={e => {
            e.preventDefault()
            setDragOver(false)
            const file = e.dataTransfer.files[0]
            if (file) handleFile(file)
          }}
          className={cn(
            'border-2 border-dashed rounded-lg p-5 flex flex-col',
            'items-center justify-center gap-2 cursor-pointer',
            'transition-colors',
            dragOver
              ? 'border-[#1a3f7a] bg-blue-50'
              : error || sizeError
              ? 'border-red-200 hover:border-red-300'
              : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
          )}
        >
          <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center
            justify-center">
            <Upload className="w-4 h-4 text-gray-400" />
          </div>
          <div className="text-center">
            <p className="text-xs font-medium text-gray-700">
              Arrastra el archivo o{' '}
              <span className="text-[#1a3f7a]">selecciona</span>
            </p>
            <p className="text-[10px] text-gray-400 mt-0.5">
              {accept.replace(/\./g, '').toUpperCase().replace(/,/g, ', ')}
              {' '}· Máx. {maxSizeMB}MB
            </p>
          </div>
          <input
            ref={ref}
            type="file"
            accept={accept}
            className="hidden"
            onChange={e => {
              const file = e.target.files?.[0]
              if (file) handleFile(file)
              e.target.value = ''
            }}
          />
        </div>
      )}

      {(error || sizeError) && (
        <p className="text-xs text-red-500">{sizeError ?? error}</p>
      )}
      {!error && !sizeError && hint && (
        <p className="text-xs text-gray-400">{hint}</p>
      )}
    </div>
  )
}