import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { useLocation } from 'react-router-dom'

export function SiteHeader() {
  const location = useLocation()
  const params = new URLSearchParams(location.search)
  const section = params.get('section') as null | 'clientes' | 'ventas' | 'ganancias' | 'productos' | 'team'
  const panel = params.get('panel') as null | 'clientes' | 'ventas' | 'ganancias' | 'productos' | 'team'

  const map: Record<string, string> = {
    clientes: 'Clientes',
    ventas: 'Ventas',
    ganancias: 'Ganancias',
    productos: 'Productos',
    team: 'Team',
  }

  const title = section ? map[section] : panel ? map[panel] : 'Dashboard'
  return (
    <header className="flex h-[var(--header-height)] shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium text-foreground">{title}</h1>
        <div className="ml-auto flex items-center gap-2" />
      </div>
    </header>
  )
}
