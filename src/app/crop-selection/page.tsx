"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const GENERAL_USE_VALUES = new Set([
  "All Agricultural uses",
  "All Agricultural Uses",
  "All non-agricultural uses",
  "All Other Uses",
  "Any Use",
]);

function getProdRegNum(product: string) {
  return product.match(/^\s*[\d\-]+/)?.[0] ?? "";
}

async function fetchLimitations(
  regions: string,
  product: string,
  date: string,
) {
  const prodRegNum = getProdRegNum(product);

  const res = await fetch(
    `/api/pulas-by-geometry?geometry=${encodeURIComponent(regions)}&prod_reg_num=${encodeURIComponent(prodRegNum)}&date=${encodeURIComponent(date)}&returnGeometry=false`,
    {
      cache: "force-cache",
    },
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to fetch limitations: ${res.status} ${text}`);
  }

  return res.json();
}

export default function CropSelectionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const month = searchParams.get("month") ?? "";
  const date = searchParams.get("date") ?? "";
  const product = searchParams.get("product") ?? "";
  const county = searchParams.get("county") ?? "";
  const regions = searchParams.get("regions") ?? "";

  const [availableCrops, setAvailableCrops] = useState<string[]>([]);
  const [selectedCrop, setSelectedCrop] = useState("");


  useEffect(() => {
    async function load() {
      if (!regions || !product || !date) return;

      try {
        const parsed = await fetchLimitations(regions, product, date);
        console.log("fetched limitations on crop page:", parsed);

        const uses = new Set<string>();

        parsed.limitations?.forEach((limitation: any) => {
          limitation.umf?.forEach((entry: any) => {
            const use = entry?.use?.trim();
            if (use && !GENERAL_USE_VALUES.has(use)) {
              uses.add(use);
            }
          });
        });

        const sortedUses = Array.from(uses).sort();
        console.log("available crop/use options:", sortedUses);
        setAvailableCrops(sortedUses);
      } catch (error) {
        console.error("Failed to load limitations:", error);
      }
    }

    load();
  }, [regions, product, date]);

    function handleContinue() {
      if (!selectedCrop) return;

      const params = new URLSearchParams({
        month,
        date,
        product,
        county,
        regions,
        crop: selectedCrop,
      });

      router.push(`/PrintReport?${params.toString()}`);
  }

  return (
    <div className="bg-white min-h-screen flex flex-col">
      <Header />

      <div className="flex flex-1 flex-col items-center justify-center px-6">
        <div className="w-full max-w-2xl rounded-3xl bg-[#f5f7fa] shadow-md p-10">
          <h1 className="text-3xl font-bold text-[#275c9d] text-center mb-4">
            Select Crop / Use Type
          </h1>

          <p className="text-center text-gray-700 mb-8">
            Some pesticide limitations depend on the selected crop or use type.
            Please choose the option that applies.
          </p>

          <div className="flex flex-col gap-4">
            <label className="font-semibold text-[#275c9d]">
              Crop / Use Type
            </label>

            <select
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-[#275c9d] outline-none focus:ring-2 focus:ring-[#678dc9]"
            >
              <option value="">Select an option...</option>
              {availableCrops.map((crop) => (
                <option key={crop} value={crop}>
                  {crop}
                </option>
              ))}
            </select>

            <button
              onClick={handleContinue}
              disabled={!selectedCrop}
              className="mt-6 bg-[#4673ab] text-white font-bold text-lg py-3 rounded-lg hover:bg-[#3e6293] disabled:bg-[#9bb3d1] disabled:cursor-not-allowed"
            >
              Continue
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}