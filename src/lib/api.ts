export interface ApiSuccessEnvelope<T> {
  readonly data: T;
}

export interface ApiErrorBody {
  readonly code: string;
  readonly message: string;
  readonly fieldErrors?: Readonly<Record<string, readonly string[]>>;
}

export interface ApiErrorEnvelope {
  readonly error: ApiErrorBody;
}

export function dataResponse<T>(data: T, init?: ResponseInit): Response {
  return Response.json({ data } satisfies ApiSuccessEnvelope<T>, init);
}

export function apiErrorResponse(
  status: number,
  error: ApiErrorBody,
): Response {
  return Response.json({ error } satisfies ApiErrorEnvelope, { status });
}
