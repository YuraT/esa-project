"use client";
import React from "react";
import { useSearchParams } from "next/navigation";

export default function page() {
  const searchParams = useSearchParams();
  const title = searchParams.get("title");
  const body = searchParams.get("body");
  return (
    <>
      <div className="flex flex-col">
        <h1>Title: {title}</h1>
        <p>Body: {body}</p>
      </div>
    </>
  );
}
