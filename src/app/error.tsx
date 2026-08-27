"use client";

import { AlertTriangle, RotateCcw } from "lucide-react";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";

export default function ErrorPage({
  error,
  reset,
}: Readonly<{ error: Error & { digest?: string }; reset: () => void }>) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="grid min-h-svh place-items-center bg-[#f4f6f8] px-5 py-12">
      <div className="w-full max-w-lg rounded-xl border-2 border-slate-800 bg-white p-7">
        <AlertTriangle aria-hidden="true" className="size-8 text-[#b84545]" />
        <h1 className="mt-5 text-2xl font-bold tracking-[-0.03em]">The navigator could not load this page</h1>
        <p className="mt-3 leading-7 text-slate-600">
          Your roadmap data has not been changed. Try loading the page again.
        </p>
        <Button onClick={reset} className="mt-6 min-h-11 bg-[#172033] text-white shadow-none hover:bg-[#26344f]">
          <RotateCcw aria-hidden="true" />
          Try again
        </Button>
      </div>
    </main>
  );
}
