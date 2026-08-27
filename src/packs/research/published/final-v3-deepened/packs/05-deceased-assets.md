# Journey 5 — Discover and claim a deceased person's Central and regulated financial assets

Verified live: **2026-08-28**  
Pack ID: `journey.05.deceased-assets`  
Overall readiness: **Action Required**

## Outcome and scope

This pack supports a family or representative who already has a death certificate to:

1. build an asset-by-asset inventory;
2. use the narrow official discovery service, institution, or regulated intermediary for each asset class;
3. classify the claimant separately for each account, folio, policy, member record or PRAN;
4. obtain separate proof of discovery, claim submission and successful credit/transmission; and
5. escalate a service failure without pretending that a grievance portal decides inheritance.

Covered: bank deposits and DEA-Fund/UDGAM leads; demat and physical listed securities; mutual funds; regulated insurance; EPF, EPS and EDLI; NPS; IEPF-held shares/amounts; and Central small-savings/postal accounts.

Excluded: real property, state-cooperative institutions, unregulated investments, private debts, tax/estate administration, and any nationally uniform probate, legal-heir, succession-certificate, letters-of-administration, stamp, notarisation, fee or court procedure. Those are case/state/judicial dependencies.

The schema-normalized JSON is the canonical machine-readable pack: `work/streams/05-deceased-assets.json`.

## Fail-closed rules

- A UDGAM, MITRA, insurer, DP, AMC, company or post-office match is **discovery proof**, not proof that the claimant is entitled.
- A receipt, CRM case ID, SRN or grievance number is **submission/tracking proof**, not payment or transmission.
- Completion requires the relevant bank credit, demat/CAS/folio credit, insurer payment, EPFO payment/PPO, NPS settlement, IEPF demat/bank credit, or postal payment/closure record.
- Nominee, survivor, joint holder, executor/administrator and legal heir are separate institution-recorded routes. Nomination is not described as universal beneficial ownership.
- A will, competing claimant, court restraint or dispute stops any simplified happy path that the cited source excludes.
- Fees, interest, limitation periods, monetary thresholds and waivers are asserted only where a current source supports the exact route. Unknown state/court costs and timelines remain Action Required.
- A no-match result is scoped to the service searched. No verified single national registry covers all asset classes.

## Qualifying questions

| ID | Question | Blocking effect | Status |
|---|---|---|---|
| `q.death-proof` | Is the death certificate verifiable and matched to institution records? | No valid proof stops every submission. | Verified |
| `q.claimant-capacity` | For each asset, is the claimant survivor/joint holder, nominee, executor/administrator, legal heir or guardian? | Unknown capacity blocks route selection. | Verified |
| `q.dispute-will` | Is there a will, competing claimant, court restraint or dispute? | Stops ordinary bank and simplified SEBI paths where applicable. | Verified |
| `q.asset-leads` | Which identifiers or documentary clues exist for each asset class? | No clue is an unresolved discovery gap, not proof of absence. | Unavailable |
| `q.bank-status` | Is the account active/known, a UDGAM match, or unknown? | UDGAM match routes to bank; it does not prove payment. | Verified |
| `q.securities-mode` | Is the holding demat, physical, MF statement-of-account, IEPF or unknown? | Determines DP, issuer/RTA, AMC/RTA or IEPF route. | Verified |
| `q.sebi-value` | What value applies per BO account or per issuer/AMC record? | Required before QTP/simplified/above-threshold selection. | Verified |
| `q.insurance-lead` | Is insurer/policy/group cover known, or only an unclaimed-amount lead? | No insurer/policy lead leaves discovery incomplete. | Candidate |
| `q.epfo-facts` | What are UAN/PF, employer, service/death, family, nomination and establishment facts? | PF, EPS and EDLI cannot be bundled. | Verified |
| `q.nps-facts` | What are PRAN, sector, accumulated pension wealth, CRA/nodal/POP and nomination facts? | Unknown sector/value blocks routing; current government bands begin at ₹8 lakh, while a ₹5 lakh FAQ is stale. | Verified |
| `q.iepf-facts` | What company, folio/demat, shares/amounts and company transmission status apply? | Unknown company/folio or transmission evidence blocks IEPF-5. | Verified |
| `q.postal-facts` | What scheme/account office, holder mode, nomination, balance and six-month facts apply? | General Rule/India Post no-nomination >₹5 lakh uses succession certificate; actor-specific lists remain scoped. | Verified |

## Inventory and proof model

| Asset class | Discovery route/proof | Claim destination | Submission/tracking proof | Successful completion proof |
|---|---|---|---|---|
| Bank | Known bank record, or UDGAM result/UDRN | Relevant bank, never RBI/UDGAM | Branch receipt, bank claim reference or CRM case ID | Bank credit or account closure/transmission advice |
| Demat/listed securities | Statements/certificates and DP/issuer/RTA confirmation | DP for demat; issuer/RTA for physical | Completeness acknowledgement identifying missing documents | DP/CAS credit or transmission confirmation |
| Mutual fund | Known folio or MITRA match | AMC/RTA | AMC/RTA completeness acknowledgement | Updated statement/CAS showing units |
| Insurance | Policy/employer/bank clues or insurer-specific search reached from Bima Bharosa | Relevant insurer/servicing branch | Claim number, intimation date, documents and investigation/deficiency status | Insurer payment advice and matching bank credit, including applicable delay interest, or reasoned final decision |
| EPF/EPS/EDLI | UAN/PF/employer/member-record confirmation | EPFO/employer route, separated by Form 20/10D/5IF | EPFO claim reference | PF/EDLI credit or PPO plus pension credit |
| NPS | PRAN/sector/value/CRA/nodal/POP confirmation | Associated nodal office/POP and CRA | CRA/nodal claim reference; Protean NPS Lite acknowledgement where applicable | Bank credit and applicable annuity/periodic-withdrawal record |
| IEPF | Company/RTA-confirmed original-holder/folio/share/amount record | Company transmission first, then MCA IEPF-5 plus verification | SRN/acknowledgement, then company report and Authority completeness/deficiency status | Demat and/or bank credit linked to SRN |
| Postal small savings | Passbook/certificate and account-office route confirmation | Relevant account office | Post-office receipt and separately confirmed completed-document date | Payment/bank credit or closure/transmission record |

Claimant capacity is asset-specific. Under the cited routes, a bank nominee/survivor and a SEBI nominee receive as trustee; Insurance Act section 39(7) can create conditional beneficial-entitlement treatment only for specified relationships and qualifications; an IEPF successor completes company transmission first; and a General Rule/India Post no-nomination balance above ₹5 lakh uses a succession certificate. None of those rules determines the claimant's capacity or ownership for another asset. Executor/administrator, testate, intestate and disputed routes remain case- and forum-specific.

## Dependency graph

The graph is inventory-first. Directly known identifiers may bypass a discovery search, but they do not bypass claimant classification.

