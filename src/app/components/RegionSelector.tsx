"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw";
import "leaflet-draw/dist/leaflet.draw.css";

// Fix for default markers in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

interface RegionSelectorProps {
  onRegionSelected?: (bounds: {
    north: number;
    south: number;
    east: number;
    west: number;
  }) => void;
  className?: string;
}

export default function RegionSelector({
  onRegionSelected,
  className = "",
}: RegionSelectorProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const drawnItemsRef = useRef<L.FeatureGroup | null>(null);
  const [status, setStatus] = useState("Initializing map...");
  const [selectedRegion, setSelectedRegion] = useState<{
    north: number;
    south: number;
    east: number;
    west: number;
  } | null>(null);

  // Stabilize the callback to prevent unnecessary re-renders
  const stableOnRegionSelected = useCallback(
    (bounds: { north: number; south: number; east: number; west: number }) => {
      if (onRegionSelected) {
        onRegionSelected(bounds);
      }
    },
    [onRegionSelected],
  );

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Initialize map
    const map = L.map(mapRef.current).setView([39.8, -98.6], 4);
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
    const handleDrawCreated = (e: L.DrawEvents.Created) => {
      const layer = e.layer as L.Rectangle;

      // Clear previous rectangles (only allow one selection at a time)
      drawnItems.clearLayers();
      drawnItems.addLayer(layer);

      // Get bounds of the rectangle
      const bounds = layer.getBounds();
      const regionBounds = {
        north: bounds.getNorth(),
        south: bounds.getSouth(),
        east: bounds.getEast(),
        west: bounds.getWest(),
      };

      setSelectedRegion(regionBounds);
      setStatus(
        `Region selected: ${regionBounds.north.toFixed(4)}°N, ${regionBounds.south.toFixed(4)}°S, ${regionBounds.east.toFixed(4)}°E, ${regionBounds.west.toFixed(4)}°W`,
      );

      // Notify parent component
      stableOnRegionSelected(regionBounds);
    };

    const handleDrawDeleted = (e: L.DrawEvents.Deleted) => {
      setSelectedRegion(null);
      setStatus(
        "Ready to select a region. Click the rectangle tool and draw your area of interest.",
      );
    };

    const handleDrawEdited = (e: L.DrawEvents.Edited) => {
      // Handle rectangle edits
      const layers = e.layers;
      layers.eachLayer((layer: L.Layer) => {
        if (layer instanceof L.Rectangle) {
          const bounds = layer.getBounds();
          const regionBounds = {
            north: bounds.getNorth(),
            south: bounds.getSouth(),
            east: bounds.getEast(),
            west: bounds.getWest(),
          };

          setSelectedRegion(regionBounds);
          setStatus(
            `Region updated: ${regionBounds.north.toFixed(4)}°N, ${regionBounds.south.toFixed(4)}°S, ${regionBounds.east.toFixed(4)}°E, ${regionBounds.west.toFixed(4)}°W`,
          );

          stableOnRegionSelected(regionBounds);
        }
      });
    };

    // Attach event listeners
    map.on(L.Draw.Event.CREATED, handleDrawCreated);
    map.on(L.Draw.Event.DELETED, handleDrawDeleted);
    map.on(L.Draw.Event.EDITED, handleDrawEdited);

    setStatus(
      "Ready to select a region. Click the rectangle tool and draw your area of interest.",
    );

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

  const clearSelection = () => {
    if (drawnItemsRef.current) {
      drawnItemsRef.current.clearLayers();
      setSelectedRegion(null);
      setStatus(
        "Ready to select a region. Click the rectangle tool and draw your area of interest.",
      );
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

          <div className="mt-3 p-2 bg-gray-50 rounded text-xs">
            <strong>Status:</strong> {status}
          </div>

          {selectedRegion && (
            <div className="mt-3 p-2 bg-blue-50 rounded text-xs">
              <strong>Selected Region:</strong>
              <div className="mt-1">
                <div>North: {selectedRegion.north.toFixed(4)}°</div>
                <div>South: {selectedRegion.south.toFixed(4)}°</div>
                <div>East: {selectedRegion.east.toFixed(4)}°</div>
                <div>West: {selectedRegion.west.toFixed(4)}°</div>
              </div>
              <button
                onClick={clearSelection}
                className="mt-2 px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 transition-colors"
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
