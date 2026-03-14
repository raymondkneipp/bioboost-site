import { createEnv } from "@t3-oss/env-core"
import { z } from "zod"

export const env = createEnv({
  clientPrefix: "VITE_",
  client: {
    VITE_WEB_URL: z.string().url().default("http://localhost:3000"),
  },
  runtimeEnv: {
    VITE_WEB_URL: import.meta.env.VITE_WEB_URL ?? process.env["VITE_WEB_URL"],
  },
})
