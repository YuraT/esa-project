import BackButton from "@/app/components/BackButton";
import Page from "../../utils/pwa";
import React from "react";
import LoadingIndicator from "@/app/components/LoadingIndicator";

export default function page() {
  return (
    <div>
      <BackButton />
      <Page />
      <LoadingIndicator />
    </div>
  );
}
