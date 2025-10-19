"use client"

import { useEffect, useMemo, useState } from 'react'
import { IconCirclePlusFilled } from "@tabler/icons-react"
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Separator } from '@/components/ui/separator'

import {
  formatBs,
  listCustomers,
  listSubscriptionsByCustomer,
  prepayMonths,
  listTeamMembers,
  registerSaleWithSplit,
} from '@/services/dashboard'
import { useCanCreate } from '@/hooks/useCanCreate'

import NewCustomerModal from './NewCustomerModal'
import NewSectionModal from './NewSectionModal'

type Action = 'menu' | 'sale' | 'prepay'

export function QuickCreate() {
  const [open, setOpen] = useState(false)
  const [action, setAction] = useState<Action>('menu')
  const canCreate = useCanCreate()

  const [showNewCustomer, setShowNewCustomer] = useState(false)
  const [showNewSection, setShowNewSection] = useState(false)

  const handlePick = (key: 'newClient' | 'sale' | 'prepay' | 'newSection') => {
    if (key === 'newClient') {
      setOpen(false)
      setAction('menu')
      setShowNewCustomer(true)
      return
    }
    if (key === 'newSection') {
      setOpen(false)
      setAction('menu')
      setShowNewSection(true)
      return
    }
    // inline forms inside the sheet
    if (key === 'sale') setAction('sale')
    if (key === 'prepay') setAction('prepay')
  }

  const closeAll = () => {
    setOpen(false)
    setAction('menu')
  }

  return (
    <>
      <Button
        onClick={() => { setOpen(true); setAction('menu') }}
        className="bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/90 min-w-8 transition-all ease-out duration-200 active:scale-95 h-8 px-3 gap-2"
      >
        <IconCirclePlusFilled className="size-4" />
        <span>Creación rápida</span>
      </Button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent className="sm:max-w-[520px]">
          {action === 'menu' && (
            <Menu onPick={handlePick} canCreate={canCreate} />
          )}
          {action === 'sale' && canCreate && (
            <RegisterSaleSplit onDone={closeAll} onBack={() => setAction('menu')} />
          )}
          {action === 'prepay' && canCreate && (
            <PrepayMonths onDone={closeAll} onBack={() => setAction('menu')} />
          )}
        </SheetContent>
      </Sheet>

      {/* External modals/sheets opened separately */}
      {showNewCustomer && (
        <NewCustomerModal
          open={showNewCustomer}
          onOpenChange={(o) => setShowNewCustomer(o)}
          onCreated={() => toast.success('Cliente creado')}
        />
      )}
      {showNewSection && (
        <NewSectionModal
          open={showNewSection}
          onOpenChange={(o) => setShowNewSection(o)}
          onCreated={() => toast.success('Sección creada')}
        />
      )}
    </>
  )
}

function Menu({ onPick, canCreate }: { onPick: (k: 'newClient' | 'sale' | 'prepay' | 'newSection') => void; canCreate: boolean }) {
  return (
    <div className="space-y-4">
      <SheetHeader>
        <SheetTitle>Creación rápida</SheetTitle>
        <SheetDescription>Accesos rápidos del panel</SheetDescription>
      </SheetHeader>
      <Separator />
      <div className="grid gap-3">
        {canCreate && (
          <Button variant="outline" onClick={() => onPick('newClient')}>Nuevo cliente</Button>
        )}
        {canCreate && (
          <Button variant="outline" onClick={() => onPick('sale')}>Registrar venta</Button>
        )}
        {canCreate && (
          <Button variant="outline" onClick={() => onPick('prepay')}>Prepagar meses</Button>
        )}
        <Button variant="outline" onClick={() => onPick('newSection')}>Nueva sección de documento</Button>
      </div>
    </div>
  )
}

