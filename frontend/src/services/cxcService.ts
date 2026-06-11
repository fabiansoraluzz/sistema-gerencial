import api from '@/lib/api'
import { GetCuentasPorCobrarResult, CrearCxCRequest } from '@/types/cxc'

export const cxcService = {
  async getCuentas(
    estado?: string,
    pagina = 1
  ): Promise<GetCuentasPorCobrarResult> {
    const params = new URLSearchParams()
    if (estado) params.append('estado', estado)
    params.append('pagina', pagina.toString())
    const response = await api.get<GetCuentasPorCobrarResult>(
      `/api/cxc?${params.toString()}`)
    return response.data
  },

  async crearCuenta(data: CrearCxCRequest): Promise<{ id: string }> {
    const response = await api.post<{ id: string }>('/api/cxc', data)
    return response.data
  },
}