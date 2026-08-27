// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";

import { cleanup, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { TaskDetailSheet } from "../../src/components/roadmap/task-detail-sheet.js";
import type { Roadmap, RoadmapTask } from "../../src/domain.js";

const source = {
  id: "source-service",
  title: "Official service manual",
  issuer: "Central Test Authority",
  url: "https://service.gov.in/manual",
  official: true,
  tier: "service-owner",
  jurisdiction: { countryCode: "IN", level: "central" },
  retrievedOn: "2026-08-20",
} as const;

const selectedTask: RoadmapTask = {
  id: "submit-application",
  title: "Submit the verified application",
  action: "Open the official service and submit the application.",
  reason: "The authority requires a submitted application before review can begin.",
  authority: { name: "Central Test Authority", type: "central" },
  classification: "required",
  applicability: true,
  status: "ready",
  actionability: "actionable",
  dependencies: ["prepare-records"],
  missingAnswers: [],
  requiredInformation: ["Applicant reference number"],
  requiredDocuments: ["Signed application form"],
  evidence: [
    {
      id: "claim-step",
      kind: "portal-instruction",
      statement: "The official service accepts online submission.",
      status: "verified",
      sourceIds: [source.id],
      jurisdiction: source.jurisdiction,
      verifiedOn: "2026-08-20",
      reviewDueOn: "2026-12-31",
      applicability: true,
      current: true,
      sources: [source],
    },
    {
      id: "claim-proof",
      kind: "completion-proof",
      statement: "The service issues an acknowledgement number.",
      status: "verified",
      sourceIds: [source.id],
      jurisdiction: source.jurisdiction,
      verifiedOn: "2026-08-20",
      reviewDueOn: "2026-12-31",
      applicability: true,
      current: true,
      sources: [source],
    },
  ],
  journey: {
    id: "journey-submit",
    channel: "portal",
    portalName: "Official Test Service",
    officialUrl: "https://service.gov.in/start",
    instructions: [{
      id: "step-submit",
      instruction: "Sign in, choose New application, attach the signed form, and submit.",
      claimIds: ["claim-step"],
    }],
    helpOrEscalation: "Use the service grievance page with the acknowledgement number.",
  },
  completionProof: {
    description: "Application acknowledgement number",
    claimIds: ["claim-proof"],
  },
  nextAction: "Open the official service.",
  blockers: ["Resolve any portal validation error before submitting."],
  proofConfirmed: false,
};

function roadmap(task: RoadmapTask = selectedTask): Roadmap {
  return {
    id: "rm-sheet",
    schemaVersion: "1.0.0",
    packId: "pack",
    packVersion: "1",
    outcomeId: "outcome",
    outcomeVersion: "1",
    outcomeTitle: "Complete a verified government outcome",
    jurisdiction: { countryCode: "IN", level: "central" },
    status: "ready",
    answers: {},
    questions: [],
    tasks: [task],
    excludedTasks: [],
    availableNextActions: [],
  };
}

function response(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

describe("TaskDetailSheet", () => {
  afterEach(() => cleanup());

  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
    vi.stubGlobal("ResizeObserver", class {
      observe() {}
      unobserve() {}
      disconnect() {}
    });
  });

  it("exposes the complete verified journey and safe official evidence links", () => {
    render(
      <TaskDetailSheet
        open
        roadmapId="rm-sheet"
        task={selectedTask}
        tasks={[
          { ...selectedTask, id: "prepare-records", title: "Prepare records" },
          selectedTask,
        ]}
        onOpenChange={vi.fn()}
        onRoadmapUpdated={vi.fn()}
      />,
    );

    expect(screen.getByRole("heading", { name: selectedTask.title })).toBeInTheDocument();
    expect(screen.getByText(selectedTask.action)).toBeInTheDocument();
    expect(screen.getByText(selectedTask.reason)).toBeInTheDocument();
    expect(screen.getByText("Central Test Authority · Central authority")).toBeInTheDocument();
    expect(screen.getByText("Prepare records")).toBeInTheDocument();
    expect(screen.getByText("Applicant reference number")).toBeInTheDocument();
    expect(screen.getByText("Signed application form")).toBeInTheDocument();
    expect(screen.getByText(/Sign in, choose New application/)).toBeInTheDocument();
    expect(screen.getAllByText("The official service accepts online submission.")).toHaveLength(2);
    expect(screen.getByText(/Use the service grievance page/)).toBeInTheDocument();
    expect(screen.getByText("Resolve any portal validation error before submitting.")).toBeInTheDocument();
    expect(screen.getByText("Application acknowledgement number")).toBeInTheDocument();
    expect(screen.getAllByText("Verified 20 Aug 2026").length).toBeGreaterThan(0);
    expect(screen.getByRole("link", { name: "Open Official Test Service" })).toHaveAttribute("target", "_blank");
    expect(screen.getAllByRole("link", { name: "Official service manual" })[0]).toHaveAttribute("rel", "noreferrer noopener");
  });

  it("requires proof confirmation before sending a completion transition", async () => {
    const user = userEvent.setup();
    const onRoadmapUpdated = vi.fn();
    vi.mocked(fetch).mockResolvedValue(response({
      data: roadmap({ ...selectedTask, status: "completed", proofConfirmed: true }),
    }));
    render(
      <TaskDetailSheet
        open
        roadmapId="rm-sheet"
        task={selectedTask}
        tasks={[selectedTask]}
        onOpenChange={vi.fn()}
        onRoadmapUpdated={onRoadmapUpdated}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Mark completed" }));
    expect(screen.getByRole("alert")).toHaveTextContent("Confirm that you received the expected proof");
    expect(fetch).not.toHaveBeenCalled();

    await user.click(screen.getByRole("checkbox", { name: /I received the expected proof/ }));
    await user.click(screen.getByRole("button", { name: "Mark completed" }));

    expect(fetch).toHaveBeenCalledWith(
      "/api/roadmaps/rm-sheet/tasks/submit-application",
      expect.objectContaining({
        method: "PATCH",
        body: JSON.stringify({ to: "completed", proofConfirmed: true }),
      }),
    );
    expect(onRoadmapUpdated).toHaveBeenCalledWith(expect.objectContaining({ id: "rm-sheet" }));
  });

  it("keeps fail-closed tasks visibly withheld without actionable controls", () => {
    const { completionProof: _completionProof, ...taskWithoutProof } = selectedTask;
    const withheld: RoadmapTask = {
      ...taskWithoutProof,
      status: "needs-information" as const,
      applicability: "unknown" as const,
      actionability: "withheld" as const,
      journey: { id: "withheld", channel: "portal" as const, instructions: [] },
      blockers: ["Official instructions remain withheld until classification is known."],
    };
    render(
      <TaskDetailSheet
        open
        roadmapId="rm-sheet"
        task={withheld}
        tasks={[withheld]}
        onOpenChange={vi.fn()}
        onRoadmapUpdated={vi.fn()}
      />,
    );

    expect(screen.getByText("Instructions withheld")).toBeInTheDocument();
    expect(screen.getByText(/Official instructions remain withheld/)).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Mark completed" })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /Open/ })).not.toBeInTheDocument();
  });
});
