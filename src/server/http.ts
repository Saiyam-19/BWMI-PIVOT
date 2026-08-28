import { z } from "zod";

import {
  PrivacyViolationError,
  RoadmapNotFoundError,
  UnsafeAiSelectionError,
} from "../application.js";
import type { NavigatorApplication } from "../application.js";
import {
  CompletionProofRequiredError,
  InvalidTaskTransitionError,
  UnknownOutcomeError,
} from "../engine.js";
import { apiErrorResponse } from "../lib/api.js";

const answerValueSchema = z.union([
  z.string(),
  z.number(),
  z.boolean(),
  z.array(z.string()),
  z.null(),
]);

const answersSchema = z.record(z.string(), answerValueSchema);

const entrySchema = z.discriminatedUnion("kind", [
  z.strictObject({
    kind: z.literal("natural-language"),
    text: z.string().trim().min(1),
  }),
  z.strictObject({
    kind: z.literal("browse"),
    outcomeId: z.string().trim().min(1),
  }),
]);

export const createRoadmapRequestSchema = z.strictObject({
  entry: entrySchema,
  answers: answersSchema.optional(),
});

export const answersRequestSchema = z.strictObject({
  answers: answersSchema,
});

export const taskTransitionRequestSchema = z.strictObject({
  to: z.enum(["in-progress", "awaiting-authority", "completed"]),
  proofConfirmed: z.boolean().optional(),
});

export class TaskNotFoundError extends Error {
  public constructor(roadmapId: string, taskId: string) {
    super(`Task ${taskId} was not found in roadmap ${roadmapId}.`);
    this.name = "TaskNotFoundError";
  }
}

type ParsedJson<T> =
  | Readonly<{ ok: true; data: T }>
  | Readonly<{ ok: false; response: Response }>;

function invalidRequestResponse(
  fieldErrors?: Readonly<Record<string, readonly string[]>>,
): Response {
  return apiErrorResponse(400, {
    code: "invalid_request",
    message: "The request body is invalid.",
    ...(fieldErrors && Object.keys(fieldErrors).length > 0
      ? { fieldErrors }
      : {}),
  });
}

export async function parseJsonBody<T>(
  request: Request,
  schema: z.ZodType<T>,
): Promise<ParsedJson<T>> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return { ok: false, response: invalidRequestResponse() };
  }

  const result = schema.safeParse(body);
  if (!result.success) {
    const flattened = z.flattenError(result.error).fieldErrors;
    const fieldErrors: Record<string, readonly string[]> = {};
    for (const [field, messages] of Object.entries(flattened)) {
      if (Array.isArray(messages)) fieldErrors[field] = messages as string[];
    }
    return {
      ok: false,
      response: invalidRequestResponse(fieldErrors),
    };
  }
  return { ok: true, data: result.data };
}

export async function loadRoadmapOrThrow(
  application: NavigatorApplication,
  roadmapId: string,
) {
  const roadmap = await application.load(roadmapId);
  if (!roadmap) throw new RoadmapNotFoundError(roadmapId);
  return roadmap;
}

export function assertRoadmapTaskExists(
  roadmapId: string,
  taskId: string,
  taskIds: readonly string[],
): void {
  if (!taskIds.includes(taskId)) {
    throw new TaskNotFoundError(roadmapId, taskId);
  }
}

export function errorResponse(error: unknown): Response {
  if (error instanceof PrivacyViolationError) {
    return apiErrorResponse(400, {
      code: "privacy_violation",
      message: error.message,
    });
  }
  if (error instanceof RoadmapNotFoundError) {
    return apiErrorResponse(404, {
      code: "roadmap_not_found",
      message: error.message,
    });
  }
  if (error instanceof TaskNotFoundError) {
    return apiErrorResponse(404, {
      code: "task_not_found",
      message: error.message,
    });
  }
  if (
    error instanceof UnsafeAiSelectionError ||
    error instanceof UnknownOutcomeError
  ) {
    return apiErrorResponse(422, {
      code: "unsafe_intent",
      message: error.message,
    });
  }
  if (error instanceof CompletionProofRequiredError) {
    return apiErrorResponse(409, {
      code: "completion_proof_required",
      message: error.message,
    });
  }
  if (error instanceof InvalidTaskTransitionError) {
    return apiErrorResponse(409, {
      code: "invalid_transition",
      message: error.message,
    });
  }
  return apiErrorResponse(500, {
    code: "internal_error",
    message: "The server could not complete the request.",
  });
}
