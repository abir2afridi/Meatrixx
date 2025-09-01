"use client"

import { useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"

export type DistributionFilters = {
  statuses?: string[]
  drivers?: string[]
  origins?: string[]
  destinations?: string[]
  dateFrom?: string
  dateTo?: string
}

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  allStatuses: string[]
  allDrivers: string[]
  allOrigins: string[]
  allDestinations: string[]
  value: DistributionFilters
  onChange: (next: DistributionFilters) => void
  onApply: () => void
  onReset?: () => void
}

export function DistributionFilterSheet({
  open,
  onOpenChange,
  allStatuses,
  allDrivers,
  allOrigins,
  allDestinations,
  value,
  onChange,
  onApply,
  onReset,
}: Props) {
  const statuses = value.statuses ?? []
  const drivers = value.drivers ?? []
  const origins = value.origins ?? []
  const destinations = value.destinations ?? []

  const Section = ({ title, items, selected, onToggle }: { title: string; items: string[]; selected: string[]; onToggle: (item: string, checked: boolean) => void }) => (
    <div>
      <div className="text-sm font-medium mb-3">{title}</div>
      <div className="grid grid-cols-2 gap-2 max-h-40 overflow-auto pr-1">
        {items.map((item) => {
          const checked = selected.includes(item)
          return (
            <label key={item} className="flex items-center gap-2 text-sm cursor-pointer">
              <Checkbox checked={checked} onCheckedChange={(c) => onToggle(item, !!c)} />
              <span className="truncate" title={item}>{item}</span>
            </label>
          )
        })}
      </div>
    </div>
  )

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[320px] sm:w-[380px]">
        <SheetHeader>
          <SheetTitle>Filters</SheetTitle>
          <SheetDescription>Refine distribution routes</SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          <Section
            title="Status"
            items={allStatuses}
            selected={statuses}
            onToggle={(item, c) => {
              const set = new Set(statuses)
              c ? set.add(item) : set.delete(item)
              onChange({ ...value, statuses: Array.from(set) })
            }}
          />

          <Section
            title="Drivers"
            items={allDrivers}
            selected={drivers}
            onToggle={(item, c) => {
              const set = new Set(drivers)
              c ? set.add(item) : set.delete(item)
              onChange({ ...value, drivers: Array.from(set) })
            }}
          />

          <Section
            title="Origins"
            items={allOrigins}
            selected={origins}
            onToggle={(item, c) => {
              const set = new Set(origins)
              c ? set.add(item) : set.delete(item)
              onChange({ ...value, origins: Array.from(set) })
            }}
          />

          <Section
            title="Destinations"
            items={allDestinations}
            selected={destinations}
            onToggle={(item, c) => {
              const set = new Set(destinations)
              c ? set.add(item) : set.delete(item)
              onChange({ ...value, destinations: Array.from(set) })
            }}
          />

          <div>
            <div className="text-sm font-medium mb-3">Date Range</div>
            <div className="flex items-center gap-2">
              <Input type="date" value={value.dateFrom ?? ""} onChange={(e) => onChange({ ...value, dateFrom: e.target.value })} />
              <span className="text-xs text-muted-foreground">to</span>
              <Input type="date" value={value.dateTo ?? ""} onChange={(e) => onChange({ ...value, dateTo: e.target.value })} />
            </div>
          </div>

          <Separator />
          <div className="flex justify-between gap-2">
            <Button variant="outline" onClick={onReset} className="flex-1">Reset</Button>
            <Button onClick={onApply} className="flex-1">Apply Filters</Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
