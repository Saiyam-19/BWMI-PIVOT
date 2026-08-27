"use client";

import { ArrowDown, LockKeyhole } from "lucide-react";

import { ROADMAP_STATUS_LABELS } from "@/components/roadmap/roadmap-node";
import type { RoadmapGraphModel } from "@/lib/roadmap-graph";
import { cn } from "@/lib/utils";

interface LinearRoadmapProps {
  readonly model: RoadmapGraphModel;
  readonly onSelectTask: (taskId: string) => void;
}

const statusClasses = {
  "needs-information": "border-red-700 bg-red-50",
  "not-started": "border-slate-500 bg-slate-100",
  ready: "border-[#171717] bg-[#fff36a]",
  blocked: "border-red-700 bg-red-50",
  "in-progress": "border-[#171717] bg-[#fff36a]",
  "awaiting-authority": "border-blue-700 bg-blue-50",
  completed: "border-emerald-700 bg-emerald-50",
  "not-applicable": "border-slate-400 bg-slate-100",
} as const;

export function LinearRoadmap({ model, onSelectTask }: LinearRoadmapProps) {
  const taskNodes = model.nodes.filter((node) => node.kind === "task" && node.task);
  const titleById = new Map(taskNodes.map((node) => [node.id, node.title]));

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 sm:py-8">
      <p className="max-w-[70ch] text-sm leading-6 text-slate-600">
        Tasks are listed in dependency order. Open any task without dragging or zooming the canvas.
      </p>
      <ol className="mt-6 grid gap-0">
        {taskNodes.map((node, index) => {
          const task = node.task!;
          const status = node.status ?? "not-started";
          const dependencies = task.dependencies.flatMap((dependencyId) => {
            const title = titleById.get(dependencyId);
            return title ? [title] : [];
          });
          return (
            <li key={node.id} className="relative pb-7 last:pb-0">
              {index < taskNodes.length - 1 ? (
                <span aria-hidden="true" className="absolute left-[1.35rem] top-12 h-[calc(100%-2rem)] w-0.5 bg-[#2f6fd2]">
                  <ArrowDown className="absolute -bottom-1 -left-[0.42rem] size-4 text-[#2f6fd2]" />
                </span>
              ) : null}
              <button
                type="button"
                onClick={() => onSelectTask(node.id)}
                className={cn(
                  "relative flex min-h-24 w-full items-start gap-4 border-2 px-4 py-3 text-left outline-none transition-shadow hover:shadow-[0_7px_18px_rgba(15,23,42,0.12)] focus-visible:ring-4 focus-visible:ring-[#2454a6]/35",
                  statusClasses[status],
                )}
              >
                <span className="flex size-10 shrink-0 items-center justify-center border-2 border-[#171717] bg-white text-sm font-bold text-[#172033]">
                  {index + 1}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-start justify-between gap-2">
                    <span className="font-semibold leading-6 tracking-[-0.01em] text-[#172033]">
                      {node.title}
                    </span>
                    <span className="text-xs font-medium uppercase tracking-[0.07em] text-slate-700">
                      {ROADMAP_STATUS_LABELS[status]}
                    </span>
                  </span>
                  {dependencies.length > 0 ? (
                    <span className="mt-2 block text-sm leading-5 text-slate-600">
                      Depends on {dependencies.join(", ")}
                    </span>
                  ) : (
                    <span className="mt-2 block text-sm leading-5 text-slate-600">No prerequisite task</span>
                  )}
                  {node.actionability === "withheld" ? (
                    <span className="mt-2 flex items-center gap-1.5 text-xs font-medium text-red-800">
                      <LockKeyhole aria-hidden="true" className="size-3.5" />
                      Instructions withheld
                    </span>
                  ) : null}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
