# Government Outcome Navigator Web App Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Turn the verified headless India government-outcome engine into a working roadmap.sh-inspired web app where users discover an outcome, answer graph-changing questions, navigate a dependency roadmap, inspect verified portal journeys, and track completion.

**Architecture:** Preserve `src/` as the framework-independent, fail-closed domain core. Add a Next.js App Router web shell in `src/app`, a server-only application singleton that uses `FileRoadmapRepository`, thin route handlers that validate JSON at the boundary, and client components only for interactive selection, intake, graph navigation, and task progress. The graph projection converts `RoadmapTask.dependencies` into React Flow nodes/edges and lays them out top-to-bottom with Dagre. Standard interface primitives come from shadcn/ui; project-specific roadmap nodes and edges remain domain components.

**Tech Stack:** TypeScript, pnpm, current stable Next.js App Router, React, Tailwind CSS, shadcn/ui with Radix primitives, `@xyflow/react`, `@dagrejs/dagre`, Zod boundary schemas, Vitest, Testing Library, Playwright, and local JSON persistence.

## Global constraints

- Work directly on `main` in `/Users/saiyamchaplot/Documents/ChatGPT/BWMI-PIVOT`; each task starts from the previous task's commit and produces exactly one scoped commit.
- Never weaken the claim admission, jurisdiction, privacy, task transition, or completion-proof rules in `src/`.
- Never expose `node:fs`, raw pack loading, user answers, or proof confirmation in client bundles or share responses.
- Do not revive the stashed Convex work. No authentication, live AI provider, uploads, portal automation, payments, admin CMS, or application submission.
- Use `pnpm`, not npm. Add shadcn components through the CLI and customise their checked-in source; do not recreate standard primitives.
- Use the roadmap.sh Software Architect page as a layout and interaction reference, not as a source of branding or copy.
- Every API returns a stable JSON envelope: `{ data: T }` on success; `{ error: { code, message, fieldErrors? } }` on failure.
- Every task follows red-green-refactor where meaningful, runs its focused tests, runs `pnpm check`, and leaves the tree clean after its commit.
- Before starting any dev server, inspect existing Node processes and listeners, reuse a compatible instance, and track/clean only task-owned processes.

## Settled batch-grill decisions

- The first release exposes all seven admitted outcomes rather than a shallow directory of basic document services.
- Browse entry begins with user-facing domains. Ministry/authority is metadata and an optional filter, not required knowledge.
- Natural-language entry and browse entry converge on the same roadmap engine.
- Intake is conditional and skippable; unknown answers fail closed and stay editable from the roadmap.
- The roadmap shows the applicable path by default, preserves excluded-task reasoning, and uses dependencies instead of a forced checklist.
- A node opens a detailed journey surface with action, reason, authority, prerequisites, information/documents, exact steps, official links, evidence, blockers, help, and proof.
- Progress is private local demo state. Sharing is a redacted read-only JSON/export seam, not a public collaborative account feature.
- The reference UI is pinned: restrained light document canvas, dark navy header, black outlined nodes, yellow active/primary nodes, gray future nodes, green completed nodes, pale red action-required nodes, blue dependency connectors, right-side detail sheet on desktop, full-height sheet on mobile.
- The app is functional without a model provider. A future AI provider may interpret intent and propose approved registry IDs but cannot invent tasks or claims.

## Public application contracts

### Routes

- `GET /` — outcome discovery and natural-language entry.
- `GET /roadmaps/[roadmapId]` — server-load a roadmap and render the interactive canvas.
- `GET /api/outcomes?domain=` — return public outcome summaries and distinct domains.
- `POST /api/roadmaps` — accept `{ entry, answers? }`, create a roadmap, return it.
- `GET /api/roadmaps/[roadmapId]` — return the private roadmap for the current local demo.
- `PATCH /api/roadmaps/[roadmapId]/answers` — accept `{ answers }`, rebuild, return the roadmap.
- `PATCH /api/roadmaps/[roadmapId]/tasks/[taskId]` — accept a validated `TaskTransition`, return the roadmap.
- `GET /api/roadmaps/[roadmapId]/share` — return `toShareableRoadmap(roadmap)` with no answers or proof confirmations.

### Server composition

Create `src/server/navigator.ts` with a `server-only` import and a cached application instance:

```ts
export function getNavigatorApplication(): NavigatorApplication;
export function getPublicOutcomes(domain?: string): readonly PublicOutcomeSummary[];
```

Use `FileRoadmapRepository(join(process.cwd(), ".data", "roadmaps"))`, `crypto.randomUUID`, the built-in registry, and deterministic intent provider. Do not construct a fresh in-memory repository per request.

### Browser data projection

