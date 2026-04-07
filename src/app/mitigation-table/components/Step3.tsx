"use client";

import { stepProps } from "../../utils/props";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";

const SoilSurveyMap = dynamic(() => import("./SoilSurveyMap"), { ssr: false });

export default function Step3({ value, setValue }: stepProps) {
  const searchParams = useSearchParams();
  const regionsParam = searchParams.get("regions");

  // Memoize the regions parsing to prevent unnecessary map reloads
  const selectedRegions = useMemo<GeoJSON.Feature<GeoJSON.Polygon>[]>(() => {
    if (!regionsParam) return [];

    try {
      return JSON.parse(decodeURIComponent(regionsParam));
    } catch (error) {
      console.error("Error parsing regions parameter:", error);
      return [];
    }
  }, [regionsParam]);

  return (
    <div className="mb-17 flex flex-col bg-[#f9f9f9] rounded-3xl w-full max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4 px-4 sm:px-6">
        <div className="w-8 h-8 mt-6 sm:mt-10 shrink-0 rounded-full bg-[#577bb5] text-white flex items-center justify-center font-bold text-lg">
          3
        </div>
        <div className="sm:ml-4 sm:mt-10 text-xl sm:text-2xl font-bold text-[#275c9d]">
          Predominantly Sandy Soils
        </div>
      </div>

      <div className="flex flex-col items-center justify-center px-4">
        <p className="italic font-bold mt-2 leading-tight text-center text-lg text-black max-w-3xl">
          **This option can only be used if the product label does not prohibit
          application on sandy soils**
        </p>

        <p className="mt-4 leading-tight text-center text-lg text-black max-w-3xl">
          Determine whether your soil falls into{" "}
          <span className="font-bold">Moderately Sandy Soils</span> or{" "}
          <span className="font-bold">Predominantly Sandy Soils</span>.
        </p>

        <div className="flex flex-wrap justify-center mt-6 gap-4">
          <button
            className={`px-6 py-2 rounded-lg font-bold text-lg text-[#275c9d] ${
              value === 3
                ? "bg-blue-200 border-2 border-blue-500"
                : "bg-gray-200"
            }`}
            onClick={() => setValue(3)}
            type="button"
          >
            Hydrologic Group A
          </button>
          <button
            className={`px-6 py-2 rounded-lg font-bold text-lg text-[#275c9d] ${
              value === 2
                ? "bg-blue-200 border-2 border-blue-500"
                : "bg-gray-200"
            }`}
            onClick={() => setValue(2)}
            type="button"
          >
            Hydrologic Group B
          </button>
          <button
            className={`px-6 py-2 rounded-lg font-bold text-lg text-[#275c9d] ${
              value === 0
                ? "bg-blue-200 border-2 border-blue-500"
                : "bg-gray-200"
            }`}
            onClick={() => setValue(0)}
            type="button"
          >
            Other/Not Sandy
          </button>
        </div>
      </div>

      {/* Soil Survey Map Section */}
      <div className="mt-8 px-4 sm:px-10 pb-10">
        <SoilSurveyMap regions={selectedRegions} className="w-full" />
      </div>
    </div>
  );
}
