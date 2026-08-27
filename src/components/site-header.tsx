import { Landmark, ShieldCheck } from "lucide-react";

export function SiteHeader() {
  return (
    <header className="border-b border-white/10 bg-[#101a2e] text-white">
      <div className="mx-auto flex min-h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <a
          href="#top"
          className="flex min-h-11 items-center gap-3 rounded-md font-semibold tracking-[-0.02em] outline-none focus-visible:ring-2 focus-visible:ring-[#f5c84b] focus-visible:ring-offset-2 focus-visible:ring-offset-[#101a2e]"
        >
          <span className="flex size-9 items-center justify-center rounded-md bg-[#f5c84b] text-[#101a2e]">
            <Landmark aria-hidden="true" className="size-5" />
          </span>
          <span>Government Outcome Navigator</span>
        </a>
        <div className="hidden items-center gap-2 text-sm text-slate-300 sm:flex">
          <ShieldCheck aria-hidden="true" className="size-4 text-[#f5c84b]" />
          Evidence-linked guidance for India
        </div>
      </div>
    </header>
  );
}
