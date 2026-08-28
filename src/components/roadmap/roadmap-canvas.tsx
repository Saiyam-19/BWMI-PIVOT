"use client";

import { useMemo, useState } from "react";
import {
  Background,
  BackgroundVariant,
  Controls,
  ReactFlow,
  type ReactFlowInstance,
} from "@xyflow/react";

import { RoadmapEdge, type RoadmapFlowEdge } from "@/components/roadmap/roadmap-edge";
import { RoadmapNode, type RoadmapFlowNode } from "@/components/roadmap/roadmap-node";
import { RoadmapToolbar } from "@/components/roadmap/roadmap-toolbar";
import type {
  RoadmapGraphModel,
  RoadmapGraphNode,
  RoadmapGraphPosition,
} from "@/lib/roadmap-graph";

interface RoadmapCanvasProps {
  readonly model: RoadmapGraphModel;
  readonly onSelectTask: (taskId: string) => void;
}

const nodeTypes = { roadmap: RoadmapNode };
const edgeTypes = { roadmap: RoadmapEdge };
const HORIZONTAL_BRANCH_GAP = 352;
const VERTICAL_RANK_GAP = 172;

interface RoadmapDisplayLayout {
  readonly focusIds: readonly string[];
  readonly positions: ReadonlyMap<string, RoadmapGraphPosition>;
  readonly spineEdgeIds: ReadonlySet<string>;
}

function composeRoadmapDisplay(model: RoadmapGraphModel): RoadmapDisplayLayout {
  const byId = new Map(model.nodes.map((node) => [node.id, node]));
  const children = new Map<string, string[]>();
  const parents = new Map<string, string[]>();
  const indegree = new Map(model.nodes.map((node) => [node.id, 0]));

  for (const edge of model.edges) {
    if (!byId.has(edge.source) || !byId.has(edge.target)) continue;
    children.set(edge.source, [...(children.get(edge.source) ?? []), edge.target]);
    parents.set(edge.target, [...(parents.get(edge.target) ?? []), edge.source]);
    indegree.set(edge.target, (indegree.get(edge.target) ?? 0) + 1);
  }

  const pathScores = new Map<string, number>();
  const scorePath = (id: string, visiting = new Set<string>()): number => {
    const known = pathScores.get(id);
    if (known !== undefined) return known;
    if (visiting.has(id)) return 0;
    const nextVisiting = new Set(visiting).add(id);
    const score = 1 + Math.max(
      0,
      ...(children.get(id) ?? []).map((childId) => scorePath(childId, nextVisiting)),
    );
    pathScores.set(id, score);
    return score;
  };

  const roots = model.nodes
    .filter((node) => (indegree.get(node.id) ?? 0) === 0)
    .sort((a, b) => scorePath(b.id) - scorePath(a.id) || a.id.localeCompare(b.id));
  const outcome = model.nodes.find((node) => node.kind === "outcome");
  const spineIds: string[] = [];
  const seenSpine = new Set<string>();
  let cursor = outcome?.id ?? roots[0]?.id;

  while (cursor && !seenSpine.has(cursor)) {
    spineIds.push(cursor);
    seenSpine.add(cursor);
    cursor = [...(children.get(cursor) ?? [])]
      .filter((id) => !seenSpine.has(id))
      .sort((a, b) => scorePath(b) - scorePath(a) || a.localeCompare(b))[0];
  }

  const depths = new Map(roots.map((node) => [node.id, 0]));
  const remainingIndegree = new Map(indegree);
  const queue = roots.map((node) => node.id);
  for (let index = 0; index < queue.length; index += 1) {
    const id = queue[index]!;
    const nextDepth = (depths.get(id) ?? 0) + 1;
    for (const childId of [...(children.get(id) ?? [])].sort()) {
      depths.set(childId, Math.max(depths.get(childId) ?? 0, nextDepth));
      const nextIndegree = (remainingIndegree.get(childId) ?? 1) - 1;
      remainingIndegree.set(childId, nextIndegree);
      if (nextIndegree === 0) queue.push(childId);
    }
  }

  const maxKnownDepth = Math.max(0, ...depths.values());
  for (const node of model.nodes) {
    if (!depths.has(node.id)) depths.set(node.id, maxKnownDepth + 1);
  }

  const spineSet = new Set(spineIds);
  const spineByDepth = new Map(
    spineIds.map((id) => [depths.get(id) ?? 0, id]),
  );
  const positions = new Map<string, RoadmapGraphPosition>();
  const maxDepth = Math.max(0, ...depths.values());

  for (let depth = 0; depth <= maxDepth; depth += 1) {
    const nodesAtDepth = model.nodes
      .filter((node) => depths.get(node.id) === depth)
      .sort((a, b) => a.position.x - b.position.x || a.id.localeCompare(b.id));
    const spineId = spineByDepth.get(depth);
    const usedLanes = new Set<number>();

    if (spineId) {
      const spineNode = byId.get(spineId)!;
      positions.set(spineId, {
        x: -spineNode.width / 2,
        y: depth * VERTICAL_RANK_GAP,
      });
      usedLanes.add(0);
    }

    for (const node of nodesAtDepth.filter((candidate) => !spineSet.has(candidate.id))) {
      const parentCenters = (parents.get(node.id) ?? []).flatMap((parentId) => {
        const parent = byId.get(parentId);
        const position = positions.get(parentId);
        return parent && position ? [position.x + parent.width / 2] : [];
      });
      const desiredCenter = parentCenters.length > 0
        ? parentCenters.reduce((sum, value) => sum + value, 0) / parentCenters.length
        : node.position.x;
      const desiredLane = Math.round(desiredCenter / HORIZONTAL_BRANCH_GAP) ||
        (node.position.x < 0 ? -1 : 1);
      const laneOptions = Array.from({ length: Math.max(8, nodesAtDepth.length * 2) }, (_, index) => {
        const lane = Math.floor(index / 2) + 1;
        return index % 2 === 0 ? -lane : lane;
      }).sort((a, b) =>
        Math.abs(a - desiredLane) - Math.abs(b - desiredLane) ||
        Math.abs(a) - Math.abs(b) ||
        a - b
      );
      const lane = laneOptions.find((candidate) => !usedLanes.has(candidate)) ??
        (usedLanes.size + 1);
      usedLanes.add(lane);
      positions.set(node.id, {
        x: lane * HORIZONTAL_BRANCH_GAP - node.width / 2,
        y: depth * VERTICAL_RANK_GAP,
      });
    }
  }

  const spineEdgeIds = new Set(
    spineIds.slice(1).flatMap((target, index) => {
      const source = spineIds[index]!;
      const edge = model.edges.find((candidate) =>
        candidate.source === source && candidate.target === target
      );
      return edge ? [edge.id] : [];
    }),
  );

  return {
    focusIds: spineIds.slice(0, 4),
    positions,
    spineEdgeIds,
  };
}

