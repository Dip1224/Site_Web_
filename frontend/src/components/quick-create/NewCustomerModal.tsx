"use client"
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { createCustomer } from '@/services/customers'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { ensureSession } from '@/lib/session'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldLegend, FieldSeparator, FieldSet } from '@/components/ui/field'
import { Checkbox } from '@/components/ui/checkbox'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { CalendarIcon } from 'lucide-react'

export function NewCustomerModal({ open, onOpenChange, onCreated }: { open: boolean; onOpenChange: (o: boolean)=>void; onCreated?: ()=>void }) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [code, setCode] = useState('')
  const [productId, setProductId] = useState<string>('')
  const [priceBs, setPriceBs] = useState<string>('35')
  const [months, setMonths] = useState<string>('1')
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false)
  const [creationDate, setCreationDate] = useState<string>(() => new Date().toISOString().slice(0,10))
  const [calOpen, setCalOpen] = useState(false)
  const [calMonth, setCalMonth] = useState<Date | undefined>(() => new Date())
  const [calValue, setCalValue] = useState<string>(() => new Date().toLocaleDateString('es-BO', { day: '2-digit', month: 'long', year: 'numeric' }))
  const [createSub, setCreateSub] = useState(true)
  const [saving, setSaving] = useState(false)
  const [products, setProducts] = useState<{ id: string; name: string; short_code: string }[]>([])
  const { user } = useAuth()

  useEffect(() => {
    (async () => {
      try {
        await ensureSession()
        const call = async (retry = false) => {
          const { data, error } = await supabase
            .from('products')
            .select('id, name, short_code')
            .eq('active', true)
            .order('short_code')
          const status = (error as any)?.status
          if (status === 429 && !retry) {
            await new Promise((r) => setTimeout(r, 1100))
            return call(true)
          }
          if (error) throw error
          return data || []
        }
        const data = await call(false)
        setProducts(data || [])
        if (!productId && (data||[]).length) setProductId(data![0].id)
      } catch (_) {
        setProducts([])
      }
    })()
  }, [])

  const submit = async () => {
    if (!name.trim()) { toast.error('Nombre requerido'); return }
    setSaving(true)
    try {
      // Cerrar optimÃ­sticamente para mejorar UX; si falla, reabrimos
      const month_price_cents = Math.round((parseFloat(priceBs || '35') || 35) * 100)
      const m = Math.max(1, Math.floor(Number(months || '1'))) || 1
      await createCustomer({ name: name.trim(), phone: phone || undefined, code: code || undefined, product_id: productId || undefined, createSubscription: createSub, month_price_cents, months: m, created_at: creationDate ? new Date(creationDate).toISOString() : undefined }, user?.id)
      toast.success('Cliente creado')
      onCreated?.()
      // Resetear campos para prÃ³xima vez
      onOpenChange(false)
      // Resetear campos para proxima vez
      setName(''); setPhone(''); setCode(''); setProductId(products[0]?.id||''); setPriceBs('35'); setMonths('1'); setCreateSub(true); setShowAdvanced(false); setCreationDate(new Date().toISOString().slice(0,10))
    } catch (e:any) {
      // Si fallÃ³, reabrimos para que el usuario vea el error y corrija
      onOpenChange(true)
      toast.error(e?.message || 'Error al crear cliente')
    } finally { setSaving(false) }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nuevo cliente</DialogTitle>
          <DialogDescription>Registra un cliente. Moneda: BOB</DialogDescription>
        </DialogHeader>
        <form onSubmit={(e)=>{ e.preventDefault(); submit() }}>
          <FieldGroup>
            <FieldSet>
              <FieldLegend>Datos del cliente</FieldLegend>
              <FieldDescription>El cÃ³digo se autogenera por producto si lo dejas vacÃ­o.</FieldDescription>
              <Field>
                <FieldLabel>Producto</FieldLabel>
                <Select value={productId} onValueChange={setProductId}>
                  <SelectTrigger className="w-full"><SelectValue placeholder="Selecciona producto" /></SelectTrigger>
                  <SelectContent className="rounded-xl">
                    {products.map(p => (
                      <SelectItem key={p.id} value={p.id}>{p.short_code} - {p.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field>
                <FieldLabel htmlFor="nc-name">Nombre</FieldLabel>
                <Input id="nc-name" value={name} onChange={(e)=>setName(e.target.value)} placeholder="Juan Perez" required />
              </Field>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field>
                  <FieldLabel htmlFor="nc-phone">Telefono</FieldLabel>
                  <Input id="nc-phone" value={phone} onChange={(e)=>setPhone(e.target.value)} placeholder="70000000" />
                </Field>
                <Field>
                  <FieldLabel htmlFor="nc-code">Codigo (opcional)</FieldLabel>
                  <Input id="nc-code" value={code} onChange={(e)=>setCode(e.target.value)} placeholder="2C001" />
                </Field>
              </div>
            </FieldSet>
            <FieldSeparator />
            <FieldSet>
              <FieldLegend>Suscripcion</FieldLegend>
              <Field orientation="horizontal">
                <Checkbox id="mk-sub" checked={createSub} onCheckedChange={(v)=>setCreateSub(!!v)} />
                <FieldLabel htmlFor="mk-sub" className="font-normal">Crear suscripcion mensual</FieldLabel>
              </Field>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field>
                  <FieldLabel htmlFor="nc-price">Precio/mes (BOB)</FieldLabel>
                  <Input id="nc-price" value={priceBs} onChange={(e)=>setPriceBs(e.target.value)} placeholder="35" type="number" min="0" step="0.01" />
                </Field>
                <Field>
                  <FieldLabel htmlFor="nc-months">Meses</FieldLabel>
                  <Input id="nc-months" value={months} onChange={(e)=>setMonths(e.target.value)} placeholder="1" type="number" min="1" />
                </Field>
              </div>
            </FieldSet>
            <FieldSeparator />
            <FieldSet>
              <FieldLegend>
                <button type="button" className="w-full text-left flex items-center justify-between" onClick={()=>setShowAdvanced(s=>!s)}>
                  Configuracion avanzada
                  <span className="text-xs text-muted-foreground">{showAdvanced ? 'ocultar' : 'mostrar'}</span>
                </button>
              </FieldLegend>
              {showAdvanced && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel htmlFor="date-picker-btn">Fecha de creacion</FieldLabel>
                    <Popover open={calOpen} onOpenChange={setCalOpen}>
                      <PopoverTrigger asChild>
                        <Button id="date-picker-btn" type="button" variant="outline" className="justify-between font-normal w-full">
                          <span>{calValue || 'Selecciona fecha'}</span>
                          <CalendarIcon className="ml-2 h-4 w-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto overflow-hidden p-0" align="end" alignOffset={-8} sideOffset={10}>
                        <Calendar
                          mode="single"
                          selected={creationDate ? new Date(creationDate) : undefined}
                          captionLayout="dropdown"
                          month={calMonth}
                          onMonthChange={setCalMonth}
                          autoOpen
                          onSelect={(d)=>{ if (d) { setCreationDate(d.toISOString().slice(0,10)); setCalValue(d.toLocaleDateString('es-BO', { day: '2-digit', month: 'long', year: 'numeric' })) }; setCalOpen(false) }}
                          className="rounded-md border shadow-sm"
                        />
                      </PopoverContent>
                    </Popover>
                  </Field>
                </div>
              )}
            </FieldSet>
            <Field orientation="horizontal">
              <Button type="submit" disabled={saving}>{saving ? 'Creando...' : 'Crear cliente'}</Button>
              <Button type="button" variant="outline" onClick={()=>onOpenChange(false)}>Cancelar</Button>
            </Field>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default NewCustomerModal

