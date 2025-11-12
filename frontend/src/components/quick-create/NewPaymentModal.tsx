"use client"
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet'
import { listCustomers, listSubscriptionsByCustomer } from '@/services/customers'
import { createPayment, formatBs } from '@/services/payments'
import { listTeamMembers, registerSaleWithSplit } from '@/services/dashboard'
import { supabase } from '@/lib/supabase'
import { ensureSession } from '@/lib/session'

export function NewPaymentModal({ open, onOpenChange, onCreated }: { open: boolean; onOpenChange: (o: boolean)=>void; onCreated?: ()=>void }) {
  const [customers, setCustomers] = useState<any[]>([])
  const [customerId, setCustomerId] = useState('')
  const [subs, setSubs] = useState<any[]>([])
  const [subId, setSubId] = useState<string>('')
  const [amountBs, setAmountBs] = useState('')
  const [note, setNote] = useState('')
  const [saving, setSaving] = useState(false)
  const [members, setMembers] = useState<any[]>([])
  const [selected, setSelected] = useState<string[]>([])

  useEffect(() => { (async()=>{ const { data } = await listCustomers(); setCustomers(data||[]) })() }, [])
  useEffect(() => {
    (async () => {
      const { data } = await listTeamMembers();
      const list = (data || []) as any[];
      setMembers(list);
      setSelected([]); // no seleccionar por defecto
    })();
  }, []);

  useEffect(() => {
    // Mantener solo ids válidos si cambian los miembros
    setSelected((prev) => prev.filter((id) => members.some((m) => m.id === id)));
  }, [members])
  useEffect(() => {
    if (!customerId) return; (async()=>{ const { data } = await listSubscriptionsByCustomer(customerId); setSubs(data||[]); setSubId(data?.[0]?.id||'') })()
  }, [customerId])

  // Auto-sugerir monto a partir del último pago del cliente (o 35 Bs por defecto)
  useEffect(() => {
    if (!customerId) { setAmountBs(''); return }
    (async () => {
      try {
        await ensureSession()
        const call = async (retry = false): Promise<any[]> => {
          const { data, error } = await supabase
            .from('payments')
            .select('amount_cents, paid_at')
            .eq('customer_id', customerId)
            .order('paid_at', { ascending: false })
            .limit(1)
          const status = (error as any)?.status
          if (status === 429 && !retry) {
            await new Promise((r) => setTimeout(r, 1100))
            return call(true)
          }
          if (error) throw error
          return data || []
        }
        const data = await call(false)
        if (data && data.length > 0 && typeof data[0].amount_cents === 'number') {
          const bs = (Number(data[0].amount_cents) / 100).toFixed(2)
          setAmountBs(bs)
        } else {
          setAmountBs('35')
        }
      } catch (_) {
        setAmountBs('35')
      }
    })()
  }, [customerId])

  const submit = async () => {
    const cents = Math.round((parseFloat(amountBs || '0') || 0) * 100)
    if (!customerId) { toast.error('Selecciona cliente'); return }
    if (cents <= 0) { toast.error('Monto inválido'); return }
    if (!selected.length) { toast.error('Selecciona al menos un socio'); return }
    setSaving(true)
    try {
      await createPayment({ customer_id: customerId, subscription_id: subId || undefined, amount_cents: cents, note })
      try {
        await registerSaleWithSplit({ customer_id: customerId, amount_cents: cents, note, member_ids: selected })
        toast.success(`Venta registrada y repartida: ${formatBs(cents)} entre ${selected.length} socio(s).`)
      } catch (splitErr: any) {
        console.error('registerSaleWithSplit error', splitErr)
        toast.error('El pago se guardó pero no se pudo repartir entre los socios. Revisa la sección de Ganancias.')
      }
      onCreated?.(); onOpenChange(false)
      setAmountBs(''); setNote('')
    } catch (e:any) { toast.error(e?.message || 'Error al registrar venta') } finally { setSaving(false) }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-[520px]">
        <SheetHeader>
          <SheetTitle>Registrar venta</SheetTitle>
          <SheetDescription>Registra un pago/venta en BOB</SheetDescription>
        </SheetHeader>
        <div className="grid gap-3 py-4">
          <div>
            <Label>Cliente</Label>
            <Select value={customerId} onValueChange={setCustomerId}>
              <SelectTrigger><SelectValue placeholder="Selecciona cliente" /></SelectTrigger>
              <SelectContent>
                {(customers||[]).map(c => (<SelectItem key={c.id} value={c.id}>{c.name ?? c.code ?? c.id.slice(0,6)}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Suscripción (opcional)</Label>
            <Select value={subId} onValueChange={setSubId}>
              <SelectTrigger><SelectValue placeholder="Sin suscripción" /></SelectTrigger>
              <SelectContent>
                {(subs||[]).map(s => (<SelectItem key={s.id} value={s.id}>{s.plan_id ?? 'plan'} — {s.status}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Monto (Bs)</Label>
            <Input type="number" min={0} step="0.01" value={amountBs} onChange={e=>setAmountBs(e.target.value)} placeholder="0.00" />
          </div>
          <div>
            <div className="flex items-center justify-between">
              <Label>Acreditar a</Label>
              <button
                type="button"
                className="text-xs underline hover:opacity-80 disabled:opacity-40"
                onClick={() => setSelected(members.map(m => m.id))}
                disabled={!members.length}
              >
                Seleccionar todos
              </button>
            </div>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {members.map(m => (
                <label key={m.id} className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={selected.includes(m.id)} onChange={(e)=>setSelected(prev=> e.target.checked ? Array.from(new Set([...prev, m.id])) : prev.filter(x=>x!==m.id))} />
                  <span>{m.name || m.id.slice(0,6)}</span>
                </label>
              ))}
            </div>
            {(() => {
              const cents = Math.round((parseFloat(amountBs || '0') || 0) * 100)
              const n = Math.max(1, selected.length || 1)
              const each = Math.floor(cents / n)
              return <div className="text-xs text-muted-foreground mt-2">{selected.length ? `Se acreditará ${formatBs(each)} a cada uno (resto al primero).` : 'Selecciona miembros para repartir.'}</div>
            })()}
          </div>
          <div>
            <Label>Nota (opcional)</Label>
            <Input value={note} onChange={e=>setNote(e.target.value)} placeholder="Detalle de la venta" />
          </div>
          <div className="flex gap-2 pt-2">
            <Button variant="outline" onClick={()=>onOpenChange(false)}>Cancelar</Button>
            <Button onClick={submit} disabled={saving}>{saving ? 'Guardando…' : 'Registrar venta'}</Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default NewPaymentModal
