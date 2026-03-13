import { createFileRoute } from "@tanstack/react-router"
import { CustomProgramForm } from "@/components/custom-program-form"
import { ProgramCard } from "@/components/program-card"
import { PROGRAMS } from "@/lib/programs"

export const Route = createFileRoute("/programs/")({ component: ProgramsPage })

function ProgramsPage() {
  return (
    <div className="container py-12 flex flex-col gap-12">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl md:text-4xl font-black uppercase italic">
          Breathing Programs
        </h1>
        <p className="text-muted-foreground text-lg">
          Choose a guided program or create your own custom routine.
        </p>
      </div>

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-bold">Guided Programs</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {PROGRAMS.map((program) => (
            <ProgramCard key={program.id} program={program} />
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-bold">Create Your Own</h2>
        <CustomProgramForm />
      </section>
    </div>
  )
}
