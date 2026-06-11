import api from '@/lib/api'
import { GetCuentasPorPagarResult, CrearCxPRequest } from '@/types/cxp'

export const cxpService = {
  async getCuentas(
    estado?: string,
    pagina = 1
  ): Promise<GetCuentasPorPagarResult> {
    const params = new URLSearchParams()
    if (estado) params.append('estado', estado)
    params.append('pagina', pagina.toString())
    const response = await api.get<GetCuentasPorPagarResult>(
      `/api/cxp?${params.toString()}`)
    return response.data
  },

  async crearCuenta(data: CrearCxPRequest): Promise<{ id: string }> {
    const response = await api.post<{ id: string }>('/api/cxp', data)
    return response.data
  },
}