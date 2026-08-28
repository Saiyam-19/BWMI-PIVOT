// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";

import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { ReactFlowProvider } from "@xyflow/react";
import type { ComponentProps } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { RoadmapNode } from "../../src/components/roadmap/roadmap-node.js";
import { RoadmapWorkspace } from "../../src/components/roadmap/roadmap-workspace.js";
import type { Roadmap, RoadmapTask } from "../../src/domain.js";

Object.defineProperty(HTMLElement.prototype, "scrollIntoView", {
  configurable: true,
  value: vi.fn(),
});

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

    await user.click(screen.getByRole("tab", { name: "Accessible list" }));
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
    await user.click(screen.getByRole("tab", { name: "Accessible list" }));
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

  it("saves one typed answer without requiring the rest and keeps the roadmap visible", async () => {
    const personalizedRoadmap = {
      ...initialRoadmap,
      status: "needs-information" as const,
      questions: [
        {
          id: "q-condition",
          factKey: "condition",
          prompt: "What is the shipment condition?",
          reason: "Condition changes the safe route.",
          answerType: "single_select",
          options: ["New", "Used", "Unknown"],
          blocksTaskIds: ["second"],
        },
        {
          id: "q-sector",
          factKey: "sector",
          prompt: "Which regulated traits apply?",
          reason: "Traits change regulator readiness.",
          answerType: "multi_select",
          options: ["Food", "Radio", "None"],
          blocksTaskIds: ["second"],
        },
      ],
    } as unknown as Roadmap;
    const updatedRoadmap = {
      ...personalizedRoadmap,
      answers: { condition: "New" },
      questions: personalizedRoadmap.questions.slice(1),
    };
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify({
      data: updatedRoadmap,
    }), { status: 200, headers: { "content-type": "application/json" } })));
    const user = userEvent.setup();

    render(<RoadmapWorkspace initialRoadmap={personalizedRoadmap} />);
    await user.click(screen.getByRole("button", { name: /Personalize this roadmap/i }));
    const condition = screen.getByRole("combobox", { name: "What is the shipment condition?" });
    condition.focus();
    await user.keyboard("{ArrowDown}{Enter}");
    await user.click(screen.getByRole("button", { name: "Save answer" }));

    await waitFor(() => expect(vi.mocked(fetch)).toHaveBeenCalledWith(
      "/api/roadmaps/rm-workspace/answers",
      expect.objectContaining({ body: JSON.stringify({ answers: { condition: "New" } }) }),
    ));
    expect(screen.getByRole("heading", { name: personalizedRoadmap.outcomeTitle })).toBeInTheDocument();
    expect(screen.getByText("1 question remaining")).toBeInTheDocument();
  });

  it("can skip an unsupported document question without a save or hiding the roadmap", async () => {
    const documentRoadmap = {
      ...initialRoadmap,
      status: "needs-information" as const,
      questions: [{
        id: "q-dossier",
        factKey: "dossier",
        prompt: "Do you have a verified product dossier?",
        reason: "The dossier is needed before classification.",
        answerType: "document",
        options: [],
        blocksTaskIds: ["second"],
      }],
    } as unknown as Roadmap;
    vi.stubGlobal("fetch", vi.fn());
    const user = userEvent.setup();

    render(<RoadmapWorkspace initialRoadmap={documentRoadmap} />);
    await user.click(screen.getByRole("button", { name: /Personalize this roadmap/i }));
    expect(screen.getByText(/does not collect or upload documents/i)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /Leave unknown/i }));

    expect(fetch).not.toHaveBeenCalled();
    expect(screen.getByRole("heading", { name: documentRoadmap.outcomeTitle })).toBeInTheDocument();
  });
});
