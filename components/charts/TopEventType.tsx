
"use client"

import { Activity } from "lucide-react"
import { Pie, PieChart } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

import { TopEventTypeProps } from "@/app/actions/eventtype"

const chartConfig = {
  event_count: {
    label: "Events",
  },
  SecurityEvent: {
    label: "Security Event",
    color: "var(--chart-1)",
  },
  malware_detected: {
    label: "Malware Detected",
    color: "var(--chart-2)",
  },
  deny: {
    label: "Denied",
    color: "var(--chart-3)",
  },
  FileDeleted: {
    label: "File Deleted",
    color: "var(--chart-4)",
  },
  unauthorized_access: {
    label: "Unauthorized Access",
    color: "var(--chart-5)",
  },
} satisfies ChartConfig

export function EventTypePieChart({ data }: TopEventTypeProps) {
  const events = (data ?? []).map((item) => ({
    ...item,
    fill: `var(--color-${item.event_type})`,
  }))

  const totalEvents = events.reduce(
    (sum, item) => sum + item.event_count,
    0
  )

  return (
    <Card className="flex flex-col rounded-xl border border-slate-200 bg-white shadow-2xs dark:border-zinc-800 dark:bg-zinc-900">
      <CardHeader className="items-center pb-0">
        <CardTitle className="text-sm font-semibold text-slate-900 dark:text-zinc-100">
          Event Types Distribution
        </CardTitle>
        <CardDescription className="text-xs text-slate-500 dark:text-zinc-400">
          Event count by type
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[220px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent nameKey="event_type" />}
            />

            <Pie
              data={events}
              dataKey="event_count"
              nameKey="event_type"
              stroke="0"
              innerRadius={50}
            />
          </PieChart>
        </ChartContainer>
      </CardContent>

      <CardFooter className="flex-col gap-2 border-t border-slate-100 pt-3 text-xs text-slate-500 dark:border-zinc-800 dark:text-zinc-400">
        <div className="flex items-center gap-1.5 leading-none font-medium text-emerald-600 dark:text-emerald-400">
          <span>Total events: {totalEvents}</span>
          <Activity className="h-3.5 w-3.5" />
        </div>

        <div className="leading-none text-slate-400 dark:text-zinc-500">
          Showing {events.length} event types
        </div>
      </CardFooter>
    </Card>
  )
}
