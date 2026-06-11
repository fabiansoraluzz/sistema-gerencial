export interface MovimientoMensual {
  mes: string
  totalIngresos: number
  totalEgresos: number
}

export interface AlertaDashboard {
  tipo: 'danger' | 'warning' | 'info'
  mensaje: string
  modulo: string
}

export interface DashboardData {
  cajaDisponible: number
  totalPorCobrar: number
  totalPorPagar: number
  utilidadDelMes: number
  cajaVariacionPorcentaje: number
  cobrarVariacionPorcentaje: number
  pagarVariacionPorcentaje: number
  utilidadVariacionPorcentaje: number
  movimientosMensuales: MovimientoMensual[]
  alertas: AlertaDashboard[]
}