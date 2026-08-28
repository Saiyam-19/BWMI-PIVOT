import type {
  AnswerValue,
  EntryPoint,
  QuestionDefinition,
  Roadmap,
  TaskTransition,
} from "../domain.js";
import type { PublicOutcomeSummary } from "../server/navigator.js";

export interface OutcomeCatalog {
  readonly outcomes: readonly PublicOutcomeSummary[];
  readonly domains: readonly string[];
}

export interface ClientRoadmapQuestion extends Pick<
  QuestionDefinition,
  "id" | "factKey" | "prompt" | "reason" | "answerType" | "options" | "resolutionMode" | "unsupportedReason"
> {
  readonly blocksTaskIds: readonly string[];
}

export interface ClientRoadmap {
  readonly id: string;
  readonly outcomeId: string;
  readonly outcomeTitle: string;
  readonly status: "ready" | "needs-information" | "blocked" | "completed";
  readonly questions: readonly ClientRoadmapQuestion[];
}

interface ApiErrorPayload {
  readonly error?: {
    readonly code?: string;
    readonly message?: string;
    readonly fieldErrors?: Readonly<Record<string, readonly string[]>>;
  };
}

export class ClientApiError extends Error {
  public readonly code: string;
  public readonly status: number;
  public readonly fieldErrors?: Readonly<Record<string, readonly string[]>>;

  public constructor(
    status: number,
    code: string,
    message: string,
    fieldErrors?: Readonly<Record<string, readonly string[]>>,
  ) {
    super(message);
    this.name = "ClientApiError";
    this.status = status;
    this.code = code;
    if (fieldErrors) this.fieldErrors = fieldErrors;
  }
}

async function decodeEnvelope<T>(response: Response): Promise<T> {
  let payload: unknown;
  try {
    payload = await response.json();
  } catch {
    throw new ClientApiError(
      response.status,
      "invalid_response",
      "The navigator returned an unreadable response. Please try again.",
    );
  }

  if (!response.ok) {
    const body = payload as ApiErrorPayload;
    throw new ClientApiError(
      response.status,
      body.error?.code ?? "request_failed",
      body.error?.message ?? "The navigator could not complete that request.",
      body.error?.fieldErrors,
    );
  }

  if (typeof payload !== "object" || payload === null || !("data" in payload)) {
    throw new ClientApiError(
      response.status,
      "invalid_response",
      "The navigator returned an incomplete response. Please try again.",
    );
  }

  return (payload as { data: T }).data;
}

export async function loadOutcomeCatalog(): Promise<OutcomeCatalog> {
  const response = await fetch("/api/outcomes", {
    headers: { accept: "application/json" },
  });
  return decodeEnvelope<OutcomeCatalog>(response);
}

export async function createRoadmap(entry: EntryPoint): Promise<ClientRoadmap> {
  const response = await fetch("/api/roadmaps", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ entry }),
  });
  return decodeEnvelope<ClientRoadmap>(response);
}

export async function updateRoadmapAnswers(
  roadmapId: string,
  answers: Readonly<Record<string, AnswerValue>>,
): Promise<Roadmap> {
  const response = await fetch(
    `/api/roadmaps/${encodeURIComponent(roadmapId)}/answers`,
    {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ answers }),
    },
  );
  return decodeEnvelope<Roadmap>(response);
}

export async function transitionRoadmapTask(
  roadmapId: string,
  taskId: string,
  transition: TaskTransition,
): Promise<Roadmap> {
  const response = await fetch(
    `/api/roadmaps/${encodeURIComponent(roadmapId)}/tasks/${encodeURIComponent(taskId)}`,
    {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(transition),
    },
  );
  return decodeEnvelope<Roadmap>(response);
}
