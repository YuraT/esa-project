"use client";
import React from "react";
import { useRouter } from "next/navigation";
import BackButton from "../components/BackButton";

export default function page() {
  const testButtonStyling = "m-3 rounded-2xl p-3 border-2";
  const router = useRouter();
  return (
    <div className="app-content-gutter flex flex-col min-h-screen w-full max-w-2xl mx-auto py-6">
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
