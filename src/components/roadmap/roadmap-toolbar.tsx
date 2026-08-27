"use client";

import { Focus, LockKeyhole } from "lucide-react";
import { Panel } from "@xyflow/react";

import { Button } from "@/components/ui/button";
import type { RoadmapGraphModel } from "@/lib/roadmap-graph";

interface RoadmapToolbarProps {
  readonly model: RoadmapGraphModel;
  readonly onReset: () => void;
}

const legend = [
  { label: "Ready / active", className: "bg-[#fff36a]" },
  { label: "Future", className: "bg-[#eceeef]" },
  { label: "Completed", className: "bg-[#d9f2dd]" },
  { label: "Action required", className: "bg-[#fde8e7]" },
] as const;

export function RoadmapToolbar({ model, onReset }: RoadmapToolbarProps) {
  const withheld = model.nodes.filter((node) =>
    node.kind === "task" && node.actionability === "withheld"
  ).length;

  return (
    <Panel position="top-left" className="m-3 max-w-[calc(100%-1.5rem)] sm:m-4">
      <div className="flex max-w-[46rem] flex-wrap items-center gap-x-4 gap-y-2 border border-slate-300 bg-white px-3 py-2 shadow-[0_8px_24px_rgba(15,23,42,0.08)]">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.68rem] font-medium uppercase tracking-[0.07em] text-slate-600">
          {legend.map((item) => (
            <span key={item.label} className="flex items-center gap-1.5 whitespace-nowrap">
              <span aria-hidden="true" className={`size-3 border border-[#171717] ${item.className}`} />
              {item.label}
            </span>
          ))}
        </div>
        {withheld > 0 ? (
          <span className="flex items-center gap-1.5 text-xs font-medium text-red-800">
            <LockKeyhole aria-hidden="true" className="size-3.5" />
            {withheld} withheld
          </span>
        ) : null}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onReset}
          className="ml-auto min-h-11 border-slate-400 bg-white shadow-none sm:min-h-8"
        >
          <Focus aria-hidden="true" />
          Reset view
        </Button>
      </div>
    </Panel>
  );
}
