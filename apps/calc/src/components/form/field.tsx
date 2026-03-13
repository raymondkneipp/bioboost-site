import * as React from "react"
import type { AnyFieldApi } from "@tanstack/react-form"
import { Label } from "@workspace/ui/components/label"
import {
  InputGroup,
  InputGroupAddon,
} from "@workspace/ui/components/input-group"

interface FieldProps {
  label: string
  unit?: string
  field: AnyFieldApi
  children: React.ReactNode
}

export function Field({ label, unit, field, children }: FieldProps) {
  const hasError =
    field.state.meta.isTouched && field.state.meta.errors.length > 0

  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={field.name}>{label}</Label>
      <InputGroup>
        {children}
        {unit && (
          <InputGroupAddon align="inline-end">{unit}</InputGroupAddon>
        )}
      </InputGroup>
      {hasError && (
        <p className="text-destructive text-xs">
          {field.state.meta.errors[0]?.message ?? String(field.state.meta.errors[0])}
        </p>
      )}
    </div>
  )
}
