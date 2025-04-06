"use client";

import { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useIsMobile } from "@/hooks/use-mobile";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/supabase/supabaseClient";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import mapboxgl from "mapbox-gl";
import 'mapbox-gl/dist/mapbox-gl.css';
import Heatmap from "@/components/HeatMap";
// Set Mapbox access token
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

// Type definitions
interface Station {
  id: string;
  name: string;
  contact_number: string;
  address: string;
  location: {
    coordinates: [number, number];
  } | null;
}

interface Report {
  id: string;
  crime_type: string;
  description: string;
  priority: "HIGH" | "NORMAL" | "EMERGENCY";
  latitude: number;
  longitude: number;
  created_at: string;
  station_id?: string;
  assigned_officer?: string;
  current_status: string;
}

interface Officer {
  id: string;
  badge_number: string;
  is_available: boolean;
  station_id: string;
}

interface CrimeLocation {
  lat: number;
  lng: number;
  type: string;
}

interface CrimeFeature extends GeoJSON.Feature<GeoJSON.Point> {
  properties: {
    type: string;
    priority?: "HIGH" | "NORMAL" | "EMERGENCY";
  };
}

export default function StationDashboard() {
  // State and ref declarations
  const [station, setStation] = useState<Station | null>(null);
  const [pendingReports, setPendingReports] = useState<Report[]>([]);
  const [availableOfficers, setAvailableOfficers] = useState<Officer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [mapLoading, setMapLoading] = useState<boolean>(true);
  const [crimeLocations, setCrimeLocations] = useState<CrimeLocation[]>([]);
  const [showHeatmap, setShowHeatmap] = useState<boolean>(false);
  const isMobile = useIsMobile();
  const { data: session, status } = useSession();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  // Data fetching effects
  useEffect(() => {
    async function fetchData() {
      if (status !== "authenticated" || !session?.user?.id) return;

      setLoading(true);
      setError(null);

      try {
        // Fetch station data
        const { data: stationData, error: stationError } = await supabase
          .from("police_stations")
          .select("id, name, contact_number, address, location")
          .eq("user_id", session.user.id)
          .single();

        if (stationError) throw stationError;
        setStation(stationData);

        // Fetch pending reports
        const { data: reportsData, error: reportsError } = await supabase
          .from("crime_reports")
          .select("id, crime_type, description, priority, latitude, longitude, created_at, station_id, assigned_officer, current_status")
          .is("assigned_officer", null)
          .eq("current_status", "active");

        if (reportsError) throw reportsError;
        setPendingReports(reportsData || []);

        // Transform data for heatmap
        const locations = (reportsData || [])
          .filter(report => report.latitude && report.longitude)
          .map(report => ({
            lat: report.latitude,
            lng: report.longitude,
            type: report.crime_type,
            priority: report.priority
          }));
        setCrimeLocations(locations);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [session, status]);

  useEffect(() => {
    async function fetchAvailableOfficers() {
      if (!station?.id) return;

      try {
        const { data, error } = await supabase
          .from("police_officers")
          .select("id, badge_number, is_available, station_id")
          .eq("station_id", station.id)
          .eq("is_available", true);

        if (error) throw error;
        setAvailableOfficers(data || []);
      } catch (err) {
        console.error("Error fetching available officers:", err);
        setError("Failed to load available officers");
      }
    }

    fetchAvailableOfficers();
  }, [station]);

  // Map initialization and heatmap effects
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [72.9713, 22.5334],
      zoom: 12
    });

    mapRef.current = map;

    map.on('load', () => {
      setMapLoading(false);
      if (showHeatmap) {
        updateHeatmap();
      }
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (mapRef.current && showHeatmap) {
      updateHeatmap();
    } else if (mapRef.current && !showHeatmap) {
      clearHeatmap();
    }
  }, [showHeatmap, crimeLocations]);

  // Map functions
  const updateHeatmap = () => {
    if (!mapRef.current || crimeLocations.length === 0) return;

    const map = mapRef.current;

    // Create properly typed GeoJSON FeatureCollection
    const geojson: GeoJSON.FeatureCollection<GeoJSON.Point> = {
      type: 'FeatureCollection',
      features: crimeLocations.map<CrimeFeature>(location => ({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [location.lng, location.lat]
        },
        properties: {
          type: location.type,
          priority: location.priority
        }
      }))
    };

    // Remove existing layers if they exist
    if (map.getLayer('heatmap-layer')) map.removeLayer('heatmap-layer');
    if (map.getLayer('crime-points')) map.removeLayer('crime-points');
    if (map.getSource('crime-locations')) map.removeSource('crime-locations');

    // Add source with proper typing
    map.addSource('crime-locations', {
      type: 'geojson',
      data: geojson
    });

    // Add heatmap layer
    map.addLayer({
      id: 'heatmap-layer',
      type: 'heatmap',
      source: 'crime-locations',
      maxzoom: 15,
      paint: {
        'heatmap-intensity': ['interpolate', ['linear'], ['zoom'], 0, 1, 15, 3],
        'heatmap-color': [
          'interpolate',
          ['linear'],
          ['heatmap-density'],
          0, 'rgba(0, 0, 255, 0)',
          0.2, 'blue',
          0.4, 'lime',
          0.6, 'yellow',
          0.8, 'orange',
          1, 'red'
        ],
        'heatmap-radius': ['interpolate', ['linear'], ['zoom'], 0, 2, 15, 20],
        'heatmap-opacity': 0.8
      }
    });

    // Add point markers
    map.addLayer({
      id: 'crime-points',
      type: 'circle',
      source: 'crime-locations',
      paint: {
        'circle-radius': [
          'case',
          ['==', ['get', 'priority'], 'EMERGENCY'], 8,
          ['==', ['get', 'priority'], 'HIGH'], 6,
          4
        ],
        'circle-color': [
          'case',
          ['==', ['get', 'priority'], 'EMERGENCY'], '#ff0000',
          ['==', ['get', 'priority'], 'HIGH'], '#ff9900',
          '#ffff00'
        ],
        'circle-stroke-width': 1,
        'circle-stroke-color': '#ffffff'
      }
    });

    // Center map on station location if available
    if (station?.location?.coordinates) {
      map.flyTo({
        center: station.location.coordinates,
        zoom: 12
      });
    }
  };

  const clearHeatmap = () => {
    if (!mapRef.current) return;
    
    const map = mapRef.current;
    if (map.getLayer('heatmap-layer')) map.removeLayer('heatmap-layer');
    if (map.getLayer('crime-points')) map.removeLayer('crime-points');
    if (map.getSource('crime-locations')) map.removeSource('crime-locations');
  };

  const assignOfficer = async (reportId: string, officerId: string) => {
    if (!station?.id) return;

    try {
      const { error: updateError } = await supabase
        .from("crime_reports")
        .update({ assigned_officer: officerId, current_status: "in_progress" })
        .eq("id", reportId);

      if (updateError) throw updateError;

      setPendingReports(prevReports =>
        prevReports
          .map(report =>
            report.id === reportId 
              ? { ...report, assigned_officer: officerId, current_status: "in_progress" } 
              : report
          )
          .filter(report => !report.assigned_officer)
      );
    } catch (err) {
      console.error("Error assigning officer:", err);
      setError("Failed to assign officer");
    }
  };

  // Render logic
  if (status === "loading") return <div>Loading...</div>;
  if (status === "unauthenticated") return <div>Please sign in to access the station dashboard.</div>;
  if (loading) return <div>Loading station dashboard...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="flex flex-col w-full h-screen bg-gray-100 dark:bg-gray-900">
      <header className="w-full bg-white dark:bg-gray-800 shadow-sm p-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Police Station Dashboard</h1>
            <p className="text-muted-foreground">
              Station: {station?.name || "Unknown"} | Address: {station?.address || "Not available"}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            {/* <Button 
              variant={showHeatmap ? "default" : "outline"}
              onClick={() => setShowHeatmap(!showHeatmap)}
            >
              {showHeatmap ? "Hide Heatmap" : "Show Heatmap"}
            </Button> */}
          </div>
        </div>
      </header>

      <div className="w-full flex-1 p-4">
        <Tabs defaultValue="map" className="space-y-4">
          <TabsList>
            <TabsTrigger value="map">Map View</TabsTrigger>
            <TabsTrigger value="reports">Pending Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="map">
            <Card className="bg-white dark:bg-gray-800 shadow-sm">
              {/* <CardHeader>
                <CardTitle>{showHeatmap ? "Crime Heatmap" : "Incident Locations"}</CardTitle>
                <CardDescription>
                  {showHeatmap 
                    ? "Visualization of crime hotspots in your area" 
                    : "Map of active incident locations"}
                </CardDescription>
              </CardHeader> */}
              {/* <CardContent>
                <div className="relative">
                  {mapLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800 z-10">
                      Loading map...
                    </div>
                  )}
                  <Heatmap />
                  <div 
                    ref={mapContainerRef} 
                    className={`${isMobile ? "h-[400px]" : "h-[600px]"} w-full rounded-md`}
                  />
                </div>
              </CardContent> */}
            </Card>
          </TabsContent>

          <TabsContent value="map">
            <Card className="bg-white dark:bg-gray-800 shadow-sm">
              <CardHeader>
                <CardTitle>Crime Heatmap</CardTitle>
                <CardDescription>Visualization of crime hotspots in your area</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-[600px] w-full">
                  <Heatmap />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports">
            <Card className="bg-white dark:bg-gray-800 shadow-sm">
              <CardHeader>
                <CardTitle>Pending Non-Assigned Reports</CardTitle>
                <CardDescription>Reports awaiting officer assignment</CardDescription>
              </CardHeader>
              <CardContent>
                {pendingReports.length === 0 ? (
                  <p className="text-muted-foreground">No pending reports available.</p>
                ) : (
                  <ScrollArea className={`${isMobile ? "h-[300px]" : "h-[400px]"} pr-4`}>
                    <div className="space-y-4">
                      {pendingReports.map((report) => (
                        <ReportCard
                          key={report.id}
                          report={report}
                          availableOfficers={availableOfficers}
                          onAssign={(officerId) => assignOfficer(report.id, officerId)}
                        />
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

interface ReportCardProps {
  report: Report;
  availableOfficers: Officer[];
  onAssign: (officerId: string) => void;
}

function ReportCard({ report, availableOfficers, onAssign }: ReportCardProps) {
  const [selectedOfficerId, setSelectedOfficerId] = useState<string | null>(null);

  const priorityDisplay = {
    EMERGENCY: { label: "Emergency", color: "bg-red-600" },
    HIGH: { label: "High Priority", color: "bg-red-500" },
    NORMAL: { label: "Normal", color: "bg-amber-500" },
  };

  const currentPriority = priorityDisplay[report.priority] || { label: "Normal", color: "bg-amber-500" };

  return (
    <Card className="overflow-hidden bg-white dark:bg-gray-800 shadow-sm">
      <div className="flex">
        <div className={`w-1.5 ${currentPriority.color}`} />
        <div className="flex-1 p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <CardTitle className="text-base">{report.crime_type}</CardTitle>
                <Badge variant="outline" className="text-xs">
                  #{report.id}
                </Badge>
                <Badge className={`text-xs ${currentPriority.color}`}>
                  {currentPriority.label}
                </Badge>
              </div>
              <CardDescription className="mt-1">{report.description}</CardDescription>
            </div>
            <div>
              <Select
                value={selectedOfficerId || undefined}
                onValueChange={setSelectedOfficerId}
                disabled={!!report.assigned_officer || availableOfficers.length === 0}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder={availableOfficers.length === 0 ? "No officers available" : "Select Officer"} />
                </SelectTrigger>
                <SelectContent>
                  {availableOfficers.length > 0 ? (
                    availableOfficers.map((officer) => (
                      <SelectItem key={officer.id} value={officer.id}>
                        {officer.badge_number}
                      </SelectItem>
                    ))
                  ) : null}
                </SelectContent>
              </Select>
              <Button
                onClick={() => selectedOfficerId && onAssign(selectedOfficerId)}
                disabled={!selectedOfficerId || !!report.assigned_officer}
                variant="outline"
                className="mt-2 w-full"
              >
                {report.assigned_officer ? "Assigned" : "Assign Officer"}
              </Button>
            </div>  
          </div>
          <div className="text-sm text-muted-foreground mt-2">
            Reported: {new Date(report.created_at).toLocaleString()}
          </div>
        </div>
      </div>
    </Card>
  );
}
