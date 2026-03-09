import { cn } from "../lib/utils"

type LogoLinkProps<T extends React.ElementType = "a"> = {
  as?: T
} & Omit<React.ComponentPropsWithRef<T>, "as" | "className">

function LogoLink<T extends React.ElementType = "a">({
  as,
  ...props
}: LogoLinkProps<T>) {
  const Comp = as || "a"
  return <Comp className="absolute inset-0" data-slot="logo-link" {...props} />
}

type LogoOwnProps<T extends React.ElementType | undefined = undefined> =
  T extends React.ElementType
    ? {
        as: T
        children?: React.ReactNode
        className?: string
      } & Omit<
        React.ComponentPropsWithRef<T>,
        "as" | "children" | "className"
      > &
        Omit<React.ComponentProps<"div">, "as" | "children" | "className">
    : {
        as?: undefined
        children?: React.ReactNode
        className?: string
      } & Omit<React.ComponentProps<"div">, "as" | "children" | "className">

export function Logo<T extends React.ElementType | undefined = undefined>({
  as,
  children = (
    <>
      <LogoIcon />
      <LogoBrand />
    </>
  ),
  className,
  ...props
}: LogoOwnProps<T>) {
  // Separate div props from link props
  // When `as` is provided, all extra props go to LogoLink
  const hasLink = as !== undefined

  return (
    <div
      className={cn(
        "group/logo relative flex items-center gap-2 w-min",
        "has-[[data-slot=logo-product]]:grid",
        "has-[[data-slot=logo-product]]:grid-cols-[auto_1fr]",
        "has-[[data-slot=logo-product]]:gap-x-2",
        "has-[[data-slot=logo-product]]:gap-y-0",
        className,
      )}
      data-slot="logo"
    >
      {hasLink && <LogoLink as={as} {...props} />}
      {children}
    </div>
  )
}

export function LogoIcon({
  className,
  ...props
}: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      data-slot="logo-icon"
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
      viewBox="0 0 50.271 50.271"
      role="img"
      aria-label="BioBoost Logo"
      className={cn(
        "size-8 text-primary",
        "group-has-[[data-slot=logo-product]]/logo:row-span-2",
        className,
      )}
      {...props}
    >
      <g transform="translate(-26.805 -21.358)">
        <path
          fill="currentColor"
          fillOpacity="1"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeOpacity="0.546"
          strokeWidth="5"
          d="M39.924 0A40 40 0 0 0 0 40a40 40 0 0 0 40 40 40 40 0 0 0 40-40A40 40 0 0 0 40 0zm110 0a40 40 0 0 0-29.238 12.785c-.2.185-.401.36-.596.555C94.998 38.432 112.972 72.76 92.998 93c-19.525 19.785-53.018 2.808-79.666 27.188a40 40 0 0 0-.494.449l-.004.004-.121.113a40 40 0 0 0-1.145 1.111l-.064.063q-.028.03-.055.058A40 40 0 0 0 0 150a40 40 0 0 0 40 40 40 40 0 0 0 28.063-11.496l.01-.01.011-.012a40 40 0 0 0 1.799-1.892c24.275-26.635 7.349-60.084 27.115-79.59 20.24-19.974 54.569-2 79.66-27.092.187-.187.355-.382.533-.572A40 40 0 0 0 190 40a40 40 0 0 0-40-40zm0 110A40 40 0 0 0 110 150a40 40 0 0 0 40 40 40 40 0 0 0 40-40 40 40 0 0 0-40-40z"
          transform="translate(26.805 21.358)scale(.26458)"
        ></path>
      </g>
    </svg>
  )
}

export function LogoBrand({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      data-slot="logo-brand"
      className={cn(
        "font-black text-2xl capitalize uppercase italic tracking-tighter",
        "group-has-[[data-slot=logo-product]]/logo:text-sm",
        "group-has-[[data-slot=logo-product]]/logo:leading-none",

        className,
      )}
      {...props}
    >
      <span className="text-primary">Bio</span>Boost
    </span>
  )
}

type LogoProductProps<T extends React.ElementType = "span"> = {
  as?: T
  children: React.ReactNode
  className?: string
} & Omit<React.ComponentPropsWithRef<T>, "as" | "children" | "className">

export function LogoProduct<T extends React.ElementType = "span">({
  as,
  children,
  className,
  ...props
}: LogoProductProps<T>) {
  const Comp = as || "span"
  return (
    <Comp
      className={cn(
        "relative z-10 text-xl font-black leading-none hover:text-foreground/75 transition-colors",
        className,
      )}
      data-slot="logo-product"
      {...props}
    >
      {children}
    </Comp>
  )
}
