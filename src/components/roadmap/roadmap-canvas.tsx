"use client";

import {
  ArrowDown,
  Check,
  CircleAlert,
  CircleDashed,
  Clock3,
  CornerDownRight,
  FileQuestion,
  Flag,
  LoaderCircle,
  LockKeyhole,
  type LucideIcon,
} from "lucide-react";
import { useLayoutEffect, useMemo, useRef, useState, type RefObject } from "react";

import {
  ROADMAP_STATUS_CLASSES,
  ROADMAP_STATUS_LABELS,
  type RoadmapNodeStatus,
} from "@/components/roadmap/roadmap-status";
import type { RoadmapGraphEdge, RoadmapGraphModel, RoadmapGraphNode } from "@/lib/roadmap-graph";
import { cn } from "@/lib/utils";

type RoadmapCanvasProps = {
  model: RoadmapGraphModel;
  selectedTaskId: string | null;
  onSelectTask: (taskId: string) => void;
};

function roadmapStages(model: RoadmapGraphModel): RoadmapGraphNode[][] {
  const taskNodes = model.nodes.filter((node) => node.kind === "task");
  const taskIds = new Set(taskNodes.map((node) => node.id));
  const parents = new Map<string, string[]>();

  for (const edge of model.edges) {
    if (!taskIds.has(edge.target) || !taskIds.has(edge.source)) continue;
    parents.set(edge.target, [...(parents.get(edge.target) ?? []), edge.source]);
  }

  const depths = new Map<string, number>();
  const visiting = new Set<string>();
  const depthFor = (nodeId: string): number => {
    const cached = depths.get(nodeId);
    if (cached !== undefined) return cached;
    if (visiting.has(nodeId)) return 0;

    visiting.add(nodeId);
    const parentIds = parents.get(nodeId) ?? [];
    const depth = parentIds.length === 0 ? 0 : Math.max(...parentIds.map(depthFor)) + 1;
    visiting.delete(nodeId);
    depths.set(nodeId, depth);
    return depth;
  };

  const grouped = new Map<number, RoadmapGraphNode[]>();
  for (const node of taskNodes) {
    const depth = depthFor(node.id);
    grouped.set(depth, [...(grouped.get(depth) ?? []), node]);
  }

  return [...grouped.entries()]
    .sort(([left], [right]) => left - right)
    .map(([, nodes]) => nodes.sort((left, right) => left.title.localeCompare(right.title)));
}

function TaskTile({
  node,
  dependencies,
  selected,
  onSelect,
}: {
  node: RoadmapGraphNode;
  dependencies: readonly RoadmapGraphNode[];
  selected: boolean;
  onSelect: () => void;
}) {
  const locked = node.actionability === "withheld";
  const status = node.status ?? "not-started";
  const StatusIcon = statusIcons[status];
  const dependencyLabel = dependencies.length > 0
    ? `After ${dependencies.map((dependency) => dependency.title).join("; ")}`
    : "Starts from selected outcome";

  return (
    <button
      type="button"
      onClick={onSelect}
      data-task-id={node.id}
      data-roadmap-node-id={node.id}
      data-depends-on={dependencies.map((dependency) => dependency.id).join(" ")}
      data-status={status}
      data-state-tone={status}
      className={cn(
        "group relative w-full rounded-sm border-2 border-l-[6px] border-slate-950 px-3 py-2 text-left shadow-[3px_3px_0_#0f172a] transition",
        "hover:-translate-y-0.5 hover:brightness-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2",
        ROADMAP_STATUS_CLASSES[status],
        selected && "bg-[#ffe69a] ring-2 ring-blue-700 ring-offset-2",
      )}
      aria-pressed={selected}
      aria-label={`${node.title}. ${ROADMAP_STATUS_LABELS[status]}. ${dependencyLabel}${locked ? ". Instructions withheld" : ""}`}
    >
      <span className="block text-sm font-bold leading-snug text-slate-950">{node.title}</span>
      <span className="mt-1 flex items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.08em]">
        <StatusIcon className={cn("size-3", status === "in-progress" && "animate-spin")} aria-hidden="true" />
        {locked ? <LockKeyhole className="size-3" aria-hidden="true" /> : null}
        {ROADMAP_STATUS_LABELS[status]}
      </span>
      <span className="mt-2 flex items-start gap-1.5 text-[11px] leading-4 text-slate-700">
        <CornerDownRight className="mt-0.5 size-3 shrink-0 text-blue-700" aria-hidden="true" />
        <span>{dependencyLabel}</span>
      </span>
    </button>
  );
}

