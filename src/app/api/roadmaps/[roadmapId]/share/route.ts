import { dataResponse } from "@/lib/api";
import { errorResponse, loadRoadmapOrThrow } from "@/server/http";
import { getNavigatorApplication } from "@/server/navigator";
import { toShareableRoadmap } from "@/persistence";

interface ShareRouteContext {
  readonly params: Promise<Readonly<{ roadmapId: string }>>;
}

export async function GET(
  _request: Request,
  { params }: ShareRouteContext,
): Promise<Response> {
  try {
    const { roadmapId } = await params;
    const roadmap = await loadRoadmapOrThrow(
      getNavigatorApplication(),
      roadmapId,
    );
    return dataResponse(toShareableRoadmap(roadmap));
  } catch (error) {
    return errorResponse(error);
  }
}
