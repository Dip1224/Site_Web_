"use client"

import * as React from 'react'
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'

const chartConfig = {
  sales: {
    label: 'Sales',
    color: 'var(--color-sales)',
  },
  messages: {
    label: 'Messages',
    color: 'var(--color-messages)',
  },
} satisfies ChartConfig

export function DailyActivityChart() {
  const [data, setData] = React.useState<{ date: string; sales: number; messages: number }[]>([])
  const [timeRange, setTimeRange] = React.useState<'7d'|'30d'|'90d'>('90d')

  React.useEffect(() => {
    ;(async () => {
      try {
        const mod = await import('@/services/dashboard')
        const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90
        const rows = await mod.fetchDailyActivity(days)
        setData(rows)
      } catch (e) {
        console.warn('DailyActivityChart: could not fetch data', e)
      }
    })()
  }, [timeRange])

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Sales vs Messages</CardTitle>
        <CardDescription>Daily totals for the selected range</CardDescription>
        <div className="flex items-center gap-2">
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={(v)=> v && setTimeRange(v as any)}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
          >
            <ToggleGroupItem value="90d">Last 3 months</ToggleGroupItem>
            <ToggleGroupItem value="30d">Last 30 days</ToggleGroupItem>
            <ToggleGroupItem value="7d">Last 7 days</ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={(v)=> setTimeRange(v as any)}>
            <SelectTrigger className="flex w-40 h-8 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden" aria-label="Select a value">
              <SelectValue placeholder="Last 3 months" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-lg">Last 3 months</SelectItem>
              <SelectItem value="30d" className="rounded-lg">Last 30 days</SelectItem>
              <SelectItem value="7d" className="rounded-lg">Last 7 days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
          style={{
            // Provide series colors
            ['--color-sales' as any]: 'hsl(var(--chart-1))',
            ['--color-messages' as any]: 'hsl(var(--chart-2))',
          }}
        >
          <AreaChart data={data}>
            <defs>
              <linearGradient id="fillSales" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-sales)" stopOpacity={1.0} />
                <stop offset="95%" stopColor="var(--color-sales)" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillMessages" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-messages)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-messages)" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} minTickGap={32} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
            <Area dataKey="messages" type="natural" fill="url(#fillMessages)" stroke="var(--color-messages)" stackId="a" />
            <Area dataKey="sales" type="natural" fill="url(#fillSales)" stroke="var(--color-sales)" stackId="a" />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

