import {
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

import { PageHeader } from "@/components/shared/page-header";
import { GlassCard } from "@/components/shared/glass-card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { BarChart, CartesianGrid, XAxis, Bar, Tooltip, ResponsiveContainer } from "recharts";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { quickActions, bestTimesData, analyticsData } from "@/lib/data";


const chartConfig = {
  views: {
    label: "Views",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

export default function DashboardPage() {
  const engagementImage = PlaceHolderImages.find(p => p.id === "engagement-chart");

  return (
    <div className="space-y-8">
      <PageHeader
        title="Welcome to NovaCreate"
        subtitle="Your AI-powered content creation studio."
      />

      <section>
        <h2 className="text-2xl font-bold tracking-tight mb-4 text-primary-foreground/90">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action) => (
            <Link href={action.href} key={action.title}>
              <GlassCard className="flex h-full flex-col justify-between">
                <div>
                  <action.icon className="h-8 w-8 mb-4 text-primary" />
                  <h3 className="font-bold text-lg">{action.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {action.description}
                  </p>
                </div>
              </GlassCard>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold tracking-tight mb-4 text-primary-foreground/90">
          Analytics Preview
        </h2>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <GlassCard className="lg:col-span-1">
            <div className="flex items-start justify-between">
              <h3 className="font-bold text-lg">Engagement Score</h3>
              <div className="flex items-center gap-2 text-sm text-primary">
                <TrendingUp className="h-4 w-4" />
                <span>+12%</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Predicted engagement for your next video.
            </p>
            <div className="relative mt-4 flex h-48 items-center justify-center">
              {engagementImage &&
                <Image
                  src={engagementImage.imageUrl}
                  alt={engagementImage.description}
                  width={200}
                  height={200}
                  data-ai-hint={engagementImage.imageHint}
                  className="absolute inset-0 m-auto h-full w-full object-contain"
                />
              }
              <div className="relative text-center">
                <p className="text-5xl font-bold text-primary">
                  {analyticsData.engagementScore}
                </p>
                <p className="text-sm font-medium text-muted-foreground">
                  Out of 100
                </p>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="lg:col-span-2">
            <h3 className="font-bold text-lg">Best Times to Post</h3>
            <p className="text-sm text-muted-foreground mt-1">
              AI recommendations for maximum reach.
            </p>
            <ChartContainer config={chartConfig} className="mt-4 h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={bestTimesData}>
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
              </ResponsiveContainer>
            </ChartContainer>
          </GlassCard>
        </div>
      </section>
    </div>
  );
}