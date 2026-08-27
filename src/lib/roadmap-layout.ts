import * as dagre from "@dagrejs/dagre";

import type { RoadmapGraphModel } from "./roadmap-graph.js";

export function layoutRoadmapGraph(model: RoadmapGraphModel): RoadmapGraphModel {
  const graph = new dagre.graphlib.Graph();
  graph.setDefaultEdgeLabel(() => ({}));
  graph.setGraph({
    rankdir: "TB",
    align: "UL",
    nodesep: 92,
    edgesep: 28,
    ranksep: 92,
    marginx: 48,
    marginy: 48,
  });

  for (const node of model.nodes) {
    graph.setNode(node.id, { width: node.width, height: node.height });
  }
  for (const edge of model.edges) {
    graph.setEdge(edge.source, edge.target, {
      minlen: edge.kind === "outcome" ? 1 : 2,
      weight: edge.kind === "primary" ? 3 : 1,
    });
  }

  dagre.layout(graph);

  return {
    ...model,
    nodes: model.nodes.map((node) => {
      const position = graph.node(node.id) as { x: number; y: number };
      return {
        ...node,
        position: {
          x: position.x - node.width / 2,
          y: position.y - node.height / 2,
        },
      };
    }),
  };
}
