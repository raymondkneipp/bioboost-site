import {
  createRootRoute,
  HeadContent,
  Outlet,
  Scripts,
  useMatches,
} from "@tanstack/react-router"
import appCss from "@workspace/ui/globals.css?url"
import { Header } from "@/components/header"

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
        title: "BioBoost Breathe | Guided Breathing Exercises",
      },
      {
        name: "description",
        content:
          "Guided breathing exercises for stress relief, better sleep, and improved focus. Choose from preset programs or create your own custom routine.",
      },
      {
        name: "keywords",
        content:
          "breathing exercises, guided breathing, meditation, box breathing, 4-7-8, stress relief, relaxation",
      },
      {
        property: "og:title",
        content: "BioBoost Breathe | Guided Breathing Exercises",
      },
      {
        property: "og:description",
        content:
          "Guided breathing exercises for stress relief, better sleep, and improved focus.",
      },
      {
        property: "og:image",
        content: "/web-app-manifest-512x512.png",
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
        content: "BioBoost Breathe | Guided Breathing Exercises",
      },
      {
        name: "twitter:description",
        content:
          "Guided breathing exercises for stress relief, better sleep, and improved focus.",
      },
      {
        name: "twitter:image",
        content: "/web-app-manifest-512x512.png",
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
  component: RootComponent,
})

function RootComponent() {
  const matches = useMatches()
  const isSession = matches.some((m) => m.routeId === "/programs/$id")

  return (
    <>
      {!isSession && <Header />}
      <main className={isSession ? "flex flex-col" : "flex flex-col pt-16"}>
        <Outlet />
      </main>
    </>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  )
}
