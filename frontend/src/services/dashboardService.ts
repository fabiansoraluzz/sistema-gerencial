import api from '@/lib/api'
import { DashboardData } from '@/types/dashboard'

export const dashboardService = {
  async getDashboard(): Promise<DashboardData> {
    const response = await api.get<DashboardData>('/api/dashboard')
    return response.data
  },
}