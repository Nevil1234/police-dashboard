"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  AlertCircle,
  Clock,
  FileText,
  Filter,
  MapPin,
  MessageSquare,
  MoreHorizontal,
  Plus,
  Upload,
  User2,
  X,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { CaseTimeline } from "@/components/case-timeline"
import { EvidenceGallery } from "@/components/evidence-gallery"
import { CrimeMap } from "@/components/crime-map"
import { CommunicationHub } from "@/components/communication-hub"
import { AnalyticsDashboard } from "@/components/analytics-dashboard"
import { useIsMobile } from "@/hooks/use-mobile"

export function DashboardView() {
  const [activeTab, setActiveTab] = useState("overview")
  const isMobile = useIsMobile()

  return (
    <div className="space-y-4 pb-16 md:pb-0">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Officer Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, Officer Smith. You have <span className="font-medium text-red-500">12 active cases</span> and{" "}
            <span className="font-medium text-amber-500">5 pending messages</span>.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button className="shadow-sm">
            <Plus className="mr-2 h-4 w-4" />
            New Case
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="w-full md:w-auto flex overflow-x-auto md:inline-flex p-0.5 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <TabsTrigger value="overview" className="flex-1 md:flex-none rounded-md">
            Overview
          </TabsTrigger>
          <TabsTrigger value="cases" className="flex-1 md:flex-none rounded-md">
            Cases
          </TabsTrigger>
          <TabsTrigger value="communications" className="flex-1 md:flex-none rounded-md">
            Communications
          </TabsTrigger>
          <TabsTrigger value="map" className="flex-1 md:flex-none rounded-md">
            Map
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex-1 md:flex-none rounded-md">
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="bg-white dark:bg-gray-800 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Cases</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">+2 from yesterday</p>
              </CardContent>
            </Card>
            <Card className="bg-white dark:bg-gray-800 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Urgent Cases</CardTitle>
                <AlertCircle className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4</div>
                <p className="text-xs text-muted-foreground">+1 from yesterday</p>
              </CardContent>
            </Card>
            <Card className="bg-white dark:bg-gray-800 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Messages</CardTitle>
                <MessageSquare className="h-4 w-4 text-amber-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">5</div>
                <p className="text-xs text-muted-foreground">-2 from yesterday</p>
              </CardContent>
            </Card>
            <Card className="bg-white dark:bg-gray-800 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg. Response Time</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">14.2m</div>
                <p className="text-xs text-muted-foreground">-2.4m from last week</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="lg:col-span-4 bg-white dark:bg-gray-800 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Active Cases</CardTitle>
                  <CardDescription>Your currently assigned cases</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="hidden md:flex">
                    <Filter className="mr-2 h-4 w-4" />
                    Filter
                  </Button>
                  <Button variant="outline" size="sm" className="md:hidden">
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className={`${isMobile ? "h-[300px]" : "h-[400px]"} pr-4`}>
                  <div className="space-y-4">
                    <CaseCard
                      id="2023-0456"
                      title="Theft Report"
                      description="Stolen vehicle from parking garage"
                      priority="urgent"
                      location="Downtown, 5th & Main"
                      time="2 hours ago"
                      officer="J. Smith"
                    />
                    <CaseCard
                      id="2023-0455"
                      title="Assault"
                      description="Physical altercation at local bar"
                      priority="urgent"
                      location="Nightlife District, Club Azure"
                      time="5 hours ago"
                      officer="J. Smith"
                    />
                    <CaseCard
                      id="2023-0452"
                      title="Vandalism"
                      description="Graffiti on public property"
                      priority="investigation"
                      location="Westside Park"
                      time="1 day ago"
                      officer="J. Smith"
                    />
                    <CaseCard
                      id="2023-0448"
                      title="Noise Complaint"
                      description="Loud music from residential property"
                      priority="investigation"
                      location="Riverside Apartments, Unit 304"
                      time="2 days ago"
                      officer="J. Smith"
                    />
                  </div>
                </ScrollArea>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  View All Cases
                </Button>
              </CardFooter>
            </Card>

            <Card className="lg:col-span-3 bg-white dark:bg-gray-800 shadow-sm">
              <CardHeader>
                <CardTitle>Recent Alerts</CardTitle>
                <CardDescription>Latest notifications and updates</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className={`${isMobile ? "h-[300px]" : "h-[400px]"} pr-4`}>
                  <div className="space-y-4">
                    <AlertCard
                      title="New Evidence Uploaded"
                      description="Officer Johnson uploaded new photos to case #2023-0456"
                      time="10 minutes ago"
                      type="evidence"
                    />
                    <AlertCard
                      title="Urgent: Backup Requested"
                      description="Officer Rodriguez requesting assistance at 7th & Oak"
                      time="25 minutes ago"
                      type="urgent"
                    />
                    <AlertCard
                      title="Case Status Updated"
                      description="Case #2023-0442 changed to 'Under Investigation'"
                      time="1 hour ago"
                      type="update"
                    />
                    <AlertCard
                      title="New Message from Civilian"
                      description="Jane Doe sent a message regarding case #2023-0448"
                      time="2 hours ago"
                      type="message"
                    />
                  </div>
                </ScrollArea>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  View All Alerts
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="cases">
          <Card className="bg-white dark:bg-gray-800 shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Case Management</CardTitle>
                  <CardDescription>View and manage your assigned cases</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button className="shadow-sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Case
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="active">
                <TabsList className="mb-4 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
                  <TabsTrigger value="active" className="rounded-md">
                    Active (12)
                  </TabsTrigger>
                  <TabsTrigger value="pending" className="rounded-md">
                    Pending (3)
                  </TabsTrigger>
                  <TabsTrigger value="closed" className="rounded-md">
                    Closed (24)
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="active">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" className="hidden md:flex">
                          <Filter className="mr-2 h-4 w-4" />
                          Filter
                        </Button>
                        <Button variant="outline" size="sm" className="md:hidden">
                          <Filter className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="hidden md:flex">
                          Sort by: Recent
                        </Button>
                      </div>
                      <div className="text-sm text-muted-foreground">Showing 12 of 12 cases</div>
                    </div>

                    <div className="space-y-4">
                      <CaseCard
                        id="2023-0456"
                        title="Theft Report"
                        description="Stolen vehicle from parking garage"
                        priority="urgent"
                        location="Downtown, 5th & Main"
                        time="2 hours ago"
                        officer="J. Smith"
                        expanded={true}
                      />
                      <CaseCard
                        id="2023-0455"
                        title="Assault"
                        description="Physical altercation at local bar"
                        priority="urgent"
                        location="Nightlife District, Club Azure"
                        time="5 hours ago"
                        officer="J. Smith"
                      />
                      <CaseCard
                        id="2023-0452"
                        title="Vandalism"
                        description="Graffiti on public property"
                        priority="investigation"
                        location="Westside Park"
                        time="1 day ago"
                        officer="J. Smith"
                      />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="communications">
          <CommunicationHub />
        </TabsContent>

        <TabsContent value="map">
          <CrimeMap />
        </TabsContent>

        <TabsContent value="analytics">
          <AnalyticsDashboard />
        </TabsContent>
      </Tabs>
    </div>
  )
}

