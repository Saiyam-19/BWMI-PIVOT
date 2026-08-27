// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";

import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { IntakeDialog } from "../../src/components/intake-dialog.js";
import type { ClientRoadmap } from "../../src/lib/client-api.js";

const initialRoadmap: ClientRoadmap = {
  id: "rm-intake",
  outcomeId: "import-regulated-product",
  outcomeTitle: "Import and legally sell a regulated product",
  status: "needs-information",
  questions: [{
    id: "q-trigger",
    factKey: "triggerApplies",
    prompt: "Does the product trigger apply to your case?",
    reason: "This decides whether a regulated-product branch belongs in the roadmap.",
    blocksTaskIds: ["task-trigger"],
  }],
};

function response(body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { "content-type": "application/json" },
  });
}

describe("IntakeDialog", () => {
  afterEach(() => cleanup());

  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  it("submits answered facts and adapts to conditional questions returned by the roadmap", async () => {
    const conditionalQuestion = {
      id: "q-claim",
      factKey: "claimApplies",
      prompt: "Does this sourced statement match your case?",
      reason: "This controls whether verified evidence can support the task.",
      blocksTaskIds: ["task-trigger"],
    };
    vi.mocked(fetch)
      .mockResolvedValueOnce(response({
        data: { ...initialRoadmap, questions: [conditionalQuestion] },
      }))
      .mockResolvedValueOnce(response({
        data: { ...initialRoadmap, status: "ready", questions: [] },
      }));
    const onComplete = vi.fn();
    const user = userEvent.setup();
    render(<IntakeDialog open roadmap={initialRoadmap} onOpenChange={vi.fn()} onComplete={onComplete} />);

    expect(screen.getByText(initialRoadmap.questions[0]!.reason)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Yes" }));
    await user.click(screen.getByRole("button", { name: "Continue" }));

    expect(await screen.findByText(conditionalQuestion.prompt)).toBeInTheDocument();
    expect(screen.getByText(conditionalQuestion.reason)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "No" }));
    await user.click(screen.getByRole("button", { name: "Continue" }));

    expect(onComplete).toHaveBeenCalledWith("rm-intake");
    expect(vi.mocked(fetch)).toHaveBeenNthCalledWith(
      1,
      "/api/roadmaps/rm-intake/answers",
      expect.objectContaining({
        method: "PATCH",
        body: JSON.stringify({ answers: { triggerApplies: true } }),
      }),
    );
    expect(vi.mocked(fetch)).toHaveBeenNthCalledWith(
      2,
      "/api/roadmaps/rm-intake/answers",
      expect.objectContaining({
        method: "PATCH",
        body: JSON.stringify({ answers: { claimApplies: false } }),
      }),
    );
  });

  it("allows every returned question to remain explicitly unknown without changing facts", async () => {
    const onComplete = vi.fn();
    const user = userEvent.setup();
    render(<IntakeDialog open roadmap={initialRoadmap} onOpenChange={vi.fn()} onComplete={onComplete} />);

    await user.click(screen.getByRole("button", { name: "I don't know yet" }));
    await user.click(screen.getByRole("button", { name: "Open my roadmap" }));

    expect(onComplete).toHaveBeenCalledWith("rm-intake");
    expect(fetch).not.toHaveBeenCalled();
  });

  it("requires an explicit answer or unknown choice and keeps the dialog recoverable", async () => {
    const user = userEvent.setup();
    render(<IntakeDialog open roadmap={initialRoadmap} onOpenChange={vi.fn()} onComplete={vi.fn()} />);

    await user.click(screen.getByRole("button", { name: "Continue" }));

    expect(screen.getByRole("alert")).toHaveTextContent("Choose Yes, No, or I don't know yet");
    expect(fetch).not.toHaveBeenCalled();
  });

  it("opens on the dialog container so the intake heading remains in view", async () => {
    render(<IntakeDialog open roadmap={initialRoadmap} onOpenChange={vi.fn()} onComplete={vi.fn()} />);

    await waitFor(() => expect(screen.getByRole("dialog")).toHaveFocus());
  });
});
