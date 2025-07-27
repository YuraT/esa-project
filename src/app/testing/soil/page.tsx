"use client";
import React, { useState, useEffect } from "react";
import LoadingIndicator from "@/app/components/LoadingIndicator";
import BackButton from "@/app/components/BackButton";

export default function page() {
  const [loading, setLoading] = useState(false);
  const [soilData, setSoilData] = useState("");

  useEffect(() => {
    const fetchSoilData = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/soil-data"); // need actual api
        const data = await res.json();
        setSoilData(data);
      } catch (error) {
        console.error("Error: Failed to fetch soil data.", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSoilData();
  }, []);

  return (
    <div>
      <BackButton />
      {loading ? (
        <LoadingIndicator />
      ) : soilData ? (
        <p>Yes data</p>
      ) : (
        <p>No data</p>
      )}
    </div>
  );
}
