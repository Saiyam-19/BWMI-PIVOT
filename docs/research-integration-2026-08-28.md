# Rolling research integration — 2026-08-28

This document is the admission record and research-task handback for the first rolling integration. The source directory was inspected read-only:

`/Users/saiyamchaplot/Documents/Codex/2026-08-28/government-outcome-research/outputs`

No manifest was present at the initial inspection. A rolling manifest generated at `2026-08-28T01:17:41+05:30` appeared during the final source recheck and was then inspected and pinned. It declares the portfolio structurally valid, but its independent all-pack evidence/conflict review is still `pending` and it has no per-pack independent-review verdict. This turn therefore retains the coordinator's explicit three-file allowlist instead of auto-admitting every file that appeared while work was in progress.

| Artifact | SHA-256 | Disposition |
| --- | --- | --- |
| `admission-manifest.json` | `d82912cc127b13fb92033d38e64ff47d8f10a2087682175184ff6b64e0cb45ef` | Inspected, snapshotted and enforced |
| `government-outcome-pack.schema.json` | `6f72407a4ba2c2dccd0a92874ad94324b11f37e6d34db237cb93829c2d1e76a8` | Inspected and snapshotted |
| `04-central-procurement-first-bid.json` | `efa6d5ff30b1d66f61f7849a081d6c0355d8c9f3eae41dcceadcb52753a318a3` | Admitted through normalization |
| `05-deceased-assets.json` | `0b1bf717db125308a2a1bd7ed3a0d76d29a9b8129ddda4fa06a12b85ec15940e` | Admitted through normalization |
| `07-reusable-foundations.json` | `a3560953519f866f4c3b86bab9d9f9c8de0a632b23486ab0e98e8941c2ff10d3` | Admitted through normalization |
| `01-import-regulated-product.json` | `85299d28ac5be8ba705b2d9a7c530226f71300092c7e9e5a3c838b84868ca2c4` | Not admitted; validation is unfinished |
| `02-export-first-order.json` | `3378fd90f066444f407ff370e6f7048cba116f5880194221667ad01f6499f42f` | Not admitted in this rolling turn; appeared after the explicit allowlist and independent review is pending |
| `03-incorporate-and-hire.json` | `a9699ffe461908d9cee1ab2268d06587408c5c9ea8204dd3b833b12f4f8c49bd` | Not admitted in this rolling turn; appeared after the explicit allowlist and independent review is pending |
| `06-cyber-financial-fraud.json` | `ca3fe248600ed46900e933169980fee6f5755c10b3d329bba756b88c0275604f` | Not admitted in this rolling turn; appeared after the explicit allowlist and independent review is pending |

## Admission boundary

The published schema is not `KnowledgePackV1`. The deterministic adapter in `src/packs/research/normalize.ts` applies these rules:

- Every imported registry ID is namespaced by the destination pack. References remain pack-local and the normal registry performs the final global-ID, jurisdiction, official-source, proof and DAG validation.
- A source enters actionable claim closure only when it is a T1 primary source, its URL is HTTPS, its access status is `accessible`, and its verification date matches the pack verification date.
- `Verified` research claims remain verified only when at least one referenced source passes that source gate and the claim has no conflict reference. Other research statuses remain non-actionable.
- The research schema has no review-due field. `reviewDueOn` is therefore set to `verified_on`, making this a same-day admission rather than inventing a validity period. On 2026-08-29 all imported instructions automatically become withheld until refreshed.
- Free-text task triggers and claim applicability prose are not interpreted as executable rules. The adapter generates namespaced boolean facts and questions; unknown fails closed, false excludes the task or blocks the claim, and only true can continue to evidence evaluation.
- Research task and portal steps remain claim-backed as a closure. If a task, official start, instruction set or completion proof lacks that closure, a synthetic non-verified gap claim prevents actionability.
- Each declared completion proof gets a `completion-proof` wrapper only when all of its supporting claims are verified and officially sourced. Completion still requires explicit user confirmation of the declared proof.
- A true state/local dependency becomes a separate visible `outside-scope` task and a prerequisite of the central task. No state/local journey is generated.
- Original artifacts are retained as immutable snapshots, and the exported integration report preserves original claim/source IDs, status, source references, subject, jurisdiction, applicability, locator, dates, access status and freshness metadata.

The adapter does not activate an AI provider and does not store credentials, answers, uploaded files or personal documents.

## Admitted result

Counts below use every generated applicability fact as true on the verification date. “Actionable” still means that the task's complete claim and proof closure passed; it is not a statement that any real user is eligible or complete.

| Outcome | Original claims | Sources | Normalized tasks | State/local tasks | Actionable on 2026-08-28 | Withheld |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Central procurement first bid | 40 | 15 | 18 | 0 | 6 | 12 |
| Post-death regulated assets | 47 | 27 | 42 | 15 | 15 | 27 |
| Reusable central foundations | 47 | 44 | 18 | 3 | 12 | 6 |

