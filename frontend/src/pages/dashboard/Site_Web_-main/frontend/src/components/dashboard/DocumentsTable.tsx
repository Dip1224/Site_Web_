"use client"
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/data-table'
import { fetchSections } from '@/services/documents'
import NewSectionModal from '@/components/quick-create/NewSectionModal'

export function DocumentsTable() {
  const [rows, setRows] = useState<any[] | null>(null)
  const [open, setOpen] = useState(false)

  const load = async () => {
    const data = await fetchSections()
    setRows(data)
  }
  useEffect(()=>{ load() }, [])

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-4 lg:px-6">
        <h3 className="text-lg font-semibold">Documents</h3>
        <Button size="sm" onClick={()=>setOpen(true)}>Add Section</Button>
      </div>
      {rows === null ? (
        <div className="text-muted-foreground px-4 lg:px-6">Cargando…</div>
      ) : rows.length === 0 ? (
        <div className="text-muted-foreground px-4 lg:px-6">No hay secciones todavía</div>
      ) : (
        <DataTable data={rows as any} />
      )}
      <NewSectionModal open={open} onOpenChange={(o)=>{ setOpen(o); if(!o) load() }} onCreated={load} />
    </div>
  )
}

export default DocumentsTable
