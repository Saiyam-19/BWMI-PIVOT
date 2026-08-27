# Content-pack integration seam

Government research enters the application as versioned `KnowledgePackV1` data. The roadmap engine, intent-provider interface, application module and persistence adapters do not change when a new outcome is admitted.

## Pack shape

Each pack normalizes content into this reference chain:

```text
evidence sources
→ atomic claims
→ journeys and tasks
→ outcome definitions
```

- Sources declare an official URL, evidence tier, jurisdiction and retrieval date.
- Claims reference source IDs and independently declare kind, review state, jurisdiction, verification date and review-due date.
- Journey starting points, steps, help routes and completion proofs reference claim IDs.
- Tasks reference their required claims, optional journey, deterministic applicability rule and dependency task IDs.
- Outcomes reference the questions and tasks that form one roadmap family.

All IDs are registry-global. References are restricted to the same pack, so one pack cannot silently import claims or tasks from another roadmap.

## Admission workflow

1. Keep incomplete research in a pack with `lifecycle: "fixture"` or claims in `candidate` or `under-review` state. The engine will keep the graph visible and withhold instructions.
2. Convert each factual assertion into an atomic claim. Do not embed fees, deadlines, eligibility, portal steps or proof descriptions outside claim-backed journey fields.
3. Set a claim to `verified` only after attaching an official, non-historical source, its exact jurisdiction, `verifiedOn`, and `reviewDueOn`.
4. Ensure every admitted task has a journey with an official starting point, claim-backed ordered steps and a claim-backed completion proof.
5. Export the pack from `src/packs/` and add it to `builtInKnowledgePacks` in `src/packs/index.ts`.
6. Run `pnpm check`. Registry loading rejects malformed IDs, duplicates, unknown or cross-pack references, invalid jurisdiction, unsupported sources, missing completion proofs and dependency cycles.

Changing a pack from `fixture` to `admitted` is a release decision, not a formatting change. Even in an admitted pack, any stale, conflicting, unverified, jurisdiction-mismatched or fact-unknown claim causes instructions to be withheld at runtime.

## Rolling research adapter

Research artifacts using the separate `government-outcome-pack` schema enter through `src/packs/research/normalize.ts`. Published inputs are explicitly allowlisted and hash-pinned; no directory scan can silently admit a new file. The adapter preserves the original artifacts and provenance while producing ordinary `KnowledgePackV1` data, so registry and engine behavior do not depend on a research-specific code path.

Free-text applicability is never guessed. The adapter creates deterministic, namespaced task/claim facts, excludes inaccessible evidence from actionable closure, uses a same-day review window when research supplies no review-due date, and synthesizes non-verified gap claims wherever an exact start, instruction or completion-proof closure is absent.

See [the 2026-08-28 rolling integration record](research-integration-2026-08-28.md) for hashes, exact rejections and the research-task handback.

## AI constraint

An intent provider receives only approved outcome, task and question IDs. Its response is validated before roadmap generation. It can select those IDs and return primitive values for approved fact keys; it has no interface for supplying claims, journeys, URLs, fees, deadlines or completion proofs.

The default provider is deterministic and local. No live provider is configured or activated.

## Privacy constraint

Knowledge packs contain public procedural knowledge only. They must never contain credentials, personal identifiers or uploaded documents. Runtime answers are isolated per roadmap. Local file persistence uses owner-only permissions, and shareable output removes all answers and proof confirmations.
