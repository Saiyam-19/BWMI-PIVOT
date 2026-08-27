"use client";

import { ArrowUpRight, ShieldCheck } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { PublicOutcomeSummary } from "@/server/navigator";

interface OutcomeCardProps {
  readonly outcome: PublicOutcomeSummary;
  readonly domainLabels: Readonly<Record<string, string>>;
  readonly busy: boolean;
  readonly onSelect: (outcomeId: string) => void;
}

export function OutcomeCard({ outcome, domainLabels, busy, onSelect }: OutcomeCardProps) {
  return (
    <Button
      type="button"
      variant="outline"
      disabled={busy}
      onClick={() => onSelect(outcome.id)}
      className="group h-auto min-h-44 w-full items-stretch justify-start whitespace-normal rounded-xl border border-slate-300 bg-white p-0 text-left text-slate-950 shadow-none transition-[border-color,background-color] hover:border-[#2454a6] hover:bg-[#f8fbff] focus-visible:ring-[#2454a6]/30"
    >
      <span className="flex w-full flex-col p-5">
        <span className="flex items-start justify-between gap-4">
          <span className="text-lg font-bold leading-6 tracking-[-0.02em]">{outcome.title}</span>
          <ArrowUpRight aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-[#2454a6] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
        <span className="mt-2 line-clamp-3 text-sm font-normal leading-6 text-slate-600">
          {outcome.description}
        </span>
        <span className="mt-auto flex flex-wrap items-center gap-2 pt-4">
          {outcome.domains.map((domain) => (
            <Badge key={domain} variant="outline" className="border-slate-300 bg-slate-50 text-slate-700">
              {domainLabels[domain] ?? domain}
            </Badge>
          ))}
        </span>
        <span className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-[#2454a6]">
          <ShieldCheck aria-hidden="true" className="size-3.5" />
          Verified sources; unsupported gaps stay visible
        </span>
      </span>
    </Button>
  );
}
