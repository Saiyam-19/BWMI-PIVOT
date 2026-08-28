# Government Outcome Navigator

Government Outcome Navigator turns a citizen or small-business goal into a private, dependency-aware roadmap across Indian government portals and necessary regulated institutions. The deterministic engine admits only verified, jurisdiction-matching claims; missing facts or evidence keep guidance visibly withheld.

## Setup and commands

Use pnpm 11 and a current Node.js release. Install the application and Chromium used by the browser suite:

```sh
pnpm install --frozen-lockfile
pnpm exec playwright install chromium
```

Run the local app:

```sh
pnpm dev
```

The default Next development URL is `http://localhost:3000`. The exact verification commands are:

```sh
pnpm typecheck
pnpm test
pnpm check
pnpm build
pnpm test:e2e
```

`pnpm test:e2e` builds the production app, starts a task-owned server on `127.0.0.1:3210`, runs Playwright, and stops that server. To reuse an already inspected, compatible server, set `BWMI_REUSE_SERVER=1`; use `BWMI_E2E_PORT` if that server uses a different port.

## Supported outcomes

The launch portfolio includes all seven admitted outcomes:

1. Import and legally sell a first regulated product shipment in India.
2. Export a first commercial goods order from India and complete payment realisation.
3. Incorporate an Indian company, hire the first employee, and complete initial Central compliance.
4. Become eligible for Central Government procurement and submit and freeze a portal-received Central bid.
5. Discover and claim a deceased person's Central and regulated financial assets.
6. Follow an urgent cyber-financial-fraud containment and recovery journey.
7. Set up reusable Central-Government identity and registration foundations.

Users can begin with natural language or by browsing outcomes. Qualifying answers recalculate the graph; explicit unknowns remain visible and block only the guidance they affect. The roadmap offers both the dependency canvas and a keyboard-accessible linear view. A task can be completed only after the user confirms its expected proof.

## Local persistence and privacy

Roadmaps are stored as owner-only JSON files under `.data/roadmaps` on the local demo server. Directory permissions are `0700`, roadmap files are `0600`, and saves are atomic so reloads cannot observe partial JSON. This is local demo persistence, not an account or collaborative cloud service.

Do not enter credentials or upload identity/evidence documents: the app does not accept or store passwords, secrets, document contents, data URLs, or private keys. One roadmap represents one goal. The share API is read-only and removes answers and proof-confirmation fields by default.

## Evidence boundary and known gaps

The pinned seven-pack research release is structurally valid with a conditional pass. It contains 62 unresolved evidence gaps: 14 import, 8 export, 6 incorporation/first-hire, 8 Central procurement, 11 deceased-assets, 7 cyber-fraud, and 8 reusable-foundations gaps.

These gaps are intentionally withheld guidance, not broken application routes. Affected tasks stay `Needs information`, `Blocked`, `Outside scope`, or otherwise non-actionable until current official evidence and user facts close the relevant claim. The app does not turn those gaps into invented portals, fees, deadlines, eligibility, classification, approval, or clearance claims.

See [the product contract](docs/product-contract.md), [domain language](docs/domain-language.md), [content-pack integration seam](docs/content-pack-integration.md), and [research integration record](docs/research-integration-2026-08-28.md).
