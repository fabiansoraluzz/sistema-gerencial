'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import Sidebar from '@/components/layout/Sidebar'
import Header from '@/components/layout/Header'
import { cn } from '@/lib/utils'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const { isAuthenticated, initAuth } = useAuthStore()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => { initAuth() }, [])

  useEffect(() => {
    if (!isAuthenticated) router.push('/login')
  }, [isAuthenticated, router])

  if (!isAuthenticated) return null

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">

      {/* Overlay mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        'fixed inset-y-0 left-0 z-30 transition-transform duration-300',
        'lg:relative lg:translate-x-0 lg:flex lg:shrink-0',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Contenido principal */}
      <div className="flex flex-col flex-1 overflow-hidden min-w-0">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {children}
        </main>
      </div>

    </div>
  )
}