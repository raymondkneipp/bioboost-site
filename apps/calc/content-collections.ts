import { defineCollection, defineConfig } from "@content-collections/core"
import { compileMDX } from "@content-collections/mdx"
import { z } from "zod"

const calculators = defineCollection({
  name: "calculators",
  directory: "content/calculators",
  include: "**/*.mdx",
  schema: z.object({
    title: z.string(),
    icon: z.string(),
    summary: z.string(),
    status: z.enum(["new", "in-progress", "not-started"]),
    faqs: z.array(
      z.object({
        question: z.string(),
        answer: z.string(),
      }),
    ),
    content: z.string(),
  }),
  transform: async (document, context) => {
    const mdx = await compileMDX(context, document)
    return {
      ...document,
      mdx,
      group: document._meta.directory,
      slug: document._meta.fileName.replace(/\.mdx$/, ""),
    }
  },
})

export default defineConfig({
  content: [calculators],
})
