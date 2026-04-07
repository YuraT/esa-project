"use client";
import React, { useState, useEffect } from "react";
import LoadingIndicator from "@/app/components/LoadingIndicator";
import BackButton from "@/app/components/BackButton";
import ErrorDisplay from "@/app/components/ErrorDisplay";

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
    <div className="app-content-gutter min-h-screen w-full max-w-4xl mx-auto py-6">
      <BackButton />
      {loading ? (
        <LoadingIndicator />
      ) : soilData ? (
        <p>Yes data</p>
      ) : (
        <>
          <div className="flex flex-col items-center justify-center">
            <ErrorDisplay message={"No soil data"} />
          </div>
        </>
      )}
    </div>
  );
}
