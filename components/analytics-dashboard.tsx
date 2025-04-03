"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { BarChart, LineChart, PieChart, ChartContainer, ChartTooltip, ChartLegend } from "@/components/ui/chart"
import { Calendar, Download, Filter, BarChart3, PieChartIcon, LineChartIcon } from "lucide-react"
import { useIsMobile } from "@/hooks/use-mobile"

export function AnalyticsDashboard() {
  const isMobile = useIsMobile()

  return (
    <div className="space-y-4 pb-16 md:pb-0">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Analytics Dashboard</h2>
          <p className="text-muted-foreground">View crime statistics and performance metrics</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="outline" className="shadow-sm">
            <Calendar className="mr-2 h-4 w-4" />
            Last 30 Days
          </Button>
          <Button variant="outline" className="shadow-sm">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button variant="outline" className="shadow-sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-white dark:bg-gray-800 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cases Resolved</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">+8 from last month</p>
            <div className="mt-4 h-1 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div className="h-1 bg-green-600 rounded-full" style={{ width: "67%" }} />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">67% resolution rate</p>
          </CardContent>
        </Card>
        <Card className="bg-white dark:bg-gray-800 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Response Time</CardTitle>
            <LineChartIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">14.2m</div>
            <p className="text-xs text-muted-foreground">-2.4m from last month</p>
            <div className="mt-4 h-1 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div className="h-1 bg-blue-600 rounded-full" style={{ width: "85%" }} />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">85% within target time</p>
          </CardContent>
        </Card>
        <Card className="bg-white dark:bg-gray-800 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Evidence Collected</CardTitle>
            <PieChartIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground">+32 from last month</p>
            <div className="mt-4 h-1 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div className="h-1 bg-amber-500 rounded-full" style={{ width: "92%" }} />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">92% properly documented</p>
          </CardContent>
        </Card>
        <Card className="bg-white dark:bg-gray-800 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Patrol Coverage</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">78%</div>
            <p className="text-xs text-muted-foreground">+5% from last month</p>
            <div className="mt-4 h-1 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div className="h-1 bg-primary rounded-full" style={{ width: "78%" }} />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">Target: 80% coverage</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="crime-trends">
        <TabsList className="bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
          <TabsTrigger value="crime-trends" className="rounded-md">
            Crime Trends
          </TabsTrigger>
          <TabsTrigger value="performance" className="rounded-md">
            Performance
          </TabsTrigger>
          <TabsTrigger value="case-types" className="rounded-md">
            Case Types
          </TabsTrigger>
        </TabsList>

        <TabsContent value="crime-trends" className="space-y-4">
          <Card className="bg-white dark:bg-gray-800 shadow-sm">
            <CardHeader>
              <CardTitle>Crime Incidents by Type</CardTitle>
              <CardDescription>Monthly breakdown of incidents by category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className={`${isMobile ? "h-[300px]" : "h-[400px]"}`}>
                <ChartContainer className="h-full" xAxisTitle="Month" yAxisTitle="Number of Incidents">
                  <BarChart
                    data={[
                      { name: "Jan", Theft: 45, Assault: 28, Vandalism: 18, Traffic: 32 },
                      { name: "Feb", Theft: 52, Assault: 24, Vandalism: 22, Traffic: 30 },
                      { name: "Mar", Theft: 48, Assault: 30, Vandalism: 26, Traffic: 28 },
                      { name: "Apr", Theft: 61, Assault: 35, Vandalism: 30, Traffic: 36 },
                      { name: "May", Theft: 55, Assault: 32, Vandalism: 24, Traffic: 40 },
                      { name: "Jun", Theft: 67, Assault: 38, Vandalism: 28, Traffic: 45 },
                    ]}
                    categories={["Theft", "Assault", "Vandalism", "Traffic"]}
                    colors={["#2563eb", "#dc2626", "#f59e0b", "#16a34a"]}
                    valueFormatter={(value) => `${value} incidents`}
                    showAnimation
                  />
                  <ChartTooltip />
                  <ChartLegend />
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card className="bg-white dark:bg-gray-800 shadow-sm">
            <CardHeader>
              <CardTitle>Officer Performance Metrics</CardTitle>
              <CardDescription>Response times and case resolution rates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className={`${isMobile ? "h-[300px]" : "h-[400px]"}`}>
                <ChartContainer className="h-full" xAxisTitle="Month" yAxisTitle="Time (minutes) / Rate (%)">
                  <LineChart
                    data={[
                      { name: "Jan", "Response Time": 18.2, "Resolution Rate": 62 },
                      { name: "Feb", "Response Time": 17.8, "Resolution Rate": 64 },
                      { name: "Mar", "Response Time": 16.5, "Resolution Rate": 65 },
                      { name: "Apr", "Response Time": 15.9, "Resolution Rate": 66 },
                      { name: "May", "Response Time": 15.1, "Resolution Rate": 68 },
                      { name: "Jun", "Response Time": 14.2, "Resolution Rate": 67 },
                    ]}
                    categories={["Response Time", "Resolution Rate"]}
                    colors={["#2563eb", "#16a34a"]}
                    valueFormatter={(value, category) =>
                      category === "Response Time" ? `${value} minutes` : `${value}%`
                    }
                    showAnimation
                    showLegend
                    showXAxis
                    showYAxis
                    showGridLines
                  />
                  <ChartTooltip />
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="case-types" className="space-y-4">
          <Card className="bg-white dark:bg-gray-800 shadow-sm">
            <CardHeader>
              <CardTitle>Case Distribution by Type</CardTitle>
              <CardDescription>Breakdown of current active cases</CardDescription>
            </CardHeader>
            <CardContent>
              <div className={`${isMobile ? "h-[300px]" : "h-[400px]"}`}>
                <ChartContainer className="h-full">
                  <PieChart
                    data={[
                      { name: "Theft", value: 35 },
                      { name: "Assault", value: 20 },
                      { name: "Vandalism", value: 15 },
                      { name: "Traffic", value: 25 },
                      { name: "Other", value: 5 },
                    ]}
                    colors={["#2563eb", "#dc2626", "#f59e0b", "#16a34a", "#6b7280"]}
                    valueFormatter={(value) => `${value} cases`}
                    showAnimation
                    showTooltip
                    showLegend
                  />
                  <ChartTooltip />
                  <ChartLegend />
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

