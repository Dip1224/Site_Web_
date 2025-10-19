import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { listCustomers } from '@/services/customers'
import { NewCustomerModal } from '@/components/quick-create/NewCustomerModal'
import { deleteCustomer, updateCustomer, upsertCustomerProfile } from '@/services/dashboard'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ClientsDataTable, buildClientColumns, type ClientRow } from '@/components/clients/ClientsDataTable'
import { toast } from 'sonner'
import { useAuth } from '@/contexts/AuthContext'
import { useCanCreate } from '@/hooks/useCanCreate'

export default function ClientesPage() {
  const { isAuthenticated, isLoading } = useAuth()
  const canCreate = useCanCreate()
  const [rows, setRows] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<null | any>(null)
  const [savingEdit, setSavingEdit] = useState(false)

  const load = async () => {
    setLoading(true)
    const { data } = await listCustomers()
    setRows(data || [])
    setLoading(false)
  }

  useEffect(() => {
    if (isLoading || !isAuthenticated) return
    // Dispara la primera carga apenas se autentique
    load()
  }, [isAuthenticated, isLoading])

  // Reintento breve si no hay datos tras autenticación (mitiga 429 de refresh temporal)
  useEffect(() => {
    if (!isLoading && isAuthenticated && !loading && rows.length === 0) {
      const t = setTimeout(() => { if (!loading) load() }, 900)
      return () => clearTimeout(t)
    }
  }, [isAuthenticated, isLoading, loading, rows.length])

  const filtered = rows

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Clientes</h1>
        {canCreate && <Button onClick={()=>setOpen(true)}>Nuevo cliente</Button>}
      </div>
      <div />
      <Separator />
      {loading ? (
        <div className="text-muted-foreground">Cargando…</div>
      ) : (
        <ClientsDataTable
          data={filtered.map((r): ClientRow => ({
            id: r.id,
            code: r.code,
            product: r.products?.short_code ?? null,
            name: r.customer_profiles?.name ?? null,
            phone: r.customer_profiles?.phone ?? null,
            status: r.status,
            created_at: r.created_at,
            expires_at: r.expires_at ?? null,
          }))}
          columns={buildClientColumns((row)=>{
            const match = rows.find(x => x.id === row.id)
            if (match) {
              const safe = {
                ...match,
                status: match.status || 'active',
                customer_profiles: match.customer_profiles || { name: '', phone: '' },
                products: match.products || null,
              }
              setEditing(safe)
            }
          }, async (row)=>{
            const { error } = await deleteCustomer(row.id)
            if (error) {
              console.error('delete error', error)
              toast.error('No se pudo eliminar. ¿Tiene ventas asociadas?')
            }
            await load()
          }, canCreate)}
          canSelect={canCreate}
          onBulkActivate={async (ids)=>{
            let failures = 0
            for (const id of ids) {
              const { error } = await updateCustomer(id, { status: 'active' })
              if (error) failures++
            }
            if (failures) toast.error(`No se pudieron activar ${failures} cliente(s).`)
            else toast.success('Clientes activados')
            await load()
          }}
          onBulkDeactivate={async (ids)=>{
            let failures = 0
            for (const id of ids) {
              const { error } = await updateCustomer(id, { status: 'inactive' })
              if (error) failures++
            }
            if (failures) toast.error(`No se pudieron inactivar ${failures} cliente(s).`)
            else toast.success('Clientes inactivados')
            await load()
          }}
          onBulkDelete={async (ids)=>{
            const errors: string[] = []
            for (const id of ids) {
              const { error } = await deleteCustomer(id)
              if (error) errors.push(id)
            }
            if (errors.length) {
              toast.error(`No se eliminaron ${errors.length} cliente(s). Puede que tengan ventas relacionadas.`)
            } else {
              toast.success('Clientes eliminados')
            }
            await load()
          }}
        />
      )}

      {canCreate && (
        <NewCustomerModal open={open} onOpenChange={(o)=>{ setOpen(o); if(!o) load() }} onCreated={load} />
      )}

      <Dialog open={!!editing} onOpenChange={(o)=>{ if(!o) setEditing(null) }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cliente</DialogTitle>
          </DialogHeader>
          {editing && (
            <div className="grid gap-3">
              <div>
                <div className="text-xs text-muted-foreground">ID</div>
                <div className="font-mono text-xs break-all">{editing.id}</div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="text-xs text-muted-foreground">Código</div>
                  <Input value={editing.code || ''} onChange={e=>setEditing({ ...editing, code: e.target.value })} placeholder="2C001" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Estado</div>
                  <Select value={editing.status || 'active'} onValueChange={v=>setEditing({ ...editing, status: v })}>
                    <SelectTrigger><SelectValue placeholder="Estado" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">active</SelectItem>
                      <SelectItem value="inactive">inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="text-xs text-muted-foreground">Nombre</div>
                  <Input value={editing.customer_profiles?.name ?? ''} onChange={e=>setEditing({ ...editing, customer_profiles: { ...(editing.customer_profiles||{}), name: e.target.value } })} placeholder="Juan Perez" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Teléfono</div>
                  <Input value={editing.customer_profiles?.phone ?? ''} onChange={e=>setEditing({ ...editing, customer_profiles: { ...(editing.customer_profiles||{}), phone: e.target.value } })} placeholder="70000000" />
                </div>
              </div>
              <div className="flex gap-2 justify-end pt-2">
                <Button variant="outline" onClick={()=>setEditing(null)}>Cerrar</Button>
                <Button onClick={async()=>{
                  try {
                    setSavingEdit(true)
                    // Cierre optimista para misma animación que en Nuevo cliente
                    setEditing(null)
                    const st = editing.status || 'active'
                    const code = editing.code || null
                    const name = editing.customer_profiles?.name ?? ''
                    const phone = editing.customer_profiles?.phone ?? ''
                    const { error: upErr } = await updateCustomer(editing.id, { code, status: st })
                    if (upErr) throw upErr
                    const { error: profErr } = await upsertCustomerProfile(editing.id, { name, phone })
                    if (profErr) throw profErr
                    toast.success('Cliente actualizado')
                    load()
                  } catch (e: any) {
                    console.error('edit save error', e)
                    toast.error(e?.message || 'No se pudo guardar cambios')
                  } finally {
                    setSavingEdit(false)
                  }
                }} disabled={savingEdit || !canCreate}>{savingEdit ? 'Guardando…' : 'Guardar'}</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
