import { supabase } from '@/lib/supabase'
import { ensureSession } from '@/lib/session'

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms))
}

async function withAuthRetry(fn: () => PromiseLike<{ data: any; error: any }>, attempts = 2) {
  let last: any = null
  for (let i = 0; i < attempts; i++) {
    const { data, error } = await fn()
    if (!error) return { data, error: null }
    last = { data, error }
    const status = (error as any)?.status
    // Only retry on 401 (token refresh). Do NOT retry on 429 to avoid amplifying rate limits.
    if (status !== 401) return { data, error }
    await sleep(500 * (i + 1))
  }
  return last
}

export type DashboardCards = {
  total_revenue_cents: number
  new_customers: number
  active_accounts: number
  growth_rate_pct: number
}

export async function fetchDashboardCards(): Promise<DashboardCards | null> {
  await ensureSession()
  const { data, error } = await supabase.from('v_dashboard_cards').select('*').single()
  if (error) {
    console.error('fetchDashboardCards error', error)
    return null
  }
  return data as DashboardCards
}

export type TrafficPoint = { date: string; desktop: number; mobile: number }

export async function fetchTrafficDaily(days = 90): Promise<TrafficPoint[]> {
  await ensureSession()
  const since = new Date()
  since.setDate(since.getDate() - days)
  const { data, error } = await supabase
    .from('traffic_daily')
    .select('date, desktop, mobile')
    .gte('date', since.toISOString().slice(0, 10))
    .order('date', { ascending: true })

  if (error) {
    console.error('fetchTrafficDaily error', error)
    return []
  }
  return (data || []).map((r: any) => ({
    date: r.date,
    desktop: Number(r.desktop) || 0,
    mobile: Number(r.mobile) || 0,
  }))
}

// ===== New business views integration =====
export type DailyActivityPoint = { date: string; sales: number; messages: number }

export async function fetchDailyActivity(days = 90): Promise<DailyActivityPoint[]> {
  await ensureSession()
  const since = new Date()
  since.setDate(since.getDate() - days)
  const { data, error } = await supabase
    .from('v_daily_activity')
    .select('date, sales, messages')
    .gte('date', since.toISOString().slice(0, 10))
    .order('date', { ascending: true })

  if (error) {
    console.error('fetchDailyActivity error', error)
    return []
  }
  return (data || []).map((r: any) => ({
    date: r.date,
    sales: Number(r.sales) || 0,
    messages: Number(r.messages) || 0,
  }))
}

export type MemberEarnings = { member_id: string; member_name: string; amount_cents: number }

export async function fetchEarningsThisMonth(): Promise<MemberEarnings[]> {
  await ensureSession()
  const { data, error } = await supabase
    .from('v_earnings_this_month')
    .select('member_id, amount_cents')

  if (error) {
    console.error('fetchEarningsThisMonth error', error)
    return []
  }

  // Join with team_members to get a display name
  const { data: members, error: mErr } = await supabase
    .from('team_members')
    .select('id, name')
  if (mErr) {
    console.warn('fetchEarningsThisMonth members join warning', mErr)
  }
  const nameById = new Map<string, string>((members||[]).map((m: any)=>[m.id, m.name]))

  return (data || []).map((r: any) => ({
    member_id: r.member_id,
    member_name: nameById.get(r.member_id) || r.member_id.slice(0,8),
    amount_cents: Number(r.amount_cents) || 0,
  }))
}

export type SectionRow = {
  id: number
  header: string
  type: string
  status: string
  target: string
  limit: string
  reviewer: string
}

export async function fetchSections(_proposalId?: string): Promise<SectionRow[]> {
  await ensureSession()
  // If filtering by proposal is needed, switch to querying proposal_sections directly
  const { data, error } = await supabase.from('v_sections_with_reviewer').select('*')
  if (error) {
    console.error('fetchSections error', error)
    return []
  }
  return (data || []) as SectionRow[]
}

// ===== Helpers for BOB currency =====
export function formatBs(cents: number) {
  const bs = (cents ?? 0) / 100
  return bs.toLocaleString('es-BO', {
    style: 'currency',
    currency: 'BOB',
    minimumFractionDigits: 2,
  })
}

