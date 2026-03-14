import { createFileRoute } from "@tanstack/react-router"
import { Button } from "@workspace/ui/components/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { Logo, LogoBrand, LogoIcon } from "@workspace/ui/components/logo"
import { env } from "@/env"

export const Route = createFileRoute("/")({ component: HomePage })

const products = [
  {
    name: "Supplements",
    tagline: "Personalized blends, tailored to you",
    description:
      "No proprietary blends, no more DIY measuring. Quality ingredients formulated around your specific goals.",
    href: env.VITE_SUPPS_URL,
    status: "coming-soon" as const,
  },
  {
    name: "Breathe",
    tagline: "Guided breathing exercises",
    description:
      "Reduce stress, improve sleep, and sharpen focus with preset programs or build your own custom routine.",
    href: env.VITE_BREATHE_URL,
    status: "live" as const,
  },
  {
    name: "Calculators",
    tagline: "29+ health & fitness calculators",
    description:
      "BMI, TDEE, macros, heart rate zones, one-rep max, and more—everything you need to track your progress.",
    href: env.VITE_CALC_URL,
    status: "live" as const,
  },
]

function HomePage() {
  return (
    <div className="min-h-svh flex flex-col">
      <header className="container py-8">
        <Logo>
          <LogoIcon />
          <LogoBrand />
        </Logo>
      </header>

      <main className="container flex-1 flex flex-col justify-center gap-16 py-12">
        <div className="max-w-xl">
          <h1 className="text-5xl font-black uppercase italic tracking-tighter leading-[0.9] mb-5">
            Your complete
            <br />
            health &amp; fitness
            <br />
            platform.
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Tools and products to help you optimize your performance, health,
            and recovery.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl">
          {products.map((product) => (
            <Card key={product.name} className="flex flex-col justify-between">
              <CardHeader>
                <CardTitle className="text-2xl font-black uppercase italic tracking-tight">
                  {product.name}
                </CardTitle>
                <p className="text-sm font-medium text-muted-foreground">
                  {product.tagline}
                </p>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {product.description}
                </p>
              </CardContent>
              <CardFooter>
                {product.status === "live" ? (
                  <Button
                    variant="link"
                    className="p-0"
                    render={<a href={product.href}>Open app →</a>}
                  />
                ) : (
                  <span className="text-sm text-muted-foreground">
                    Coming soon —{" "}
                    <Button
                      variant="link"
                      className="p-0"
                      render={<a href={product.href}>join the waitlist</a>}
                    />
                  </span>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>

      <footer className="container border-t py-6 mt-8 flex items-center justify-between text-sm text-muted-foreground">
        <span>© {new Date().getFullYear()} BioBoost</span>
        <span>bioboost.fit</span>
      </footer>
    </div>
  )
}
