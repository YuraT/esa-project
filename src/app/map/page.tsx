"use client";
import Footer from "../components/Footer";
import React, { useState, useEffect, useRef } from "react";
import { ChevronDown, LoaderCircle } from "lucide-react";
import countiesData from "../data/uscounties.json";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { LimitationTypes } from "@/lib/limitation-types";
const RegionSelector = dynamic(() => import("../components/RegionSelector"), {
  ssr: false,
});

const GENERAL_USE_VALUES = new Set([
  "All Agricultural uses",
  "All Agricultural Uses",
  "All non-agricultural uses",
  "All Other Uses",
  "Any Use",
]);

function requiresCropSelection(limitations: any[]): boolean {
  return limitations.some(
    (limitation) =>
      Array.isArray(limitation?.umf) &&
      limitation.umf.some((entry: any) => {
        const use = entry?.use?.trim();
        return use && !GENERAL_USE_VALUES.has(use);
      }),
  );
}

//CHANGE/REFINE LATER

function getLastSixMonths(): { display: string; value: string }[] {
  const months = [];
  const now = new Date();
  for (let i = 0; i < 6; i++) {
    const date = new Date(now.getFullYear(), now.getMonth() + i, 1);
    const month = date.toLocaleString("default", { month: "long" });
    const year = date.getFullYear();
    const display = `${month} ${year}`;
    const value = date.toISOString().split("T")[0];
    months.push({ display, value });
  }
  return months;
}

let cachedProducts: string[] | null = null;