function RegisterSaleSplit({ onDone, onBack }: { onDone: () => void; onBack: () => void }) {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [customers, setCustomers] = useState<any[]>([])
  const [customerId, setCustomerId] = useState('')

  const [team, setTeam] = useState<{ id: string; name: string }[]>([])
  const [selected, setSelected] = useState<string[]>([])

  const [amountBs, setAmountBs] = useState('35')
  const [note, setNote] = useState('')

  useEffect(() => {
    (async () => {
      try {
        const { data: cs } = await listCustomers()
        setCustomers(cs || [])
        if ((cs || []).length) setCustomerId(cs![0].id)
      } catch (_) {
        setCustomers([])
      }
      try {
        const { data: members } = await listTeamMembers()
        const rows = (members || []).map((m: any) => ({ id: m.id, name: m.name || m.id.slice(0, 8) }))
        setTeam(rows)
      } catch (_) {
        setTeam([])
      }
      setLoading(false)
    })()
  }, [])

  const submit = async () => {
    if (!customerId) { toast.error('Selecciona cliente'); return }
    if (!selected.length) { toast.error('Selecciona al menos un miembro'); return }
    const cents = Math.round((parseFloat(amountBs || '0') || 0) * 100)
    if (cents <= 0) { toast.error('Monto inválido'); return }
    setSaving(true)
    try {
      await registerSaleWithSplit({ customer_id: customerId, amount_cents: cents, note: note || undefined, member_ids: selected })
      toast.success('Venta registrada')
      onDone()
    } catch (e: any) {
      toast.error(e?.message || 'Error al registrar venta')
    } finally { setSaving(false) }
  }

  return (
    <div className="space-y-4">
      <SheetHeader>
        <SheetTitle>Registrar venta</SheetTitle>
        <SheetDescription>Registra una venta y divide ganancias</SheetDescription>
      </SheetHeader>
      {loading ? (
        <div className="text-sm text-muted-foreground">Cargando…</div>
      ) : (
        <div className="grid gap-3">
          <div>
            <Label>Cliente</Label>
            <Select value={customerId} onValueChange={setCustomerId}>
              <SelectTrigger><SelectValue placeholder="Selecciona cliente" /></SelectTrigger>
              <SelectContent className="max-h-72">
                {(customers || []).map((c: any) => {
                  const name = c?.customer_profiles?.name || c?.code || c?.id?.slice(0, 8)
                  return <SelectItem key={c.id} value={c.id}>{name}</SelectItem>
                })}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <Label>Monto (BOB)</Label>
              <Input value={amountBs} onChange={(e) => setAmountBs(e.target.value)} placeholder="35" type="number" min="0" step="0.01" />
            </div>
            <div>
              <Label>Vista previa</Label>
              <div className="h-10 flex items-center text-sm text-muted-foreground">{formatBs(Math.round((parseFloat(amountBs || '0') || 0) * 100))}</div>
            </div>
          </div>
          <div>
            <Label>Nota (opcional)</Label>
            <Input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Descripción corta" />
          </div>
          <div>
            <Label>Miembros</Label>
            <div className="flex flex-wrap gap-2 pt-1">
              {team.map((m) => (
                <label key={m.id} className="inline-flex items-center gap-2 rounded-md border px-2 py-1 text-sm cursor-pointer select-none">
                  <input
                    type="checkbox"
                    className="accent-primary"
                    checked={selected.includes(m.id)}
                    onChange={(e) => {
                      const on = e.target.checked
                      setSelected((prev) => on ? [...prev, m.id] : prev.filter((x) => x !== m.id))
                    }}
                  />
                  <span>{m.name}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            <Button variant="outline" onClick={onBack}>Volver</Button>
            <Button onClick={submit} disabled={saving}>{saving ? 'Guardando…' : 'Registrar'}</Button>
          </div>
        </div>
      )}
    </div>
  )
}

function PrepayMonths({ onDone, onBack }: { onDone: () => void; onBack: () => void }) {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [customers, setCustomers] = useState<any[]>([])
  const [customerId, setCustomerId] = useState('')

  const [subs, setSubs] = useState<any[]>([])
  const [subscriptionId, setSubscriptionId] = useState('')

  const [priceBs, setPriceBs] = useState('35')
  const [months, setMonths] = useState('1')

  useEffect(() => {
    (async () => {
      try {
        const { data: cs } = await listCustomers()
        setCustomers(cs || [])
        if ((cs || []).length) setCustomerId(cs![0].id)
      } catch (_) {
        setCustomers([])
      }
      setLoading(false)
    })()
  }, [])

  useEffect(() => {
    (async () => {
      if (!customerId) { setSubs([]); setSubscriptionId(''); return }
      const { data } = await listSubscriptionsByCustomer(customerId)
      setSubs(data || [])
      setSubscriptionId((data || [])[0]?.id || '')
    })()
  }, [customerId])

  const submit = async () => {
    if (!subscriptionId) { toast.error('Selecciona suscripción'); return }
    const m = Math.max(1, Math.floor(Number(months || '1')))
    const cents = Math.round((parseFloat(priceBs || '0') || 0) * 100)
    if (cents <= 0) { toast.error('Precio inválido'); return }
    setSaving(true)
    try {
      await prepayMonths({ subscription_id: subscriptionId, months: m, month_price_cents: cents })
      toast.success('Prepago registrado')
      onDone()
    } catch (e: any) {
      toast.error(e?.message || 'Error al registrar prepago')
    } finally { setSaving(false) }
  }

  return (
    <div className="space-y-4">
      <SheetHeader>
        <SheetTitle>Prepagar meses</SheetTitle>
        <SheetDescription>Registra un prepago de suscripción</SheetDescription>
      </SheetHeader>
      {loading ? (
        <div className="text-sm text-muted-foreground">Cargando…</div>
      ) : (
        <div className="grid gap-3">
          <div>
            <Label>Cliente</Label>
            <Select value={customerId} onValueChange={setCustomerId}>
              <SelectTrigger><SelectValue placeholder="Selecciona cliente" /></SelectTrigger>
              <SelectContent className="max-h-72">
                {(customers || []).map((c: any) => {
                  const name = c?.customer_profiles?.name || c?.code || c?.id?.slice(0, 8)
                  return <SelectItem key={c.id} value={c.id}>{name}</SelectItem>
                })}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Suscripción</Label>
            <Select value={subscriptionId} onValueChange={setSubscriptionId}>
              <SelectTrigger><SelectValue placeholder="Selecciona suscripción" /></SelectTrigger>
              <SelectContent>
                {(subs || []).map((s: any) => (
                  <SelectItem key={s.id} value={s.id}>{s.id.slice(0, 8)} - {s.status}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <Label>Precio/mes (BOB)</Label>
              <Input value={priceBs} onChange={(e) => setPriceBs(e.target.value)} placeholder="35" type="number" min="0" step="0.01" />
            </div>
            <div>
              <Label>Meses</Label>
              <Input value={months} onChange={(e) => setMonths(e.target.value)} placeholder="1" type="number" min="1" />
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            <Button variant="outline" onClick={onBack}>Volver</Button>
            <Button onClick={submit} disabled={saving}>{saving ? 'Guardando…' : 'Registrar'}</Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default QuickCreate

