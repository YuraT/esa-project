"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

import { LimitationTypes } from "@/lib/limitation-types";

type UMFEntry = {
  use?: string;
  method?: string;
  form?: string;
  pula_id?: number;
};

type LimitationItem = {
  limitation: string;
  umf: UMFEntry[];
  code?: string;
  last_update?: string;
};

export type MitigationStepDef = {
  slug: string; // e.g. "step-1"
  id: string; // e.g. "step1"
  label: string;
};

type MitigationTableContextValue = {
  // Search params
  month: string | null;
  date: string | null;
  product: string | null;
  county: string;
  regions: string | null;

  // Limitations + AI helper
  limitations: LimitationItem[];
  aiResults: Record<number, any>;
  loadingIndex: number | null;
  errorIndex: Record<number, string>;
  handleExplainLimitation: (item: LimitationItem, index: number) => Promise<void>;

  // Application inputs
  applicationRate: string;
  setApplicationRate: React.Dispatch<React.SetStateAction<string>>;
  soilDepth: string;
  setSoilDepth: React.Dispatch<React.SetStateAction<string>>;

  // Mitigation points
  countyVuln: number;
  setCountyVuln: React.Dispatch<React.SetStateAction<number>>;
  fieldSlope: number;
  setFieldSlope: React.Dispatch<React.SetStateAction<number>>;
  soilPoints: number;
  setSoilPoints: React.Dispatch<React.SetStateAction<number>>;
  tracking: number;
  setTracking: React.Dispatch<React.SetStateAction<number>>;
  techSpecialist: number;
  setTechSpecialist: React.Dispatch<React.SetStateAction<number>>;
  conservationProgram: number;
  setConservationProgram: React.Dispatch<React.SetStateAction<number>>;
  appParams: number;
  setAppParams: React.Dispatch<React.SetStateAction<number>>;
  inField: number;
  setInField: React.Dispatch<React.SetStateAction<number>>;
  fieldAdjacent: number;
  setFieldAdjacent: React.Dispatch<React.SetStateAction<number>>;
  systems: number;
  setSystems: React.Dispatch<React.SetStateAction<number>>;

  mitigationsParam: string;
  totalMitigationPoints: number;
  steps: MitigationStepDef[];
};

const MitigationTableContext = createContext<MitigationTableContextValue | null>(null);

export function useMitigationTable() {
  const ctx = useContext(MitigationTableContext);
  if (!ctx) {
    throw new Error("useMitigationTable must be used within MitigationTableProvider");
  }
  return ctx;
}

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
    `/api/pulas-by-geometry?geometry=${encodeURIComponent(
      regions,
    )}&prod_reg_num=${encodeURIComponent(
      prodRegNum,
    )}&date=${encodeURIComponent(date)}&returnGeometry=false`,
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

