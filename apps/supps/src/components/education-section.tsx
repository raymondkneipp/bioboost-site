import { Skeleton } from "@workspace/ui/components/skeleton"

export function EducationSection() {
  return (
    <section className="container py-16 overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="flex flex-col gap-6">
          <h2 className="text-3xl md:text-4xl font-black uppercase italic leading-tight">
            Learn About Your Supplements
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Know the ingredients in your supplement blends and uncover their
            purposes. Learn about the proper dosages and adjust to your needs.
            Discover the best time to take these ingredients and more.
          </p>
        </div>

        <div className="relative flex justify-center items-center py-12 md:py-0">
          {/* Background Glow */}
          <div className="absolute inset-0 bg-primary/5 blur-3xl rounded-full -z-10" />

          <div className="relative w-full max-w-[350px] aspect-[12/17]">
            {/* Paper Stack */}
            {/* Bottom Paper */}
            <div className="absolute inset-0 bg-background border-2 border-border shadow-sm rounded-sm rotate-6 translate-x-4 translate-y-4 -z-30" />

            {/* Middle Paper */}
            <div className="absolute inset-0 bg-background border-2 border-border shadow-md rounded-sm -rotate-3 translate-x-2 translate-y-2 -z-20" />

            {/* Top Paper */}
            <div className="absolute inset-0 bg-background border-2 border-border shadow-xl rounded-sm p-8 flex flex-col gap-6 -z-10 overflow-hidden">
              <div className="flex flex-col gap-2">
                <span className="text-primary font-mono text-[10px] uppercase tracking-widest font-bold">
                  Ingredient Insight
                </span>
                <h3 className="text-2xl font-black uppercase italic leading-none">
                  Creatine Monohydrate
                </h3>
              </div>

              <div className="flex flex-col gap-3">
                <h4 className="text-sm font-bold uppercase tracking-wider underline underline-offset-4 decoration-2 decoration-primary/30">
                  Overview
                </h4>
                <div className="flex flex-col gap-2">
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-[90%]" />
                  <Skeleton className="h-3 w-[95%]" />
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <h4 className="text-sm font-bold uppercase tracking-wider underline underline-offset-4 decoration-2 decoration-primary/30">
                  Benefits
                </h4>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <div className="size-1.5 rounded-full bg-primary shrink-0" />
                    <Skeleton className="h-3 w-full" />
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="size-1.5 rounded-full bg-primary shrink-0" />
                    <Skeleton className="h-3 w-[85%]" />
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="size-1.5 rounded-full bg-primary shrink-0" />
                    <Skeleton className="h-3 w-[92%]" />
                  </div>
                </div>
              </div>

              <div className="mt-auto pt-6 border-t border-dashed border-border flex justify-between items-center">
                <Skeleton className="h-4 w-24" />
                <div className="size-8 rounded-full border border-border flex items-center justify-center">
                  <div className="size-1 bg-muted-foreground rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