// ===== Quick Create services (using only allowed tables) =====
export async function listCustomers() {
  // Ensure session is loaded once before multiple queries (reduces concurrent refresh attempts)
  await ensureSession()
  // Step 1: base customers (safe)
  const { data: base, error: errBase } = await withAuthRetry(() =>
    supabase
      .from('customers')
      .select('id, code, product_id, user_id, status, created_at, expires_at')
      .order('created_at', { ascending: false })
  )

  if (errBase) {
    console.error('listCustomers base error', errBase)
    return { data: [], error: errBase }
  }

  const rows = base || []
  if (!rows.length) return { data: [], error: null }

  // Step 2: join products
  const productIds = Array.from(new Set(rows.map((r: any) => r.product_id).filter(Boolean)))
  let productsById = new Map<string, any>()
  if (productIds.length) {
    const { data: prod, error: errProd } = await supabase
      .from('products')
      .select('id, short_code, name')
      .in('id', productIds as any)
    if (!errProd && prod) {
      productsById = new Map(prod.map((p: any) => [p.id, p]))
    } else if (errProd) {
      console.warn('listCustomers products join warning', errProd)
    }
  }

  // Step 3: join customer_profiles
  const customerIds = rows.map((r: any) => r.id)
  let profileByCustomerId = new Map<string, any>()
  const { data: prof, error: errProf } = await supabase
    .from('customer_profiles')
    .select('customer_id, name, phone')
    .in('customer_id', customerIds as any)
  if (!errProf && prof) {
    profileByCustomerId = new Map(prof.map((p: any) => [p.customer_id, p]))
  } else if (errProf) {
    console.warn('listCustomers profiles join warning', errProf)
  }

  const enriched = rows.map((r: any) => ({
    ...r,
    products: r.product_id ? productsById.get(r.product_id) || null : null,
    customer_profiles: profileByCustomerId.get(r.id) || null,
  }))

  return { data: enriched, error: null }
}

export async function createCustomer(payload: {
  name: string
  phone?: string
  code?: string
  month_price_cents?: number
  months?: number
  product_id?: string
  createSubscription?: boolean
  created_at?: string
}, currentUserId?: string | null) {
  await ensureSession()
  // Respetar esquema actual: customers(id, user_id, status, created_at)
  const insertRow: any = { status: 'active' }
  if (currentUserId) insertRow.user_id = currentUserId
  if (payload.product_id) insertRow.product_id = payload.product_id
  if (payload.code) insertRow.code = payload.code
  if (payload.created_at) insertRow.created_at = payload.created_at
  if (payload.months && payload.months > 0) {
    const base = payload.created_at ? new Date(payload.created_at) : new Date()
    const dt = new Date(base)
    dt.setMonth(dt.getMonth() + Math.max(1, Number(payload.months)))
    insertRow.expires_at = dt.toISOString()
  }

  // Try insert; if we hit a transient 401 during refresh, wait and retry once
  const { data, error } = await withAuthRetry(() =>
    supabase
      .from('customers')
      .insert(insertRow)
      .select('id, code, product_id')
      .single()
  )
  if (error) throw error

  // guardar perfil (nombre/telefono) si existen
  if (payload.name || payload.phone) {
    const { error: profErr } = await withAuthRetry(() =>
      supabase
        .from('customer_profiles')
        .upsert({ customer_id: data!.id, name: payload.name || null, phone: payload.phone || null }, { onConflict: 'customer_id' })
    )
    if (profErr) throw profErr
  }

  if (payload.createSubscription) {
    const { error: subErr } = await withAuthRetry(() =>
      supabase.from('subscriptions').insert({
        customer_id: data!.id,
        plan_id: 'monthly',
        status: 'active',
        started_at: payload.created_at ?? new Date().toISOString(),
      })
    )
    if (subErr) throw subErr
  }
  return data!.id as string
}

export async function updateCustomer(id: string, changes: Partial<{ code: string; status: string; product_id: string }>) {
  await ensureSession()
  const { data, error } = await withAuthRetry(() =>
    supabase
      .from('customers')
      .update(changes)
      .eq('id', id)
      .select('id, code, status, product_id')
      .single()
  )
  return { data, error }
}

