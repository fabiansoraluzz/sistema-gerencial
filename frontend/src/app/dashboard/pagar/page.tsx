'use client'

import { useEffect, useState, useCallback } from 'react'
import {
  Plus, TrendingDown, AlertCircle, Clock,
  CheckCircle, X, Loader2, Check
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { cxpService } from '@/services/cxpService'
import { CuentaPorPagarDto, GetCuentasPorPagarResult } from '@/types/cxp'
import FormInput from '@/components/ui/form-input'
import FormSelect from '@/components/ui/form-select'
import FormDate from '@/components/ui/form-date'
import FormAmount from '@/components/ui/form-amount'
import FormCheckbox from '@/components/ui/form-checkbox'

const fmt = (v: number) =>
  `S/. ${v.toLocaleString('es-PE', {
    minimumFractionDigits: 2, maximumFractionDigits: 2
  })}`

const TIPOS_CONTACTO = [
  { value: 'proveedor', label: 'Proveedor' },
  { value: 'empresa',   label: 'Empresa' },
  { value: 'persona',   label: 'Persona' },
  { value: 'otro',      label: 'Otro' },
]

const ESTADOS: Record<string, {
  label: string
  color: string
  icon: typeof AlertCircle
}> = {
  pendiente: {
    label: 'Pendiente',
    color: 'bg-blue-50 text-blue-700',
    icon: Clock,
  },
  parcial: {
    label: 'Pago parcial',
    color: 'bg-orange-50 text-orange-700',
    icon: TrendingDown,
  },
  vencido: {
    label: 'Vencido',
    color: 'bg-red-50 text-red-700',
    icon: AlertCircle,
  },
  pagado: {
    label: 'Pagado',
    color: 'bg-green-50 text-green-700',
    icon: CheckCircle,
  },
}

interface FormData {
  nombreContacto: string
  tipoContacto: string
  concepto: string
  montoTotal: string
  fechaEmision: string
  fechaVencimiento: string
  numeroDocumento: string
  tieneIgv: boolean
}

const hoy = new Date().toISOString().split('T')[0]
const en30dias = new Date(Date.now() + 30 * 86400000)
  .toISOString().split('T')[0]

const formInicial: FormData = {
  nombreContacto: '',
  tipoContacto: 'proveedor',
  concepto: '',
  montoTotal: '',
  fechaEmision: hoy,
  fechaVencimiento: en30dias,
  numeroDocumento: '',
  tieneIgv: false,
}

export default function CxPPage() {
  const [filtroEstado, setFiltroEstado] = useState('')
  const [data, setData] = useState<GetCuentasPorPagarResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState<FormData>(formInicial)
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [touchedCxP, setTouchedCxP] =
    useState<Record<string, boolean>>({})

  const erroresCxP = {
    nombreContacto: (() => {
      if (!form.nombreContacto) return 'El nombre es obligatorio'
      if (form.nombreContacto.length > 50) return 'Máximo 50 caracteres'
      return null
    })(),
    concepto: (() => {
      if (!form.concepto) return 'El concepto es obligatorio'
      if (form.concepto.length > 300) return 'Máximo 300 caracteres'
      return null
    })(),
    montoTotal: (() => {
      if (!form.montoTotal) return 'El monto es obligatorio'
      const n = parseFloat(form.montoTotal)
      if (isNaN(n) || n <= 0) return 'El monto debe ser mayor a 0'
      if (n > 9_999_999.99)
        return 'El monto no puede superar S/. 9,999,999.99'
      return null
    })(),
    fechas: (() => {
      if (form.fechaVencimiento < form.fechaEmision)
        return 'El vencimiento debe ser igual o posterior a la emisión'
      return null
    })(),
    numeroDocumento: (() => {
      if (form.numeroDocumento && form.numeroDocumento.length > 20)
        return 'Máximo 20 caracteres'
      return null
    })(),
  }

  const cxpValido = !Object.values(erroresCxP).some(Boolean)

  const cargar = useCallback(async () => {
    setLoading(true)
    try {
      const result = await cxpService.getCuentas(
        filtroEstado || undefined)
      setData(result)
    } catch {
      setError('No se pudieron cargar las cuentas')
    } finally {
      setLoading(false)
    }
  }, [filtroEstado])

  useEffect(() => { cargar() }, [cargar])

  const handleGuardar = async () => {
    if (!cxpValido) return
    setGuardando(true)
    setError(null)
    try {
      await cxpService.crearCuenta({
        nombreContacto:   form.nombreContacto,
        tipoContacto:     form.tipoContacto,
        concepto:         form.concepto,
        montoTotal:       parseFloat(form.montoTotal),
        fechaEmision:     form.fechaEmision,
        fechaVencimiento: form.fechaVencimiento,
        numeroDocumento:  form.numeroDocumento || null,
        tieneIgv:         form.tieneIgv,
      })
      setModalOpen(false)
      setForm(formInicial)
      setTouchedCxP({})
      cargar()
    } catch {
      setError('No se pudo guardar la cuenta')
    } finally {
      setGuardando(false)
    }
  }

  const etiquetaDias = (dias: number, estado: string) => {
    if (estado === 'pagado') return null
    if (dias < 0)   return `Vencida hace ${Math.abs(dias)} días`
    if (dias === 0) return 'Vence hoy'
    if (dias <= 7)  return `Vence en ${dias} días`
    return null
  }

  return (
    <div className="space-y-5">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center
        justify-between gap-3">
        <div>
          <h2 className="text-base font-medium text-gray-900">
            Cuentas por pagar
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Lo que la clínica debe a proveedores y terceros
          </p>
        </div>
        <button
          onClick={() => {
            setForm(formInicial)
            setTouchedCxP({})
            setModalOpen(true)
          }}
          className="flex items-center gap-1.5 px-3 py-2 bg-[#1a3f7a]
            hover:bg-[#153468] text-white text-xs font-medium rounded-lg
            transition-colors w-fit"
        >
          <Plus className="w-3.5 h-3.5" />
          Nueva cuenta
        </button>
      </div>

      {/* Resumen */}
      {data && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-gray-500">Total pendiente</p>
              <Clock className="w-4 h-4 text-gray-300" />
            </div>
            <p className="text-lg font-medium text-gray-900">
              {fmt(data.totalPendiente)}
            </p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-gray-500">Total vencido</p>
              <AlertCircle className="w-4 h-4 text-gray-300" />
            </div>
            <p className={cn('text-lg font-medium',
              data.totalVencido > 0 ? 'text-red-600' : 'text-gray-900')}>
              {fmt(data.totalVencido)}
            </p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-gray-500">Total pagado</p>
              <CheckCircle className="w-4 h-4 text-gray-300" />
            </div>
            <p className="text-lg font-medium text-green-700">
              {fmt(data.totalPagado)}
            </p>
          </div>
        </div>
      )}

      {/* Filtros */}
      <div className="flex items-center gap-1 bg-gray-100 rounded-lg
        p-0.5 w-fit">
        {[
          { value: '',          label: 'Todas' },
          { value: 'pendiente', label: 'Pendientes' },
          { value: 'vencido',   label: 'Vencidas' },
          { value: 'pagado',    label: 'Pagadas' },
        ].map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setFiltroEstado(value)}
            className={cn(
              'px-3 py-1.5 text-xs font-medium rounded-md transition-colors',
              filtroEstado === value
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Lista */}
      <div className="bg-white border border-gray-100 rounded-xl
        overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
          </div>
        ) : !data || data.items.length === 0 ? (
          <div className="flex flex-col items-center justify-center
            h-48 gap-2">
            <TrendingDown className="w-8 h-8 text-gray-200" />
            <p className="text-sm text-gray-400">
              No hay cuentas por pagar
            </p>
            <button
              onClick={() => {
                setForm(formInicial)
                setTouchedCxP({})
                setModalOpen(true)
              }}
              className="text-xs text-[#1a3f7a] hover:underline font-medium"
            >
              Registrar la primera
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">

            {/* Encabezado desktop */}
            <div className="hidden sm:grid grid-cols-12 px-4 py-2.5
              bg-gray-50 text-xs font-medium text-gray-400">
              <div className="col-span-3">Proveedor</div>
              <div className="col-span-3">Concepto</div>
              <div className="col-span-2">Vencimiento</div>
              <div className="col-span-2">Estado</div>
              <div className="col-span-2 text-right">Pendiente</div>
            </div>

            {data.items.map((c) => {
              const estado = ESTADOS[c.estado] ?? ESTADOS.pendiente
              const Icon = estado.icon
              const etiqueta = etiquetaDias(c.diasVencimiento, c.estado)
              return (
                <div key={c.id}
                  className="px-4 py-3 hover:bg-gray-50 transition-colors">

                  {/* Vista mobile */}
                  <div className="flex items-start justify-between sm:hidden">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-xs font-medium text-gray-800
                          truncate">
                          {c.nombreContacto}
                        </p>
                        <span className={cn(
                          'inline-flex items-center gap-1 text-[10px]',
                          'font-medium px-1.5 py-0.5 rounded-full shrink-0',
                          estado.color
                        )}>
                          <Icon className="w-2.5 h-2.5" />
                          {estado.label}
                        </span>
                      </div>
                      <p className="text-[10px] text-gray-500 truncate">
                        {c.concepto}
                      </p>
                      <p className="text-[10px] text-gray-400 mt-0.5">
                        Vence: {new Date(c.fechaVencimiento + 'T00:00:00')
                          .toLocaleDateString('es-PE', {
                            day: '2-digit', month: 'short', year: '2-digit'
                          })}
                        {etiqueta && (
                          <span className={cn('ml-1 font-medium',
                            c.diasVencimiento < 0
                              ? 'text-red-500' : 'text-orange-500')}>
                            · {etiqueta}
                          </span>
                        )}
                      </p>
                    </div>
                    <div className="ml-3 text-right shrink-0">
                      <p className="text-xs font-medium text-gray-800">
                        {fmt(c.montoPendiente)}
                      </p>
                      {c.montoPagado > 0 && (
                        <p className="text-[10px] text-green-600 mt-0.5">
                          Pagado {fmt(c.montoPagado)}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Vista desktop */}
                  <div className="hidden sm:grid grid-cols-12 items-center">
                    <div className="col-span-3">
                      <p className="text-xs font-medium text-gray-800
                        truncate">
                        {c.nombreContacto}
                      </p>
                      <p className="text-[10px] text-gray-400 mt-0.5
                        capitalize">
                        {c.tipoContacto}
                      </p>
                    </div>
                    <div className="col-span-3">
                      <p className="text-xs text-gray-600 truncate">
                        {c.concepto}
                      </p>
                      {c.numeroDocumento && (
                        <p className="text-[10px] text-gray-400 mt-0.5">
                          {c.numeroDocumento}
                        </p>
                      )}
                    </div>
                    <div className="col-span-2">
                      <p className="text-xs text-gray-500">
                        {new Date(c.fechaVencimiento + 'T00:00:00')
                          .toLocaleDateString('es-PE', {
                            day: '2-digit', month: 'short', year: '2-digit'
                          })}
                      </p>
                      {etiqueta && (
                        <p className={cn('text-[10px] mt-0.5 font-medium',
                          c.diasVencimiento < 0
                            ? 'text-red-500' : 'text-orange-500')}>
                          {etiqueta}
                        </p>
                      )}
                    </div>
                    <div className="col-span-2">
                      <span className={cn(
                        'inline-flex items-center gap-1 text-[10px]',
                        'font-medium px-2 py-0.5 rounded-full',
                        estado.color
                      )}>
                        <Icon className="w-2.5 h-2.5" />
                        {estado.label}
                      </span>
                    </div>
                    <div className="col-span-2 text-right">
                      <p className="text-xs font-medium text-gray-800">
                        {fmt(c.montoPendiente)}
                      </p>
                      {c.montoPagado > 0 && (
                        <p className="text-[10px] text-green-600 mt-0.5">
                          Pagado {fmt(c.montoPagado)}
                        </p>
                      )}
                    </div>
                  </div>

                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center
          justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl
            max-h-[90vh] overflow-y-auto">

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4
              border-b border-gray-100 sticky top-0 bg-white rounded-t-2xl">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-red-50 flex items-center
                  justify-center">
                  <TrendingDown className="w-4 h-4 text-red-500" />
                </div>
                <h3 className="text-sm font-medium text-gray-900">
                  Nueva cuenta por pagar
                </h3>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Cuerpo */}
            <div className="px-5 py-4 space-y-4">

              {/* Proveedor */}
              <div className="grid grid-cols-2 gap-3">
                <FormInput
                  label="Proveedor"
                  required
                  placeholder="Ej: Medisur S.A."
                  value={form.nombreContacto}
                  maxLength={50}
                  counter
                  onChange={e => setForm(f =>
                    ({ ...f, nombreContacto: e.target.value }))}
                  onBlur={() => setTouchedCxP(t =>
                    ({ ...t, nombreContacto: true }))}
                  error={touchedCxP.nombreContacto
                    ? erroresCxP.nombreContacto : null}
                />
                <FormSelect
                  label="Tipo"
                  value={form.tipoContacto}
                  onChange={v => setForm(f => ({ ...f, tipoContacto: v }))}
                  options={TIPOS_CONTACTO}
                />
              </div>

              {/* Concepto */}
              <FormInput
                label="Concepto"
                required
                placeholder="Ej: Insumos médicos enero"
                value={form.concepto}
                maxLength={300}
                counter
                onChange={e => setForm(f =>
                  ({ ...f, concepto: e.target.value }))}
                onBlur={() => setTouchedCxP(t =>
                  ({ ...t, concepto: true }))}
                error={touchedCxP.concepto ? erroresCxP.concepto : null}
              />

              {/* Monto */}
              <FormAmount
                label="Monto total"
                required
                value={form.montoTotal}
                onChange={v => setForm(f => ({ ...f, montoTotal: v }))}
                onBlur={() => setTouchedCxP(t =>
                  ({ ...t, montoTotal: true }))}
                error={touchedCxP.montoTotal ? erroresCxP.montoTotal : null}
              />

              {/* Fechas */}
              <div className="grid grid-cols-2 gap-3">
                <FormDate
                  label="Fecha emisión"
                  value={form.fechaEmision}
                  onChange={v => setForm(f => ({ ...f, fechaEmision: v }))}
                />
                <FormDate
                  label="Fecha vencimiento"
                  value={form.fechaVencimiento}
                  min={form.fechaEmision}
                  onChange={v => {
                    setForm(f => ({ ...f, fechaVencimiento: v }))
                    setTouchedCxP(t => ({ ...t, fechas: true }))
                  }}
                  error={touchedCxP.fechas ? erroresCxP.fechas : null}
                />
              </div>
              {touchedCxP.fechas && erroresCxP.fechas && (
                <p className="text-xs text-red-500 -mt-2">
                  {erroresCxP.fechas}
                </p>
              )}

              {/* Número documento */}
              <FormInput
                label="N° de documento"
                placeholder="Ej: F001-00123"
                value={form.numeroDocumento}
                maxLength={20}
                counter
                onChange={e => setForm(f =>
                  ({ ...f, numeroDocumento: e.target.value }))}
                onBlur={() => setTouchedCxP(t =>
                  ({ ...t, numeroDocumento: true }))}
                error={touchedCxP.numeroDocumento
                  ? erroresCxP.numeroDocumento : null}
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
                <p className="text-xs text-red-600 bg-red-50 px-3 py-2
                  rounded-lg">
                  {error}
                </p>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-2 px-5 py-4
              border-t border-gray-100 sticky bottom-0 bg-white rounded-b-2xl">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 text-xs font-medium text-gray-600
                  hover:text-gray-900 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleGuardar}
                disabled={guardando || !cxpValido}
                className="flex items-center gap-1.5 px-4 py-2 text-xs
                  font-medium bg-[#1a3f7a] hover:bg-[#153468] text-white
                  rounded-lg transition-colors disabled:opacity-50
                  disabled:cursor-not-allowed"
              >
                {guardando ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    Guardar cuenta
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