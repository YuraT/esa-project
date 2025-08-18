"use client";
import React from "react";

interface SidebarProps {
  currentStep: number;
  steps: string[];
  onStepClickAction: (step: number) => void;
}

export default function Sidebar({
  currentStep,
  steps,
  onStepClickAction,
}: SidebarProps) {
  return (
    <div className="flex items-center flex-col w-[clamp(5rem,20vw,40rem)] min-h-screen bg-[#DAE8F8]">
      <div className="p-[clamp(1rem,3vw,5rem)]">
        <p className="text-[clamp(0.5rem,2vw,3rem)] text-[#375B85] font-bold">
          Step {currentStep} of {steps.length}
        </p>
      </div>
      <div className="pt-[clamp(0.5rem,1vw,2rem]">
        <ol>
          {steps.map((step, index) => (
            <li
              key={index}
              onClick={() => onStepClickAction(index + 1)}
              className={`cursor-pointer text-[#375B85] rounded-lg ${
                currentStep === index + 1
                  ? "bg-[#bacfe8]"
                  : "hover:bg-[#CEE0F5]"
              }`}
            >
              <div className="flex items-center mb-[clamp(0.4rem,2vw,3rem)]">
                <div className="flex items-center justify-center bg-[#537BBA] text-white text-[clamp(0.3rem,1.3vw,3rem)] font-extrabold w-[clamp(0.6rem,3vw,3rem)] h-[clamp(0.6rem,3vw,3rem)] rounded-full">
                  {index + 1}
                </div>
                <div className="flex items-center font-bold w-[clamp(3.9rem,15vw,30rem)] h-[clamp(1rem,8vw,11rem)] p-[clamp(0.3rem,1vw,3rem)] text-[clamp(0.3rem,1.3vw,2rem)]">
                  {step}
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
