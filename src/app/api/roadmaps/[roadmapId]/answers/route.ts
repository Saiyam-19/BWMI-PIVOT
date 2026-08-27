import { dataResponse } from "@/lib/api";
import {
  answersRequestSchema,
  errorResponse,
  parseJsonBody,
} from "@/server/http";
import { getNavigatorApplication } from "@/server/navigator";

interface AnswersRouteContext {
  readonly params: Promise<Readonly<{ roadmapId: string }>>;
}

export async function PATCH(
  request: Request,
  { params }: AnswersRouteContext,
): Promise<Response> {
  try {
    const parsed = await parseJsonBody(request, answersRequestSchema);
    if (!parsed.ok) return parsed.response;
    const { roadmapId } = await params;
    const roadmap = await getNavigatorApplication().answer(
      roadmapId,
      parsed.data.answers,
    );
    return dataResponse(roadmap);
  } catch (error) {
    return errorResponse(error);
  }
}