Create a serialisable graph adapter:

```ts
export interface RoadmapGraphModel {
  readonly nodes: readonly RoadmapGraphNode[];
  readonly edges: readonly RoadmapGraphEdge[];
  readonly excludedCount: number;
}

export function projectRoadmapGraph(roadmap: Roadmap): RoadmapGraphModel;
export function layoutRoadmapGraph(model: RoadmapGraphModel): RoadmapGraphModel;
```

One node represents one `RoadmapTask`; each dependency becomes an edge from dependency to dependent. Multiple roots receive a small non-actionable outcome node so the layout has a coherent spine. Projection must never reinterpret actionability or status.

## Task 1 — Web foundation, persistence, and APIs

**Fresh task scope:** framework/server only; no polished product UI and no roadmap canvas.

**Files:**

- Modify: `package.json`, `pnpm-lock.yaml`, `tsconfig.json`, `.gitignore`, `src/index.ts`
- Create: `next.config.ts`, `postcss.config.mjs`, `components.json`
- Create: `src/app/layout.tsx`, `src/app/globals.css`, `src/app/page.tsx`
- Create: `src/lib/api.ts`, `src/lib/utils.ts`, `src/server/navigator.ts`, `src/server/http.ts`
- Create: `src/app/api/outcomes/route.ts`
- Create: `src/app/api/roadmaps/route.ts`
- Create: `src/app/api/roadmaps/[roadmapId]/route.ts`
- Create: `src/app/api/roadmaps/[roadmapId]/answers/route.ts`
- Create: `src/app/api/roadmaps/[roadmapId]/tasks/[taskId]/route.ts`
- Create: `src/app/api/roadmaps/[roadmapId]/share/route.ts`
- Create: `test/server/http.test.ts`, `test/server/routes.test.ts`

**Steps:**

1. Inspect the current tests and domain exports. Record the existing `pnpm check` green baseline.
2. Add failing tests for request schemas, stable envelopes, outcome summaries, not-found handling, privacy violations, task transitions, and redacted share output.
3. Install Next/React/Tailwind and test dependencies. Initialise shadcn for the existing project using the current official pnpm command, New York style, neutral base, CSS variables, and the `@/*` alias.
4. Add only the shadcn primitives needed by later tasks: button, card, badge, input, textarea, label, dialog, sheet, tabs, scroll-area, separator, tooltip, progress, alert, skeleton, command, and select.
5. Preserve current NodeNext-compatible core imports while configuring Next and Vitest to resolve the app aliases. Do not move or rewrite the research packs.
6. Implement the server-only singleton with `FileRoadmapRepository`; add `.data/` to `.gitignore`.
7. Implement Zod schemas and error translation. Map unsafe intent to 422, privacy violations to 400, missing roadmaps/tasks to 404, invalid transitions to 409, and malformed bodies to 400.
8. Implement all API route handlers as thin adapters to `NavigatorApplication`.
9. Add the smallest accessible smoke page that links product name to outcome API readiness. Do not spend this task on visual polish.
10. Run `pnpm test -- test/server`, `pnpm check`, and `pnpm build`.
11. Commit exactly: `feat: add web foundation and navigator APIs`.

**Acceptance:** The production build succeeds; all seven outcomes are available from the API; a roadmap survives application singleton reuse and filesystem reload; private and share responses are observably different; the original 32 core tests remain green.

## Task 2 — Outcome discovery and adaptive intake

**Fresh task scope:** landing/discovery/intake only; do not build the graph canvas.

**Files:**

- Replace: `src/app/page.tsx`
- Create: `src/components/site-header.tsx`
- Create: `src/components/outcome-explorer.tsx`
- Create: `src/components/outcome-card.tsx`
- Create: `src/components/natural-language-entry.tsx`
- Create: `src/components/intake-dialog.tsx`
- Create: `src/lib/client-api.ts`
- Create: `src/app/loading.tsx`, `src/app/error.tsx`
- Create: `test/ui/outcome-explorer.test.tsx`, `test/ui/intake-dialog.test.tsx`

**Steps:**

1. Add failing component tests for all seven outcomes, eight domain filters, ambiguous natural-language intent, supported intent, keyboard selection, conditional questions, unknown/skip, and create-roadmap navigation.
2. Implement `client-api.ts` with typed envelope decoding and human-readable errors.
3. Build the dark navy utility header and restrained document page. The opening must immediately show the mechanism: “Tell us the outcome; get every dependency and portal journey.”
4. Build natural-language entry with examples derived from real outcome intent phrases. On 422 ambiguity, retain the text and direct users to the outcome choices; never silently select.
5. Build domain filters as optional shadcn controls. Cards show title, description, domains, and a concise verified-content indicator—never fake counts or completion claims.
6. On outcome choice, create a preliminary roadmap or load its questions, then show the intake Dialog. Ask only returned questions, explain why each matters, and allow `I don't know yet`.
7. Submit answers to the application, then navigate to `/roadmaps/[id]`.
8. Add loading, empty, and error states; preserve input after recoverable failure.
9. Run focused component tests, `pnpm check`, and `pnpm build`.
10. Inspect one desktop and one mobile browser viewport for overflow and keyboard order.
11. Commit exactly: `feat: add outcome discovery and adaptive intake`.

