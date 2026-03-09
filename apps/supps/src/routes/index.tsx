import {
  Target02Icon,
  TestTube01Icon,
  UnavailableIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { createFileRoute } from "@tanstack/react-router"
import { Badge } from "@workspace/ui/components/badge"
import { cn } from "@workspace/ui/lib/utils"
import { useState } from "react"
import { EducationSection } from "@/components/education-section"
import { HowItWorks } from "@/components/how-it-works"
import { Marquee } from "@/components/marquee"
import { PerfectBlendSection } from "@/components/tag-chart"
import { WaitlistForm } from "@/components/waitlist-form"
import { TAGS } from "@/lib/supplements"

export const Route = createFileRoute("/")({ component: App })

function App() {
  const [selectedSupps, setSelectedSupps] = useState<string[]>([
    "creatine",
    "citrulline",
  ])

  return (
    <div className="flex flex-col gap-16 pb-16 mt-16 md:mt-0">
      <section className="flex min-h-svh items-center justify-center container">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 items-center py-16">
          <div className="flex flex-col gap-4">
            <Badge
              variant="outline"
              className="bg-primary/10 border-primary/20 text-xs h-8 px-3 gap-2 text-primary"
            >
              <span
                className="size-2 rounded-full bg-primary relative"
                aria-hidden="true"
              >
                <span
                  className="size-2 rounded-full bg-primary inset-0 absolute animate-ping -z-10"
                  aria-hidden="true"
                />
              </span>
              Coming Soon
            </Badge>
            <h1 className="text-4xl md:text-6xl font-black text-balance uppercase italic">
              Personalized <span className="text-primary">Supplement</span>{" "}
              Blends
            </h1>
            <p className="text-lg text-muted-foreground">
              Everyone is unique; supplements you take should be too. Get
              notified when personalized supplement blends are available below.
            </p>

            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="text-xs h-8 px-3 gap-2">
                <HugeiconsIcon icon={Target02Icon} className="text-primary" />
                Optimized for You
              </Badge>
              <Badge variant="secondary" className="text-xs h-8 px-3 gap-2">
                <HugeiconsIcon
                  icon={UnavailableIcon}
                  className="text-primary"
                />
                No Proprietary Blends
              </Badge>
              <Badge variant="secondary" className="text-xs h-8 px-3 gap-2">
                <HugeiconsIcon icon={TestTube01Icon} className="text-primary" />
                No More DIY
              </Badge>
            </div>

            <WaitlistForm />
          </div>

          <div className="relative">
            <img src="/supplements.png" alt="Supplements" className="h-full" />

            <div className="w-full aspect-square rounded-full bg-radial from-primary/70 to-primary/0 to-75% blur-xl absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
          </div>
        </div>
      </section>

      <section className="container py-16">
        <h2 className="text-3xl md:text-4xl font-black text-balance mb-8 uppercase italic">
          Why Personalize Supplements?
        </h2>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 items-center">
          {[
            {
              title: "Optimized for You",
              icon: Target02Icon,
              description:
                "Everyone has different goals, so everyone needs different supplements to achieve those goals.",
            },
            {
              title: "No Proprietary Blends",
              icon: UnavailableIcon,
              description:
                "Don't worry about not getting a quality dose in a proprietary blend. You choose the quantity.",
            },
            {
              title: "No More DIY",
              icon: TestTube01Icon,
              description:
                "You no longer have to order many supplements and spend hours weighing and measuring out ingredients.",
            },
          ].map(({ title, icon, description }) => (
            <div className="flex flex-col" key={title}>
              <HugeiconsIcon
                icon={icon}
                className="text-primary size-10 mb-4"
              />
              <h3 className="text-xl font-bold mb-1">{title}</h3>
              <p>{description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container py-16">
        <div className="flex flex-col gap-2 mb-12">
          <h2 className="text-3xl md:text-4xl font-black uppercase italic">
            How It Works
          </h2>
          <p className="text-muted-foreground text-lg">
            Build your perfect blend in three simple steps.
          </p>
        </div>
        <HowItWorks
          selectedSupps={selectedSupps}
          setSelectedSupps={setSelectedSupps}
        />
      </section>

      <PerfectBlendSection selectedIds={selectedSupps} />

      <section className="py-8 relative overflow-hidden">
        {/* Fade gradients */}
        <div className="absolute inset-y-0 left-0 w-32 bg-linear-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-32 bg-linear-to-l from-background to-transparent z-10 pointer-events-none" />

        <div className="flex flex-col gap-4">
          <Marquee pauseOnHover className="[--duration:40s]">
            {Object.values(TAGS)
              .slice(0, Math.ceil(Object.values(TAGS).length / 2))
              .map((tag) => (
                <Badge
                  key={tag.label}
                  variant="secondary"
                  className={cn(
                    "text-sm h-10 px-4 gap-2 mx-4 whitespace-nowrap",
                    tag.color,
                    tag.darkColor,
                  )}
                >
                  <HugeiconsIcon icon={tag.icon} className="size-4" />
                  {tag.label}
                </Badge>
              ))}
          </Marquee>
          <Marquee pauseOnHover reverse className="[--duration:50s]">
            {Object.values(TAGS)
              .slice(Math.ceil(Object.values(TAGS).length / 2))
              .map((tag) => (
                <Badge
                  key={tag.label}
                  variant="secondary"
                  className={cn(
                    "text-sm h-10 px-4 gap-2 mx-4 whitespace-nowrap",
                    tag.color,
                    tag.darkColor,
                  )}
                >
                  <HugeiconsIcon icon={tag.icon} className="size-4" />
                  {tag.label}
                </Badge>
              ))}
          </Marquee>
        </div>
      </section>

      <EducationSection />

      <section className="container py-24">
        <div className="bg-primary/5 rounded-3xl p-8 md:p-16 flex flex-col items-center text-center gap-8 relative overflow-hidden">
          {/* Decorative background element */}
          <div className="absolute top-0 right-0 size-64 bg-primary/10 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 size-64 bg-primary/10 blur-3xl rounded-full translate-y-1/2 -translate-x-1/2" />

          <div className="flex flex-col gap-4 max-w-2xl relative z-10">
            <h2 className="text-4xl md:text-6xl font-black uppercase italic leading-none text-balance">
              Ready to <span className="text-primary">Boost</span> Your
              Performance?
            </h2>
            <p className="text-muted-foreground text-lg text-pretty">
              Join the waitlist to be the first to know when we launch our
              personalized supplement blends.
            </p>
          </div>

          <WaitlistForm />

          <p className="text-xs text-muted-foreground relative z-10">
            By signing up, you agree to receive updates about BioBoost.
          </p>
        </div>
      </section>
    </div>
  )
}
