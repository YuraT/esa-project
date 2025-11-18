"use client";

import React, { useEffect, useRef } from "react";
import L from "leaflet";
import * as esri from "esri-leaflet";
import "leaflet/dist/leaflet.css";

interface SoilSurveyMapProps {
  regions?: GeoJSON.Feature<GeoJSON.Polygon>[] | null;
  className?: string;
}

const SoilSurveyMap: React.FC<SoilSurveyMapProps> = ({
  regions,
  className,
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || typeof window === "undefined") return;

    console.log("SoilSurveyMap: Initializing map with regions:", regions);

    // Clean up existing map
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
    }

    // Calculate center and bounds from regions if provided
    let centerLat = 39.8; // Default center (continental US)
    let centerLng = -98.6;
    let zoom = 4;
    let combinedBounds: L.LatLngBounds | null = null;
    const regionLayers: L.Layer[] = [];

    if (regions && regions.length > 0) {
      console.log("SoilSurveyMap: regions", regions);

      regions.forEach((region) => {
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
      if (combinedBounds) {
        const center = (combinedBounds as L.LatLngBounds).getCenter();
        centerLat = center.lat;
        centerLng = center.lng;
        zoom = 10;
      }
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
              // Map pixel values to soil groups based on USDA classifications
              switch (Number(data.value)) {
                case 1:
                  soilGroup = "Group A";
                  soilDescription =
                    "Group A soils consist of deep, well drained sands or gravelly sands with high infiltration and low runoff rates.";
                  break;
                case 2:
                  soilGroup = "Group B";
                  soilDescription =
                    "Group B soils consist of deep well drained soils with a moderately fine to moderately coarse texture and a moderate rate of infiltration and runoff.";
                  break;
                case 3:
                  soilGroup = "Group C";
                  soilDescription =
                    "Group C consists of soils with a layer that impedes the downward movement of water or fine textured soils and a slow rate of infiltration.";
                  break;
                case 4:
                  soilGroup = "Group D";
                  soilDescription =
                    "Group D consists of soils with a very slow infiltration rate and high runoff potential. This group is composed of clays that have a high shrink-swell potential, soils with a high water table, soils that have a clay pan or clay layer at or near the surface, and soils that are shallow over nearly impervious material.";
                  break;
                case 5:
                  soilGroup = "Group A/D";
                  soilDescription =
                    "Group A/D soils naturally have a very slow infiltration rate due to a high water table but will have high infiltration and low runoff rates if drained.";
                  break;
                case 6:
                  soilGroup = "Group B/D";
                  soilDescription =
                    "Group B/D soils naturally have a very slow infiltration rate due to a high water table but will have a moderate rate of infiltration and runoff if drained.";
                  break;
                case 7:
                  soilGroup = "Group C/D";
                  soilDescription =
                    "Group C/D soils naturally have a very slow infiltration rate due to a high water table but will have a slow rate of infiltration if drained.";
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

    // Add selection area outlines if regions are provided
    if (regionLayers.length > 0) {
      regionLayers.forEach((layer) => layer.addTo(map));
      console.log("SoilSurveyMap: Selection areas added to map");

      // Fit map to show all region bounds
      if (combinedBounds) {
        map.fitBounds(combinedBounds, { padding: [20, 20] });
      }
    }

    console.log("SoilSurveyMap: Map initialized successfully");

    // Cleanup on unmount
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [regions]);

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
        <div className="grid grid-cols-1 gap-1">
          <p className="font-semibold text-[#275c9d] mb-2">
            Hydrologic Soil Groups:
          </p>
          <div className="grid grid-cols-1 gap-1 text-xs">
            <div className="grid grid-cols-2 gap-x-4 gap-y-1">
              <p>
                <span
                  className="inline-block w-3 h-3 mr-2 border border-gray-300"
                  style={{ backgroundColor: "#9be600" }}
                ></span>
                <strong>Group A</strong> - Deep, well-drained sands
              </p>
              <p>
                <span
                  className="inline-block w-3 h-3 mr-2 border border-gray-300"
                  style={{ backgroundColor: "#69b300" }}
                ></span>
                <strong>Group A/D</strong> - A soils with high water table
              </p>
              <p>
                <span
                  className="inline-block w-3 h-3 mr-2 border border-gray-300"
                  style={{ backgroundColor: "#6ccbff" }}
                ></span>
                <strong>Group B</strong> - Moderate texture, drainage
              </p>
              <p>
                <span
                  className="inline-block w-3 h-3 mr-2 border border-gray-300"
                  style={{ backgroundColor: "#3899cc" }}
                ></span>
                <strong>Group B/D</strong> - B soils with high water table
              </p>
              <p>
                <span
                  className="inline-block w-3 h-3 mr-2 border border-gray-300"
                  style={{ backgroundColor: "#ffe000" }}
                ></span>
                <strong>Group C</strong> - Impeded drainage
              </p>
              <p>
                <span
                  className="inline-block w-3 h-3 mr-2 border border-gray-300"
                  style={{ backgroundColor: "#d9ba00" }}
                ></span>
                <strong>Group C/D</strong> - C soils with high water table
              </p>
            </div>
            <div className="mt-1">
              <p>
                <span
                  className="inline-block w-3 h-3 mr-2 border border-gray-300"
                  style={{ backgroundColor: "#868686" }}
                ></span>
                <strong>Group D</strong> - Very slow infiltration, high runoff
              </p>
            </div>
          </div>
        </div>

        {regions && regions.length > 0 && (
          <p className="mt-2">
            <span className="inline-block w-4 h-3 bg-blue-200 border-2 border-blue-600 mr-2"></span>
            Your Selected Regions ({regions.length})
          </p>
        )}

        <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded">
          <p className="text-xs text-blue-800">
            <strong>💡 How to Use:</strong> Click anywhere on the map to
            identify the soil group at that location. Groups A and B are
            considered sandy soils with good drainage. Groups C and D have
            slower infiltration and higher runoff potential. Dual groups (A/D,
            B/D, C/D) indicate soils that change characteristics when drained.
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
