import { useState, useMemo, type Dispatch, type SetStateAction } from "react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { Checkbox } from "@workspace/ui/components/checkbox"
import { Slider } from "@workspace/ui/components/slider"
import { Label } from "@workspace/ui/components/label"
import { Badge } from "@workspace/ui/components/badge"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@workspace/ui/components/toggle-group"
import { cn } from "@workspace/ui/lib/utils"
import { HugeiconsIcon } from "@hugeicons/react"
import { SUPPLEMENTS, type Supplement } from "@/lib/supplements"

export function HowItWorks({
  selectedSupps,
  setSelectedSupps,
}: {
  selectedSupps: string[]
  setSelectedSupps: Dispatch<SetStateAction<string[]>>
}) {
  const [dosages, setDosages] = useState<Record<string, number>>(
    Object.fromEntries(SUPPLEMENTS.map((s) => [s.id, s.recommendedDose])),
  )
  const [servings, setServings] = useState("30")
  const [flavor, setFlavor] = useState("blue-razz")

  const toggleSupplement = (id: string) => {
    setSelectedSupps((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    )
  }

  const handleDosageChange = (
    id: string,
    value: number | readonly number[],
  ) => {
    const val = Array.isArray(value) ? value[0] : value
    setDosages((prev) => ({ ...prev, [id]: val }))
  }

  const selectedData = useMemo(() => {
    return SUPPLEMENTS.filter((s) => selectedSupps.includes(s.id))
  }, [selectedSupps])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start py-12">
      <div className="flex flex-col gap-12">
        {/* Step 1 */}
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h3 className="text-2xl font-bold">1. Pick Your Supplements</h3>
            <p className="text-muted-foreground">
              Select the ingredients you want in your personalized blend.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {SUPPLEMENTS.map((supp) => (
              <label
                key={supp.id}
                htmlFor={`supp-${supp.id}`}
                className={cn(
                  "flex items-start gap-4 p-4 rounded-xl border-2 transition-all cursor-pointer hover:bg-muted/50",
                  selectedSupps.includes(supp.id)
                    ? "border-primary bg-primary/5"
                    : "border-border bg-card",
                )}
              >
                <Checkbox
                  id={`supp-${supp.id}`}
                  checked={selectedSupps.includes(supp.id)}
                  onCheckedChange={() => toggleSupplement(supp.id)}
                  className="mt-1"
                />
                <div className="flex flex-col gap-2">
                  <div className="flex flex-col">
                    <span className="font-bold leading-none">{supp.name}</span>
                    <span className="text-sm text-muted-foreground mt-1">
                      {supp.description}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {supp.tags.map((tag) => (
                      <Badge
                        key={tag.label}
                        variant="secondary"
                        className={cn(
                          "text-[10px] h-6 px-2 gap-1.5",
                          tag.color,
                          tag.darkColor,
                        )}
                      >
                        <HugeiconsIcon icon={tag.icon} className="size-3" />
                        {tag.label}
                      </Badge>
                    ))}
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Step 2 */}
        <div
          className={cn(
            "flex flex-col gap-6 transition-opacity",
            selectedSupps.length === 0 && "opacity-50 pointer-events-none",
          )}
        >
          <div className="flex flex-col gap-2">
            <h3 className="text-2xl font-bold">2. Adjust Dosages</h3>
            <p className="text-muted-foreground">
              Fine-tune the amount of each ingredient per serving.
            </p>
          </div>
          <div className="flex flex-col gap-8">
            {selectedData.map((supp) => (
              <div key={supp.id} className="flex flex-col gap-4">
                <div className="flex justify-between items-end">
                  <Label className="font-bold">{supp.name}</Label>
                  <span className="text-sm font-mono bg-muted px-2 py-0.5 rounded">
                    {dosages[supp.id]} {supp.unit}
                  </span>
                </div>
                <div className="relative pb-10">
                  <Slider
                    value={[dosages[supp.id]]}
                    min={supp.minDose}
                    max={supp.maxDose}
                    step={supp.step}
                    onValueChange={(val) => handleDosageChange(supp.id, val)}
                  />
                  {/* Min Label */}
                  <span className="absolute top-6 left-0 text-[10px] text-muted-foreground font-mono uppercase">
                    {supp.minDose}
                    {supp.unit}
                  </span>

                  {/* Recommended Marker */}
                  <div
                    className="absolute top-6 flex flex-col items-center -translate-x-1/2 ml-1"
                    style={{
                      left: `${((supp.recommendedDose - supp.minDose) / (supp.maxDose - supp.minDose)) * 100}%`,
                    }}
                  >
                    <div className="h-2 w-px bg-primary mb-1" />
                    <span className="text-[10px] text-primary font-bold font-mono uppercase whitespace-nowrap">
                      Rec: {supp.recommendedDose}
                      {supp.unit}
                    </span>
                  </div>

                  {/* Max Label */}
                  <span className="absolute top-6 right-0 text-[10px] text-muted-foreground font-mono uppercase text-right">
                    {supp.maxDose}
                    {supp.unit}
                  </span>
                </div>
              </div>
            ))}
            {selectedSupps.length === 0 && (
              <p className="text-sm italic text-muted-foreground">
                Select supplements above to adjust their dosages.
              </p>
            )}
          </div>
        </div>

        {/* Step 3 */}
        <div
          className={cn(
            "flex flex-col gap-6 transition-opacity",
            selectedSupps.length === 0 && "opacity-50 pointer-events-none",
          )}
        >
          <div className="flex flex-col gap-2">
            <h3 className="text-2xl font-bold">3. Pick Servings & Flavor</h3>
            <p className="text-muted-foreground">
              Choose how many servings and your favorite taste.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8">
            <div className="flex flex-col gap-4">
              <Label className="font-bold">Total Servings</Label>
              <ToggleGroup
                value={[servings]}
                onValueChange={(v) => v[0] && setServings(v[0])}
                className="w-full"
                orientation="vertical"
                variant="outline"
              >
                <ToggleGroupItem value="15" className="px-6 h-10">
                  15
                </ToggleGroupItem>
                <ToggleGroupItem value="30" className="px-6 h-10">
                  30
                </ToggleGroupItem>
                <ToggleGroupItem value="60" className="px-6 h-10">
                  60
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
            <div className="flex flex-col gap-4">
              <Label className="font-bold">Flavor</Label>
              <ToggleGroup
                value={[flavor]}
                onValueChange={(v) => v[0] && setFlavor(v[0])}
                className="w-full"
                orientation="vertical"
                variant="outline"
              >
                <ToggleGroupItem value="blue-razz" className="px-4 h-10">
                  Blue Razz
                </ToggleGroupItem>
                <ToggleGroupItem value="fruit-punch" className="px-4 h-10">
                  Fruit Punch
                </ToggleGroupItem>
                <ToggleGroupItem value="unflavored" className="px-4 h-10">
                  Unflavored
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column - Sticky Nutrition Label */}
      <div className="md:sticky md:top-24">
        <NutritionLabel
          supplements={selectedData}
          dosages={dosages}
          servings={servings}
          flavor={flavor}
        />
      </div>
    </div>
  )
}

function NutritionLabel({
  supplements,
  dosages,
  servings,
  flavor,
}: {
  supplements: Supplement[]
  dosages: Record<string, number>
  servings: string
  flavor: string
}) {
  return (
    <Card className="w-full max-w-md mx-auto bg-card text-card-foreground shadow-2xl border-[3px] border-foreground rounded-none">
      <CardHeader className="pb-2 border-b-[8px] border-foreground">
        <CardTitle className="text-4xl font-black italic uppercase leading-none">
          Supplement Facts
        </CardTitle>
        <div className="text-sm font-bold flex flex-col mt-2">
          <span>Servings per container: {servings}</span>
          <div className="flex justify-between">
            <span>Serving Size</span>
            <span className="font-black">1 Scoop (~15g)</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4 flex flex-col gap-1">
        <div className="flex justify-between items-end border-b-2 border-foreground pb-1 mb-1">
          <span className="text-sm font-black uppercase">
            Amount Per Serving
          </span>
          <span className="text-lg font-black italic">Daily Value %</span>
        </div>

        <div className="flex justify-between border-b border-foreground py-0.5 font-bold">
          <span>Calories</span>
          <span>5</span>
        </div>

        {supplements.length === 0 && (
          <div className="py-8 text-center text-muted-foreground font-bold uppercase italic">
            No ingredients selected
          </div>
        )}

        {supplements.map((supp) => (
          <div
            key={supp.id}
            className="flex justify-between border-b border-foreground py-1 font-bold"
          >
            <span>{supp.name}</span>
            <div className="flex items-baseline gap-2">
              <span>
                {dosages[supp.id]}
                {supp.unit}
              </span>
              <span className="text-xs">*</span>
            </div>
          </div>
        ))}

        <div className="mt-4 pt-2 border-t-[6px] border-foreground">
          <p className="text-[10px] leading-tight font-bold italic">
            * Percent Daily Values are based on a 2,000 calorie diet.
          </p>
          <p className="text-[10px] leading-tight font-bold italic">
            † Daily Value not established.
          </p>
        </div>

        <div className="mt-4 flex flex-col gap-1 text-[10px] font-bold uppercase">
          <div>
            <span className="bg-foreground text-background px-1">
              Other Ingredients:
            </span>{" "}
            Natural & Artificial Flavors, Citric Acid, Malic Acid, Sucralose,
            Acesulfame Potassium, {flavor.replace("-", " ")} color.
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
