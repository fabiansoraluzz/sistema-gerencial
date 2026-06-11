'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Wallet, TrendingUp, TrendingDown, DollarSign,
  AlertCircle, Clock, Info, ArrowUpRight,
  ArrowDownRight, Minus, Plus, BarChart2
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { dashboardService } from '@/services/dashboardService'
import { DashboardData } from '@/types/dashboard'

const fmt = (v: number) =>
  `S/. ${v.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

export default function DashboardPage() {
  const router = useRouter()
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    dashboardService.getDashboard()
      .then(setData)
      .catch(() => setError('No se pudo cargar el dashboard'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <div className="w-6 h-6 border-2 border-blue-700 border-t-transparent
            rounded-full animate-spin" />
          <p className="text-sm text-gray-400">Cargando datos financieros...</p>
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-sm text-red-500">{error}</p>
      </div>
    )
  }

  const kpis = [
    {
      titulo: 'Caja disponible',
      monto: fmt(data.cajaDisponible),
      variacion: data.cajaVariacionPorcentaje,
      icon: Wallet,
      href: '/dashboard/caja',
    },
    {
      titulo: 'Por cobrar',
      monto: fmt(data.totalPorCobrar),
      variacion: data.cobrarVariacionPorcentaje,
      icon: TrendingUp,
      href: '/dashboard/cobrar',
    },
    {
      titulo: 'Por pagar',
      monto: fmt(data.totalPorPagar),
      variacion: data.pagarVariacionPorcentaje,
      icon: TrendingDown,
      href: '/dashboard/pagar',
    },
    {
      titulo: 'Ganancia del mes',
      monto: fmt(data.utilidadDelMes),
      variacion: data.utilidadVariacionPorcentaje,
      icon: DollarSign,
      href: '/dashboard/reportes',
    },
  ]

  const maxVal = Math.max(
    ...data.movimientosMensuales.map(m =>
      Math.max(m.totalIngresos, m.totalEgresos)), 1)

  const sinMovimientos = data.movimientosMensuales.every(
    m => m.totalIngresos === 0 && m.totalEgresos === 0)

  return (
    <div className="space-y-6">

      {/* Acciones rápidas */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-base font-medium text-gray-900">
            Resumen financiero
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            {new Date().toLocaleDateString('es-PE', {
              weekday: 'long', day: 'numeric',
              month: 'long', year: 'numeric'
            })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => router.push('/dashboard/caja?tipo=ingreso')}
            className="flex items-center gap-1.5 px-3 py-2 bg-[#1a3f7a]
              hover:bg-[#153468] text-white text-xs font-medium rounded-lg
              transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Registrar ingreso
          </button>
          <button
            onClick={() => router.push('/dashboard/caja?tipo=egreso')}
            className="flex items-center gap-1.5 px-3 py-2 border
              border-gray-200 hover:bg-gray-50 text-gray-700 text-xs
              font-medium rounded-lg transition-colors"
          >
            <Minus className="w-3.5 h-3.5" />
            Registrar egreso
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
        {kpis.map(({ titulo, monto, variacion, icon: Icon, href }) => {
          const positivo = variacion > 0
          const neutro = variacion === 0
          return (
            <button
              key={titulo}
              onClick={() => router.push(href)}
              className="text-left bg-gray-50 hover:bg-gray-100 rounded-xl
                p-5 transition-colors group"
            >
              <div className="flex items-start justify-between mb-3">
                <p className="text-xs font-medium text-gray-500">{titulo}</p>
                <Icon className="w-4 h-4 text-gray-300
                  group-hover:text-gray-400 transition-colors" />
              </div>
              <p className="text-xl font-medium text-gray-900 mb-2">
                {monto}
              </p>
              <div className="flex items-center gap-1.5">
                {neutro ? (
                  <span className="inline-flex items-center gap-1 text-xs
                    font-medium px-1.5 py-0.5 rounded bg-gray-200
                    text-gray-500">
                    <Minus className="w-2.5 h-2.5" />
                    Sin cambio
                  </span>
                ) : positivo ? (
                  <span className="inline-flex items-center gap-1 text-xs
                    font-medium px-1.5 py-0.5 rounded bg-green-100
                    text-green-700">
                    <ArrowUpRight className="w-2.5 h-2.5" />
                    +{variacion}%
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs
                    font-medium px-1.5 py-0.5 rounded bg-red-100
                    text-red-600">
                    <ArrowDownRight className="w-2.5 h-2.5" />
                    {variacion}%
                  </span>
                )}
                <span className="text-xs text-gray-400">vs mes anterior</span>
              </div>
            </button>
          )
        })}
      </div>

      {/* Gráfico + Alertas */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">

        {/* Gráfico */}
        <div className="lg:col-span-3 bg-white border border-gray-100
          rounded-xl p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-sm font-medium text-gray-900">
                Ingresos vs egresos
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                Últimos 6 meses
              </p>
            </div>
            <BarChart2 className="w-4 h-4 text-gray-300" />
          </div>

          {sinMovimientos ? (
            <div className="h-44 flex flex-col items-center justify-center
              gap-2">
              <BarChart2 className="w-8 h-8 text-gray-200" />
              <p className="text-sm text-gray-400">
                Aún no hay movimientos registrados
              </p>
              <button
                onClick={() => router.push('/dashboard/caja?tipo=ingreso')}
                className="text-xs text-[#1a3f7a] hover:underline font-medium
                  mt-1"
              >
                Registrar el primer movimiento
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-end gap-2 h-44">
                {data.movimientosMensuales.map((m) => (
                  <div key={m.mes}
                    className="flex-1 flex flex-col items-center gap-1.5">
                    <div className="w-full flex items-end gap-0.5 h-36">
                      <div
                        className="flex-1 bg-[#1a3f7a] rounded-t"
                        style={{
                          height: `${(m.totalIngresos / maxVal) * 100}%`,
                          minHeight: m.totalIngresos > 0 ? '3px' : '0'
                        }}
                      />
                      <div
                        className="flex-1 bg-red-200 rounded-t"
                        style={{
                          height: `${(m.totalEgresos / maxVal) * 100}%`,
                          minHeight: m.totalEgresos > 0 ? '3px' : '0'
                        }}
                      />
                    </div>
                    <span className="text-xs text-gray-400">{m.mes}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-4 mt-4 pt-4
                border-t border-gray-50">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-sm bg-[#1a3f7a]" />
                  <span className="text-xs text-gray-400">Ingresos</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-sm bg-red-200" />
                  <span className="text-xs text-gray-400">Egresos</span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Alertas */}
        <div className="lg:col-span-2 bg-white border border-gray-100
          rounded-xl p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-sm font-medium text-gray-900">Alertas</p>
              <p className="text-xs text-gray-400 mt-0.5">
                Vencimientos próximos
              </p>
            </div>
            {data.alertas.length > 0 && (
              <span className="text-xs font-medium bg-red-50 text-red-600
                px-2 py-0.5 rounded-full">
                {data.alertas.length}
              </span>
            )}
          </div>

          {data.alertas.length === 0 ? (
            <div className="h-44 flex flex-col items-center justify-center
              gap-2">
              <div className="w-8 h-8 bg-green-50 rounded-full flex items-center
                justify-center">
                <Info className="w-4 h-4 text-green-500" />
              </div>
              <p className="text-sm text-gray-400 text-center">
                Sin alertas pendientes
              </p>
              <p className="text-xs text-gray-300 text-center">
                Todo al día
              </p>
            </div>
          ) : (
            <div className="space-y-2 overflow-y-auto max-h-52">
              {data.alertas.map((a, i) => (
                <div
                  key={i}
                  className={cn(
                    'flex items-start gap-2.5 p-3 rounded-lg border',
                    a.tipo === 'danger'
                      ? 'bg-red-50 border-red-100'
                      : a.tipo === 'warning'
                      ? 'bg-orange-50 border-orange-100'
                      : 'bg-blue-50 border-blue-100'
                  )}
                >
                  {a.tipo === 'danger' ? (
                    <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0
                      text-red-500" />
                  ) : a.tipo === 'warning' ? (
                    <Clock className="w-3.5 h-3.5 mt-0.5 shrink-0
                      text-orange-500" />
                  ) : (
                    <Info className="w-3.5 h-3.5 mt-0.5 shrink-0
                      text-blue-500" />
                  )}
                  <p className={cn('text-xs leading-relaxed',
                    a.tipo === 'danger' ? 'text-red-700' :
                    a.tipo === 'warning' ? 'text-orange-700' :
                    'text-blue-700'
                  )}>
                    {a.mensaje}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}