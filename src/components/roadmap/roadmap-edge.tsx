"use client";

import {
  BaseEdge,
  getSmoothStepPath,
  type Edge,
  type EdgeProps,
} from "@xyflow/react";

export interface RoadmapEdgeData extends Record<string, unknown> {
  readonly kind: "primary" | "conditional" | "outcome";
}

export type RoadmapFlowEdge = Edge<RoadmapEdgeData, "roadmap">;

export function RoadmapEdge({
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
}: EdgeProps<RoadmapFlowEdge>) {
  const [path] = getSmoothStepPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    borderRadius: 12,
    offset: 28,
  });
  const conditional = data?.kind === "conditional";

  return (
    <BaseEdge
      path={path}
      style={{
        stroke: "#2f6fd2",
        strokeWidth: conditional ? 2.5 : 3,
        strokeDasharray: conditional ? "4 7" : undefined,
      }}
    />
  );
}