All instructions in all three packs are withheld when applicability facts are absent. All are withheld after the one-day review window.

## Claim dispositions

These original claims are not actionable. A `Verified → under-review` row is an adapter downgrade caused by the stricter source-access gate.

### Central procurement

| Claim | Research status | App status |
| --- | --- | --- |
| `cl.gem-learning-path` | Verified | under-review |
| `cl.gem-current-steps-unavailable` | Unavailable | unavailable |
| `cl.suggested-review` | Candidate | candidate |
| `cl.cppp-core-manuals-stale` | Stale | stale |
| `cl.demo-tender-unavailable` | Unavailable | unavailable |
| `cl.demo-oem-form-unavailable` | Unavailable | unavailable |
| `cl.demo-security-unavailable` | Unavailable | unavailable |

### Post-death assets

| Claim | Research status | App status |
| --- | --- | --- |
| `c.no-universal-registry` | Unavailable | unavailable |
| `c.no-universal-securities-search` | Unavailable | unavailable |
| `c.nps-gov-current-threshold` | Conflict | conflict |
| `c.nps-gov-faq-threshold` | Stale | stale |
| `c.no-universal-iepf-search` | Unavailable | unavailable |
| `c.postal-high-value-rule` | Conflict | conflict |
| `c.postal-high-value-sbi` | Conflict | conflict |

### Reusable foundations

| Claim | Research status | App status |
| --- | --- | --- |
| `cl.gst.signature-old` | Conflict | conflict |
| `cl.gst.signature-evc` | Conflict | conflict |
| `cl.icegate.parent-child` | Verified | under-review |
| `cl.icegate.dsc` | Candidate | candidate |
| `cl.gem.identity` | Candidate | candidate |

## Source references excluded from actionable closure

| Pack | Source | Tier | Access status |
| --- | --- | --- | --- |
| Procurement | `src.cppp-bidderkit` | T1_PORTAL | partially_accessible |
| Procurement | `src.gem-lms` | T1_PORTAL | partially_accessible |
| Procurement | `src.gem-login` | T1_PORTAL | blocked |
| Procurement | `src.demo-iitdh` | T1_PORTAL | unavailable |
| Post-death | `s.indiapost-savings` | T1_AUTHORITY | partially_accessible |
| Foundations | `src.icegate.registration-advisory` | T1_AUTHORITY | partially_accessible |
| Foundations | `src.icegate.registration-services` | T1_PORTAL | partially_accessible |
| Foundations | `src.icegate.dsc` | T1_PORTAL | login_required |
| Foundations | `src.gem.login` | T1_PORTAL | partially_accessible |

Claims with another fully admissible source may still pass; excluded references never contribute to actionability.

## Incomplete proof and official-start closures

The following completion proofs remain non-actionable:

- Procurement: `proof.gem-seller-status`, `proof.tender-snapshot`, `proof.oem-authorisation`, `proof.security-compliance`, `proof.grievance-receipt`.
- Post-death: `p.inventory`, `p.securities-locator`, `p.nps-classification`, `p.nps-settlement`, `p.iepf-locator`, `p.postal-classification`.
- Foundations: `proof.portal-signature-binding`, `proof.icegate`.

The following tasks have no admitted HTTPS official start and are forced non-actionable:

- Procurement: `t04.establish-supplier`, `t04.assess-bid-eligibility`.
- Post-death: `t.route-claimant`, `t.securities-locate`, `t.demat-claim`, `t.physical-securities-claim`.

## Fields preserved but not executable

- `qualifying_questions[*].blocking_logic`: free text; replaced with deterministic task/claim confirmation facts.
- `tasks[*].fees_duties` and `tasks[*].timelines`: not exposed because `KnowledgePackV1` does not yet model the source schema's measure/applicability closure atomically.
- `dependency_edges[*].relation` and `.condition`: preserved, but only the task's explicit `prerequisite_task_ids` become executable dependencies.
- `required_inputs[*]` document/information distinction: the source schema supplies sensitivity but no deterministic kind. Names become required information; no document content is bundled or persisted.
- `conflicts`, `coverage_gaps`, `demo_scenario`, actor roles and source-claim annotations: preserved in the immutable snapshot and provenance, but not copied into procedural fields.

## Research changes needed for the next roll

1. Extend the manifest with a per-pack independent-review verdict and explicit app-admission state; portfolio-level `pending` is not enough to auto-admit newly appearing packs.
2. Add machine-readable task and claim applicability rules keyed to typed qualifying answers; keep prose as explanation only.
3. Add `review_due_on` at claim level, with a documented freshness policy.
4. Map each ordered journey instruction, official starting URL, help route and completion proof to its exact atomic claim IDs.
5. Distinguish required information from required documents without embedding a user's document or identifier value.
6. Resolve the source-access and completion-proof gaps listed above, then republish with new hashes.
7. Give regulated import a completed independent-review/admission verdict after its schema/reference validation has passed; `schema_valid: true` alone does not override the coordinator's unfinished status.
