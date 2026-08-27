# Independent evidence and conflict review — rolling v2

Review date: **2026-08-28**

Reviewer: **Stream 8, independent from streams 1–7**

Overall verdict: **CONDITIONAL_PASS**

No finding remains open after direct reinspection of the two post-checkpoint source repairs. The seven packs still contain **62 explicit fail-closed evidence gaps**, so the contract does not permit `PASS`. There is no open P0 or P1, so the contract does not require `FAIL`.

## Scope and method

The immutable evidence base is `outputs/checkpoints/2026-08-28T0201-IST-v1`. For rolling v2, I compared that baseline and its review with current `outputs/packs/*.json` and `outputs/validation-report.json`. I independently inspected only added or materially changed high-risk claims, affected reusable cross-pack claims, and a small deterministic sample of other new `Verified` claims; unchanged checkpoint evidence was not re-reviewed.

The checkpoint review covered the original mandatory floor. The delta added 15 tasks, 30 dependency edges, 100 claims and 55 net sources, while reducing explicit gaps from 64 to 62. Both delta findings were kept open until the exact republished source/claim/task records and official evidence were reopened.

## Pack verdicts

| Pack | Verdict | Resolved findings | Remaining gaps | Basis |
|---|---|---:|---:|---|
| `journey.import-regulated-product.india` | `CONDITIONAL_PASS` | `IER-001`, `IER-002` | 14 | Battery EPR marking and current BIS Scheme II are now required dependencies. Product/port/WPC/PQMS/duty uncertainties remain gated. |
| `india.export.first-goods-order` | `CONDITIONAL_PASS` | — | 8 | Generic DGFT/ICEGATE/GST/RBI route is current; shipment classification, foreign rules, GST refund entitlement and private charges remain case-specific. |
| `journey3.incorporate-hire.india-central` | `CONDITIONAL_PASS` | `IER-004`, `IER-009`, `IER-010` | 6 | Current EPF/ESI law is supported; the live EPFO Revamped ECR page supports only operational mechanics. Other case facts remain gated. |
| `gon.central-procurement.first-bid.v1` | `CONDITIONAL_PASS` | `IER-007` | 8 | Outcome is correctly bounded to a portal-received frozen bid. GeM transaction and demo-tender facts remain unavailable. |
| `journey.05.deceased-assets` | `CONDITIONAL_PASS` | `IER-005`, `IER-011` | 11 | New claim/grievance clocks and NPS/postal bands are supported. Asset and institution-specific discovery limits remain gated. |
| `india.cyber-financial-fraud.v1` | `CONDITIONAL_PASS` | — | 7 | Urgent reporting and escalation are supported; recovery, nationwide complaint timing and victim-authorised-transfer liability are not promised. |
| `in.central.reusable-foundations.v1` | `CONDITIONAL_PASS` | `IER-003`, `IER-006`, `IER-008` | 8 | EPFO coverage/current scheme and reusable identity routes are aligned; portal and consumer-specific signing facts remain gated. |

All packs pass jurisdiction, public/private provenance, scenario-boundedness and machine-integrity review. Temporal validity and dependency completeness are conditional wherever a recorded gap remains. Pack 04 source authority is also conditional because current GeM/demo transaction material was inaccessible; the pack correctly withholds those actions.

## Post-checkpoint delta

Current portfolio totals are 162 tasks, 236 edges, 447 claims and 273 sources. Claim statuses are 404 `Verified`, 18 `Candidate`, 4 `Conflict`, 10 `Stale` and 11 `Unavailable`.

The delta review covered all 100 new claims plus every material statement/status/source/applicability change. The main source families independently checked were:

- Pack 01: REPA rules 4–6/10, CAAR regulation 6/Form CAAR-1, CGST sections 25/31 and rule 46, CPCB e-waste/plastic EPR, ICEGATE rejection messages and current Legal Metrology proof.
- Pack 02: rule 96A, GST refund deficiency/rejection/bank cure, Notification 50/2024-25, Notification 31/2025-26 and SCOMET ANF 2O(A)/(B), ICEGATE DGFT/EDPMS remediation and RBI export-direction conditions.
- Pack 03: current EPF/ESI scheme/rule/Regulation-31 chain, GST registration classification, MCA name/INC-20A/money/support boundaries and 2026 Income-tax correction/default provisions.
- Pack 04: Goods Manual 2024 bid-security forms/exemptions, pre-bid 7/5-day rules, pre-close substitution/withdrawal, tender download/grievance content and bounded stale GeM architecture.
- Pack 05: IEPF, IRDAI death-claim/grievance, Insurance Act section 39, NPS government-death bands/NPS Lite settlement, CPGRAMS, postal, RB-IOS and SCORES clocks.
- Pack 06: MHA 1930/CFCFRMS language, RBI Internal Ombudsman clauses 11/13, RB-IOS forum boundaries, NPCI authorisation and CERT-In malware remediation.
- Pack 07: CCA signature validity, current EPF Scheme, GST DSC/escalation, IEC bank/deficiency proof and PAN/TAN route/fee/tracking.

