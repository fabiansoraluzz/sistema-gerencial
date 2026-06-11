export interface CuentaPorPagarDto {
  id: string
  nombreContacto: string
  tipoContacto: string
  concepto: string
  montoTotal: number
  montoPagado: number
  montoPendiente: number
  fechaEmision: string
  fechaVencimiento: string
  estado: string
  numeroDocumento: string | null
  diasVencimiento: number
  creadoEn: string
}

export interface GetCuentasPorPagarResult {
  items: CuentaPorPagarDto[]
  total: number
  totalPendiente: number
  totalVencido: number
  totalPagado: number
}

export interface CrearCxPRequest {
  nombreContacto: string
  tipoContacto: string
  concepto: string
  montoTotal: number
  fechaEmision: string
  fechaVencimiento: string
  numeroDocumento: string | null
  tieneIgv: boolean
}