"use client";

import {
  BaseEdge,
  getSmoothStepPath,
  type Edge,
  type EdgeProps,
} from "@xyflow/react";

export interface RoadmapEdgeData extends Record<string, unknown> {
  readonly kind: "primary" | "conditional" | "outcome";
  readonly emphasis?: boolean;
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
  const emphasized = data?.emphasis === true;

  return (
    <BaseEdge
      path={path}
      style={{
        stroke: "#2f6fd2",
        strokeWidth: emphasized ? 4 : conditional ? 1.75 : 2,
        strokeDasharray: conditional ? "4 7" : undefined,
        opacity: emphasized ? 1 : 0.68,
      }}
    />
  );
}
