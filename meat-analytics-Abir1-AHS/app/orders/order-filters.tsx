"use client"

import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

export default function OrderFilters({
  filters,
  onFiltersChange,
}: {
  filters: { status: string; dateFrom: string; dateTo: string; minAmount: string; maxAmount: string }
  onFiltersChange: (f: any) => void
}) {
  return (
    <Card className="p-4 grid grid-cols-1 md:grid-cols-5 gap-3">
      <Input placeholder="Status" value={filters.status} onChange={(e) => onFiltersChange({ ...filters, status: e.target.value })} />
      <Input type="date" placeholder="From" value={filters.dateFrom} onChange={(e) => onFiltersChange({ ...filters, dateFrom: e.target.value })} />
      <Input type="date" placeholder="To" value={filters.dateTo} onChange={(e) => onFiltersChange({ ...filters, dateTo: e.target.value })} />
      <Input type="number" placeholder="Min Amount" value={filters.minAmount} onChange={(e) => onFiltersChange({ ...filters, minAmount: e.target.value })} />
      <Input type="number" placeholder="Max Amount" value={filters.maxAmount} onChange={(e) => onFiltersChange({ ...filters, maxAmount: e.target.value })} />
    </Card>
  )
}
