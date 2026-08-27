"use client";

import { CircleHelp, LoaderCircle } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ClientApiError, updateRoadmapAnswers } from "@/lib/client-api";
import type { ClientRoadmap } from "@/lib/client-api";
import { cn } from "@/lib/utils";

type IntakeChoice = boolean | "unknown";

interface IntakeDialogProps {
  readonly open: boolean;
  readonly roadmap: ClientRoadmap;
  readonly onOpenChange: (open: boolean) => void;
  readonly onComplete: (roadmapId: string) => void;
}

const choiceOptions: readonly Readonly<{ value: IntakeChoice; label: string }>[] = [
  { value: true, label: "Yes" },
  { value: false, label: "No" },
  { value: "unknown", label: "I don't know yet" },
];

export function IntakeDialog({
  open,
  roadmap: initialRoadmap,
  onOpenChange,
  onComplete,
}: IntakeDialogProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [roadmap, setRoadmap] = useState(initialRoadmap);
  const [choices, setChoices] = useState<Readonly<Record<string, IntakeChoice>>>({});
  const [skippedFacts, setSkippedFacts] = useState<ReadonlySet<string>>(new Set());
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string>();

  useEffect(() => {
    setRoadmap(initialRoadmap);
    setChoices({});
    setSkippedFacts(new Set());
    setError(undefined);
  }, [initialRoadmap]);

  const allChosen = useMemo(
    () => roadmap.questions.every((question) => choices[question.factKey] !== undefined),
    [choices, roadmap.questions],
  );
  const allUnknown = allChosen && roadmap.questions.every(
    (question) => choices[question.factKey] === "unknown",
  );

  const continueIntake = async () => {
    if (!allChosen) {
      setError("Choose Yes, No, or I don't know yet for every question before continuing.");
      return;
    }

    const nextSkipped = new Set(skippedFacts);
    const answers: Record<string, boolean> = {};
    for (const question of roadmap.questions) {
      const choice = choices[question.factKey];
      if (choice === "unknown") nextSkipped.add(question.factKey);
      else if (typeof choice === "boolean") answers[question.factKey] = choice;
    }

    if (Object.keys(answers).length === 0) {
      onComplete(roadmap.id);
      return;
    }

    setBusy(true);
    setError(undefined);
    try {
      const updated = await updateRoadmapAnswers(roadmap.id, answers);
      const nextQuestions = updated.questions.filter(
        (question) => !nextSkipped.has(question.factKey),
      );
      if (nextQuestions.length === 0) {
        onComplete(updated.id);
        return;
      }
      setRoadmap({ ...updated, questions: nextQuestions });
      setSkippedFacts(nextSkipped);
      setChoices({});
    } catch (caught) {
      setError(
        caught instanceof ClientApiError
          ? caught.message
          : "Your answers could not be saved. Nothing was lost; please try again.",
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        ref={contentRef}
        onOpenAutoFocus={(event) => {
          event.preventDefault();
          const content = contentRef.current;
          if (!content) return;
          content.scrollTop = 0;
          content.focus({ preventScroll: true });
        }}
        className="max-h-[92svh] overflow-y-auto border-slate-300 p-0 sm:max-w-2xl"
      >
        <DialogHeader className="border-b border-slate-200 bg-[#f7f8fa] px-6 py-5 text-left">
          <DialogTitle className="pr-8 text-xl tracking-[-0.02em]">
            A few answers will shape this roadmap
          </DialogTitle>
          <DialogDescription className="max-w-xl leading-6 text-slate-600">
            Answer only what you know for {roadmap.outcomeTitle}. Unknown answers stay visible and keep affected guidance fail-closed.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 px-6 py-5">
          {roadmap.questions.map((question) => (
            <fieldset key={question.id} className="min-w-0 border-b border-slate-200 pb-6 last:border-0 last:pb-0">
              <legend className="text-base font-semibold leading-6 text-[#172033]">
                {question.prompt}
              </legend>
              <p className="mt-2 flex gap-2 text-sm leading-6 text-slate-600">
                <CircleHelp aria-hidden="true" className="mt-1 size-4 shrink-0 text-[#2454a6]" />
                <span>{question.reason}</span>
              </p>
              <div className="mt-4 grid gap-2 sm:grid-cols-3">
                {choiceOptions.map((option) => {
                  const selected = choices[question.factKey] === option.value;
                  return (
                    <Button
                      key={String(option.value)}
                      type="button"
                      variant="outline"
                      aria-pressed={selected}
                      onClick={() => {
                        setChoices((current) => ({
                          ...current,
                          [question.factKey]: option.value,
                        }));
                        setError(undefined);
                      }}
                      className={cn(
                        "min-h-11 border-slate-300 bg-white shadow-none",
                        selected && "border-[#2454a6] bg-[#eaf2ff] text-[#173f7a] ring-2 ring-[#2454a6]/30",
                      )}
                    >
                      {option.label}
                    </Button>
                  );
                })}
              </div>
            </fieldset>
          ))}

          {error ? (
            <Alert className="border-[#b84545] bg-[#fff0f0] text-[#722f2f]">
              <AlertDescription className="text-[#722f2f]">{error}</AlertDescription>
            </Alert>
          ) : null}
        </div>

        <DialogFooter className="border-t border-slate-200 bg-white px-6 py-4 sm:items-center sm:justify-between">
          <p className="text-xs leading-5 text-slate-500">
            These facts remain private to this local roadmap.
          </p>
          <Button
            type="button"
            onClick={continueIntake}
            disabled={busy}
            className="min-h-11 bg-[#172033] px-5 text-white shadow-none hover:bg-[#26344f]"
          >
            {busy ? <LoaderCircle aria-hidden="true" className="animate-spin" /> : null}
            {busy ? "Updating roadmap" : allUnknown ? "Open my roadmap" : "Continue"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
