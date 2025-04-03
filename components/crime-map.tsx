"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Layers, MapPin, Filter, AlertTriangle, FileText, Camera, Navigation } from "lucide-react"
import { useIsMobile } from "@/hooks/use-mobile"

export function CrimeMap() {
  const [mapView, setMapView] = useState("incidents")
  const isMobile = useIsMobile()

  return (
    <div className="space-y-4 pb-16 md:pb-0">
      <Card className="bg-white dark:bg-gray-800 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Crime Map</CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="hidden md:flex">
              <Layers className="mr-2 h-4 w-4" />
              Layers
            </Button>
            <Button variant="outline" size="sm" className="md:hidden">
              <Layers className="h-4 w-4" />
            </Button>
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
          <Tabs defaultValue="incidents" value={mapView} onValueChange={setMapView}>
            <TabsList className="mb-4 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
              <TabsTrigger value="incidents" className="rounded-md">
                Incidents
              </TabsTrigger>
              <TabsTrigger value="heatmap" className="rounded-md">
                Heatmap
              </TabsTrigger>
              <TabsTrigger value="patrol" className="rounded-md">
                Patrol Zones
              </TabsTrigger>
            </TabsList>

            <div
              className={`relative ${isMobile ? "h-[400px]" : "h-[600px]"} bg-gray-100 dark:bg-gray-800 rounded-md overflow-hidden shadow-inner`}
            >
              {/* This would be replaced with an actual map component */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="h-12 w-12 text-primary mx-auto mb-4" />
                  <p className="text-lg font-medium">Interactive Crime Map</p>
                  <p className="text-sm text-muted-foreground max-w-md px-4">
                    This would be an interactive map showing crime incidents, heatmaps, or patrol zones based on the
                    selected tab.
                  </p>
                </div>
              </div>

              {/* Map Controls */}
              <div className="absolute top-4 right-4 flex flex-col gap-2">
                <Button size="icon" variant="secondary" className="shadow-sm">
                  <Plus className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="secondary" className="shadow-sm">
                  <Minus className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="secondary" className="shadow-sm">
                  <Navigation className="h-4 w-4" />
                </Button>
              </div>

              {/* Map Legend */}
              <div className="absolute bottom-4 left-4 bg-white dark:bg-gray-900 p-3 rounded-md shadow-md">
                <h4 className="text-sm font-medium mb-2">Legend</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-red-500" />
                    <span className="text-xs">Violent Crime</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-blue-500" />
                    <span className="text-xs">Property Crime</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-amber-500" />
                    <span className="text-xs">Public Disorder</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-green-500" />
                    <span className="text-xs">Traffic Incident</span>
                  </div>
                </div>
              </div>

              {/* Map Markers (examples) */}
              {mapView === "incidents" && (
                <>
                  <div className="absolute top-1/4 left-1/3">
                    <div className="relative">
                      <AlertTriangle className="h-6 w-6 text-red-500 drop-shadow-md" />
                      <div className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full bg-red-500 border-2 border-white dark:border-gray-800" />
                    </div>
                  </div>
                  <div className="absolute top-1/3 right-1/4">
                    <div className="relative">
                      <FileText className="h-6 w-6 text-blue-500 drop-shadow-md" />
                      <div className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full bg-blue-500 border-2 border-white dark:border-gray-800" />
                    </div>
                  </div>
                  <div className="absolute bottom-1/3 left-1/4">
                    <div className="relative">
                      <Camera className="h-6 w-6 text-amber-500 drop-shadow-md" />
                      <div className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full bg-amber-500 border-2 border-white dark:border-gray-800" />
                    </div>
                  </div>
                </>
              )}
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

function Plus(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  )
}

function Minus(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
    </svg>
  )
}

