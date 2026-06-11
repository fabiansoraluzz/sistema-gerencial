'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { LogOut, Menu } from 'lucide-react'

const titles: Record<string, string> = {
  '/dashboard':               'Dashboard',
  '/dashboard/caja':          'Caja y movimientos',
  '/dashboard/cobrar':        'Cuentas por cobrar',
  '/dashboard/pagar':         'Cuentas por pagar',
  '/dashboard/agenda':        'Agenda y citas',
  '/dashboard/pacientes':     'Pacientes',
  '/dashboard/reportes':      'Reportes',
  '/dashboard/configuracion': 'Configuración',
}

interface HeaderProps {
  onMenuClick?: () => void
}

export default function Header({ onMenuClick }: HeaderProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { logout } = useAuthStore()

  const handleLogout = async () => {
    await logout()
    router.push('/login')
  }

  return (
    <header className="h-14 bg-white border-b border-gray-100 px-4 sm:px-6
      flex items-center justify-between shrink-0">

      <div className="flex items-center gap-3">
        {/* Botón hamburguesa — solo mobile */}
        <button
          onClick={onMenuClick}
          className="lg:hidden text-gray-400 hover:text-gray-700
            transition-colors p-1 -ml-1"
          aria-label="Abrir menú"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="text-sm font-medium text-gray-900">
          {titles[pathname] ?? 'Dashboard'}
        </h1>
      </div>

      <button
        onClick={handleLogout}
        className="flex items-center gap-1.5 text-xs text-gray-400
          hover:text-gray-700 transition-colors py-1.5 px-2 rounded-lg
          hover:bg-gray-50"
      >
        <LogOut className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Cerrar sesión</span>
      </button>

    </header>
  )
}