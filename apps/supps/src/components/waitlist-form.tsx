import { Mail01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { useState } from "react"

export function WaitlistForm() {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setEmail("")
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <p className="text-sm font-medium text-primary">
        You&apos;re on the list! We&apos;ll notify you when we launch.
      </p>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col sm:flex-row gap-3 w-full max-w-md"
    >
      <div className="relative flex-1 group">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
          <HugeiconsIcon icon={Mail01Icon} size={20} />
        </div>
        <Input
          placeholder="Enter your email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="h-12 pl-12 pr-4 bg-background text-base w-full"
        />
      </div>
      <Button
        type="submit"
        size="lg"
        className="h-12 px-8 w-full sm:w-auto font-bold uppercase italic"
      >
        Notify Me
      </Button>
    </form>
  )
}
