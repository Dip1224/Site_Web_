import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react"
import { useEffect, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export function SectionCards() {
  const [cards, setCards] = useState<{ revenue: number; newCustomers: number; activeAccounts: number; growthRate: number } | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    ;(async () => {
      try {
        const mod = await import('@/services/dashboard')
        const data = await mod.fetchDashboardCards()
        if (data) {
          setCards({
            revenue: (data.total_revenue_cents || 0) / 100,
            newCustomers: data.new_customers || 0,
            activeAccounts: data.active_accounts || 0,
            growthRate: data.growth_rate_pct || 0,
          })
        }
      } catch (e) {
        console.warn('SectionCards: failed to load metrics, defaulting to zeros')
        setCards({
          revenue: 0,
          newCustomers: 0,
          activeAccounts: 0,
          growthRate: 0,
        })
      } finally {
        setIsLoading(false)
      }
    })()
  }, [])

  return (
    <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 sm:grid-cols-2 xl:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Revenue</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {isLoading ? (
              <Skeleton className="h-8 w-24 rounded-md" />
            ) : (
              `$${(cards?.revenue || 0).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}`
            )}
          </CardTitle>
          <CardAction>
            {isLoading ? (
              <Skeleton className="h-6 w-16 rounded-full" />
            ) : (
              <Badge variant="outline">
                <IconTrendingUp />
                {`${(cards?.growthRate || 0) > 0 ? '+' : ''}${(cards?.growthRate || 0).toFixed(1)}%`}
              </Badge>
            )}
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Trending up this month <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Visitors for the last 6 months
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>New Customers</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {isLoading ? (
              <Skeleton className="h-8 w-20 rounded-md" />
            ) : (
              (cards?.newCustomers || 0).toLocaleString()
            )}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingDown />
              -20%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Down 20% this period <IconTrendingDown className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Acquisition needs attention
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Active Accounts</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {isLoading ? (
              <Skeleton className="h-8 w-24 rounded-md" />
            ) : (
              (cards?.activeAccounts || 0).toLocaleString()
            )}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              +12.5%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Strong user retention <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">Engagement exceed targets</div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Growth Rate</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {isLoading ? (
              <Skeleton className="h-8 w-16 rounded-md" />
            ) : (
              `${(cards?.growthRate || 0).toFixed(1)}%`
            )}
          </CardTitle>
          <CardAction>
            {isLoading ? (
              <Skeleton className="h-6 w-16 rounded-full" />
            ) : (
              <Badge variant="outline">
                <IconTrendingUp />
                {`${(cards?.growthRate || 0).toFixed(1)}%`}
              </Badge>
            )}
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Steady performance increase <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">Meets growth projections</div>
        </CardFooter>
      </Card>
    </div>
  )
}
