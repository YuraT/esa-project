"use client";

import { stepProps } from "../utils/props";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";

const SoilSurveyMap = dynamic(() => import("./SoilSurveyMap"), { ssr: false });

export default function Step3({ value, setValue }: stepProps) {
  const searchParams = useSearchParams();
  const regionParam = searchParams.get("region");

  // Memoize the region parsing to prevent unnecessary map reloads
  const selectedRegion =
    useMemo<GeoJSON.Feature<GeoJSON.Polygon> | null>(() => {
      if (!regionParam) return null;

      try {
        return JSON.parse(decodeURIComponent(regionParam));
      } catch (error) {
        console.error("Error parsing region parameter:", error);
        return null;
      }
    }, [regionParam]);

  return (
    <div className="mb-17 flex flex-col bg-[#f9f9f9] rounded-3xl w-240">
      <div className="flex items-center gap-22 mb-4 ">
        <div className="w-8 h-8 mt-10 ml-10 rounded-full bg-[#577bb5] text-white flex items-center justify-center font-bold text-lg">
          3
        </div>
        <div className="ml-45 mt-10 text-2xl font-bold text-[#275c9d]">
          Predominantly Sandy Soils
        </div>
      </div>

      <div className="flex flex-col items-center justify-center">
        <p className="italic font-bold mt-2 leading-tight text-center pl-50 pr-50 text-lg text-black">
          **This option can only be used if the product label does not prohibit
          application on sandy soils**
        </p>

        <p className="mt-4 leading-tight text-center pl-50 pr-50 text-lg text-black">
          Determine whether your soil falls into{" "}
          <span className="font-bold">Moderately Sandy Soils</span> or{" "}
          <span className="font-bold">Predominantly Sandy Soils</span>.
        </p>

        <div className="flex mt-6 gap-4">
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
      <div className="mt-8 px-10 pb-10">
        <SoilSurveyMap region={selectedRegion} className="w-full" />
      </div>
    </div>
  );
}
