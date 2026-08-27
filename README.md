# Government Outcome Navigator

A content-agnostic, fail-closed roadmap engine for completing complex outcomes across Indian government portals and necessary institutions.

The functional core now includes:

- one outcome engine for natural-language and browse entry;
- versioned, validated knowledge packs;
- adaptive dependency graphs with true, false and unknown applicability;
- claim-level currency, jurisdiction and official-source gates;
- proof-backed task transitions and calculated next actions;
- a replaceable intent-provider seam with a deterministic default;
- in-memory and owner-only local-file roadmap repositories; and
- privacy-safe shareable output.

The built-in regulated-import pack remains a non-actionable fixture while its rolling research artifact finishes validation. Hash-pinned admitted packs now cover Central procurement, post-death regulated assets and reusable Central foundations. Their incomplete claims and routes remain visible but non-actionable through the same engine.

## Commands

```sh
pnpm typecheck
pnpm test
pnpm check
```

## Public use

```ts
import {
  InMemoryRoadmapRepository,
  createNavigatorApplication,
  createRegistry,
} from "./src/index.js";

const registry = createRegistry([reviewedKnowledgePack]);
const navigator = createNavigatorApplication({
  registry,
  repository: new InMemoryRoadmapRepository(),
});

const roadmap = await navigator.start({
  entry: { kind: "browse", outcomeId: "reviewed-outcome-id" },
  answers: {},
});
```

See [the product contract](docs/product-contract.md), [domain language](docs/domain-language.md), [content-pack integration seam](docs/content-pack-integration.md), and [rolling research integration record](docs/research-integration-2026-08-28.md).
