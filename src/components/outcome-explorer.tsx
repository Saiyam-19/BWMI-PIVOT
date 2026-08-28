"use client";

import { Filter, LoaderCircle, SearchX } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import { NaturalLanguageEntry } from "@/components/natural-language-entry";
import { OutcomeCard } from "@/components/outcome-card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ClientApiError,
  createRoadmap,
  loadOutcomeCatalog,
} from "@/lib/client-api";
import type { OutcomeCatalog } from "@/lib/client-api";

export const CITIZEN_DOMAINS = [
  ["identity-certificates-documents", "Identity, certificates and documents"],
  ["money-tax-pf-benefits", "Money, tax, PF and benefits"],
  ["business-employment-compliance", "Business, employment and compliance"],
  ["vehicles-driving-transport", "Vehicles, driving and transport"],
  ["home-property-local-services", "Home, property and local services"],
  ["family-health-education", "Family, health and education"],
  ["safety-legal-help-complaints", "Safety, legal help and complaints"],
  ["agriculture-rural-services", "Agriculture and rural services"],
] as const;

const domainLabels: Readonly<Record<string, string>> = Object.fromEntries(CITIZEN_DOMAINS);

interface OutcomeExplorerProps {
  readonly onNavigate?: (href: string) => void;
}

function navigateBrowser(href: string): void {
  window.location.assign(href);
}

