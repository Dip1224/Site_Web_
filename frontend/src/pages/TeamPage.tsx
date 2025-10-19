import { useEffect, useState } from 'react'
import { listProfiles } from '@/services/dashboard'

export default function TeamPage() {
  const [rows, setRows] = useState<any[]>([])
  useEffect(()=>{ (async()=>{ const { data } = await listProfiles(); setRows(data||[]) })() },[])
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">Team</h1>
      <div className="rounded-xl border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted">
            <tr>
              <th className="text-left p-3">Nombre</th>
              <th className="text-left p-3">Desde</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.id} className="border-t">
                <td className="p-3">{r.name ?? r.id.slice(0,8)}</td>
                <td className="p-3">{new Date(r.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
