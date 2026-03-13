import {
  Alert02Icon,
  Apple01Icon,
  BodyWeightIcon,
  ConstructionIcon,
  DumbbellIcon,
  Exchange01Icon,
  FavouriteIcon,
  MedicalMaskIcon,
  Moon02Icon,
  PercentIcon,
  SearchIcon,
  SparklesIcon,
  Target02Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react"
import { Link, type LinkProps } from "@tanstack/react-router"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@workspace/ui/components/input-group"
import {
  Logo,
  LogoBrand,
  LogoIcon,
  LogoProduct,
} from "@workspace/ui/components/logo"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@workspace/ui/components/sidebar"
import { allCalculators } from "content-collections"
import Fuse from "fuse.js"
import * as React from "react"

type CalculatorStatus = "new" | "not-started" | "in-progress"

type SidebarItem = {
  label: string
  icon: IconSvgElement
  to: LinkProps<HTMLAnchorElement>["to"] | string
  status?: CalculatorStatus
}

type SidebarGroupItem = {
  label: string
  items: SidebarItem[]
}

const iconMap: Record<string, IconSvgElement> = {
  BodyWeightIcon,
  PercentIcon,
  DumbbellIcon,
  Apple01Icon,
  Target02Icon,
  FavouriteIcon,
  MedicalMaskIcon,
  Moon02Icon,
  Exchange01Icon,
}

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

const data: SidebarGroupItem[] = groupOrder
  .map((group) => ({
    label: groupLabels[group],
    items: allCalculators
      .filter((calc) => calc.group === group)
      .map((calc) => ({
        label: calc.title,
        icon: iconMap[calc.icon] ?? BodyWeightIcon,
        to: `/${calc.group}/${calc.slug}`,
        status: calc.status,
      })),
  }))
  .filter((group) => group.items.length > 0)

export function AppSidebar() {
  const [results, setResults] = React.useState(data)

  const allItems = React.useMemo(() => data.flatMap((group) => group.items), [])
  const resultCount = React.useMemo(
    () => results.reduce((total, group) => total + group.items.length, 0),
    [results],
  )

  const fuse = React.useMemo(
    () =>
      new Fuse(allItems, {
        includeScore: true,
        keys: ["label"],
        threshold: 0.3,
      }),
    [allItems],
  )

  return (
    <Sidebar variant="sidebar">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              render={
                <Logo as="a" href="http://localhost:3000">
                  <LogoIcon className="size-8!" />
                  <LogoBrand />
                  <LogoProduct as={Link} to="/">
                    Calculators
                  </LogoProduct>
                </Logo>
              }
            />
          </SidebarMenuItem>
        </SidebarMenu>

        <InputGroup>
          <InputGroupInput
            placeholder="Search..."
            onChange={(event) => {
              const { value } = event.target

              if (!value) {
                setResults(data)
                return
              }

              const fuseResults = fuse.search(value)

              const matchedItems = fuseResults.map((r) => r.item)

              // rebuild groups with only matched items
              const groupedResults: SidebarGroupItem[] = data
                .map((group) => ({
                  ...group,
                  items: group.items.filter((item) =>
                    matchedItems.some((match) => match.label === item.label),
                  ),
                }))
                .filter((group) => group.items.length > 0)

              setResults(groupedResults)
            }}
          />
          <InputGroupAddon>
            <HugeiconsIcon icon={SearchIcon} />
          </InputGroupAddon>
          <InputGroupAddon align="inline-end">
            {resultCount} result{resultCount === 1 ? "" : "s"}
          </InputGroupAddon>
        </InputGroup>
      </SidebarHeader>

      <SidebarContent>
        {results.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.label}>
                    <SidebarMenuButton
                      render={
                        <Link to={item.to}>
                          <HugeiconsIcon icon={item.icon} className="size-4" />
                          {item.label}

                          {item.status === "in-progress" && (
                            <HugeiconsIcon
                              icon={ConstructionIcon}
                              className="size-4 text-yellow-700 dark:text-yellow-400 ml-auto"
                              aria-label="not-started"
                            />
                          )}

                          {item.status === "not-started" && (
                            <HugeiconsIcon
                              icon={Alert02Icon}
                              className="size-4 text-red-700 dark:text-red-400 ml-auto"
                              aria-label="not-started"
                            />
                          )}

                          {item.status === "new" && (
                            <HugeiconsIcon
                              icon={SparklesIcon}
                              className="size-4 text-primary ml-auto"
                              aria-label="not-started"
                            />
                          )}
                        </Link>
                      }
                    />
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter />
    </Sidebar>
  )
}
