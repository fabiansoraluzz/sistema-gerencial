export interface CuentaPorCobrarDto {
  id: string
  nombreContacto: string
  tipoContacto: string
  concepto: string
  montoTotal: number
  montoCobrado: number
  montoPendiente: number
  fechaEmision: string
  fechaVencimiento: string
  estado: string
  numeroDocumento: string | null
  diasVencimiento: number
  creadoEn: string
}

export interface GetCuentasPorCobrarResult {
  items: CuentaPorCobrarDto[]
  total: number
  totalPendiente: number
  totalVencido: number
  totalCobrado: number
}

export interface CrearCxCRequest {
  nombreContacto: string
  tipoContacto: string
  concepto: string
  montoTotal: number
  fechaEmision: string
  fechaVencimiento: string
  numeroDocumento: string | null
  tieneIgv: boolean
}