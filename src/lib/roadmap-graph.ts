import type {
  Applicability,
  Roadmap,
  RoadmapTask,
  TaskClassification,
  TaskProgressStatus,
} from "../domain.js";

export const ROADMAP_NODE_WIDTH = 248;
export const ROADMAP_NODE_HEIGHT = 76;
export const OUTCOME_NODE_WIDTH = 280;
export const OUTCOME_NODE_HEIGHT = 64;

export interface RoadmapGraphPosition {
  readonly x: number;
  readonly y: number;
}

export interface RoadmapGraphNode {
  readonly id: string;
  readonly kind: "outcome" | "task" | "state" | "excluded";
  readonly title: string;
  readonly summary?: string;
  readonly position: RoadmapGraphPosition;
  readonly width: number;
  readonly height: number;
  readonly task?: RoadmapTask;
  readonly status?: TaskProgressStatus;
  readonly actionability?: RoadmapTask["actionability"];
  readonly applicability?: Applicability;
  readonly classification?: TaskClassification;
}

export interface RoadmapGraphEdge {
  readonly id: string;
  readonly source: string;
  readonly target: string;
  readonly kind: "primary" | "conditional" | "outcome" | "excluded";
}

export interface RoadmapGraphModel {
  readonly nodes: readonly RoadmapGraphNode[];
  readonly edges: readonly RoadmapGraphEdge[];
  readonly excludedCount: number;
}

export function selectInitialViewNodeIds(model: RoadmapGraphModel): readonly string[] {
  const anchor = model.nodes.find((node) => node.kind === "outcome") ?? model.nodes[0];
  if (!anchor) return [];
  const candidateIds = model.edges
    .filter((edge) => edge.source === anchor.id)
    .map((edge) => edge.target);
  const candidates = candidateIds.flatMap((id) => {
    const node = model.nodes.find((candidate) => candidate.id === id);
    return node ? [node] : [];
  });
  if (candidates.length === 0) return [anchor.id];

  const anchorCenter = anchor.position.x + anchor.width / 2;
  const nearest = [...candidates].sort((a, b) => {
    const aDistance = Math.abs(a.position.x + a.width / 2 - anchorCenter);
    const bDistance = Math.abs(b.position.x + b.width / 2 - anchorCenter);
    return aDistance - bDistance || a.id.localeCompare(b.id);
  })[0]!;
  return [anchor.id, nearest.id];
}

function sortTasksByDependencies(tasks: readonly RoadmapTask[]): readonly RoadmapTask[] {
  const byId = new Map(tasks.map((task) => [task.id, task]));
  const indegree = new Map(tasks.map((task) => [task.id, 0]));
  const dependents = new Map<string, string[]>();

  for (const task of tasks) {
    for (const dependencyId of task.dependencies) {
      if (!byId.has(dependencyId)) continue;
      indegree.set(task.id, (indegree.get(task.id) ?? 0) + 1);
      dependents.set(dependencyId, [...(dependents.get(dependencyId) ?? []), task.id]);
    }
  }

  let ready = [...indegree.entries()]
    .filter(([, degree]) => degree === 0)
    .map(([id]) => id)
    .sort();
  const ordered: RoadmapTask[] = [];

  while (ready.length > 0) {
    const nextReady: string[] = [];
    for (const id of ready) {
      ordered.push(byId.get(id)!);
      for (const dependentId of [...(dependents.get(id) ?? [])].sort()) {
        const nextDegree = (indegree.get(dependentId) ?? 1) - 1;
        indegree.set(dependentId, nextDegree);
        if (nextDegree === 0) nextReady.push(dependentId);
      }
    }
    ready = [...new Set(nextReady)].sort();
  }

  if (ordered.length === tasks.length) return ordered;
  const orderedIds = new Set(ordered.map((task) => task.id));
  return [
    ...ordered,
    ...tasks.filter((task) => !orderedIds.has(task.id)).sort((a, b) => a.id.localeCompare(b.id)),
  ];
}

function taskNode(task: RoadmapTask): RoadmapGraphNode {
  return {
    id: task.id,
    kind: "task",
    title: task.title,
    position: { x: 0, y: 0 },
    width: ROADMAP_NODE_WIDTH,
    height: ROADMAP_NODE_HEIGHT,
    task,
    status: task.status,
    actionability: task.actionability,
    applicability: task.applicability,
    classification: task.classification,
  };
}

export function projectRoadmapGraph(roadmap: Roadmap): RoadmapGraphModel {
  const tasks = sortTasksByDependencies(roadmap.tasks);
  const taskIds = new Set(tasks.map((task) => task.id));
  const roots = tasks.filter((task) =>
    task.dependencies.every((dependencyId) => !taskIds.has(dependencyId))
  );
  const outcomeId = `outcome:${roadmap.id}`;
  const stateId = `state:${roadmap.id}`;
  const excludedNodes: RoadmapGraphNode[] = roadmap.excludedTasks.map((task) => ({
    id: `excluded:${task.id}`,
    kind: "excluded",
    title: task.title,
    summary: task.reason,
    position: { x: 0, y: 0 },
    width: ROADMAP_NODE_WIDTH,
    height: ROADMAP_NODE_HEIGHT,
    applicability: false,
    classification: "not-applicable",
    status: "not-applicable",
    actionability: "withheld",
  }));

  const nodes: RoadmapGraphNode[] = [
    {
      id: outcomeId,
      kind: "outcome",
      title: roadmap.outcomeTitle,
      summary: "Your selected government outcome remains visible while the roadmap is personalized.",
      position: { x: 0, y: 0 },
      width: OUTCOME_NODE_WIDTH,
      height: OUTCOME_NODE_HEIGHT,
    },
    ...tasks.map(taskNode),
    ...(tasks.length === 0
      ? [{
          id: stateId,
          kind: "state" as const,
          title: "No tasks are currently applicable",
          summary: roadmap.excludedTasks.length > 0
            ? "Review or change your answers to restore an excluded branch."
            : "This outcome has no admitted tasks yet. Keep the roadmap and check back when verified guidance is available.",
          position: { x: 0, y: 0 },
          width: OUTCOME_NODE_WIDTH,
          height: ROADMAP_NODE_HEIGHT,
        }]
      : []),
    ...excludedNodes,
  ];
  const edges: RoadmapGraphEdge[] = [
    ...roots.map((root) => ({
      id: `${outcomeId}->${root.id}`,
      source: outcomeId,
      target: root.id,
      kind: "outcome" as const,
    })),
    ...(tasks.length === 0
      ? [{
          id: `${outcomeId}->${stateId}`,
          source: outcomeId,
          target: stateId,
          kind: "outcome" as const,
        }]
      : []),
    ...tasks.flatMap((task) =>
      task.dependencies
        .filter((dependencyId) => taskIds.has(dependencyId))
        .sort()
        .map((dependencyId) => ({
          id: `${dependencyId}->${task.id}`,
          source: dependencyId,
          target: task.id,
          kind: task.classification === "conditional" ? "conditional" as const : "primary" as const,
        }))
    ),
    ...excludedNodes.map((node) => ({
      id: `${outcomeId}->${node.id}`,
      source: outcomeId,
      target: node.id,
      kind: "excluded" as const,
    })),
  ];

  return { nodes, edges, excludedCount: roadmap.excludedTasks.length };
}
