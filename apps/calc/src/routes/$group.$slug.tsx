import { MDXContent } from "@content-collections/mdx/react"
import { createFileRoute, notFound } from "@tanstack/react-router"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@workspace/ui/components/accordion"
import { allCalculators } from "content-collections"
import { BmiCalculator } from "@/components/calculators/bmi"
import { BmrCalculator } from "@/components/calculators/bmr"
import { OneRepMaxCalculator } from "@/components/calculators/one-rep-max"
import { BodyFatCalculator } from "@/components/calculators/body-fat"
import { IdealBodyWeightCalculator } from "@/components/calculators/ideal-body-weight"
import { LeanBodyMassCalculator } from "@/components/calculators/lean-body-mass"
import { TDEECalculator } from "@/components/calculators/tdee"
import { MaintenanceCaloriesCalculator } from "@/components/calculators/maintenance-calories"
import { CalorieDeficitCalculator } from "@/components/calculators/calorie-deficit"
import { ProteinIntakeCalculator } from "@/components/calculators/protein-intake"
import { MacrosCalculator } from "@/components/calculators/macros"
import { MaxHeartRateCalculator } from "@/components/calculators/max-heart-rate"
import { TargetHeartRateCalculator } from "@/components/calculators/target-heart-rate"
import { RunningPaceCalculator } from "@/components/calculators/running-pace"
import { VO2MaxCalculator } from "@/components/calculators/vo2-max"
import { BloodPressureCalculator } from "@/components/calculators/blood-pressure"
import { CholesterolCalculator } from "@/components/calculators/cholesterol"
import { CaffeineCalculator } from "@/components/calculators/caffeine"
import { HydrationCalculator } from "@/components/calculators/hydration"
import { SleepCycleCalculator } from "@/components/calculators/sleep-cycle"
import { RepMaxCalculator } from "@/components/calculators/rep-max"
import { TrainingMaxCalculator } from "@/components/calculators/training-max"
import { WilksCalculator } from "@/components/calculators/wilks-score"
import { WeightLossTimelineCalculator } from "@/components/calculators/weight-loss-timeline"
import { TargetWeightDateCalculator } from "@/components/calculators/target-weight-date"
import { CaloriesBurnedCalculator } from "@/components/calculators/calories-burned"
import { HeightConverter } from "@/components/calculators/height-converter"
import { WeightConverter } from "@/components/calculators/weight-converter"
import { PaceConverter } from "@/components/calculators/pace-converter"
import { DotsCalculator } from "@/components/calculators/dots-score"

const mdxComponents = {
  BmiCalculator,
  BmrCalculator,
  OneRepMaxCalculator,
  BodyFatCalculator,
  IdealBodyWeightCalculator,
  LeanBodyMassCalculator,
  TDEECalculator,
  MaintenanceCaloriesCalculator,
  CalorieDeficitCalculator,
  ProteinIntakeCalculator,
  MacrosCalculator,
  MaxHeartRateCalculator,
  TargetHeartRateCalculator,
  RunningPaceCalculator,
  VO2MaxCalculator,
  BloodPressureCalculator,
  CholesterolCalculator,
  CaffeineCalculator,
  HydrationCalculator,
  SleepCycleCalculator,
  RepMaxCalculator,
  TrainingMaxCalculator,
  WilksCalculator,
  WeightLossTimelineCalculator,
  TargetWeightDateCalculator,
  CaloriesBurnedCalculator,
  HeightConverter,
  WeightConverter,
  PaceConverter,
  DotsCalculator,
}

export const Route = createFileRoute("/$group/$slug")({
  loader: ({ params }) => {
    const calculator = allCalculators.find(
      (calc) => calc.group === params.group && calc.slug === params.slug,
    )

    if (!calculator) {
      throw notFound()
    }

    return calculator
  },
  component: RouteComponent,
  notFoundComponent: () => <div>Not found</div>,
  head: ({ loaderData }) => ({
    meta: [
      {
        title: `${loaderData?.title ?? "Calculators"} | BioBoost`,
      },
      {
        name: "description",
        content: loaderData?.summary ?? "",
      },
      {
        property: "og:title",
        content: `${loaderData?.title ?? "Calculators"} | BioBoost`,
      },
      {
        property: "og:description",
        content: loaderData?.summary ?? "",
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
        content: `${loaderData?.title ?? "Calculators"} | BioBoost`,
      },
      {
        name: "twitter:description",
        content: loaderData?.summary ?? "",
      },
    ],
  }),
})

function RouteComponent() {
  const { faqs, mdx } = Route.useLoaderData()

  return (
    <div className="flex flex-col gap-4">
      <div className="prose prose-sm lg:prose-base dark:prose-invert prose-headings:font-bold">
        <MDXContent code={mdx} components={mdxComponents} />

        <h2>FAQ</h2>
      </div>

      <Accordion>
        {faqs.map((faq) => (
          <AccordionItem value={faq.question} key={faq.question}>
            <AccordionTrigger>{faq.question}</AccordionTrigger>
            <AccordionContent>{faq.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}
