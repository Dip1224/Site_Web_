"use client"
import * as React from "react"

type PopoverCtx = {
  open: boolean
  setOpen: (o: boolean) => void
}

const Ctx = React.createContext<PopoverCtx | null>(null)

export function Popover({ open, onOpenChange, children }: { open?: boolean; onOpenChange?: (o: boolean)=>void; children: React.ReactNode }) {
  const [inner, setInner] = React.useState(false)
  const isControlled = typeof open === 'boolean'
  const value = React.useMemo<PopoverCtx>(()=>({
    open: isControlled ? (open as boolean) : inner,
    setOpen: (o: boolean) => {
      if (isControlled) onOpenChange?.(o)
      else setInner(o)
    }
  }), [isControlled, open, inner, onOpenChange])
  return <Ctx.Provider value={value}><div className="relative inline-block">{children}</div></Ctx.Provider>
}

export function PopoverTrigger({ asChild, children }: { asChild?: boolean; children: React.ReactElement }) {
  const ctx = React.useContext(Ctx)!
  if (asChild) {
    return React.cloneElement(children, {
      onClick: (e: any) => {
        children.props?.onClick?.(e)
        ctx.setOpen(!ctx.open)
      }
    })
  }
  return (
    <button type="button" onClick={()=>ctx.setOpen(!ctx.open)}>{children}</button>
  )
}

export function PopoverContent({ className = "", align, alignOffset: _alignOffset, sideOffset, children }: { className?: string; align?: 'start'|'center'|'end'; alignOffset?: number; sideOffset?: number; children: React.ReactNode }) {
  const ctx = React.useContext(Ctx)!
  const [entered, setEntered] = React.useState(false)
  React.useEffect(() => { if (ctx.open) { const id = requestAnimationFrame(()=>setEntered(true)); return () => { cancelAnimationFrame(id); setEntered(false) } } }, [ctx.open])
  if (!ctx.open) return null
  const alignClass = align === 'start' ? 'left-0' : align === 'end' ? 'right-0' : 'left-1/2 -translate-x-1/2'
  const offsetY = typeof sideOffset === 'number' ? `mt-${Math.max(0, Math.min(8, Math.round(sideOffset/4)) )}` : 'mt-2'
  return (
    <div className={`absolute ${offsetY} z-50 ${alignClass}`}>
      <div className={`rounded-md border bg-popover text-popover-foreground shadow-md transition ease-out duration-150 transform origin-top ${entered ? 'opacity-100 scale-100' : 'opacity-0 scale-95'} ${className}`}>
        {children}
      </div>
    </div>
  )
}
