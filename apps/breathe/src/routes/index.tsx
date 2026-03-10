import { createFileRoute, Link } from "@tanstack/react-router"
import {
  Logo,
  LogoBrand,
  LogoIcon,
  LogoProduct,
} from "@workspace/ui/components/logo"

export const Route = createFileRoute("/")({ component: App })

function App() {
  return (
    <main className="container py-6">
      <Logo as="a" href="http://localhost:3000">
        <LogoIcon />
        <LogoBrand />
        <LogoProduct as={Link} to="/">
          Breathe
        </LogoProduct>
      </Logo>
    </main>
  )
}
