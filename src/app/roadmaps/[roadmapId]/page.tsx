import { notFound } from "next/navigation.js";

import { RoadmapWorkspace } from "@/components/roadmap/roadmap-workspace";
import { getNavigatorApplication } from "@/server/navigator";

interface RoadmapPageProps {
  readonly params: Promise<Readonly<{ roadmapId: string }>>;
}

export default async function RoadmapPage({ params }: RoadmapPageProps) {
  const { roadmapId } = await params;
  const roadmap = await getNavigatorApplication().load(roadmapId);
  if (!roadmap) notFound();

  return <RoadmapWorkspace initialRoadmap={roadmap} />;
}
