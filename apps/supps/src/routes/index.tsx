import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/")({ component: App })

function App() {
  return (
    <div className="flex min-h-svh items-center justify-center">
      <h1 className="text-4xl font-bold">Supps</h1>
    </div>
  )
}
