import api from '@/lib/api'
import { GetMovimientosResult, CrearMovimientoRequest } from '@/types/caja'

export const cajaService = {
  async getMovimientos(
    tipo?: string,
    mes?: number,
    anio?: number,
    pagina = 1
  ): Promise<GetMovimientosResult> {
    const params = new URLSearchParams()
    if (tipo) params.append('tipo', tipo)
    if (mes) params.append('mes', mes.toString())
    if (anio) params.append('anio', anio.toString())
    params.append('pagina', pagina.toString())
    const response = await api.get<GetMovimientosResult>(
      `/api/caja?${params.toString()}`)
    return response.data
  },

  async crearMovimiento(data: CrearMovimientoRequest): Promise<{ id: string }> {
    const response = await api.post<{ id: string }>('/api/caja', data)
    return response.data
  },
}