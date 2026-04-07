import BackButton from "@/app/components/BackButton";
import Page from "../../utils/pwa";
import React from "react";
import LoadingIndicator from "@/app/components/LoadingIndicator";

export default function page() {
  return (
    <div className="app-content-gutter min-h-screen w-full max-w-4xl mx-auto py-6">
      <BackButton />
      <Page />
    </div>
  );
}