type ConnectorPath = Readonly<{
  edge: RoadmapGraphEdge;
  d: string;
}>;
type ConnectorGeometry = Readonly<{
  width: number;
  height: number;
  paths: readonly ConnectorPath[];
}>;

function boundaryPath(
  source: DOMRect,
  target: DOMRect,
  frame: DOMRect,
  spineX: number,
  laneIndex: number,
): string {
  const from = {
    left: source.left - frame.left,
    right: source.right - frame.left,
    top: source.top - frame.top,
    bottom: source.bottom - frame.top,
    centerX: source.left - frame.left + source.width / 2,
    centerY: source.top - frame.top + source.height / 2,
  };
  const to = {
    left: target.left - frame.left,
    right: target.right - frame.left,
    top: target.top - frame.top,
    bottom: target.bottom - frame.top,
    centerX: target.left - frame.left + target.width / 2,
    centerY: target.top - frame.top + target.height / 2,
  };
  const laneOffset = ((laneIndex % 11) - 5) * 2.5;
  const hubX = spineX + laneOffset;
  const travelsDown = to.centerY >= from.centerY;
  const anchor = (
    rect: typeof from,
    outgoing: boolean,
  ): Readonly<{ x: number; y: number }> => {
    if (hubX >= rect.left && hubX <= rect.right) {
      return { x: hubX, y: travelsDown === outgoing ? rect.bottom : rect.top };
    }
    return {
      x: hubX < rect.left ? rect.left : rect.right,
      y: rect.centerY,
    };
  };
  const start = anchor(from, true);
  const end = anchor(to, false);
  const verticalDistance = Math.abs(end.y - start.y);
  const turn = Math.min(28, Math.max(12, verticalDistance / 5));
  const startLaneY = start.y + (travelsDown ? turn : -turn);
  const endLaneY = end.y + (travelsDown ? -turn : turn);

  return `M ${start.x} ${start.y} C ${hubX} ${start.y}, ${hubX} ${startLaneY}, ${hubX} ${startLaneY} L ${hubX} ${endLaneY} C ${hubX} ${endLaneY}, ${hubX} ${end.y}, ${end.x} ${end.y}`;
}

function useConnectorGeometry(
  {
    edges,
    frameRef,
  }: Readonly<{
  edges: readonly RoadmapGraphEdge[];
  frameRef: RefObject<HTMLDivElement | null>;
}>): ConnectorGeometry {
  const [geometry, setGeometry] = useState<ConnectorGeometry>({
    width: 1,
    height: 1,
    paths: [],
  });

  useLayoutEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;

    const measure = () => {
      const frameRect = frame.getBoundingClientRect();
      const nodes = [...frame.querySelectorAll<HTMLElement>("[data-roadmap-node-id]")];
      const spine = frame.querySelector<HTMLElement>("[data-roadmap-spine]");
      const spineRect = spine?.getBoundingClientRect();
      const spineX = spineRect
        ? spineRect.left - frameRect.left + spineRect.width / 2
        : frameRect.width / 2;
      const paths = edges.flatMap((edge, laneIndex) => {
        const source = nodes.find((node) => node.dataset.roadmapNodeId === edge.source);
        const target = nodes.find((node) => node.dataset.roadmapNodeId === edge.target);
        return source && target
          ? [{
              edge,
              d: boundaryPath(
                source.getBoundingClientRect(),
                target.getBoundingClientRect(),
                frameRect,
                spineX,
                laneIndex,
              ),
            }]
          : [];
      });
      setGeometry({
        width: Math.max(frame.clientWidth, 1),
        height: Math.max(frame.scrollHeight, 1),
        paths,
      });
    };

    measure();
    const animationFrame = requestAnimationFrame(measure);
    const observer = typeof ResizeObserver === "undefined" ? undefined : new ResizeObserver(measure);
    observer?.observe(frame);
    frame.querySelectorAll<HTMLElement>("[data-roadmap-node-id]").forEach((node) => observer?.observe(node));
    window.addEventListener("resize", measure);
    return () => {
      cancelAnimationFrame(animationFrame);
      observer?.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [edges, frameRef]);

  return geometry;
}

