"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { bestTimesData } from "@/lib/data";

const chartConfig = {
  views: {
    label: "Views",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

export function BestTimesChart() {
  return (
    <ChartContainer config={chartConfig} className="mt-4 h-48 w-full">
      <BarChart data={bestTimesData} width={500} height={300}>
        <CartesianGrid
          vertical={false}
          stroke="hsl(var(--muted))"
          strokeDasharray="3 3"
        />
        <XAxis
          dataKey="day"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value) => value.slice(0, 3)}
          stroke="hsl(var(--muted-foreground))"
        />
        <Tooltip
          cursor={{ fill: "hsl(var(--card))" }}
          content={<ChartTooltipContent hideLabel />}
        />
        <Bar
          dataKey="views"
          fill="var(--color-views)"
          radius={4}
        />
      </BarChart>
    </ChartContainer>
  )
}