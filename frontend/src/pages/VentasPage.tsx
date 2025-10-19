import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { NewPaymentModal } from '@/components/quick-create/NewPaymentModal'
import { formatBs, listPaymentsSince } from '@/services/payments'
import { useAuth } from '@/contexts/AuthContext'
import { useCanCreate } from '@/hooks/useCanCreate'

export default function VentasPage() {
  const { isAuthenticated, isLoading } = useAuth()
  const canCreate = useCanCreate()
  const [rows, setRows] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')

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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {canCreate && (
        <NewPaymentModal open={open} onOpenChange={(o)=>{ setOpen(o); if(!o) load() }} onCreated={load} />
      )}
    </div>
  )
}
