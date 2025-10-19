import { useEffect, useState } from 'react'
import { Separator } from '@/components/ui/separator'
import { supabase } from '@/lib/supabase'
import { ensureSession } from '@/lib/session'
import { formatBs } from '@/services/dashboard'
import { useAuth } from '@/contexts/AuthContext'

export default function GananciasPage() {
  const { isAuthenticated, isLoading } = useAuth()
  const [today, setToday] = useState(0)
  const [month, setMonth] = useState(0)
  const [count, setCount] = useState(0)
  // Removed member distribution state as the section is no longer displayed

  useEffect(() => {
    if (isLoading || !isAuthenticated) return
    (async () => {
      await ensureSession()
      // One-shot backoff if rate limited
      const call = async (retry = false): Promise<any> => {
        const { data, error } = await supabase.rpc('ganancias_overview')
        const status = (error as any)?.status
        if (status === 429 && !retry) {
          await new Promise((r) => setTimeout(r, 1100))
          return call(true)
        }
        if (error) throw error
        return data
      }
      try {
        const data = await call(false)
        const totals = (data as any)?.totals || { month_total_cents: 0, today_total_cents: 0, month_count: 0 }
        setMonth(Number(totals.month_total_cents) || 0)
        setToday(Number(totals.today_total_cents) || 0)
        setCount(Number(totals.month_count) || 0)
      } catch (e) {
        console.error('ganancias_overview error', e)
      }
    })()
  }, [isAuthenticated, isLoading])

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">Ganancias</h1>
      <Separator />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border p-4">
          <div className="text-muted-foreground">Mi ingreso hoy</div>
          <div className="text-2xl font-semibold">{formatBs(today)}</div>
        </div>
        <div className="rounded-xl border p-4">
          <div className="text-muted-foreground">Mi ingreso este mes</div>
          <div className="text-2xl font-semibold">{formatBs(month)}</div>
        </div>
        <div className="rounded-xl border p-4">
          <div className="text-muted-foreground">Ventas este mes</div>
          <div className="text-2xl font-semibold">{count}</div>
        </div>
      </div>

    </div>
  )
}
