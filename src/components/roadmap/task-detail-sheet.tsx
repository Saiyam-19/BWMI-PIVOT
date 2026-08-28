"use client";

import {
  AlertTriangle,
  ArrowUpRight,
  Building2,
  CheckCircle2,
  CircleHelp,
  FileInput,
  FolderCheck,
  Info,
  ListChecks,
  LoaderCircle,
  LockKeyhole,
} from "lucide-react";
import { useEffect, useState } from "react";

import { EvidenceList } from "@/components/roadmap/evidence-list";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { Roadmap, RoadmapTask, TaskTransition } from "@/domain";
import { ClientApiError, transitionRoadmapTask } from "@/lib/client-api";

interface TaskDetailSheetProps {
  readonly open: boolean;
  readonly roadmapId: string;
  readonly task: RoadmapTask | undefined;
  readonly tasks: readonly RoadmapTask[];
  readonly onOpenChange: (open: boolean) => void;
  readonly onRoadmapUpdated: (roadmap: Roadmap) => void;
}

const statusLabels: Readonly<Record<RoadmapTask["status"], string>> = {
  "needs-information": "Needs information",
  "not-started": "Not started",
  ready: "Ready",
  blocked: "Blocked",
  "in-progress": "In progress",
  "awaiting-authority": "Awaiting authority",
  completed: "Completed",
  "not-applicable": "Not applicable",
};

const authorityLabels: Readonly<Record<RoadmapTask["authority"]["type"], string>> = {
  central: "Central authority",
  "national-regulator": "National regulator",
  state: "State authority",
  local: "Local authority",
  court: "Court",
  "private-regulated": "Regulated institution",
  "private-operational": "Operational institution",
};

