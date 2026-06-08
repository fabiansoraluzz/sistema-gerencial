export interface LoginRequest {
  email: string
  password: string
}

export interface UsuarioDto {
  id: string
  nombreCompleto: string
  email: string
  empresaId: string
  nombreEmpresa: string
}

export interface LoginResponse {
  accessToken: string
  refreshToken: string
  expiresAt: string
  usuario: UsuarioDto
}

export interface RefreshTokenRequest {
  refreshToken: string
}

export interface RefreshTokenResponse {
  accessToken: string
  refreshToken: string
  expiresAt: string
}