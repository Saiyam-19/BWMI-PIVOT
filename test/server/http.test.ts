import { describe, expect, it } from "vitest";

import {
  CompletionProofRequiredError,
  InvalidTaskTransitionError,
  PrivacyViolationError,
  RoadmapNotFoundError,
  UnknownOutcomeError,
} from "../../src/index.js";
import {
  TaskNotFoundError,
  answersRequestSchema,
  createRoadmapRequestSchema,
  errorResponse,
  parseJsonBody,
  taskTransitionRequestSchema,
} from "../../src/server/http.js";

describe("HTTP request contracts", () => {
  it("accepts only the public roadmap creation contract", () => {
    expect(
      createRoadmapRequestSchema.safeParse({
        entry: { kind: "browse", outcomeId: "import-regulated-product" },
        answers: { containsBluetooth: true, shipmentStage: "planning" },
      }).success,
    ).toBe(true);
    expect(
      createRoadmapRequestSchema.safeParse({
        entry: { kind: "natural-language", text: "import headphones" },
        credentials: "not part of the contract",
      }).success,
    ).toBe(false);
  });

  it("rejects non-primitive answers and unsupported transitions", () => {
    expect(
      answersRequestSchema.safeParse({ answers: { uploadedDocument: { id: "x" } } })
        .success,
    ).toBe(false);
    expect(
      taskTransitionRequestSchema.safeParse({ to: "not-started" }).success,
    ).toBe(false);
  });

  it("returns a stable malformed-body envelope with field errors", async () => {
    const request = new Request("http://localhost/api/roadmaps", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ entry: { kind: "browse" } }),
    });

    const result = await parseJsonBody(request, createRoadmapRequestSchema);

    expect(result.ok).toBe(false);
    if (result.ok) throw new Error("Expected invalid request data.");
    expect(result.response.status).toBe(400);
    await expect(result.response.json()).resolves.toMatchObject({
      error: {
        code: "invalid_request",
        message: "The request body is invalid.",
        fieldErrors: expect.any(Object),
      },
    });
  });
});

describe("HTTP error translation", () => {
  it.each([
    [new UnknownOutcomeError("unsupported"), 422, "unsafe_intent"],
    [new PrivacyViolationError("private"), 400, "privacy_violation"],
    [new RoadmapNotFoundError("missing"), 404, "roadmap_not_found"],
    [new TaskNotFoundError("missing", "task"), 404, "task_not_found"],
    [
      new InvalidTaskTransitionError("task", "ready", "awaiting-authority"),
      409,
      "invalid_transition",
    ],
    [new CompletionProofRequiredError("task"), 409, "completion_proof_required"],
  ])("maps %s to %i", async (error, status, code) => {
    const response = errorResponse(error);

    expect(response.status).toBe(status);
    await expect(response.json()).resolves.toMatchObject({
      error: { code, message: expect.any(String) },
    });
  });

  it("does not leak unexpected error details", async () => {
    const response = errorResponse(new Error("/private/path secret stack"));

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({
      error: {
        code: "internal_error",
        message: "The server could not complete the request.",
      },
    });
  });
});
