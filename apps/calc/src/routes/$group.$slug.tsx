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

const mdxComponents = {
  BmiCalculator,
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
