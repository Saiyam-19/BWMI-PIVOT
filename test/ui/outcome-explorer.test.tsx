// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";

import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const push = vi.fn();

import { OutcomeExplorer } from "../../src/components/outcome-explorer.js";

const outcomes = [
  ["import-regulated-product", "Import and legally sell a regulated product", ["business-employment-compliance"]],
  ["export-first-commercial-order", "Export the first commercial order", ["business-employment-compliance", "money-tax-pf-benefits"]],
  ["incorporate-company-first-hire", "Incorporate a company and hire the first employee", ["business-employment-compliance"]],
  ["central-procurement-first-bid", "Submit the first Central Government bid", ["business-employment-compliance"]],
  ["post-death-regulated-assets", "Discover and claim a deceased person's regulated assets", ["money-tax-pf-benefits", "family-health-education"]],
  ["urgent-cyber-financial-fraud", "Respond to cyber financial fraud", ["safety-legal-help-complaints", "money-tax-pf-benefits"]],
  ["reusable-central-foundations", "Set up reusable Central registrations", ["identity-certificates-documents", "business-employment-compliance"]],
] as const;

const catalog = {
  outcomes: outcomes.map(([id, title, domains]) => ({
    id,
    version: "1.0.0",
    title,
    description: `Description for ${title}.`,
    domains,
  })),
  domains: [
    "business-employment-compliance",
    "family-health-education",
    "identity-certificates-documents",
    "money-tax-pf-benefits",
    "safety-legal-help-complaints",
  ],
};

function response(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

describe("OutcomeExplorer", () => {
  afterEach(() => cleanup());

  beforeEach(() => {
    push.mockReset();
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(response({ data: catalog })));
  });

  it("shows all seven supported outcomes and all eight citizen-domain filters", async () => {
    render(<OutcomeExplorer onNavigate={push} />);

    for (const [, title] of outcomes) {
      expect(await screen.findByRole("button", { name: new RegExp(title, "i") })).toBeInTheDocument();
    }

    expect(screen.getAllByTestId("domain-filter")).toHaveLength(8);
    expect(screen.getByRole("button", { name: "Agriculture and rural services" })).toBeInTheDocument();
  });

  it("retains ambiguous natural language and directs the user to recover through browse choices", async () => {
    const fetchMock = vi.mocked(fetch);
    fetchMock
      .mockResolvedValueOnce(response({ data: catalog }))
      .mockResolvedValueOnce(response({
        error: {
          code: "unsafe_intent",
          message: "The intent provider did not select one approved outcome.",
        },
      }, 422));
    const user = userEvent.setup();
    render(<OutcomeExplorer onNavigate={push} />);

    const input = await screen.findByLabelText("Describe the outcome you need");
    await user.type(input, "I need help with a government process");
    await user.click(screen.getByRole("button", { name: "Build my roadmap" }));

    expect(input).toHaveValue("I need help with a government process");
    expect(await screen.findByRole("alert")).toHaveTextContent("choose one of the outcomes below");
    expect(screen.getByRole("heading", { name: "Browse supported outcomes" })).toHaveFocus();
    expect(push).not.toHaveBeenCalled();
  });

  it("creates a real roadmap from supported natural language and preserves unknown intake", async () => {
    const fetchMock = vi.mocked(fetch);
    fetchMock
      .mockResolvedValueOnce(response({ data: catalog }))
      .mockResolvedValueOnce(response({
        data: {
          id: "rm-supported",
          outcomeId: "import-regulated-product",
          outcomeTitle: outcomes[0][1],
          status: "needs-information",
          questions: [{
            id: "q-product",
            factKey: "productApplies",
            prompt: "Does this product trigger apply to your case?",
            reason: "This answer changes which import tasks can be safely shown.",
            blocksTaskIds: ["task-product"],
          }],
        },
      }, 201));
    const user = userEvent.setup();
    render(<OutcomeExplorer onNavigate={push} />);

    const input = await screen.findByLabelText("Describe the outcome you need");
    await user.type(input, "import bluetooth headphones to india");
    await user.click(screen.getByRole("button", { name: "Build my roadmap" }));

    expect(await screen.findByRole("dialog")).toHaveTextContent("Does this product trigger apply");
    await user.click(screen.getByRole("button", { name: "I don't know yet" }));
    await user.click(screen.getByRole("button", { name: "Open my roadmap" }));

    expect(push).toHaveBeenCalledWith("/roadmaps/rm-supported");
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("supports keyboard outcome selection and navigates when no intake is needed", async () => {
    const fetchMock = vi.mocked(fetch);
    fetchMock
      .mockResolvedValueOnce(response({ data: catalog }))
      .mockResolvedValueOnce(response({
        data: {
          id: "rm-browse",
          outcomeId: outcomes[1][0],
          outcomeTitle: outcomes[1][1],
          status: "ready",
          questions: [],
        },
      }, 201));
    const user = userEvent.setup();
    render(<OutcomeExplorer onNavigate={push} />);

    const outcome = await screen.findByRole("button", {
      name: new RegExp(outcomes[1][1], "i"),
    });
    outcome.focus();
    await user.keyboard("{Enter}");

    await waitFor(() => expect(push).toHaveBeenCalledWith("/roadmaps/rm-browse"));
    const createCall = fetchMock.mock.calls[1];
    expect(createCall?.[0]).toBe("/api/roadmaps");
    expect(JSON.parse(String(createCall?.[1]?.body))).toEqual({
      entry: { kind: "browse", outcomeId: outcomes[1][0] },
    });
  });
});
