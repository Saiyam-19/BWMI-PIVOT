import { ExternalLink, FileCheck2, ShieldAlert } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import type { Claim } from "@/domain";

interface EvidenceListProps {
  readonly claims: readonly Claim[];
  readonly claimIds?: readonly string[];
}

function formatDate(value: string | undefined): string | undefined {
  if (!value) return undefined;
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00Z`));
}

export function EvidenceList({ claims, claimIds }: EvidenceListProps) {
  const visibleClaims = claimIds
    ? claimIds.flatMap((id) => {
        const claim = claims.find((candidate) => candidate.id === id);
        return claim ? [claim] : [];
      })
    : claims;

  if (visibleClaims.length === 0) {
    return (
      <p className="text-sm leading-6 text-slate-600">
        No admitted claim is attached to this part of the task.
      </p>
    );
  }

  return (
    <ul className="grid gap-3" aria-label="Official evidence">
      {visibleClaims.map((claim) => {
        const verifiedDate = formatDate(claim.verifiedOn);
        const verified = claim.status === "verified" && claim.current;
        return (
          <li key={claim.id} className="border-t border-slate-200 pt-3 first:border-t-0 first:pt-0">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <p className="max-w-[65ch] text-sm font-medium leading-6 text-slate-900">
                {claim.statement}
              </p>
              <Badge
                variant="outline"
                className={verified
                  ? "border-emerald-700 bg-emerald-50 text-emerald-800"
                  : "border-red-700 bg-red-50 text-red-800"}
              >
                {verified ? <FileCheck2 aria-hidden="true" /> : <ShieldAlert aria-hidden="true" />}
                {verified && verifiedDate ? `Verified ${verifiedDate}` : claim.status.replaceAll("-", " ")}
              </Badge>
            </div>
            {claim.sources.length > 0 ? (
              <ul className="mt-2 grid gap-2">
                {claim.sources.map((source) => (
                  <li key={source.id} className="text-sm leading-6 text-slate-600">
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="inline-flex min-h-11 items-center gap-1.5 rounded-sm font-medium text-[#1d4f91] underline decoration-[#1d4f91]/35 underline-offset-4 outline-none hover:decoration-[#1d4f91] focus-visible:ring-2 focus-visible:ring-[#2454a6]"
                    >
                      {source.title}
                      <ExternalLink aria-hidden="true" className="size-3.5" />
                    </a>
                    <span className="block text-xs text-slate-500">
                      {source.issuer} · Retrieved {formatDate(source.retrievedOn)}
                      {source.locator ? ` · ${source.locator}` : ""}
                    </span>
                  </li>
                ))}
              </ul>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}
