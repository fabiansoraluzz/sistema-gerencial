'use client'

import { useEffect, useState, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import {
  Plus, Minus, TrendingUp, TrendingDown,
  Wallet, X, Loader2, ChevronDown, Check
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { cajaService } from '@/services/cajaService'
import { MovimientoCajaDto, GetMovimientosResult } from '@/types/caja'

const fmt = (v: number) =>
  `S/. ${v.toLocaleString('es-PE', {
    minimumFractionDigits: 2, maximumFractionDigits: 2
  })}`

const METODOS = [
  { value: 'efectivo',        label: 'Efectivo' },
  { value: 'yape',            label: 'Yape' },
  { value: 'plin',            label: 'Plin' },
  { value: 'transferencia',   label: 'Transferencia' },
  { value: 'tarjeta_debito',  label: 'Tarjeta débito' },
  { value: 'tarjeta_credito', label: 'Tarjeta crédito' },
  { value: 'cheque',          label: 'Cheque' },
]

const MESES = [
  'Enero','Febrero','Marzo','Abril','Mayo','Junio',
  'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'
]

interface FormData {
  tipo: 'ingreso' | 'egreso'
  monto: string
  descripcion: string
  fechaMovimiento: string
  metodoPago: string
  tieneIgv: boolean
  numeroDocumento: string
}

const formInicial = (tipo: 'ingreso' | 'egreso'): FormData => ({
  tipo,
  monto: '',
  descripcion: '',
  fechaMovimiento: new Date().toISOString().split('T')[0],
  metodoPago: 'efectivo',
  tieneIgv: false,
  numeroDocumento: '',
})

export default function CajaPage() {
  const searchParams = useSearchParams()
  const tipoParam = searchParams.get('tipo') as 'ingreso' | 'egreso' | null

  const now = new Date()
  const [mes, setMes] = useState(now.getMonth() + 1)
  const [anio] = useState(now.getFullYear())
  const [filtroTipo, setFiltroTipo] = useState<string>('')
  const [data, setData] = useState<GetMovimientosResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState<FormData>(
    formInicial(tipoParam ?? 'ingreso'))
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const cargar = useCallback(async () => {
    setLoading(true)
    try {
      const result = await cajaService.getMovimientos(
        filtroTipo || undefined, mes, anio)
      setData(result)
    } catch {
      setError('No se pudieron cargar los movimientos')
    } finally {
      setLoading(false)
    }
  }, [mes, anio, filtroTipo])

  useEffect(() => { cargar() }, [cargar])

  useEffect(() => {
    if (tipoParam) {
      setForm(formInicial(tipoParam))
      setModalOpen(true)
    }
  }, [tipoParam])

  const handleGuardar = async () => {
    if (!form.monto || !form.descripcion) return
    setGuardando(true)
    setError(null)
    try {
      await cajaService.crearMovimiento({
        tipo: form.tipo,
        monto: parseFloat(form.monto),
        descripcion: form.descripcion,
        fechaMovimiento: form.fechaMovimiento,
        metodoPago: form.metodoPago,
        tieneIgv: form.tieneIgv,
        numeroDocumento: form.numeroDocumento || null,
        cuentaBancariaId: null,
        categoriaId: null,
        areaId: null,
        referencia: null,
      })
      setModalOpen(false)
      setForm(formInicial('ingreso'))
      cargar()
    } catch {
      setError('No se pudo guardar el movimiento')
    } finally {
      setGuardando(false)
    }
  }

  return (
    <div className="space-y-5">

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-base font-medium text-gray-900">
            Caja y movimientos
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            {MESES[mes - 1]} {anio}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => { setForm(formInicial('ingreso')); setModalOpen(true) }}
            className="flex items-center gap-1.5 px-3 py-2 bg-[#1a3f7a]
              hover:bg-[#153468] text-white text-xs font-medium rounded-lg
              transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Ingreso
          </button>
          <button
            onClick={() => { setForm(formInicial('egreso')); setModalOpen(true) }}
            className="flex items-center gap-1.5 px-3 py-2 border
              border-gray-200 hover:bg-gray-50 text-gray-700 text-xs
              font-medium rounded-lg transition-colors"
          >
            <Minus className="w-3.5 h-3.5" />
            Egreso
          </button>
        </div>
      </div>

      {/* Resumen del mes */}
      {data && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-gray-500">Total ingresos</p>
              <TrendingUp className="w-4 h-4 text-gray-300" />
            </div>
            <p className="text-lg font-medium text-green-700">
              {fmt(data.totalIngresos)}
            </p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-gray-500">Total egresos</p>
              <TrendingDown className="w-4 h-4 text-gray-300" />
            </div>
            <p className="text-lg font-medium text-red-600">
              {fmt(data.totalEgresos)}
            </p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-gray-500">Saldo del mes</p>
              <Wallet className="w-4 h-4 text-gray-300" />
            </div>
            <p className={cn('text-lg font-medium',
              data.saldo >= 0 ? 'text-gray-900' : 'text-red-600')}>
              {fmt(data.saldo)}
            </p>
          </div>
        </div>
      )}

      {/* Filtros */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Mes */}
        <div className="relative">
          <select
            value={mes}
            onChange={e => setMes(Number(e.target.value))}
            className="appearance-none pl-3 pr-8 py-2 text-xs border
              border-gray-200 rounded-lg bg-white text-gray-700
              focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
          >
            {MESES.map((m, i) => (
              <option key={m} value={i + 1}>{m}</option>
            ))}
          </select>
          <ChevronDown className="w-3 h-3 text-gray-400 absolute right-2.5
            top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Tipo */}
        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-0.5">
          {[
            { value: '', label: 'Todos' },
            { value: 'ingreso', label: 'Ingresos' },
            { value: 'egreso', label: 'Egresos' },
          ].map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setFiltroTipo(value)}
              className={cn(
                'px-3 py-1.5 text-xs font-medium rounded-md transition-colors',
                filtroTipo === value
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Lista de movimientos */}
      <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
          </div>
        ) : !data || data.items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 gap-2">
            <Wallet className="w-8 h-8 text-gray-200" />
            <p className="text-sm text-gray-400">
              No hay movimientos en {MESES[mes - 1]}
            </p>
            <button
              onClick={() => { setForm(formInicial('ingreso')); setModalOpen(true) }}
              className="text-xs text-[#1a3f7a] hover:underline font-medium"
            >
              Registrar el primero
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {/* Encabezado tabla */}
            <div className="grid grid-cols-12 px-4 py-2.5 bg-gray-50
              text-xs font-medium text-gray-400">
              <div className="col-span-1">Tipo</div>
              <div className="col-span-4">Descripción</div>
              <div className="col-span-2">Fecha</div>
              <div className="col-span-2">Método</div>
              <div className="col-span-3 text-right">Monto</div>
            </div>
            {data.items.map((m) => (
              <div key={m.id}
                className="grid grid-cols-12 px-4 py-3 hover:bg-gray-50
                  transition-colors items-center">
                <div className="col-span-1">
                  <span className={cn(
                    'inline-flex items-center justify-center w-6 h-6 rounded-full',
                    m.tipo === 'ingreso'
                      ? 'bg-green-100' : 'bg-red-100'
                  )}>
                    {m.tipo === 'ingreso'
                      ? <TrendingUp className="w-3 h-3 text-green-600" />
                      : <TrendingDown className="w-3 h-3 text-red-500" />}
                  </span>
                </div>
                <div className="col-span-4">
                  <p className="text-xs font-medium text-gray-800 truncate">
                    {m.descripcion}
                  </p>
                  {m.nombreArea && (
                    <p className="text-[10px] text-gray-400 mt-0.5">
                      {m.nombreArea}
                    </p>
                  )}
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-gray-500">
                    {new Date(m.fechaMovimiento + 'T00:00:00')
                      .toLocaleDateString('es-PE', {
                        day: '2-digit', month: 'short'
                      })}
                  </p>
                </div>
                <div className="col-span-2">
                  <span className="text-[10px] text-gray-400 capitalize">
                    {m.metodoPago.replace('_', ' ')}
                  </span>
                </div>
                <div className="col-span-3 text-right">
                  <p className={cn('text-xs font-medium',
                    m.tipo === 'ingreso'
                      ? 'text-green-700' : 'text-red-600')}>
                    {m.tipo === 'ingreso' ? '+' : '-'}{fmt(m.monto)}
                  </p>
                  {m.tieneIgv && (
                    <p className="text-[10px] text-gray-400 mt-0.5">
                      IGV {fmt(m.igvMonto)}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center
          justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">

            {/* Header modal */}
            <div className="flex items-center justify-between px-5 py-4
              border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className={cn(
                  'w-7 h-7 rounded-lg flex items-center justify-center',
                  form.tipo === 'ingreso' ? 'bg-green-100' : 'bg-red-100'
                )}>
                  {form.tipo === 'ingreso'
                    ? <TrendingUp className="w-4 h-4 text-green-600" />
                    : <TrendingDown className="w-4 h-4 text-red-500" />}
                </div>
                <h3 className="text-sm font-medium text-gray-900">
                  Registrar {form.tipo}
                </h3>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Cuerpo modal */}
            <div className="px-5 py-4 space-y-4">

              {/* Tipo selector */}
              <div className="flex items-center gap-1 bg-gray-100
                rounded-lg p-0.5 w-fit">
                {(['ingreso', 'egreso'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setForm(f => ({ ...f, tipo: t }))}
                    className={cn(
                      'px-4 py-1.5 text-xs font-medium rounded-md',
                      'transition-colors capitalize',
                      form.tipo === t
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-500 hover:text-gray-700'
                    )}
                  >
                    {t}
                  </button>
                ))}
              </div>

              {/* Monto */}
              <div>
                <label className="text-xs font-medium text-gray-700
                  block mb-1.5">
                  Monto <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2
                    text-xs text-gray-400">
                    S/.
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={form.monto}
                    onChange={e => setForm(f =>
                      ({ ...f, monto: e.target.value }))}
                    className="w-full pl-9 pr-3 py-2.5 text-sm border
                      border-gray-200 rounded-lg focus:outline-none
                      focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Descripción */}
              <div>
                <label className="text-xs font-medium text-gray-700
                  block mb-1.5">
                  Descripción <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Ej: Pago consulta médica"
                  value={form.descripcion}
                  onChange={e => setForm(f =>
                    ({ ...f, descripcion: e.target.value }))}
                  className="w-full px-3 py-2.5 text-sm border border-gray-200
                    rounded-lg focus:outline-none focus:ring-2
                    focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Fecha y método */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-gray-700
                    block mb-1.5">
                    Fecha
                  </label>
                  <input
                    type="date"
                    value={form.fechaMovimiento}
                    onChange={e => setForm(f =>
                      ({ ...f, fechaMovimiento: e.target.value }))}
                    className="w-full px-3 py-2.5 text-sm border border-gray-200
                      rounded-lg focus:outline-none focus:ring-2
                      focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-700
                    block mb-1.5">
                    Método de pago
                  </label>
                  <div className="relative">
                    <select
                      value={form.metodoPago}
                      onChange={e => setForm(f =>
                        ({ ...f, metodoPago: e.target.value }))}
                      className="w-full appearance-none pl-3 pr-8 py-2.5
                        text-sm border border-gray-200 rounded-lg
                        focus:outline-none focus:ring-2 focus:ring-blue-500
                        bg-white cursor-pointer"
                    >
                      {METODOS.map(m => (
                        <option key={m.value} value={m.value}>
                          {m.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-gray-400
                      absolute right-2.5 top-1/2 -translate-y-1/2
                      pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Número de documento */}
              <div>
                <label className="text-xs font-medium text-gray-700
                  block mb-1.5">
                  N° de documento
                  <span className="text-gray-400 font-normal ml-1">
                    (opcional)
                  </span>
                </label>
                <input
                  type="text"
                  placeholder="Ej: F001-00123"
                  value={form.numeroDocumento}
                  onChange={e => setForm(f =>
                    ({ ...f, numeroDocumento: e.target.value }))}
                  className="w-full px-3 py-2.5 text-sm border border-gray-200
                    rounded-lg focus:outline-none focus:ring-2
                    focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* IGV */}
              <button
                type="button"
                onClick={() => setForm(f =>
                  ({ ...f, tieneIgv: !f.tieneIgv }))}
                className="flex items-center gap-2.5 text-xs text-gray-600
                  hover:text-gray-900 transition-colors"
              >
                <div className={cn(
                  'w-4 h-4 rounded border flex items-center justify-center',
                  'transition-colors',
                  form.tieneIgv
                    ? 'bg-[#1a3f7a] border-[#1a3f7a]'
                    : 'border-gray-300'
                )}>
                  {form.tieneIgv &&
                    <Check className="w-2.5 h-2.5 text-white" />}
                </div>
                Incluye IGV (18%)
              </button>

              {/* Error */}
              {error && (
                <p className="text-xs text-red-600 bg-red-50 px-3 py-2
                  rounded-lg">
                  {error}
                </p>
              )}
            </div>

            {/* Footer modal */}
            <div className="flex items-center justify-end gap-2 px-5 py-4
              border-t border-gray-100">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 text-xs font-medium text-gray-600
                  hover:text-gray-900 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleGuardar}
                disabled={guardando || !form.monto || !form.descripcion}
                className={cn(
                  'flex items-center gap-1.5 px-4 py-2 text-xs font-medium',
                  'rounded-lg transition-colors',
                  form.tipo === 'ingreso'
                    ? 'bg-[#1a3f7a] hover:bg-[#153468] text-white'
                    : 'bg-red-600 hover:bg-red-700 text-white',
                  'disabled:opacity-50 disabled:cursor-not-allowed'
                )}
              >
                {guardando ? (
                  <><Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Guardando...</>
                ) : (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    Guardar {form.tipo}
                  </>
                )}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  )
}