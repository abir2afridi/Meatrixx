"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Users,
  Database,
  Activity,
  Target,
  BarChart3,
  Clock,
  Shield,
  TrendingUp,
  CheckCircle,
  Zap,
  Brain,
} from "lucide-react"

export default function AboutPage() {
  const teamMembers = [
    { name: "Munim", role: "Data Specialist", icon: Database },
    { name: "Saif", role: "Production Analysis", icon: BarChart3 },
    { name: "Fahim", role: "Price Intelligence", icon: TrendingUp },
    { name: "Shihab", role: "Consumer Insights", icon: Users },
    { name: "Abir", role: "Economic Analysis", icon: Target },
    { name: "Faysal", role: "Supply & Demand", icon: Activity },
    { name: "Tanjum", role: "Strategic Planning", icon: Brain },
  ]

  const dataSources = [
    "Bangladesh Bureau of Statistics",
    "Department of Livestock Services",
    "Trading Corporation of Bangladesh",
    "Field Surveys & Market Research",
    "Satellite Monitoring Systems",
    "IoT Sensor Networks",
    "Blockchain-based Supply Chain Systems",
  ]

  const coreValues = [
    { title: "Advanced Analytics", icon: BarChart3 },
    { title: "Real-time Data", icon: Clock },
    { title: "Policy Insights", icon: Shield },
    { title: "Market Intelligence", icon: Brain },
  ]

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-foreground">About MeatAnalytics Pro</h1>
        <div className="flex items-center justify-center space-x-2">
          <div className="h-3 w-3 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-muted-foreground">System Status: Operational</span>
        </div>
      </div>

      {/* Platform Mission */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-6 w-6 text-primary" />
            <span>Empowering Bangladesh's Meat Industry</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg text-muted-foreground leading-relaxed">
            MeatAnalytics Pro delivers AI-powered, data-driven insights to support sustainable growth, transparency,
            and strategic planning in the meat supply chain across Bangladesh.
          </p>
        </CardContent>
      </Card>

      {/* Research Team */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-6 w-6 text-primary" />
            <span>Research Team</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {teamMembers.map((member, index) => {
              const IconComponent = member.icon
              return (
                <div
                  key={index}
                  className="flex items-center space-x-3 p-4 rounded-lg border bg-card hover:shadow-md transition-shadow"
                >
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <IconComponent className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{member.name}</h3>
                    <p className="text-sm text-muted-foreground">{member.role}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Technical Specifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="h-6 w-6 text-primary" />
            <span>Technical Specifications</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-primary">96%</div>
              <div className="text-sm text-muted-foreground">Data Accuracy</div>
              <Progress value={96} className="h-2" />
            </div>
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-primary">15min</div>
              <div className="text-sm text-muted-foreground">Update Frequency</div>
              <div className="flex items-center justify-center space-x-1">
                <Clock className="h-4 w-4 text-primary" />
                <span className="text-xs text-muted-foreground">Real-time</span>
              </div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-primary">492</div>
              <div className="text-sm text-muted-foreground">Coverage</div>
              <div className="text-xs text-muted-foreground">8 Divisions, 64 Districts, 492 Upazilas</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Sources */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Database className="h-6 w-6 text-primary" />
            <span>Data Sources</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {dataSources.map((source, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 rounded-lg border bg-card/50">
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                <span className="text-sm text-foreground">{source}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Core Values */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="h-6 w-6 text-primary" />
            <span>Core Values & Highlights</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {coreValues.map((value, index) => {
              const IconComponent = value.icon
              return (
                <div
                  key={index}
                  className="text-center space-y-2 p-4 rounded-lg border bg-card hover:shadow-md transition-shadow"
                >
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                    <IconComponent className="h-6 w-6 text-primary" />
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {value.title}
                  </Badge>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="text-center py-8 border-t">
        <p className="text-sm text-muted-foreground">
          © 2025 Meat Products Analysis Team – Independent University, Bangladesh
        </p>
      </div>
    </div>
  )
}
