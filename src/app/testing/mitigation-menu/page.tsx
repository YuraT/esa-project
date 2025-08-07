"use client";
import BackButton from "@/app/components/BackButton";
import SideBar from "@/app/components/SideBar";
import React, { useState } from "react";

export default function page() {
  const steps = [
    "County Pesticide Runoff Vulnerability",
    "Field Slope",
    "Predominantly Sandy Soils",
    "Mitigation Tracking",
    "Working With a Technical Specialist",
    "Conservation Program Participation",
  ];
  const [currentStep, setCurrentStep] = useState(1);

  return (
    <div>
      <BackButton />
      <div className="flex">
        <SideBar
          currentStep={currentStep}
          steps={steps}
          onStepClick={setCurrentStep}
        />

        <div className="w-3/4 p-10 bg-white">
          <h1 className="text-3xl font-bold text-[#375B85] mb-4">
            Mitigation Menu
          </h1>
          <h2 className="text-xl font-semibold text-[#375B85] mb-2">
            Runoff & Erosion Mitigation Options
          </h2>
          <p className="mb-6 text-gray-700">
            Select a combination of measures within the tables to achieve the
            minimum points required by the label or bulletin.
          </p>

          <div className="mb-6">
            <h3 className="text-lg font-bold text-[#375B85]">
              What are Mitigation Points?
            </h3>
            <p className="text-gray-700">
              Mitigation points are scores used to show how much action is
              needed to prevent pesticides from polluting water. More points
              mean less risk and fewer actions required.
            </p>
          </div>

          {currentStep === 1 && (
            <div className="bg-gray-100 p-6 rounded-lg shadow">
              <h4 className="text-blue-900 font-bold mb-2">
                County Pesticide Runoff Vulnerability
              </h4>
              <p className="text-gray-700 mb-4">
                Select your county to see where it lies on the{" "}
                <strong>Pesticide Runoff Vulnerability</strong> Scale.
              </p>
              <div className="bg-blue-200 w-full h-48 flex items-center justify-center mb-4">
                {/* placeholder for map */}
                <span className="text-white">map image</span>
              </div>
              <div className="mb-2">
                <select className="w-full p-2 border border-gray-300 rounded">
                  <option>Select County...</option>
                </select>
              </div>
              <div className="flex justify-between text-sm mt-2">
                <span className="bg-green-200 px-2 py-1 rounded">Very Low</span>
                <span className="bg-yellow-200 px-2 py-1 rounded">Low</span>
                <span className="bg-orange-200 px-2 py-1 rounded">Medium</span>
                <span className="bg-red-300 px-2 py-1 rounded">High</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