export function MitigationTableProvider({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams();

  const month = searchParams.get("month");
  const date = searchParams.get("date");
  const product = searchParams.get("product");
  const county = searchParams.get("county") ?? "";
  const regions = searchParams.get("regions");

  const [limitations, setLimitations] = useState<LimitationItem[]>([]);
  const [aiResults, setAiResults] = useState<Record<number, any>>({});
  const [loadingIndex, setLoadingIndex] = useState<number | null>(null);
  const [errorIndex, setErrorIndex] = useState<Record<number, string>>({});

  const [applicationRate, setApplicationRate] = useState("");
  const [soilDepth, setSoilDepth] = useState("");

  // State for each mitigation step (Table 1)
  const [countyVuln, setCountyVuln] = useState<number>(0);
  const [fieldSlope, setFieldSlope] = useState<number>(0);
  const [soilPoints, setSoilPoints] = useState<number>(0);
  const [tracking, setTracking] = useState<number>(0);
  const [techSpecialist, setTechSpecialist] = useState<number>(0);
  const [conservationProgram, setConservationProgram] = useState<number>(0);

  // Table 2
  const [appParams, setAppParams] = useState<number>(0);
  const [inField, setInField] = useState<number>(0);
  const [fieldAdjacent, setFieldAdjacent] = useState<number>(0);
  const [systems, setSystems] = useState<number>(0);

  const mitigationsParam = useMemo(() => {
    return [
      countyVuln,
      fieldSlope,
      soilPoints,
      tracking,
      techSpecialist,
      conservationProgram,
      appParams,
      inField,
      fieldAdjacent,
      systems,
    ].join(",");
  }, [
    appParams,
    conservationProgram,
    countyVuln,
    fieldAdjacent,
    fieldSlope,
    inField,
    soilPoints,
    systems,
    techSpecialist,
    tracking,
  ]);


  const totalMitigationPoints = useMemo(() => {
    return (
      countyVuln +
      fieldSlope +
      soilPoints +
      tracking +
      techSpecialist +
      conservationProgram +
      appParams +
      inField +
      fieldAdjacent +
      systems
    );
  }, [
    appParams,
    conservationProgram,
    countyVuln,
    fieldAdjacent,
    fieldSlope,
    inField,
    soilPoints,
    systems,
    techSpecialist,
    tracking,
  ]);

  const steps: MitigationStepDef[] = useMemo(
    () => [
      { slug: "step-1", id: "step1", label: "County Pesticide Runoff Vulnerability" },
      { slug: "step-2", id: "step2", label: "Field Slope" },
      { slug: "step-3", id: "step3", label: "Predominantly Sandy Soils" },
      { slug: "step-4", id: "step4", label: "Mitigation Tracking" },
      { slug: "step-5", id: "step5", label: "Technical Specialist" },
      { slug: "step-6", id: "step6", label: "Conservation Program" },
      { slug: "step-7", id: "step7", label: "Application Parameters" },
      { slug: "step-8", id: "step8", label: "In-field Mitigation Measures" },
      { slug: "step-9", id: "step9", label: "Field-Adjacent Mitigation Measures" },
      { slug: "step-10", id: "step10", label: "Systems That Capture Runoff and Discharge" },
    ],
    [],
  );

  const handleExplainLimitation = async (item: LimitationItem, index: number) => {
    setLoadingIndex(index);
    setErrorIndex((prev) => ({ ...prev, [index]: "" }));

    try {
      const useMethodForm = item.umf
        .map(
          (u) =>
            `Use: ${u.use || "N/A"}, Method: ${u.method || "N/A"}, Form: ${u.form || "N/A"}`,
        )
        .join("\n");

      const res = await fetch("/api/mitigation-llm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          blt_text: item.limitation,
          use_method_form: useMethodForm,
          application_details: {
            application_rate: applicationRate,
            soil_incorporation_depth: soilDepth,
          },
        }),
      });

      if (!res.ok) {
        throw new Error(`Request failed with status ${res.status}`);
      }

      const data = await res.json();
      setAiResults((prev) => ({ ...prev, [index]: data }));
    } catch (error: any) {
      setErrorIndex((prev) => ({
        ...prev,
        [index]: error?.message || "Failed to get AI explanation",
      }));
    } finally {
      setLoadingIndex(null);
    }
  };

  useEffect(() => {
    async function load() {
      if (!regions || !product || !date) {
        setLimitations([]);
        return;
      }

      try {
        const parsed = await fetchLimitations(regions, product, date);

        const nextLimitations = Array.isArray(parsed.limitations)
          ? parsed.limitations.filter((item: LimitationItem) =>
              item.limitation.includes(LimitationTypes.t1RunoffErosion),
            )
          : [];

        setLimitations(nextLimitations);
      } catch (error) {
        console.error("Failed to load mitigation limitations:", error);
        setLimitations([]);
      }
    }

    load();
  }, [regions, product, date]);

  const value: MitigationTableContextValue = {
    month,
    date,
    product,
    county,
    regions,

    limitations,
    aiResults,
    loadingIndex,
    errorIndex,
    handleExplainLimitation,

    applicationRate,
    setApplicationRate,
    soilDepth,
    setSoilDepth,

    countyVuln,
    setCountyVuln,
    fieldSlope,
    setFieldSlope,
    soilPoints,
    setSoilPoints,
    tracking,
    setTracking,
    techSpecialist,
    setTechSpecialist,
    conservationProgram,
    setConservationProgram,
    appParams,
    setAppParams,
    inField,
    setInField,
    fieldAdjacent,
    setFieldAdjacent,
    systems,
    setSystems,

    mitigationsParam,
    totalMitigationPoints,
    steps,
  };

  return <MitigationTableContext.Provider value={value}>{children}</MitigationTableContext.Provider>;
}

