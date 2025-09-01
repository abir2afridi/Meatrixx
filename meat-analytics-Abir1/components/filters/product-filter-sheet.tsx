"use client"

import { useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"

export type ProductFilterValues = {
  categories?: string[]
  districts?: string[]
  priceRange?: [number, number]
}

type ProductFilterSheetProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  allCategories: string[]
  allDistricts?: string[]
  priceMin?: number
  priceMax?: number
  value: ProductFilterValues
  onChange: (next: ProductFilterValues) => void
  onApply: () => void
  onReset?: () => void
}

export function ProductFilterSheet({
  open,
  onOpenChange,
  allCategories,
  allDistricts = [],
  priceMin = 0,
  priceMax = 1000,
  value,
  onChange,
  onApply,
  onReset,
}: ProductFilterSheetProps) {
  const [min, max] = useMemo(() => value.priceRange ?? [priceMin, priceMax], [value.priceRange, priceMin, priceMax])
  const categories = value.categories ?? []
  const districts = value.districts ?? []

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[320px] sm:w-[380px]">
        <SheetHeader>
          <SheetTitle>Filters</SheetTitle>
          <SheetDescription>Refine the product list</SheetDescription>
        </SheetHeader>
        <div className="mt-6 space-y-6">
          <div>
            <div className="text-sm font-medium mb-3">Categories</div>
            <div className="grid grid-cols-2 gap-2">
              {allCategories.map((cat) => {
                const checked = categories.includes(cat)
                return (
                  <label key={cat} className="flex items-center gap-2 text-sm cursor-pointer">
                    <Checkbox
                      checked={checked}
                      onCheckedChange={(c) => {
                        const next = new Set(categories)
                        if (c) next.add(cat)
                        else next.delete(cat)
                        onChange({ ...value, categories: Array.from(next) })
                      }}
                    />
                    <span className="capitalize">{cat}</span>
                  </label>
                )
              })}
            </div>
          </div>

          {!!allDistricts.length && (
            <div>
              <div className="text-sm font-medium mb-3">Districts</div>
              <div className="grid grid-cols-2 gap-2 max-h-40 overflow-auto pr-1">
                {allDistricts.map((d) => {
                  const checked = districts.includes(d)
                  return (
                    <label key={d} className="flex items-center gap-2 text-sm cursor-pointer">
                      <Checkbox
                        checked={checked}
                        onCheckedChange={(c) => {
                          const next = new Set(districts)
                          if (c) next.add(d)
                          else next.delete(d)
                          onChange({ ...value, districts: Array.from(next) })
                        }}
                      />
                      <span>{d}</span>
                    </label>
                  )
                })}
              </div>
            </div>
          )}

          <div>
            <div className="text-sm font-medium mb-3">Price Range</div>
            <div className="px-2 py-1">
              <Slider
                min={priceMin}
                max={priceMax}
                step={10}
                value={[min, max]}
                onValueChange={([a, b]) => onChange({ ...value, priceRange: [a, b] })}
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-2">
                <span>৳{Math.round(min)}</span>
                <span>৳{Math.round(max)}</span>
              </div>
            </div>
          </div>

          <Separator />

          <div className="flex justify-between gap-2">
            <Button variant="outline" onClick={onReset} className="flex-1">
              Reset
            </Button>
            <Button onClick={onApply} className="flex-1">
              Apply Filters
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
