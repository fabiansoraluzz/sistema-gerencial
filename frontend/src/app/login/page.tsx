'use client'

import { cn } from '@/lib/utils'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import {
  Eye, EyeOff, Loader2, Activity,
  BarChart2, TrendingUp, Bell
} from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const { login, isLoading, error, isAuthenticated, clearError } = useAuthStore()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    if (isAuthenticated) router.push('/dashboard')
  }, [isAuthenticated, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    clearError()
    await login(email, password)
  }

  const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  const passwordValida = password.length >= 6
  const formularioValido = emailValido && passwordValida

  const [touched, setTouched] = useState({
    email: false,
    password: false
  })

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">

      {/* Panel izquierdo — oculto en mobile, visible en lg+ */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#0F1F3D] flex-col
      justify-between p-12 relative overflow-hidden">

        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-full h-full"
            style={{
              backgroundImage: `radial-gradient(circle at 2px 2px,
              white 1px, transparent 0)`,
              backgroundSize: '40px 40px'
            }} />
        </div>
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full
        bg-blue-600 opacity-10" />
        <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full
        bg-blue-400 opacity-10" />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center
          justify-center">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-white font-semibold text-lg leading-none">
              Sistema Gerencial
            </p>
            <p className="text-blue-300 text-xs mt-0.5">
              para Clínicas y Consultorios
            </p>
          </div>
        </div>

        {/* Contenido */}
        <div className="relative z-10 space-y-8">
          <div className="space-y-4">
            <h2 className="text-white text-4xl font-bold leading-tight
            tracking-tight">
              Tu clínica,<br />bajo control<br />financiero.
            </h2>
            <p className="text-blue-200 text-base leading-relaxed max-w-sm">
              Ve en tiempo real cuánto entra, cuánto sale y cuánto ganas
              — sin esperar al contador ni abrir un Excel.
            </p>
          </div>

          <div className="space-y-3">
            {[
              {
                icon: BarChart2,
                titulo: 'Ganancias y pérdidas por área',
                desc: 'Sabe exactamente qué servicio de tu clínica genera dinero y cuál no'
              },
              {
                icon: TrendingUp,
                titulo: 'Proyección de tu caja',
                desc: 'Anticipa si el próximo mes cierras en positivo o en negativo'
              },
              {
                icon: Bell,
                titulo: 'Alertas de vencimientos',
                desc: 'Te avisamos antes de que venza una deuda o un cobro pendiente'
              },
            ].map(({ icon: Icon, titulo, desc }) => (
              <div key={titulo} className="flex items-start gap-3 bg-white/10
              rounded-xl p-4 backdrop-blur-sm">
                <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center
                justify-center shrink-0">
                  <Icon className="w-4 h-4 text-blue-300" />
                </div>
                <div>
                  <p className="text-white text-sm font-semibold">{titulo}</p>
                  <p className="text-blue-200 text-xs mt-0.5 leading-relaxed">
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10">
          <p className="text-blue-400 text-xs">
            © 2026 Sistema Gerencial · Lima, Perú
          </p>
        </div>
      </div>

      {/* Panel derecho — formulario */}
      <div className="flex-1 flex items-center justify-center
      bg-gray-50 px-4 py-8 sm:px-8 lg:px-12">
        <div className="w-full max-w-sm space-y-6">

          {/* Logo mobile — solo visible en pantallas pequeñas */}
          <div className="flex lg:hidden items-center gap-3">
            <div className="w-9 h-9 bg-[#0F1F3D] rounded-xl flex items-center
            justify-center">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-semibold text-gray-900 text-sm leading-none">
                Sistema Gerencial
              </p>
              <p className="text-gray-400 text-xs mt-0.5">
                para Clínicas y Consultorios
              </p>
            </div>
          </div>

          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              Bienvenido de vuelta
            </h1>
            <p className="text-gray-500 text-sm">
              Ingresa tus credenciales para continuar
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="email"
                className="text-sm font-medium text-gray-700">
                Correo electrónico
              </label>
              <input
                id="email"
                type="email"
                placeholder="gerente@tuclinica.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => setTouched(t => ({ ...t, email: true }))}
                required
                autoComplete="email"
                disabled={isLoading}
                className={cn(
                  "w-full h-11 px-4 rounded-xl border bg-white text-gray-900",
                  "text-sm placeholder:text-gray-400 focus:outline-none",
                  "focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                  "transition-all disabled:opacity-50 disabled:cursor-not-allowed",
                  touched.email && !emailValido
                    ? "border-red-300" : "border-gray-200"
                )}
              />
              {touched.email && !emailValido && (
                <p className="text-xs text-red-500">
                  Ingresa un correo válido
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="password"
                  className="text-sm font-medium text-gray-700">
                  Contraseña
                </label>
                <button type="button"
                  className="text-xs text-blue-600 hover:text-blue-700
                  font-medium transition-colors">
                  ¿Olvidaste tu contraseña?
                </button>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={() => setTouched(t => ({ ...t, password: true }))}
                  required
                  autoComplete="current-password"
                  disabled={isLoading}
                  className={cn(
                    "w-full h-11 px-4 pr-11 rounded-xl border bg-white",
                    "text-gray-900 text-sm placeholder:text-gray-400",
                    "focus:outline-none focus:ring-2 focus:ring-blue-500",
                    "focus:border-transparent transition-all",
                    "disabled:opacity-50 disabled:cursor-not-allowed",
                    touched.password && !passwordValida
                      ? "border-red-300" : "border-gray-200"
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2
                  text-gray-400 hover:text-gray-600 transition-colors">
                  {showPassword
                    ? <EyeOff className="w-4 h-4" />
                    : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {touched.password && !passwordValida && (
                <p className="text-xs text-red-500">Mínimo 6 caracteres</p>
              )}
            </div>

            {error && (
              <div className="bg-red-50 border border-red-100 rounded-xl
              px-4 py-3 flex items-start gap-2.5">
                <div className="w-4 h-4 rounded-full bg-red-500 flex items-center
                justify-center shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">!</span>
                </div>
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || !formularioValido}
              className="w-full h-11 bg-blue-600 hover:bg-blue-700
              disabled:bg-blue-400 text-white text-sm font-semibold
              rounded-xl transition-all duration-150 flex items-center
              justify-center gap-2 shadow-sm shadow-blue-200
              disabled:cursor-not-allowed disabled:shadow-none">
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Iniciando sesión...
                </>
              ) : (
                'Iniciar sesión'
              )}
            </button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-gray-50 px-3 text-xs text-gray-400">
                ¿Primera vez aquí?
              </span>
            </div>
          </div>

          <button type="button"
            className="w-full h-11 border border-gray-200 bg-white
            hover:bg-gray-50 text-gray-700 text-sm font-medium
            rounded-xl transition-all duration-150">
            Solicitar acceso para mi clínica
          </button>

          <p className="text-center text-xs text-gray-400">
            Al ingresar aceptas nuestros{' '}
            <span className="text-gray-600 hover:underline cursor-pointer">
              Términos de uso
            </span>{' '}
            y{' '}
            <span className="text-gray-600 hover:underline cursor-pointer">
              Política de privacidad
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}