export function RoadmapCanvas({ model, onSelectTask }: RoadmapCanvasProps) {
  const [instance, setInstance] = useState<ReactFlowInstance<RoadmapFlowNode, RoadmapFlowEdge>>();
  const display = useMemo(() => composeRoadmapDisplay(model), [model]);
  const nodes = useMemo<RoadmapFlowNode[]>(() => model.nodes.map((node) => ({
    id: node.id,
    type: "roadmap",
    position: display.positions.get(node.id) ?? node.position,
    data: { graphNode: node, onSelect: onSelectTask },
    draggable: false,
    connectable: false,
    focusable: node.kind === "task",
    selectable: node.kind === "task",
    style: { width: node.width, height: node.height },
  })), [display.positions, model.nodes, onSelectTask]);
  const edges = useMemo<RoadmapFlowEdge[]>(() => model.edges.map((edge) => ({
    id: edge.id,
    type: "roadmap",
    source: edge.source,
    target: edge.target,
    focusable: false,
    selectable: false,
    data: { kind: edge.kind, emphasis: display.spineEdgeIds.has(edge.id) },
  })), [display.spineEdgeIds, model.edges]);
  const initialViewNodes = useMemo(
    () => display.focusIds.map((id) => ({ id })),
    [display.focusIds],
  );

  return (
    <div
      aria-label="Interactive roadmap canvas"
      className="roadmap-canvas h-[calc(100svh-15.5rem)] min-h-[38rem] w-full overflow-hidden border-y border-slate-300 bg-[#f8f9fb] sm:h-[calc(100svh-14rem)] sm:min-h-[43rem] sm:border"
    >
      <ReactFlow<RoadmapFlowNode, RoadmapFlowEdge>
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onInit={setInstance}
        onNodeClick={(_, node) => {
          if (node.data.graphNode.kind === "task") onSelectTask(node.id);
        }}
        fitView
        fitViewOptions={{
          nodes: initialViewNodes,
          padding: 0.24,
          minZoom: 0.62,
          maxZoom: 1.05,
        }}
        minZoom={0.3}
        maxZoom={1.6}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable
        edgesFocusable={false}
        panOnScroll
        zoomOnPinch
        zoomOnDoubleClick={false}
        proOptions={{ hideAttribution: true }}
        aria-label="Government task dependency roadmap"
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={22}
          size={1.1}
          color="#cbd1dc"
          bgColor="#f8f9fb"
        />
        <RoadmapToolbar
          model={model}
          onReset={() => void instance?.fitView({
            nodes: initialViewNodes,
            padding: 0.24,
            minZoom: 0.62,
            maxZoom: 1.05,
            duration: 280,
          })}
        />
        <Controls
          position="bottom-left"
          showInteractive={false}
          fitViewOptions={{ padding: 0.22, duration: 280 }}
          aria-label="Roadmap pan and zoom controls"
        />
      </ReactFlow>
    </div>
  );
}
