"use client"
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet'
import { listProposals, addProposalSection } from '@/services/documents'

export function NewSectionModal({ open, onOpenChange, onCreated }: { open: boolean; onOpenChange: (o: boolean)=>void; onCreated?: ()=>void }) {
  const [proposals, setProposals] = useState<any[]>([])
  const [proposalId, setProposalId] = useState('')
  const [header, setHeader] = useState('')
  const [type, setType] = useState('Narrative')
  const [saving, setSaving] = useState(false)

  useEffect(() => { (async()=>{ const { data } = await listProposals(); setProposals(data||[]) })() }, [])

  const submit = async () => {
    if (!proposalId) { toast.error('Selecciona documento'); return }
    if (!header.trim()) { toast.error('Header requerido'); return }
    setSaving(true)
    try {
      await addProposalSection({ proposal_id: proposalId, header: header.trim(), section_type: type })
      toast.success('Sección creada')
      onCreated?.(); onOpenChange(false)
      setHeader(''); setType('Narrative')
    } catch (e:any) { toast.error(e?.message || 'Error al crear sección') } finally { setSaving(false) }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-[520px]">
        <SheetHeader>
          <SheetTitle>Nueva sección de documento</SheetTitle>
          <SheetDescription>Agrega una sección a un documento existente</SheetDescription>
        </SheetHeader>
        <div className="grid gap-3 py-4">
          <div>
            <Label>Documento</Label>
            <Select value={proposalId} onValueChange={setProposalId}>
              <SelectTrigger><SelectValue placeholder="Selecciona documento" /></SelectTrigger>
              <SelectContent>
                {(proposals||[]).map(p => (<SelectItem key={p.id} value={p.id}>{p.title ?? p.id.slice(0,6)}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Header</Label>
            <Input value={header} onChange={e=>setHeader(e.target.value)} placeholder="Cover page" />
          </div>
          <div>
            <Label>Tipo</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {['Narrative','Technical content','Visual','Legal','Planning'].map(t => (<SelectItem key={t} value={t}>{t}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2 pt-2">
            <Button variant="outline" onClick={()=>onOpenChange(false)}>Cancelar</Button>
            <Button onClick={submit} disabled={saving}>{saving ? 'Guardando…' : 'Crear sección'}</Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default NewSectionModal