**Acceptance:** A user can start from plain language or browse, answer only applicable questions, and reach a real roadmap ID for each supported outcome. Unsupported or ambiguous text fails explicitly and remains recoverable.

## Task 3 — Roadmap canvas and verified task sheet

**Fresh task scope:** the primary roadmap working surface and its detailed node interaction.

**Files:**

- Create: `src/app/roadmaps/[roadmapId]/page.tsx`
- Create: `src/app/roadmaps/[roadmapId]/loading.tsx`, `src/app/roadmaps/[roadmapId]/not-found.tsx`
- Create: `src/components/roadmap/roadmap-workspace.tsx`
- Create: `src/components/roadmap/roadmap-canvas.tsx`
- Create: `src/components/roadmap/roadmap-node.tsx`
- Create: `src/components/roadmap/roadmap-edge.tsx`
- Create: `src/components/roadmap/roadmap-toolbar.tsx`
- Create: `src/components/roadmap/task-detail-sheet.tsx`
- Create: `src/components/roadmap/evidence-list.tsx`
- Create: `src/components/roadmap/linear-roadmap.tsx`
- Create: `src/lib/roadmap-graph.ts`, `src/lib/roadmap-layout.ts`
- Modify: `src/app/globals.css`
- Create: `test/ui/roadmap-graph.test.ts`, `test/ui/roadmap-workspace.test.tsx`, `test/ui/task-detail-sheet.test.tsx`

**Steps:**

1. Immediately before editing the surface, read the Impeccable craft-floor reference required by its workflow and re-open `PRODUCT.md` plus this plan.
2. Add failing projection tests for roots, dependency direction, stable ordering, every task status, excluded count, unknown applicability, and no client reinterpretation of actionability.
3. Install `@xyflow/react` and `@dagrejs/dagre` after verifying their current official APIs. Implement top-to-bottom layout with a strong central route and readable side branches.
4. Implement custom React Flow nodes. Use black 2px outlines and compact rectangles; yellow for ready/in-progress emphasis, gray for future/not-started, green for completed, pale red for blocked/needs-information, and white for explanatory outcome/group nodes. Encode state with text/icon as well as color.
5. Implement blue dependency edges with solid primary connections and dotted secondary/conditional connections only when that distinction is truthful in data.
6. Match the reference interaction: centered tall canvas, fit-view, pan/zoom controls, reset, status legend, progress summary, and click-to-open detail sheet. Nodes are not draggable editors.
7. Implement the task detail Sheet with title/state controls; action and reason; authority; prerequisites; required information and documents; official portal/offline instructions; step-level evidence; blockers; help/escalation; and expected completion proof. External official links use safe new-tab attributes.
8. Use a right-side sheet at desktop width and a near-full-height/full-width sheet on mobile. Preserve focus return and Escape close.
9. Add `linear-roadmap.tsx` as an accessible, dependency-ordered alternative and expose it through Tabs.
10. Wire transitions through the API. Require proof confirmation before complete; surface 409 errors without optimistic false completion.
11. Add the five-block direction contract as the first body child comment in `src/app/layout.tsx`, including the exact `FINISH` line from Impeccable.
12. Run focused tests, `pnpm check`, and `pnpm build`.
13. Inspect desktop and mobile once, batching any material fixes.
14. Commit exactly: `feat: add interactive government roadmap workspace`.

**Acceptance:** Every roadmap renders all included tasks and dependencies; every node opens a complete evidence-aware journey; progress changes persist; inaccessible drag-only behavior is unnecessary; mobile remains usable.

## Task 4 — Full-journey hardening and browser verification

**Fresh task scope:** functional completion, privacy, resilience, and end-to-end evidence; no aesthetic redesign.

**Files:**

- Modify as tests require: `src/app/**`, `src/components/**`, `src/lib/**`, `src/server/**`
- Create: `playwright.config.ts`
- Create: `e2e/discovery-to-roadmap.spec.ts`
- Create: `e2e/roadmap-progress.spec.ts`
- Create: `e2e/privacy-and-links.spec.ts`
- Create: `e2e/responsive-accessibility.spec.ts`
- Create: `test/journey/portfolio.test.ts`
- Modify: `README.md`

