import type { RoadmapGraphNode } from "@/lib/roadmap-graph";

export type RoadmapNodeStatus = NonNullable<RoadmapGraphNode["status"]>;

export const ROADMAP_STATUS_LABELS: Readonly<Record<RoadmapNodeStatus, string>> = {
  "needs-information": "Needs information",
  "not-started": "Not started",
  ready: "Ready",
  blocked: "Blocked",
  "in-progress": "In progress",
  "awaiting-authority": "Awaiting authority",
  completed: "Completed",
  "not-applicable": "Not applicable",
};

export const ROADMAP_STATUS_CLASSES: Readonly<Record<RoadmapNodeStatus, string>> = {
  "needs-information": "border-l-[#b84545] bg-[#fff0ef] text-[#6f2828]",
  "not-started": "border-l-slate-500 bg-slate-100 text-slate-700",
  ready: "border-l-[#d6a800] bg-[#fff7dc] text-slate-950",
  blocked: "border-l-[#d67b00] bg-[#fff7dc] text-[#744300]",
  "in-progress": "border-l-[#d6a800] bg-[#fff7dc] text-slate-950",
  "awaiting-authority": "border-l-[#2f6fd2] bg-[#eef5ff] text-[#173f7a]",
  completed: "border-l-[#268044] bg-[#eef9f0] text-[#175b2c]",
  "not-applicable": "border-l-slate-500 bg-slate-100 text-slate-700",
};
