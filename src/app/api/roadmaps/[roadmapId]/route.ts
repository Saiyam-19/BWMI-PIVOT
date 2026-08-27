import { dataResponse } from "@/lib/api";
import { errorResponse, loadRoadmapOrThrow } from "@/server/http";
import { getNavigatorApplication } from "@/server/navigator";

interface RoadmapRouteContext {
  readonly params: Promise<Readonly<{ roadmapId: string }>>;
}

export async function GET(
  _request: Request,
  { params }: RoadmapRouteContext,
): Promise<Response> {
  try {
    const { roadmapId } = await params;
    const roadmap = await loadRoadmapOrThrow(
      getNavigatorApplication(),
      roadmapId,
    );
    return dataResponse(roadmap);
  } catch (error) {
    return errorResponse(error);
  }
}
