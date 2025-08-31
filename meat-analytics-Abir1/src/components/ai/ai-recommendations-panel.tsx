"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Brain, TrendingUp, AlertTriangle, CheckCircle, RefreshCw } from "lucide-react"

interface Recommendation {
  id: string
  type: "optimization" | "alert" | "suggestion"
  priority: "high" | "medium" | "low"
  title: string
  description: string
  impact: string
  action?: string
}

export function AIRecommendationsPanel() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([
    {
      id: "1",
      type: "alert",
      priority: "high",
      title: "Low Stock Alert - Organic Chicken",
      description: "Current stock (80 kg) is below minimum threshold (100 kg). Demand has increased 15% this week.",
      impact: "Potential stockout in 3-4 days",
      action: "Order 200 kg immediately"
    },
    {
      id: "2",
      type: "optimization",
      priority: "medium",
      title: "Price Optimization Opportunity",
      description: "Beef prices can be increased by 8-12% based on current market demand and competitor analysis.",
      impact: "Potential 15% revenue increase",
      action: "Adjust pricing strategy"
    },
    {
      id: "3",
      type: "suggestion",
      priority: "medium",
      title: "Seasonal Demand Pattern",
      description: "Fish demand typically increases by 25% during monsoon season (starting next month).",
      impact: "Opportunity to increase fish inventory",
      action: "Plan inventory increase"
    },
    {
      id: "4",
      type: "optimization",
      priority: "low",
      title: "Route Optimization",
      description: "Delivery routes to Chittagong can be optimized to reduce travel time by 20%.",
      impact: "Save 2 hours per delivery",
      action: "Update delivery routes"
    }
  ])

  const [isGenerating, setIsGenerating] = useState(false)

  const generateNewRecommendations = async () => {
    setIsGenerating(true)
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const newRecommendations: Recommendation[] = [
      {
        id: "5",
        type: "alert",
        priority: "high",
        title: "Quality Control Alert",
        description: "Temperature fluctuations detected in cold storage unit 2. This may affect product quality.",
        impact: "Risk of product spoilage",
        action: "Check refrigeration system"
      },
      {
        id: "6",
        type: "suggestion",
        priority: "medium",
        title: "Vendor Performance Insight",
        description: "Dhaka Suppliers has 98% on-time delivery rate. Consider increasing order volume.",
        impact: "Improved supply chain reliability",
        action: "Negotiate better terms"
      }
    ]
    
    setRecommendations(prev => [...newRecommendations, ...prev.slice(0, 4)])
    setIsGenerating(false)
  }

  const dismissRecommendation = (id: string) => {
    setRecommendations(prev => prev.filter(rec => rec.id !== id))
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800 border-red-200"
      case "medium": return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low": return "bg-green-100 text-green-800 border-green-200"
      default: return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "alert": return <AlertTriangle className="h-4 w-4 text-red-500" />
      case "optimization": return <TrendingUp className="h-4 w-4 text-blue-500" />
      case "suggestion": return <Brain className="h-4 w-4 text-purple-500" />
      default: return <CheckCircle className="h-4 w-4 text-gray-500" />
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Smart Recommendations</h3>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={generateNewRecommendations}
          disabled={isGenerating}
        >
          {isGenerating ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </>
          )}
        </Button>
      </div>

      <div className="space-y-3">
        {recommendations.map((rec) => (
          <Card key={rec.id} className="border-l-4 border-l-primary">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  {getTypeIcon(rec.type)}
                  <CardTitle className="text-sm font-medium">{rec.title}</CardTitle>
                </div>
                <div className="flex items-center gap-2">
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${getPriorityColor(rec.priority)}`}
                  >
                    {rec.priority.toUpperCase()}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => dismissRecommendation(rec.id)}
                    className="h-6 w-6 p-0 hover:bg-red-100"
                  >
                    ×
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <CardDescription className="text-sm mb-2">
                {rec.description}
              </CardDescription>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">
                  <strong>Impact:</strong> {rec.impact}
                </span>
                {rec.action && (
                  <Button variant="outline" size="sm" className="h-6 text-xs">
                    {rec.action}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {recommendations.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <Brain className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-center">
              No recommendations available at the moment.
              <br />
              Click refresh to generate new insights.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
