"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

interface Incident {
  id: string;
  latitude: number;
  longitude: number;
  title: string;
  priority?: "HIGH" | "NORMAL" | "EMERGENCY";
}

interface CrimeMapProps {
  incidents: Incident[];
}

export function CrimeMap({ incidents }: CrimeMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    const accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
    if (!accessToken) {
      console.error("Mapbox access token is missing. Please set NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN in .env.local.");
      return;
    }

    mapboxgl.accessToken = accessToken;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [0, 0], // Default center, will adjust with bounds
      zoom: 2,
    });

    // Add markers for each incident
    if (incidents.length > 0) {
      incidents.forEach((incident) => {
        const markerColor =
          incident.priority === "EMERGENCY"
            ? "#ef4444" // Red
            : incident.priority === "HIGH"
              ? "#f97316" // Orange
              : "#f59e0b"; // Amber for NORMAL

        new mapboxgl.Marker({ color: markerColor })
          .setLngLat([incident.longitude, incident.latitude])
          .setPopup(new mapboxgl.Popup().setText(`${incident.title} (ID: ${incident.id})`))
          .addTo(map.current!);
      });

      // Fit map to bounds of all incidents
      const bounds = new mapboxgl.LngLatBounds();
      incidents.forEach((incident) => bounds.extend([incident.longitude, incident.latitude]));
      map.current.fitBounds(bounds, { padding: 50 });
    }

    return () => {
      if (map.current) map.current.remove();
    };
  }, [incidents]);

  return <div ref={mapContainer} className="w-full h-full" />;
}

export default CrimeMap;