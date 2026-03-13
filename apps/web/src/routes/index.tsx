import { createFileRoute } from "@tanstack/react-router"
import { Button } from "@workspace/ui/components/button"
import { Logo } from "@workspace/ui/components/logo"

export const Route = createFileRoute("/")({ component: App })

function App() {
  return (
    <div className="container flex min-h-svh py-6">
      <div className="flex max-w-md min-w-0 flex-col gap-4 text-sm leading-loose">
        <div>
          <Logo />
          <h1 className="font-medium">Welcome to BioBoost</h1>
          <p>Below are links to products we&apos;re currently working on.</p>

          <Button variant="link">
            <a href="http://localhost:3001">Supplements</a>
          </Button>
          <Button variant="link">
            <a href="http://localhost:3002">Breathe</a>
          </Button>
          <Button variant="link">
            <a href="http://localhost:3003">Calculators</a>
          </Button>
        </div>
      </div>
    </div>
  )
}
