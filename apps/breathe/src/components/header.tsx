import { Link } from "@tanstack/react-router"
import {
  Logo,
  LogoBrand,
  LogoIcon,
  LogoProduct,
} from "@workspace/ui/components/logo"
import { env } from "@/env"

export function Header() {
  return (
    <header className="fixed top-0 inset-x-0 z-20 bg-background/75 backdrop-blur-sm">
      <div className="container py-4 md:py-6 flex items-center justify-between">
        <Logo as="a" href={env.VITE_WEB_URL}>
          <LogoIcon />
          <LogoBrand />
          <LogoProduct as={Link} to="/">
            Breathe
          </LogoProduct>
        </Logo>

        <nav className="flex items-center gap-6">
          <Link
            to="/programs"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            activeProps={{ className: "text-foreground" }}
          >
            Programs
          </Link>
          <Link
            to="/stats"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            activeProps={{ className: "text-foreground" }}
          >
            Stats
          </Link>
        </nav>
      </div>
    </header>
  )
}