export default function SearchContainer() {
  // State: Dropdown open/close
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<{
    display: string;
    value: string;
  } | null>(null);

  // State: County
  const [countyQuery, setCountyQuery] = useState("");
  const [filteredCounties, setFilteredCounties] = useState<
    { county: string; countyIndex: number }[]
  >([]);
  const [selectedCounty, setSelectedCounty] = useState("");

  // State: Product
  const [productQuery, setProductQuery] = useState("");
  const [debouncedProductQuery, setDebouncedProductQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState<string[]>([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [allProducts, setAllProducts] = useState<string[]>([]);

  // State: Region Selection
  const [selectedRegions, setSelectedRegions] = useState<
    GeoJSON.Feature<GeoJSON.Polygon>[]
  >([]);

  // State: Map Position for county zoom
  const [mapPosition, setMapPosition] = useState<{
    center: L.LatLngExpression;
    zoom?: number;
  } | null>(null);

  // State: Loading
  const [isLoading, setIsLoading] = useState(false);

  // Data: Counties
  const allCounties: string[] = countiesData.map(
    (item: { county: string; state_id: string }) =>
      `${item.county}, ${item.state_id}`,
  );

  // Refs
  const dateDropdownRef = useRef(null);
  const countyDropdownRef = useRef(null);
  const productDropdownRef = useRef(null);

  // Outside click handler
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dateDropdownRef.current &&
        !(dateDropdownRef.current as any).contains(event.target)
      ) {
        setIsOpen(false);
      }
      if (
        countyDropdownRef.current &&
        !(countyDropdownRef.current as any).contains(event.target)
      ) {
        setFilteredCounties([]);
      }
      if (
        productDropdownRef.current &&
        !(productDropdownRef.current as any).contains(event.target)
      ) {
        setFilteredProducts([]);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Event: Select Month
  function handleSelect(monthData: { display: string; value: string }) {
    setSelectedDate(monthData);
    setIsOpen(false);
  }

  // Handle regions selection
  function handleRegionsSelected(
    geometries: GeoJSON.Feature<GeoJSON.Polygon>[],
  ) {
    setSelectedRegions(geometries);
    console.log("Regions selected:", geometries);
  }

  const router = useRouter();

  // Query geometry API to get limitations and PULAs for selected regions
  async function queryGeometryData(
    regionGeometries: GeoJSON.Feature<GeoJSON.Polygon>[],
    productName: string,
    applicationDate: string,
  ): Promise<{ limitations: any[]; pulas: any[] } | null> {
    try {
      // Extract product registration number from product string
      const prodRegNum = productName.match(/^\s*[\d\-]+/)?.[0] ?? "";

      // Query for all regions in a single API call
      const response = await fetch(
        `/api/pulas-by-geometry?geometry=${encodeURIComponent(JSON.stringify(regionGeometries))}&prod_reg_num=${encodeURIComponent(prodRegNum)}&date=${encodeURIComponent(applicationDate)}&returnGeometry=true`,
      );
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Failed to fetch geometry data", response.status, errorText);
        return null;
      }
      return response.json();
    } catch (error) {
      console.error("Error querying geometry data:", error);
      return null;
    }
  }

  async function handleSearch() {
    if (!selectedDate || !selectedCounty || !selectedProduct || !selectedRegions) {
      alert("Please fill out all fields.");
      return;
    }

    if (selectedRegions.length === 0) {
      alert("Please select at least one region on the map.");
      return;
    }

    setIsLoading(true);

    try {
      console.log("Querying geometry-specific data for selected regions");

      const geometryResult = await queryGeometryData(
        selectedRegions,
        selectedProduct,
        selectedDate.value,
      );

      const regionsParam = `&regions=${encodeURIComponent(
        JSON.stringify(selectedRegions),
      )}`;

      if (geometryResult) {
        // Log raw and plain text of limitations for debugging! will remove later
        console.log(
          "mitigation check values:",
          geometryResult.limitations?.map((item) => ({
            raw: item.limitation,
            plain: item.limitation?.replace(/<[^>]*>/g, " "),
          })),
        );
        console.log("matcher:", LimitationTypes.t1RunoffErosion);

        // Route to mitigation menu if any limitation requires calculating mitigation points
        if (
          geometryResult.limitations.some(({ limitation }) =>
            limitation.includes(LimitationTypes.t1RunoffErosion),
          )
        ) {
          router.push(
            `/mitigation-table?month=${encodeURIComponent(
              selectedDate.display,
            )}&date=${encodeURIComponent(
              selectedDate.value,
            )}&product=${encodeURIComponent(
              selectedProduct,
            )}&county=${encodeURIComponent(selectedCounty)}${regionsParam}`,
          );
          return;
        }

        // Route to crop selection only when non-general UMF use values exist
        if (requiresCropSelection(geometryResult.limitations)) {
          router.push(
            `/crop-selection?month=${encodeURIComponent(
              selectedDate.display,
            )}&date=${encodeURIComponent(
              selectedDate.value,
            )}&product=${encodeURIComponent(
              selectedProduct,
            )}&county=${encodeURIComponent(selectedCounty)}${regionsParam}`,
          );
          return;
        }
      }

      router.push(
        `/PrintReport?month=${encodeURIComponent(
          selectedDate.display,
        )}&date=${encodeURIComponent(
          selectedDate.value,
        )}&product=${encodeURIComponent(
          selectedProduct,
        )}&county=${encodeURIComponent(selectedCounty)}${regionsParam}`,
      );
    } catch (error) {
      console.error("Error fetching limitations:", error);
    } finally {
      setIsLoading(false);
    }
  }

  // County: Input & Select
  function handleCountyInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const query = e.target.value;
    setCountyQuery(query);

    if (query.length > 0) {
      const filtered = allCounties
        .map((county, index) => ({ county, countyIndex: index }))
        .filter(({ county }) =>
          county.toLowerCase().includes(query.toLowerCase()),
        );
      setFilteredCounties(filtered);
    } else {
      setFilteredCounties([]);
    }
  }

  function handleCountySelect(value: string, countyIndex: number) {
    setSelectedCounty(value);
    setCountyQuery(value);
    setFilteredCounties([]);

    const countyData = countiesData[countyIndex];
    if (countyData) {
      setMapPosition({
        center: [countyData.lat, countyData.lng],
        zoom: 8.5, // Appropriate zoom level for county view
      });
    }
  }

  // Product: Input & Select
  function handleProductInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setProductQuery(e.target.value);
  }

  function handleProductSelect(value: string) {
    setSelectedProduct(value);
    setProductQuery(value);
    setFilteredProducts([]);
  }

  // Debounce input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedProductQuery(productQuery);
    }, 200);
    return () => clearTimeout(timer);
  }, [productQuery]);

  // Filter product list
  useEffect(() => {
    if (debouncedProductQuery.length > 0) {
      const filtered = allProducts.filter((product) =>
        product.toLowerCase().includes(debouncedProductQuery.toLowerCase()),
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts([]);
    }
  }, [debouncedProductQuery, allProducts]);

  // Fetch & Cache products
  useEffect(() => {
    async function fetchProducts() {
      const local = localStorage.getItem("productList");
      if (local) {
        const parsed = JSON.parse(local);
        setAllProducts(parsed);
        cachedProducts = parsed;
      } else if (cachedProducts) {
        setAllProducts(cachedProducts);
      }

      // Always fetch fresh data in the background
      try {
        const res = await fetch("/api/products");
        const data: Array<{
          limitations?: Array<{
            product_registration_number: string;
            product_name: string;
          }>;
        }> = await res.json();

        const allLimitations = data.flatMap(
          (product) => product.limitations || [],
        );
        const formatted = allLimitations.map(
          (lim) => `${lim.product_registration_number} – ${lim.product_name}`,
        );

        const unique = [...new Set(formatted)];

        localStorage.setItem("productList", JSON.stringify(unique));
        cachedProducts = unique;
        setAllProducts(unique);
      } catch (err) {
        console.error("Failed to fetch product list", err);
      }
    }
    fetchProducts();
  }, []);

  // UI
  return (
    <div className="app-content-gutter flex flex-col items-start justify-start min-h-screen w-full max-w-full min-w-0 overflow-x-hidden bg-white font-sans">
      <div className="mb-10 w-full h-[15vh] flex items-center justify-center bg-[#275c9d] relative">
        <div
          onClick={() => router.push("/")} // <-- navigates to main page
          className="absolute left-3 sm:left-10 flex items-center justify-center w-10 h-10 rounded-full bg-[#678dc9] cursor-pointer hover:bg-[#5a7fb5] transition"
        >
          <svg
            className="w-4 h-4 text-white"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </div>
      </div>

      {/* Main Content: Search Panel + Map — stack on small screens */}
      <div className="flex flex-col xl:flex-row w-full gap-8 xl:gap-12 2xl:gap-20 justify-center items-center sm:px-4 pb-8 xl:px-6 min-w-0 max-w-full">
        {/* Search Panel */}
        <div className="w-full max-w-xl xl:w-[min(28vw,28rem)] xl:max-w-none shrink-0 rounded-3xl xl:rounded-[2rem] flex flex-col items-center gap-6 md:gap-10 bg-[#275c9d] py-6 px-4 mx-auto xl:mx-0">
          <h1 className="text-white text-2xl sm:text-4xl font-bold mt-2 md:mt-7">Search!</h1>

          {/* Product Search */}
          <div className="flex flex-col" ref={productDropdownRef}>
            <div className="w-full h-[6vh] min-h-[2.75rem] bg-[#678dc9] rounded-t-[0.5rem] flex items-center justify-start pl-3">
              <h1 className="text-white text-[20px] font-bold">
                EPA Registration Number
              </h1>
            </div>
            <div className="relative w-full">
              <div className="relative w-full">
                <input
                  type="text"
                  value={productQuery}
                  onChange={handleProductInputChange}
                  onFocus={() => {
                    if (productQuery.length > 0) {
                      const filtered = allProducts.filter((product) =>
                        product
                          .toLowerCase()
                          .includes(productQuery.toLowerCase()),
                      );
                      setFilteredProducts(filtered);
                    }
                  }}
                  placeholder="Type product number/name . . ."
                  className="w-full h-[6vh] bg-[#edebeb] rounded-b-[0.5rem] px-4 pr-10 text-[#275c9d] placeholder-[#678dc9] outline-none"
                />
                <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#275c9d] w-4 h-5 pointer-events-none" />
              </div>
              {filteredProducts.length > 0 && (
                <div className="text-[#275c9d] absolute w-full left-0 right-0 bg-white border rounded mt-1 shadow z-1000 max-h-60 overflow-y-auto">
                  {filteredProducts.map((product) => (
                    <div
                      key={product}
                      onClick={() => handleProductSelect(product)}
                      className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
                    >
                      {product}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Date Dropdown */}
          <div className="flex flex-col" ref={dateDropdownRef}>
            <div className="w-full h-[6vh] min-h-[2.75rem] bg-[#678dc9] rounded-t-[0.5rem] flex items-center justify-start pl-3">
              <h1 className="text-white text-[20px] font-bold">
                Application Date
              </h1>
            </div>
            <div className="relative w-full">
              <div
                onClick={() => setIsOpen(!isOpen)}
                className="w-full h-[6vh] min-h-[2.75rem] bg-[#edebeb] rounded-b-[0.5rem] flex items-center justify-between px-4 cursor-pointer"
              >
                <span
                  className={`flex ${selectedDate ? "text-[#275c9d]" : "text-[#5a86bf]"}`}
                >
                  {selectedDate?.display || "Click to select application date. . ."}
                </span>
                <ChevronDown className="text-[#275c9d] w-4 h-5" />
              </div>
              {isOpen && (
                <div className="text-[#275c9d] absolute w-full left-0 right-0 bg-white border rounded mt-1 shadow z-1000">
                  {getLastSixMonths().map((monthData) => (
                    <div
                      key={monthData.value}
                      onClick={() => handleSelect(monthData)}
                      className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
                    >
                      {monthData.display}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* County Input */}
          <div className="flex flex-col" ref={countyDropdownRef}>
            <div className="w-full h-[6vh] min-h-[2.75rem] bg-[#678dc9] rounded-t-[0.5rem] flex items-center justify-start pl-3">
              <h1 className="text-white text-[20px] font-bold">County</h1>
            </div>
            <div className="relative w-full">
              <div className="relative w-full">
                <input
                  type="text"
                  value={countyQuery}
                  onChange={handleCountyInputChange}
                  onFocus={() => {
                    if (countyQuery.length > 0) {
                      const filtered = allCounties
                        .map((county, index) => ({
                          county,
                          countyIndex: index,
                        }))
                        .filter(({ county }) =>
                          county
                            .toLowerCase()
                            .includes(countyQuery.toLowerCase()),
                        );
                      setFilteredCounties(filtered);
                    }
                  }}
                  placeholder="Type county (e.g. Napa, CA) . . ."
                  className="w-full h-[6vh] bg-[#edebeb] rounded-b-[0.5rem] px-4 pr-10 text-[#275c9d] placeholder-[#678dc9] outline-none"
                />
                <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#275c9d] w-4 h-5 pointer-events-none" />
              </div>
              {filteredCounties.length > 0 && (
                <div className="text-[#275c9d] absolute w-full left-0 right-0 bg-white border rounded mt-1 shadow z-1000 max-h-60 overflow-y-auto">
                  {filteredCounties.map(({ county, countyIndex }) => (
                    <div
                      key={countyIndex}
                      onClick={() => handleCountySelect(county, countyIndex)}
                      className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
                    >
                      {county}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Submit */}
          <button
            onClick={handleSearch}
            disabled={isLoading}
            className={`mb-5 mt-auto w-full max-w-[14rem] min-h-[3rem] h-[8vh] hidden xl:flex ${isLoading
              ? "bg-[#678dc9] cursor-not-allowed"
              : "bg-[#4673ab] cursor-pointer hover:bg-[#3e6293]"
              } items-center justify-center rounded-[0.5rem] transition-colors border-none`}
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <LoaderCircle className="w-5 h-5 text-white animate-spin" />
                <span className="text-white font-bold text-lg">Loading...</span>
              </div>
            ) : (
              <span className="text-white font-bold text-2xl">Next!</span>
            )}
          </button>
        </div>

        {/* Region Selector Map */}
        <div className="w-full xl:w-[min(50vw,52rem)] min-h-[min(50vh,320px)] h-[50vh] md:h-[60vh] xl:h-[75vh] xl:min-h-0">
          <RegionSelector
            onRegionsSelected={handleRegionsSelected}
            mapPosition={mapPosition}
            className="rounded-[2rem] overflow-hidden shadow-lg"
          />
        </div>

        {/* Mobile Submit */}
        <button
          onClick={handleSearch}
          disabled={isLoading}
          className={`xl:hidden mx-auto mt-2 w-full max-w-[14rem] min-h-[3rem] h-[8vh] flex ${isLoading
            ? "bg-[#678dc9] cursor-not-allowed"
            : "bg-[#4673ab] cursor-pointer hover:bg-[#3e6293]"
            } items-center justify-center rounded-[0.5rem] transition-colors border-none`}
        >
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <LoaderCircle className="w-5 h-5 text-white animate-spin" />
              <span className="text-white font-bold text-lg">Loading...</span>
            </div>
          ) : (
            <span className="text-white font-bold text-2xl">Next!</span>
          )}
        </button>
      </div>

      <Footer />
    </div>
  );
}