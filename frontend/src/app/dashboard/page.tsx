import { AppSidebar } from '../../components/app-sidebar'
import { ChartAreaInteractive } from '../../components/chart-area-interactive'
import { DataTable } from '../../components/data-table'
import { SectionCards } from '../../components/section-cards'
import { SiteHeader } from '../../components/site-header'
import {
  SidebarInset,
  SidebarProvider,
} from '../../components/ui/sidebar'


type DataTableRow = {
  id: number
  header: string
  type: string
  status: string
  target: string
  limit: string
  reviewer: string
}

// If TypeScript still complains, explicitly type the data:
const typedData: DataTableRow[] = []

export default function Page() {
  return (
    <SidebarProvider
      style={{
        "--sidebar-width": "calc(var(--spacing) * 72)",
        "--header-height": "calc(var(--spacing) * 12)",
      } as React.CSSProperties}
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 bg-white min-h-screen">
              <SectionCards />
              <div className="px-4 lg:px-6">
              <ChartAreaInteractive />
              </div>
              <DataTable data={typedData} />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
