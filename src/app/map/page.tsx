"use client";
import Footer from "../components/Footer";
import Header from "../components/Header";
import React, { useState, useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";
import countiesData from "../data/uscounties.json";
import { useRouter } from "next/navigation";
import RegionSelector from "../components/RegionSelector";

function getLastSixMonths(): string[] {
  const months = [];
  const now = new Date();
  for (let i = 0; i < 6; i++) {
    const date = new Date(now.getFullYear(), now.getMonth() + i, 1);
    const month = date.toLocaleString("default", { month: "long" });
    const year = date.getFullYear();
    months.push(`${month} ${year}`);
  }
  return months;
}

let cachedProducts: string[] | null = null;

export default function SearchContainer() {
  // State: Dropdown open/close
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);

  // State: County
  const [countyQuery, setCountyQuery] = useState("");
  const [filteredCounties, setFilteredCounties] = useState<string[]>([]);
  const [selectedCounty, setSelectedCounty] = useState("");

  // State: Product
  const [productQuery, setProductQuery] = useState("");
  const [debouncedProductQuery, setDebouncedProductQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState<string[]>([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [allProducts, setAllProducts] = useState<string[]>([]);

  // State: Region Selection
  const [selectedRegion, setSelectedRegion] = useState<{
    north: number;
    south: number;
    east: number;
    west: number;
  } | null>(null);

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
  function handleSelect(value: string) {
    setSelected(value);
    setIsOpen(false);
  }

  // Handle region selection
  function handleRegionSelected(bounds: {
    north: number;
    south: number;
    east: number;
    west: number;
  }) {
    setSelectedRegion(bounds);
    console.log("Region selected:", bounds);
  }

  const router = useRouter();

  async function handleSearch() {
    if (!selected || !selectedCounty || !selectedProduct) {
      alert("Please fill out all fields.");
      return;
    }

    // Format the selected date into MM/DD/YYYY
    const [monthStr, yearStr] = selected.split(" ");
    const month = new Date(`${monthStr} 1, ${yearStr}`).getMonth() + 1;
    const formattedDate = `${month}/1/${yearStr}`;

    // Extract product registration number
    const prodRegNum = selectedProduct.match(/^\s*[\d\-]+/)?.[0] ?? "";

    // Extract county and state separately
    const [countyRaw, stateRaw] = selectedCounty
      .split(",")
      .map((s) => s.trim());
    const county = countyRaw.endsWith("County")
      ? countyRaw
      : `${countyRaw} County`;
    const state = stateRaw ?? "";

    try {
      const response = await fetch(
        `/api/esa-reqs?date=${encodeURIComponent(formattedDate)}&county=${encodeURIComponent(county)}&state=${encodeURIComponent(state)}&prod_reg_num=${encodeURIComponent(prodRegNum)}`,
      );

      const data = await response.json();
      console.log("API Response:", data);

      if (Array.isArray(data) && data.length > 0) {
        localStorage.setItem("esa_limitations", JSON.stringify(data));
        console.log("FULL LIMITATION DATA SAVED TO STORAGE:", data);
      } else {
        const fallback = [
          {
            limitation:
              "No pesticide use limitations exist for your selected county, date, and product at this time. Simply ensure compliance with the pesticide use instructions on your product label.",
            last_update: null,
            umf: [],
          },
        ];
        localStorage.setItem("esa_limitations", JSON.stringify(fallback));
        console.log("NO MATCH — SAVED DEFAULT MESSAGE TO STORAGE");
      }

      //router.push(`/PrintReport?month=${selected}&product=${selectedProduct}&county=${selectedCounty}`);

      // NEW:
      router.push(
        `/mitigation-table?month=${selected}&product=${selectedProduct}&county=${selectedCounty}`,
      );
    } catch (error) {
      console.error("Error fetching limitations:", error);
    }
  }

  // County: Input & Select
  function handleCountyInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const query = e.target.value;
    setCountyQuery(query);

    if (query.length > 0) {
      const filtered = allCounties.filter((county) =>
        county.toLowerCase().includes(query.toLowerCase()),
      );
      setFilteredCounties(filtered);
    } else {
      setFilteredCounties([]);
    }
  }

  function handleCountySelect(value: string) {
    setSelectedCounty(value);
    setCountyQuery(value);
    setFilteredCounties([]);
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
        return;
      }

      if (cachedProducts) {
        setAllProducts(cachedProducts);
        return;
      }

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
    <div className="flex flex-col items-start justify-start min-h-screen bg-white font-sans">
      <div className="mb-10 w-full h-[15vh] flex items-center justify-center bg-[#275c9d] relative">
        <div
          onClick={() => router.push("/")} // <-- navigates to main page
          className="absolute left-10 flex items-center justify-center w-10 h-10 rounded-full bg-[#678dc9] cursor-pointer hover:bg-[#5a7fb5] transition"
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

      {/* Main Content: Search Panel + Static Map Side-by-Side */}
      <div className="flex flex-row mt-5 ml-[3vw] gap-10">
        {/* Search Panel */}
        <div className="mb-15 w-[28vw] h-[75vh] rounded-[2rem] flex flex-col items-center gap-10 bg-[#275c9d]">
          <h1 className="text-white text-4xl font-bold mt-7">Search!</h1>

          {/* Product Search */}
          <div className="flex flex-col" ref={productDropdownRef}>
            <div className="w-[23vw] h-[6vh] bg-[#678dc9] rounded-t-[0.5rem] flex items-center justify-start pl-3">
              <h1 className="text-white text-[20px] font-bold">
                EPA Registration Number
              </h1>
            </div>
            <div className="relative">
              <div className="relative w-[23vw]">
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
                <div className="text-[#275c9d] absolute w-[23vw] bg-white border rounded mt-1 shadow z-10 max-h-60 overflow-y-auto">
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
            <div className="w-[23vw] h-[6vh] bg-[#678dc9] rounded-t-[0.5rem] flex items-center justify-start pl-3">
              <h1 className="text-white text-[20px] font-bold">Date</h1>
            </div>
            <div className="relative">
              <div
                onClick={() => setIsOpen(!isOpen)}
                className="w-[23vw] h-[6vh] bg-[#edebeb] rounded-b-[0.5rem] flex items-center justify-between px-4 cursor-pointer"
              >
                <span
                  className={`flex ${selected ? "text-[#275c9d]" : "text-[#5a86bf]"}`}
                >
                  {selected || "Click to select application date. . ."}
                </span>
                <ChevronDown className="text-[#275c9d] w-4 h-5" />
              </div>
              {isOpen && (
                <div className="text-[#275c9d] absolute w-[23vw] bg-white border rounded mt-1 shadow z-10">
                  {getLastSixMonths().map((month) => (
                    <div
                      key={month}
                      onClick={() => handleSelect(month)}
                      className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
                    >
                      {month}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* County Input */}
          <div className="flex flex-col" ref={countyDropdownRef}>
            <div className="w-[23vw] h-[6vh] bg-[#678dc9] rounded-t-[0.5rem] flex items-center justify-start pl-3">
              <h1 className="text-white text-[20px] font-bold">
                Soil Data (County Level)
              </h1>
            </div>
            <div className="relative">
              <div className="relative w-[23vw]">
                <input
                  type="text"
                  value={countyQuery}
                  onChange={handleCountyInputChange}
                  onFocus={() => {
                    if (countyQuery.length > 0) {
                      const filtered = allCounties.filter((county) =>
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
                <div className="text-[#275c9d] absolute w-[23vw] bg-white border rounded mt-1 shadow z-10 max-h-60 overflow-y-auto">
                  {filteredCounties.map((county) => (
                    <div
                      key={county}
                      onClick={() => handleCountySelect(county)}
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
          <div
            onClick={handleSearch}
            className="mb-5 w-[10vw] h-[8vh] bg-[#4673ab] flex items-center justify-center rounded-[0.5rem] cursor-pointer"
          >
            <h1 className="text-white text-2xl font-bold">Next!</h1>
          </div>
        </div>

        {/* Region Selector Map */}
        <div className="mt-15 ml-20 w-[50vw] h-[60vh]">
          <RegionSelector
            onRegionSelected={handleRegionSelected}
            className="rounded-[2rem] overflow-hidden shadow-lg"
          />
        </div>
      </div>

      <Footer />
    </div>
  );
}