interface CaseCardProps {
  id: string
  title: string
  description: string
  priority: "urgent" | "investigation" | "resolved"
  location: string
  time: string
  officer: string
  expanded?: boolean
}

function CaseCard({ id, title, description, priority, location, time, officer, expanded = false }: CaseCardProps) {
  const [isExpanded, setIsExpanded] = useState(expanded)
  const isMobile = useIsMobile()

  return (
    <Card className="overflow-hidden bg-white dark:bg-gray-800 shadow-sm">
      <div className="flex">
        <div
          className={`w-1.5 ${
            priority === "urgent" ? "bg-red-500" : priority === "investigation" ? "bg-amber-500" : "bg-green-600"
          }`}
        />
        <div className="flex-1">
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <CardTitle className="text-base">{title}</CardTitle>
                  <Badge variant="outline" className="text-xs">
                    #{id}
                  </Badge>
                  <Badge
                    className={`text-xs ${
                      priority === "urgent"
                        ? "bg-red-500"
                        : priority === "investigation"
                          ? "bg-amber-500"
                          : "bg-green-600"
                    }`}
                  >
                    {priority === "urgent" ? "Urgent" : priority === "investigation" ? "Investigation" : "Resolved"}
                  </Badge>
                </div>
                <CardDescription className="mt-1">{description}</CardDescription>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <MessageSquare className="mr-2 h-4 w-4" />
                    <span>Message</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Upload className="mr-2 h-4 w-4" />
                    <span>Add Evidence</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <X className="mr-2 h-4 w-4" />
                    <span>Close Case</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>
          <CardContent className="pb-3">
            <div className="flex flex-wrap gap-y-2 text-sm">
              <div className="flex items-center mr-4">
                <MapPin className="mr-1 h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">{location}</span>
              </div>
              <div className="flex items-center mr-4">
                <Clock className="mr-1 h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">{time}</span>
              </div>
              <div className="flex items-center">
                <User2 className="mr-1 h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">{officer}</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="pt-0">
            <div className="flex w-full justify-between">
              <div className="flex gap-2">
                {!isMobile ? (
                  <>
                    <Button variant="outline" size="sm">
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Message
                    </Button>
                    <Button variant="outline" size="sm">
                      <Upload className="mr-2 h-4 w-4" />
                      Evidence
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="outline" size="sm" className="px-3">
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="px-3">
                      <Upload className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
              <Button variant="ghost" size="sm" onClick={() => setIsExpanded(!isExpanded)}>
                {isExpanded ? "Collapse" : "Expand"}
              </Button>
            </div>
          </CardFooter>

          {isExpanded && (
            <div className="px-6 pb-6">
              <Separator className="my-4" />
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="text-sm font-medium mb-2">Case Timeline</h4>
                  <CaseTimeline caseId={id} />
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-2">Evidence Gallery</h4>
                  <EvidenceGallery caseId={id} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}

interface AlertCardProps {
  title: string
  description: string
  time: string
  type: "urgent" | "evidence" | "update" | "message" | "notification" | "system"
}

function AlertCard({ title, description, time, type }: AlertCardProps) {
  return (
    <Card className="bg-white dark:bg-gray-800 shadow-sm">
      <CardHeader className="p-4 pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div
              className={`h-2 w-2 rounded-full ${
                type === "urgent"
                  ? "bg-red-500"
                  : type === "evidence"
                    ? "bg-blue-500"
                    : type === "update"
                      ? "bg-amber-500"
                      : type === "message"
                        ? "bg-green-500"
                        : type === "notification"
                          ? "bg-purple-500"
                          : "bg-gray-500"
              }`}
            />
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
          </div>
          <Button variant="ghost" size="icon" className="h-6 w-6">
            <X className="h-3 w-3" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <p className="text-sm text-muted-foreground">{description}</p>
        <p className="text-xs text-muted-foreground mt-2">{time}</p>
      </CardContent>
    </Card>
  )
}

