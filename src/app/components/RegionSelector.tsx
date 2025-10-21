"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import L, { Polygon } from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw";
import "leaflet-draw/dist/leaflet.draw.css";

interface MapPosition {
  center: L.LatLngExpression;
  zoom?: number;
}

interface RegionSelectorProps {
  onRegionSelected?: (geometry: GeoJSON.Feature<GeoJSON.Polygon>) => void;
  className?: string;
  mapPosition?: MapPosition | null;
}

export default function RegionSelector({
  onRegionSelected,
  className = "",
  mapPosition,
}: RegionSelectorProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const drawnItemsRef = useRef<L.FeatureGroup | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<GeoJSON.Feature<GeoJSON.Polygon> | null>(null);

  // Stabilize the callback to prevent unnecessary re-renders
  const stableOnRegionSelected = useCallback(
    (geometry: GeoJSON.Feature<GeoJSON.Polygon>) => {
      if (onRegionSelected) {
        onRegionSelected(geometry);
      }
    },
    [onRegionSelected],
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
        polygon: false, // Disable polygon for now
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
      const layer = e.layer as L.Rectangle;

      // Clear previous rectangles (only allow one selection at a time)
      drawnItems.clearLayers();
      drawnItems.addLayer(layer);
      
      // Notify parent component
      stableOnRegionSelected(layer.toGeoJSON());
    };

    const handleDrawDeleted = (event: L.LeafletEvent) => {
      // Cast to correct type
      setSelectedRegion(null);
    };

    const handleDrawEdited = (event: L.LeafletEvent) => {
      const e = event as L.DrawEvents.Edited;
      // Handle rectangle edits
      const layers = e.layers;
      layers.eachLayer((layer: L.Layer) => {
        if (layer instanceof L.Rectangle) {
          const geoJson = layer.toGeoJSON();
          setSelectedRegion(geoJson);
          stableOnRegionSelected(geoJson);
        }
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
      setSelectedRegion(null);
    }
  };

  return (
    <div className={`relative w-full h-full ${className}`}>
      {/* Map container */}
      <div ref={mapRef} className="w-full h-full rounded-lg" />

      {/* Control panel */}
      <div className="absolute top-4 right-4 bg-white p-4 rounded-lg shadow-lg max-w-xs z-[1000]">
        <h3 className="text-lg font-bold mb-2 flex items-center">
          📍 Region Selector
        </h3>
        <div className="text-sm space-y-2">
          <p>
            <strong>Instructions:</strong>
          </p>
          <ol className="list-decimal list-inside space-y-1 text-xs">
            <li>Click the rectangle tool in the top-left corner</li>
            <li>Click and drag to draw a rectangular area</li>
            <li>Use the edit tool to modify your selection</li>
            <li>Use the delete tool to remove your selection</li>
          </ol>

          {selectedRegion && (
            <div className="mt-3 p-2 bg-blue-50 rounded text-xs">
              <button
                onClick={clearSelection}
                className="px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 transition-colors"
              >
                Clear Selection
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
