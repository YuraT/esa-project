"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { IoArrowBack } from "react-icons/io5";

function BackButton() {
  const router = useRouter();

  return (
    <div>
      <button
        className="flex items-center justify-center w-12 h-12 rounded-full bg-[#537BBA] transition-colors hover:bg-[#648fd1]"
        onClick={() => router.back()}
      >
        <IoArrowBack className="text-white w-6 h-6" />
      </button>
    </div>
  );
}

export default BackButton;
