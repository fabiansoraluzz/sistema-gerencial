export interface MovimientoCajaDto {
  id: string
  tipo: 'ingreso' | 'egreso'
  monto: number
  descripcion: string
  fechaMovimiento: string
  metodoPago: string
  nombreArea: string | null
  nombreCategoria: string | null
  numeroDocumento: string | null
  tieneIgv: boolean
  igvMonto: number
  creadoEn: string
}

export interface GetMovimientosResult {
  items: MovimientoCajaDto[]
  total: number
  totalIngresos: number
  totalEgresos: number
  saldo: number
}

export interface CrearMovimientoRequest {
  tipo: string
  monto: number
  descripcion: string
  fechaMovimiento: string
  metodoPago: string
  cuentaBancariaId: string | null
  categoriaId: string | null
  areaId: string | null
  numeroDocumento: string | null
  referencia: string | null
  tieneIgv: boolean
}