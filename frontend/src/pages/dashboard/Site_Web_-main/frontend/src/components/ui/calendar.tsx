"use client"
import * as React from "react"

type CalendarProps = {
  selected?: Date
  onSelect?: (d?: Date) => void
  className?: string
  mode?: string
  captionLayout?: string
  month?: Date
  onMonthChange?: (d?: Date) => void
  autoOpen?: boolean
}

function daysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}

function startOfMonthMondayIndex(year: number, month: number) {
  // JS: 0=Sun..6=Sat -> Monday-first index
  const d = new Date(year, month, 1).getDay()
  return (d + 6) % 7
}

export function Calendar({ selected, onSelect, className, captionLayout, month, onMonthChange }: CalendarProps) {
  const today = React.useMemo(() => new Date(), [])
  const base = React.useMemo(() => month || selected || today, [month, selected, today])
  const [cur, setCur] = React.useState(new Date(base.getFullYear(), base.getMonth(), 1))

  React.useEffect(() => {
    if (month) setCur(new Date(month.getFullYear(), month.getMonth(), 1))
  }, [month?.getFullYear?.(), month?.getMonth?.()])

  const y = cur.getFullYear()
  const m = cur.getMonth()
  const start = startOfMonthMondayIndex(y, m)
  const total = daysInMonth(y, m)

  const cells: (number | null)[] = Array(42).fill(null)
  for (let i = 0; i < total; i++) cells[start + i] = i + 1

  const changeMonth = (delta: number) => {
    const n = new Date(y, m + delta, 1)
    setCur(n)
    onMonthChange?.(n)
  }

  const monthNames = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre']
  const years = Array.from({ length: 100 }, (_, i) => today.getFullYear() - 80 + i)

  const isSame = (a?: Date, yy?: number, mm?: number, dd?: number) => {
    return !!a && a.getFullYear() === yy && a.getMonth() === mm && a.getDate() === dd
  }

  return (
    <div className={`bg-popover text-popover-foreground p-3 ${className || ''}`}>
      <div className="flex items-center justify-between mb-2">
        {captionLayout === 'dropdown' ? (
          <div className="flex items-center gap-2">
            <select className="bg-background border rounded px-2 py-1 text-sm" value={m}
              onChange={(e)=>{ const n = new Date(y, Number(e.target.value), 1); setCur(n); onMonthChange?.(n) }}>
              {monthNames.map((name, idx) => (<option key={name} value={idx}>{name}</option>))}
            </select>
            <select className="bg-background border rounded px-2 py-1 text-sm" value={y}
              onChange={(e)=>{ const n = new Date(Number(e.target.value), m, 1); setCur(n); onMonthChange?.(n) }}>
              {years.map(yy => (<option key={yy} value={yy}>{yy}</option>))}
            </select>
          </div>
        ) : (
          <div className="font-medium capitalize">{monthNames[m]} {y}</div>
        )}
        <div className="flex items-center gap-1">
          <button type="button" className="h-7 w-7 rounded hover:bg-accent" onClick={()=>changeMonth(-1)} aria-label="Mes anterior">{'<'}</button>
          <button type="button" className="h-7 w-7 rounded hover:bg-accent" onClick={()=>changeMonth(1)} aria-label="Mes siguiente">{'>'}</button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-xs text-muted-foreground mb-1">
        {['L','M','X','J','V','S','D'].map(d => (<div key={d} className="py-1">{d}</div>))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((d, idx) => {
          if (d === null) return <div key={idx} className="h-8" />
          const isToday = isSame(today, y, m, d)
          const isSelected = isSame(selected, y, m, d)
          const classes = [
            'h-8 rounded text-sm',
            'hover:bg-accent hover:text-accent-foreground',
            isSelected ? 'bg-primary text-primary-foreground' : '',
            !isSelected && isToday ? 'border border-primary/50' : '',
          ].join(' ')
          return (
            <button key={idx} type="button" className={classes} onClick={()=> onSelect?.(new Date(y, m, d))}>
              {d}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default Calendar
