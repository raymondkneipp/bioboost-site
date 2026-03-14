import {
  type ChartConfig,
  ChartContainer,
} from "@workspace/ui/components/chart"
import { useMemo } from "react"
import { Cell, Pie, PieChart } from "recharts"
import { SUPPLEMENTS, TAGS } from "@/lib/supplements"

const RADIAN = Math.PI / 180
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  tag,
// biome-ignore lint/suspicious/noExplicitAny: recharts custom label callback has complex generic props
}: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.6
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)

  return (
    <foreignObject
      x={x - 40}
      y={y - 12}
      width={80}
      height={24}
      className="pointer-events-none"
    >
      <div className="flex items-center justify-center h-full w-full">
        <span className="bg-background text-foreground border border-border px-1.5 py-0.5 rounded-full text-[7px] md:text-[9px] font-bold uppercase shadow-sm whitespace-nowrap">
          {tag}
        </span>
      </div>
    </foreignObject>
  )
}

function TagChart({ selectedIds }: { selectedIds?: string[] }) {
  const chartData = useMemo(() => {
    const counts: Record<string, number> = {}

    const filteredSupps = selectedIds
      ? SUPPLEMENTS.filter((s) => selectedIds.includes(s.id))
      : SUPPLEMENTS

    // Count occurrences of each tag in filtered supplements
    filteredSupps.forEach((supp) => {
      supp.tags.forEach((tag) => {
        counts[tag.label] = (counts[tag.label] || 0) + 1
      })
    })

    return Object.entries(counts)
      .map(([label, count]) => ({
        tag: label,
        count,
        fill: `var(--color-${label.toLowerCase()})`,
      }))
      .sort((a, b) => b.count - a.count)
  }, [selectedIds])

  const chartConfig = useMemo(() => {
    const config: ChartConfig = {}
    Object.values(TAGS).forEach((tag) => {
      config[tag.label.toLowerCase()] = {
        label: tag.label,
        color: tag.chartColor,
      }
    })
    return config
  }, [])

  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto aspect-square h-[300px] md:h-[400px]"
    >
      <PieChart>
        <Pie
          data={chartData}
          dataKey="count"
          nameKey="tag"
          strokeWidth={2}
          labelLine={false}
          label={renderCustomizedLabel}
          isAnimationActive={false}
          outerRadius="100%"
        >
          {chartData.map((entry, index) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: recharts Cell has no natural key
            <Cell key={`cell-${index}`} fill={entry.fill} />
          ))}
        </Pie>
      </PieChart>
    </ChartContainer>
  )
}

export function PerfectBlendSection({
  selectedIds,
}: {
  selectedIds?: string[]
}) {
  return (
    <section className="container py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="flex flex-col gap-6">
          <h2 className="text-3xl md:text-4xl font-black uppercase italic leading-tight">
            Create The Perfect Supplement Blend
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Find supplements that will help you reach your goal and create your
            formula. Everyone is different and reacts differently to
            supplements. Find the perfect dose for you to get the most out of
            your body.
          </p>
        </div>
        <div className="relative flex justify-center items-center min-h-[300px] md:min-h-[400px] w-full">
          {/* Background glow for the chart */}
          <div className="absolute inset-0 bg-primary/5 blur-3xl rounded-full -z-10" />
          <TagChart selectedIds={selectedIds} />
        </div>
      </div>
    </section>
  )
}
