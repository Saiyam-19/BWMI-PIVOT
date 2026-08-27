import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main className="min-h-svh bg-[#f4f6f8]" aria-busy="true" aria-label="Loading Government Outcome Navigator">
      <div className="h-16 bg-[#101a2e]" />
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <Skeleton className="h-14 max-w-3xl bg-slate-200" />
        <Skeleton className="mt-5 h-7 max-w-2xl bg-slate-200" />
        <Skeleton className="mt-8 h-28 max-w-3xl bg-slate-200" />
        <div className="mt-16 grid gap-4 md:grid-cols-2">
          <Skeleton className="h-44 bg-slate-200" />
          <Skeleton className="h-44 bg-slate-200" />
        </div>
      </div>
    </main>
  );
}
