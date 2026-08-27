"use client";

import {
  Check,
  CircleAlert,
  CircleDashed,
  Clock3,
  FileQuestion,
  Flag,
  LoaderCircle,
  LockKeyhole,
  type LucideIcon,
} from "lucide-react";
import { Handle, Position, type Node, type NodeProps } from "@xyflow/react";

import type { RoadmapGraphNode } from "@/lib/roadmap-graph";
import { cn } from "@/lib/utils";

export interface RoadmapNodeData extends Record<string, unknown> {
  readonly graphNode: RoadmapGraphNode;
  readonly onSelect: (taskId: string) => void;
}

export type RoadmapFlowNode = Node<RoadmapNodeData, "roadmap">;

export const ROADMAP_STATUS_LABELS: Readonly<Record<NonNullable<RoadmapGraphNode["status"]>, string>> = {
  "needs-information": "Needs information",
  "not-started": "Not started",
  ready: "Ready",
  blocked: "Blocked",
  "in-progress": "In progress",
  "awaiting-authority": "Awaiting authority",
  completed: "Completed",
  "not-applicable": "Not applicable",
};

const statusIcons: Readonly<Record<NonNullable<RoadmapGraphNode["status"]>, LucideIcon>> = {
  "needs-information": FileQuestion,
  "not-started": CircleDashed,
  ready: Flag,
  blocked: LockKeyhole,
  "in-progress": LoaderCircle,
  "awaiting-authority": Clock3,
  completed: Check,
  "not-applicable": CircleAlert,
};

const statusClasses: Readonly<Record<NonNullable<RoadmapGraphNode["status"]>, string>> = {
  "needs-information": "bg-[#fde8e7] text-[#6f2828]",
  "not-started": "bg-[#eceeef] text-[#3f4854]",
  ready: "bg-[#fff36a] text-[#171717]",
  blocked: "bg-[#fde8e7] text-[#6f2828]",
  "in-progress": "bg-[#fff36a] text-[#171717]",
  "awaiting-authority": "bg-[#e6f0ff] text-[#173f7a]",
  completed: "bg-[#d9f2dd] text-[#175b2c]",
  "not-applicable": "bg-[#eceeef] text-[#5c6673]",
};

export function RoadmapNode({ data, selected }: NodeProps<RoadmapFlowNode>) {
  const { graphNode, onSelect } = data;

  if (graphNode.kind === "outcome") {
    return (
      <div className="flex h-full w-full items-center justify-center border-2 border-[#171717] bg-white px-4 text-center text-sm font-semibold leading-5 text-[#171717]">
        <Handle type="target" position={Position.Top} className="roadmap-handle" />
        <span>{graphNode.title}</span>
        <Handle type="source" position={Position.Bottom} className="roadmap-handle" />
      </div>
    );
  }

  const status = graphNode.status ?? "not-started";
  const StatusIcon = statusIcons[status];
  const withheld = graphNode.actionability === "withheld";

  return (
    <>
      <Handle type="target" position={Position.Top} className="roadmap-handle" />
      <button
        type="button"
        onClick={() => onSelect(graphNode.id)}
        aria-label={`${graphNode.title}. ${ROADMAP_STATUS_LABELS[status]}${withheld ? ". Instructions withheld" : ""}`}
        className={cn(
          "nopan flex h-full w-full flex-col justify-between border-2 border-[#171717] px-3 py-2 text-left outline-none transition-[box-shadow,transform] duration-150 hover:-translate-y-0.5 hover:shadow-[0_5px_12px_rgba(15,23,42,0.16)] focus-visible:ring-4 focus-visible:ring-[#2454a6]/35",
          statusClasses[status],
          selected && "ring-4 ring-[#2454a6]/30",
        )}
      >
        <span className="line-clamp-2 text-sm font-semibold leading-5 tracking-[-0.01em]">
          {graphNode.title}
        </span>
        <span className="mt-1 flex items-center justify-between gap-2 text-[0.68rem] font-medium uppercase tracking-[0.07em] opacity-80">
          <span className="flex items-center gap-1.5">
            <StatusIcon aria-hidden="true" className={cn("size-3.5", status === "in-progress" && "animate-spin")} />
            {ROADMAP_STATUS_LABELS[status]}
          </span>
          {withheld ? <LockKeyhole aria-label="Instructions withheld" className="size-3.5" /> : null}
        </span>
      </button>
      <Handle type="source" position={Position.Bottom} className="roadmap-handle" />
    </>
  );
}
