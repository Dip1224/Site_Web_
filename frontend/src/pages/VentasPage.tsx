import { useEffect, useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { NewPaymentModal } from '@/components/quick-create/NewPaymentModal'
import { formatBs, listPaymentsSince } from '@/services/payments'
import { deletePaymentCascade, fetchSaleDetails, listTeamMembers, updatePaymentRecord, updateSaleSplit } from '@/services/dashboard'
import { useAuth } from '@/contexts/AuthContext'
import { useCanCreate } from '@/hooks/useCanCreate'
import { toast } from 'sonner'

export default function VentasPage() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const canCreate = useCanCreate()
  const [rows, setRows] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [editingRow, setEditingRow] = useState<any | null>(null)
  const [editOpen, setEditOpen] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const canManagePayments = useMemo(
    () => user?.email?.toLowerCase() === 'diegoarcani190@gmail.com',
    [user]
  )

  const load = async (range: 'today'|'week'|'month' = 'today') => {
    setLoading(true)
    const now = new Date()
    const start = new Date(now)
    if (range==='today') start.setHours(0,0,0,0)
    if (range==='week') start.setDate(start.getDate() - 7)
    if (range==='month') start.setMonth(start.getMonth()-1)
    const { data } = await listPaymentsSince(start.toISOString())
    setRows(data || [])
    setLoading(false)
  }
  useEffect(()=>{ if (!isLoading && isAuthenticated) load('today') }, [isAuthenticated, isLoading])
  useEffect(()=>{
    if (!isLoading && isAuthenticated && !loading && rows.length === 0) {
      const t = setTimeout(()=> load('today'), 900)
      return () => clearTimeout(t)
    }
  }, [isAuthenticated, isLoading, loading, rows.length])

  const filtered = rows.filter((r: any) => (r.status||'').toLowerCase().includes(query.toLowerCase()))

  const handleDelete = async (row: any) => {
    if (!window.confirm('¿Eliminar esta venta? Esta acción no se puede deshacer.')) return
    setDeletingId(row.id)
    try {
      await deletePaymentCascade(row.id, row.sale_id)
      toast.success('Venta eliminada')
      load()
    } catch (error: any) {
      toast.error(error?.message || 'No se pudo eliminar la venta')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Ventas</h1>
        {canCreate && (
          <Button onClick={()=>setOpen(true)}>Registrar venta</Button>
        )}
      </div>
      <div className="flex items-center gap-3">
        <Input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Filtrar por estado" className="max-w-sm" />
        <div className="ml-auto flex gap-2">
          <Button variant="outline" onClick={()=>load('today')}>Hoy</Button>
          <Button variant="outline" onClick={()=>load('week')}>Semana</Button>
          <Button variant="outline" onClick={()=>load('month')}>Mes</Button>
        </div>
      </div>
      <Separator />
      {loading ? (
        <div className="text-muted-foreground">Cargando…</div>
      ) : filtered.length === 0 ? (
        <div className="text-muted-foreground">Sin ventas</div>
      ) : (
        <div className="rounded-xl border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="text-left p-3">Fecha</th>
                <th className="text-left p-3">Cliente</th>
                <th className="text-left p-3">Teléfono</th>
                <th className="text-left p-3">Producto</th>
                <th className="text-left p-3">Monto</th>
                <th className="text-left p-3">Estado</th>
                {canManagePayments && <th className="text-right p-3">Acciones</th>}
              </tr>
            </thead>
            <tbody>
              {filtered.map((r: any)=> (
                <tr key={r.id} className="border-t">
                  <td className="p-3">{new Date(r.paid_at).toLocaleString()}</td>
                  <td className="p-3">{r.customer_name || r.customer_id?.slice(0,8)}</td>
                  <td className="p-3">{r.customer_phone || '-'}</td>
                  <td className="p-3">{r.product_short_code ? `${r.product_short_code} - ${r.product_name||''}` : (r.product_name||'-')}</td>
                  <td className="p-3">{formatBs(r.amount_cents)}</td>
                  <td className="p-3">{r.status}</td>
                  {canManagePayments && (
                    <td className="p-3">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditingRow(r)
                            setEditOpen(true)
                          }}
                          disabled={!r.sale_id}
                        >
                          Editar
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(r)}
                          disabled={deletingId === r.id}
                        >
                          {deletingId === r.id ? 'Eliminando...' : 'Eliminar'}
                        </Button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {canCreate && (
        <NewPaymentModal open={open} onOpenChange={(o)=>{ setOpen(o); if(!o) load() }} onCreated={load} />
      )}

      {canManagePayments && (
        <ManageSaleDialog
          open={editOpen}
          onOpenChange={(o) => {
            setEditOpen(o)
            if (!o) setEditingRow(null)
          }}
          payment={editingRow}
          onUpdated={load}
        />
      )}
    </div>
  )
}

function ManageSaleDialog({
  open,
  onOpenChange,
  payment,
  onUpdated,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  payment: any | null
  onUpdated: () => void
}) {
  const [members, setMembers] = useState<any[]>([])
  const [selected, setSelected] = useState<string[]>([])
  const [amount, setAmount] = useState('0')
  const [status, setStatus] = useState('succeeded')
  const [note, setNote] = useState('')
  const [initializing, setInitializing] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!open) return
    let active = true
    const load = async () => {
      setInitializing(true)
      try {
        const [{ data: memberList }] = await Promise.all([listTeamMembers()])
        if (!active) return
        setMembers(memberList || [])

        if (payment?.sale_id) {
          const details = await fetchSaleDetails(payment.sale_id)
          if (!active) return
          setAmount(((details.sale.amount_cents || 0) / 100).toFixed(2))
          setNote(details.sale.note || '')
          setSelected(details.member_ids.length ? details.member_ids : [])
        } else {
          setSelected([])
          setAmount(((payment?.amount_cents || 0) / 100).toFixed(2))
          setNote('')
        }
        setStatus(payment?.status || 'succeeded')
      } catch (error) {
        console.error(error)
        toast.error('No se pudieron cargar los detalles de la venta')
      } finally {
        if (active) setInitializing(false)
      }
    }
    load()
    return () => {
      active = false
    }
  }, [open, payment])

  const toggleMember = (id: string, checked: boolean) => {
    setSelected((prev) => {
      if (checked) return Array.from(new Set([...prev, id]))
      return prev.filter((m) => m !== id)
    })
  }

  const handleSave = async () => {
    if (!payment) return
    const cents = Math.round((parseFloat(amount || '0') || 0) * 100)
    if (cents <= 0) {
      toast.error('Monto inválido')
      return
    }
    if (payment.sale_id && selected.length === 0) {
      toast.error('Selecciona al menos un socio')
      return
    }
    setSaving(true)
    try {
      await updatePaymentRecord(payment.id, { amount_cents: cents, status })
      if (payment.sale_id) {
        await updateSaleSplit({
          sale_id: payment.sale_id,
          amount_cents: cents,
          note,
          member_ids: selected,
        })
      }
      toast.success('Venta actualizada')
      onUpdated()
      onOpenChange(false)
    } catch (error: any) {
      console.error(error)
      toast.error(error?.message || 'No se pudo actualizar la venta')
    } finally {
      setSaving(false)
    }
  }

  const disabled = !payment?.sale_id

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>Editar venta</DialogTitle>
          <DialogDescription>Ajusta el monto, estado y reparto entre socios.</DialogDescription>
        </DialogHeader>
        {initializing ? (
          <div className="text-sm text-muted-foreground">Cargando…</div>
        ) : (
          <div className="grid gap-4">
            <div>
              <label className="text-sm font-medium">Monto (Bs)</label>
              <Input value={amount} type="number" min="0" step="0.01" onChange={(e) => setAmount(e.target.value)} />
            </div>
            <div>
              <label className="text-sm font-medium">Estado</label>
              <Input value={status} onChange={(e) => setStatus(e.target.value)} placeholder="succeeded" />
            </div>
            <div>
              <label className="text-sm font-medium">Nota</label>
              <Input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Detalle opcional" />
            </div>
            <div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Socios</label>
                <button
                  type="button"
                  className="text-xs underline"
                  onClick={() => setSelected(members.map((m: any) => m.id))}
                  disabled={disabled}
                >
                  Seleccionar todos
                </button>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {members.map((m: any) => (
                  <label key={m.id} className="inline-flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={selected.includes(m.id)}
                      onChange={(e) => toggleMember(m.id, e.target.checked)}
                      disabled={disabled}
                    />
                    <span>{m.name || m.id.slice(0, 8)}</span>
                  </label>
                ))}
              </div>
              {disabled && (
                <p className="text-xs text-muted-foreground mt-2">
                  Esta venta no tiene un reparto asociado (sale_id no disponible).
                </p>
              )}
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>
                Cancelar
              </Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving ? 'Guardando…' : 'Guardar cambios'}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