The deterministic sample of other new `Verified` claims was `c.mca-support`, `cl.cppp-cancelled-search`, `cf.c63`, `cf.c64`, `cf.c66`, `cf.c80` and `cl.dsc.validity-archive`; all passed. Exact claim arrays, source IDs, URLs and locators are in the JSON report.

Affected reusable handoffs are consistent: EPF scheme/portal treatment across packs 03/07; GST registration/signature across 01/03/07; IEC/ICEGATE across 01/02/07; Udyam/MSE bid-security treatment across 04/07; and RBI escalation across 05/06.

## Findings and dispositions

All finding statuses use the contract value `resolved_by_existing_gate`; `resolved_by_revision` below records how that state was achieved.

### `IER-001` — P1 — resolved by revision

- Pack/task/claim/source IDs: pack 01; `imp.t11`, `imp.t11a`, `imp.t21`; `clm.battery-scope`, `clm.battery-registration-marking`, `clm.battery-marking-method-2025`; `src.battery-amendment-2023-marking`, `src.battery-amendment-2025-marking`.
- Finding: the first publication omitted the battery/battery-pack EPR registration-number marking dependency and lot-level proof before sale.
- Independent evidence: [S.O. 4669(E)](https://moef.gov.in/uploads/pdf-uploads/pdf_6765683bdda891.04112319.pdf), rule 10(b), Schedule I paragraph 2(ia), pp.9–10; [S.O. 958(E)](https://moef.gov.in/uploads/pdf-uploads/pdf_67c141239b5a22.27180537.pdf), rule 2(b), paragraph 2(ib), pp.2–3.
- Safe treatment/remediation: block sale until the permitted placement/method, visible or encoded number, active CPCB match, readability and any required written CPCB notice are proved. The final pack adds `imp.t11a`, `proof.battery-epr-marking` and blocking edges to `imp.t21`.

### `IER-002` — P2 — resolved by revision

- IDs: pack 01; `imp.t08`; `clm.crs-route`, `clm.bis-scheme2-fees`, `clm.bis-scheme2-validity`; `src.bis-ca-amendment-2026`.
- Finding: the first publication did not use the substituted BIS Scheme II effective 25 February 2026.
- Independent evidence: [BIS (Conformity Assessment) Amendment Regulations, 2026](https://www.bis.gov.in/wp-content/uploads/2026/03/Gazette-Notification-1.pdf), commencement p.37, Scheme II paragraphs 1–8 pp.41–44, Forms I–V pp.49–61.
- Resolution: the final task uses Forms I–IV as inputs and Form V only as the grant, with current fixed fees and five-year validity. Shipment-specific model/factory scope and variable testing costs remain Candidate.

### `IER-003` — P1 — resolved by revision

- IDs: pack 07; `t.epfo.establishment`; `cl.epfo.code-live`, `cl.epfo.saved-schemes`, `cl.epfo.coverage`, `cl.epfo.route`, `cl.epfo.portal-transition`; `src.mole.social-security-code`, `src.mole.ss-rules-2026`, `src.epfo.employers`, `src.shram.portal`, `src.shram.manual`.
- Finding: the initial pack could exclude a non-scheduled establishment with 20+ employees by using legacy EPF Act wording.
- Independent evidence: [Code on Social Security](https://labour.gov.in/sites/default/files/ss_code_gazette.pdf), First Schedule Part I and section 164(2)(b); [Social Security (Central) Rules, 2026](https://www.labour.gov.in/static/uploads/2026/05/49aa9b62c2125499c37399b90e969d67.pdf), rule 5, pp.138–139.
- Resolution: current coverage is every establishment with 20+ employees. Old portal labels are Stale and cannot narrow coverage; the actual common Form-I/Form-III transaction remains Candidate until confirmed.

### `IER-004` — P1 — resolved by revision

- IDs: pack 03; `t18.epf`, `t19.esi`, `t22.monitor`; the `c.epf-*`, `c.esi-*` and `c.saved-schemes` claims listed in the JSON review; current and superseded `s.epf-*`, `s.esi-*`, `s.ss-rules` sources.
- Finding: the first publication treated 20 November 2026 as a future blanket transition point even though G.S.R. 344(E) superseded ESI Central Rules 1950 on 8 May and G.S.R. 525(E) superseded EPF Scheme 1952 on 29 June. It also carried the superseded ESI INR 21,000 ceiling.
- Independent evidence: [EPF Scheme 2026](https://egazette.gov.in/WriteReadData/2026/273957.pdf), opening/paragraph 1 p.66, membership paragraph 9 pp.68–69, contributions/remittance paragraphs 18–20 pp.75–77; [Social Security Rules 2026](https://www.labour.gov.in/static/uploads/2026/05/49aa9b62c2125499c37399b90e969d67.pdf), pp.134–135 and rules 18–19 pp.159–160; [S.O. 2351(E)](https://egazette.gov.in/WriteReadData/2026/272387.pdf), p.2.
- Resolution: current EPF/ESI instruments now control. S.O. 2702(E)'s INR 15,000 amount is admitted only for Chapter III. A current numeric Chapter-IV ceiling and confirmed post-Code ESI remittance rule were not located, so both are Candidate. The demo's one-person non-hazardous establishment is outside ordinary ESI establishment coverage without using salary to reach that result.

### `IER-005` — P2 — resolved by revision

- IDs: pack 05; `t.epf-claim`, `t.eps-claim`, `t.edli-claim`; nine new `c.epf-*`, `c.eps-*`, `c.edli-*` timeline/deficiency/interest claims; six scheme/corrigendum sources.
- Finding: current processing, deficiency and conditional interest provisions were omitted from all three EPFO death-claim tasks.
- Independent evidence: [G.S.R. 525(E)](https://egazette.gov.in/WriteReadData/2026/273957.pdf), paragraph 54(7)–(9), p.94; [G.S.R. 527(E)](https://egazette.gov.in/WriteReadData/2026/273951.pdf), paragraph 17(1)–(3), pp.55–56; [G.S.R. 526(E)](https://egazette.gov.in/WriteReadData/2026/273942.pdf), paragraph 23(3)–(5), p.18.
- Corrigenda check: [G.S.R. 703(E)](https://egazette.gov.in/WriteReadData/2026/275186.pdf) items 1–25, [G.S.R. 704(E)](https://egazette.gov.in/WriteReadData/2026/275187.pdf) items 1–10, and [G.S.R. 705(E)](https://egazette.gov.in/WriteReadData/2026/275188.pdf) items 1–9 do not amend the target paragraphs.
- Resolution: all three tasks now track receipt/completeness, deficiency and payment dates. The 12% provisions remain conditional “may be charged” remedies; EPS is correctly called interest rather than penal interest.

### `IER-006` — P3 — resolved by revision

- IDs: pack 07; `t.dsc.bind-consumer`; `cl.gst.signature-old`, `cl.gst.signature-evc`, `cl.gst.signature-current-buttons`; `src.gst.welcome`, `src.gst.evc`, `src.gst.clarification`.
- Finding: the 2021 EVC compilation was marked accessible although the [official URL](https://tutorial.gst.gov.in/downloads/news/new_functionalities_compilation_october_december_2021.pdf) returned HTTP 404 on 2026-08-28.
- Resolution: source `src.gst.evc` is now Unavailable, the claim is Stale, the conflict remains open, and the current [clarification manual](https://tutorial.gst.gov.in/userguide/registration/Application_for_Filing_Clarification.htm) is used only for transaction-specific DSC/EVC controls “as applicable/eligible.”

### `IER-007` — P3 — resolved by revision

- IDs: pack 04; `t04.submit-freeze`, `t04.retain-ack`; `cl.cppp-summary-proof`, `cl.cppp-receipt-boundary`; `src.cppp-help`.
- Finding: the original title promised a valid bid while the proof correctly established only portal receipt/storage.
- Independent evidence: [CPPP Special Instructions](https://eprocure.gov.in/eprocure/app?page=HelpForContractors&service=page), items 19–20.
- Resolution: the title now says “submit and freeze a portal-received Central bid”; proof and demo still withhold correctness, responsiveness, eligibility and award.

### `IER-008` — P3 — resolved by revision

- IDs: pack 07; `t.epfo.establishment`; five `cl.epfo.registration-*`/route claims; `src.mole.ss-rules-2026`.
- Finding: the first EPFO revision placed rule-5 English locators one page early.
- Independent evidence: [G.S.R. 344(E)](https://www.labour.gov.in/static/uploads/2026/05/49aa9b62c2125499c37399b90e969d67.pdf), rule 5(1)–(4) p.138 and rule 5(5)–(9) p.139.
- Resolution: final JSON/Markdown cite p.138 for route/certificate/show-cause and p.139 for changes/closure.

### `IER-009` — P3 — resolved by revision

- IDs: pack 03; `t19.esi`; `c.social-registration`, `c.esi-rules-current`, `c.esi-insurance`, `c.esi-disability-conflict`, `c.esi-disability-relief`, `c.esi-rate`; `s.ss-rules`.
- Finding: several G.S.R. 344(E) English locators were one page early.
- Independent evidence: [G.S.R. 344(E)](https://www.labour.gov.in/static/uploads/2026/05/49aa9b62c2125499c37399b90e969d67.pdf), notification/rule 1 pp.134–135, rule 5 pp.138–139, rule 18 p.159, rule 19 pp.159–160.
- Resolution: all final claim/source locators now match those pages.

### `IER-010` — P2 — resolved by revision

- IDs: pack 03; `t18.epf`; `c.epf-portal-current`; `s.epfo-ecr-revamp`.
- Finding: the first rolling-v2 source URL redirected to an EPFO HTTP 404 while being marked accessible.
- Safe treatment: operational ECR mechanics could not establish substantive EPF eligibility, rate or due date and required a live source or `Candidate` status.
- Resolution: the republished [EPFO Revamped ECR page](https://www.epfo.gov.in/revamped-ecr/) returned HTTP 200 and independently confirmed the September-2025-onward scope, return/payment segregation, system validation, damages/interest calculation, conditional revision and linked manual/FAQ. The claim remains operational only.

### `IER-011` — P1 — resolved by revision

- IDs: pack 05; `t.route-claimant`, `t.insurance-claim`; `c.insurance-beneficial-nominee`; `s.insurance-act-1938`.
- Finding: the first rolling-v2 publication used a 404 India Code bitstream as the sole authority for a high-risk life-insurance nominee entitlement.
- Safe treatment: do not automate beneficial entitlement until a live official section-39 text and its qualifications are admitted.
- Resolution: the republished [official IRDAI Insurance Act consolidation](https://noc.irdai.gov.in/Content/docs/Insurance%20Act%2C1938%20-%20incorporating%20all%20amendments%20till%2020212021-08-12.pdf) was reopened. Section 39(7), printed p.55, confirms the bounded parent/spouse/child beneficial-entitlement rule; subsections (6)–(12) preserve survivor, creditor, maturity and statutory exceptions.

## Cross-pack consistency

The only material contradiction found was EPFO coverage between the initial packs 03 and 07. It is resolved: both final packs use the Code First Schedule's ordinary 20+ threshold and treat lagging EPFO/Shram portal text as operational-transition evidence only.

Other shared checks are consistent:

- IEC/ICEGATE identity and the INR 500 IEC fee align across packs 01, 02 and 07.
- PAN/TAN and entity identity align across packs 03 and 07.
- GST tasks do not turn public rules into private registration/refund facts; the only DSC/EVC ambiguity remains a pack-07 conflict and live-transaction gate.
- Udyam evidence in pack 07 does not become an automatic MSE/startup preference in pack 04.
- CPPP acknowledgment is consistently receipt proof, never proof of responsiveness or award.
- EPF/EPS/EDLI claim clocks in pack 05 are compatible with the current-law transition in pack 03.

## Checkpoint random Verified sample

Selection used seed `20260828 + pack ordinal` over the final sorted `Verified` claim IDs. All 35 passed source/locator review.

| Pack | Five sampled claim IDs |
|---|---|
| 01 | `clm.import-igst`, `clm.gst-route`, `clm.bis-public-check`, `clm.battery-scope`, `clm.be-tracking` |
| 02 | `claim.docs-minimum`, `claim.gst-refund-portal`, `claim.rbi-overdue`, `claim.ebrc-self`, `claim.customs-rms-leo` |
| 03 | `c.esi-insurance`, `c.posh-local`, `c.first-auditor`, `c.osh-appointment`, `c.wage-payment` |
| 04 | `cl.cppp-server-clock`, `cl.cppp-receipt-boundary`, `cl.cppp-boq`, `cl.startup-relaxation`, `cl.cppp-helpdesk` |
| 05 | `c.udgam-not-claim`, `c.dea-ten-years`, `c.nps-nongov-death`, `c.rbi-ombudsman`, `c.mitra-boundary` |
| 06 | `cf.c08`, `cf.c40`, `cf.c14`, `cf.c27`, `cf.c23` |
| 07 | `cl.udyam.one-registration`, `cl.gst.aadhaar`, `cl.epfo.coverage`, `cl.gst.signature-current-buttons`, `cl.tan.know` |

The exact sampled source IDs and the grouped high-risk/declared-status source checks are preserved in `independent-evidence-review.json`.

## Remaining fail-closed gaps

| Pack | Gap IDs | Status mix | Gate assessment |
|---|---|---|---|
| 01 | `gap.01`–`gap.14` | 9 Candidate, 1 Conflict, 4 Unavailable | Classification, current route, amount and shipment approval gaps block dispatch/sale/closeout as applicable. |
| 02 | `gap.exact-classification`, `gap.foreign-requirements`, `gap.state-local`, `gap.private-charges`, `gap.payment-instrument`, `gap.gst-refund`, `gap.special-goods`, `gap.origin-certificate` | 8 Candidate | Case classification, foreign/state requirements, refund eligibility and private charges are withheld. |
| 03 | `g.mca-money`, `g.bank`, `g.state-local`, `g.social-transition`, `g.esi-disability`, `g.gst-case` | 5 Candidate, 1 Stale | Current numeric Chapter-IV ceiling, live MCA/bank facts, state/local rules and GST classification remain Action Required. |
| 04 | `gap.gem-live-transaction`, `gap.gem-terms-incident`, `gap.cppp-detailed-ui`, `gap.demo-pack`, `gap.demo-oem`, `gap.demo-security`, `gap.demo-eligibility`, `gap.demo-future-status` | 1 Stale, 7 Unavailable | The unavailable transaction cannot reach a valid/eligible/awarded claim. |
| 05 | `g.cross-asset-registry`, `g.udgam-coverage`, `g.bank-no-nomination`, `g.securities-discovery`, `g.insurance-discovery`, `g.insurance-product-docs`, `g.epfo-record-discovery`, `g.epfo-form-freshness`, `g.iepf-discovery`, `g.postal-institution-docs`, `g.state-court-process` | 3 Candidate, 2 Stale, 6 Unavailable | Discovery is asset-class-specific; institution, claimant, entitlement and disputed-successor facts require confirmation. |
| 06 | `cf.gap01`–`cf.gap07` | 4 Candidate, 1 Conflict, 2 Unavailable | Urgent reporting proceeds; timing, liability, recovery, telecom and restoration outcomes remain unpromised. |
| 07 | `gap.gst.signature`, `gap.icegate.role-fields`, `gap.dsc.consumer-profile`, `gap.gem.current-signature`, `gap.epfo.coverage-special`, `gap.epfo.current-registration-manual`, `gap.processing-times`, `gap.bank-onboarding` | 3 Candidate, 1 Conflict, 1 Stale, 3 Unavailable | Consumer-specific signing/profile/portal facts remain gated; reusable proofs do not imply downstream eligibility. |

Every declared Conflict/Stale/Unavailable claim/source was inspected. None drives a non-Verified demo happy-path task.

## Machine integrity

Final validation of all seven published JSON packs reports:

- 7 valid packs; 0 errors; 0 warnings.
- 162 tasks, 236 dependency edges, 447 claims, 273 sources, 10 declared conflicts and 62 coverage gaps.
- Claim statuses: 404 Verified, 18 Candidate, 4 Conflict, 10 Stale and 11 Unavailable.
- 0 non-Verified demo happy-path tasks.

Final release treatment: retain `Action Required` until the applicable recorded gaps are resolved with current official evidence and the user's private case facts.
