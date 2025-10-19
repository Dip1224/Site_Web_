\"use client\"

import { useEffect, useMemo, useState } from 'react'
import { IconCirclePlusFilled } from \"@tabler/icons-react\"
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Separator } from '@/components/ui/separator'
import { formatBs, listCustomers, createCustomer, listSubscriptionsByCustomer, createPayment, prepayMonths, listProposals, addProposalSection, listTeamMembers, registerSaleWithSplit } from '@/services/dashboard'
import { useCanCreate } from '@/hooks/useCanCreate'mport { useCanCreate } from '@/hooks/useCanCreate'type Action = 'menu' | 'newClient' | 'sale' | 'prepay' | 'newSection'export function QuickCreate() {  const [open, setOpen] = useState(false)  const [action, setAction] = useState<Action>('menu')  const canCreate = useCanCreate()  const closeAll = () => { setOpen(false); setAction('menu') }  return (    <>      <Button        onClick={() => { setOpen(true); setAction('menu') }}        className="bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/90 min-w-8 transition-all ease-out duration-200 active:scale-95 h-8 px-3 gap-2"      >        <IconCirclePlusFilled className="size-4" />        <span>Creación rápida</span>      </Button>      <Sheet open={open} onOpenChange={setOpen}>        <SheetContent className="sm:max-w-[520px]">          {action === 'menu' && <Menu onPick={(a)=>setAction(a)} canCreate={canCreate} />}          {action === 'newClient' && canCreate && <NewClient onDone={closeAll} onBack={()=>setAction('menu')} />}          {action === 'sale' && canCreate && <RegisterSaleSplit onDone={closeAll} onBack={()=>setAction('menu')} />}          {action === 'prepay' && canCreate && <PrepayMonths onDone={closeAll} onBack={()=>setAction('menu')} />}          {action === 'newSection' && <NewSection onDone={closeAll} onBack={()=>setAction('menu')} />}        </SheetContent>      </Sheet>    </>  )}function Menu({ onPick, canCreate }: { onPick: (a: Action)=>void; canCreate: boolean }) {  return (    <div className="space-y-4">      <SheetHeader>        <SheetTitle>Creación rápida</SheetTitle>        <SheetDescription>Acciones frecuentes del panel</SheetDescription>      </SheetHeader>      <Separator />      <div className="grid gap-3">        {canCreate && <Button variant="outline" onClick={()=>onPick('newClient')}>Nuevo cliente</Button>}        {canCreate && <Button variant="outline" onClick={()=>onPick('sale')}>Registrar venta</Button>}        {canCreate && <Button variant="outline" onClick={()=>onPick('prepay')}>Prepagar meses</Button>}        <Button variant="outline" onClick={()=>onPick('newSection')}>Nueva sección de documento</Button>      </div>    </div>  )}function NewClient({ onDone, onBack }: { onDone: ()=>void; onBack: ()=>void }) {  const [name, setName] = useState('')  const [phone, setPhone] = useState('')  const [code, setCode] = useState('')  const [createSub, setCreateSub] = useState(true)  const [saving, setSaving] = useState(false)  const submit = async () => {    if (!name.trim()) { toast.error('Nombre requerido'); return }    setSaving(true)    try {      await createCustomer({ name: name.trim(), phone: phone || undefined, code: code || undefined, createSubscription: createSub })      toast.success('Cliente creado')      onDone()    } catch (e: any) {      toast.error(e?.message || 'Error al crear cliente')    } finally { setSaving(false) }  }  return (    <div className="space-y-4">      <SheetHeader>        <SheetTitle>Nuevo cliente</SheetTitle>        <SheetDescription>Registra un cliente. Moneda: BOB</SheetDescription>      </SheetHeader>      <div className="grid gap-3">        <div>          <Label>Nombre</Label>          <Input value={name} onChange={(e)=>setName(e.target.value)} placeholder="Juan Pérez" />        </div>        <div>          <Label>Teléfono (opcional)</Label>          <Input value={phone} onChange={(e)=>setPhone(e.target.value)} placeholder="70000000" />        </div>        <div>          <Label>Código (opcional)</Label>          <Input value={code} onChange={(e)=>setCode(e.target.value)} placeholder="C123" />        </div>        <div className="flex items-center gap-2">          <input id="mk-sub" type="checkbox" checked={createSub} onChange={(e)=>setCreateSub(e.target.checked)} />          <Label htmlFor="mk-sub">Crear suscripción mensual</Label>        </div>        <div className="flex gap-2 pt-2">          <Button variant="outline" onClick={onBack}>Volver</Button>          <Button onClick={submit} disabled={saving}>{saving ? 'Guardando…' : 'Crear cliente'}</Button>        </div>      </div>    </div>  )}function RegisterSale({ onDone, onBack }: { onDone: ()=>void; onBack: ()=>void }) {
function RegisterSaleSplit({ onDone, onBack }: { onDone: ()=>void; onBack: ()=>void }) {
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
  useEffect(() => { (async()=>{ const { data } = await listTeamMembers(); const list = (data||[]) as any[]; setMembers(list); setSelected(list.map(m=>m.id)) })() }, [])
  useEffect(() => { if (!customerId) return; (async()=>{ const { data } = await listSubscriptionsByCustomer(customerId); setSubs(data||[]); setSubId(data?.[0]?.id||'') })() }, [customerId])

  const submit = async () => {
    const cents = Math.round((parseFloat(amountBs || '0') || 0) * 100)
    if (!customerId) { toast.error('Selecciona cliente'); return }
    if (cents <= 0) { toast.error('Monto inv�lido'); return }
    if (!selected.length) { toast.error('Selecciona al menos un miembro'); return }
    setSaving(true)
    try {
      await createPayment({ customer_id: customerId, subscription_id: subId || undefined, amount_cents: cents, note })
      try { await registerSaleWithSplit({ customer_id: customerId, amount_cents: cents, note, member_ids: selected }) } catch {}
      toast.success(`Venta registrada: ${formatBs(cents)}`)
      onDone()
    } catch (e:any) { toast.error(e?.message || 'Error al registrar venta') } finally { setSaving(false) }
  }

  return (
    <div className="space-y-4">
      <SheetHeader>
        <SheetTitle>Registrar venta</SheetTitle>
        <SheetDescription>Registra un pago/venta en BOB</SheetDescription>
      </SheetHeader>
      <div className="grid gap-3">
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
          <Label>Suscripci�n (opcional)</Label>
          <Select value={subId} onValueChange={setSubId}>
            <SelectTrigger><SelectValue placeholder="Sin suscripci�n" /></SelectTrigger>
            <SelectContent>
              {(subs||[]).map(s => (<SelectItem key={s.id} value={s.id}>{s.plan_id ?? 'plan'} � {s.status}</SelectItem>))}
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
            <button type="button" className="text-xs underline hover:opacity-80" onClick={() => setSelected(members.map(m=>m.id))}>Seleccionar todos</button>
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
            return <div className="text-xs text-muted-foreground mt-2">{selected.length ? `Se acreditar� ${formatBs(each)} a cada uno (resto al primero).` : 'Selecciona miembros para repartir.'}</div>
          })()}
        </div>
        <div>
          <Label>Nota (opcional)</Label>
          <Input value={note} onChange={e=>setNote(e.target.value)} placeholder="Detalle de la venta" />
        </div>
        <div className="flex gap-2 pt-2">
          <Button variant="outline" onClick={onBack}>Volver</Button>
          <Button onClick={submit} disabled={saving}>{saving ? 'Guardando�' : 'Registrar venta'}</Button>
        </div>
      </div>
    </div>
  )
}  const [customers, setCustomers] = useState<any[]>([])  const [customerId, setCustomerId] = useState('')  const [subs, setSubs] = useState<any[]>([])  const [subId, setSubId] = useState<string>('')  const [amountBs, setAmountBs] = useState('')  const [note, setNote] = useState('')  const [saving, setSaving] = useState(false)  useEffect(() => {    (async () => {      const { data, error } = await listCustomers()      if (!error) setCustomers(data || [])    })()  }, [])  useEffect(() => {    if (!customerId) return    (async () => {      const { data } = await listSubscriptionsByCustomer(customerId)      setSubs(data || [])      setSubId(data?.[0]?.id || '')    })()  }, [customerId])  const submit = async () => {    const cents = Math.round((parseFloat(amountBs || '0') || 0) * 100)    if (!customerId) { toast.error('Selecciona cliente'); return }    if (cents <= 0) { toast.error('Monto inválido'); return }    setSaving(true)    try {      await createPayment({ customer_id: customerId, subscription_id: subId || undefined, amount_cents: cents, note })      toast.success(`Venta registrada: ${formatBs(cents)}`)      onDone()    } catch (e: any) { toast.error(e?.message || 'Error al registrar venta') } finally { setSaving(false) }  }  return (    <div className="space-y-4">      <SheetHeader>        <SheetTitle>Registrar venta</SheetTitle>        <SheetDescription>Registra un pago/venta en BOB</SheetDescription>      </SheetHeader>      <div className="grid gap-3">        <div>          <Label>Cliente</Label>          <Select value={customerId} onValueChange={setCustomerId}>            <SelectTrigger><SelectValue placeholder="Selecciona cliente" /></SelectTrigger>            <SelectContent>              {(customers||[]).map(c => (<SelectItem key={c.id} value={c.id}>{c.name ?? c.code ?? c.id.slice(0,6)}</SelectItem>))}            </SelectContent>          </Select>        </div>        <div>          <Label>Suscripción (opcional)</Label>          <Select value={subId} onValueChange={setSubId}>            <SelectTrigger><SelectValue placeholder="Sin suscripción" /></SelectTrigger>            <SelectContent>              {(subs||[]).map(s => (<SelectItem key={s.id} value={s.id}>{s.plan_id ?? 'plan'} — {s.status}</SelectItem>))}            </SelectContent>          </Select>        </div>        <div>          <Label>Monto (Bs)</Label>          <Input type="number" min={0} step="0.01" value={amountBs} onChange={e=>setAmountBs(e.target.value)} placeholder="0.00" />        </div>        <div>          <Label>Nota (opcional)</Label>          <Input value={note} onChange={e=>setNote(e.target.value)} placeholder="Detalle de la venta" />        </div>        <div className="flex gap-2 pt-2">          <Button variant="outline" onClick={onBack}>Volver</Button>          <Button onClick={submit} disabled={saving}>{saving ? 'Guardando…' : 'Registrar venta'}</Button>        </div>      </div>    </div>  )}function PrepayMonths({ onDone, onBack }: { onDone: ()=>void; onBack: ()=>void }) {  const [customers, setCustomers] = useState<any[]>([])  const [customerId, setCustomerId] = useState('')  const [subs, setSubs] = useState<any[]>([])  const [subId, setSubId] = useState('')  const [months, setMonths] = useState('1')  const [priceBs, setPriceBs] = useState('0')  const [saving, setSaving] = useState(false)  useEffect(() => { (async()=>{ const { data } = await listCustomers(); setCustomers(data||[]) })() }, [])  useEffect(() => {    if (!customerId) return; (async()=>{ const { data } = await listSubscriptionsByCustomer(customerId); setSubs(data||[]); setSubId(data?.[0]?.id||'') })()  }, [customerId])  const submit = async () => {    const m = Math.max(1, parseInt(months||'1',10))    const price = Math.round((parseFloat(priceBs||'0')||0)*100)    if (!subId) { toast.error('Selecciona suscripción'); return }    if (price<=0) { toast.error('Precio mensual inválido'); return }    setSaving(true)    try {      await prepayMonths({ subscription_id: subId, months: m, month_price_cents: price })      toast.success(`Añadidos ${m} meses — ${formatBs(price*m)}`)      onDone()    } catch (e:any) { toast.error(e?.message || 'Error al prepagar') } finally { setSaving(false) }  }  return (    <div className="space-y-4">      <SheetHeader>        <SheetTitle>Prepagar meses</SheetTitle>        <SheetDescription>Aplica prepagos para una suscripción</SheetDescription>      </SheetHeader>      <div className="grid gap-3">        <div>          <Label>Cliente</Label>          <Select value={customerId} onValueChange={setCustomerId}>            <SelectTrigger><SelectValue placeholder="Selecciona cliente" /></SelectTrigger>            <SelectContent>              {(customers||[]).map(c => (<SelectItem key={c.id} value={c.id}>{c.name ?? c.code ?? c.id.slice(0,6)}</SelectItem>))}            </SelectContent>          </Select>        </div>        <div>          <Label>Suscripción</Label>          <Select value={subId} onValueChange={setSubId}>            <SelectTrigger><SelectValue placeholder="Selecciona suscripción" /></SelectTrigger>            <SelectContent>              {(subs||[]).map(s => (<SelectItem key={s.id} value={s.id}>{s.plan_id ?? 'plan'} — {s.status}</SelectItem>))}            </SelectContent>          </Select>        </div>        <div className="grid grid-cols-2 gap-3">          <div>            <Label>Meses</Label>            <Input type="number" min={1} value={months} onChange={e=>setMonths(e.target.value)} />          </div>          <div>            <Label>Precio mensual (Bs)</Label>            <Input type="number" min={0} step="0.01" value={priceBs} onChange={e=>setPriceBs(e.target.value)} />          </div>        </div>        <div className="flex gap-2 pt-2">          <Button variant="outline" onClick={onBack}>Volver</Button>          <Button onClick={submit} disabled={saving}>{saving ? 'Guardando…' : 'Aplicar prepago'}</Button>        </div>      </div>    </div>  )}function NewSection({ onDone, onBack }: { onDone: ()=>void; onBack: ()=>void }) {  const [proposals, setProposals] = useState<any[]>([])  const [proposalId, setProposalId] = useState('')  const [header, setHeader] = useState('')  const [type, setType] = useState('Narrative')  const [saving, setSaving] = useState(false)  useEffect(() => { (async()=>{ const { data } = await listProposals(); setProposals(data||[]) })() }, [])  const submit = async () => {    if (!proposalId) { toast.error('Selecciona documento'); return }    if (!header.trim()) { toast.error('Header requerido'); return }    setSaving(true)    try {      await addProposalSection({ proposal_id: proposalId, header: header.trim(), section_type: type })      toast.success('Sección creada')      onDone()    } catch (e:any) { toast.error(e?.message || 'Error al crear sección') } finally { setSaving(false) }  }  return (    <div className="space-y-4">      <SheetHeader>        <SheetTitle>Nueva sección de documento</SheetTitle>        <SheetDescription>Agrega una sección a un documento existente</SheetDescription>      </SheetHeader>      <div className="grid gap-3">        <div>          <Label>Documento</Label>          <Select value={proposalId} onValueChange={setProposalId}>            <SelectTrigger><SelectValue placeholder="Selecciona documento" /></SelectTrigger>            <SelectContent>              {(proposals||[]).map(p => (<SelectItem key={p.id} value={p.id}>{p.title ?? p.id.slice(0,6)}</SelectItem>))}            </SelectContent>          </Select>        </div>        <div>          <Label>Header</Label>          <Input value={header} onChange={e=>setHeader(e.target.value)} placeholder="Cover page" />        </div>        <div>          <Label>Tipo</Label>          <Select value={type} onValueChange={setType}>            <SelectTrigger><SelectValue /></SelectTrigger>            <SelectContent>              {['Narrative','Technical content','Visual','Legal','Planning'].map(t => (<SelectItem key={t} value={t}>{t}</SelectItem>))}            </SelectContent>          </Select>        </div>        <div className="flex gap-2 pt-2">          <Button variant="outline" onClick={onBack}>Volver</Button>          <Button onClick={submit} disabled={saving}>{saving ? 'Guardando…' : 'Crear sección'}</Button>        </div>      </div>    </div>  )}export default QuickCreate