**Steps:**

1. Add a portfolio test that builds all seven outcomes and asserts each has tasks, questions are consistent, actionability remains fail-closed, and every actionable journey has an official start or explicitly supported offline channel plus completion proof.
2. Add Playwright configuration that reuses a healthy compatible app server or starts one task-owned server with cleanup.
3. Cover natural-language import, browse-entry post-death claims, a graph-changing answer, unknown-answer blocking, node detail, official link, proof-gated completion, persistence across reload, and redacted share response.
4. Add browser coverage for all seven outcome cards and at least one generated roadmap per outcome.
5. Verify desktop and mobile layouts, keyboard-only selection, sheet focus, reduced motion, no critical automated accessibility violations, no horizontal page overflow, and a working linear view.
6. Verify all rendered official links are `https`, traceable to admitted sources/journeys, and not placeholder/example domains.
7. Verify error boundaries for missing roadmap, malformed API input, ambiguous intent, and filesystem failure without leaking stack traces or local paths.
8. Update README with exact install/dev/test/build commands, supported outcomes, local-data behavior, privacy boundary, and known 62 fail-closed research gaps. Explain that these gaps are withheld guidance, not broken routes.
9. Run `pnpm check`, `pnpm build`, and `pnpm test:e2e` with uncontended server startup.
10. Commit exactly: `test: verify complete government roadmap journeys`.

**Acceptance:** The app passes a complete browser journey and portfolio audit, preserves fail-closed behavior, reloads progress, provides an accessible alternative, and does not leak private roadmap facts through sharing.

## Task 5 — Visual finish, system documentation, and delivery

**Fresh task scope:** reference fidelity, bounded polish, independent finish review, documentation, final verification, and push.

**Files:**

- Modify only material finish-review targets under `src/app/**` and `src/components/**`
- Create: `artifacts/qa/roadmap-desktop.png`, `artifacts/qa/roadmap-mobile.png`
- Create: `DESIGN.md`
- Create/update surface-brief sidecar using the Impeccable script

**Steps:**

1. Read the Impeccable finish workflow and the built direction contract. Do not invent a new direction.
2. Inspect the live reference and the built app side by side at one desktop and one mobile viewport. The comparison target is structure and interaction grammar: density, canvas scale, spine/branches, node proportions, toolbar, state hierarchy, and sheet behavior.
3. Capture desktop and mobile screenshots, critique once, and batch material fixes. Capture the final pair; do not exceed the workflow's two inspection rounds.
4. Run `node /Users/saiyamchaplot/.agents/skills/impeccable/scripts/detect.mjs --json <changed-targets>` exactly once. Fix mechanical findings and pass remaining findings forward.
5. Run a fresh Impeccable finish reviewer with no inherited implementation framing. Give it the original request, PRODUCT.md, plan, direction contract, detector findings, desktop/mobile screenshots, reference URL, and craft-floor path.
6. Apply one material fix batch, recapture, and obtain the reviewer's verdict. If a second verdict still has open items, report them honestly in the task handoff; do not label it a pass.
7. Run the Impeccable documenter from the built world to write `DESIGN.md` and the route surface brief. Ground truth beats intended tokens.
8. Run final `pnpm check`, `pnpm build`, and `pnpm test:e2e`. Confirm `git status --short` contains only intended artifacts and documentation.
9. Commit exactly: `feat: finish government outcome navigator web app`.
10. Confirm `main` still tracks `origin/main`, then run `git push origin main`. Verify local HEAD equals `origin/main` after the push.
11. Report commit SHA, test counts, build result, browser journeys, screenshot paths, finish-review disposition/open items, pushed branch, preserved Convex stash, and any processes reused/stopped/preserved.

**Acceptance:** The app is working, reference-faithful, documented, fully verified, committed, and present on `origin/main`; no uncommitted implementation work or task-owned server remains.

## Final definition of done

- `pnpm dev` serves a usable web app, not a headless library.
- All seven supported outcomes can be discovered and generated.
- Both natural-language and browse entry work.
- Intake answers recalculate the graph.
- The roadmap visibly represents dependencies and state.
- Every task exposes its verified government/regulated journey and evidence status.
- Completion is proof-gated; unknown and unsupported information remains visible and fail-closed.
- Private answers do not appear in share output.
- Desktop, mobile, keyboard, reduced-motion, and linear-view paths are verified.
- The roadmap.sh visual/interaction grammar is recognisable without copied branding.
- shadcn owns standard controls and overlays.
- Tests and production build pass.
- DESIGN.md records the shipped system.
- All five scoped commits are on `origin/main`.
