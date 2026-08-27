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
import {
  selectInitialViewNodeIds,
  type RoadmapGraphModel,
} from "@/lib/roadmap-graph";

interface RoadmapCanvasProps {
  readonly model: RoadmapGraphModel;
  readonly onSelectTask: (taskId: string) => void;
}

const nodeTypes = { roadmap: RoadmapNode };
const edgeTypes = { roadmap: RoadmapEdge };

export function RoadmapCanvas({ model, onSelectTask }: RoadmapCanvasProps) {
  const [instance, setInstance] = useState<ReactFlowInstance<RoadmapFlowNode, RoadmapFlowEdge>>();
  const nodes = useMemo<RoadmapFlowNode[]>(() => model.nodes.map((node) => ({
    id: node.id,
    type: "roadmap",
    position: node.position,
    data: { graphNode: node, onSelect: onSelectTask },
    draggable: false,
    connectable: false,
    focusable: node.kind === "task",
    selectable: node.kind === "task",
    style: { width: node.width, height: node.height },
  })), [model.nodes, onSelectTask]);
  const edges = useMemo<RoadmapFlowEdge[]>(() => model.edges.map((edge) => ({
    id: edge.id,
    type: "roadmap",
    source: edge.source,
    target: edge.target,
    focusable: false,
    selectable: false,
    data: { kind: edge.kind },
  })), [model.edges]);
  const initialViewNodes = useMemo(
    () => selectInitialViewNodeIds(model).map((id) => ({ id })),
    [model],
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
          padding: 0.42,
          minZoom: 0.45,
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
            padding: 0.42,
            minZoom: 0.45,
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