function RoadmapConnectors({ geometry }: { geometry: ConnectorGeometry }) {
  return (
    <svg
      data-roadmap-connectors="true"
      aria-hidden="true"
      viewBox={`0 0 ${geometry.width} ${geometry.height}`}
      preserveAspectRatio="none"
      width={geometry.width}
      height={geometry.height}
      className="pointer-events-none absolute left-0 top-0 z-[5] overflow-hidden text-blue-700"
      style={{ width: geometry.width, height: geometry.height }}
      fill="none"
    >
      {geometry.paths.map(({ edge, d }) => (
        <path
          key={edge.id}
          data-roadmap-edge={edge.id}
          data-edge-source={edge.source}
          data-edge-target={edge.target}
          d={d}
          stroke="currentColor"
          strokeWidth={edge.kind === "outcome" ? 3 : 2}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={edge.kind === "conditional" || edge.kind === "excluded" ? "5 5" : undefined}
          vectorEffect="non-scaling-stroke"
        />
      ))}
    </svg>
  );
}

const statusIcons: Readonly<Record<RoadmapNodeStatus, LucideIcon>> = {
  "needs-information": FileQuestion,
  "not-started": CircleDashed,
  ready: Flag,
  blocked: LockKeyhole,
  "in-progress": LoaderCircle,
  "awaiting-authority": Clock3,
  completed: Check,
  "not-applicable": CircleAlert,
};

function TaskBranch({
  nodes,
  dependenciesByTaskId,
  side,
  selectedTaskId,
  onSelectTask,
}: {
  nodes: RoadmapGraphNode[];
  dependenciesByTaskId: ReadonlyMap<string, readonly RoadmapGraphNode[]>;
  side: "left" | "right";
  selectedTaskId: string | null;
  onSelectTask: (taskId: string) => void;
}) {
  return (
    <div
      className={cn(
        "relative grid gap-4 pl-12 md:pl-0",
        side === "left" ? "md:pr-12" : "md:pl-12",
      )}
    >
      {nodes.map((node) => (
        <TaskTile
          key={node.id}
          node={node}
          dependencies={dependenciesByTaskId.get(node.id) ?? []}
          selected={selectedTaskId === node.id}
          onSelect={() => onSelectTask(node.id)}
        />
      ))}
    </div>
  );
}

