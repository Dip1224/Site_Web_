"use client"

import * as React from "react"
import {
  IconCamera,
  IconChartBar,
  IconDashboard,
  IconDatabase,
  IconFileAi,
  IconFileDescription,
  IconFileWord,
  IconFolder,
  IconHelp,
  IconReport,
  IconSearch,
  IconSettings,
  IconUsers,
} from "@tabler/icons-react"

import { NavDocuments } from '@/components/nav-documents'
import { NavMain } from '@/components/nav-main'
import { NavSecondary } from '@/components/nav-secondary'
import { NavUser } from '@/components/nav-user'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import LynxLogo from '@/components/ui/LynxLogo'
import { useAuth } from '@/contexts/AuthContext'
import { ensureSession } from '@/lib/session'

const BASE_NAV = [
  { title: "Dashboard", url: "/dashboard", icon: IconDashboard },
  { title: "Clientes", url: "/dashboard?section=clientes", icon: IconUsers },
  { title: "Ventas", url: "/dashboard?section=ventas", icon: IconChartBar },
  { title: "Ganancias", url: "/dashboard?section=ganancias", icon: IconReport },
  { title: "Productos", url: "/dashboard?section=productos", icon: IconFolder },
  { title: "Team", url: "/dashboard?section=team", icon: IconUsers },
] as const

const CLOUD_DOCS = [
  {
    title: "Capture",
    icon: IconCamera,
    isActive: true,
    url: "#",
    items: [
      { title: "Active Proposals", url: "#" },
      { title: "Archived", url: "#" },
    ],
  },
  {
    title: "Proposal",
    icon: IconFileDescription,
    url: "#",
    items: [
      { title: "Active Proposals", url: "#" },
      { title: "Archived", url: "#" },
    ],
  },
  {
    title: "Prompts",
    icon: IconFileAi,
    url: "#",
    items: [
      { title: "Active Proposals", url: "#" },
      { title: "Archived", url: "#" },
    ],
  },
] as const

const SECONDARY = [
  { title: "Configuración", url: "#", icon: IconSettings },
  { title: "Soporte", url: "#", icon: IconHelp },
  { title: "Buscar", url: "#", icon: IconSearch },
] as const

const DOCUMENTS = [
  { name: "Data Library", url: "#", icon: IconDatabase },
  { name: "Reports", url: "#", icon: IconReport },
  { name: "Word Assistant", url: "#", icon: IconFileWord },
] as const

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user, logout } = useAuth()
  const [role, setRole] = React.useState<'admin'|'sales'|'viewer'>('viewer')
  const [profileName, setProfileName] = React.useState<string | null>(null)

  // Try to read role from profiles; fallback to email mapping if missing
  React.useEffect(() => {
    ;(async () => {
      if (!user?.id) return
      try {
        await ensureSession()
        const { supabase } = await import('@/lib/supabase')
        const call = async (retry = false) => {
          const { data, error } = await supabase
            .from('profiles')
            .select('role,name,avatar_url')
            .eq('id', user.id)
            .single()
          const status = (error as any)?.status
          if (status === 429 && !retry) {
            await new Promise((r)=>setTimeout(r,1100))
            return call(true)
          }
          if (error) throw error
          return data
        }
        const data = await call(false)
        if (data?.role && ['admin','sales','viewer'].includes((data as any).role)) {
          setRole((data as any).role as any)
        } else {
          // fallback by email mapping
          const email = (user?.email || '').toLowerCase()
          const roleByEmail: Record<string, 'admin' | 'sales' | 'viewer'> = {
            'luiscarlos.ribera@gmail.com': 'admin',
            'jorge.orellana@gmail.com': 'sales',
            'diegoarcani190@gmail.com': 'sales',
            'darwin.menacho@gmail.com': 'viewer',
          }
          setRole(roleByEmail[email] || 'viewer')
        }
        if ((data as any)?.name) setProfileName((data as any).name)
      } catch {
        const email = (user?.email || '').toLowerCase()
        const roleByEmail: Record<string, 'admin' | 'sales' | 'viewer'> = {
          'luiscarlos.ribera@gmail.com': 'admin',
          'jorge.orellana@gmail.com': 'sales',
          'diegoarcani190@gmail.com': 'sales',
          'darwin.menacho@gmail.com': 'viewer',
        }
        setRole(roleByEmail[email] || 'viewer')
      }
    })()
  }, [user?.id])

  const navForRole = React.useMemo(() => {
    if (role === 'admin') return BASE_NAV
    if (role === 'sales') return BASE_NAV.filter(i => i.title !== 'Team')
    // viewer
    return BASE_NAV.filter(i => ['Dashboard','Clientes','Ventas'].includes(i.title))
  }, [role])

  const email = (user?.email || '').toLowerCase()
  const displayUser = {
    name: profileName || user?.name || (email ? email.split('@')[0] : 'Invitado'),
    email: user?.email || 'no-auth@local',
    avatar: '',
  }

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="/dashboard" className="flex items-center gap-2">
                <LynxLogo size={22} />
                <span className="text-base font-semibold">WorkEz</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navForRole as any} />
        <NavDocuments items={DOCUMENTS as any} />
        <NavSecondary items={SECONDARY as any} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={displayUser} onLogout={logout} />
      </SidebarFooter>
    </Sidebar>
  )
}
