"use client";

import { ArrowLeft, CheckCircle2, Map, Rows3 } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { LinearRoadmap } from "@/components/roadmap/linear-roadmap";
import { RoadmapCanvas } from "@/components/roadmap/roadmap-canvas";
import { RoadmapPersonalization } from "@/components/roadmap/roadmap-personalization";
import { TaskDetailSheet } from "@/components/roadmap/task-detail-sheet";
import { SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Roadmap } from "@/domain";
import { projectRoadmapGraph } from "@/lib/roadmap-graph";

interface RoadmapWorkspaceProps {
  readonly initialRoadmap: Roadmap;
}

export function RoadmapWorkspace({ initialRoadmap }: RoadmapWorkspaceProps) {
  const [roadmap, setRoadmap] = useState(initialRoadmap);
  const [selectedTaskId, setSelectedTaskId] = useState<string>();
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const graph = useMemo(() => projectRoadmapGraph(roadmap), [roadmap]);
  const completed = roadmap.tasks.filter((task) => task.status === "completed").length;
  const progress = roadmap.tasks.length === 0 ? 0 : (completed / roadmap.tasks.length) * 100;
  const selectedTask = roadmap.tasks.find((task) => task.id === selectedTaskId);
  const selectTask = useCallback((taskId: string) => {
    if (document.activeElement instanceof HTMLElement) {
      returnFocusRef.current = document.activeElement;
    }
    setSelectedTaskId(taskId);
  }, []);

  useEffect(() => {
    if (!selectedTaskId) returnFocusRef.current?.focus({ preventScroll: true });
  }, [selectedTaskId]);

  return (
    <div id="top" className="min-h-screen bg-[#eef1f5] text-[#172033]">
      <SiteHeader />
      <main>
        <div className="mx-auto w-full max-w-[96rem] px-4 pb-0 pt-4 sm:px-6 sm:pt-7 lg:px-8">
          <a
            href="/"
            className="inline-flex min-h-11 items-center gap-2 rounded-sm text-sm font-medium text-[#1d4f91] outline-none hover:underline focus-visible:ring-2 focus-visible:ring-[#2454a6]"
          >
            <ArrowLeft aria-hidden="true" className="size-4" />
            Back to outcomes
          </a>
          <div className="mt-2 grid gap-4 border border-slate-300 bg-white px-4 py-4 shadow-[0_10px_28px_rgba(15,23,42,0.06)] sm:mt-3 sm:gap-5 sm:px-7 sm:py-5 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-end">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline" className="border-[#2454a6] bg-[#eaf2ff] text-[#173f7a]">
                  {roadmap.status.replaceAll("-", " ")}
                </Badge>
                <span className="text-sm text-slate-600">Private local roadmap</span>
              </div>
              <h1 className="mt-2 max-w-4xl text-[1.35rem] font-bold leading-[1.16] tracking-[-0.035em] text-[#101a2e] sm:mt-3 sm:text-4xl sm:leading-tight">
                {roadmap.outcomeTitle}
              </h1>
              <p className="mt-2 max-w-[70ch] text-[0.8125rem] leading-5 text-slate-600 sm:mt-3 sm:text-base sm:leading-6">
                Follow the dependency path, open a task for its verified portal or offline journey, and confirm the expected proof before completion.
              </p>
              <div className="mt-4">
                <RoadmapPersonalization roadmap={roadmap} onRoadmapUpdated={setRoadmap} />
              </div>
            </div>
            <div className="border-t border-slate-200 pt-3 sm:pt-4 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
              <div className="flex items-center justify-between gap-4 text-sm">
                <span className="font-semibold text-[#172033]">{completed} of {roadmap.tasks.length} tasks completed</span>
                <span className="tabular-nums text-slate-500">{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="mt-3 h-2.5 bg-slate-200 [&_[data-slot=progress-indicator]]:bg-emerald-600" />
              <p className="mt-3 flex items-center gap-2 text-xs leading-5 text-slate-500">
                <CheckCircle2 aria-hidden="true" className="size-4 text-emerald-700" />
                {graph.excludedCount} excluded by your answers
              </p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="canvas" className="mx-auto mt-3 w-full max-w-[96rem] gap-0 sm:mt-4 sm:px-6 lg:px-8">
          <div className="px-4 sm:px-0">
            <TabsList variant="line" aria-label="Roadmap views" className="h-11">
              <TabsTrigger value="canvas" className="min-h-11 px-4">
                <Map aria-hidden="true" />
                Roadmap view
              </TabsTrigger>
              <TabsTrigger value="linear" className="min-h-11 px-4">
                <Rows3 aria-hidden="true" />
                Accessible list
              </TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="canvas" className="mt-2">
            <RoadmapCanvas model={graph} selectedTaskId={selectedTaskId ?? null} onSelectTask={selectTask} />
          </TabsContent>
          <TabsContent value="linear" className="mt-2 border-y border-slate-300 bg-white sm:border">
            <LinearRoadmap model={graph} onSelectTask={selectTask} />
          </TabsContent>
        </Tabs>
      </main>

      <TaskDetailSheet
        open={Boolean(selectedTask)}
        roadmapId={roadmap.id}
        task={selectedTask}
        tasks={roadmap.tasks}
        onOpenChange={(open) => {
          if (!open) setSelectedTaskId(undefined);
        }}
        onRoadmapUpdated={setRoadmap}
      />
    </div>
  );
}
