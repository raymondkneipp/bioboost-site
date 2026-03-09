import {
  Facebook02Icon,
  InstagramIcon,
  NewTwitterIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { LogoBrand } from "@workspace/ui/components/logo"

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="container py-12 flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex flex-col items-center md:items-start gap-2">
          <LogoBrand />
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} BioBoost. All rights reserved.
          </p>
        </div>

        <div className="flex items-center gap-6">
          <a
            href="https://facebook.com/BioBoostFit"
            className="text-muted-foreground hover:text-primary transition-colors"
            aria-label="Facebook"
            target="_blank"
            rel="noreferrer noopener"
          >
            <HugeiconsIcon icon={Facebook02Icon} className="size-6" />
          </a>
          <a
            href="https://x.com/BioBoostFit"
            className="text-muted-foreground hover:text-primary transition-colors"
            aria-label="X"
            target="_blank"
            rel="noreferrer noopener"
          >
            <HugeiconsIcon icon={NewTwitterIcon} className="size-6" />
          </a>
          <a
            href="https://www.instagram.com/bioboostfit/"
            className="text-muted-foreground hover:text-primary transition-colors"
            aria-label="Instagram"
            target="_blank"
            rel="noreferrer noopener"
          >
            <HugeiconsIcon icon={InstagramIcon} className="size-6" />
          </a>
        </div>
      </div>
    </footer>
  )
}
