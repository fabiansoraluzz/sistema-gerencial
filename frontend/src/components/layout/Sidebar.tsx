'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import {
  LayoutDashboard, Wallet, TrendingUp, TrendingDown,
  Calendar, Users, BarChart2, Settings, Activity
} from 'lucide-react'
import { cn } from '@/lib/utils'

const nav = [
  { href: '/dashboard',                label: 'Dashboard',       icon: LayoutDashboard },
  { href: '/dashboard/caja',           label: 'Caja',            icon: Wallet },
  { href: '/dashboard/cobrar',         label: 'Por cobrar',      icon: TrendingUp },
  { href: '/dashboard/pagar',          label: 'Por pagar',       icon: TrendingDown },
  { href: '/dashboard/agenda',         label: 'Agenda',          icon: Calendar },
  { href: '/dashboard/pacientes',      label: 'Pacientes',       icon: Users },
  { href: '/dashboard/reportes',       label: 'Reportes',        icon: BarChart2 },
  { href: '/dashboard/configuracion',  label: 'Configuración',   icon: Settings },
]

export default function Sidebar() {
  const pathname = usePathname()
  const { usuario } = useAuthStore()

  return (
    <aside className="w-56 bg-[#0f1f3d] flex flex-col h-full shrink-0">

      {/* Logo */}
      <div className="px-4 py-4 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-[#1a3f7a] rounded-lg flex items-center
            justify-center shrink-0">
            <Activity className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-white text-xs font-medium leading-none">
              Sistema Gerencial
            </p>
            <p className="text-white/40 text-[10px] mt-0.5 leading-none">
              {usuario?.nombreEmpresa ?? ''}
            </p>
          </div>
        </div>
      </div>

      {/* Navegación */}
      <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
        {nav.map(({ href, label, icon: Icon }) => {
          const active = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs',
                'transition-colors',
                active
                  ? 'bg-white/12 text-white font-medium'
                  : 'text-white/50 hover:bg-white/6 hover:text-white/80'
              )}
            >
              <Icon className={cn('w-4 h-4 shrink-0',
                active ? 'text-white' : 'text-white/40')} />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Usuario */}
      <div className="px-3 py-3 border-t border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-white/10 rounded-full flex items-center
            justify-center shrink-0">
            <span className="text-white/80 text-[10px] font-medium">
              {usuario?.nombreCompleto?.charAt(0) ?? 'U'}
            </span>
          </div>
          <div className="min-w-0">
            <p className="text-xs text-white/80 font-medium truncate">
              {usuario?.nombreCompleto ?? 'Usuario'}
            </p>
            <p className="text-[10px] text-white/30 truncate">
              {usuario?.email ?? ''}
            </p>
          </div>
        </div>
      </div>

    </aside>
  )
}