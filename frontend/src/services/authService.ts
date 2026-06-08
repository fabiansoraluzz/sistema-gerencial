import api from '@/lib/api'
import { LoginRequest, LoginResponse, RefreshTokenResponse } from '@/types/auth'

export const authService = {
  async login(data: LoginRequest): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>('/api/auth/login', data)
    return response.data
  },

  async refreshToken(refreshToken: string): Promise<RefreshTokenResponse> {
    const response = await api.post<RefreshTokenResponse>(
      '/api/auth/refresh-token',
      { refreshToken }
    )
    return response.data
  },

  async logout(refreshToken: string): Promise<void> {
    await api.post('/api/auth/logout', { refreshToken })
  },
}