import * as React from "react"
import type { AnyFieldApi } from "@tanstack/react-form"
import { InputGroupInput } from "@workspace/ui/components/input-group"
import { Field } from "./field"

interface NumberFieldProps {
  field: AnyFieldApi
  label: string
  unit?: string
  placeholder?: string
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"]
  integer?: boolean
}

export function NumberField({
  field,
  label,
  unit,
  placeholder,
  inputMode = "decimal",
  integer = false,
}: NumberFieldProps) {
  return (
    <Field label={label} unit={unit} field={field}>
      <InputGroupInput
        id={field.name}
        name={field.name}
        type="number"
        inputMode={inputMode}
        placeholder={placeholder}
        value={field.state.value}
        onChange={(e) =>
          field.handleChange(
            e.target.value === ""
              ? ""
              : integer
                ? parseInt(e.target.value, 10)
                : parseFloat(e.target.value),
          )
        }
        onBlur={field.handleBlur}
        aria-invalid={
          field.state.meta.isTouched && field.state.meta.errors.length > 0
            ? true
            : undefined
        }
      />
    </Field>
  )
}
