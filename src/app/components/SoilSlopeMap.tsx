"use client";

import React, { useEffect, useRef } from "react";
import L from "leaflet";
import * as esri from "esri-leaflet";
import "leaflet/dist/leaflet.css";

interface SoilSlopeMapProps {
  region?: GeoJSON.Feature<GeoJSON.Polygon> | null;
  className?: string;
}

const SoilSlopeMap: React.FC<SoilSlopeMapProps> = ({ region, className }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || typeof window === "undefined") return;

    console.log("SoilSlopeMap: Initializing map with region:", region);

    // Clean up existing map
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
    }

    // Calculate center and bounds from region if provided
    let centerLat = 39.8; // Default center (continental US)
    let centerLng = -98.6;
    let zoom = 4;
    let regionLayer = null;

    if (region) {
      console.log("SoilSlopeMap: region", region);

      // Create GeoJSON layer directly from the region feature
      regionLayer = L.geoJSON(region, {
        style: {
          color: "#2c5aa0",
          weight: 3,
          fillOpacity: 0.1,
          fillColor: "#2c5aa0",
        },
      });

      // Get bounds automatically from the GeoJSON layer
      const bounds = regionLayer.getBounds();

      // Calculate center from bounds
      const center = bounds.getCenter();
      centerLat = center.lat;
      centerLng = center.lng;
      zoom = 10;
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

    // Add terrain layer for visual reference
    const terrainLayer = L.tileLayer(
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Terrain_Base/MapServer/tile/{z}/{y}/{x}",
      {
        maxZoom: 18,
        attribution: "© Esri, USGS, NOAA",
      },
    );

    // Add slope analysis functionality
    const apiKey = process.env.NEXT_PUBLIC_ARCGIS_API_KEY;

    if (apiKey) {
      try {
        // Add the World Elevation Terrain layer for slope calculation
        const elevationLayer = esri.imageMapLayer({
          url: "https://elevation.arcgis.com/arcgis/rest/services/WorldElevation/Terrain/ImageServer",
          token: apiKey,
          renderingRule: {
            rasterFunction: "Slope",
          },
          opacity: 0.8,
          format: "jpgpng",
        });

        // Add layer control
        const baseLayers = {
          OpenStreetMap: baseLayer,
          Terrain: terrainLayer,
        };

        const overlayLayers = {
          "Elevation Data": elevationLayer,
        };

        L.control
          .layers(baseLayers, overlayLayers, {
            position: "topright",
            collapsed: false,
          })
          .addTo(map);

        elevationLayer.addTo(map);

        // Add click handler to calculate slope
        map.on("click", async (e) => {
          const { lat, lng } = e.latlng;

          try {
            // Query elevation at the clicked point and surrounding points for slope calculation
            const identifyUrl = `https://elevation.arcgis.com/arcgis/rest/services/WorldElevation/Terrain/ImageServer/identify`;

            // Get elevation at center point and 4 surrounding points to calculate slope
            const offset = 0.001; // approximately 100m at mid-latitudes
            const points = [
              { x: lng, y: lat }, // center
              { x: lng + offset, y: lat }, // east
              { x: lng - offset, y: lat }, // west
              { x: lng, y: lat + offset }, // north
              { x: lng, y: lat - offset }, // south
            ];

            const elevationPromises = points.map(async (point) => {
              const params = new URLSearchParams({
                f: "json",
                geometry: JSON.stringify({
                  x: point.x,
                  y: point.y,
                  spatialReference: { wkid: 4326 },
                }),
                geometryType: "esriGeometryPoint",
                returnGeometry: "false",
                returnCatalogItems: "false",
                pixelSize: "30,30",
                token: apiKey,
              });

              const response = await fetch(`${identifyUrl}?${params}`);
              const data = await response.json();
              return data.value || 0;
            });

            const elevations = await Promise.all(elevationPromises);
            const [centerElev, eastElev, westElev, northElev, southElev] =
              elevations;

            // Calculate slope using the maximum gradient method
            const distance = offset * 111320; // Convert degrees to meters (approximate)
            const eastWestSlope =
              Math.abs(eastElev - westElev) / (2 * distance);
            const northSouthSlope =
              Math.abs(northElev - southElev) / (2 * distance);
            const maxSlope = Math.max(eastWestSlope, northSouthSlope);
            const slopePercent = maxSlope * 100;

            let slopeCategory = "";
            let slopeColor = "";
            let slopeDescription = "";
            let suitabilityMessage = "";

            if (slopePercent <= 3) {
              slopeCategory = "≤ 3% (Low Slope)";
              slopeColor = "#28a745"; // green
              slopeDescription =
                "This area has a gentle slope with low runoff potential.";
              suitabilityMessage =
                "✅ Suitable for reduced setback requirements.";
            } else if (slopePercent <= 8) {
              slopeCategory = "3-8% (Moderate Slope)";
              slopeColor = "#ffc107"; // yellow
              slopeDescription =
                "This area has a moderate slope with increased runoff potential.";
              suitabilityMessage = "⚠️ Standard setback requirements apply.";
            } else if (slopePercent <= 15) {
              slopeCategory = "8-15% (Steep Slope)";
              slopeColor = "#fd7e14"; // orange
              slopeDescription =
                "This area has a steep slope with high runoff potential.";
              suitabilityMessage =
                "⚠️ Increased risk - standard setbacks required.";
            } else {
              slopeCategory = "> 15% (Very Steep)";
              slopeColor = "#dc3545"; // red
              slopeDescription =
                "This area has a very steep slope with very high runoff potential.";
              suitabilityMessage =
                "❌ High risk - consider additional mitigation measures.";
            }

            // Create popup with slope information
            const popupContent = `
              <div style="max-width: 320px;">
                <h4 style="margin: 0 0 10px 0; color: #275c9d;">Slope Analysis</h4>
                <div style="display: flex; align-items: center; margin-bottom: 8px;">
                  <div style="width: 12px; height: 12px; background-color: ${slopeColor}; border-radius: 50%; margin-right: 8px;"></div>
                  <span style="font-weight: bold; font-size: 14px;">${slopeCategory}</span>
                </div>
                <p style="margin: 0 0 8px 0; font-size: 13px; font-weight: bold;">
                  Calculated Slope: ${slopePercent.toFixed(2)}%
                </p>
                <p style="margin: 0 0 8px 0; font-size: 12px; line-height: 1.4;">
                  ${slopeDescription}
                </p>
                <div style="background-color: ${slopePercent <= 3 ? "#d4edda" : "#fff3cd"};
                           border: 1px solid ${slopePercent <= 3 ? "#c3e6cb" : "#ffeaa7"};
                           border-radius: 4px; padding: 8px; margin: 8px 0;">
                  <p style="margin: 0; font-size: 12px; font-weight: bold;
                           color: ${slopePercent <= 3 ? "#155724" : "#856404"};">
                    ${suitabilityMessage}
                  </p>
                </div>
                <p style="margin: 8px 0 0 0; font-size: 11px; color: #666;">
                  Coordinates: ${lat.toFixed(4)}°, ${lng.toFixed(4)}°<br>
                  Elevation: ${centerElev ? Math.round(centerElev) + "m" : "N/A"}
                </p>
              </div>
            `;

            L.popup().setLatLng(e.latlng).setContent(popupContent).openOn(map);
          } catch (error) {
            console.error("Error calculating slope:", error);

            const errorPopup = `
              <div style="max-width: 250px;">
                <h4 style="margin: 0 0 10px 0; color: #d63384;">Error</h4>
                <p style="margin: 0; font-size: 12px;">
                  Unable to calculate slope at this location. Please try again or check your internet connection.
                </p>
              </div>
            `;

            L.popup().setLatLng(e.latlng).setContent(errorPopup).openOn(map);
          }
        });

        console.log("SoilSlopeMap: Elevation layer added");
      } catch (error) {
        console.error("SoilSlopeMap: Error adding elevation layer:", error);

        // Add error message to map
        const errorDiv = L.divIcon({
          className: "slope-error-message",
          html: '<div style="background: white; padding: 10px; border: 2px solid red; border-radius: 5px; font-size: 12px;">Error loading elevation data</div>',
          iconSize: [200, 50],
        });

        L.marker([centerLat, centerLng], { icon: errorDiv }).addTo(map);
      }
    } else {
      console.warn("SoilSlopeMap: No ArcGIS API key found");

      // Add warning message to map
      const warningDiv = L.divIcon({
        className: "slope-warning-message",
        html: '<div style="background: #fff3cd; padding: 10px; border: 2px solid #ffc107; border-radius: 5px; font-size: 12px; max-width: 250px;">ArcGIS API key required. Add NEXT_PUBLIC_ARCGIS_API_KEY to .env</div>',
        iconSize: [270, 60],
      });

      L.marker([centerLat, centerLng], { icon: warningDiv }).addTo(map);
    }

    // Add selection area outline if region is provided
    if (regionLayer) {
      regionLayer.addTo(map);
      console.log("SoilSlopeMap: Selection area added to map");

      // Fit map to show the actual polygon bounds
      map.fitBounds(regionLayer.getBounds(), { padding: [20, 20] });
    }

    console.log("SoilSlopeMap: Map initialized successfully");

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
          Field Slope Analysis
        </h3>
        <p className="text-sm text-gray-600 mb-2">
          This map helps you determine the slope percentage of your field using
          elevation data. Fields with slopes ≤ 3% may qualify for reduced
          setback requirements.{" "}
          <strong>
            Click anywhere on the map to calculate the slope at that location.
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
        <div className="grid grid-cols-1 gap-1">
          <p className="font-semibold text-[#275c9d] mb-2">Slope Categories:</p>
          <div className="grid grid-cols-1 gap-1 text-xs">
            <div className="grid grid-cols-2 gap-x-4 gap-y-1">
              <p>
                <span
                  className="inline-block w-3 h-3 mr-2 border border-gray-300 rounded-full"
                  style={{ backgroundColor: "#28a745" }}
                ></span>
                <strong>≤ 3%</strong> - Low slope, suitable for reduced setbacks
              </p>
              <p>
                <span
                  className="inline-block w-3 h-3 mr-2 border border-gray-300 rounded-full"
                  style={{ backgroundColor: "#ffc107" }}
                ></span>
                <strong>3-8%</strong> - Moderate slope, standard requirements
              </p>
              <p>
                <span
                  className="inline-block w-3 h-3 mr-2 border border-gray-300 rounded-full"
                  style={{ backgroundColor: "#fd7e14" }}
                ></span>
                <strong>8-15%</strong> - Steep slope, increased runoff risk
              </p>
              <p>
                <span
                  className="inline-block w-3 h-3 mr-2 border border-gray-300 rounded-full"
                  style={{ backgroundColor: "#dc3545" }}
                ></span>
                <strong>&gt; 15%</strong> - Very steep, high runoff risk
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
            calculate the slope percentage at that location. The calculation
            uses elevation data from surrounding points to determine the
            gradient. Green areas (≤ 3%) may qualify for reduced setback
            requirements due to lower runoff potential.
          </p>
        </div>

        <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded">
          <p className="text-xs text-yellow-800">
            <strong>Note:</strong> Slope calculations are estimates based on
            elevation data. For critical applications, consider professional
            surveying. Results may vary based on data resolution and local
            terrain features.
          </p>
        </div>

        {!process.env.NEXT_PUBLIC_ARCGIS_API_KEY && (
          <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded">
            <p className="text-xs text-yellow-800">
              <strong>API Key Required:</strong> Slope analysis requires an
              ArcGIS API key. Add
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

export default SoilSlopeMap;
