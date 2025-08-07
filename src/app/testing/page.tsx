"use client";
import React from "react";
import { useRouter } from "next/navigation";
import BackButton from "../components/BackButton";

export default function page() {
  const testButtonStyling = "m-3 rounded-2xl p-3 border-2";
  const router = useRouter();
  return (
    <div className="flex flex-col">
      <BackButton />
      <button
        className={testButtonStyling}
        onClick={() => router.push("./testing/notification")}
      >
        Notifications
      </button>
      <button
        className={testButtonStyling}
        onClick={() => router.push("./testing/soil")}
      >
        Soil
      </button>
      <button
        className={testButtonStyling}
        onClick={() => router.push("./testing/mitigation-menu")}
      >
        Mitigation Menu
      </button>
    </div>
  );
}
