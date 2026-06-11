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
import FormInput from '@/components/ui/form-input'
import FormSelect from '@/components/ui/form-select'
import FormDate from '@/components/ui/form-date'
import FormAmount from '@/components/ui/form-amount'
import FormCheckbox from '@/components/ui/form-checkbox'

const fmt = (v: number) =>
  `S/. ${v.toLocaleString('es-PE', {
    minimumFractionDigits: 2, maximumFractionDigits: 2
  })}`

const METODOS = [
  { value: 'efectivo', label: 'Efectivo' },
  { value: 'yape', label: 'Yape' },
  { value: 'plin', label: 'Plin' },
  { value: 'transferencia', label: 'Transferencia' },
  { value: 'tarjeta_debito', label: 'Tarjeta débito' },
  { value: 'tarjeta_credito', label: 'Tarjeta crédito' },
  { value: 'cheque', label: 'Cheque' },
]

const MESES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
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

  const erroresCaja = {
    monto: (() => {
      if (!form.monto) return 'El monto es obligatorio'
      const n = parseFloat(form.monto)
      if (isNaN(n) || n <= 0) return 'El monto debe ser mayor a 0'
      if (n > 9_999_999.99) return 'El monto no puede superar S/. 9,999,999.99'
      if (!/^\d+(\.\d{1,2})?$/.test(form.monto)) return 'Solo 2 decimales'
      return null
    })(),
    descripcion: (() => {
      if (!form.descripcion) return 'La descripción es obligatoria'
      if (form.descripcion.length > 300) return 'Máximo 300 caracteres'
      return null
    })(),
    numeroDocumento: (() => {
      if (form.numeroDocumento && form.numeroDocumento.length > 20)
        return 'Máximo 20 caracteres'
      return null
    })(),
  }

  const cajaValido = !Object.values(erroresCaja).some(Boolean)
  const [touchedCaja, setTouchedCaja] = useState<Record<string, boolean>>({})

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
        <div className="w-36">
          <FormSelect
            value={mes.toString()}
            onChange={v => setMes(Number(v))}
            options={MESES.map((m, i) => ({
              value: (i + 1).toString(),
              label: m
            }))}
          />
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
            {/* Encabezado — oculto en mobile */}
            <div className="hidden sm:grid grid-cols-12 px-4 py-2.5 bg-gray-50
  text-xs font-medium text-gray-400">
              <div className="col-span-1">Tipo</div>
              <div className="col-span-4">Descripción</div>
              <div className="col-span-2">Fecha</div>
              <div className="col-span-2">Método</div>
              <div className="col-span-3 text-right">Monto</div>
            </div>

            {data.items.map((m) => (
              <div key={m.id}
                className="px-4 py-3 hover:bg-gray-50 transition-colors">

                {/* Vista mobile */}
                <div className="flex items-start justify-between sm:hidden">
                  <div className="flex items-start gap-2.5">
                    <span className={cn(
                      'inline-flex items-center justify-center w-6 h-6 rounded-full mt-0.5 shrink-0',
                      m.tipo === 'ingreso' ? 'bg-green-100' : 'bg-red-100'
                    )}>
                      {m.tipo === 'ingreso'
                        ? <TrendingUp className="w-3 h-3 text-green-600" />
                        : <TrendingDown className="w-3 h-3 text-red-500" />}
                    </span>
                    <div>
                      <p className="text-xs font-medium text-gray-800">
                        {m.descripcion}
                      </p>
                      <p className="text-[10px] text-gray-400 mt-0.5">
                        {new Date(m.fechaMovimiento + 'T00:00:00')
                          .toLocaleDateString('es-PE', {
                            day: '2-digit', month: 'short', year: '2-digit'
                          })} · {m.metodoPago.replace('_', ' ')}
                      </p>
                    </div>
                  </div>
                  <p className={cn('text-xs font-medium shrink-0 ml-2',
                    m.tipo === 'ingreso' ? 'text-green-700' : 'text-red-600')}>
                    {m.tipo === 'ingreso' ? '+' : '-'}{fmt(m.monto)}
                  </p>
                </div>

                {/* Vista desktop */}
                <div className="hidden sm:grid grid-cols-12 items-center">
                  <div className="col-span-1">
                    <span className={cn(
                      'inline-flex items-center justify-center w-6 h-6 rounded-full',
                      m.tipo === 'ingreso' ? 'bg-green-100' : 'bg-red-100'
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
                      <p className="text-[10px] text-gray-400 mt-0.5">{m.nombreArea}</p>
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
                      m.tipo === 'ingreso' ? 'text-green-700' : 'text-red-600')}>
                      {m.tipo === 'ingreso' ? '+' : '-'}{fmt(m.monto)}
                    </p>
                    {m.tieneIgv && (
                      <p className="text-[10px] text-gray-400 mt-0.5">
                        IGV {fmt(m.igvMonto)}
                      </p>
                    )}
                  </div>
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

              {/* Tipo */}
              <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-0.5 w-fit">
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
              <FormAmount
                label="Monto"
                required
                value={form.monto}
                onChange={v => setForm(f => ({ ...f, monto: v }))}
                onBlur={() => setTouchedCaja(t => ({ ...t, monto: true }))}
                error={touchedCaja.monto ? erroresCaja.monto : null}
              />

              {/* Descripción */}
              <FormInput
                label="Descripción"
                required
                placeholder="Ej: Pago consulta médica"
                value={form.descripcion}
                maxLength={300}
                counter
                onChange={e => setForm(f => ({ ...f, descripcion: e.target.value }))}
                onBlur={() => setTouchedCaja(t => ({ ...t, descripcion: true }))}
                error={touchedCaja.descripcion ? erroresCaja.descripcion : null}
              />

              {/* Fecha y método */}
              <div className="grid grid-cols-2 gap-3">
                <FormDate
                  label="Fecha"
                  value={form.fechaMovimiento}
                  onChange={v => setForm(f => ({ ...f, fechaMovimiento: v }))}
                />
                <FormSelect
                  label="Método de pago"
                  value={form.metodoPago}
                  onChange={v => setForm(f => ({ ...f, metodoPago: v }))}
                  options={METODOS}
                />
              </div>

              {/* Número documento */}
              <FormInput
                label="N° de documento"
                placeholder="Ej: F001-00123"
                value={form.numeroDocumento}
                maxLength={20}
                counter
                onChange={e => setForm(f =>
                  ({ ...f, numeroDocumento: e.target.value }))}
                onBlur={() => setTouchedCaja(t => ({ ...t, numeroDocumento: true }))}
                error={touchedCaja.numeroDocumento ? erroresCaja.numeroDocumento : null}
                hint="Opcional"
              />

              {/* IGV */}
              <FormCheckbox
                label="Incluye IGV (18%)"
                description="El IGV ya está incluido en el monto ingresado"
                checked={form.tieneIgv}
                onChange={v => setForm(f => ({ ...f, tieneIgv: v }))}
              />

              {error && (
                <p className="text-xs text-red-600 bg-red-50 px-3 py-2 rounded-lg">
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
                disabled={guardando || !cajaValido}
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
                  <><Loader2 className="w-3.5 h-3.5 animate-spin" />Guardando...</>
                ) : (
                  <><Check className="w-3.5 h-3.5" />Guardar {form.tipo}</>
                )}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  )
}