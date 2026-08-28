// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";

import { cleanup, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { ReactFlowProvider } from "@xyflow/react";
import type { ComponentProps } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { RoadmapNode } from "../../src/components/roadmap/roadmap-node.js";
import { RoadmapWorkspace } from "../../src/components/roadmap/roadmap-workspace.js";
import type { Roadmap, RoadmapTask } from "../../src/domain.js";

vi.mock("../../src/components/roadmap/roadmap-canvas.js", () => ({
  RoadmapCanvas: ({ model, onSelectTask }: {
    model: { nodes: readonly { id: string; kind: string; title: string }[] };
    onSelectTask: (taskId: string) => void;
  }) => (
    <div aria-label="Interactive roadmap canvas">
      {model.nodes.filter((node) => node.kind === "task").map((node) => (
        <button key={node.id} type="button" onClick={() => onSelectTask(node.id)}>
          {node.title}
        </button>
      ))}
    </div>
  ),
}));

function task(id: string, title: string, status: RoadmapTask["status"], dependencies: readonly string[] = []): RoadmapTask {
  return {
    id,
    title,
    action: `Complete ${title}.`,
    reason: `${title} is part of the selected outcome.`,
    authority: { name: "Test Authority", type: "central" },
    classification: "required",
    applicability: true,
    status,
    actionability: "actionable",
    dependencies,
    missingAnswers: [],
    requiredInformation: [],
    requiredDocuments: [],
    evidence: [],
    journey: { id: `journey-${id}`, channel: "offline", instructions: [] },
    blockers: [],
    proofConfirmed: status === "completed",
  };
}

const first = task("first", "Prepare records", "completed");
const second = task("second", "Submit application", "ready", ["first"]);
const initialRoadmap: Roadmap = {
  id: "rm-workspace",
  schemaVersion: "1.0.0",
  packId: "pack",
  packVersion: "1",
  outcomeId: "outcome",
  outcomeVersion: "1",
  outcomeTitle: "Complete a government outcome",
  jurisdiction: { countryCode: "IN", level: "central" },
  status: "ready",
  answers: {},
  questions: [],
  tasks: [second, first],
  excludedTasks: [{
    id: "excluded",
    title: "Excluded branch",
    reason: "Not applicable to the current answers.",
    classification: "not-applicable",
    applicability: false,
  }],
  availableNextActions: [],
};

describe("RoadmapWorkspace", () => {
  afterEach(() => cleanup());

  it("shows progress, canvas, and a dependency-ordered linear alternative", async () => {
    const user = userEvent.setup();
    render(<RoadmapWorkspace initialRoadmap={initialRoadmap} />);

    expect(screen.getByRole("heading", { name: initialRoadmap.outcomeTitle })).toBeInTheDocument();
    expect(screen.getByText("1 of 2 tasks completed")).toBeInTheDocument();
    expect(screen.getByText("1 excluded by your answers")).toBeInTheDocument();
    expect(screen.getByLabelText("Interactive roadmap canvas")).toBeInTheDocument();

    await user.click(screen.getByRole("tab", { name: "Linear view" }));
    const taskButtons = screen.getAllByRole("button", { name: /Prepare records|Submit application/ });
    expect(taskButtons.map((button) => button.textContent)).toEqual([
      expect.stringContaining("Prepare records"),
      expect.stringContaining("Submit application"),
    ]);

    await user.click(screen.getByRole("button", { name: /Submit application/ }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Submit application" })).toBeInTheDocument();
  });

  it("returns focus to the task control after its detail sheet closes", async () => {
    const user = userEvent.setup();
    render(<RoadmapWorkspace initialRoadmap={initialRoadmap} />);
    await user.click(screen.getByRole("tab", { name: "Linear view" }));
    const taskButton = screen.getByRole("button", { name: /Submit application/ });
    taskButton.focus();
    await user.keyboard("{Enter}");
    await user.keyboard("{Escape}");

    expect(taskButton).toHaveFocus();
  });

  it("uses a native keyboard-activatable task control inside each graph node", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    const props = {
      id: second.id,
      data: { graphNode: { id: second.id, kind: "task", title: second.title, task: second }, onSelect },
      selected: false,
    } as unknown as ComponentProps<typeof RoadmapNode>;
    render(
      <ReactFlowProvider>
        <RoadmapNode {...props} />
      </ReactFlowProvider>,
    );

    const button = screen.getByRole("button", { name: /Submit application/ });
    button.focus();
    await user.keyboard("{Enter}");

    expect(onSelect).toHaveBeenCalledWith("second");
  });
});
