"use client";

import { CircleHelp, FileWarning, LoaderCircle, SlidersHorizontal } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import type { AnswerValue, Roadmap, RoadmapQuestion } from "@/domain";
import { ClientApiError, updateRoadmapAnswers } from "@/lib/client-api";
import { cn } from "@/lib/utils";

interface RoadmapPersonalizationProps {
  readonly roadmap: Roadmap;
  readonly onRoadmapUpdated: (roadmap: Roadmap) => void;
}

function hasAnswer(question: RoadmapQuestion, value: AnswerValue | undefined): boolean {
  if (question.answerType === "multi_select") return Array.isArray(value) && value.length > 0;
  if (question.answerType === "number") return typeof value === "number" && Number.isFinite(value);
  if (question.answerType === "boolean") return typeof value === "boolean";
  if (question.answerType === "document" || question.answerType === "unknown") return false;
  return typeof value === "string" && value.trim().length > 0;
}

function QuestionControl({
  question,
  value,
  onChange,
}: Readonly<{
  question: RoadmapQuestion;
  value: AnswerValue | undefined;
  onChange: (value: AnswerValue) => void;
}>) {
  if (question.answerType === "boolean") {
    return (
      <div className="grid grid-cols-2 gap-2">
        {([true, false] as const).map((choice) => (
          <Button
            key={String(choice)}
            type="button"
            variant="outline"
            aria-pressed={value === choice}
            onClick={() => onChange(choice)}
            className={cn(
              "min-h-11 border-slate-300 shadow-none",
              value === choice && "border-[#2454a6] bg-[#eaf2ff] text-[#173f7a] ring-2 ring-[#2454a6]/25",
            )}
          >
            {choice ? "Yes" : "No"}
          </Button>
        ))}
      </div>
    );
  }

  if (question.answerType === "single_select") {
    return (
      <Select
        value={typeof value === "string" ? value : ""}
        onValueChange={(nextValue) => onChange(nextValue)}
      >
        <SelectTrigger aria-label={question.prompt} className="h-11 w-full border-slate-300 bg-white shadow-none">
          <SelectValue placeholder="Choose the answer that matches your case" />
        </SelectTrigger>
        <SelectContent position="popper" className="max-w-[min(34rem,calc(100vw-2rem))]">
          {question.options.map((option) => (
            <SelectItem key={option} value={option}>{option}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }

  if (question.answerType === "multi_select") {
    const selected = Array.isArray(value) ? value : [];
    return (
      <div className="grid gap-2">
        {question.options.map((option) => {
          const active = selected.includes(option);
          return (
            <Button
              key={option}
              type="button"
              variant="outline"
              aria-pressed={active}
              onClick={() => onChange(active
                ? selected.filter((item) => item !== option)
                : [...selected, option])}
              className={cn(
                "h-auto min-h-11 justify-start whitespace-normal border-slate-300 px-3 py-2 text-left shadow-none",
                active && "border-[#2454a6] bg-[#eaf2ff] text-[#173f7a] ring-2 ring-[#2454a6]/25",
              )}
            >
              {option}
            </Button>
          );
        })}
      </div>
    );
  }

  if (question.answerType === "number") {
    return (
      <Input
        aria-label={question.prompt}
        type="number"
        inputMode="decimal"
        value={typeof value === "number" ? value : ""}
        onChange={(event) => {
          if (event.target.value !== "") onChange(Number(event.target.value));
        }}
        className="h-11 border-slate-300 bg-white shadow-none"
      />
    );
  }

  if (question.answerType === "date") {
    return (
      <Input
        aria-label={question.prompt}
        type="date"
        value={typeof value === "string" ? value : ""}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 border-slate-300 bg-white shadow-none"
      />
    );
  }

  return (
    <Textarea
      aria-label={question.prompt}
      value={typeof value === "string" ? value : ""}
      onChange={(event) => onChange(event.target.value)}
      placeholder="Enter only the non-sensitive fact needed to shape this roadmap"
      className="min-h-28 border-slate-300 bg-white shadow-none"
    />
  );
}

export function RoadmapPersonalization({
  roadmap,
  onRoadmapUpdated,
}: RoadmapPersonalizationProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<AnswerValue>();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string>();
  const [revisitFactKey, setRevisitFactKey] = useState<string>();
  const pendingQuestions = useMemo(
    () => roadmap.questions.filter(
      (candidate) => !Object.prototype.hasOwnProperty.call(roadmap.answers, candidate.factKey),
    ),
    [roadmap.answers, roadmap.questions],
  );
  const unresolvedAnsweredQuestions = useMemo(
    () => roadmap.questions.filter((candidate) =>
      Object.prototype.hasOwnProperty.call(roadmap.answers, candidate.factKey),
    ),
    [roadmap.answers, roadmap.questions],
  );
  const unknownQuestions = useMemo(
    () => unresolvedAnsweredQuestions.filter((candidate) => roadmap.answers[candidate.factKey] === null),
    [roadmap.answers, unresolvedAnsweredQuestions],
  );
  const manualReviewQuestions = useMemo(
    () => unresolvedAnsweredQuestions.filter((candidate) =>
      roadmap.answers[candidate.factKey] !== null && candidate.resolutionMode === "manual-review",
    ),
    [roadmap.answers, unresolvedAnsweredQuestions],
  );
  const question = useMemo(
    () => roadmap.questions.find((candidate) => candidate.factKey === revisitFactKey) ?? pendingQuestions[0],
    [pendingQuestions, revisitFactKey, roadmap.questions],
  );

  useEffect(() => {
    const saved = question ? roadmap.answers[question.factKey] : undefined;
    setValue(saved === null ? undefined : saved);
    setError(undefined);
  }, [question?.factKey, roadmap.answers]);

  const leaveUnknown = async () => {
    if (!question) return;
    setBusy(true);
    setError(undefined);
    try {
      const updated = await updateRoadmapAnswers(roadmap.id, {
        [question.factKey]: null,
      });
      onRoadmapUpdated(updated);
      setRevisitFactKey(undefined);
      setOpen(false);
    } catch (caught) {
      setError(
        caught instanceof ClientApiError
          ? caught.message
          : "This question could not be left unknown. The visible roadmap has not been replaced.",
      );
    } finally {
      setBusy(false);
    }
  };

  const saveAnswer = async () => {
    if (!question || !hasAnswer(question, value)) return;
    setBusy(true);
    setError(undefined);
    try {
      const updated = await updateRoadmapAnswers(roadmap.id, {
        [question.factKey]: value!,
      });
      onRoadmapUpdated(updated);
      setRevisitFactKey(undefined);
      setOpen(false);
    } catch (caught) {
      setError(
        caught instanceof ClientApiError
          ? caught.message
          : "This answer could not be saved. The visible roadmap has not been replaced.",
      );
    } finally {
      setBusy(false);
    }
  };

  const affectedUnknownBranchCount = new Set(
    unresolvedAnsweredQuestions.flatMap((candidate) => candidate.blocksTaskIds),
  ).size;
  const countLabel = `${pendingQuestions.length} ${pendingQuestions.length === 1 ? "question" : "questions"} left to answer`;
  const unresolvedLabel = unknownQuestions.length > 0
    ? `${unknownQuestions.length} left unknown · ${affectedUnknownBranchCount} affected ${affectedUnknownBranchCount === 1 ? "branch still needs" : "branches still need"} information`
    : undefined;

  const reviewQuestion = (candidate: RoadmapQuestion) => {
    setRevisitFactKey(candidate.factKey);
    setOpen(true);
  };

  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => setOpen(true)}
          className="min-h-11 border-[#2454a6] bg-white text-[#173f7a] shadow-none hover:bg-[#eaf2ff]"
        >
          <SlidersHorizontal aria-hidden="true" />
          Personalize this roadmap
        </Button>
        <span className="text-xs font-medium text-slate-600" aria-live="polite">{countLabel}</span>
        {unresolvedLabel ? (
          <span className="text-xs font-semibold text-amber-800" aria-live="polite">{unresolvedLabel}</span>
        ) : null}
        {unknownQuestions.length > 0 ? (
          <Button
            type="button"
            variant="ghost"
            onClick={() => reviewQuestion(unknownQuestions[0]!)}
            className="min-h-11 text-[#173f7a]"
          >
            Review unknown answers
          </Button>
        ) : null}
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent className="w-full overflow-y-auto border-slate-300 bg-[#f8f9fb] p-0 sm:max-w-lg">
          <SheetHeader className="border-b border-slate-300 bg-white px-5 py-5 pr-12 text-left sm:px-6">
            <SheetTitle className="text-xl tracking-[-0.025em] text-[#101a2e]">
              Personalize this roadmap
            </SheetTitle>
            <SheetDescription className="leading-6 text-slate-600">
              Optional and non-blocking. Answer one fact at a time, or leave it unknown. The roadmap stays available either way.
            </SheetDescription>
            <p className="pt-1 text-xs font-semibold uppercase tracking-[0.08em] text-[#2454a6]">
              {countLabel}
            </p>
          </SheetHeader>

          <div className="grid gap-5 px-5 py-6 sm:px-6">
            {question ? (
              <>
                <div>
                  <p className="text-lg font-bold leading-7 tracking-[-0.02em] text-[#172033]">
                    {question.prompt}
                  </p>
                  <p className="mt-3 flex gap-2 text-sm leading-6 text-slate-600">
                    <CircleHelp aria-hidden="true" className="mt-1 size-4 shrink-0 text-[#2454a6]" />
                    <span>{question.reason}</span>
                  </p>
                  <p className="mt-3 text-xs font-medium text-slate-500">
                    Shapes {question.blocksTaskIds.length} {question.blocksTaskIds.length === 1 ? "task" : "tasks"}
                  </p>
                </div>

                {question.answerType === "document" || question.answerType === "unknown" ? (
                  <Alert className="border-amber-500 bg-amber-50 text-amber-950">
                    <FileWarning aria-hidden="true" />
                    <AlertTitle>{question.answerType === "document" ? "Document answer needs information" : "Answer format needs information"}</AlertTitle>
                    <AlertDescription className="leading-6 text-amber-950">
                      {question.unsupportedReason ?? "This navigator does not collect or upload documents. Leave this question unknown and verify evidence through the affected task details."}
                    </AlertDescription>
                  </Alert>
                ) : (
                  <>
                    <QuestionControl question={question} value={value} onChange={setValue} />
                    {question.resolutionMode === "manual-review" ? (
                      <Alert className="border-blue-600 bg-blue-50 text-blue-950">
                        <CircleHelp aria-hidden="true" />
                        <AlertTitle>Informational — manual review required</AlertTitle>
                        <AlertDescription className="leading-6 text-blue-950">
                          This answer can be recorded, but it will not automatically unlock, exclude, or reorder work because the source does not provide safe executable decision logic.
                        </AlertDescription>
                      </Alert>
                    ) : question.resolutionMode === "safe-effects" ? (
                      <Alert className="border-emerald-600 bg-emerald-50 text-emerald-950">
                        <CircleHelp aria-hidden="true" />
                        <AlertTitle>Can safely personalize branches</AlertTitle>
                        <AlertDescription className="leading-6 text-emerald-950">
                          An exact listed answer may change only the reviewed affected branch. Other work and unknown facts remain fail-closed.
                        </AlertDescription>
                      </Alert>
                    ) : null}
                  </>
                )}

                {error ? (
                  <Alert className="border-[#b84545] bg-[#fff0f0] text-[#722f2f]">
                    <AlertDescription className="text-[#722f2f]">{error}</AlertDescription>
                  </Alert>
                ) : null}
              </>
            ) : (
              <div className="grid gap-3">
                <Alert className={unresolvedAnsweredQuestions.length > 0
                  ? "border-amber-500 bg-amber-50 text-amber-950"
                  : "border-emerald-600 bg-emerald-50 text-emerald-950"}
                >
                  <AlertTitle>No new questions left to answer</AlertTitle>
                  <AlertDescription>
                    {unresolvedAnsweredQuestions.length > 0
                      ? "Saved unknowns and manual-review answers are still unresolved. Affected branches remain evidence-gated until supported information is available."
                      : "All safely supported personalization questions have been handled. Evidence gates still apply to the roadmap."}
                  </AlertDescription>
                </Alert>
                {unresolvedAnsweredQuestions.map((candidate) => (
                  <Button
                    key={candidate.factKey}
                    type="button"
                    variant="outline"
                    onClick={() => setRevisitFactKey(candidate.factKey)}
                    className="h-auto min-h-11 justify-start whitespace-normal border-slate-300 bg-white px-3 py-2 text-left shadow-none"
                  >
                    {roadmap.answers[candidate.factKey] === null ? "Review unknown" : "Review saved answer"}: {candidate.prompt}
                  </Button>
                ))}
                {manualReviewQuestions.length > 0 ? (
                  <p className="text-xs font-semibold text-blue-800">
                    {manualReviewQuestions.length} saved {manualReviewQuestions.length === 1 ? "answer still needs" : "answers still need"} manual review.
                  </p>
                ) : null}
              </div>
            )}
          </div>

          <SheetFooter className="border-t border-slate-300 bg-white px-5 py-4 sm:px-6">
            {question ? (
              <>
                {question.answerType !== "document" && question.answerType !== "unknown" ? (
                  <Button
                    type="button"
                    onClick={saveAnswer}
                    disabled={busy || !hasAnswer(question, value)}
                    className="min-h-11 bg-[#172033] text-white shadow-none hover:bg-[#26344f]"
                  >
                    {busy ? <LoaderCircle aria-hidden="true" className="animate-spin" /> : null}
                    {busy ? "Saving answer" : "Save answer"}
                  </Button>
                ) : null}
                <Button type="button" variant="ghost" onClick={leaveUnknown} disabled={busy} className="min-h-11">
                  Leave unknown
                </Button>
              </>
            ) : (
              <Button type="button" onClick={() => setOpen(false)} className="min-h-11">Close</Button>
            )}
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
}
