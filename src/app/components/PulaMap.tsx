"use client";

import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { arcgisToGeoJSON } from "@terraformer/arcgis";

interface PulaMapProps {
  pulaData: any[];
  regions: GeoJSON.Feature<GeoJSON.Polygon>[];
  className?: string;
}

const PulaMap: React.FC<PulaMapProps> = ({ pulaData, regions, className }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const colors = ["#e41a1c", "#984ea3", "#ff7f00", "#ffff33", "#a65628"];

  useEffect(() => {
    if (!mapRef.current || typeof window === "undefined") return;

    const initializeMap = () => {
      console.log("PulaMap: Initializing map with data:", pulaData);
      console.log("PulaMap: Regions:", regions);

      // Clean up existing map
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
      }

      // Create combined bounds for all regions
      let combinedBounds: L.LatLngBounds | null = null;
      const regionLayers: L.Layer[] = [];

      regions.forEach((region, index) => {
        // Create GeoJSON layer for each region
        const regionLayer = L.geoJSON(region, {
          style: {
            color: "#2c5aa0",
            weight: 3,
            fillOpacity: 0.1,
            fillColor: "#2c5aa0",
          },
        });

        regionLayers.push(regionLayer);

        // Extend bounds to include this region
        const regionBounds = regionLayer.getBounds();
        if (!combinedBounds) {
          combinedBounds = regionBounds;
        } else {
          combinedBounds.extend(regionBounds);
        }
      });

      // Calculate center from combined bounds
      let centerLat = 39.8; // Default center
      let centerLng = -98.6;
      if (combinedBounds) {
        const center = combinedBounds.getCenter();
        centerLat = center.lat;
        centerLng = center.lng;
      }

      // Initialize map
      const map = L.map(mapRef.current!).setView([centerLat, centerLng], 10);
      mapInstanceRef.current = map;

      // Add base layer
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 18,
        attribution: "© OpenStreetMap contributors",
      }).addTo(map);

      // Add all selection area outlines
      regionLayers.forEach((layer) => layer.addTo(map));

      // Add PULA polygons
      if (pulaData && pulaData.length > 0) {
        console.log("PulaMap: Adding", pulaData.length, "PULA polygons");
        pulaData.forEach((pula, index) => {
          console.log(`PulaMap: Processing PULA ${index}:`, pula);
          console.log(`PulaMap: PULA ${index} geometry:`, pula.geometry);
          console.log(`PulaMap: PULA ${index} attributes:`, pula.attributes);

          if (pula.geometry) {
            console.log(`PulaMap: Creating geoJSON layer for PULA ${index}`);
            try {
              // Convert ArcGIS feature to GeoJSON
              const geoJsonFeature = arcgisToGeoJSON(pula);
              console.log(`PulaMap: Converted to GeoJSON:`, geoJsonFeature);

              if (!geoJsonFeature) {
                console.warn(
                  `PulaMap: Failed to convert PULA ${index} to GeoJSON`,
                );
                return;
              }

              const pulaLayer = L.geoJSON(geoJsonFeature, {
                style: {
                  color: colors[index % colors.length],
                  weight: 2,
                  fillOpacity: 0.3,
                  fillColor: colors[index % colors.length],
                },
              });

              // Add popup with PULA details
              const attrs = pula.attributes;
              const popupContent = `
                <div style="max-width: 300px;">
                  <h4 style="margin: 0 0 10px 0; color: #e60000;">PULA Details</h4>
                  <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
                    <tr><td style="padding: 4px; border-bottom: 1px solid #eee; font-weight: bold; width: 30%;">PULA ID:</td><td style="padding: 4px; border-bottom: 1px solid #eee;">${attrs.pula_id || "N/A"}</td></tr>
                    <tr><td style="padding: 4px; border-bottom: 1px solid #eee; font-weight: bold;">Event:</td><td style="padding: 4px; border-bottom: 1px solid #eee;">${attrs.event_name || "N/A"}</td></tr>
                    <tr><td style="padding: 4px; border-bottom: 1px solid #eee; font-weight: bold;">Effective Date:</td><td style="padding: 4px; border-bottom: 1px solid #eee;">${attrs.effective_date ? new Date(attrs.effective_date).toLocaleDateString() : "N/A"}</td></tr>
                    <tr><td style="padding: 4px; border-bottom: 1px solid #eee; font-weight: bold;">Published:</td><td style="padding: 4px; border-bottom: 1px solid #eee;">${attrs.published_time_stamp ? new Date(attrs.published_time_stamp).toLocaleDateString() : "N/A"}</td></tr>
                  </table>
                </div>
              `;

              pulaLayer.bindPopup(popupContent);
              pulaLayer.addTo(map);
              console.log(`PulaMap: Successfully added PULA ${index} to map`);
            } catch (error) {
              console.error(
                `PulaMap: Error adding PULA ${index} to map:`,
                error,
              );
            }
          } else {
            console.warn(`PulaMap: PULA ${index} has no geometry`);
          }
        });
      } else {
        console.log("PulaMap: No PULA data to display");
      }

      console.log(`PulaMap: Map initialized with ${pulaData.length} PULAs`);

      // Fit map to show all selection areas
      if (combinedBounds) {
        map.fitBounds(combinedBounds, { padding: [20, 20] });
        console.log("PulaMap: Map bounds fitted to selection areas");
      }
    };

    initializeMap();

    // Cleanup on unmount
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [pulaData, regions]);

  return (
    <div className={className}>
      <div
        ref={mapRef}
        style={{
          height: "400px",
          width: "100%",
          border: "1px solid #ddd",
          borderRadius: "8px",
        }}
      />
      <div className="mt-2 text-sm text-gray-600">
        <p>
          <span className="inline-block w-4 h-3 bg-blue-200 border-2 border-blue-600 mr-2"></span>
          Selected Regions ({regions.length})
        </p>
        <p>
          <span className="inline-block w-4 h-3 bg-red-200 border-2 border-red-600 mr-2"></span>
          PULA Areas ({pulaData.length} found)
        </p>
        {pulaData.length === 0 && (
          <p className="text-gray-500 text-xs mt-1">
            No PULAs found in this region for the selected product
          </p>
        )}
      </div>
    </div>
  );
};

export default PulaMap;
