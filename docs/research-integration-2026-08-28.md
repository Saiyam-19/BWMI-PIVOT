# Final research integration — 2026-08-28

This document records application admission of the research task's final
`rolling-v3-deepened` release. The source directory was inspected read-only:

`/Users/saiyamchaplot/Documents/Codex/2026-08-28/government-outcome-research/outputs`

The complete release is retained under
`src/packs/research/published/final-v3-deepened`. It includes all seven JSON and
Markdown packs, the schema, validation report, independent review, admission
manifest and version history. Runtime loading pins the manifest and every JSON
pack by SHA-256 before normalization.

## Release decision

The final manifest declares:

- publication state `final`;
- portfolio state `STRUCTURALLY_VALID`;
- independent review `complete`;
- independent verdict `CONDITIONAL_PASS`;
- zero open review findings;
- 62 unresolved evidence gaps that remain explicitly fail-closed.

`CONDITIONAL_PASS` means the portfolio may be integrated with its evidence
gates intact. It does not mean every task is actionable, every user is eligible,
or every government process is complete.

| Artifact | SHA-256 | Disposition |
| --- | --- | --- |
| `admission-manifest.json` | `2b017d9be6e618c91f13a35484c2aafb5408541928a31a4aa203d7bd9e8ba2cd` | Required, pinned and enforced |
| `validation-report.json` | `4c061eb8bd9c52c2eb476dd1662b1c75a8331be4a1e586e05f2bcc6635b90b7d` | Retained; seven packs valid with zero schema warnings/errors |
| `review/independent-evidence-review.json` | `d4f35944a8570932ba72f201ca7ddd21bc5dc2e27c9cf303eccba2246ea5ce88` | Retained; final conditional pass |
| `government-outcome-pack.schema.json` | `6f72407a4ba2c2dccd0a92874ad94324b11f37e6d34db237cb93829c2d1e76a8` | Retained with the release |
| `packs/01-import-regulated-product.json` | `975ea1cc5a2031f474bb3bb3502a33ee05dbb2c044bc60860b0a26474c61c4b4` | Admitted through normalization |
| `packs/02-export-first-order.json` | `03a251410b27e2065a721aac39cc08ca1bf48dc344bceb7416502370c2fb2cff` | Admitted through normalization |
| `packs/03-incorporate-and-hire.json` | `b5d6f859a38e3f599a08a31924c13dc4e82b66002fade399db0e70d4cbc2870f` | Admitted through normalization |
| `packs/04-central-procurement-first-bid.json` | `40cc8c8bc8c1f8d41ea1c915157b399303f0d6ab8c1f6954f1510746ea822760` | Admitted through normalization |
| `packs/05-deceased-assets.json` | `25ae2f6b3ab9de21138d59f68d969478dba8d2dd3ce4dfff4be56fc496db645b` | Admitted through normalization |
| `packs/06-cyber-financial-fraud.json` | `f51f0528345e1c95c27e9fceba8a1d46e45c069375d3a0efb2280bd94f80efaa` | Admitted through normalization |
| `packs/07-reusable-foundations.json` | `087187ff1363eb2aa476377f703636b5c9b6f79d039c540da5219166850f369d` | Admitted through normalization |

The reviewed import pack supersedes the original unreviewed
`fixture.import-regulated-product` in the built-in runtime registry. The fixture
remains available only for focused engine tests.

## Portfolio totals

| Pack | Tasks | Edges | Claims | Sources | Gaps | Verified | Candidate | Conflict | Stale | Unavailable |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Regulated import | 28 | 55 | 51 | 53 | 14 | 47 | 3 | 1 | 0 | 0 |
| First export order | 27 | 41 | 54 | 28 | 8 | 49 | 5 | 0 | 0 | 0 |
| Incorporate and hire | 23 | 35 | 63 | 45 | 6 | 55 | 5 | 1 | 2 | 0 |
| Central procurement | 21 | 35 | 51 | 17 | 8 | 43 | 1 | 0 | 3 | 4 |
| Deceased assets | 27 | 30 | 81 | 45 | 11 | 77 | 0 | 0 | 1 | 3 |
| Cyber-financial fraud | 21 | 22 | 79 | 30 | 7 | 71 | 2 | 1 | 1 | 4 |
| Reusable foundations | 15 | 18 | 68 | 55 | 8 | 62 | 2 | 1 | 3 | 0 |
| **Total** | **162** | **236** | **447** | **273** | **62** | **404** | **18** | **4** | **10** | **11** |

## Admission boundary

The published research schema is not `KnowledgePackV1`. The deterministic
adapter in `src/packs/research/normalize.ts` applies these rules:

- Every imported registry ID is namespaced by destination pack. References stay
  pack-local and the main registry performs final ID, jurisdiction,
  official-source, completion-proof and dependency-DAG validation.
- A source contributes to actionable closure only when it is a T1 primary
  source, uses HTTPS, is marked `accessible`, and was verified on the pack's
  verification date.
- A `Verified` research claim remains verified only when it has at least one
  admitted source and no conflict reference. Candidate, Conflict, Stale,
  Unavailable and source-incomplete claims remain non-actionable.
- The source schema does not provide a machine-readable review-due date.
  `reviewDueOn` is therefore the claim's verification date. Imported
  instructions are withheld after 2026-08-28 until the evidence is refreshed;
  the adapter does not invent a longer validity period.
- Free-text triggers and applicability prose are not executed. The adapter uses
  namespaced boolean confirmation facts; unknown fails closed, false excludes
  or blocks, and only explicit true proceeds to evidence evaluation.
- Tasks, official starts, ordered instructions and completion proofs remain one
  evidence closure. Missing closure creates a synthetic non-verified gap claim.
- State/local dependencies remain visible as separate `outside-scope` tasks
  without invented state/local instructions.
- Original artifacts and provenance remain in the immutable release snapshot.

All instructions are withheld when applicability facts are absent. A task being
actionable on the verification date is not proof that a real user's private
facts, eligibility or completion requirements are satisfied.

## Bounded executable mappings

- Free-text `qualifying_questions[*].blocking_logic` is preserved and never
  parsed or executed. A small reviewed table may map exact boolean or
  single-select values to an exact affected task's gate or exclusion when the
  structured question, option and `affects_task_ids` fields make that effect
  mechanically unambiguous. Every unmapped answer remains manual-review and
  fail-closed.
- `fees_duties` and `timelines` stay in the source snapshot because the runtime
  model does not yet have atomic applicability and measure fields for them.
- Dependency relation/condition prose is preserved; explicit prerequisite task
  IDs form the executable graph.
- Required inputs are displayed as information requirements. No user document,
  credential or identifier value is bundled or persisted.
- Conflicts, coverage gaps, demo scenarios, detailed actor roles and complete
  claim/source provenance remain available in the release and integration
  reports even when the current roadmap view cannot render every field.

The integration does not activate an AI provider, introduce a database, or
store credentials, answers, uploaded files or personal documents.