```text
t.inventory
  ├─ t.route-claimant ─┬─ t.bank-claim ─ t.bank-grievance
  │                    ├─ t.demat-claim ─ t.securities-grievance
  │                    ├─ t.physical-securities-claim ─ t.securities-grievance
  │                    ├─ t.mf-claim ─ t.securities-grievance
  │                    ├─ t.insurance-claim ─ t.insurance-grievance
  │                    ├─ t.epf-claim / t.eps-claim / t.edli-claim ─ t.epfo-grievance
  │                    ├─ t.nps-claim ─ t.nps-grievance
  │                    ├─ t.iepf-claim ─ t.central-grievance
  │                    └─ t.postal-claim ─ t.central-grievance
  ├─ t.udgam-search ───── evidence for t.bank-claim
  ├─ t.securities-locate ─ required for demat/physical route
  ├─ t.mitra-search ────── evidence for t.mf-claim
  ├─ t.insurance-locate ── required for t.insurance-claim
  ├─ t.epfo-classify ───── required/conditional for PF/EPS/EDLI
  ├─ t.nps-classify ────── required for t.nps-claim
  ├─ t.iepf-locate ─────── required for t.iepf-claim
  └─ t.postal-classify ─── required for t.postal-claim
```

Two explicit blockers apply:

- a court restraint or unresolved competing bank claim blocks the ordinary nominee/survivor discharge route;
- disputed/competing securities or MF claims are outside the SEBI simplified framework.

The JSON contains 30 normalized `requires`, `enables`, `conditional_on`, `blocks` and `evidence_for` edges.

## Asset-class routes

### 1. Bank deposits, DEA Fund and UDGAM

UDGAM is a registered-user search for unclaimed deposits transferred to the DEA Fund across participating banks. Search requires account-holder name, selected bank, and PAN, driving licence, voter ID, passport number or date of birth; address is allowed where none of those is available. The result may provide a UDRN and a link to the bank's claim process. It cannot accept or pay the claim. [RBI UDGAM FAQ](https://www.rbi.org.in/commonman/Upload/English/FAQs/PDFs/FAQonUDGAMPortal.pdf)

Balances unoperated or unclaimed for ten years move to the DEA Fund, but the bank remains the claimant's counterparty. [RBI DEA Fund FAQ](https://www.rbi.org.in/commonman/Upload/English/FAQs/PDFs/FAQonDEAFundScheme2014_05032024.pdf)

