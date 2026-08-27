import { dataResponse } from "@/lib/api";
import {
  createRoadmapRequestSchema,
  errorResponse,
  parseJsonBody,
} from "@/server/http";
import { getNavigatorApplication } from "@/server/navigator";

export async function POST(request: Request): Promise<Response> {
  try {
    const parsed = await parseJsonBody(request, createRoadmapRequestSchema);
    if (!parsed.ok) return parsed.response;
    const { entry, answers } = parsed.data;
    const roadmap = await getNavigatorApplication().start({
      entry,
      ...(answers ? { answers } : {}),
    });
    return dataResponse(roadmap, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}
