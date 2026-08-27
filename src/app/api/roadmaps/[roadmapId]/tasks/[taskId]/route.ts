import { dataResponse } from "@/lib/api";
import {
  assertRoadmapTaskExists,
  errorResponse,
  loadRoadmapOrThrow,
  parseJsonBody,
  taskTransitionRequestSchema,
} from "@/server/http";
import { getNavigatorApplication } from "@/server/navigator";

interface TaskRouteContext {
  readonly params: Promise<
    Readonly<{ roadmapId: string; taskId: string }>
  >;
}

export async function PATCH(
  request: Request,
  { params }: TaskRouteContext,
): Promise<Response> {
  try {
    const parsed = await parseJsonBody(request, taskTransitionRequestSchema);
    if (!parsed.ok) return parsed.response;
    const { roadmapId, taskId } = await params;
    const application = getNavigatorApplication();
    const current = await loadRoadmapOrThrow(application, roadmapId);
    assertRoadmapTaskExists(
      roadmapId,
      taskId,
      current.tasks.map((task) => task.id),
    );
    const { to, proofConfirmed } = parsed.data;
    const roadmap = await application.transition(roadmapId, taskId, {
      to,
      ...(proofConfirmed === undefined ? {} : { proofConfirmed }),
    });
    return dataResponse(roadmap);
  } catch (error) {
    return errorResponse(error);
  }
}
