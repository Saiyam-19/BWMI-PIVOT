# Government Outcome Navigator admission manifest — rolling-v3-deepened

Generated: 2026-08-28T02:58:24+05:30

Publication state: **final**  
Portfolio structure: **STRUCTURALLY_VALID**  
Independent evidence review: **complete** — CONDITIONAL_PASS

Only `Verified` claims are admitted to drive a happy path. `Candidate`, `Conflict`, `Stale` and `Unavailable` claims remain visible action-required gates.

## Portfolio coverage

| Pack | Tasks | Claims | Verified | Candidate | Conflict | Stale | Unavailable | Gaps | Readiness |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---|
| [Import and legally sell a first regulated product shipment in India](packs/01-import-regulated-product.md) | 28 | 51 | 47 | 3 | 1 | 0 | 0 | 14 | Action Required |
| [Export a first commercial goods order from India and complete payment realisation](packs/02-export-first-order.md) | 27 | 54 | 49 | 5 | 0 | 0 | 0 | 8 | Action Required |
| [Incorporate an Indian company, hire the first employee, and complete initial Central compliance](packs/03-incorporate-and-hire.md) | 23 | 63 | 55 | 5 | 1 | 2 | 0 | 6 | Action Required |
| [Become eligible for Central Government procurement and submit and freeze a portal-received Central bid](packs/04-central-procurement-first-bid.md) | 21 | 51 | 43 | 1 | 0 | 3 | 4 | 8 | Action Required |
| [Discover and claim a deceased person's Central and regulated financial assets](packs/05-deceased-assets.md) | 27 | 81 | 77 | 0 | 0 | 1 | 3 | 11 | Action Required |
| [Urgent cyber-financial-fraud containment and recovery journey](packs/06-cyber-financial-fraud.md) | 21 | 79 | 71 | 2 | 1 | 1 | 4 | 7 | Action Required |
| [Reusable Central-Government Identity and Registration Foundations](packs/07-reusable-foundations.md) | 15 | 68 | 62 | 2 | 1 | 3 | 0 | 8 | Action Required |

Totals: **7 packs**, **162 tasks**, **236 dependency edges**, **447 claims**, **273 source records**, **62 explicit gaps**.

Claim states: **404 Verified**, **18 Candidate**, **4 Conflict**, **10 Stale**, **11 Unavailable**.

## Ingestion contract

- Validate each JSON pack against `government-outcome-pack.schema.json` and treat IDs as pack-local composite keys.
- Preserve source issuer, jurisdiction, tier, URL, dates, locator, verification date and freshness risk.
- Do not promote a non-Verified claim because another pack uses the same URL or similar wording.
- Keep all non-Verified nodes and claims as explicit gates; do not silently omit them from the user journey.

## Reuse and conflict posture

The machine manifest records **14 shared official-URL groups**, **0 exact normalized cross-pack claim groups**, and **10 raw ID collisions**. These are review candidates, not automatic deduplication decisions.

## Release limits

- A structurally valid pack is not a universal legal-clearance conclusion.
- Candidate, Conflict, Stale and Unavailable claims remain explicit gates.
- Login-gated case status, user facts and regulated/private documents are not proven by public guidance.
- State/local, judicial and foreign-country dependencies remain bounded rather than generalized.
