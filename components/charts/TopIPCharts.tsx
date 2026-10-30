
"use client"

import { useMemo } from "react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
} from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

import type { TopIPData } from "@/app/actions/topip"

type TopIPChartsProps = {
  data: TopIPData[] | null
}

const chartConfig = {
  request_count: {
    label: "Requests",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

export function TopIPCharts({ data }: TopIPChartsProps) {
  const chartData = useMemo(
    () =>
      [...(data ?? [])]
        .sort((a, b) => Number(b.request_count) - Number(a.request_count))
        .slice(0, 5)
        .map((item) => ({
          src_ip: item.src_ip,
          request_count: Number(item.request_count),
        })),
    [data]
  )

  return (
    <Card className="flex h-full min-h-0 flex-col overflow-hidden">
      <CardHeader className="shrink-0">
        <CardTitle>Top IP Addresses</CardTitle>
        <CardDescription>
          Most active source IPs in the last hour
        </CardDescription>
      </CardHeader>

      <CardContent className="min-h-0 flex-1">
        {!data ? (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            Loading IP data...
          </div>
        ) : chartData.length === 0 ? (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            No IP data available
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-full w-full"
          >
            <BarChart
              accessibilityLayer
              data={chartData}
              layout="vertical"
              margin={{ left: 8, right: 36 }}
            >
              <CartesianGrid horizontal={false} />

              <YAxis
                dataKey="src_ip"
                type="category"
                tickLine={false}
                tickMargin={8}
                axisLine={false}
                width={105}
                tick={{ fontSize: 11 }}
              />

              <XAxis
                dataKey="request_count"
                type="number"
                hide
              />

              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    indicator="line"
                    formatter={(value) => [
                      Number(value).toLocaleString(),
                      "Requests",
                    ]}
                  />
                }
              />

              <Bar
                dataKey="request_count"
                fill="var(--color-request_count)"
                radius={4}
                maxBarSize={32}
              >
                <LabelList
                  dataKey="request_count"
                  position="right"
                  offset={8}
                  className="fill-foreground"
                  fontSize={12}
                  formatter={(value) =>
                    Number(value).toLocaleString()
                  }
                />
              </Bar>
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
