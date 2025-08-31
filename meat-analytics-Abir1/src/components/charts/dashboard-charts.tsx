"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, TrendingUp, Package, Activity } from "lucide-react"

interface ChartData {
  name: string
  value: number
}

interface InventoryData {
  name: string
  current: number
  min: number
  max: number
}

export function ProductionVsDemandChart() {
  const data = [
    { month: "Jan", production: 4000, demand: 2400 },
    { month: "Feb", production: 3000, demand: 1398 },
    { month: "Mar", production: 2000, demand: 9800 },
    { month: "Apr", production: 2780, demand: 3908 },
    { month: "May", production: 1890, demand: 4800 },
    { month: "Jun", production: 2390, demand: 3800 },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Production vs Demand
        </CardTitle>
        <CardDescription>Monthly production and demand comparison</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="font-medium w-8">{item.month}</span>
                <div className="flex gap-2">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <span className="text-sm text-muted-foreground">Production</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-sm text-muted-foreground">Demand</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm">
                  <span className="text-blue-600 font-medium">{item.production.toLocaleString()}</span>
                  {" / "}
                  <span className="text-green-600 font-medium">{item.demand.toLocaleString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export function ProductDistributionChart({ data }: { data: ChartData[] }) {
  const total = data.reduce((sum, item) => sum + item.value, 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Product Distribution
        </CardTitle>
        <CardDescription>Distribution of products by type</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.map((item, index) => {
            const percentage = total > 0 ? Math.round((item.value / total) * 100) : 0
            return (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      index === 0
                        ? "bg-blue-500"
                        : index === 1
                          ? "bg-green-500"
                          : index === 2
                            ? "bg-yellow-500"
                            : "bg-red-500"
                    }`}
                  ></div>
                  <span className="font-medium capitalize">{item.name}</span>
                </div>
                <div className="text-right">
                  <div className="font-bold">{item.value}</div>
                  <div className="text-sm text-muted-foreground">{percentage}%</div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

export function PriceHistoryChart() {
  const data = [
    { month: "Jan", beef: 850, chicken: 480, mutton: 720 },
    { month: "Feb", beef: 820, chicken: 460, mutton: 700 },
    { month: "Mar", beef: 880, chicken: 500, mutton: 750 },
    { month: "Apr", beef: 900, chicken: 520, mutton: 780 },
    { month: "May", beef: 870, chicken: 490, mutton: 740 },
    { month: "Jun", beef: 910, chicken: 510, mutton: 800 },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Price History
        </CardTitle>
        <CardDescription>Monthly price trends by product type</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-4 text-sm">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span>Beef</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <span>Chicken</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-purple-500"></div>
              <span>Mutton</span>
            </div>
          </div>
          {data.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="font-medium w-8">{item.month}</span>
              <div className="text-right text-sm">
                <span className="text-red-600 font-medium">৳{item.beef}</span>
                {" / "}
                <span className="text-yellow-600 font-medium">৳{item.chicken}</span>
                {" / "}
                <span className="text-purple-600 font-medium">৳{item.mutton}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export function InventoryLevelsChart({ data }: { data: InventoryData[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Inventory Levels
        </CardTitle>
        <CardDescription>Current stock levels vs thresholds</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.map((item, index) => {
            const percentage = item.max > 0 ? Math.round((item.current / item.max) * 100) : 0
            const isLow = item.current <= item.min
            
            return (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm">{item.name}</span>
                  <div className="text-right">
                    <div className={`font-bold ${isLow ? 'text-red-600' : 'text-green-600'}`}>
                      {item.current}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Min: {item.min} | Max: {item.max}
                    </div>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      isLow ? 'bg-red-500' : percentage > 80 ? 'bg-green-500' : 'bg-yellow-500'
                    }`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  ></div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
