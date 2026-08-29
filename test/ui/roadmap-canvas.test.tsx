// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";

import { cleanup, render, waitFor, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { RoadmapCanvas } from "../../src/components/roadmap/roadmap-canvas.js";
import type { Roadmap, RoadmapTask } from "../../src/domain.js";
import { projectRoadmapGraph } from "../../src/lib/roadmap-graph.js";

function task(
  id: string,
  title: string,
  status: RoadmapTask["status"],
  dependencies: readonly string[] = [],
): RoadmapTask {
  return {
    id,
    title,
    action: `Complete ${title}.`,
    reason: `${title} is required.`,
    authority: { name: "Test Authority", type: "central" },
    classification: status === "needs-information" ? "needs-information" : "required",
    applicability: status === "needs-information" ? "unknown" : true,
    status,
    actionability: status === "completed" || status === "ready" ? "actionable" : "withheld",
    dependencies,
    missingAnswers: status === "needs-information" ? ["missing"] : [],
    requiredInformation: [],
    requiredDocuments: [],
    evidence: [],
    journey: { id: `journey-${id}`, channel: "offline", instructions: [] },
    blockers: [],
    proofConfirmed: status === "completed",
  };
}

const roadmap: Roadmap = {
  id: "rm-dependencies",
  schemaVersion: "1.0.0",
  packId: "pack",
  packVersion: "1",
  outcomeId: "outcome",
  outcomeVersion: "1",
  outcomeTitle: "Truthful dependency roadmap",
  jurisdiction: { countryCode: "IN", level: "central" },
  status: "needs-information",
  answers: {},
  questions: [],
  tasks: [
    task("root-a", "Establish identity", "completed"),
    task("root-b", "Classify the product", "ready"),
    task("child", "Submit the application", "needs-information", ["root-a", "root-b"]),
  ],
  excludedTasks: [],
  availableNextActions: [],
};

describe("RoadmapCanvas", () => {
  afterEach(() => cleanup());

  it("renders each task's actual predecessors instead of only a depth bucket", () => {
    const { container } = render(
      <RoadmapCanvas
        model={projectRoadmapGraph(roadmap)}
        selectedTaskId={null}
        onSelectTask={vi.fn()}
      />,
    );

    const child = container.querySelector<HTMLElement>('[data-task-id="child"]');
    expect(child).toHaveAttribute("data-depends-on", "root-a root-b");
    expect(within(child!).getByText(/After Establish identity; Classify the product/i)).toBeInTheDocument();
  });

  it("renders one traceable geometric connector outside the tiles for every projected edge", async () => {
    const model = projectRoadmapGraph(roadmap);
    const { container } = render(
      <RoadmapCanvas model={model} selectedTaskId={null} onSelectTask={vi.fn()} />,
    );

    await waitFor(() => expect(container.querySelectorAll("[data-roadmap-edge]")).toHaveLength(model.edges.length));
    for (const edge of model.edges) {
      const connectors = container.querySelectorAll(
        `[data-roadmap-edge="${edge.id}"][data-edge-source="${edge.source}"][data-edge-target="${edge.target}"]`,
      );
      expect(connectors, edge.id).toHaveLength(1);
      expect(connectors[0]?.tagName.toLowerCase(), edge.id).toBe("path");
      expect(connectors[0]?.closest("[data-roadmap-connectors]"), edge.id).toBeInTheDocument();
      expect(connectors[0]?.closest("[data-task-id]"), edge.id).toBeNull();
      expect(connectors[0]).toHaveAttribute("d", expect.stringMatching(/^M\s*[\d.]+\s+[\d.]+\s+C/));
    }

    for (const node of model.nodes) {
      expect(container.querySelector(`[data-roadmap-node-id="${node.id}"]`), node.id).toBeInTheDocument();
    }
  });

  it("pairs status text and icon with visibly distinct bounded state treatments", () => {
    const { container } = render(
      <RoadmapCanvas
        model={projectRoadmapGraph(roadmap)}
        selectedTaskId={null}
        onSelectTask={vi.fn()}
      />,
    );

    const completed = container.querySelector<HTMLElement>('[data-task-id="root-a"]');
    const ready = container.querySelector<HTMLElement>('[data-task-id="root-b"]');
    const needsInformation = container.querySelector<HTMLElement>('[data-task-id="child"]');

    expect(completed).toHaveAttribute("data-state-tone", "completed");
    expect(ready).toHaveAttribute("data-state-tone", "ready");
    expect(needsInformation).toHaveAttribute("data-state-tone", "needs-information");
    expect(new Set([completed!.className, ready!.className, needsInformation!.className]).size).toBe(3);
    expect(within(completed!).getByText("Completed")).toBeInTheDocument();
    expect(completed!.querySelector("svg")).toBeInTheDocument();
  });
});
