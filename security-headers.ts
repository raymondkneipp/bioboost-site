// Shared security headers for every app, applied via Nitro routeRules
// (the Vercel preset turns these into Build Output headers, static assets included).
// CSP ships as Report-Only first: TanStack Start SSR emits inline <script> tags and
// shadcn chart/inline styles need 'unsafe-inline'. Move to nonces before enforcing.
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "media-src 'self'",
  "connect-src 'self'",
  "manifest-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join("; ")

export const securityHeaders = {
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "X-Frame-Options": "DENY",
  "Permissions-Policy":
    "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()",
  "Content-Security-Policy": "frame-ancestors 'none'",
  "Content-Security-Policy-Report-Only": csp,
}

export const securityRouteRules = {
  "/**": { headers: securityHeaders },
}
