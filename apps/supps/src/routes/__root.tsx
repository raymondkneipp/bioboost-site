import { createRootRoute, HeadContent, Scripts } from "@tanstack/react-router"
import { Logo } from "@workspace/ui/components/logo"
import appCss from "@workspace/ui/globals.css?url"
import { Footer } from "@/components/footer"

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "BioBoost | Personalized Supplement Blends",
      },
      {
        name: "description",
        content: "Optimize your performance with personalized supplement blends. Tailored to your goals, no proprietary blends, no more DIY. Join the waitlist for BioBoost.",
      },
      {
        name: "keywords",
        content: "supplements, personalized supplements, bioboost, performance, fitness, health, custom supplements",
      },
      {
        property: "og:title",
        content: "BioBoost | Personalized Supplement Blends",
      },
      {
        property: "og:description",
        content: "Optimize your performance with personalized supplement blends tailored to your unique goals. No proprietary blends, just quality ingredients.",
      },
      {
        property: "og:image",
        content: "/supplements.png",
      },
      {
        property: "og:type",
        content: "website",
      },
      {
        name: "twitter:card",
        content: "summary_large_image",
      },
      {
        name: "twitter:title",
        content: "BioBoost | Personalized Supplement Blends",
      },
      {
        name: "twitter:description",
        content: "Get notified when personalized supplement blends are available. No more proprietary blends or DIY measuring.",
      },
      {
        name: "twitter:image",
        content: "/supplements.png",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      {
        rel: "icon",
        href: "/favicon.ico",
        type: "image/x-icon",
        sizes: "32x32",
      },
      {
        rel: "icon",
        href: "/favicon.svg",
        type: "image/svg+xml",
      },
      {
        rel: "icon",
        href: "/favicon-96x96.png",
        type: "image/png",
        sizes: "96x96",
      },
      {
        rel: "apple-touch-icon",
        href: "/apple-touch-icon.png",
      },
      {
        rel: "manifest",
        href: "/site.webmanifest",
      },
    ],
  }),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <header className="fixed top-0 inset-x-0 z-20 bg-background/75 backdrop-blur-sm">
          <div className="container py-4 md:py-6">
            <Logo />
          </div>
        </header>
        <main className="flex flex-col gap-12">{children}</main>
        <Footer />
        <Scripts />
      </body>
    </html>
  )
}
