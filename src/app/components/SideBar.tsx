"use client";
import React from "react";

interface SidebarProps {
  currentStep: number;
  steps: string[];
  onStepClick: (step: number) => void;
}

export default function Sidebar({
  currentStep,
  steps,
  onStepClick,
}: SidebarProps) {
  return (
    <div className="w-60 bg-blue-50 p-4">
      <div className="items-center">
        <p className="text-sm text-gray-700 mb-4">
          Step {currentStep} of {steps.length}
        </p>
      </div>
      <ol className="space-y-2">
        {steps.map((step, index) => (
          <li
            key={index}
            onClick={() => onStepClick(index + 1)}
            className={`px-3 py-2 rounded-md cursor-pointer ${
              currentStep === index + 1
                ? "bg-blue-100 text-blue-700 font-semibold"
                : "hover:bg-blue-100 text-gray-700"
            }`}
          >
            <span className="mr-2 font-bold">{index + 1}</span>
            {step}
          </li>
        ))}
      </ol>
    </div>
  );
}
