import { createFileRoute, Link } from "@tanstack/react-router"
import { buttonVariants } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"

export const Route = createFileRoute("/")({ component: LandingPage })

function LandingPage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative flex min-h-svh items-center justify-center container overflow-hidden">
        <div className="flex flex-col items-center text-center gap-6 max-w-3xl relative z-10">
          <h1 className="text-5xl md:text-7xl font-black text-balance uppercase italic leading-none">
            Breathe Better, <span className="text-primary">Live Better</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl text-pretty">
            Guided breathing exercises designed to reduce stress, improve sleep,
            sharpen focus, and boost energy. Choose from proven techniques or
            create your own custom routine.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 mt-2">
            <Link to="/programs" className={cn(buttonVariants({ size: "lg" }))}>
              Start Breathing
            </Link>
            <Link
              to="/stats"
              className={cn(buttonVariants({ size: "lg", variant: "outline" }))}
            >
              View Your Stats
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container py-24">
        <div className="flex flex-col gap-2 mb-12 text-center">
          <h2 className="text-3xl md:text-4xl font-black uppercase italic">
            Everything You Need
          </h2>
          <p className="text-muted-foreground text-lg">
            Simple, effective tools for better breathing.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {[
            {
              title: "Guided Programs",
              description:
                "Choose from scientifically-backed breathing techniques like Box Breathing, 4-7-8, and Resonance Breathing, each optimized for specific benefits.",
            },
            {
              title: "Custom Routines",
              description:
                "Create your own breathing pattern by setting inhale, hold, exhale, and hold durations. Tailor your practice to exactly what your body needs.",
            },
            {
              title: "Multi-Sensory Feedback",
              description:
                "Stay in rhythm with audio cues, haptic vibrations, or silent visual guidance. Toggle between feedback modes to suit your environment.",
            },
          ].map(({ title, description }) => (
            <div
              className="flex flex-col gap-2 p-6 rounded-2xl bg-card border"
              key={title}
            >
              <h3 className="text-xl font-bold">{title}</h3>
              <p className="text-muted-foreground">{description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="container py-24">
        <div className="flex flex-col gap-2 mb-12 text-center">
          <h2 className="text-3xl md:text-4xl font-black uppercase italic">
            How It Works
          </h2>
          <p className="text-muted-foreground text-lg">
            Three steps to a calmer, more focused you.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {[
            {
              step: "01",
              title: "Pick a Program",
              description:
                "Browse our curated breathing exercises or build a custom pattern with your preferred timings.",
            },
            {
              step: "02",
              title: "Follow the Guide",
              description:
                "An animated visual guide expands and contracts in sync with your breath. Sound or haptic cues keep you on track.",
            },
            {
              step: "03",
              title: "Track Your Progress",
              description:
                "View your practice history, streaks, and detailed breakdowns of time spent in each breathing phase.",
            },
          ].map(({ step, title, description }) => (
            <div className="flex flex-col gap-3" key={step}>
              <span className="text-5xl font-black text-primary/20">
                {step}
              </span>
              <h3 className="text-xl font-bold">{title}</h3>
              <p className="text-muted-foreground">{description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container py-24">
        <div className="bg-primary/5 rounded-3xl p-8 md:p-16 flex flex-col items-center text-center gap-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 size-64 bg-primary/10 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 size-64 bg-primary/10 blur-3xl rounded-full translate-y-1/2 -translate-x-1/2" />

          <div className="flex flex-col gap-4 max-w-2xl relative z-10">
            <h2 className="text-4xl md:text-6xl font-black uppercase italic leading-none text-balance">
              Ready to <span className="text-primary">Breathe</span>?
            </h2>
            <p className="text-muted-foreground text-lg text-pretty">
              Start your first session now. No account needed, no setup
              required. Just breathe.
            </p>
          </div>

          <Link
            to="/programs"
            className={cn(buttonVariants({ size: "lg" }), "relative z-10")}
          >
            Browse Programs
          </Link>
        </div>
      </section>
    </div>
  )
}
