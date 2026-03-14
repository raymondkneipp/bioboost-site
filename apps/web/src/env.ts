import { createEnv } from "@t3-oss/env-core"
import { z } from "zod"

export const env = createEnv({
  clientPrefix: "VITE_",
  client: {
    VITE_SUPPS_URL: z.string().url().default("http://localhost:3001"),
    VITE_BREATHE_URL: z.string().url().default("http://localhost:3002"),
    VITE_CALC_URL: z.string().url().default("http://localhost:3003"),
  },
  runtimeEnv: {
    VITE_SUPPS_URL:
      import.meta.env.VITE_SUPPS_URL ?? process.env["VITE_SUPPS_URL"],
    VITE_BREATHE_URL:
      import.meta.env.VITE_BREATHE_URL ?? process.env["VITE_BREATHE_URL"],
    VITE_CALC_URL:
      import.meta.env.VITE_CALC_URL ?? process.env["VITE_CALC_URL"],
  },
})
