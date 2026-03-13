import { Link } from "@tanstack/react-router"
import { Badge } from "@workspace/ui/components/badge"
import { buttonVariants } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"
import type { BreathingProgram } from "@/lib/programs"
import { formatTime, getTimingPattern, getTotalTime } from "@/lib/programs"

type ProgramCardProps = {
  program: BreathingProgram
}

export function ProgramCard({ program }: ProgramCardProps) {
  const totalTime = getTotalTime(program.stages, program.defaultReps)

  return (
    <div className="flex flex-col gap-4 p-6 rounded-2xl bg-card border hover:border-primary/30 transition-colors">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h3 className="text-lg font-bold">{program.name}</h3>
          <p className="text-sm text-muted-foreground font-medium">
            {program.bestFor}
          </p>
        </div>
        <Badge variant="secondary" className="text-xs font-mono shrink-0">
          {getTimingPattern(program.stages)}
        </Badge>
      </div>

      <p className="text-sm text-muted-foreground">{program.description}</p>

      <div className="flex flex-wrap gap-1.5">
        {program.benefits.map((benefit) => (
          <Badge
            key={benefit}
            variant="outline"
            className="text-xs bg-primary/5 border-primary/10 text-primary"
          >
            {benefit}
          </Badge>
        ))}
      </div>

      <div className="flex items-center justify-between mt-auto pt-2 border-t border-border/50">
        <div className="flex gap-4 text-xs text-muted-foreground">
          <span>{program.defaultReps} reps</span>
          <span>{formatTime(totalTime)}</span>
        </div>

        <Link
          to="/programs/$id"
          params={{ id: program.id }}
          className={cn(buttonVariants({ size: "sm" }))}
        >
          Start
        </Link>
      </div>
    </div>
  )
}
