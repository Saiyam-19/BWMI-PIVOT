import { describe, expect, it } from "vitest";

import type { Roadmap, RoadmapTask, TaskProgressStatus } from "../../src/domain.js";
import { projectRoadmapGraph } from "../../src/lib/roadmap-graph.js";

const statuses: readonly TaskProgressStatus[] = [
  "needs-information",
  "not-started",
  "ready",
  "blocked",
  "in-progress",
  "awaiting-authority",
  "completed",
  "not-applicable",
];

function task(
  id: string,
  status: TaskProgressStatus,
  dependencies: readonly string[] = [],
  overrides: Partial<RoadmapTask> = {},
): RoadmapTask {
  return {
    id,
    title: `Task ${id}`,
    action: `Act on ${id}.`,
    reason: `${id} is required by the outcome.`,
    authority: { name: "Test Authority", type: "central" },
    classification: status === "needs-information" ? "needs-information" : "required",
    applicability: status === "needs-information" ? "unknown" : true,
    status,
    actionability: status === "needs-information" || status === "blocked" ? "withheld" : "actionable",
    dependencies,
    missingAnswers: status === "needs-information" ? ["productType"] : [],
    requiredInformation: ["Reference number"],
    requiredDocuments: [],
    evidence: [],
    blockers: status === "blocked" ? ["Official guidance is unavailable."] : [],
    proofConfirmed: status === "completed",
    ...overrides,
  };
}

function roadmap(tasks: readonly RoadmapTask[]): Roadmap {
  return {
    id: "rm-graph",
    schemaVersion: "1.0.0",
    packId: "pack",
    packVersion: "1",
    outcomeId: "outcome",
    outcomeVersion: "1",
    outcomeTitle: "Complete a government outcome",
    jurisdiction: { countryCode: "IN", level: "central" },
    status: "blocked",
    answers: {},
    questions: [],
    tasks,
    excludedTasks: [{
      id: "excluded",
      title: "Excluded task",
      reason: "The current answer makes it inapplicable.",
      classification: "not-applicable",
      applicability: false,
    }],
    availableNextActions: [],
  };
}

describe("projectRoadmapGraph", () => {
  it("always renders the outcome and a useful next state when every task is excluded", () => {
    const empty = roadmap([]);
    const model = projectRoadmapGraph(empty);

    expect(model.nodes[0]).toMatchObject({
      id: "outcome:rm-graph",
      kind: "outcome",
      title: empty.outcomeTitle,
    });
    expect(model.nodes).toEqual(expect.arrayContaining([
      expect.objectContaining({
        kind: "state",
        title: "No tasks are currently applicable",
      }),
      expect.objectContaining({
        kind: "excluded",
        title: "Excluded task",
      }),
    ]));
    expect(model.edges.length).toBeGreaterThan(0);
  });

  it("adds one explanatory outcome node for multiple roots and points it at each root", () => {
    const model = projectRoadmapGraph(roadmap([
      task("root-b", "ready"),
      task("root-a", "ready"),
      task("dependent", "blocked", ["root-a"]),
    ]));

    expect(model.nodes.map((node) => node.id)).toEqual([
      "outcome:rm-graph",
      "root-a",
      "root-b",
      "dependent",
      "excluded:excluded",
    ]);
    expect(model.edges.map(({ source, target }) => [source, target])).toEqual([
      ["outcome:rm-graph", "root-a"],
      ["outcome:rm-graph", "root-b"],
      ["root-a", "dependent"],
      ["outcome:rm-graph", "excluded:excluded"],
    ]);
  });

  it("preserves every task status without reinterpreting actionability", () => {
    const model = projectRoadmapGraph(roadmap(statuses.map((status, index) =>
      task(`task-${index}`, status, [], {
        actionability: index % 2 === 0 ? "withheld" : "actionable",
      })
    )));

    const taskNodes = model.nodes.filter((node) => node.kind === "task");
    expect(taskNodes.map((node) => node.status)).toEqual(statuses);
    expect(taskNodes.map((node) => node.actionability)).toEqual(
      statuses.map((_, index) => index % 2 === 0 ? "withheld" : "actionable"),
    );
  });

  it("keeps unknown applicability visible and reports excluded tasks separately", () => {
    const model = projectRoadmapGraph(roadmap([
      task("unknown", "needs-information", [], {
        applicability: "unknown",
        actionability: "withheld",
      }),
    ]));

    expect(model.nodes.find((node) => node.id === "unknown")).toMatchObject({
      id: "unknown",
      kind: "task",
      applicability: "unknown",
      actionability: "withheld",
    });
    expect(model.excludedCount).toBe(1);
  });
});
