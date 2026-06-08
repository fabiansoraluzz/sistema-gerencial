import { create } from 'zustand'
import { UsuarioDto } from '@/types/auth'
import { authService } from '@/services/authService'

interface AuthState {
  usuario: UsuarioDto | null
  accessToken: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null

  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  clearError: () => void
  initAuth: () => void
}

export const useAuthStore = create<AuthState>((set, get) => ({
  usuario: null,
  accessToken: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  initAuth: () => {
    const token = localStorage.getItem('accessToken')
    const usuarioStr = localStorage.getItem('usuario')
    if (token && usuarioStr) {
      set({
        accessToken: token,
        usuario: JSON.parse(usuarioStr),
        isAuthenticated: true,
      })
    }
  },

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null })
    try {
      const response = await authService.login({ email, password })
      localStorage.setItem('accessToken', response.accessToken)
      localStorage.setItem('refreshToken', response.refreshToken)
      localStorage.setItem('usuario', JSON.stringify(response.usuario))
      set({
        accessToken: response.accessToken,
        usuario: response.usuario,
        isAuthenticated: true,
        isLoading: false,
      })
    } catch (error: any) {
      const mensaje =
        error.response?.data?.message || 'Credenciales incorrectas'
      set({ error: mensaje, isLoading: false })
    }
  },

  logout: async () => {
    const refreshToken = localStorage.getItem('refreshToken')
    if (refreshToken) {
      try {
        await authService.logout(refreshToken)
      } catch {}
    }
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('usuario')
    set({
      usuario: null,
      accessToken: null,
      isAuthenticated: false,
    })
  },

  clearError: () => set({ error: null }),
}))