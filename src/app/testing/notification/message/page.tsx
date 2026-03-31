"use client";
import React from "react";
import { useSearchParams } from "next/navigation";

import { Suspense } from "react";

function MessagePageContent() {
  const searchParams = useSearchParams();
  const title = searchParams.get("title");
  const body = searchParams.get("body");
  return (
    <>
      <div className="app-content-gutter flex flex-col min-h-screen w-full max-w-2xl mx-auto py-8 break-words">
        <h1 className="text-xl font-semibold">Title: {title}</h1>
        <p className="mt-2">Body: {body}</p>
      </div>
    </>
  );
}

export default function Page() {
  return (
    <Suspense>
      <MessagePageContent />
    </Suspense>
  );
}