function Section({
  icon,
  title,
  children,
}: Readonly<{ icon: React.ReactNode; title: string; children: React.ReactNode }>) {
  return (
    <section aria-labelledby={`task-section-${title.toLowerCase().replaceAll(" ", "-")}`}>
      <h2
        id={`task-section-${title.toLowerCase().replaceAll(" ", "-")}`}
        className="flex items-center gap-2 text-sm font-semibold tracking-[-0.01em] text-[#172033]"
      >
        {icon}
        {title}
      </h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}

function TextList({ items, empty }: Readonly<{ items: readonly string[]; empty: string }>) {
  if (items.length === 0) return <p className="text-sm leading-6 text-slate-500">{empty}</p>;
  return (
    <ul className="grid gap-2 text-sm leading-6 text-slate-700">
      {items.map((item) => (
        <li key={item} className="flex gap-2">
          <span aria-hidden="true" className="mt-[0.65rem] size-1.5 shrink-0 rounded-full bg-[#2454a6]" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function TaskDetailSheet({
  open,
  roadmapId,
  task,
  tasks,
  onOpenChange,
  onRoadmapUpdated,
}: TaskDetailSheetProps) {
  const [proofConfirmed, setProofConfirmed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string>();

  useEffect(() => {
    setProofConfirmed(task?.proofConfirmed ?? false);
    setError(undefined);
  }, [task?.id, task?.proofConfirmed]);

  if (!task) return null;

  const prerequisiteTitles = task.dependencies.map((dependencyId) =>
    tasks.find((candidate) => candidate.id === dependencyId)?.title ?? dependencyId
  );

  const transition = async (value: TaskTransition) => {
    if (value.to === "completed" && !proofConfirmed) {
      setError("Confirm that you received the expected proof before marking this task completed.");
      return;
    }
    setBusy(true);
    setError(undefined);
    try {
      const roadmap = await transitionRoadmapTask(roadmapId, task.id, value);
      onRoadmapUpdated(roadmap);
    } catch (caught) {
      setError(
        caught instanceof ClientApiError
          ? caught.message
          : "This progress change could not be saved. The task has not been changed.",
      );
    } finally {
      setBusy(false);
    }
  };

  const canComplete = task.actionability === "actionable" &&
    ["ready", "in-progress", "awaiting-authority"].includes(task.status) &&
    Boolean(task.completionProof);
  const classificationLabel = task.classification.replaceAll("-", " ");
  const showClassification = classificationLabel !== statusLabels[task.status].toLowerCase();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full gap-0 border-slate-300 p-0 sm:max-w-xl lg:max-w-[42rem]"
      >
        <SheetHeader className="border-b border-slate-200 bg-white px-5 py-5 pr-14 text-left sm:px-7">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="border-slate-400 bg-slate-50 text-slate-800">
              {statusLabels[task.status]}
            </Badge>
            {showClassification ? (
              <Badge variant="outline" className="border-slate-300 text-slate-600">
                {classificationLabel}
              </Badge>
            ) : null}
          </div>
          <SheetTitle className="mt-2 text-2xl leading-tight tracking-[-0.03em] text-[#172033] sm:text-3xl">
            {task.title}
          </SheetTitle>
          <SheetDescription className="text-sm leading-6 text-slate-600">
            {task.actionability === "actionable"
              ? "Verified journey and progress controls for this task."
              : "This task remains visible, but its instructions are fail-closed."}
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="min-h-0 flex-1">
          <div className="grid gap-6 px-5 py-6 sm:px-7">
            {task.actionability === "withheld" ? (
              <Alert className="border-red-300 bg-red-50 text-red-900">
                <LockKeyhole aria-hidden="true" />
                <AlertTitle>Instructions withheld</AlertTitle>
                <AlertDescription className="text-red-800">
                  Required facts or admitted official evidence are incomplete. The navigator will not invent the missing journey.
                </AlertDescription>
              </Alert>
            ) : null}

            <Section icon={<Info aria-hidden="true" className="size-4 text-[#2454a6]" />} title="Action and reason">
              <p className="text-sm font-medium leading-6 text-slate-900">{task.action}</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">{task.reason}</p>
            </Section>
            <Separator />

            <Section icon={<Building2 aria-hidden="true" className="size-4 text-[#2454a6]" />} title="Responsible authority">
              <p className="text-sm leading-6 text-slate-700">
                {task.authority.name} · {authorityLabels[task.authority.type]}
              </p>
            </Section>
            <Separator />

            <Section icon={<ListChecks aria-hidden="true" className="size-4 text-[#2454a6]" />} title="Prerequisites">
              <TextList items={prerequisiteTitles} empty="No task dependencies are recorded." />
            </Section>
            <Separator />

            <Section icon={<FileInput aria-hidden="true" className="size-4 text-[#2454a6]" />} title="Requirements">
              <h3 className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">Information</h3>
              <div className="mt-2">
                <TextList items={task.requiredInformation} empty={task.actionability === "withheld" ? "Withheld until the task is actionable." : "No additional information is recorded."} />
              </div>
              <h3 className="mt-4 text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">Documents</h3>
              <div className="mt-2">
                <TextList items={task.requiredDocuments} empty={task.actionability === "withheld" ? "Withheld until the task is actionable." : "No additional documents are recorded."} />
              </div>
            </Section>
            <Separator />

            <Section icon={<ArrowUpRight aria-hidden="true" className="size-4 text-[#2454a6]" />} title="Portal or offline journey">
              {task.journey?.officialUrl && task.actionability === "actionable" ? (
                <Button asChild className="min-h-11 bg-[#172033] text-white shadow-none hover:bg-[#26344f]">
                  <a href={task.journey.officialUrl} target="_blank" rel="noreferrer noopener">
                    Open {task.journey.portalName ?? "official service"}
                    <ArrowUpRight aria-hidden="true" />
                  </a>
                </Button>
              ) : null}
              {task.journey?.channel && task.actionability === "actionable" ? (
                <p className="mt-3 text-xs font-medium uppercase tracking-[0.08em] text-slate-500">
                  {task.journey.channel === "portal" ? "Online portal" : task.journey.channel === "offline" ? "Offline channel" : "Online and offline channel"}
                </p>
              ) : null}
              {task.journey?.instructions.length ? (
                <ol className="mt-4 grid gap-5">
                  {task.journey.instructions.map((step, index) => (
                    <li key={step.id} className="grid grid-cols-[2rem_1fr] gap-3">
                      <span className="flex size-8 items-center justify-center rounded-full bg-[#172033] text-sm font-semibold text-white">
                        {index + 1}
                      </span>
                      <div className="min-w-0">
                        <p className="text-sm leading-6 text-slate-800">{step.instruction}</p>
                        <div className="mt-3 border-t border-slate-200 pt-3">
                          <EvidenceList claims={task.evidence} claimIds={step.claimIds} />
                        </div>
                      </div>
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {task.actionability === "withheld"
                    ? "Exact portal or offline steps are not available until this task becomes actionable."
                    : "No ordered instructions are recorded for this supported offline task."}
                </p>
              )}
            </Section>
            <Separator />

            <Section icon={<AlertTriangle aria-hidden="true" className="size-4 text-[#9a3412]" />} title="Blockers and help">
              <TextList items={task.blockers} empty="No current blocker is recorded." />
              {task.journey?.helpOrEscalation ? (
                <p className="mt-4 flex gap-2 text-sm leading-6 text-slate-700">
                  <CircleHelp aria-hidden="true" className="mt-1 size-4 shrink-0 text-[#2454a6]" />
                  <span>{task.journey.helpOrEscalation}</span>
                </p>
              ) : null}
            </Section>
            <Separator />

            <Section icon={<FolderCheck aria-hidden="true" className="size-4 text-[#2454a6]" />} title="Expected completion proof">
              {task.completionProof ? (
                <>
                  <p className="text-sm font-medium leading-6 text-slate-900">
                    {task.completionProof.description}
                  </p>
                  <div className="mt-3">
                    <EvidenceList claims={task.evidence} claimIds={task.completionProof.claimIds} />
                  </div>
                  {canComplete ? (
                    <label className="mt-5 flex min-h-11 cursor-pointer items-start gap-3 rounded-md border border-slate-300 bg-slate-50 px-3 py-3 text-sm leading-5 text-slate-800">
                      <input
                        type="checkbox"
                        checked={proofConfirmed}
                        onChange={(event) => {
                          setProofConfirmed(event.currentTarget.checked);
                          setError(undefined);
                        }}
                        className="mt-0.5 size-4 accent-[#172033]"
                      />
                      <span>I received the expected proof and can identify it.</span>
                    </label>
                  ) : task.status === "completed" ? (
                    <p className="mt-4 flex items-center gap-2 text-sm font-medium text-emerald-800">
                      <CheckCircle2 aria-hidden="true" className="size-4" />
                      Completion proof confirmed
                    </p>
                  ) : null}
                </>
              ) : (
                <p className="text-sm leading-6 text-slate-600">
                  No admitted completion proof is available, so this task cannot be marked completed.
                </p>
              )}
            </Section>
            <Separator />

            <Section icon={<CheckCircle2 aria-hidden="true" className="size-4 text-[#2454a6]" />} title="All task evidence">
              <EvidenceList claims={task.evidence} />
            </Section>

            {error ? (
              <Alert className="border-red-300 bg-red-50 text-red-900">
                <AlertTriangle aria-hidden="true" />
                <AlertDescription className="text-red-800">{error}</AlertDescription>
              </Alert>
            ) : null}
          </div>
        </ScrollArea>

        {task.actionability === "actionable" && task.status !== "completed" ? (
          <div className="flex flex-wrap justify-end gap-2 border-t border-slate-200 bg-white px-5 py-4 sm:px-7">
            {task.status === "ready" ? (
              <Button
                type="button"
                variant="outline"
                disabled={busy}
                onClick={() => transition({ to: "in-progress" })}
                className="min-h-11 border-slate-400 shadow-none"
              >
                Start task
              </Button>
            ) : null}
            {task.status === "in-progress" ? (
              <Button
                type="button"
                variant="outline"
                disabled={busy}
                onClick={() => transition({ to: "awaiting-authority" })}
                className="min-h-11 border-slate-400 shadow-none"
              >
                Await authority
              </Button>
            ) : null}
            {canComplete ? (
              <Button
                type="button"
                disabled={busy}
                onClick={() => transition({ to: "completed", proofConfirmed })}
                className="min-h-11 bg-[#172033] text-white shadow-none hover:bg-[#26344f]"
              >
                {busy ? <LoaderCircle aria-hidden="true" className="animate-spin" /> : null}
                Mark completed
              </Button>
            ) : null}
          </div>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
