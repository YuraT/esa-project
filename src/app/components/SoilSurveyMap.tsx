"use client";

import React, { useEffect, useRef } from "react";
import { IPolygon } from "@esri/arcgis-rest-request";
import L from "leaflet";
import * as esri from "esri-leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default markers in Next.js
if (typeof window !== "undefined") {
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
    iconUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  });
}

interface SoilSurveyMapProps {
  region?: IPolygon | null;
  className?: string;
}

const SoilSurveyMap: React.FC<SoilSurveyMapProps> = ({ region, className }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || typeof window === "undefined") return;

    console.log("SoilSurveyMap: Initializing map with region:", region);

    // Clean up existing map
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
    }

    // Calculate center and bounds from region if provided
    let centerLat = 39.8; // Default center (continental US)
    let centerLng = -98.6;
    let zoom = 4;
    let selectionBounds = null;

    if (region && region.rings && region.rings[0]) {
      const ring = region.rings[0];
      const west = ring[0][0];
      const south = ring[0][1];
      const east = ring[1][0];
      const north = ring[2][1];

      console.log("SoilSurveyMap: Calculated bounds:", {
        west,
        south,
        east,
        north,
      });

      centerLat = (north + south) / 2;
      centerLng = (east + west) / 2;
      zoom = 10;

      selectionBounds = [
        [south, west],
        [north, east],
      ] as L.LatLngBoundsExpression;
    }

    // Initialize map
    const map = L.map(mapRef.current).setView([centerLat, centerLng], zoom);
    mapInstanceRef.current = map;

    // Add base layer
    const baseLayer = L.tileLayer(
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      {
        maxZoom: 18,
        attribution: "© OpenStreetMap contributors",
      },
    );
    baseLayer.addTo(map);

    // Add soil survey layer from ArcGIS
    const apiKey = process.env.NEXT_PUBLIC_ARCGIS_API_KEY;

    if (apiKey) {
      try {
        // Add the USA Soils Hydrologic Group layer as an image service
        const soilLayer = esri.imageMapLayer({
          url: "https://landscape11.arcgis.com/arcgis/rest/services/USA_Soils_Hydrologic_Group/ImageServer",
          token: apiKey,
          opacity: 0.7,
          format: "jpgpng",
        });

        soilLayer.addTo(map);

        // Add layer control
        const baseLayers = {
          OpenStreetMap: baseLayer,
        };

        const overlayLayers = {
          "Soil Hydrologic Groups": soilLayer,
        };

        L.control
          .layers(baseLayers, overlayLayers, {
            position: "topright",
            collapsed: false,
          })
          .addTo(map);

        // Add click handler to identify soil group
        map.on("click", async (e) => {
          const { lat, lng } = e.latlng;

          try {
            // Query the soil service at the clicked location
            const identifyUrl = `https://landscape11.arcgis.com/arcgis/rest/services/USA_Soils_Hydrologic_Group/ImageServer/identify`;
            const params = new URLSearchParams({
              f: "json",
              geometry: JSON.stringify({
                x: lng,
                y: lat,
                spatialReference: { wkid: 4326 },
              }),
              geometryType: "esriGeometryPoint",
              returnGeometry: "false",
              returnCatalogItems: "false",
              pixelSize: "100,100",
              token: apiKey,
            });

            const response = await fetch(`${identifyUrl}?${params}`);
            const data = await response.json();

            let soilGroup = "Unknown";
            let soilDescription =
              "Unable to determine soil group at this location.";

            if (data.value !== undefined && data.value !== null) {
              // Map pixel values to soil groups (this may need adjustment based on actual service values)
              switch (data.value) {
                case 1:
                  soilGroup = "Group A";
                  soilDescription =
                    "Sandy soils with low runoff potential. Good drainage and high infiltration rates.";
                  break;
                case 2:
                  soilGroup = "Group B";
                  soilDescription =
                    "Moderately well-drained soils with moderate infiltration rates.";
                  break;
                case 3:
                  soilGroup = "Group C";
                  soilDescription =
                    "Soils with slow infiltration rates when thoroughly wetted.";
                  break;
                case 4:
                  soilGroup = "Group D";
                  soilDescription =
                    "Clay soils with very slow infiltration rates and high runoff potential.";
                  break;
                default:
                  soilGroup = `Value: ${data.value}`;
                  soilDescription =
                    "Soil data available but group classification needs verification.";
              }
            }

            // Create popup with soil information
            const popupContent = `
              <div style="max-width: 300px;">
                <h4 style="margin: 0 0 10px 0; color: #275c9d;">Soil Information</h4>
                <p style="margin: 0 0 8px 0; font-weight: bold;">Hydrologic Soil Group: ${soilGroup}</p>
                <p style="margin: 0; font-size: 12px; line-height: 1.4;">${soilDescription}</p>
                <p style="margin: 8px 0 0 0; font-size: 11px; color: #666;">
                  Coordinates: ${lat.toFixed(4)}°, ${lng.toFixed(4)}°
                </p>
              </div>
            `;

            L.popup().setLatLng(e.latlng).setContent(popupContent).openOn(map);
          } catch (error) {
            console.error("Error identifying soil group:", error);

            const errorPopup = `
              <div style="max-width: 250px;">
                <h4 style="margin: 0 0 10px 0; color: #d63384;">Error</h4>
                <p style="margin: 0; font-size: 12px;">
                  Unable to identify soil group at this location. Please try again or check your internet connection.
                </p>
              </div>
            `;

            L.popup().setLatLng(e.latlng).setContent(errorPopup).openOn(map);
          }
        });

        console.log("SoilSurveyMap: Soil survey layer added");
      } catch (error) {
        console.error("SoilSurveyMap: Error adding soil survey layer:", error);

        // Add error message to map
        const errorDiv = L.divIcon({
          className: "soil-error-message",
          html: '<div style="background: white; padding: 10px; border: 2px solid red; border-radius: 5px; font-size: 12px;">Error loading soil data</div>',
          iconSize: [200, 50],
        });

        L.marker([centerLat, centerLng], { icon: errorDiv }).addTo(map);
      }
    } else {
      console.warn("SoilSurveyMap: No ArcGIS API key found");

      // Add warning message to map
      const warningDiv = L.divIcon({
        className: "soil-warning-message",
        html: '<div style="background: #fff3cd; padding: 10px; border: 2px solid #ffc107; border-radius: 5px; font-size: 12px; max-width: 250px;">ArcGIS API key required. Add NEXT_PUBLIC_ARCGIS_API_KEY to .env</div>',
        iconSize: [270, 60],
      });

      L.marker([centerLat, centerLng], { icon: warningDiv }).addTo(map);
    }

    // Add selection area outline if region is provided
    if (selectionBounds) {
      const selectionLayer = L.rectangle(selectionBounds, {
        color: "#2c5aa0",
        weight: 3,
        fillOpacity: 0.1,
        fillColor: "#2c5aa0",
      }).addTo(map);

      console.log("SoilSurveyMap: Selection area added to map");

      // Fit map to show selection area
      map.fitBounds(selectionBounds, { padding: [20, 20] });
    }

    console.log("SoilSurveyMap: Map initialized successfully");

    // Cleanup on unmount
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [region]);

  return (
    <div className={className}>
      <div className="mb-4">
        <h3 className="text-lg font-bold text-[#275c9d] mb-2">
          Soil Survey Map - Hydrologic Groups
        </h3>
        <p className="text-sm text-gray-600 mb-2">
          This map shows USDA soil hydrologic groups that indicate how quickly
          water moves through soil. Use the layer control in the top-right to
          toggle the soil data overlay.{" "}
          <strong>
            Click anywhere on the map to identify the soil group at that
            location.
          </strong>
        </p>
      </div>

      <div
        ref={mapRef}
        style={{
          height: "400px",
          width: "100%",
          border: "1px solid #ddd",
          borderRadius: "8px",
        }}
      />

      <div className="mt-3 text-sm text-gray-600 space-y-1">
        <div className="grid grid-cols-1 gap-2">
          <p className="font-semibold text-[#275c9d] mb-1">
            Hydrologic Soil Groups:
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="space-y-1">
              <p>
                <span className="inline-block w-3 h-3 bg-green-400 mr-2 border border-gray-300"></span>
                Group A - Sandy soils, low runoff
              </p>
              <p>
                <span className="inline-block w-3 h-3 bg-yellow-400 mr-2 border border-gray-300"></span>
                Group B - Moderate infiltration
              </p>
            </div>
            <div className="space-y-1">
              <p>
                <span className="inline-block w-3 h-3 bg-orange-400 mr-2 border border-gray-300"></span>
                Group C - Slow infiltration
              </p>
              <p>
                <span className="inline-block w-3 h-3 bg-red-400 mr-2 border border-gray-300"></span>
                Group D - High runoff potential
              </p>
            </div>
          </div>
        </div>

        {region && (
          <p className="mt-2">
            <span className="inline-block w-4 h-3 bg-blue-200 border-2 border-blue-600 mr-2"></span>
            Your Selected Region
          </p>
        )}

        <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded">
          <p className="text-xs text-blue-800">
            <strong>💡 How to Use:</strong> Click anywhere on the map to
            identify the soil group at that location. Groups A and B are
            considered sandy soils with good drainage. Groups C and D have
            slower infiltration and higher runoff potential.
          </p>
        </div>

        {!process.env.NEXT_PUBLIC_ARCGIS_API_KEY && (
          <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded">
            <p className="text-xs text-yellow-800">
              <strong>Note:</strong> Soil survey data requires an ArcGIS API
              key. Add
              <code className="bg-yellow-100 px-1 rounded ml-1">
                NEXT_PUBLIC_ARCGIS_API_KEY
              </code>{" "}
              to your .env file.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SoilSurveyMap;
