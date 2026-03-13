"use client";

import { Suspense, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import Header from "../components/Header";
import Footer from "../components/Footer";

import ApplicationRateMethod from "./components/ApplicationRateMethod";
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

import { MitigationTableProvider, useMitigationTable } from "./MitigationTableContext";

type StepKey =
  | "step1"
  | "step2"
  | "step3"
  | "step4"
  | "step5"
  | "step6"
  | "step7"
  | "step8"
  | "step9"
  | "step10";

function MitigationTableTabsPageInner() {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState<StepKey>("step1");

  const {
    month,
    product,
    county,
    regions,
    steps,
    limitations,
    aiResults,
    loadingIndex,
    errorIndex,
    handleExplainLimitation,
    applicationRate,
    setApplicationRate,
    soilDepth,
    setSoilDepth,
    mitigationsParam,
    totalMitigationPoints,
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
  } = useMitigationTable();

  const activeIndex = useMemo(() => {
    const idx = steps.findIndex((s) => (s.id as StepKey) === activeStep);
    return idx >= 0 ? idx : 0;
  }, [activeStep, steps]);

  const isLastStep = activeIndex >= steps.length - 1;
  const isFirstStep = activeIndex <= 0;
  const nextStepKey = (steps[Math.min(activeIndex + 1, steps.length - 1)]?.id ?? "step10") as StepKey;
  const prevStepKey = (steps[Math.max(activeIndex - 1, 0)]?.id ?? "step1") as StepKey;

  const stepContent = useMemo(() => {
    switch (activeStep) {
      case "step1":
        return <Step1 county={county} value={countyVuln} setValue={setCountyVuln} />;
      case "step2":
        return <Step2 value={fieldSlope} setValue={setFieldSlope} />;
      case "step3":
        return <Step3 value={soilPoints} setValue={setSoilPoints} />;
      case "step4":
        return <Step4 value={tracking} setValue={setTracking} />;
      case "step5":
        return <Step5 value={techSpecialist} setValue={setTechSpecialist} />;
      case "step6":
        return (
          <Step6 value={conservationProgram} setValue={setConservationProgram} />
        );
      case "step7":
        return <Step7 value={appParams} setValue={setAppParams} />;
      case "step8":
        return <Step8 value={inField} setValue={setInField} />;
      case "step9":
        return <Step9 value={fieldAdjacent} setValue={setFieldAdjacent} />;
      case "step10":
        return <Step10 value={systems} setValue={setSystems} />;
    }
  }, [
    activeStep,
    appParams,
    conservationProgram,
    county,
    countyVuln,
    fieldAdjacent,
    fieldSlope,
    inField,
    setAppParams,
    setConservationProgram,
    setCountyVuln,
    setFieldAdjacent,
    setFieldSlope,
    setInField,
    setSoilPoints,
    setSystems,
    setTechSpecialist,
    setTracking,
    soilPoints,
    systems,
    techSpecialist,
    tracking,
  ]);

  return (
    <div className="flex flex-col">
      <Header />

      <div className="flex">
        {/* Tabs / sidebar */}
        <div className="sticky top-0 gap-8 flex flex-col items-center h-screen bg-[#cee0f5]">
          <div className="mt-18 mb-5 text-[#275c9d] text-2xl font-bold">Steps</div>

          {steps.map((step, idx) => {
            const key = step.id as StepKey;
            const isActive = activeStep === key;

            return (
              <button
                key={step.id}
                type="button"
                onClick={() => setActiveStep(key)}
                className={`flex items-center w-70 h-15 cursor-pointer text-left ${
                  isActive ? "bg-[#a8c1de]" : "bg-[#bed2e8]"
                }`}
              >
                <div className="w-7 h-7 ml-4 rounded-full bg-[#577bb5] text-white flex items-center justify-center font-bold text-lg">
                  {idx + 1}
                </div>
                <div className="leading-tight ml-5 text-[#275c9d] font-semibold">
                  {step.label}
                </div>
              </button>
            );
          })}

          <div className="flex items-center bg-[#cee0f5] w-80 h-15" />
        </div>

        {/* Main content */}
        <div className="bg-white m-20 w-full">
          {/* <p className="mb-10 text-[#275c9d] text-4xl font-bold">
            Mitigation Point Requirements for {product} in {county}
          </p>

          <ApplicationRateMethod
            applicationRate={applicationRate}
            setApplicationRate={setApplicationRate}
            soilDepth={soilDepth}
            setSoilDepth={setSoilDepth}
          /> */}

          {/* {limitations.length > 0 ? (
            limitations.map((item, index) => (
              <div
                key={index}
                className="mb-10 rounded-2xl border border-gray-300 bg-white p-4 shadow-sm"
              >
                <div className="mb-4 flex flex-col gap-4 md:flex-row">
                  <div className="flex-1 rounded-2xl bg-[#f9f9f9] p-4">
                    <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-[#6b7280]">
                      EPA label limitation
                    </p>
                    <div className="ml-2">
                      {item.umf.map((umfEntry, umfIndex) => (
                        <div key={umfIndex} className="mb-2">
                          <p className="text-sm text-black">
                            <span className="font-semibold">Use:</span> {umfEntry.use || "N/A"}
                          </p>
                          <p className="text-sm text-black">
                            <span className="font-semibold">Method:</span>{" "}
                            {umfEntry.method || "N/A"}
                          </p>
                          <p className="text-sm text-black">
                            <span className="font-semibold">Form:</span> {umfEntry.form || "N/A"}
                          </p>
                        </div>
                      ))}
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-black">{item.limitation}</p>
                  </div>

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
                      {loadingIndex === index ? "Analyzing limitation..." : "Generate AI summary"}
                    </button>

                    {errorIndex[index] && (
                      <p className="text-sm text-red-600">{errorIndex[index]}</p>
                    )}

                    {aiResults[index] && (
                      <div className="mt-2 text-sm text-black">
                        <p className="mb-1 font-bold text-[#275c9d]">Plain-language explanation</p>
                        <p className="mb-3 whitespace-pre-line leading-relaxed">
                          {aiResults[index].cleaned_text}
                        </p>

                        {aiResults[index].required_points !== null && (
                          <p className="mb-1 text-md font-bold text-[#275c9d]">
                            Required runoff mitigation points:{" "}
                            <span className="text-black">{aiResults[index].required_points}</span>
                          </p>
                        )}

                        {aiResults[index].points_explanation && (
                          <p className="mb-1 leading-relaxed">{aiResults[index].points_explanation}</p>
                        )}

                        {aiResults[index].notes && (
                          <p className="mt-2 text-xs text-gray-600">{aiResults[index].notes}</p>
                        )}
                      </div>
                    )}

                    {!aiResults[index] && !errorIndex[index] && (
                      <p className="mt-1 text-xs text-[#4b5563]">
                        The AI will rephrase the EPA limitation in simpler language and estimate the
                        runoff mitigation points based on the application rate and soil depth you
                        entered above.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="mb-10 text-black">No limitations found.</p>
          )} */}
         

          {activeStep === "step1" && (
            <>
              <p className="mb-10 text-[#275c9d] text-4xl font-bold">Mitigation Menu</p>
              <p className="mb-5 text-[#275c9d] text-2xl font-bold">
                Runoff & Erosion Mitigation Options
              </p>
              <p className="mb-5 leading-tight text-black text-xl font-bold mr-60">
                Select a combination of measures within the tables to achieve the minimum points
                required by the label or bulletin.
              </p>
              <p className="text-[#275c9d] text-xl font-bold mb-5">What are Mitigation Points?</p>
              <p className="mb-15 leading-tight text-black text-xl mr-60">
                Mitigation points are scores used to show how much action is needed to prevent
                pesticides from polluting water. More points mean less risk and fewer actions required.
              </p>
            </>
          )}

          {/* Tabbed step content */}
          {stepContent}

          <div className="w-full flex justify-center mb-10 mt-10">
            <div className="text-[#375B85] font-bold inline-flex w-fit flex-row items-center gap-3 bg-blue-200 rounded-full px-4 py-2 shadow-md">
              <span>Total Pesticide Mitigation Points</span>
              <div className="bg-white rounded-full w-8 h-8 flex items-center justify-center">
                <span className="text-[#375B85]">{totalMitigationPoints}</span>
              </div>
            </div>
          </div>

          <div className="mb-10 flex items-center gap-4">
            <button
              type="button"
              onClick={() => {if (!isFirstStep) {setActiveStep(prevStepKey)}} }
              className="bg-[#275c9d] text-white font-bold py-3 px-6 rounded-lg hover:bg-[#1f4b7a] transition duration-200"
            >
              Back
            </button>
            {isLastStep ? (
              <Link
                href={`/PrintReport?month=${encodeURIComponent(month || "")}&product=${encodeURIComponent(
                  product || "",
                )}&county=${encodeURIComponent(county || "")}&mitigations=${mitigationsParam}${
                  regions ? `&regions=${encodeURIComponent(regions)}` : ""
                }`}
                className="bg-[#275c9d] text-white font-bold py-3 px-6 rounded-lg hover:bg-[#1f4b7a] transition duration-200"
              >
                Next
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setActiveStep(nextStepKey);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="bg-[#275c9d] text-white font-bold py-3 px-6 rounded-lg hover:bg-[#1f4b7a] transition duration-200"
              >
                Next
              </button>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default function MitigationTablePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MitigationTableProvider>
        <MitigationTableTabsPageInner />
      </MitigationTableProvider>
    </Suspense>
  );
}