export function RoadmapCanvas({ model, selectedTaskId, onSelectTask }: RoadmapCanvasProps) {
  const connectorFrameRef = useRef<HTMLDivElement>(null);
  const connectorGeometry = useConnectorGeometry({ edges: model.edges, frameRef: connectorFrameRef });
  const stages = useMemo(() => roadmapStages(model), [model]);
  const dependenciesByTaskId = useMemo(() => {
    const tasksById = new Map(
      model.nodes.filter((node) => node.kind === "task").map((node) => [node.id, node]),
    );
    const dependencies = new Map<string, RoadmapGraphNode[]>();
    for (const edge of model.edges) {
      const source = tasksById.get(edge.source);
      if (!source || !tasksById.has(edge.target)) continue;
      dependencies.set(edge.target, [...(dependencies.get(edge.target) ?? []), source]);
    }
    return dependencies;
  }, [model]);
  const outcome = model.nodes.find((node) => node.kind === "outcome");
  const state = model.nodes.find((node) => node.kind === "state");
  const excluded = model.nodes.filter((node) => node.kind === "excluded");

  return (
    <section
      aria-label="Interactive roadmap"
      className="roadmap-document relative overflow-hidden rounded-2xl border border-slate-300 bg-white px-4 py-8 shadow-sm sm:px-8 md:px-12 md:py-12"
    >
      <div className="mx-auto max-w-5xl">
        <div className="mb-10 flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
            Read from top to bottom
          </p>
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs font-medium text-slate-600">
            <span className="inline-flex items-center gap-2">
              <span className="size-3 rounded-full bg-blue-700" aria-hidden="true" /> Main journey
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="h-px w-5 border-t-2 border-dotted border-slate-700" aria-hidden="true" /> Task branch
            </span>
          </div>
        </div>

        <div ref={connectorFrameRef} data-roadmap-connector-frame="true" className="relative pb-12">
          <RoadmapConnectors geometry={connectorGeometry} />
          <span
            aria-hidden="true"
            data-roadmap-spine="true"
            className="absolute bottom-0 left-5 top-6 w-1 rounded-full bg-blue-700 md:left-1/2 md:-translate-x-1/2"
          />

          <div
            data-roadmap-node-id={outcome?.id}
            className="relative z-10 mx-auto mb-16 ml-12 max-w-xl rounded-sm border-2 border-slate-950 bg-white px-5 py-4 text-center shadow-[4px_4px_0_#0f172a] md:ml-auto"
          >
            <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-blue-700">Your outcome</p>
            <h2 className="mt-1 text-xl font-black tracking-tight text-slate-950 sm:text-2xl">
              {outcome?.title ?? "Government outcome roadmap"}
            </h2>
            {outcome?.summary ? <p className="mt-2 text-sm text-slate-600">{outcome.summary}</p> : null}
          </div>

          {stages.length > 0 ? (
            <ol className="grid gap-14 md:gap-20">
              {stages.map((nodes, index) => {
                const side = index % 2 === 0 ? "left" : "right";
                const centerLabel = index === 0 ? "Start here" : index === stages.length - 1 ? "Finish this stage" : "Continue the path";

                return (
                  <li key={`stage-${index}`} className="relative grid items-start gap-5 md:grid-cols-[minmax(0,1fr)_9rem_minmax(0,1fr)]">
                    <div className={cn("md:col-start-1", side === "right" && "md:col-start-3")}>
                      <TaskBranch
                        nodes={nodes}
                        dependenciesByTaskId={dependenciesByTaskId}
                        side={side}
                        selectedTaskId={selectedTaskId}
                        onSelectTask={onSelectTask}
                      />
                    </div>

                    <div className="absolute left-0 top-0 z-20 flex w-11 flex-col items-center md:static md:col-start-2 md:row-start-1 md:w-auto">
                      <span className="flex size-11 items-center justify-center rounded-full border-2 border-slate-950 bg-[#ffd95a] text-sm font-black text-slate-950 shadow-[2px_2px_0_#0f172a]">
                        {index + 1}
                      </span>
                      <span className="mt-2 hidden rounded-sm bg-blue-700 px-2 py-1 text-center text-[10px] font-extrabold uppercase tracking-[0.08em] text-white md:block">
                        {centerLabel}
                      </span>
                      {index < stages.length - 1 ? <ArrowDown className="mt-3 hidden size-4 text-blue-700 md:block" aria-hidden="true" /> : null}
                    </div>
                  </li>
                );
              })}
            </ol>
          ) : state ? (
            <div
              data-roadmap-node-id={state.id}
              className="relative z-10 ml-12 rounded-sm border-2 border-slate-950 bg-[#fff7dc] p-5 shadow-[3px_3px_0_#0f172a] md:mx-auto md:max-w-xl"
            >
              <div className="flex gap-3">
                <CircleAlert className="mt-0.5 size-5 shrink-0 text-blue-700" aria-hidden="true" />
                <div>
                  <h3 className="font-black text-slate-950">{state.title}</h3>
                  {state.summary ? <p className="mt-1 text-sm leading-6 text-slate-700">{state.summary}</p> : null}
                </div>
              </div>
            </div>
          ) : null}

          {excluded.length > 0 ? (
            <aside className="relative z-10 mt-16 ml-12 rounded-lg border border-dashed border-slate-400 bg-slate-50 p-5 md:mx-auto md:max-w-2xl">
              <h3 className="font-black text-slate-950">Branches currently marked not applicable</h3>
              <p className="mt-1 text-sm text-slate-600">
                They remain visible so the roadmap never becomes blank and you can review why they were set aside.
              </p>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {excluded.map((node) => (
                  <li
                    key={node.id}
                    data-excluded-task-id={node.id.replace(/^excluded:/, "")}
                    data-roadmap-node-id={node.id}
                    className="rounded-sm border border-slate-300 bg-white px-3 py-2"
                  >
                    <span className="block text-sm font-bold text-slate-800">{node.title}</span>
                    {node.summary ? <span className="mt-1 block text-xs leading-5 text-slate-600">{node.summary}</span> : null}
                  </li>
                ))}
              </ul>
            </aside>
          ) : null}
        </div>
      </div>
    </section>
  );
}
