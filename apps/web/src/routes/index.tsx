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
          <h1 className="font-medium">Project ready!</h1>
          <p>You may now add components and start building.</p>
          <p>We&apos;ve already added the button component for you.</p>
          <Button className="mt-2">Button</Button>

          <Button variant="link">
            <a href="http://localhost:3001">Supplements</a>
          </Button>
          <Button variant="link">
            <a href="http://localhost:3002">Breathe</a>
          </Button>
        </div>
      </div>
    </div>
  )
}
