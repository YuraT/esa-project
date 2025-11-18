/// <reference types="@arcgis/map-components/types/react" />
"use client";

import React, { useRef, useEffect } from "react";
import esriConfig from "@arcgis/core/config";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import Graphic from "@arcgis/core/Graphic";
import Polygon from "@arcgis/core/geometry/Polygon";
import SimpleFillSymbol from "@arcgis/core/symbols/SimpleFillSymbol";
import SimpleLineSymbol from "@arcgis/core/symbols/SimpleLineSymbol";
import MapView from "@arcgis/core/views/MapView";
import { geojsonToArcGIS } from "@terraformer/arcgis";
import "@arcgis/map-components/components/arcgis-map";
import "@arcgis/map-components/components/arcgis-zoom";

interface SoilSlopeMapProps {
  regions?: GeoJSON.Feature<GeoJSON.Polygon>[] | null;
  className?: string;
}

const SoilSlopeMap: React.FC<SoilSlopeMapProps> = ({ regions, className }) => {
  const mapRef = useRef<any>(null);
  const regionsLayerRef = useRef<GraphicsLayer | null>(null);

  useEffect(() => {
    esriConfig.apiKey = process.env.NEXT_PUBLIC_ARCGIS_API_KEY || "";
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;

    const setupMap = async () => {
      try {
        await mapRef.current.arcgisViewReadyChange;
        const view = mapRef.current.view as MapView;

        if (!view || !view.map) return;

        // Remove existing regions layer
        if (regionsLayerRef.current) {
          view.map.remove(regionsLayerRef.current);
        }

        // Create new graphics layer for regions
        regionsLayerRef.current = new GraphicsLayer({
          title: "Selected Regions",
        });
        view.map.add(regionsLayerRef.current);

        // Add regions if provided
        if (regions && regions.length > 0) {
          const graphics: Graphic[] = [];
          let allExtents: number[][] = [];

          regions.forEach((region) => {
            if (region.geometry) {
              // Use terraformer to convert GeoJSON to ArcGIS format
              const arcgisGeometry = geojsonToArcGIS(region.geometry);

              const polygon = new Polygon({
                ...arcgisGeometry,
                spatialReference: { wkid: 4326 },
              });

              // Collect coordinates for extent calculation
              region.geometry.coordinates.forEach((ring: number[][]) => {
                allExtents = allExtents.concat(ring);
              });

              const graphic = new Graphic({
                geometry: polygon,
                symbol: new SimpleFillSymbol({
                  color: [44, 90, 160, 0.1],
                  outline: new SimpleLineSymbol({
                    color: [44, 90, 160, 1],
                    width: 3,
                  }),
                }),
              });

              graphics.push(graphic);
            }
          });

          regionsLayerRef.current.addMany(graphics);

          // Zoom to regions
          if (allExtents.length > 0) {
            const lngs = allExtents.map((coord) => coord[0]);
            const lats = allExtents.map((coord) => coord[1]);
            const padding = 0.01;

            // Wait for view to be fully ready before calling goTo
            view.when(() => {
              view
                .goTo({
                  xmin: Math.min(...lngs) - padding,
                  ymin: Math.min(...lats) - padding,
                  xmax: Math.max(...lngs) + padding,
                  ymax: Math.max(...lats) + padding,
                  spatialReference: { wkid: 4326 },
                })
                .catch((error) => {
                  console.warn("Failed to zoom to regions:", error);
                });
            });
          }
        }
      } catch (error) {
        console.error("Error setting up map:", error);
      }
    };

    setupMap();
  }, [regions]);

  return (
    <div className={className}>
      <div className="mb-4">
        <h3 className="text-lg font-bold text-[#275c9d] mb-2">
          Field Slope Analysis
        </h3>
      </div>

      <div className="h-[26rem] border border-gray-300 rounded-lg overflow-hidden">
        <arcgis-map
          ref={mapRef}
          item-id="aafa01a3b142450cb633a28f37837c95"
          style={{ width: "100%", height: "100%" }}
        >
          <arcgis-zoom slot="top-left" />
        </arcgis-map>
      </div>

      <div className="mt-3 text-sm text-gray-600">
        <div className="mb-3">
          <p className="font-semibold text-[#275c9d] mb-2 text-sm">
            Slope Categories:
          </p>
          <div className="space-y-2 text-xs">
            <div className="p-2 bg-green-50 border border-green-200 rounded">
              <p className="font-semibold text-green-800 mb-1">
                ≤ 3% - Qualifies for EPA Mitigation Relief Points
              </p>
              <div className="grid grid-cols-2 gap-1">
                {[
                  { range: "0-2%", label: "Very Low", color: "#38a800" },
                  { range: "2-3%", label: "Low", color: "#b0e200" },
                ].map((item, index) => (
                  <div key={index} className="flex items-center">
                    <span
                      className="w-3 h-3 mr-2 rounded-full"
                      style={{ backgroundColor: item.color }}
                    ></span>
                    <span>
                      {item.range} - {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {[
                { range: "3-4%", label: "Moderate", color: "#ffaa00" },
                { range: "≥ 4%", label: "High", color: "#ff0000" },
              ].map((item, index) => (
                <div key={index} className="flex items-center">
                  <span
                    className="w-3 h-3 mr-2 rounded-full"
                    style={{ backgroundColor: item.color }}
                  ></span>
                  <span>
                    {item.range} - {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {regions && regions.length > 0 && (
          <p className="text-xs">
            <span className="inline-block w-4 h-3 bg-blue-200 border-2 border-blue-600 mr-2"></span>
            Selected Regions ({regions.length})
          </p>
        )}
      </div>
    </div>
  );
};

export default SoilSlopeMap;
