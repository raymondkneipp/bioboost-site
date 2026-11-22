import tailwindcss from "@tailwindcss/vite"
import { tanstackStart } from "@tanstack/react-start/plugin/vite"
import viteReact from "@vitejs/plugin-react"
import { nitro } from "nitro/vite"
import { defineConfig } from "vite"
import { securityRouteRules } from "../../security-headers"

const config = defineConfig({
  resolve: { tsconfigPaths: true },
  plugins: [
    nitro({ routeRules: securityRouteRules }),
    tailwindcss(),
    tanstackStart(),
    viteReact(),
  ],
})

export default config