export function OutcomeExplorer({ onNavigate = navigateBrowser }: OutcomeExplorerProps) {
  const browseHeadingRef = useRef<HTMLHeadingElement>(null);
  const [catalog, setCatalog] = useState<OutcomeCatalog>();
  const [catalogError, setCatalogError] = useState<string>();
  const [selectedDomain, setSelectedDomain] = useState<string>();
  const [intentText, setIntentText] = useState("");
  const [intentError, setIntentError] = useState<string>();
  const [startError, setStartError] = useState<string>();
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;
    loadOutcomeCatalog()
      .then((data) => {
        if (active) setCatalog(data);
      })
      .catch((caught: unknown) => {
        if (!active) return;
        setCatalogError(
          caught instanceof ClientApiError
            ? caught.message
            : "Supported outcomes could not be loaded. Please refresh and try again.",
        );
      });
    return () => {
      active = false;
    };
  }, []);

  const visibleOutcomes = useMemo(() => {
    if (!catalog) return [];
    if (!selectedDomain) return catalog.outcomes;
    return catalog.outcomes.filter((outcome) => outcome.domains.includes(selectedDomain));
  }, [catalog, selectedDomain]);

  const completeRoadmap = (roadmapId: string) => {
    onNavigate(`/roadmaps/${roadmapId}`);
  };

  const begin = async (
    entry:
      | Readonly<{ kind: "natural-language"; text: string }>
      | Readonly<{ kind: "browse"; outcomeId: string }>,
  ) => {
    setBusy(true);
    setIntentError(undefined);
    setStartError(undefined);
    try {
      const created = await createRoadmap(entry);
      completeRoadmap(created.id);
    } catch (caught) {
      if (
        entry.kind === "natural-language" &&
        caught instanceof ClientApiError &&
        caught.code === "unsafe_intent"
      ) {
        setIntentError(
          "Your wording is still here. Add a more specific outcome, or choose one of the outcomes below.",
        );
        browseHeadingRef.current?.focus();
      } else {
        setStartError(
          caught instanceof ClientApiError
            ? caught.message
            : "That roadmap could not be started. Your selection is unchanged; please try again.",
        );
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <main id="top" className="bg-[#f4f6f8] text-[#172033]">
      <section className="border-b border-slate-300 bg-white">
        <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
          <div className="max-w-4xl">
            <h1 className="max-w-3xl text-balance text-4xl font-black leading-[1.05] tracking-[-0.04em] text-[#101a2e] sm:text-5xl lg:text-6xl">
              Tell us the outcome; get every dependency and portal journey.
            </h1>
            <p className="mt-5 max-w-2xl text-pretty text-lg leading-8 text-slate-600">
              Turn one real-world goal into an evidence-linked roadmap across the authorities, institutions, prerequisites, and proofs involved.
            </p>
          </div>
          <NaturalLanguageEntry
            value={intentText}
            busy={busy}
            {...(intentError ? { error: intentError } : {})}
            onChange={(value) => {
              setIntentText(value);
              setIntentError(undefined);
            }}
            onSubmit={() => begin({ kind: "natural-language", text: intentText.trim() })}
          />
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="flex flex-col gap-4 border-b border-slate-300 pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2
              ref={browseHeadingRef}
              tabIndex={-1}
              className="rounded-sm text-2xl font-bold tracking-[-0.03em] outline-none focus-visible:ring-2 focus-visible:ring-[#2454a6]"
            >
              Browse supported outcomes
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Begin from a familiar domain. Authority and ministry labels come later, inside the roadmap.
            </p>
          </div>
          <p className="text-sm font-medium text-slate-500" aria-live="polite">
            {catalog ? `${visibleOutcomes.length} of ${catalog.outcomes.length} outcomes` : "Loading outcomes"}
          </p>
        </div>

        <div className="mt-6">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <Filter aria-hidden="true" className="size-4" />
            Filter by domain
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button
              type="button"
              size="sm"
              variant={!selectedDomain ? "default" : "outline"}
              aria-pressed={!selectedDomain}
              onClick={() => setSelectedDomain(undefined)}
              className="min-h-10 shadow-none"
            >
              All supported
            </Button>
            {CITIZEN_DOMAINS.map(([domain, label]) => (
              <Button
                key={domain}
                type="button"
                size="sm"
                variant={selectedDomain === domain ? "default" : "outline"}
                aria-pressed={selectedDomain === domain}
                data-testid="domain-filter"
                onClick={() => setSelectedDomain(domain)}
                className="h-auto min-h-10 whitespace-normal border-slate-300 bg-white text-left shadow-none aria-pressed:bg-[#172033] aria-pressed:text-white"
              >
                {label}
              </Button>
            ))}
          </div>
        </div>

        {startError ? (
          <Alert className="mt-6 border-[#b84545] bg-[#fff0f0] text-[#722f2f]">
            <AlertTitle>Roadmap not started</AlertTitle>
            <AlertDescription className="text-[#722f2f]">{startError}</AlertDescription>
          </Alert>
        ) : null}

        {catalogError ? (
          <Alert className="mt-8 border-[#b84545] bg-[#fff0f0] text-[#722f2f]">
            <AlertTitle>Outcomes unavailable</AlertTitle>
            <AlertDescription className="text-[#722f2f]">{catalogError}</AlertDescription>
          </Alert>
        ) : !catalog ? (
          <div className="mt-8 grid gap-4 md:grid-cols-2" aria-label="Loading supported outcomes">
            {Array.from({ length: 4 }, (_, index) => (
              <Skeleton key={index} className="h-44 rounded-xl bg-slate-200" />
            ))}
          </div>
        ) : visibleOutcomes.length === 0 ? (
          <div className="mt-8 flex min-h-52 flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-white px-6 text-center">
            <SearchX aria-hidden="true" className="size-7 text-slate-500" />
            <h3 className="mt-3 font-semibold">No launch outcome is available in this domain yet</h3>
            <p className="mt-2 max-w-md text-sm leading-6 text-slate-600">
              Choose another domain or describe your goal above. The navigator will not pretend unsupported coverage exists.
            </p>
          </div>
        ) : (
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {visibleOutcomes.map((outcome) => (
              <OutcomeCard
                key={outcome.id}
                outcome={outcome}
                domainLabels={domainLabels}
                busy={busy}
                onSelect={(outcomeId) => begin({ kind: "browse", outcomeId })}
              />
            ))}
          </div>
        )}

        {busy ? (
          <p className="mt-5 flex items-center gap-2 text-sm font-medium text-slate-600" role="status">
            <LoaderCircle aria-hidden="true" className="size-4 animate-spin" />
            Creating your private roadmap…
          </p>
        ) : null}
      </section>

    </main>
  );
}
