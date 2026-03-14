import {
  FlashIcon,
  AiViewIcon,
  BodyPartMuscleIcon,
  EnergyIcon,
  BrainIcon,
  OrganicFoodIcon,
  WorkoutRunIcon,
  DropletIcon,
  Shield01Icon,
  FavouriteIcon,
  MoonIcon,
  FireIcon,
} from "@hugeicons/core-free-icons"
import type { IconSvgElement } from "@hugeicons/react"

export type Tag = {
  label: string
  icon: IconSvgElement
  color: string
  darkColor: string
  chartColor: string
}

export type Supplement = {
  id: string
  name: string
  description: string
  tags: Tag[]
  minDose: number
  maxDose: number
  recommendedDose: number
  step: number
  unit: string
}

export const TAGS = {
  STRENGTH: {
    label: "Strength",
    icon: BodyPartMuscleIcon,
    color: "bg-red-100 text-red-700",
    darkColor: "dark:bg-red-900/30 dark:text-red-400",
    chartColor: "var(--chart-1)",
  },
  ENERGY: {
    label: "Energy",
    icon: EnergyIcon,
    color: "bg-yellow-100 text-yellow-700",
    darkColor: "dark:bg-yellow-900/30 dark:text-yellow-400",
    chartColor: "var(--chart-2)",
  },
  FOCUS: {
    label: "Focus",
    icon: BrainIcon,
    color: "bg-blue-100 text-blue-700",
    darkColor: "dark:bg-blue-900/30 dark:text-blue-400",
    chartColor: "var(--chart-3)",
  },
  PUMP: {
    label: "Pump",
    icon: FlashIcon,
    color: "bg-purple-100 text-purple-700",
    darkColor: "dark:bg-purple-900/30 dark:text-purple-400",
    chartColor: "var(--chart-4)",
  },
  RECOVERY: {
    label: "Recovery",
    icon: AiViewIcon,
    color: "bg-green-100 text-green-700",
    darkColor: "dark:bg-green-900/30 dark:text-green-400",
    chartColor: "var(--chart-5)",
  },
  HEALTH: {
    label: "Health",
    icon: OrganicFoodIcon,
    color: "bg-emerald-100 text-emerald-700",
    darkColor: "dark:bg-emerald-900/30 dark:text-emerald-400",
    chartColor: "var(--chart-1)",
  },
  ENDURANCE: {
    label: "Endurance",
    icon: WorkoutRunIcon,
    color: "bg-orange-100 text-orange-700",
    darkColor: "dark:bg-orange-900/30 dark:text-orange-400",
    chartColor: "var(--chart-2)",
  },
  HYDRATION: {
    label: "Hydration",
    icon: DropletIcon,
    color: "bg-cyan-100 text-cyan-700",
    darkColor: "dark:bg-cyan-900/30 dark:text-cyan-400",
    chartColor: "var(--chart-3)",
  },
  IMMUNITY: {
    label: "Immunity",
    icon: Shield01Icon,
    color: "bg-indigo-100 text-indigo-700",
    darkColor: "dark:bg-indigo-900/30 dark:text-indigo-400",
    chartColor: "var(--chart-4)",
  },
  VITALITY: {
    label: "Vitality",
    icon: FavouriteIcon,
    color: "bg-pink-100 text-pink-700",
    darkColor: "dark:bg-pink-900/30 dark:text-pink-400",
    chartColor: "var(--chart-5)",
  },
  SLEEP: {
    label: "Sleep",
    icon: MoonIcon,
    color: "bg-slate-100 text-slate-700",
    darkColor: "dark:bg-slate-900/30 dark:text-slate-400",
    chartColor: "var(--chart-1)",
  },
  FAT_BURN: {
    label: "Fat Burn",
    icon: FireIcon,
    color: "bg-amber-100 text-amber-700",
    darkColor: "dark:bg-amber-900/30 dark:text-amber-400",
    chartColor: "var(--chart-2)",
  },
}

export const SUPPLEMENTS: Supplement[] = [
  {
    id: "creatine",
    name: "Creatine Monohydrate",
    description: "Supports muscle strength, power, and high-intensity exercise performance.",
    tags: [TAGS.STRENGTH, TAGS.RECOVERY],
    minDose: 3000,
    maxDose: 10000,
    recommendedDose: 5000,
    step: 500,
    unit: "mg",
  },
  {
    id: "beta-alanine",
    name: "Beta-Alanine",
    description: "Helps buffer lactic acid buildup in muscles, improving endurance.",
    tags: [TAGS.STRENGTH, TAGS.ENERGY, TAGS.ENDURANCE],
    minDose: 1600,
    maxDose: 6400,
    recommendedDose: 3200,
    step: 400,
    unit: "mg",
  },
  {
    id: "citrulline",
    name: "L-Citrulline Malate",
    description: "Boosts nitric oxide production for better blood flow and 'pump'.",
    tags: [TAGS.PUMP, TAGS.ENERGY],
    minDose: 3000,
    maxDose: 10000,
    recommendedDose: 6000,
    step: 500,
    unit: "mg",
  },
  {
    id: "caffeine",
    name: "Caffeine Anhydrous",
    description: "Increases alertness, focus, and energy levels during workouts.",
    tags: [TAGS.ENERGY, TAGS.FOCUS, TAGS.FAT_BURN],
    minDose: 50,
    maxDose: 400,
    recommendedDose: 200,
    step: 50,
    unit: "mg",
  },
  {
    id: "alpha-gpc",
    name: "Alpha-GPC",
    description: "Cognitive enhancer that may improve focus and mind-muscle connection.",
    tags: [TAGS.FOCUS, TAGS.VITALITY],
    minDose: 150,
    maxDose: 600,
    recommendedDose: 300,
    step: 150,
    unit: "mg",
  },
]
