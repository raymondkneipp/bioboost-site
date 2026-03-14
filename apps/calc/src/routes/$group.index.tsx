import * as Icons from "@hugeicons/core-free-icons"
import { ArrowLeft01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react"
import { createFileRoute, Link, notFound } from "@tanstack/react-router"
import { Button } from "@workspace/ui/components/button"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@workspace/ui/components/input-group"
import { allCalculators } from "content-collections"
import Fuse from "fuse.js"
import * as React from "react"

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

export const Route = createFileRoute("/$group/")({
  loader: ({ params }) => {
    const label = groupLabels[params.group]
    if (!label) throw notFound()

    const calculators = allCalculators.filter(
      (calc) => calc.group === params.group,
    )

    return { label, calculators }
  },
  component: RouteComponent,
  notFoundComponent: () => <div>Not found</div>,
  head: ({ loaderData }) => ({
    meta: [{ title: `${loaderData?.label ?? "Calculators"} | BioBoost` }],
  }),
})

function RouteComponent() {
  const { group } = Route.useParams()
  const { label, calculators } = Route.useLoaderData()

  const [query, setQuery] = React.useState("")

  const fuse = React.useMemo(
    () => new Fuse(calculators, { keys: ["title", "summary"], threshold: 0.3 }),
    [calculators],
  )

  const results = query ? fuse.search(query).map((r) => r.item) : calculators

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon-lg" render={<Link to="/" />}>
          <HugeiconsIcon icon={ArrowLeft01Icon} className="size-4" />
        </Button>
        <h1 className="text-2xl font-bold">{label}</h1>
      </div>

      <InputGroup>
        <InputGroupAddon>
          <HugeiconsIcon icon={Icons.SearchIcon} />
        </InputGroupAddon>
        <InputGroupInput
          placeholder={`Search ${label.toLowerCase()}...`}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </InputGroup>

      <ul className="flex flex-col gap-2">
        {results.map((calc) => (
          <li key={calc.slug}>
            <Link
              to="/$group/$slug"
              params={{ group, slug: calc.slug }}
              className="flex items-center gap-3 rounded-lg border p-3 hover:bg-muted transition-colors"
            >
              <HugeiconsIcon
              // biome-ignore lint/performance/noDynamicNamespaceImportAccess: icon name from content frontmatter
                icon={Icons[calc.icon as keyof typeof Icons] as IconSvgElement}
                className="size-5 shrink-0"
              />
              <div className="flex flex-col gap-0.5">
                <span className="font-medium text-sm">{calc.title}</span>
                <span className="text-xs text-muted-foreground line-clamp-1">
                  {calc.summary}
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
