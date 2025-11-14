"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import L, { Polygon } from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw";
import "leaflet-draw/dist/leaflet.draw.css";
import assert from "assert";

interface MapPosition {
  center: L.LatLngExpression;
  zoom?: number;
}

interface RegionSelectorProps {
  onRegionSelected?: (geometry: GeoJSON.Feature<GeoJSON.Polygon>) => void;
  onRegionsSelected?: (geometries: GeoJSON.Feature<GeoJSON.Polygon>[]) => void;
  className?: string;
  mapPosition?: MapPosition | null;
}

export default function RegionSelector({
  onRegionSelected,
  onRegionsSelected,
  className = "",
  mapPosition,
}: RegionSelectorProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const drawnItemsRef = useRef<L.FeatureGroup | null>(null);
  const [selectedRegions, setSelectedRegions] = useState<
    GeoJSON.Feature<GeoJSON.Polygon>[]
  >([]);

  // Stabilize the callbacks to prevent unnecessary re-renders
  const stableOnRegionSelected = useCallback(
    (geometry: GeoJSON.Feature<GeoJSON.Polygon>) => {
      if (onRegionSelected) {
        onRegionSelected(geometry);
      }
    },
    [onRegionSelected],
  );

  const stableOnRegionsSelected = useCallback(
    (geometries: GeoJSON.Feature<GeoJSON.Polygon>[]) => {
      if (onRegionsSelected) {
        onRegionsSelected(geometries);
      }
    },
    [onRegionsSelected],
  );

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Initialize map with default or provided position
    const initialCenter: L.LatLngExpression = mapPosition?.center ?? [
      39.8, -98.6,
    ];
    const initialZoom = mapPosition?.zoom ?? 4;
    const map = L.map(mapRef.current).setView(initialCenter, initialZoom);
    mapInstanceRef.current = map;

    // Add base layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 18,
      attribution: "© OpenStreetMap contributors",
    }).addTo(map);

    // Layer group to hold drawn rectangles
    const drawnItems = new L.FeatureGroup();
    drawnItemsRef.current = drawnItems;
    map.addLayer(drawnItems);

    // Add drawing controls - only rectangle
    const drawControl = new L.Control.Draw({
      position: "topleft",
      draw: {
        polyline: false,
        marker: false,
        circle: false,
        circlemarker: false,
        polygon: {
          allowIntersection: false,
          drawError: {
            color: "#e1e100",
            message: "<strong>Error:</strong> Polygon edges cannot cross!",
          },
          shapeOptions: {
            color: "#2c5aa0",
            weight: 2,
            fillOpacity: 0.2,
            fillColor: "#2c5aa0",
          },
        },
        rectangle: {
          shapeOptions: {
            color: "#2c5aa0",
            weight: 2,
            fillOpacity: 0.2,
            fillColor: "#2c5aa0",
          },
        },
      },
      edit: {
        featureGroup: drawnItems,
        remove: true,
      },
    });
    map.addControl(drawControl);

    // Event handlers
    const handleDrawCreated = (event: L.LeafletEvent) => {
      const e = event as L.DrawEvents.Created;
      const layer = e.layer;
      assert(
        layer instanceof L.Polygon,
        "Expected drawn layer to be a Polygon",
      );

      // Add new polygon to existing ones (allow multiple selections)
      drawnItems.addLayer(layer);

      // Notify parent component
      const region = layer.toGeoJSON();
      assert(
        region.geometry.type === "Polygon",
        "Expected geometry type to be Polygon",
      );
      const typedRegion = region as GeoJSON.Feature<GeoJSON.Polygon>;

      setSelectedRegions((prev) => {
        const newRegions = [...prev, typedRegion];
        stableOnRegionsSelected(newRegions);
        return newRegions;
      });
      stableOnRegionSelected(typedRegion);
    };

    const handleDrawDeleted = (event: L.LeafletEvent) => {
      const e = event as L.DrawEvents.Deleted;
      const layers = e.layers;

      // Remove deleted layers from state
      setSelectedRegions((prev) => {
        const remainingLayers: L.Layer[] = [];
        drawnItems.eachLayer((layer) => {
          remainingLayers.push(layer);
        });

        const newRegions = remainingLayers
          .filter((layer) => layer instanceof L.Polygon)
          .map((layer) => {
            const geoJson = (layer as L.Polygon).toGeoJSON();
            return geoJson as GeoJSON.Feature<GeoJSON.Polygon>;
          });

        stableOnRegionsSelected(newRegions);
        return newRegions;
      });
    };

    const handleDrawEdited = (event: L.LeafletEvent) => {
      const e = event as L.DrawEvents.Edited;

      // Update all regions after edit
      setSelectedRegions((prev) => {
        const allLayers: L.Layer[] = [];
        drawnItems.eachLayer((layer) => {
          allLayers.push(layer);
        });

        const newRegions = allLayers
          .filter((layer) => layer instanceof L.Polygon)
          .map((layer) => {
            const geoJson = (layer as L.Polygon).toGeoJSON();
            assert(
              geoJson.geometry.type === "Polygon",
              "Expected geometry type to be Polygon",
            );
            return geoJson as GeoJSON.Feature<GeoJSON.Polygon>;
          });

        stableOnRegionsSelected(newRegions);
        return newRegions;
      });
    };

    // Attach event listeners
    map.on(L.Draw.Event.CREATED, handleDrawCreated);
    map.on(L.Draw.Event.DELETED, handleDrawDeleted);
    map.on(L.Draw.Event.EDITED, handleDrawEdited);

    // Cleanup
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.off(L.Draw.Event.CREATED, handleDrawCreated);
        mapInstanceRef.current.off(L.Draw.Event.DELETED, handleDrawDeleted);
        mapInstanceRef.current.off(L.Draw.Event.EDITED, handleDrawEdited);
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        drawnItemsRef.current = null;
      }
    };
  }, []);

  // Handle map position changes
  useEffect(() => {
    if (mapPosition && mapInstanceRef.current) {
      mapInstanceRef.current.setView(mapPosition.center, mapPosition.zoom);
    }
  }, [mapPosition]);

  const clearSelection = () => {
    if (drawnItemsRef.current) {
      drawnItemsRef.current.clearLayers();
      setSelectedRegions([]);
      stableOnRegionsSelected([]);
    }
  };

  return (
    <div className={`relative w-full h-full ${className}`}>
      {/* Map container */}
      <div ref={mapRef} className="w-full h-full rounded-lg" />

      {/* Control panel */}
      <div className="absolute top-4 right-4 bg-white p-4 rounded-lg shadow-lg max-w-xs z-[1000]">
        <div className="text-sm space-y-2">
          <ul className="list-disc list-inside space-y-1 text-xs">
            <li>
              Use the drawing tools (top-left) to draw a rectangle or polygon
            </li>
            <li>Ensure the selection encompasses the area of application</li>
          </ul>

          {selectedRegions.length > 0 && (
            <div className="mt-3 p-2 bg-blue-50 rounded text-xs">
              <div className="mb-2">
                <span className="font-medium">
                  Regions selected: {selectedRegions.length}
                </span>
              </div>
              <button
                onClick={clearSelection}
                className="px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 transition-colors"
              >
                Clear All Selections
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
