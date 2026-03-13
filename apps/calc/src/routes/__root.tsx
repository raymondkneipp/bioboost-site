import { Settings01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  createRootRoute,
  HeadContent,
  Link,
  Scripts,
  useMatches,
} from "@tanstack/react-router"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@workspace/ui/components/breadcrumb"
import { Button } from "@workspace/ui/components/button"
import { Footer } from "@workspace/ui/components/footer"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@workspace/ui/components/sheet"
import {
  SidebarProvider,
  SidebarTrigger,
} from "@workspace/ui/components/sidebar"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@workspace/ui/components/toggle-group"
import { AppSidebar } from "@/components/app-sidebar"
import { SettingsProvider, useSettings } from "@/contexts/settings"
import appCss from "@/styles.css?url"

const groupLabels: Record<string, string> = {
  "body-composition": "Body Composition",
  "strength-fitness": "Strength & Fitness",
  nutrition: "Nutrition",
  "weight-goals": "Weight Goals",
  cardio: "Cardio",
  health: "Health",
  lifestyle: "Lifestyle",
  converters: "Converters",
}

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
        title: "BioBoost | Calculators",
      },
      {
        name: "description",
        content: "",
      },
      {
        name: "keywords",
        content: "",
      },
      {
        property: "og:title",
        content: "BioBoost | Calculators",
      },
      {
        property: "og:description",
        content: "",
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
        content: "BioBoost | Calculators",
      },
      {
        name: "twitter:description",
        content: "",
      },
      // {
      //   name: "twitter:image",
      //   content: "/supplements.png",
      // },
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

function AppBreadcrumb() {
  const matches = useMatches()

  const calcMatch = [...matches]
    .reverse()
    .find((m) => "group" in m.params && "slug" in m.params)

  const groupMatch = [...matches]
    .reverse()
    .find((m) => "group" in m.params && !("slug" in m.params))

  const group = (calcMatch ?? groupMatch)?.params.group as string | undefined

  return (
    <Breadcrumb className="flex-1">
      <BreadcrumbList>
        <BreadcrumbItem className={calcMatch ? "hidden sm:flex" : undefined}>
          {calcMatch || groupMatch ? (
            <BreadcrumbLink render={<Link to="/">Home</Link>} />
          ) : (
            <BreadcrumbPage>Home</BreadcrumbPage>
          )}
        </BreadcrumbItem>

        {group && (
          <>
            <BreadcrumbSeparator className={calcMatch ? "hidden sm:flex" : undefined} />
            <BreadcrumbItem>
              {calcMatch ? (
                <BreadcrumbLink
                  render={
                    <Link to="/$group/" params={{ group }}>
                      {groupLabels[group] ?? group}
                    </Link>
                  }
                />
              ) : (
                <BreadcrumbPage>{groupLabels[group] ?? group}</BreadcrumbPage>
              )}
            </BreadcrumbItem>
          </>
        )}

        {calcMatch && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>
                {(calcMatch.loaderData as { title?: string })?.title ??
                  calcMatch.params.slug}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  )
}

function SettingsSheet() {
  const { units, setUnits } = useSettings()

  return (
    <Sheet>
      <SheetTrigger
        render={
          <Button variant="ghost" size="icon-lg">
            <span className="sr-only">Settings</span>
            <HugeiconsIcon icon={Settings01Icon} />
          </Button>
        }
      />
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Settings</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-4 px-6">
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium">Unit System</span>
            <ToggleGroup
              variant="outline"
              value={[units]}
              onValueChange={(values) => {
                const v = values[0]
                if (v === "metric" || v === "imperial") setUnits(v)
              }}
            >
              <ToggleGroupItem value="metric">Metric</ToggleGroupItem>
              <ToggleGroupItem value="imperial">Imperial</ToggleGroupItem>
            </ToggleGroup>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <SettingsProvider>
          <SidebarProvider>
            <AppSidebar />
            <div className="flex flex-col flex-1">
              <header className="py-2 sm:py-4 container max-w-full flex items-center justify-between gap-2 border-b sticky top-0 z-10 bg-background">
                <SidebarTrigger size="icon-lg" />
                <AppBreadcrumb />
                <SettingsSheet />
              </header>
              <main className="container py-6 flex flex-col gap-4 max-w-prose flex-1 min-h-svh">
                {children}
              </main>
              <Footer />
            </div>
          </SidebarProvider>
        </SettingsProvider>
        <Scripts />
      </body>
    </html>
  )
}
