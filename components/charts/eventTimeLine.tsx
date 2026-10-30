"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { getTimeLine, TimelineData } from "@/app/actions/tiimeline"

export const description = "An interactive event timeline chart from ClickHouse"

const chartConfig = {
  events: {
    label: "Events",
  },
  total_events: {
    label: "Total Events",
    color: "var(--chart-1)",
  },
  error_events: {
    label: "Errors / Critical",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

export function EventTimeLine() {
  const [timeRange, setTimeRange] = React.useState("7") // ใช้ค่าเป็นจำนวนวัน เช่น "7", "15", "30"
  const [chartData, setChartData] = React.useState<TimelineData[]>([])
  const [loading, setLoading] = React.useState(true)

  // ดึงข้อมูลจาก Server Action เมื่อ timeRange เปลี่ยนแปลง
  React.useEffect(() => {
    async function loadData() {
      setLoading(true)
      try {
        const data = await getTimeLine(Number(timeRange))
        setChartData(data)
      } catch (error) {
        console.error("Failed to fetch timeline data:", error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [timeRange])

  return (
    <Card className="pt-0 h-full flex flex-col">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row shrink-0">
        <div className="grid flex-1 gap-1">
          <CardTitle>Event Timeline</CardTitle>
          <CardDescription>
            Showing system log volume for the last {timeRange} days
          </CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="hidden w-[160px] rounded-lg sm:ml-auto sm:flex"
            aria-label="Select a value"
          >
            <SelectValue placeholder="Last 7 days" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="7" className="rounded-lg">
              Last 7 days
            </SelectItem>
            <SelectItem value="15" className="rounded-lg">
              Last 15 days
            </SelectItem>
            <SelectItem value="30" className="rounded-lg">
              Last 30 days
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6 flex-1 min-h-0">
        {loading ? (
          <div className="flex h-[250px] w-full items-center justify-center text-sm text-slate-400">
            Loading timeline data...
          </div>
        ) : chartData.length === 0 ? (
          <div className="flex h-[250px] w-full items-center justify-center text-sm text-slate-400">
            No data available for this range
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-full w-full"
          >
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="fillTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-total_events)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-total_events)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
                <linearGradient id="fillError" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-error_events)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-error_events)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="day"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => {
                  const date = new Date(value)
                  return date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })
                }}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) => {
                      return new Date(value).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })
                    }}
                    indicator="dot"
                  />
                }
              />
              <Area
                dataKey="error_events"
                type="natural"
                fill="url(#fillError)"
                stroke="var(--color-error_events)"
                stackId="a"
              />
              <Area
                dataKey="total_events"
                type="natural"
                fill="url(#fillTotal)"
                stroke="var(--color-total_events)"
                stackId="a"
              />
              <ChartLegend content={<ChartLegendContent />} />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}