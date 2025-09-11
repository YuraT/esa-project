"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw";
import "leaflet-draw/dist/leaflet.draw.css";
import { IPolygon } from "@esri/arcgis-rest-request";

interface RegionSelectorProps {
  onRegionSelected?: (geometry: IPolygon) => void;
  className?: string;
}

export default function RegionSelector({
  onRegionSelected,
  className = "",
}: RegionSelectorProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const drawnItemsRef = useRef<L.FeatureGroup | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<IPolygon | null>(null);

  // Stabilize the callback to prevent unnecessary re-renders
  const stableOnRegionSelected = useCallback(
    (geometry: IPolygon) => {
      if (onRegionSelected) {
        onRegionSelected(geometry);
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

    // Utility function to convert Leaflet bounds to Esri Polygon geometry
    function boundsToEsriPolygon(bounds: L.LatLngBounds): IPolygon {
      const north = bounds.getNorth();
      const south = bounds.getSouth();
      const east = bounds.getEast();
      const west = bounds.getWest();

      return {
        rings: [
          [
            [west, south],
            [east, south],
            [east, north],
            [west, north],
            [west, south],
          ],
        ],
        spatialReference: {
          wkid: 4326, // WGS84
        },
      };
    }

    // Event handlers
    const handleDrawCreated = (event: L.LeafletEvent) => {
      const e = event as L.DrawEvents.Created;
      const layer = e.layer as L.Rectangle;

      // Clear previous rectangles (only allow one selection at a time)
      drawnItems.clearLayers();
      drawnItems.addLayer(layer);

      // Get bounds of the rectangle and convert to Esri geometry format
      const bounds = layer.getBounds();
      const esriGeometry = boundsToEsriPolygon(bounds);

      // Notify parent component
      stableOnRegionSelected(esriGeometry);
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
          const bounds = layer.getBounds();
          const esriGeometry = boundsToEsriPolygon(bounds);

          setSelectedRegion(esriGeometry);

          stableOnRegionSelected(esriGeometry);
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
