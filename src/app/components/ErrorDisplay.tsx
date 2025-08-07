"use client";
import React from "react";
import { MdError } from "react-icons/md";

export default function ErrorDisplay({ message }: { message: string }) {
  return (
    <div className="w-[clamp(13rem,50vw,80rem)] h-[clamp(3rem,10vw,20rem)] bg-[#D9D9D9]">
      <div className="flex justify-center items-center w-[clamp(3rem,10vw,40rem)] h-[clamp(3rem,10vw,20rem)] bg-[#FF4848]">
        <MdError className="text-black w-[clamp(1.8rem,3vw,5rem)] h-[clamp(1.8rem,3vw,5rem))]" />
      </div>
    </div>
  );
}
