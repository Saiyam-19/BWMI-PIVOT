"use client";

import { ArrowRight, LoaderCircle } from "lucide-react";
import type { FormEvent } from "react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface NaturalLanguageEntryProps {
  readonly value: string;
  readonly error?: string;
  readonly busy: boolean;
  readonly onChange: (value: string) => void;
  readonly onSubmit: () => void;
}

const examples = [
  "Import Bluetooth headphones to India",
  "Export my first commercial order",
  "Claim a deceased parent's financial assets",
] as const;

export function NaturalLanguageEntry({
  value,
  error,
  busy,
  onChange,
  onSubmit,
}: NaturalLanguageEntryProps) {
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (value.trim()) onSubmit();
  };

  return (
    <form onSubmit={submit} className="mt-8 max-w-3xl">
      <Label htmlFor="outcome-entry" className="text-sm font-semibold text-[#172033]">
        Describe the outcome you need
      </Label>
      <div className="mt-2 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
        <Textarea
          id="outcome-entry"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="For example: I want to export my first commercial order"
          className="min-h-28 resize-y border-slate-400 bg-white px-4 py-3 text-base shadow-none focus-visible:border-[#2454a6] focus-visible:ring-[#2454a6]/20"
          aria-describedby="outcome-entry-help"
          aria-invalid={Boolean(error)}
        />
        <Button
          type="submit"
          disabled={busy || !value.trim()}
          className="min-h-12 bg-[#173f7a] px-5 font-semibold text-white shadow-none hover:bg-[#123464] sm:min-w-48"
        >
          {busy ? <LoaderCircle aria-hidden="true" className="animate-spin" /> : <ArrowRight aria-hidden="true" />}
          {busy ? "Building roadmap" : "Build my roadmap"}
        </Button>
      </div>
      <p id="outcome-entry-help" className="mt-3 text-sm leading-6 text-slate-600">
        Start with the result you want. You do not need to know the ministry or portal.
      </p>
      <div className="mt-3 flex flex-wrap gap-2" aria-label="Outcome examples">
        {examples.map((example) => (
          <Button
            key={example}
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onChange(example)}
            className="h-auto min-h-9 whitespace-normal border-slate-300 bg-white text-left text-slate-700 shadow-none"
          >
            {example}
          </Button>
        ))}
      </div>
      {error ? (
        <Alert className="mt-5 border-[#d39c22] bg-[#fff8df] text-[#4d3908]">
          <AlertTitle>We could not safely match one outcome</AlertTitle>
          <AlertDescription className="text-[#644b0b]">{error}</AlertDescription>
        </Alert>
      ) : null}
    </form>
  );
}
