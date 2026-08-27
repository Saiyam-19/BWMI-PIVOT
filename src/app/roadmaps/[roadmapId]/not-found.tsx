import { ArrowLeft, MapPinned } from "lucide-react";

import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";

export default function RoadmapNotFound() {
  return (
    <div className="min-h-screen bg-[#eef1f5]">
      <SiteHeader />
      <main className="mx-auto flex min-h-[calc(100svh-4rem)] max-w-2xl items-center px-4 py-12 sm:px-6">
        <div className="w-full border border-slate-300 bg-white p-7 shadow-[0_10px_28px_rgba(15,23,42,0.06)] sm:p-10">
          <MapPinned aria-hidden="true" className="size-10 text-[#2454a6]" />
          <h1 className="mt-5 text-3xl font-bold tracking-[-0.035em] text-[#101a2e]">
            This roadmap is not available
          </h1>
          <p className="mt-3 max-w-[65ch] leading-7 text-slate-600">
            The local roadmap may have been removed, or the link may be incomplete. Start from a supported outcome to create a new one.
          </p>
          <Button asChild className="mt-6 min-h-11 bg-[#172033] text-white shadow-none hover:bg-[#26344f]">
            <a href="/">
              <ArrowLeft aria-hidden="true" />
              Return to outcomes
            </a>
          </Button>
        </div>
      </main>
    </div>
  );
}
