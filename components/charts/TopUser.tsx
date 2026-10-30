
"use client"

import { TrendingUp } from "lucide-react"
import {
    Bar,
    BarChart,
    CartesianGrid,
    XAxis,
    YAxis,
} from "recharts"

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
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from "@/components/ui/chart"

import { TopUserDataProps } from "@/app/actions/topuser"

export const description = "Top users by event count"

const chartConfig = {
    event_count: {
        label: "Events",
        color: "var(--chart-1)",
    },
} satisfies ChartConfig

export function TopUser({ data }: TopUserDataProps) {
    const users = data ?? []

    const totalEvents = users.reduce(
        (sum, item) => sum + item.event_count,
        0
    )

    return (
        <Card className="h-full flex flex-col overflow-hidden py-4 gap-2">
            <CardHeader className="shrink-0 pb-0">
                <CardTitle>Top Users</CardTitle>
                <CardDescription>
                    Event count by user
                </CardDescription>
            </CardHeader>

            <CardContent className="flex-1 min-h-0 pb-0">
                <ChartContainer
                    config={chartConfig}
                    className="aspect-auto h-full w-full"
                >
                    <BarChart
                        accessibilityLayer
                        data={users}
                    >
                        <CartesianGrid vertical={false} />

                        <XAxis
                            dataKey="user"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            interval={0}
                            tick={{ fontSize: 11 }}
                        />

                        <YAxis
                            allowDecimals={false}
                            tickLine={false}
                            axisLine={false}
                        />

                        <ChartTooltip
                            content={<ChartTooltipContent />}
                        />

                        <Bar
                            dataKey="event_count"
                            fill="var(--color-event_count)"
                            radius={[4, 4, 0, 0]}
                        />
                    </BarChart>
                </ChartContainer>
            </CardContent>

            <CardFooter className="flex-col items-start gap-1 text-xs shrink-0 pt-2">
                <div className="font-medium">
                    Total events: {totalEvents}
                </div>
                <div className="text-muted-foreground">
                    Showing events for {users.length} users
                </div>
            </CardFooter>
        </Card>
    )
}