For a valid nominee/survivor and no restraining court order, the bank verifies death and claimant identity and makes clear the recipient receives as trustee for legal heirs. It should not demand succession certificate, probate, letters of administration, indemnity or surety regardless of amount. Without nomination/survivorship, however, the bank fixes its own simplified threshold based on risk; there is no RBI-wide amount. The RBI benchmark for a complete valid nominee/survivor claim is 15 days. [RBI Master Circular, paragraphs 20.1–20.2 and 20.6](https://www.rbi.org.in/Scripts/NotificationUser.aspx?Id=9862)

SBI's 2025 digital deceased-claim workflow is retained only as a first-party example: initial account/KYC/death uploads, chosen branch and CRM case ID. It is not a universal bank form or portal. [SBI Policy on Depositors' Rights 2025, pages 43–44](https://sbi.co.in/documents/53471/263971/Policy%2Bon%2BDepositors%2BRights18082025.pdf/d171eb0e-5674-0a8b-98b5-f86e4491373a?t=1755494798543)

Rejection/escalation: obtain the bank's written policy/document basis; complain to the bank first. Under the RBI Integrated Ombudsman Scheme 2026, an unsatisfactory reply or no reply for 30 days can enable free CMS filing. The complaint then has a verified 90-day outer filing period measured from expiry of the applicable reply period or the bank's last communication, whichever is later. CMS supplies a complaint number/mobile tracking and a written non-maintainability reason; award acceptance, compliance and eligible appeals use the FAQ's 30-day periods. These are grievance clocks, not estate-claim limitation or payment proof. [RBI Ombudsman FAQ 2026](https://old.rbi.org.in/commonman/english/scripts/faqs.aspx?id=3407) · [RBI CMS](https://cms.rbi.org.in)

### 2. Demat and physical listed securities

The current controlling source is SEBI circular `HO/38/13/11(14)2026-MIRSD-POD/I/17111/2026`, issued 23 July 2026 and effective 22 August 2026. [SEBI 2026 transmission circular](https://www.sebi.gov.in/sebi_data/attachdocs/jul-2026/1784869499027.pdf)

Value bands:

| Record | QTP | Simplified no-nomination | Above simplified threshold |
|---|---:|---:|---|
| Physical listed securities / AMC statement-of-account, per entity or AMC | up to ₹10,000 | up to ₹10 lakh | above ₹10 lakh |
| Demat, per beneficial-owner account | up to ₹30,000 | up to ₹30 lakh | above ₹30 lakh |

Route distinctions:

- Surviving joint holder: only death certificate, without KYC, indemnity or undertaking, subject to nothing contrary in company articles.
- Nominee: prescribed transmission form, claimant CML, verifiable death certificate and certificate/SOA where applicable; recipient is trustee for legal heirs.
- QTP without nomination: only the defined immediate-relative category — parents, spouse, children or parents-in-law — with relationship proof and form-cum-undertaking.
- Simplified band without nomination: notarised indemnity plus notarised affidavit-cum-NOC from all heirs, or notarised/approved family settlement, with appropriate state stamp requirements.
- Above threshold: specified combinations using will plus indemnity, a competent state legal-heir certificate plus indemnity, or succession certificate/letters of administration/court decree.
- Disputed/competing claims: excluded from the simplified framework.

The entity must identify missing/incomplete documents at acknowledgement, confirm completeness, give written reasons for additional documents or rejection, and process a complete covered claim within 21 calendar days. Physical securities are credited in dematerialised form. Fees for notarisation, state stamp and courts are not nationalized here.

Rejection/escalation: complain to the DP/depository, issuer/RTA or AMC/RTA first, then use [SCORES](https://scores.sebi.gov.in/faqs). The entity's ATR is due within 21 calendar days; a dissatisfied complainant has 15 calendar days to request first review, the Designated Body has 10 calendar days where that review is triggered, and the second-review request also has a 15-day window. A complaint is normally lodged within one year of cause of action, subject to SEBI's stated delay discretion. The dashboard, email/SMS notices and ATR/review dates are tracking evidence only; SCORES does not transmit securities or decide succession.

Discovery gap: no current primary source in the corpus establishes a public cross-DP/cross-issuer deceased-claimant search. Known statements, dividends, certificates and institution replies remain scoped leads.

### 3. Mutual funds and MITRA

MITRA is the CAMS/KFin QRTA searchable database for inactive and unclaimed mutual-fund folios and can be used by the investor or rightful legal claimant. An inactive folio has a remaining unit balance but no investor-initiated financial or non-financial transaction for ten years. It is linked from MFCentral, AMCs, AMFI, QRTAs and SEBI. [SEBI MITRA circular, paragraphs 1–5](https://www.sebi.gov.in/sebi_data/attachdocs/feb-2025/1739356741378.pdf)

MITRA supplies a discovery lead only. The AMC/RTA confirms folio, holder mode, nomination and value, then applies the same 2026 SEBI transmission framework above. AMFI hosts a current August 2026 matrix/forms, but the AMC/RTA processes the claim. [AMFI death-of-unit-holder forms](https://www.amfiindia.com/investor/become-mf-distributor?zoneName=deathOfUnitHolder)

### 4. Insurance

The Bima Bharosa unclaimed-amount page is an insurer directory. It is not a single cross-insurer claimant search and does not receive a death claim. [IRDAI Bima Bharosa Unclaimed Amount](https://bimabharosa.irdai.gov.in/Home/UnclaimedAmount)

Use policy papers, premium debits, employer/group-cover records and messages to identify the insurer. Submit to that insurer/servicing branch. LIC's current first-party example asks the legally entitled person to approach the servicing branch and lists its Claim Form A, death-register extract, original policy/assignment records and possible case/product additions. This cannot be generalized to other insurers or products. [LIC Download Forms — Death Claims, updated 27 April 2026](https://licindia.in/en/web/guest/download-forms)

IRDAI's 2024 Master Circular supplies the general controls: a life death claim is due in 15 days from intimation unless investigation is required, when the period is 45 days; delay carries bank rate plus 2% per annum from intimation to payment, paid suo motu. A life claim may not be rejected or closed merely for want of documents or delayed intimation, and repudiation requires legally tenable evidence. The insurer must publish/list its required documents. Any valid assignment or policy loan is checked before the balance is paid. [IRDAI Master Circular, PDF pages 107–108 and 146](https://irdai.gov.in/documents/37343/365525/%E0%A4%AA%E0%A4%BE%E0%A4%B2%E0%A4%BF%E0%A4%B8%E0%A5%80%E0%A4%A7%E0%A4%BE%E0%A4%B0%E0%A4%95%E0%A5%8B%E0%A4%82+%E0%A4%95%E0%A5%87+%E0%A4%B9%E0%A4%BF%E0%A4%A4%E0%A5%8B%E0%A4%82+%E0%A4%95%E0%A5%87+%E0%A4%B8%E0%A4%82%E0%A4%B0%E0%A4%95%E0%A5%8D%E0%A4%B7%E0%A4%A3+%E0%A4%B8%E0%A4%82%E0%A4%AC%E0%A4%82%E0%A4%A7%E0%A5%80+%E0%A4%AE%E0%A4%BE%E0%A4%B8%E0%A5%8D%E0%A4%9F%E0%A4%B0+%E0%A4%AA%E0%A4%B0%E0%A4%BF%E0%A4%AA%E0%A4%A4%E0%A5%8D%E0%A4%B0%2C+2024+_+Master+Circular+on+Protection+of+Policyholders%27+interests+2024.pdf/2bc6a186-5c96-461b-2946-89945b9d488c?version=5.1&t=1737118636654&download=true)

Nominee effect is asset specific. Insurance Act section 39(7) gives conditional beneficial-entitlement treatment to a nominee who is a parent, spouse or child, subject to creditor rights, assignment and statutory exceptions. It must not be generalized to every insurance nominee or to bank, securities, PF, NPS or postal assets. [IRDAI-hosted Insurance Act, 1938, section 39, PDF pages 54–55](https://noc.irdai.gov.in/Content/docs/Insurance%20Act%2C1938%20-%20incorporating%20all%20amendments%20till%2020212021-08-12.pdf)

Preserve the claim number/intimation/deficiency history separately from actual credit. The insurer must acknowledge a grievance immediately and act/decide within 14 days; Bima Bharosa allows IRDAI escalation after 15 days without insurer resolution, and the Master Circular points to the Insurance Ombudsman after 30 days unresolved or an unacceptable decision, subject to case eligibility. [IRDAI Master Circular, PDF pages 152–153](https://irdai.gov.in/documents/37343/365525/%E0%A4%AA%E0%A4%BE%E0%A4%B2%E0%A4%BF%E0%A4%B8%E0%A5%80%E0%A4%A7%E0%A4%BE%E0%A4%B0%E0%A4%95%E0%A5%8B%E0%A4%82+%E0%A4%95%E0%A5%87+%E0%A4%B9%E0%A4%BF%E0%A4%A4%E0%A5%8B%E0%A4%82+%E0%A4%95%E0%A5%87+%E0%A4%B8%E0%A4%82%E0%A4%B0%E0%A4%95%E0%A5%8D%E0%A4%B7%E0%A4%A3+%E0%A4%B8%E0%A4%82%E0%A4%AC%E0%A4%82%E0%A4%A7%E0%A5%80+%E0%A4%AE%E0%A4%BE%E0%A4%B8%E0%A5%8D%E0%A4%9F%E0%A4%B0+%E0%A4%AA%E0%A4%B0%E0%A4%BF%E0%A4%AA%E0%A4%A4%E0%A5%8D%E0%A4%B0%2C+2024+_+Master+Circular+on+Protection+of+Policyholders%27+interests+2024.pdf/2bc6a186-5c96-461b-2946-89945b9d488c?version=5.1&t=1737118636654&download=true) · [Bima Bharosa FAQ](https://bimabharosa.irdai.gov.in/Home/FAQ)

Irreducible gap: the exact product benefit, assignment/loan amount, limitation defence and claimant-specific documents remain policy/insurer facts. The cited LIC list remains an example.

### 5. EPF, EPS and EDLI

EPFO identifies separate death routes:

- Form 20 — provident-fund dues for the applicable nominee, beneficiary or legal heir;
- Form 10D — eligible family pension, dependent on family/nominee/dependent-parent, age and service facts; and
- Form 5IF — EDLI only for a covered death while in service, with establishment/coverage facts checked separately.

[EPFO Which Claim Form](https://www.epfindia.gov.in/site_en/WhichClaimForm.php/Downloads.php?id=sm8_index) · [Form 20 instructions](https://www.epfindia.gov.in/site_docs/PDFs/Downloads_PDFs/Form20_Instructions_Eng.pdf)

Required classification inputs include UAN/PF account, employer, service record, death-in-service, exempted/unexempted establishment, family/nomination and claimant/guardian facts. A PF balance does not establish EPS or EDLI eligibility.

The governing 2026 schemes add separate receipt, deficiency and delay controls:

| Claim | Complete-claim control | Deficiency control | Conditional delay remedy |
|---|---|---|---|
| EPF / Form 20 | A claim complete in all respects with requisite documents must be settled and paid within 20 days from receipt by the Commissioner — paragraph 54(7). | Communicate a found deficiency to the claimant within 20 days from receipt — paragraph 54(8). | If the Commissioner fails without sufficient cause to settle a complete claim within 20 days, penal interest at 12% p.a. may be charged on the benefit for delay beyond the period and deducted from the Commissioner's salary — paragraph 54(9). |
| EPS / Form 10D | A complete claim must be settled and paid within 20 days from receipt — paragraph 17(1). | Record the deficiency in writing and communicate it to the applicant within 20 days from receipt — paragraph 17(2). | If the Commissioner fails without sufficient cause, interest at 12% p.a. may be charged for delay beyond 20 days and may be deducted from salary — paragraph 17(3). The Gazette says **interest**, not “penal interest,” here. |
| EDLI / Form 5IF | A complete claim must be settled and paid within 20 days from receipt — paragraph 23(3). | Record the deficiency in writing and communicate it within 20 days from receipt — paragraph 23(4). | If the Commissioner fails without sufficient cause, penal interest at 12% p.a. may be charged for delay beyond 20 days and deducted from salary — paragraph 23(5). |

Primary sources: [Employees' Provident Funds Scheme 2026, G.S.R. 525(E), paragraph 54(7)–(9), PDF page 94](https://egazette.gov.in/WriteReadData/2026/273957.pdf) · [Employees' Pension Scheme 2026, G.S.R. 527(E), paragraph 17(1)–(3), PDF pages 55–56](https://egazette.gov.in/WriteReadData/2026/273951.pdf) · [Employees' Deposit-Linked Insurance Scheme 2026, G.S.R. 526(E), paragraph 23(3)–(5), PDF page 18](https://egazette.gov.in/WriteReadData/2026/273942.pdf)

These are complete-claim clocks, not unconditional payment promises. Preserve the EPFO receipt date, evidence of completeness, any written deficiency and its date, the payment date, and any written finding about “sufficient cause” or interest. The 12% provisions say interest **may** be charged; the pack does not make it automatic.

Corrigenda check, completed 2026-08-28:

- [G.S.R. 703(E), 4 August 2026](https://egazette.gov.in/WriteReadData/2026/275186.pdf) was checked in full and does not amend EPF paragraph 54(7)–(9).
- [G.S.R. 704(E), 4 August 2026](https://egazette.gov.in/WriteReadData/2026/275187.pdf) changes page 55 lines 23 and 25 concerning paragraph 15 references, not EPS paragraph 17(1)–(3).
- [G.S.R. 705(E), 4 August 2026](https://egazette.gov.in/WriteReadData/2026/275188.pdf) changes page 18 lines 7–8 concerning paragraph 22 claimant wording, not EDLI paragraph 23(3)–(5).

The member portal exposes nominee death-claim paths, but no evidence establishes that every legal-heir/EPS/EDLI case is fully online. Confirm the current form and employer/EPFO office route. Track an acknowledged claim through EPFO status. [EPFO member portal](https://unifiedportal-mem.epfindia.gov.in/) · [EPFO claim status](https://www.epfindia.gov.in/site_en/KYCS.php/site_hi/Help.php)

For grievance, use [EPFiGMS](https://epfigms.gov.in/). EPFO asks claimants to write with the grievance reference where it remains pending over 15 days or redressal is unsatisfactory. [EPFO contact page](https://www.epfindia.gov.in/site_en/Contact.php/FAQ.php)

### 6. NPS

Non-government sector: current regulation 4(1)(c) provides the entire accumulated wealth to nominee/legal heirs as a lump sum, with optional periodic withdrawal or annuity. Without nomination, it accepts a legal-heir certificate from a competent state authority or a court succession certificate. [PFRDA regulations consolidated through 20 July 2026, page 10](https://www.pfrda.org.in/documents/33652/184762/PFRDA%2BExits%2Band%2BWithdrawals%2Bunder%2Bthe%2BNPS%2BRegulations%2B2015%2B_Last%2Bamended%2Bon%2B20%2BJuly%2B2026_%2B(1).pdf)

Government sector — conflict resolved: the December 2025 amendment, current consolidation through 20 July 2026 and current NPS Trust guidance align. On death before superannuation, accumulated pension wealth up to ₹8 lakh permits the 100% option or the standard 20%/at least 80% annuity route; above ₹8 lakh and up to ₹12 lakh permits up to ₹6 lakh with the specified balance route or the standard route; above ₹12 lakh uses up to 20% and at least 80% annuity. PFRDA's live ₹5 lakh FAQ is stale and retained only as a warning. Sector, wealth, claimant capacity and selected option still require PRAN-linked confirmation. [Current consolidated regulation, regulation 3(1)(c) and Schedule I](https://www.pfrda.org.in/documents/33652/184762/PFRDA%2BExits%2Band%2BWithdrawals%2Bunder%2Bthe%2BNPS%2BRegulations%2B2015%2B_Last%2Bamended%2Bon%2B20%2BJuly%2B2026_%2B(1).pdf) · [December 2025 Gazette amendment](https://www.pfrda.org.in/documents/33652/184762/Gazette%2BPFRDA%2BExit%2Band%2BWithdrawals%2Bunder%2Bthe%2BNPS%2BAmendment%2BRegulations%2B2025.pdf) · [NPS Trust death guidance](https://npstrust.org.in/index.php/unfortunate-death-subscriber) · [Stale PFRDA FAQ](https://www.pfrda.org.in/w/faqs/exits-for-government-sector-model-cg-and-cab)

Process: identify PRAN, sector, accumulated pension wealth, CRA, associated nodal office/POP and nomination. The claimant submits the death-withdrawal request to the nodal office/POP; it initiates and authorises the online CRA claim. [PFRDA Exit NPS](https://www.pfrda.org.in/en/web/pfrda/exit-nps) Protean publishes a death-withdrawal claimant form only for cases where it is the responsible CRA. [Protean NPS forms](https://www.npscra.proteantech.in/forms.php)

Protean NPS Lite only: initiation generates an acknowledgement number; rejection must carry a reason; next-working-day status exposes penny-drop/document issues. After nodal authorisation, the claim enters the next settlement cycle, redemption is the next working day (T+1), and transfer follows within two working days after redemption. A quality-check hold is transferred within three working days only after a valid nodal cure. None of these clocks applies to a different CRA or general NPS case. [Protean NPS Lite SOP v1.3, pages 17 and 20–22](https://www.npscra.proteantech.in/download/SOP%20On%20Initiation%20%26%20Authorization%20of%20Death%20Withdrawal%20request_NPS%20Lite_Ver%201.3.pdf)

Grievance: [Pension Sahayak](https://pensionsahayak.pfrda.org.in) provides lodging/tracking. Escalate to NPS Trust if dissatisfied or unresolved at the intermediary for 30 days; after a dissatisfied Trust response or 21 days without reply, the Ombudsman route opens. The FAQ sets a 45-day appeal period from the Trust response or expiry of its 21-day period, subject to sufficient-reason discretion. [PFRDA grievance mechanism](https://www.pfrda.org.in/en/compliance/grievance) · [PFRDA grievance FAQ](https://www.pfrda.org.in/web/pfrda/w/faqs/grievance) The grievance number is not settlement proof.

### 7. IEPF-held shares and amounts

Before filing, establish the company, original holder, folio/demat, shares/dividends and company/RTA transmission evidence. No reliably navigable cross-company deceased-claimant search was verified in the current primary corpus.

SEBI's 2026 circular says its transmission framework also applies to securities transferred to IEPF, so the value/nomination/dispute gate remains relevant. [SEBI 2026 transmission circular](https://www.sebi.gov.in/sebi_data/attachdocs/jul-2026/1784869499027.pdf)

IEPF-5 route: a legal heir, successor, administrator or nominee must first ensure company-level transmission into that claimant's name, using the applicable SEBI/company evidence. Then use MCA login → MCA Services → Company e-Filing → IEPF Services → IEPF-5. Save the SRN, acknowledgement and generated indemnity, notify the company/bank, and complete the kit's supporting-document/postal-receipt steps. Conditional succession/probate/will/NOC fields do not create one national checklist. [IEPF Rules 2016, rule 7](https://www.mca.gov.in/Ministry/pdf/Rules_06092016.pdf) · [MCA IEPF-5 instruction kit](https://www.mca.gov.in/content/dam/mca-aem-forms/instructionkits/Instruction_Kit_Form_No_IEPF_5.pdf)

The company/bank must submit its online verification report within 30 days of receiving the claim. After the Authority receives a complete report, rule 7 sets 60 days for disposal and requires delay reasons to be recorded/communicated. If documents remain absent or communicated deficiencies unrectified for 90 days after filing, the Authority may reject only after giving the claimant a 30-day response opportunity. [IEPF online-verification kit](https://www.iepf.gov.in/content/dam/iepf/pdf/iepf-forms/Instruction-Kit-Online-verification-report-20240718.pdf) · [IEPF Rules 2016](https://www.mca.gov.in/Ministry/pdf/Rules_06092016.pdf) · [2017 amendment](https://www.mca.gov.in/Ministry/pdf/IEPFNotification_13102017.pdf)

Proof stages: company/RTA discovery confirmation → completed transmission → MCA SRN → company report/Authority completeness or deficiency status → demat/bank credit. Only the last stage proves refund; the 60-day clock starts with a complete verification report, not initial IEPF-5 filing.

### 8. Central small savings and postal accounts

General Rule 15 and current India Post guidance provide:

- nominee: Form 11 plus death proof for the eligible balance;
- no nomination and no probate/letters of administration/succession certificate produced within six months, eligible balance up to ₹5 lakh: the authorised account office may pay the person appearing entitled using Form 11, death proof, passbook/statement, affidavit Form 13, disclaimer Form 14 and indemnity Form 15; and
- no nomination above ₹5 lakh: succession certificate plus claim/passbook/death evidence.

[DEA Government Savings Promotion General Rules, Rule 15](https://dea.gov.in/files/budget_division_documents/GSPR.pdf) · [India Post deceased-account guidance](https://www.indiapost.gov.in/Financial/Pages/Content/Post-Office-Saving-Schemes.aspx?facet=amp)

Scope divergence resolved, not generalized: SBI's current SCSS FAQ lists probate, letters of administration, succession certificate or a Tehsildar-issued legal-heir certificate above ₹5 lakh. That is SBI SCSS operating guidance, not a nationwide override of the General Rule/India Post no-nomination succession-certificate route. The actual account office must still confirm scheme, operator and claimant capacity. [SBI SCSS FAQ](https://sbi.co.in/web/faq-s/faq-scss)

No universal postal checklist is emitted. India Post separately describes nomination, legal-evidence and conditional simplified no-nomination routes, but does not make probate, letters, succession and legal-heir evidence interchangeable for every value/capacity. Confirm scheme, account office, holder/nominee status, eligible balance, six-month condition and current forms first. State/court procedure, notarisation, indemnity formalities and fees remain case specific.

India Post's Citizen Charter sets seven days from receipt of completed documents for a Post Office Savings Bank deceased claim. It also sets grievance acknowledgement immediately on the web or seven days by other channels, and service-grievance settlement in 60 days or 90 days where investigation is required. These standards do not include time to obtain succession evidence or prove completeness. [India Post Citizen Charter](https://www.indiapost.gov.in/VAS/Pages/AboutUs/CitizenCharter.aspx)

For service grievance, complain at the transaction post office and obtain acknowledgement, then approach the next higher authority and online route. [India Post grievance guidelines](https://www.indiapost.gov.in/grievance-redressal/guidelines) An eligible unresolved Central-service grievance may later use [CPGRAMS](https://pgportal.gov.in/Home/Faq): 21 days for redress or a reasoned interim reply, and 30 days for an eligible appeal. CPGRAMS cannot decide succession. [DARPG 2024 grievance guidelines](https://www.darpg.gov.in/sites/default/files/Comprehensive_guidelines_for_handling_the_Public_Grievances.pdf)

## Tasks, channels, tracking and evidence status

| Task | Channel / actor | Completion proof | Rejection / escalation | Status |
|---|---|---|---|---|
| `t.inventory` | Private claimant ledger | Dated asset-lead inventory | Missing identifier remains a gap | Candidate |
| `t.route-claimant` | Institution + conditional state/court | Institution-confirmed capacity route | Ask for written basis; case-specific competent forum | Verified |
| `t.udgam-search` | RBI UDGAM | Result/UDRN | Claim at bank; no-match not exhaustive | Verified |
| `t.bank-claim` | Bank branch/claim channel | Bank receipt, then credit/closure | Bank complaint → RBI CMS | Verified |
| `t.bank-grievance` | RBI CMS | CMS number/action history | 30-day bank stage; 90-day filing; order-specific 30-day post-order steps | Verified |
| `t.securities-locate` | DP/issuer/RTA | Entity locator response | Entity-scoped no-record response only | Unavailable |
| `t.demat-claim` | DP/depository | Completeness ack, then DP/CAS credit | Written reasons → SCORES | Verified |
| `t.physical-securities-claim` | Issuer/RTA | Completeness ack, then demat credit | Written reasons → SCORES | Verified |
| `t.mitra-search` | MITRA/CAMS/KFin | Search result | Contact AMC/RTA; no-match scoped | Verified |
| `t.mf-claim` | AMC/RTA | Completeness ack, then statement/CAS credit | Written reasons → SCORES | Verified |
| `t.securities-grievance` | SCORES | Complaint number, ATR and action history | Entity 21 days; review requests 15 days; one-year normal lodging rule | Verified |
| `t.insurance-locate` | Insurer / Bima directory | Insurer policy/search confirmation | Insurer-scoped result only | Candidate |
| `t.insurance-claim` | Insurer/servicing branch | Claim/intimation/deficiency history, then payment/decision | Death claim 15/45 days; bank rate +2% delay interest; reasoned rejection | Verified |
| `t.insurance-grievance` | Insurer/Bima Bharosa/Ombudsman | References and dated decisions | 14-day insurer decision; 15-day Bima trigger; 30-day Ombudsman trigger | Verified |
| `t.epfo-classify` | EPFO/employer | Separate PF/EPS/EDLI route confirmation | Do not bundle failures | Verified |
| `t.epf-claim` | EPFO/employer | Form 20 receipt/completeness evidence, then payment | Complete claim: payment in 20 days; deficiency notice in 20 days; paragraph 54(9) conditional penal interest → EPFiGMS | Verified |
| `t.eps-claim` | EPFO/employer | Form 10D receipt/completeness evidence, then PPO/credit | Complete claim: payment in 20 days; written deficiency in 20 days; paragraph 17(3) conditional interest → EPFiGMS | Verified |
| `t.edli-claim` | EPFO/employer | Form 5IF receipt/completeness evidence, then payment | Complete claim: payment in 20 days; written deficiency in 20 days; paragraph 23(5) conditional penal interest → EPFiGMS | Verified |
| `t.epfo-grievance` | EPFiGMS | Registration number | EPFO contact escalation after cited trigger | Verified |
| `t.nps-classify` | PFRDA/CRA/nodal/POP | PRAN-linked sector/value/route confirmation | Apply current ₹8 lakh/₹8–12 lakh bands; ignore stale ₹5 lakh FAQ | Verified |
| `t.nps-claim` | Nodal/POP/CRA | Claim ref, then credit/annuity/periodic record | Protean NPS Lite clock only where applicable → Pension Sahayak | Verified after classification |
| `t.nps-grievance` | Pension Sahayak | Grievance number and level dates | Intermediary 30 days → Trust 21 days → eligible appeal in 45 days | Verified |
| `t.iepf-locate` | Company/RTA | Company-confirmed investor record | No universal search verified | Unavailable |
| `t.iepf-claim` | MCA + company/RTA | Transmission → SRN → complete report → demat/bank credit | Company 30 days; Authority 60 days after complete report; 90+30 deficiency gate | Verified after route evidence |
| `t.postal-classify` | DEA/India Post account office | Written scheme/operator/capacity/value route | General Rule/India Post >₹5 lakh resolved; SBI list stays scoped | Verified |
| `t.postal-claim` | Account office | Receipt/completeness date, then payment/closure | India Post seven-day completed-document standard → hierarchy | Verified |
| `t.central-grievance` | India Post / CPGRAMS | Complaint/registration ID and dates | India Post 60/90; CPGRAMS 21 days and 30-day appeal | Verified |

## Atomic claim mapping

| Claim ID | Status | Atomic proposition | Primary source IDs |
|---|---|---|---|
| `c.no-universal-registry` | Unavailable | No source in the corpus establishes a complete cross-asset registry. | Multiple route-boundary sources |
| `c.udgam-scope` | Verified | UDGAM searches participating-bank DEA-Fund unclaimed deposits. | `s.rbi-udgam-faq`, `s.rbi-udgam-release` |
| `c.udgam-inputs` | Verified | RBI FAQ specifies the name/bank/identifier-or-address search fields. | `s.rbi-udgam-faq` |
| `c.udgam-not-claim` | Verified | UDGAM cannot receive or settle the bank claim. | `s.rbi-udgam-faq` |
| `c.dea-ten-years` | Verified | Ten-year unoperated/unclaimed balances transfer to DEA Fund; bank remains claim route. | `s.rbi-dea-faq` |
| `c.bank-nominee-trustee` | Verified | Bank nominee/survivor discharge is subject to identity/death/no restraint; recipient is trustee. | `s.rbi-customer-service` |
| `c.bank-no-succession-nominee` | Verified | No succession/probate/LoA/indemnity/surety demand for valid nominee/survivor regardless of amount. | `s.rbi-customer-service` |
| `c.bank-no-nomination-threshold` | Verified | Bank, not RBI, fixes its simplified no-nomination threshold. | `s.rbi-customer-service` |
| `c.bank-15-days` | Verified | Complete valid nominee/survivor benchmark is 15 days. | `s.rbi-customer-service`, `s.sbi-policy` |
| `c.sbi-digital-example` | Verified | SBI describes a digital intake and CRM case ID. | `s.sbi-policy` |
| `c.rbi-ombudsman` | Verified | Prior bank complaint, 30-day no-reply trigger, free CMS route. | `s.rbi-ombudsman-2026` |
| `c.rbi-ombudsman-90d` | Verified | CMS filing is within 90 days after the applicable bank-stage expiry or last communication, whichever is later. | `s.rbi-ombudsman-2026` |
| `c.rbi-ombudsman-appeal-30d` | Verified | Award acceptance/compliance and eligible appeal steps use the stated 30-day periods. | `s.rbi-ombudsman-2026` |
| `c.sebi-thresholds` | Verified | Current QTP/simplified thresholds differ by physical/AMC versus demat record. | `s.sebi-transmission-2026` |
| `c.sebi-joint-holder` | Verified | Joint survivor supplies death certificate only, subject to company articles. | `s.sebi-transmission-2026` |
| `c.sebi-nominee-trustee` | Verified | Nominee route and trustee status. | `s.sebi-transmission-2026` |
| `c.sebi-no-nomination-docs` | Verified | QTP/simplified/above-threshold evidence is separately defined. | `s.sebi-transmission-2026` |
| `c.sebi-21-days` | Verified | Processing is within 21 calendar days after all required documents. | `s.sebi-transmission-2026` |
| `c.sebi-written-reasons` | Verified | Missing documents and delay/rejection/additional-document reasons must be written. | `s.sebi-transmission-2026` |
| `c.sebi-disputes-excluded` | Verified | Disputed/competing claims are outside simplified transmission. | `s.sebi-transmission-2026` |
| `c.mitra-purpose` | Verified | CAMS/KFin MITRA helps investor/rightful claimant trace inactive/unclaimed MF folios. | `s.sebi-mitra` |
| `c.mitra-boundary` | Verified | Inactive means ten years without investor-initiated transaction but balance remains; AMC/RTA claim still needed. | `s.sebi-mitra` |
| `c.amfi-current-forms` | Verified | AMFI hosts August 2026 transmission matrix/forms. | `s.amfi-transmission-2026` |
| `c.scores-route` | Verified | Entity-first complaint, SCORES tracking and two review levels. | `s.sebi-scores` |
| `c.scores-entity-21d` | Verified | Entity resolves and uploads ATR within 21 calendar days. | `s.sebi-scores` |
| `c.scores-review-15d` | Verified | Complainant review requests use 15-day windows; first-review body has 10 days where triggered. | `s.sebi-scores` |
| `c.scores-one-year` | Verified | Complaint normally within one year of cause, subject to SEBI delay discretion. | `s.sebi-scores` |
| `c.no-universal-securities-search` | Unavailable | No public cross-DP/cross-issuer claimant search verified. | `s.sebi-transmission-2026` boundary |
| `c.bima-directory-boundary` | Verified | Bima unclaimed page is an insurer directory, not a universal claim. | `s.irdai-bima-unclaimed` |
| `c.lic-death-example` | Verified | Current LIC servicing-branch forms/documents are an LIC-only example. | `s.lic-forms` |
| `c.bima-grievance` | Verified | Insurer first; Bima escalation after 15 days, with token tracking. | `s.bima-faq` |
| `c.insurance-death-tat` | Verified | Life death claim is due in 15 days, or 45 days where investigation is required, from intimation. | `s.irdai-policyholder-master-2024` |
| `c.insurance-delay-interest` | Verified | Delay beyond TAT carries bank rate +2% p.a. from intimation to payment, suo motu. | `s.irdai-policyholder-master-2024` |
| `c.insurance-document-rejection` | Verified | No rejection/closure merely for want of documents or delayed intimation; repudiation needs legally tenable evidence. | `s.irdai-policyholder-master-2024` |
| `c.insurance-assignment` | Verified | Insurer checks valid assignment and policy loan before paying the balance. | `s.irdai-policyholder-master-2024` |
| `c.insurance-grievance-14d` | Verified | Immediate grievance acknowledgement, 14-day action/decision, 30-day unresolved Ombudsman trigger. | `s.irdai-policyholder-master-2024` |
| `c.insurance-beneficial-nominee` | Verified | Section 39(7) beneficial-entitlement rule is limited to named relationships and statutory qualifications. | `s.insurance-act-1938` |
| `c.epfo-form20` | Verified | Form 20 is PF death-claim form for applicable claimant. | `s.epfo-which-form`, `s.epfo-form20-instructions` |
| `c.epfo-form10d` | Verified | Form 10D is the conditional EPS family-pension route. | same |
| `c.epfo-form5if` | Verified | Form 5IF is conditional on covered death while in service. | same |
| `c.epf-complete-20d` | Verified | Complete EPF claim with requisite documents must be settled and paid within 20 days from receipt. | `s.epf-scheme-2026`, `s.epf-corrigendum-2026` |
| `c.epf-deficiency-20d` | Verified | Found EPF deficiency must be communicated within 20 days from receipt. | same |
| `c.epf-delay-interest` | Verified | Without sufficient cause, delay beyond 20 days on a complete EPF claim can trigger 12% p.a. penal interest; “may be charged” is conditional. | same |
| `c.eps-complete-20d` | Verified | Complete EPS claim with requisite documents must be settled and paid within 20 days from receipt. | `s.eps-scheme-2026`, `s.eps-corrigendum-2026` |
| `c.eps-deficiency-20d` | Verified | EPS deficiency must be recorded in writing and communicated within 20 days from receipt. | same |
| `c.eps-delay-interest` | Verified | Without sufficient cause, delay beyond 20 days on a complete EPS claim can trigger 12% p.a. interest; paragraph 17(3) does not call it penal and says “may be charged.” | same |
| `c.edli-complete-20d` | Verified | Complete EDLI claim with requisite documents must be settled and paid within 20 days from receipt. | `s.edli-scheme-2026`, `s.edli-corrigendum-2026` |
| `c.edli-deficiency-20d` | Verified | EDLI deficiency must be recorded in writing and communicated within 20 days from receipt. | same |
| `c.edli-delay-interest` | Verified | Without sufficient cause, delay beyond 20 days on a complete EDLI claim can trigger 12% p.a. penal interest; “may be charged” is conditional. | same |
| `c.epfo-grievance` | Verified | EPFiGMS plus cited over-15-day/unsatisfactory follow-up. | `s.epfo-contact` |
| `c.nps-nongov-death` | Verified | Non-government death exit pays entire wealth to nominee/legal heirs with stated options and no-nomination evidence. | `s.pfrda-regs-2026` |
| `c.nps-gov-current-threshold` | Verified | Current government death bands are up to ₹8 lakh, >₹8–12 lakh, and >₹12 lakh with the stated withdrawal/annuity options. | `s.pfrda-regs-2026`, `s.pfrda-amendment-2025`, `s.nps-trust-death-2026` |
| `c.nps-gov-faq-threshold` | Stale | Live government FAQ retains superseded ₹5 lakh figure. | `s.pfrda-faq-gov` plus current rule sources |
| `c.nps-nodal-process` | Verified | Nodal/POP initiates and authorises online CRA claim. | `s.pfrda-exit` |
| `c.protean-death-form` | Verified | Protean hosts claimant death-withdrawal form for Protean CRA cases. | `s.protean-forms` |
| `c.nps-grievance` | Verified | Pension Sahayak lodges/tracks NPS grievances. | `s.pfrda-exit` |
| `c.nps-lite-ack-rejection` | Verified | Protean NPS Lite generates acknowledgement, requires rejection reason and exposes next-working-day/penny-drop status. | `s.protean-nps-lite-sop-2025` |
| `c.nps-lite-settlement` | Verified | After NPS Lite nodal authorisation: next cycle, T+1 redemption, transfer within two working days after redemption. | `s.protean-nps-lite-sop-2025` |
| `c.nps-lite-deficiency` | Verified | NPS Lite quality-check hold transfers within three working days after a valid cure. | `s.protean-nps-lite-sop-2025` |
| `c.nps-grievance-30d` | Verified | Unresolved/dissatisfactory intermediary grievance can escalate to NPS Trust after 30 days. | `s.pfrda-grievance` |
| `c.nps-trust-21d` | Verified | Dissatisfied/no reply from NPS Trust after 21 days can move to Ombudsman. | `s.pfrda-grievance`, `s.pfrda-grievance-faq` |
| `c.nps-ombudsman-45d` | Verified | Ombudsman appeal within 45 days from Trust response or expiry, subject to sufficient-reason discretion. | `s.pfrda-grievance-faq` |
| `c.iepf5-process` | Verified | MCA IEPF-5 yields SRN/ack/indemnity and triggers document/company steps. | `s.iepf5-kit` |
| `c.iepf-company-30-days` | Verified | Company/bank verification report within 30 days. | `s.iepf-verification-kit` |
| `c.iepf-authority-60-days` | Verified | Authority disposes within 60 days after receiving a complete company verification report. | `s.iepf-rules-2016` |
| `c.iepf-deficiency-rejection` | Verified | After 90 days missing/unrectified documents, rejection requires a 30-day response opportunity. | `s.iepf-amendment-2017` |
| `c.iepf-transmission-first` | Verified | Legal heir/successor/administrator/nominee completes company transmission before IEPF refund filing. | `s.iepf-rules-2016`, `s.sebi-transmission-2026` |
| `c.sebi-iepf-same-framework` | Verified | SEBI transmission framework extends to IEPF-transferred securities. | `s.sebi-transmission-2026` |
| `c.no-universal-iepf-search` | Unavailable | No reliable current cross-company deceased-claim discovery verified. | `s.iepf5-kit` boundary |
| `c.postal-nominee` | Verified | General Rule 15 nominee route uses Form 11 plus death proof. | `s.dea-gspr` |
| `c.postal-legal-evidence-route` | Verified | India Post separately lists probate/letters/succession legal-evidence route without making documents universally interchangeable. | `s.indiapost-savings` |
| `c.postal-low-value` | Verified | Conditional no-nomination ≤₹5 lakh route after six months uses the specified forms/account evidence. | `s.dea-gspr`, `s.indiapost-savings`, `s.sbi-scss-faq` |
| `c.postal-high-value-rule` | Verified | General Rule/India Post no-nomination >₹5 lakh requires succession certificate. | `s.dea-gspr`, `s.indiapost-savings` |
| `c.postal-high-value-sbi` | Verified | SBI SCSS lists broader legal evidence, scoped to SBI SCSS only. | `s.sbi-scss-faq` |
| `c.postal-grievance` | Verified | Transaction post office → next higher authority → online complaint. | `s.indiapost-grievance` |
| `c.postal-settlement-7d` | Verified | Completed India Post deceased savings-bank claim service standard is seven days. | `s.indiapost-citizen-charter` |
| `c.postal-grievance-tat` | Verified | India Post grievance ack is immediate web/seven days other; settlement 60/90 days. | `s.indiapost-citizen-charter` |
| `c.cpgrams-route` | Verified | CPGRAMS issues a trackable registration ID for eligible Central service grievances. | `s.cpgrams` |
| `c.cpgrams-21d` | Verified | CPGRAMS redress is 21 days or a reasoned interim reply. | `s.cpgrams-faq`, `s.darpg-grievance-guidelines-2024` |
| `c.cpgrams-appeal-30d` | Verified | Eligible CPGRAMS appeal is within 30 days. | `s.cpgrams-faq` |
| `c.no-national-succession-checklist` | Verified | Covered regimes use different evidence by asset/value/nomination/dispute/sector. | RBI, SEBI, PFRDA, DEA, IEPF sources |

## Authorities and official channels

| Actor | Role | Principal channel |
|---|---|---|
| RBI | UDGAM, bank customer-service rules, Ombudsman | [UDGAM](https://udgam.rbi.org.in/unclaimed-deposits/#/login), [CMS](https://cms.rbi.org.in) |
| Bank | Confirms account/nomination and settles claim | Bank-specific branch/claim channel |
| SEBI | Transmission framework and securities grievance | [SEBI circular](https://www.sebi.gov.in/sebi_data/attachdocs/jul-2026/1784869499027.pdf), [SCORES FAQ](https://scores.sebi.gov.in/faqs) |
| DP/depository, issuer/RTA, AMC/RTA | Confirm record/value and process transmission | Regulated-entity channels |
| IRDAI and insurer | Insurance directory, claim controls, grievance and policy claim | [IRDAI Master Circular](https://irdai.gov.in/documents/37343/365525/%E0%A4%AA%E0%A4%BE%E0%A4%B2%E0%A4%BF%E0%A4%B8%E0%A5%80%E0%A4%A7%E0%A4%BE%E0%A4%B0%E0%A4%95%E0%A5%8B%E0%A4%82+%E0%A4%95%E0%A5%87+%E0%A4%B9%E0%A4%BF%E0%A4%A4%E0%A5%8B%E0%A4%82+%E0%A4%95%E0%A5%87+%E0%A4%B8%E0%A4%82%E0%A4%B0%E0%A4%95%E0%A5%8D%E0%A4%B7%E0%A4%A3+%E0%A4%B8%E0%A4%82%E0%A4%AC%E0%A4%82%E0%A4%A7%E0%A5%80+%E0%A4%AE%E0%A4%BE%E0%A4%B8%E0%A5%8D%E0%A4%9F%E0%A4%B0+%E0%A4%AA%E0%A4%B0%E0%A4%BF%E0%A4%AA%E0%A4%A4%E0%A5%8D%E0%A4%B0%2C+2024+_+Master+Circular+on+Protection+of+Policyholders%27+interests+2024.pdf/2bc6a186-5c96-461b-2946-89945b9d488c?version=5.1&t=1737118636654&download=true), [Bima Bharosa](https://bimabharosa.irdai.gov.in/), insurer channel |
| EPFO and employer | PF, pension and EDLI record/claims | [EPFO portal](https://unifiedportal-mem.epfindia.gov.in/), [EPFiGMS](https://epfigms.gov.in/) |
| PFRDA, CRA, nodal office/POP | NPS rule, classification and claim | [PFRDA Exit NPS](https://www.pfrda.org.in/en/web/pfrda/exit-nps), [Pension Sahayak](https://pensionsahayak.pfrda.org.in) |
| IEPFA/MCA and company nodal/RTA | Company transmission, IEPF-5, online verification and Authority decision | [MCA](https://www.mca.gov.in/) |
| DEA and India Post account office | Central savings rules, claim and service standards | [DEA Rule 15](https://dea.gov.in/files/budget_division_documents/GSPR.pdf), [India Post deceased accounts](https://www.indiapost.gov.in/Financial/Pages/Content/Post-Office-Saving-Schemes.aspx?facet=amp) |
| State authority/court | Conditional legal-heir/court evidence | Case and jurisdiction specific; not nationally specified |

## Conflicts and freshness

### `x.nps-threshold` — resolved

- December 2025 Gazette amendment, current consolidation through 20 July 2026 and current NPS Trust guidance: government-sector full-withdrawal option up to ₹8 lakh and separate ₹8–12 lakh route.
- Live PFRDA government FAQ: stale ₹5 lakh text.
- Safe treatment: use regulation 3(1)(c)/Schedule I; still verify sector, accumulated pension wealth, claimant and option. Ask an intermediary using ₹5 lakh for its current legal basis.

### `x.postal-high-value-docs` — resolved by source scope

- DEA Rule 15 and current India Post guidance align: no-nomination eligible balance above ₹5 lakh uses succession certificate.
- SBI SCSS separately lists probate, letters of administration, succession certificate or Tehsildar legal-heir certificate.
- Safe treatment: apply the national/India Post rule where it governs and keep SBI's broader list limited to SBI SCSS. Do not infer a national state/court checklist.

Other freshness controls:

- Do not quote the 2024 UDGAM bank-count/coverage percentage as current.
- The 2015 RBI bank-customer circular is corroborated by SBI's 2025 policy for the 15-day nominee/survivor benchmark, but any later consolidated RBI instruction should be checked for a live bank case.
- EPFO Form 20 instructions remain the form-identity/operative-document source and are official but undated/older. The payment, deficiency and delay controls now come from the governing 2026 EPF/EPS/EDLI schemes. G.S.R. 703(E), 704(E) and 705(E) were independently checked and do not change the cited control paragraphs.
- Older SEBI transmission thresholds are superseded by the circular effective 22 August 2026 and are not used.
- India Post's live Citizen Charter page was updated in 2025, but the embedded charter standard states a 2021 update; its seven-day and grievance timings are therefore retained with medium freshness risk.
- IEPF's rule locators are read with current IEPF kits; no later primary source located in this pass changed the complete-report 60-day or 90+30 deficiency controls.

## Coverage gaps — 11

| Gap | Status | Safe treatment |
|---|---|---|
| Complete cross-asset registry | Unavailable | Asset-class searches only; scoped no-match |
| Current UDGAM participating-bank count/coverage | Stale | Do not quote count or infer completeness |
| Bank-specific no-nomination threshold/forms | Candidate | Get actual bank policy in writing |
| Cross-DP/cross-issuer deceased securities discovery | Unavailable | Use documentary leads and scoped entity enquiries |
| Cross-insurer policy discovery | Unavailable | Use insurer/employer/bank clues and insurer-specific searches |
| Product-specific insurer documents/benefit/limitation | Candidate | Apply IRDAI controls, then get current insurer/product policy/form |
| EPFO discovery without UAN/PF/employer | Unavailable | Use employer/payroll/member clues; no absence inference |
| EPFO form/online coverage freshness | Stale | Confirm live form and office/employer route |
| Cross-company IEPF deceased-claim search | Unavailable | Use known company/RTA/filing records |
| Postal institution/scheme-specific legal evidence | Candidate | General Rule/India Post route is resolved; broader lists stay actor specific |
| State/court documents, stamps, notarisation, fees/times | Unavailable | Case-specific primary-source research after jurisdiction is known |

## Bounded multi-asset demo

Fictional scenario: Raj is deceased; spouse Anita has a matching death certificate. There is no known dispute or restraint, but that is rechecked per asset.

Assumed leads:

- SBI confirms Anita is nominee on one known deposit; UDGAM is searched for additional DEA-Fund deposits.
- A DP confirms Anita is surviving joint holder on one demat account.
- MITRA returns a possible inactive MF folio with no nomination, but AMC value/relationship band is not confirmed.
- LIC confirms a policy and nomination, but product benefit/form remains institution-confirmed.
- UAN/employer and death-in-service are known, but PF/EPS/EDLI conditions are still separated.
- A non-government NPS PRAN and nomination are confirmed.
- A company/folio lead suggests IEPF-held shares, but company/RTA transmission acceptance is pending.
- An NSC lead has no nomination and an assumed ₹4 lakh balance, but the account office has not confirmed the applicable rule/forms.
- A separate hypothetical postal branch is used only to show the legal-successor gate: if the confirmed no-nomination eligible balance were above ₹5 lakh under the General Rule/India Post route, a succession certificate would be required; no state/court process is assumed.

Verified happy-path task IDs are limited to `t.route-claimant`, `t.udgam-search`, `t.bank-claim`, `t.demat-claim`, `t.mitra-search`, `t.epfo-classify` and, after the assumed non-government classification, `t.nps-claim`.

Action-required gates:

1. Confirm each institution's nomination/joint-holder record and absence of restraint.
2. AMC/RTA must establish MF folio value and the correct QTP/simplified/above-threshold evidence before `t.mf-claim`.
3. LIC must supply its product-specific form/term and confirm assignment/loan status; the claim number is not payment even though IRDAI's 15/45-day and delay-interest controls are verified.
4. EPFO/employer must confirm service, establishment, family, nomination and coverage separately before Forms 20, 10D and 5IF. Preserve receipt/completeness evidence and deficiency dates: the 20-day payment rule applies only to complete claims, and 12% interest or penal interest remains a conditional “may be charged” remedy.
5. If the NPS is actually government sector, confirm accumulated pension wealth and apply the current ₹8 lakh/₹8–12 lakh/>₹12 lakh Schedule I band; do not use the stale ₹5 lakh FAQ.
6. Company/RTA must confirm IEPF original holding and complete applicable transmission before IEPF-5; SRN and verification are intermediate only, and the Authority's 60 days begins with a complete report.
7. India Post account office must confirm NSC scheme, no nomination, eligible balance, six-month condition and current Forms 11/13/14/15; the ₹4 lakh figure is only an assumption. If the verified balance is above ₹5 lakh, stop the simplified route and obtain the succession certificate through the competent case/state/judicial process.
8. Any competing claimant, will dispute or restraint routes to case-specific state/judicial action.

Expected proof chain is intentionally non-universal: inventory → discovery result/institution locator → claim acknowledgement → final bank/demat/folio/insurance/EPFO/NPS/IEPF/postal settlement artifact. One asset can finish while another remains Action Required.
