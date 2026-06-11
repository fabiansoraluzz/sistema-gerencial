'use client'

import { useState, useRef, useEffect } from 'react'
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FormDateProps {
  label?: string
  value: string
  onChange: (value: string) => void
  error?: string | null
  required?: boolean
  disabled?: boolean
  min?: string
  max?: string
}

const MESES = [
  'Enero','Febrero','Marzo','Abril','Mayo','Junio',
  'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'
]
const DIAS = ['Do','Lu','Ma','Mi','Ju','Vi','Sa']

function parseDate(str: string): Date | null {
  if (!str) return null
  const [y, m, d] = str.split('-').map(Number)
  return new Date(y, m - 1, d)
}

function toStr(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function formatDisplay(str: string): string {
  if (!str) return ''
  const d = parseDate(str)
  if (!d) return str
  return d.toLocaleDateString('es-PE', {
    day: '2-digit', month: 'short', year: 'numeric'
  })
}

export default function FormDate({
  label,
  value,
  onChange,
  error,
  required,
  disabled,
  min,
  max,
}: FormDateProps) {
  const [open, setOpen] = useState(false)
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 })
  const buttonRef = useRef<HTMLButtonElement>(null)
  const calendarRef = useRef<HTMLDivElement>(null)
  const today = new Date()

  const current = parseDate(value) ?? today
  const [viewYear, setViewYear] = useState(current.getFullYear())
  const [viewMonth, setViewMonth] = useState(current.getMonth())

  // Cerrar al hacer click fuera
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Cerrar al hacer scroll
  useEffect(() => {
    if (!open) return
    const handler = () => setOpen(false)
    window.addEventListener('scroll', handler, true)
    return () => window.removeEventListener('scroll', handler, true)
  }, [open])

  const handleOpen = () => {
    if (disabled) return
    if (!open && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      const calH = 320
      const spaceBelow = window.innerHeight - rect.bottom
      const top = spaceBelow >= calH
        ? rect.bottom + 4
        : rect.top - calH - 4
      setCoords({
        top,
        left: rect.left,
        width: rect.width,
      })
    }
    setOpen(o => !o)
  }

  const getDias = () => {
    const first = new Date(viewYear, viewMonth, 1).getDay()
    const total = new Date(viewYear, viewMonth + 1, 0).getDate()
    const days: (number | null)[] = Array(first).fill(null)
    for (let i = 1; i <= total; i++) days.push(i)
    return days
  }

  const isSelected = (day: number) => {
    if (!value) return false
    const d = parseDate(value)
    return d?.getFullYear() === viewYear
      && d?.getMonth() === viewMonth
      && d?.getDate() === day
  }

  const isToday = (day: number) =>
    today.getFullYear() === viewYear
    && today.getMonth() === viewMonth
    && today.getDate() === day

  const isDisabled = (day: number) => {
    const str = toStr(new Date(viewYear, viewMonth, day))
    if (min && str < min) return true
    if (max && str > max) return true
    return false
  }

  const selectDay = (day: number) => {
    if (isDisabled(day)) return
    onChange(toStr(new Date(viewYear, viewMonth, day)))
    setOpen(false)
  }

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1) }
    else setViewMonth(m => m - 1)
  }

  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1) }
    else setViewMonth(m => m + 1)
  }

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-xs font-medium text-gray-700
          flex items-center gap-1">
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <button
        ref={buttonRef}
        type="button"
        disabled={disabled}
        onClick={handleOpen}
        className={cn(
          'w-full h-10 pl-3 pr-3 text-sm rounded-lg border bg-white',
          'flex items-center justify-between gap-2 text-left',
          'focus:outline-none focus:ring-2 focus:ring-[#1a3f7a]/20',
          'focus:border-[#1a3f7a] transition-all',
          'disabled:bg-gray-50 disabled:cursor-not-allowed',
          error
            ? 'border-red-300'
            : open
            ? 'border-[#1a3f7a] ring-2 ring-[#1a3f7a]/20'
            : 'border-gray-200 hover:border-gray-300'
        )}
      >
        <span className={cn(
          'text-sm',
          value ? 'text-gray-900' : 'text-gray-300'
        )}>
          {value ? formatDisplay(value) : 'Seleccionar fecha'}
        </span>
        <Calendar className="w-4 h-4 text-gray-400 shrink-0" />
      </button>

      {/* Calendario — renderizado en el portal via fixed */}
      {open && (
        <div
          ref={calendarRef}
          style={{
            position: 'fixed',
            top: coords.top,
            left: coords.left,
            width: Math.max(coords.width, 256),
            zIndex: 9999,
          }}
          className="bg-white border border-gray-200 rounded-xl
            shadow-xl p-3"
        >
          {/* Nav mes */}
          <div className="flex items-center justify-between mb-3">
            <button type="button" onClick={prevMonth}
              className="p-1.5 hover:bg-gray-100 rounded-lg
                transition-colors">
              <ChevronLeft className="w-4 h-4 text-gray-500" />
            </button>
            <p className="text-xs font-medium text-gray-800">
              {MESES[viewMonth]} {viewYear}
            </p>
            <button type="button" onClick={nextMonth}
              className="p-1.5 hover:bg-gray-100 rounded-lg
                transition-colors">
              <ChevronRight className="w-4 h-4 text-gray-500" />
            </button>
          </div>

          {/* Días semana */}
          <div className="grid grid-cols-7 mb-1">
            {DIAS.map(d => (
              <div key={d} className="text-center text-[10px]
                font-medium text-gray-400 py-1">
                {d}
              </div>
            ))}
          </div>

          {/* Días */}
          <div className="grid grid-cols-7 gap-0.5">
            {getDias().map((day, i) => (
              <div key={i}>
                {day === null ? <div /> : (
                  <button
                    type="button"
                    onClick={() => selectDay(day)}
                    disabled={isDisabled(day)}
                    className={cn(
                      'w-full aspect-square flex items-center',
                      'justify-center text-xs rounded-lg transition-colors',
                      isSelected(day)
                        ? 'bg-[#1a3f7a] text-white font-medium'
                        : isToday(day)
                        ? 'border border-[#1a3f7a] text-[#1a3f7a] font-medium'
                        : isDisabled(day)
                        ? 'text-gray-200 cursor-not-allowed'
                        : 'text-gray-700 hover:bg-gray-100'
                    )}
                  >
                    {day}
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Botón hoy */}
          <button
            type="button"
            onClick={() => {
              if (!isDisabled(today.getDate()) ||
                (today.getFullYear() === viewYear &&
                 today.getMonth() === viewMonth)) {
                onChange(toStr(today))
                setViewYear(today.getFullYear())
                setViewMonth(today.getMonth())
                setOpen(false)
              }
            }}
            className="mt-2 w-full text-xs text-[#1a3f7a] hover:bg-blue-50
              py-1.5 rounded-lg transition-colors font-medium"
          >
            Hoy
          </button>
        </div>
      )}

      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}