import * as Icons from "@hugeicons/core-free-icons"
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react"
import { createFileRoute, Link } from "@tanstack/react-router"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@workspace/ui/components/input-group"
import { allCalculators } from "content-collections"
import Fuse from "fuse.js"
import * as React from "react"

export const Route = createFileRoute("/")({ component: App })

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

const groupOrder = Object.keys(groupLabels)

const fuse = new Fuse(allCalculators, {
  keys: ["title", "summary"],
  threshold: 0.3,
})

function App() {
  const [query, setQuery] = React.useState("")

  const groups = React.useMemo(() => {
    const items = query ? fuse.search(query).map((r) => r.item) : allCalculators

    return groupOrder
      .map((group) => ({
        key: group,
        label: groupLabels[group],
        items: items.filter((c) => c.group === group),
      }))
      .filter((g) => g.items.length > 0)
  }, [query])

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">Calculators</h1>
        <p className="text-muted-foreground">
          Health and fitness calculators to help you understand your body and
          reach your goals.
        </p>
      </div>

      <InputGroup>
        <InputGroupAddon>
          <HugeiconsIcon icon={Icons.SearchIcon} />
        </InputGroupAddon>
        <InputGroupInput
          placeholder="Search calculators..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </InputGroup>

      {groups.map((group) => (
        <section key={group.key} className="flex flex-col gap-3">
          <Link
            to="/$group/"
            params={{ group: group.key }}
            className="font-semibold text-sm hover:underline"
          >
            {group.label}
          </Link>
          <ul className="flex flex-col gap-2">
            {group.items.map((calc) => (
              <li key={calc.slug}>
                <Link
                  to="/$group/$slug"
                  params={{ group: group.key, slug: calc.slug }}
                  className="flex items-center gap-3 rounded-lg border p-3 hover:bg-muted transition-colors"
                >
                  <HugeiconsIcon
                    icon={
                      Icons[calc.icon as keyof typeof Icons] as IconSvgElement
                    }
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
        </section>
      ))}
    </div>
  )
}
