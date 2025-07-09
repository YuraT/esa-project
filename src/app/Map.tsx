"use client";

import "leaflet/dist/leaflet.css";
import { MapContainer, GeoJSON } from "react-leaflet";
import { useEffect, useRef, useState } from "react";
import L, { LatLngExpression, Layer, PathOptions } from "leaflet";
import { Feature, Geometry } from "geojson";

const CountyMap = () => {
  const [geoData, setGeoData] = useState<any>(null);
  const center: LatLngExpression = [37.8, -96];

  const selectedRef = useRef<Set<string>>(new Set());
  const layerRef = useRef<Map<string, L.Path>>(new Map());

  const baseStyle: PathOptions = {
    color: "black",
    weight: 0.5,
    fillColor: "#d3d3d3",
    fillOpacity: 1,
    interactive: true,
  };

  const highlightStyle: PathOptions = {
    ...baseStyle,
    fillColor: "#ffcc00",
  };

  useEffect(() => {
    fetch("/county.geo.json")
      .then((res) => res.json())
      .then((data) => {
        console.log("✅ Loaded GeoJSON:", data);
        setGeoData(data);
      })
      .catch((err) => console.error("❌ Failed to load GeoJSON:", err));
  }, []);

  const onEachFeature = (feature: Feature<Geometry, any>, layer: Layer) => {
    console.log("📍 onEachFeature fired for:", feature);

    const fips = feature.properties?.GEOID10;
    if (!fips) {
      console.warn("⚠️ No GEOID10 found:", feature);
      return;
    }

    const pathLayer = layer as L.Path;
    layerRef.current.set(fips, pathLayer);
    pathLayer.setStyle(baseStyle);

    pathLayer.on("click", () => {
      console.log("🟡 Clicked county:", fips);

      if (selectedRef.current.has(fips)) {
        selectedRef.current.delete(fips);
        pathLayer.setStyle(baseStyle);
      } else {
        selectedRef.current.add(fips);
        pathLayer.setStyle(highlightStyle);
      }
    });
  };

  const clearAll = () => {
    selectedRef.current.forEach((fips) => {
      const layer = layerRef.current.get(fips);
      if (layer) {
        layer.setStyle(baseStyle);
      }
    });
    selectedRef.current.clear();
  };

  return (
    <div
      style={{ height: "100vh", backgroundColor: "#0077be", padding: "1rem" }}
    >
      <button
        onClick={clearAll}
        style={{
          padding: "8px 16px",
          marginBottom: "10px",
          borderRadius: "6px",
          border: "none",
          backgroundColor: "#ff6666",
          color: "white",
          cursor: "pointer",
          fontWeight: "bold",
        }}
      >
        Clear All
      </button>

      <MapContainer
        center={center}
        zoom={4}
        scrollWheelZoom={false}
        doubleClickZoom={false}
        zoomControl={false}
        style={{
          height: "90%",
          width: "100%",
          backgroundColor: "#0077be",
        }}
      >
        {geoData && (
          <GeoJSON
            data={geoData}
            onEachFeature={onEachFeature}
            style={baseStyle}
          />
        )}
      </MapContainer>
    </div>
  );
};

export default CountyMap;
