import { AppSidebar } from '@/components/app-sidebar'
import { Cards } from '@/components/dashboard/Cards'
import { VisitorsChart } from '@/components/dashboard/VisitorsChart'
import { DailyActivityChart } from '@/components/dashboard/DailyActivityChart'
import { DocumentsTable } from '@/components/dashboard/DocumentsTable'
import { SiteHeader } from '@/components/site-header'
import {
  SidebarInset,
  SidebarProvider,
} from '@/components/ui/sidebar'

import { useEffect, useMemo, useState } from 'react'
import { track } from '@/services/analytics'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import NewCustomerModal from '@/components/quick-create/NewCustomerModal'
import NewPaymentModal from '@/components/quick-create/NewPaymentModal'
import { useCanCreate } from '@/hooks/useCanCreate'
import TeamPage from '@/pages/TeamPage'
import GananciasPage from '@/pages/GananciasPage'
import ProductosPage from '@/pages/ProductosPage'
import ClientesPage from '@/pages/ClientesPage'
import VentasPage from '@/pages/VentasPage'
import { useLocation, useNavigate } from 'react-router-dom'
import { ensureSession } from '@/lib/session'

export default function DashboardPage() {
  useEffect(()=>{ track('/dashboard') },[])
  // Preflight de sesión al entrar al dashboard para evitar 429 en widgets iniciales
  useEffect(() => { (async()=>{ try { await ensureSession() } catch {} })() }, [])

  const location = useLocation()
  const navigate = useNavigate()
  const params = useMemo(()=>new URLSearchParams(location.search),[location.search])
  const panel = params.get('panel') as (null| 'clientes'|'ventas'|'ganancias'|'productos'|'team')
  const section = params.get('section') as (null | 'clientes' | 'ventas' | 'ganancias' | 'productos' | 'team')
  const [open, setOpen] = useState<boolean>(!!panel)

  useEffect(()=>{ setOpen(!!panel) }, [panel])

  const closePanel = () => {
    const p = new URLSearchParams(location.search)
    p.delete('panel')
    navigate({ pathname: '/dashboard', search: p.toString() }, { replace: true })
  }

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        {section ? (
          // Secciones renderizadas dentro del dashboard
          <div className="flex-1">
            <div className="py-4 md:py-6">
              {section === 'clientes' && <ClientesPage />}
              {section === 'ventas' && <VentasPage />}
              {section === 'ganancias' && <GananciasPage />}
              {section === 'productos' && <ProductosPage />}
              {section === 'team' && <TeamPage />}
            </div>
          </div>
        ) : (
          <div className="flex flex-1 flex-col">
            <div className="flex flex-1 flex-col gap-2">
              <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                <Cards />
                <div className="px-4 lg:px-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <VisitorsChart />
                  <DailyActivityChart />
                </div>
                <DocumentsTable />
              </div>
            </div>
          </div>
        )}
        {panel && !section && (
          <PanelSheet
            type={panel}
            open={open}
            onOpenChange={(o) => {
              setOpen(o)
              if (!o) closePanel()
            }}
          />
        )}
      </SidebarInset>
    </SidebarProvider>
  )
}

function PanelSheet({ type, open, onOpenChange }: { type: 'clientes'|'ventas'|'ganancias'|'productos'|'team', open: boolean, onOpenChange: (o:boolean)=>void }) {
  const canCreate = useCanCreate()
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-[720px]">
        <SheetHeader>
          <SheetTitle>{labelFor(type)}</SheetTitle>
        </SheetHeader>
        {type === 'clientes' && (canCreate ? (
          <NewCustomerModal open={true} onOpenChange={onOpenChange} />
        ) : (
          <div className="p-4 text-sm text-muted-foreground">No tienes permisos para crear clientes.</div>
        ))}
        {type === 'ventas' && (canCreate ? (
          <NewPaymentModal open={true} onOpenChange={onOpenChange} />
        ) : (
          <div className="p-4 text-sm text-muted-foreground">No tienes permisos para registrar ventas.</div>
        ))}
        {type === 'ganancias' && <div className="mt-4"><GananciasPage /></div>}
        {type === 'productos' && <div className="mt-4"><ProductosPage /></div>}
        {type === 'team' && <div className="mt-4"><TeamPage /></div>}
      </SheetContent>
    </Sheet>
  )
}

function labelFor(type: string) {
  switch (type) {
    case 'clientes': return 'Nuevo cliente'
    case 'ventas': return 'Registrar venta'
    case 'ganancias': return 'Ganancias'
    case 'productos': return 'Productos'
    case 'team': return 'Team'
    default: return ''
  }
}
