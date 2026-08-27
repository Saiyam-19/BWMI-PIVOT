import { SiteHeader } from "@/components/site-header";
import { Skeleton } from "@/components/ui/skeleton";

export default function RoadmapLoading() {
  return (
    <div className="min-h-screen bg-[#eef1f5]">
      <SiteHeader />
      <main className="mx-auto w-full max-w-[96rem] px-4 py-8 sm:px-6 lg:px-8" aria-label="Loading roadmap">
        <div className="border border-slate-300 bg-white p-6">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="mt-5 h-10 w-full max-w-3xl" />
          <Skeleton className="mt-4 h-5 w-full max-w-xl" />
        </div>
        <Skeleton className="mt-5 h-[65svh] min-h-[38rem] w-full border border-slate-300" />
      </main>
    </div>
  );
}
