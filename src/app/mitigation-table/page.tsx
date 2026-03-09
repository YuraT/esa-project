"use client";

import { useState, Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

import { LimitationTypes } from "@/lib/limitation-types";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Step1 from "./components/Step1";
import Step2 from "./components/Step2";
import Step3 from "./components/Step3";
import Step4 from "./components/Step4";
import Step5 from "./components/Step5";
import Step6 from "./components/Step6";
import Step7 from "./components/Step7";
import Step8 from "./components/Step8";
import Step9 from "./components/Step9";
import Step10 from "./components/Step10";
import ApplicationRateMethod from "./components/ApplicationRateMethod";

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

function MitigationTableContent() {
  const [limitations, setLimitations] = useState<LimitationItem[]>([]);

  const [aiResults, setAiResults] = useState<Record<number, any>>({});
  const [loadingIndex, setLoadingIndex] = useState<number | null>(null);
  const [errorIndex, setErrorIndex] = useState<Record<number, string>>({});

  // Application rate & Method inputs
  const [applicationRate, setApplicationRate] = useState("");
  const [soilDepth, setSoilDepth] = useState("");

  // State for each mitigation step (Table 1)
  const [countyVuln, setCountyVuln] = useState<number>(0); // 6, 3, 2, 0
  const [fieldSlope, setFieldSlope] = useState<number>(0); // 3 or 0
  const [soilPoints, setSoilPoints] = useState<number>(0); // 2, 3, or 0
  const [tracking, setTracking] = useState<number>(0); // 1 or 0
  const [techSpecialist, setTechSpecialist] = useState<number>(0); // 1 or 2 or 0
  const [conservationProgram, setConservationProgram] = useState<number>(0); // 1 or 2 or 0

  // Table 2
  const [appParams, setAppParams] = useState<number>(0);
  const [inField, setInField] = useState<number>(0);
  const [fieldAdjacent, setfieldAdjacent] = useState<number>(0);
  const [systems, setSystems] = useState<number>(0);

  const searchParams = useSearchParams();

  const month = searchParams.get("month");
  const product = searchParams.get("product");
  const county = searchParams.get("county") ?? "";
  const regions = searchParams.get("regions");

  // Build mitigations param
  const mitigations = [
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

  const totalMitigationPoints =
    countyVuln +
    fieldSlope +
    soilPoints +
    tracking +
    techSpecialist +
    conservationProgram +
    appParams +
    inField +
    fieldAdjacent +
    systems;

  const scrollToStep = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const handleExplainLimitation = async (
    item: LimitationItem,
    index: number,
  ) => {
    setLoadingIndex(index);
    setErrorIndex((prev) => ({ ...prev, [index]: "" }));

    try {
      const useMethodForm = item.umf
        .map(
          (u) =>
            `Use: ${u.use || "N/A"}, Method: ${u.method || "N/A"}, Form: ${
              u.form || "N/A"
            }`,
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
    const stored = localStorage.getItem("esa_limitations");
    if (stored) {
      const parsed = JSON.parse(stored).limitations;
      setLimitations(
        Array.isArray(parsed)
          ? parsed.filter((item) =>
            item.limitation.includes(LimitationTypes.t1RunoffErosion),
          )
          : [parsed],
      );
    }
  }, []);

  // Single source-of-truth for steps. Use a render function to avoid reusing JSX instances.
  const steps = [
    {
      id: "step1",
      label: "County Pesticide Runoff Vulnerability",
      render: () => (
        <Step1 county={county} value={countyVuln} setValue={setCountyVuln} />
      ),
    },
    {
      id: "step2",
      label: "Field Slope",
      render: () => <Step2 value={fieldSlope} setValue={setFieldSlope} />,
    },
    {
      id: "step3",
      label: "Predominantly Sandy Soils",
      render: () => <Step3 value={soilPoints} setValue={setSoilPoints} />,
    },
    {
      id: "step4",
      label: "Mitigation Tracking",
      render: () => <Step4 value={tracking} setValue={setTracking} />,
    },
    {
      id: "step5",
      label: "Technical Specialist",
      render: () => (
        <Step5 value={techSpecialist} setValue={setTechSpecialist} />
      ),
    },
    {
      id: "step6",
      label: "Conservation Program",
      render: () => (
        <Step6 value={conservationProgram} setValue={setConservationProgram} />
      ),
    },
    {
      id: "step7",
      label: "Application Parameters",
      render: () => <Step7 value={appParams} setValue={setAppParams} />,
    },
    {
      id: "step8",
      label: "In-field Mitigation Measures",
      render: () => <Step8 value={inField} setValue={setInField} />,
    },
    {
      id: "step9",
      label: "Field-Adjacent Mitigation Measures",
      render: () => <Step9 value={fieldAdjacent} setValue={setfieldAdjacent} />,
    },
    {
      id: "step10",
      label: "Systems That Capture Runoff and Discharge",
      render: () => <Step10 value={systems} setValue={setSystems} />,
    },
  ];

  return (
    <>
      <div className="flex">
        <div className="sticky top-0 gap-8 flex flex-col items-center h-screen bg-[#cee0f5]">
          <div className="mt-18 mb-5 text-[#275c9d] text-2xl font-bold">
            Steps
          </div>

          {steps.map((step, idx) => (
            <div
              key={step.id}
              className="flex items-center bg-[#bed2e8] w-70 h-15 cursor-pointer"
              onClick={() => scrollToStep(step.id)}
            >
              <div className="w-7 h-7 ml-4 rounded-full bg-[#577bb5] text-white flex items-center justify-center font-bold text-lg">
                {idx + 1}
              </div>
              <div className="leading-tight ml-5 text-[#275c9d] font-semibold">
                {step.label}
              </div>
            </div>
          ))}

          <div className="flex items-center bg-[#cee0f5] w-80 h-15"></div>
        </div>

        <div className="bg-white m-20">
          {/* Display limitation with mitigations */}
          <p className="mb-10 text-[#275c9d] text-4xl font-bold ">
            Mitigation Point Requirements for {product} in {county}
          </p>

          <ApplicationRateMethod
            applicationRate={applicationRate}
            setApplicationRate={setApplicationRate}
            soilDepth={soilDepth}
            setSoilDepth={setSoilDepth}
          />
          {limitations.length > 0 ? (
            limitations.map((item, index) => (
              <div
                key={index}
                className="mb-10 rounded-2xl border border-gray-300 bg-white p-4 shadow-sm"
              >
                <div className="mb-4 flex flex-col gap-4 md:flex-row">
                  {/* Left: EPA / BLT section */}
                  <div className="flex-1 rounded-2xl bg-[#f9f9f9] p-4">
                    <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-[#6b7280]">
                      EPA label limitation
                    </p>
                    <div className="ml-2">
                      {item.umf.map((umfEntry, umfIndex) => (
                        <div key={umfIndex} className="mb-2">
                          <p className="text-sm text-black">
                            <span className="font-semibold">Use:</span>{" "}
                            {umfEntry.use || "N/A"}
                          </p>
                          <p className="text-sm text-black">
                            <span className="font-semibold">Method:</span>{" "}
                            {umfEntry.method || "N/A"}
                          </p>
                          <p className="text-sm text-black">
                            <span className="font-semibold">Form:</span>{" "}
                            {umfEntry.form || "N/A"}
                          </p>
                        </div>
                      ))}
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-black">
                      {item.limitation}
                    </p>
                  </div>

                  {/* Right: AI helper section */}
                  <div className="flex-1 rounded-2xl bg-[#eef3fb] p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <p className="text-sm font-semibold uppercase tracking-wide text-[#275c9d]">
                        AI assistant (draft guidance)
                      </p>
                      <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-[#6b7280]">
                        Uses your inputs above
                      </span>
                    </div>

                    <button
                      type="button"
                      className="mb-3 rounded-lg bg-[#275c9d] px-4 py-2 text-sm font-bold text-white hover:bg-[#1f4b7a] disabled:opacity-60"
                      onClick={() => handleExplainLimitation(item, index)}
                      disabled={loadingIndex === index}
                    >
                      {loadingIndex === index
                        ? "Analyzing limitation..."
                        : "Generate AI summary"}
                    </button>

                    {errorIndex[index] && (
                      <p className="text-sm text-red-600">
                        {errorIndex[index]}
                      </p>
                    )}

                    {aiResults[index] && (
                      <div className="mt-2 text-sm text-black">
                        <p className="mb-1 font-bold text-[#275c9d]">
                          Plain-language explanation
                        </p>
                        <p className="mb-3 whitespace-pre-line leading-relaxed">
                          {aiResults[index].cleaned_text}
                        </p>

                        {aiResults[index].required_points !== null && (
                          <p className="mb-1 text-md font-bold text-[#275c9d]">
                            Required runoff mitigation points:{" "}
                            <span className="text-black">
                              {aiResults[index].required_points}
                            </span>
                          </p>
                        )}

                        {aiResults[index].points_explanation && (
                          <p className="mb-1 leading-relaxed">
                            {aiResults[index].points_explanation}
                          </p>
                        )}

                        {aiResults[index].notes && (
                          <p className="mt-2 text-xs text-gray-600">
                            {aiResults[index].notes}
                          </p>
                        )}
                      </div>
                    )}

                    {!aiResults[index] && !errorIndex[index] && (
                      <p className="mt-1 text-xs text-[#4b5563]">
                        The AI will rephrase the EPA limitation in simpler
                        language and estimate the runoff mitigation points based
                        on the application rate and soil depth you entered
                        above.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="mb-10 text-black">No limitations found.</p>
          )}

          <p className="mb-10 text-[#275c9d] text-4xl font-bold ">
            Mitigation Menu
          </p>
          <p className="mb-5 text-[#275c9d] text-2xl font-bold ">
            Runoff & Erosion Mitigation Options
          </p>
          <p className="mb-5 leading-tight text-black text-xl font-bold mr-60">
            Select a combination of measures within the tables to achieve the
            minimum points required by the label or bulletin.
          </p>
          <p className="text-[#275c9d] text-xl font-bold mb-5 ">
            What are Mitigation Points?
          </p>
          <p className="mb-15 leading-tight text-black text-xl mr-60">
            Mitigation points are scores used to show how much action is needed
            to prevent pesticides from polluting water. More points mean less
            risk and fewer actions required.
          </p>

          {steps.map((s) => (
            <div id={s.id} key={s.id}>
              {s.render()}
            </div>
          ))}

          <div className="w-full flex justify-center mb-10">
            <div className="text-[#375B85] font-bold inline-flex w-fit flex-row items-center gap-3 bg-blue-200 rounded-full px-4 py-2 shadow-md">
              <span>Total Pesticide Mitigation Points</span>
              <div className="bg-white rounded-full w-8 h-8 flex items-center justify-center">
                <span className="text-[#375B85]">
                  {totalMitigationPoints}
                </span>
              </div>
            </div>
          </div>

          <div className="mb-10">
            <Link
              href={`/PrintReport?month=${encodeURIComponent(
                month || "",
              )}&product=${encodeURIComponent(
                product || "",
              )}&county=${encodeURIComponent(
                county || "",
              )}&mitigations=${mitigations}${
                regions ? `&regions=${encodeURIComponent(regions)}` : ""
                }`}
              className="ml-220 bg-[#275c9d] text-white font-bold py-3 px-6 rounded-lg hover:bg-[#1f4b7a] transition duration-200"
            >
              Next
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default function MitigationTable() {
  return (
    <div className="flex flex-col">
      <Header />
      <Suspense fallback={<div>Loading...</div>}>
        <MitigationTableContent />
      </Suspense>
      <Footer />
    </div>
  );
}
