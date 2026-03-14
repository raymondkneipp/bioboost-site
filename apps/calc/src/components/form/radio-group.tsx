interface RadioOption<T extends string> {
  value: T
  label: string
}

interface RadioGroupProps<T extends string> {
  label: string
  name: string
  value: T
  options: RadioOption<T>[]
  onChange: (value: T) => void
}

export function RadioGroup<T extends string>({
  label,
  name,
  value,
  options,
  onChange,
}: RadioGroupProps<T>) {
  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="text-sm font-medium">{label}</legend>
      <div className="flex flex-wrap gap-x-4 gap-y-2">
        {options.map((opt) => (
          <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name={name}
              value={opt.value}
              checked={value === opt.value}
              onChange={() => onChange(opt.value)}
              className="accent-primary"
            />
            <span className="text-sm">{opt.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  )
}