export async function deleteCustomer(id: string) {
  await ensureSession()
  const { error } = await withAuthRetry(() =>
    supabase
      .from('customers')
      .delete()
      .eq('id', id)
  )
  return { error }
}

export async function upsertCustomerProfile(id: string, changes: Partial<{ name: string; phone: string; email: string }>) {
  const payload: any = { customer_id: id }
  if (changes.name !== undefined) payload.name = changes.name
  if (changes.phone !== undefined) payload.phone = changes.phone
  if (changes.email !== undefined) payload.email = changes.email
  await ensureSession()
  const { data, error } = await withAuthRetry(() =>
    supabase
      .from('customer_profiles')
      .upsert(payload, { onConflict: 'customer_id' })
      .select('customer_id, name, phone, email')
      .single()
  )
  return { data, error }
}

export async function listSubscriptionsByCustomer(customerId: string) {
  await ensureSession()
  const { data, error } = await supabase
    .from('subscriptions')
    .select('id, plan_id, status, started_at, canceled_at')
    .eq('customer_id', customerId)
  return { data, error }
}

export async function createPayment(payload: {
  customer_id: string
  subscription_id?: string
  amount_cents: number
  note?: string
}) {
  await ensureSession()
  const rpc = await withAuthRetry(() =>
    supabase.rpc('create_payment_secure', {
      p_customer_id: payload.customer_id,
      p_amount_cents: payload.amount_cents,
      p_subscription_id: payload.subscription_id ?? null,
      p_note: payload.note ?? null,
    })
  )
  if (!rpc.error) return
  // Fallback: direct insert if RPC signature/cache not available yet
  const { error } = await withAuthRetry(() =>
    supabase.from('payments').insert({
      customer_id: payload.customer_id,
      subscription_id: payload.subscription_id ?? null,
      amount_cents: payload.amount_cents,
      currency: 'BOB',
      status: 'succeeded',
      paid_at: new Date().toISOString(),
    })
  )
  if (error) throw error
}

export async function prepayMonths(payload: {
  subscription_id: string
  months: number
  month_price_cents: number
}) {
  await ensureSession()
  if (payload.months < 1) throw new Error('Meses debe ser ≥ 1')
  const total = payload.month_price_cents * payload.months
  const { data: sub, error: subErr } = await supabase
    .from('subscriptions')
    .select('customer_id')
    .eq('id', payload.subscription_id)
    .single()
  if (subErr) throw subErr
  const rpc = await withAuthRetry(() =>
    supabase.rpc('prepay_months_secure', {
      p_subscription_id: payload.subscription_id,
      p_months: payload.months,
      p_month_price_cents: payload.month_price_cents,
    })
  )
  if (!rpc.error) return
  const { error } = await withAuthRetry(() =>
    supabase.from('payments').insert({
      customer_id: sub!.customer_id,
      subscription_id: payload.subscription_id,
      amount_cents: total,
      currency: 'BOB',
      status: 'succeeded',
      paid_at: new Date().toISOString(),
    })
  )
  if (error) throw error
}

export async function listProposals() {
  const { data, error } = await supabase
    .from('proposals')
    .select('id, title')
    .order('created_at', { ascending: false })
  return { data, error }
}

export async function addProposalSection(payload: {
  proposal_id: string
  header: string
  section_type: string
}) {
  const { error } = await supabase.from('proposal_sections').insert({
    proposal_id: payload.proposal_id,
    header: payload.header,
    section_type: payload.section_type,
    status: 'In Process',
    target: 0,
    limit: 0,
  })
  if (error) throw error
}

// Payments listing (helper for filters)
export async function listPaymentsSince(sinceISO: string) {
  await ensureSession()
  const { data, error } = await withAuthRetry(() =>
    supabase.rpc('payments_overview_since', { p_since: sinceISO })
  )
  return { data, error }
}

export async function listProfiles() {
  await ensureSession()
  const { data, error } = await supabase
    .from('profiles')
    .select('id, name, avatar_url, created_at')
    .order('created_at', { ascending: false })
  return { data, error }
}

