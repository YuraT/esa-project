"use client";

import dynamic from "next/dynamic";

// Dynamically import Map to avoid SSR issues
const CountyMap = dynamic(() => import("../Map"), {
  ssr: false,
});

export default function Page() {
  return (
    <main style={{ backgroundColor: "#0077be", minHeight: "100vh" }}>
      <h1 style={{ color: "white", padding: "1rem" }}>
        Interactive County Map
      </h1>
      <CountyMap />
    </main>
  );
}
