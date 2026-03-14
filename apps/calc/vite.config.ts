import contentCollections from "@content-collections/vite"
import tailwindcss from "@tailwindcss/vite"
import { tanstackStart } from "@tanstack/react-start/plugin/vite"
import viteReact from "@vitejs/plugin-react"
import { nitro } from "nitro/vite"
import { defineConfig } from "vite"

const config = defineConfig({
  resolve: { tsconfigPaths: true },
  plugins: [
    contentCollections(),
    nitro({
      preset: process.env.VERCEL ? "vercel" : undefined,
      rollupConfig: {
        plugins: [
          {
            // use-sync-external-store CJS shims call __require("react") via
            // createRequire, which fails in serverless environments where
            // node_modules is not present. React is already bundled as
            // require_react() in the same chunk, so we can redirect to it.
            name: "fix-react-cjs-interop",
            renderChunk(code: string) {
              if (
                !code.includes('__require("react")') ||
                !code.includes("require_react")
              )
                return null
              return {
                code: code.replace(/__require\("react"\)/g, "require_react()"),
                map: null,
              }
            },
          },
        ],
      },
    }),
    tailwindcss(),
    tanstackStart(),
    viteReact(),
  ],
})

export default config