// ===== Team members and custom earnings split =====
export async function listTeamMembers() {
  await ensureSession()
  // 1) Current active team members
  const { data: current, error: tmErr } = await supabase
    .from('team_members')
    .select('id, name, role, active')
    .eq('active', true)
    .order('name', { ascending: true })

  // If we cannot read team_members, return early
  if (tmErr) return { data: [], error: tmErr }

  // 2) Try to enrich/align with actual user profiles so names match real teammates (e.g., Darwin, Luis)
  // If profiles table is not available or query fails, just return current members.
  const { data: profiles, error: pErr } = await supabase
    .from('profiles')
    .select('id, name, created_at')
    .order('created_at', { ascending: true })

  if (!pErr && profiles && profiles.length) {
    const existingNames = new Set(
      (current || [])
        .map((m: any) => (m?.name || '').trim().toLowerCase())
        .filter(Boolean)
    )

    const desiredNames = (profiles as any[])
      .map((p) => (p?.name || '').trim())
      .filter(Boolean)

    const missing = desiredNames.filter(
      (nm) => !existingNames.has(nm.toLowerCase())
    )

    if (missing.length) {
      // 3) Insert missing teammates so the selection shows real user names
      const rows = missing.map((nm) => ({ name: nm, role: 'Member', active: true }))
      const { error: insErr } = await supabase.from('team_members').insert(rows)
      if (insErr) {
        // Non-fatal: still return current list if inserts fail
        console.warn('listTeamMembers insert warning', insErr)
      } else {
        // 4) Re-read full list after inserting
        const { data: refreshed, error: refErr } = await supabase
          .from('team_members')
          .select('id, name, role, active')
          .eq('active', true)
          .order('name', { ascending: true })
        if (!refErr && refreshed) {
          // Prefer only members whose names match an existing profile (hide seeded placeholders)
          const profileNameSet = new Set(desiredNames.map((n) => n.toLowerCase()))
          const filtered = (refreshed as any[]).filter((m) => profileNameSet.has((m?.name||'').trim().toLowerCase()))
          return { data: filtered.length ? filtered : refreshed, error: null }
        }
      }
    }

    // If nothing was missing, still prefer filtering by profile names to avoid showing placeholders
    const profileNameSet = new Set(desiredNames.map((n) => n.toLowerCase()))
    const filtered = (current as any[]).filter((m) => profileNameSet.has((m?.name||'').trim().toLowerCase()))
    if (filtered.length) return { data: filtered, error: null }
  }

  // Default return (no profiles or no changes)
  return { data: current || [], error: null }
}

export async function registerSaleWithSplit(payload: {
  customer_id: string
  amount_cents: number
  note?: string
  member_ids: string[]
}) {
  await ensureSession()
  if (!payload.member_ids?.length) return

  // Find product for the customer
  const { data: cust, error: custErr } = await supabase
    .from('customers')
    .select('product_id')
    .eq('id', payload.customer_id)
    .single()
  if (custErr) throw custErr
  const productId = (cust as any)?.product_id as string | null
  if (!productId) throw new Error('El cliente no tiene producto asignado')

  // Create sale row
  const { data: sale, error: saleErr } = await supabase
    .from('sales')
    .insert({
      customer_id: payload.customer_id,
      product_id: productId,
      amount_cents: payload.amount_cents,
      status: 'completed',
      note: payload.note ?? null,
      sold_at: new Date().toISOString(),
    })
    .select('id')
    .single()
  if (saleErr) throw saleErr

  const saleId = (sale as any)?.id as string
  const n = Math.max(1, payload.member_ids.length)
  const base = Math.floor(payload.amount_cents / n)
  const remainder = payload.amount_cents - base * n

  const rows = payload.member_ids.map((mid, idx) => ({
    member_id: mid,
    sale_id: saleId,
    amount_cents: base + (idx === 0 ? remainder : 0),
  }))

  const { error: earnErr } = await supabase.from('earnings').insert(rows)
  if (earnErr) throw earnErr

  return saleId
}
