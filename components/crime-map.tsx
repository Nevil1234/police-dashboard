"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import type React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Layers, MapPin, Filter, AlertTriangle, FileText, Camera, Navigation } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { supabase } from "@/supabase/supabaseClient";
interface Incident {
  id: string;
  latitude: number;
  longitude: number;
  title: string;
  priority?: "HIGH" | "NORMAL" | "EMERGENCY";
}

export function CrimeMap({ incidents: propIncidents }: { incidents?: Incident[] }) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapView, setMapView] = useState("incidents");
  const [incidents, setIncidents] = useState<Incident[]>(propIncidents || []);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const isMobile = useIsMobile();

  // Use propIncidents if provided, otherwise fetch from Supabase
  useEffect(() => {
    if (propIncidents) {
      const validIncidents = propIncidents.filter(incident => incident.latitude && incident.longitude);
      setIncidents(validIncidents);
      setLoading(false); // No need to load if props are provided
      console.log("Using Prop Incidents:", validIncidents); // Debug log
      return;
    }

    async function fetchIncidents() {
      setLoading(true);
      setError(null);

      try {
        const { data, error } = await supabase
          .from("crime_reports")
          .select("id, crime_type, priority, latitude, longitude")
          .eq("current_status", "active");

        if (error) throw new Error(error.message);

        const transformedIncidents: Incident[] = (data || []).map((report: any) => ({
          id: report.id,
          latitude: report.latitude || 0,
          longitude: report.longitude || 0,
          title: report.crime_type,
          priority: report.priority,
        })).filter((incident) => incident.latitude && incident.longitude);

        setIncidents(transformedIncidents);
        console.log("Fetched Incidents:", transformedIncidents); // Debug log
      } catch (err) {
        console.error("Error fetching incidents:", err);
        setError("Failed to load incidents");
      } finally {
        setLoading(false);
      }
    }

    fetchIncidents();
  }, [propIncidents]);

  useEffect(() => {
    if (!mapRef.current) return;

    // Initialize Mapbox
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    if (!mapboxgl.accessToken) {
      console.error("Mapbox token is missing. Please set NEXT_PUBLIC_MAPBOX_TOKEN in .env.local");
      setError("Mapbox token is missing");
      setLoading(false);
      return;
    }

    const map = new mapboxgl.Map({
      container: mapRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [0, 0],
      zoom: 2,
    });

    // Ensure map loads
    map.on("load", () => {
      setLoading(false);
    });

    // Adjust map center and zoom based on incidents
    const validIncidents = incidents.filter(incident => incident.latitude && incident.longitude);
    if (validIncidents.length > 0) {
      const bounds = new mapboxgl.LngLatBounds();
      validIncidents.forEach((incident) => {
        bounds.extend([incident.longitude, incident.latitude]);
      });
      map.fitBounds(bounds, { padding: 50 });
    } else {
      console.warn("No valid incidents with coordinates found.");
    }

    // Add navigation control
    map.addControl(new mapboxgl.NavigationControl(), "top-right");

    // Add markers for incidents
    if (mapView === "incidents" && validIncidents.length > 0) {
      validIncidents.forEach((incident) => {
        let iconHtml;
        switch (incident.priority) {
          case "EMERGENCY":
            iconHtml = `<div class="relative"><AlertTriangle className="h-6 w-6 text-red-500 drop-shadow-md" /><div class="absolute -bottom-1 -right-1 h-3 w-3 rounded-full bg-red-500 border-2 border-white dark:border-gray-800" /></div>`;
            break;
          case "HIGH":
            iconHtml = `<div class="relative"><FileText className="h-6 w-6 text-blue-500 drop-shadow-md" /><div class="absolute -bottom-1 -right-1 h-3 w-3 rounded-full bg-blue-500 border-2 border-white dark:border-gray-800" /></div>`;
            break;
          case "NORMAL":
          default:
            iconHtml = `<div class="relative"><Camera className="h-6 w-6 text-amber-500 drop-shadow-md" /><div class="absolute -bottom-1 -right-1 h-3 w-3 rounded-full bg-amber-500 border-2 border-white dark:border-gray-800" /></div>`;
        }

        const marker = new mapboxgl.Marker({
          element: createCustomMarker(iconHtml),
        })
          .setLngLat([incident.longitude, incident.latitude])
          .setPopup(new mapboxgl.Popup().setText(`${incident.title} (ID: ${incident.id})`))
          .addTo(map);

        // Debug marker addition
        console.log(`Added marker for ${incident.title} at [${incident.latitude}, ${incident.longitude}]`);
      });
    } else {
      console.warn("No incidents to display on the map.");
    }

    // Clean up on unmount
    return () => {
      map.remove();
    };
  }, [mapView, incidents]);

  // Helper function to create custom marker elements
  const createCustomMarker = (html: string) => {
    const marker = document.createElement("div");
    marker.innerHTML = html;
    return marker.firstChild as HTMLElement;
  };

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
              className={`relative ${isMobile ? "h-[400px]" : "h-[600px]"} bg-gray-100 dark:bg-gray-800 rounded-md overflow-hidden`}
              ref={mapRef}
            >
              {/* Map Legend */}
              <div className="absolute bottom-4 left-4 bg-white dark:bg-gray-900 p-3 rounded-md shadow-md">
                <h4 className="text-sm font-medium mb-2">Legend</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-red-500" />
                    <span className="text-xs">Emergency</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-blue-500" />
                    <span className="text-xs">High Priority</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-amber-500" />
                    <span className="text-xs">Normal</span>
                  </div>
                </div>
              </div>
              {(loading || incidents.length === 0) && (
                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                  {loading ? "Loading incidents..." : "No incidents to display."}
                </div>
              )}
              {error && (
                <div className="absolute inset-0 flex items-center justify-center text-red-500">
                  {error}
                </div>
              )}
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}