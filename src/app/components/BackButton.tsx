"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { IoArrowBack } from "react-icons/io5";

export default function BackButton() {
  const router = useRouter();

  return (
    <div className="bg-[#275C9D] p-[clamp(0.5rem,1.5vw,5rem)]">
      <button
        className="flex items-center justify-center w-[clamp(1rem,3vw,7rem)] h-[clamp(1rem,3vw,7rem)] rounded-full bg-[#537BBA] transition-colors hover:bg-[#648fd1]"
        onClick={() => router.back()}
      >
        <IoArrowBack className="text-white w-[clamp(0.5rem,1.5vw,4rem)] h-[clamp(0.5rem,1.5vw,4rem)]" />
      </button>
    </div>
  );
}
