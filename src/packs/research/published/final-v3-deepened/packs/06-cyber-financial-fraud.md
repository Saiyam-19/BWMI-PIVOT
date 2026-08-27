# Urgent cyber-financial-fraud containment and recovery journey

**Pack:** `india.cyber-financial-fraud.v1`  
**Verified live:** 2026-08-28 (Asia/Kolkata)  
**Readiness:** Action Required

Contain further loss, create usable bank and police records, pursue the correct transaction-specific dispute path, and reach either evidenced restoration/reversal or documented closure without overstating liability or recovery.

Central/national scope: India-wide Central Government, RBI, NPCI and DoT channels, plus necessary regulated actors and explicit State/UT police dependencies.

Explicit exclusions:

- No guarantee of fund hold, freeze, reversal, zero liability, FIR, arrest, charge-sheet, restoration or recovery.
- No state-specific FIR, cyber-police-station, court-release or lien-removal procedure is generalized nationally.
- No universal card-network chargeback code or deadline is asserted without the actual issuer and card-network rules.
- No enterprise CERT-In reporting workflow, securities-market fraud route, crypto-asset tracing, civil suit, consumer commission case or private insurance claim is fully mapped.
- No advice to share OTP, PIN, password, CVV, full card number or other credential secret with any caller, portal or intermediary.

> **Emergency order:** stop engagement and further payment; notify every affected bank/PSP/card/wallet through its official fraud route; call **1930**; preserve evidence; complete the National Cyber Crime Reporting Portal complaint. Do these in parallel where possible. Do not wait for a liability label. If personal safety is at risk, use 112/local police in parallel.

> **No guarantee:** reporting may enable tracing, coordination, a hold or later restoration, but this pack never promises a freeze, lien, police/FIR action, zero liability, reversal or recovery. A verbal assurance or interim hold is not money returned.

## Decisive classification gate

| Fact pattern | Safe treatment |
|---|---|
| User did **not** approve the debit | Use the covered bank/card or non-bank PPI unauthorised-transaction branch only after actor and facts are resolved. RBI liability rules can apply, but outcomes depend on cause and reporting facts. |
| User entered a UPI PIN/OTP/password or otherwise approved because of deception | NPCI confirms that the ordinary UPI flow uses explicit Pay plus UPI PIN as the technical authorisation action. Treat the bounded case as a successful victim-authorised scam transfer unless the regulated actor establishes otherwise, but do **not** infer legal authorisation/fault, import RBI zero-liability rules or promise recall/reversal. |
| Debit occurred but beneficiary/merchant did not receive it | Ask the bank/PSP to classify the exact status. RBI failed-transaction TAT applies only if the prescribed failure definition and row match; it does not apply to a completed successful fraud payment. |
| Authorisation or status is disputed/unknown | Keep the claim Action Required/Conflict; urgent bank, 1930 and NCRP reporting still proceeds. |

## Bounded demo scenario

### SBI UPI collect-request scam reported within minutes - victim-authorised, no-guarantee demo

Demonstrate urgent containment and reporting while refusing to misclassify a successful user-approved UPI scam as automatically zero-liability or reversible.

**Timestamped assumptions**

- On 2026-08-28 at 14:05 IST, a Bengaluru resident approves an SBI-linked UPI collect request for Rs 64,500 in a genuine UPI app after a caller falsely describes it as a refund-verification step.
- The app and SBI alert show the payment as successful; the user entered the UPI PIN, so this pack treats it as victim-authorised pending a reasoned actor determination.
- At 14:09 IST the user recognizes the scam, still controls the phone and SIM, and has no evidence of a second debit.
- SBI is the remitter bank; the exact UPI app/PSP and beneficiary bank must be resolved from the transaction record before their channel-specific tasks are complete.
- The user has transaction ID/UTR, alert, caller number, call log and chat screenshot, but no promise that funds remain in the beneficiary account.
- All outcomes are illustrative; no hold, reversal, zero liability, FIR or recovery is assumed.

**Qualifier answers**

| Question | Answer |
|---|---|
| `cf.q01` | Fraud has stopped but is recent; urgent containment starts at 14:09 IST. |
| `cf.q02` | One Rs 64,500 transaction at 14:05 IST; exact UTR is available in the SBI alert/app. |
| `cf.q03` | User approved because deceived and entered the UPI PIN. |
| `cf.q04` | UPI linked to an SBI savings account; app/PSP and beneficiary bank to be resolved. |
| `cf.q05` | Successful and credited according to current app/bank status. |
| `cf.q06` | No telecom issue known; phone and SIM remain controlled. |
| `cf.q07` | No OTP/password sharing or remote-access app known; UPI PIN was entered only in the real app. |
| `cf.q08` | Victim was in Bengaluru, Karnataka. |
| `cf.q09` | No complaint at 14:09; first use SBI official containment/reporting and record ticket timestamp. |
| `cf.q10` | Only verbal/unknown until statement and written actor status prove otherwise. |

**Verified happy-path tasks:** `cf.t01`, `cf.t02`, `cf.t03`, `cf.t04`, `cf.t06`, `cf.t17`, `cf.t18`, `cf.t19`. Candidate classification, victim-authorised recovery, police and closure nodes remain Action Required even when shown in the full graph.

**Action-required gates**

- At about 14:09, call SBI 1800 1111 09 for fraud reporting and/or 1800 1234 -> 0 -> 3 for UPI block, obtain ticket and confirmation; request any available fraud hold/recall without assurance.
- Call 1930 immediately and then complete NCRP with the UTR, amount, timestamp, SBI, suspect number and evidence; current national 24-hour mandate is not asserted, so file in the same urgent session where possible.
- Resolve the actual UPI app/PSP and beneficiary bank from records; raise the app/bank complaint, recognizing NPCI routes fraud complaints to the bank and initiated UPI payments cannot be stopped.
- Require SBI's written classification and recovery/service response; do not claim RBI zero liability because the user approved the payment.
- If SBI gives an unsatisfactory response, or no response by the higher applicable guideline/30-day period, calculate the RB-IOS 2026 90-day filing window and file CMS promptly.
- Treat a hold, provisional credit or verbal recovery statement as pending until an actual statement credit and written disposition exist.

**Deliberately out of scope**

- No SIM swap or lost handset, so cf.t13 and cf.t14 are not used unless new facts emerge.
- No failed-transaction status, so cf.t10's T+1/T+5 auto-reversal rules do not apply.
- No no-user-approval debit, so cf.t07 and cf.t08 are not treated as the happy path.
- No malicious APK or device compromise is known, so cf.t21 is not used unless new facts emerge.
- No court, consumer commission, civil suit, insurance or private recovery-agent engagement is modelled.

**Expected proofs:** `cf.proof01`, `cf.proof02`, `cf.proof03`, `cf.proof04`, `cf.proof05`, `cf.proof06`, `cf.proof13`, `cf.proof17`, `cf.proof18`. An actual restoration credit or police record is not included as expected because neither is assured.

The scenario is deliberately bounded to a successful victim-authorised SBI-linked UPI payment in Karnataka on 2026-08-28. Change of bank, app/PSP, rail, card network, transaction status, user-authorisation facts, State/UT or device/SIM facts changes the graph and may change the available remedies.

## Qualifying questions

| ID | Question | Why it matters | Answer | Options | Tasks | Blocking logic | Status |
|---|---|---|---|---|---|---|---|
| `cf.q01` | Is money still moving, is the fraudster still connected, or is there an immediate threat to personal safety? | Ongoing loss requires containment and 1930/bank reporting before slower complaint work; a safety emergency requires 112/local police. | single_select | Money or access may still be at risk; Fraud has stopped but is recent; Immediate personal-safety threat; Unknown | `cf.t01`, `cf.t02`, `cf.t03` | Do not wait for perfect evidence or classification before cf.t02 and cf.t03. If there is a safety emergency, use 112/local police in parallel. | Verified |
| `cf.q02` | For each disputed transaction, what are the exact date/time, amount, reference number and current status? | NCRP, the bank/issuer, NPCI and RBI CMS need transaction identifiers, and failed-transaction timelines depend on the exact fact pattern. | text | — | `cf.t02`, `cf.t03`, `cf.t05`, `cf.t06`, `cf.t07`, `cf.t08`, `cf.t09`, `cf.t10`, `cf.t11`, `cf.t12` | Unknown fields do not block urgent reporting, but each missing identifier becomes an Action Required item before a transaction-specific claim is treated as complete. | Verified |
| `cf.q03` | Did the user personally approve the transaction by entering a UPI PIN, OTP, card authentication or banking password, even because of deception? | The RBI liability frameworks in this pack govern unauthorised transactions; a victim-authorised scam must not be promised the same result. | single_select | No approval by user; User approved because deceived; Mixed transactions; Unknown | `cf.t05`, `cf.t07`, `cf.t08`, `cf.t09`, `cf.t11`, `cf.t12` | Unknown or disputed authorisation blocks any zero-liability conclusion. Immediate containment and reporting continue. | Candidate |
| `cf.q04` | Which channels and actors are involved? | Bank account, card, UPI, IMPS, NEFT, RTGS, ATM, merchant card payment and PPI/wallet routes have different actors and rules. | multi_select | UPI; IMPS; NEFT; RTGS; Debit card; Credit card; ATM; Bank net/mobile banking; Non-bank PPI/wallet; Other or unknown | `cf.t02`, `cf.t05`, `cf.t07`, `cf.t08`, `cf.t09`, `cf.t10`, `cf.t11`, `cf.t12`, `cf.t18` | The actual bank, issuer, PSP/TPAP, wallet and network must be resolved from the statement/app before channel-specific escalation is presented as complete. | Verified |
| `cf.q05` | Was the transaction successful, pending, declined/failed, or is the status inconsistent across the app and bank statement? | RBI failed-transaction auto-reversal rules do not provide a universal reversal right for a successful fraud transfer. | single_select | Successful and credited; Pending; Declined/failed but debited; Inconsistent or unknown | `cf.t05`, `cf.t09`, `cf.t10`, `cf.t11`, `cf.t12` | Do not apply a T+1 or T+5 failed-transaction timeline until the bank/PSP confirms that the fact pattern matches the RBI definition and row. | Verified |
| `cf.q06` | Is the registered phone/SIM lost, stolen, unexpectedly out of service, ported, duplicated, or associated with unknown mobile connections? | SIM takeover and lost-device cases require the telecom-service-provider and Sanchar Saathi/CEIR branches in addition to financial containment. | multi_select | No telecom issue known; SIM unexpectedly inactive; Phone lost/stolen; Unknown connections in name; Other telecom compromise; Unknown | `cf.t13`, `cf.t14`, `cf.t15` | A lost/stolen device enables cf.t14; SIM compromise enables cf.t13. Provider-specific blocking/reissue details remain Action Required until the actual TSP is identified. | Candidate |
| `cf.q07` | Were credentials shared, a remote-access app installed, email/cloud/social accounts accessed, or the device otherwise compromised? | Further access can continue after the first payment and account recovery is provider-specific. | multi_select | No known compromise; OTP/PIN/password shared; Remote-access or sideloaded app; Email/cloud account compromised; Device compromise suspected; Unknown | `cf.t02`, `cf.t04`, `cf.t07`, `cf.t08`, `cf.t15`, `cf.t21` | Potential compromise enables cf.t15; an installed suspicious Android APK materially matching the cited threat enables cf.t21. Do not factory-reset or delete evidence before preserving what police/bank may need unless immediate containment requires isolation. | Candidate |
| `cf.q08` | In which State/UT was the victim located when the incident occurred, and what is the present contact location? | NCRP routes complaints to State/UT police and current nodal/grievance contacts are state-specific. | text | — | `cf.t06`, `cf.t16`, `cf.t17` | Missing location blocks reliable State/UT routing; do not substitute another state's procedure. | Verified |
| `cf.q09` | Has each bank/PSP/card/wallet complaint already been filed, and what are its reference number, filing timestamp, reply and published escalation timeline? | RBI CMS is not the first complaint forum and its 2026 eligibility clock depends on the regulated-entity complaint and any longer RBI/NPCI/card-network timeline. | text | — | `cf.t18`, `cf.t19` | No proof of prior complaint blocks RBI CMS maintainability. A final unsatisfactory reply may enable immediate CMS filing, subject to the 2026 Scheme. | Verified |
| `cf.q10` | Has any amount actually been credited back, placed on hold/lien, restored under a police/court process, or only described verbally? | A hold is not the same as restoration, and a verbal assurance is not completion proof. | single_select | Credited and visible; Hold/lien reported; Restoration process reported; Rejected/closed; Only verbal or unknown | `cf.t17`, `cf.t18`, `cf.t19`, `cf.t20` | Only an account credit plus matching written disposition, or a documented final closure, completes cf.t20. | Candidate |

## Task graph

Immediate containment and national reporting are independent roots. Transaction-specific recovery branches begin only after classification; State/UT police, regulated-actor grievance and RBI escalation remain separate dependencies.

~~~mermaid
flowchart TD
  cf_t01["Immediate: stop further engagement and open a timestamped incident log"]
  cf_t02["Immediate: notify every affected bank, PSP, card issuer or wallet and contain access"]
  cf_t03["Immediate: call 1930 for financial cyber fraud"]
  cf_t04["Immediate: preserve transaction and communication evidence"]
  cf_t05["Gate: classify each transaction without delaying urgent reports"]
  cf_t06["Report and track: submit the complete NCRP financial-fraud complaint"]
  cf_t07["Branch: pursue an unauthorised bank/card electronic-transaction claim"]
  cf_t08["Branch: pursue an unauthorised non-bank PPI/wallet claim"]
  cf_t09["Branch: request recovery action for a successful victim-authorised scam transfer"]
  cf_t10["Branch: apply the RBI failed-transaction TAT only to a matching failure"]
  cf_t11["Channel branch: use UPI app/bank/NPCI complaint routing correctly"]
  cf_t12["Channel branch: bank-transfer recall/status for RTGS, NEFT or IMPS"]
  cf_t13["Telecom branch: block a compromised SIM and review mobile connections"]
  cf_t14["Device-loss branch: block the lost/stolen handset through CEIR"]
  cf_t15["Account/device branch: secure compromised digital access from a trusted environment"]
  cf_t16["Police dependency: cooperate with the assigned State/UT law-enforcement authority"]
  cf_t17["Track NCRP and escalate an inadequate portal response to the listed State/UT contact"]
  cf_t18["Complaint escalation: obtain the regulated actor's written final position"]
  cf_t19["RBI escalation: assess and file under RB-IOS 2026 through CMS"]
  cf_t20["Outcome: prove restoration/reversal or preserve documented closure"]
  cf_t21["Conditional device branch: contain a suspected malicious Android APK"]
  cf_t01 -->|enables| cf_t05
  cf_t02 -->|enables| cf_t05
  cf_t03 -->|enables| cf_t06
  cf_t04 -->|evidence_for| cf_t06
  cf_t05 -->|conditional_on| cf_t07
  cf_t05 -->|conditional_on| cf_t08
  cf_t05 -->|conditional_on| cf_t09
  cf_t05 -->|conditional_on| cf_t10
  cf_t05 -->|conditional_on| cf_t11
  cf_t05 -->|conditional_on| cf_t12
  cf_t13 -->|conditional_on| cf_t14
  cf_t04 -->|requires| cf_t15
  cf_t06 -->|enables| cf_t16
  cf_t06 -->|enables| cf_t17
  cf_t02 -->|enables| cf_t18
  cf_t18 -->|requires| cf_t19
  cf_t17 -->|evidence_for| cf_t20
  cf_t18 -->|evidence_for| cf_t20
  cf_t19 -->|evidence_for| cf_t20
  cf_t07 -->|alternative_to| cf_t09
  cf_t04 -->|evidence_for| cf_t21
  cf_t21 -->|evidence_for| cf_t20
~~~

### `cf.t01` — Immediate: stop further engagement and open a timestamped incident log

**Goal:** Prevent a second payment and preserve an accurate sequence of events while urgent calls begin.  
**Classification:** INCIDENT_RESPONSE; secondary DOCUMENT_PREPARATION  
**Status:** Verified  
**Actors:** `cf.actor.user`  
**Prerequisites:** —  
**Trigger:** Suspected or confirmed cyber-financial fraud, whether payment is ongoing, recent or discovered later.  
**Channel:** private  
**Portal journeys:** —  
**Required inputs:** `cf.in01`, `cf.in02`, `cf.in16`

Steps:

1. Stop replying to the fraudster and do not send a verification, tax, release or recovery payment.
2. Record discovery time, transaction time, actors contacted and every reference number in one chronology.
3. If there is an immediate personal-safety emergency, call 112/local police while another trusted person handles the financial calls.

Fees/duties:

- None verified or applicable.

Timelines:

- **Start:** Immediately on discovery — Verified. Applies: All suspected financial cyber frauds; bank and 1930 reporting should not wait for a polished dossier. Claims: `cf.c01`, `cf.c12`

**Completion proofs:** `cf.proof01`

**Tracking:** Maintain a contemporaneous incident log; append rather than overwrite prior entries.

**Rejection/return handling:** Not applicable; this is user-controlled containment documentation.

**Escalation:** Proceed in parallel to cf.t02 and cf.t03; do not wait for cf.t04 or cf.t05.

**State/local dependency:** Yes — 112 and emergency police response are State/UT operated; use only for an actual emergency. (Verified)

**Claims:** `cf.c01`, `cf.c02`, `cf.c12`

**Fail closed:** The log proves what the user recorded, not what the bank, fraudster or police did.

### `cf.t02` — Immediate: notify every affected bank, PSP, card issuer or wallet and contain access

**Goal:** Create a timestamped regulated-actor fraud report and block or restrict compromised channels before further debits occur.  
**Classification:** INCIDENT_RESPONSE; secondary REGULATED_PRIVATE_DEPENDENCY  
**Status:** Verified  
**Actors:** `cf.actor.bank`, `cf.actor.card_issuer`, `cf.actor.ppi_issuer`, `cf.actor.upi_psp`, `cf.actor.rbi`  
**Prerequisites:** —  
**Trigger:** Any affected account, card, UPI handle, wallet, net-banking/mobile-banking credential or payment instrument.  
**Channel:** regulated_actor  
**Portal journeys:** `cf.portal.sbi`  
**Required inputs:** `cf.in02`, `cf.in10`, `cf.in16`

Steps:

1. Use the number in the regulated actor's official app/site, card back or transaction alert; never use a search-ad result or number supplied by the fraudster.
2. Report the transaction as fraud, state whether the user approved it, and request the actor's available containment action: card block, UPI block, net-banking/mobile-banking disablement, account debit restriction or wallet suspension.
3. Ask for a complaint/reference number, report timestamp, affected instruments, and written confirmation of what was blocked.
4. Ask the actor to preserve transaction logs and attempt its available fraud hold/recall/beneficiary-bank coordination without representing that it must succeed.

Fees/duties:

- None verified or applicable.

Timelines:

- **Unauthorised-transaction notification:** At the earliest; 24x7 reporting channels must be available for covered banks/non-bank PPI issuers — Verified. Applies: Covered unauthorised electronic transactions; immediate containment is still prudent for victim-authorised scams. Claims: `cf.c12`, `cf.c22`

**Completion proofs:** `cf.proof02`, `cf.proof03`

**Tracking:** Track each actor separately by complaint number; record promised callback or document deadlines.

**Rejection/return handling:** If the call centre refuses, use the actor's direct online fraud link/app/branch and escalate to its grievance/nodal officer while preserving the refusal details.

**Escalation:** cf.t18, then cf.t19 when the 2026 RBI CMS eligibility gate is satisfied for a covered regulated entity.

**State/local dependency:** No — Regulated-actor containment is separate from police routing. (Verified)

**Claims:** `cf.c12`, `cf.c13`, `cf.c22`, `cf.c30`, `cf.c49`, `cf.c50`

**Fail closed:** A complaint or block confirmation does not prove that funds were held or will be reversed.

### `cf.t03` — Immediate: call 1930 for financial cyber fraud

**Goal:** Put the recent transaction into the national CFCFRMS/NCRP response path as quickly as possible.  
**Classification:** INCIDENT_RESPONSE; secondary TRANSACTION_SUBMISSION, STATE_LOCAL_DEPENDENCY  
**Status:** Verified  
**Actors:** `cf.actor.i4c`, `cf.actor.state_lea`  
**Prerequisites:** —  
**Trigger:** Ongoing or recent cyber-financial fraud; especially when funds may still be traceable in the payment system.  
**Channel:** official_offline  
**Portal journeys:** `cf.portal.ncrp`  
**Required inputs:** `cf.in01`, `cf.in02`, `cf.in06`

Steps:

1. Call 1930 and identify the incident as financial cyber fraud.
2. Give the bank/wallet/merchant, transaction reference/UTR if known, date/time, amount, victim mobile and suspect identifiers requested by the operator.
3. Record the call time, any acknowledgement/login/reference number and the exact instruction for completing the NCRP complaint.
4. If the call is unanswered, continue cf.t02 and file cf.t06 directly; do not treat an unanswered call as a reason to wait.

Fees/duties:

- None verified or applicable.

Timelines:

- **Helpline availability:** 1930, 24x7 — Verified. Applies: Cyber financial fraud immediate reporting in India. Claims: `cf.c01`

**Completion proofs:** `cf.proof04`

**Tracking:** Use any acknowledgement actually issued in the NCRP journey and incident log; no current nationwide public source verified a universal 1930 caller acknowledgement artifact, helpline-to-portal deadline or caller-facing hold status.

**Rejection/return handling:** If 1930 is unavailable, use https://cybercrime.gov.in and preserve attempted-call evidence.

**Escalation:** cf.t06, cf.t16 and cf.t17; exact State/UT police action remains local.

**State/local dependency:** Yes — 1930 call centres and subsequent complaint handling involve State/UT police within the national framework. (Verified)

**Claims:** `cf.c01`, `cf.c07`, `cf.c08`, `cf.c09`, `cf.c63`, `cf.c64`, `cf.c66`

**Fail closed:** Calling 1930 does not guarantee a freeze, lien, FIR or recovery.

### `cf.t04` — Immediate: preserve transaction and communication evidence

**Goal:** Keep the material needed by NCRP, the regulated actor and police without exposing credentials.  
**Classification:** DOCUMENT_PREPARATION; secondary INCIDENT_RESPONSE  
**Status:** Verified  
**Actors:** `cf.actor.user`, `cf.actor.i4c`  
**Prerequisites:** —  
**Trigger:** Any suspected cybercrime complaint.  
**Channel:** private  
**Portal journeys:** `cf.portal.ncrp`  
**Required inputs:** `cf.in01`, `cf.in02`, `cf.in03`, `cf.in04`, `cf.in05`, `cf.in06`, `cf.in07`

Steps:

1. Save bank statements, transaction receipts, alerts, emails, full URLs, chat transcripts, suspect-number screenshots, images and videos before messages/accounts disappear.
2. Keep original files unchanged where possible and work from copies; note who collected each item and when.
3. Mask credentials in working summaries, but preserve originals securely for authorised bank/police submission.
4. Do not send PIN, OTP, password or CVV as evidence.

Fees/duties:

- None verified or applicable.

Timelines:

- None verified or applicable.

**Completion proofs:** `cf.proof05`

**Tracking:** Maintain an evidence index and retain portal-generated hash values for uploaded files where supplied.

**Rejection/return handling:** If an upload is rejected, keep the original, create a compliant copy within the portal's published size/format limits, and record the transformation.

**Escalation:** Provide evidence only through official bank/portal/police channels; ask the investigating officer before destructive device remediation when forensic value may exist.

**State/local dependency:** No — Evidence collection is user-controlled; admissibility and further forensic collection are case-specific. (Candidate)

**Claims:** `cf.c03`, `cf.c04`, `cf.c05`, `cf.c06`

**Fail closed:** This task preserves potential evidence; it does not determine authenticity, admissibility or liability.

### `cf.t05` — Gate: classify each transaction without delaying urgent reports

**Goal:** Route each debit to the correct unauthorised, victim-authorised or failed-transaction branch.  
**Classification:** ELIGIBILITY_ASSESSMENT; secondary CLASSIFICATION_VALUATION  
**Status:** Candidate  
**Actors:** `cf.actor.user`, `cf.actor.bank`, `cf.actor.ppi_issuer`  
**Prerequisites:** `cf.t01`, `cf.t02`  
**Trigger:** After urgent containment has begun and transaction evidence is available.  
**Channel:** hybrid  
**Portal journeys:** —  
**Required inputs:** `cf.in02`, `cf.in04`, `cf.in16`

Steps:

1. For each debit, record whether the user approved it and how, whether credentials were shared, and whether the actor's systems show success, pending or failure.
2. Route no-user-approval bank/card debits to cf.t07 and no-user-approval non-bank PPI debits to cf.t08.
3. Route successful payments approved because of deception to cf.t09 plus the channel task; do not label them zero-liability eligible without the regulated actor's reasoned determination.
4. Route debited-but-not-completed domestic payment-system events to cf.t10 only when the exact RBI failed-transaction row matches.

Fees/duties:

- None verified or applicable.

Timelines:

- None verified or applicable.

**Completion proofs:** `cf.proof01`

**Tracking:** Maintain a per-transaction classification table and update it when the bank/PSP supplies final status.

**Rejection/return handling:** If facts or actor status conflict, mark the transaction Unknown/Conflict and pursue both the fraud complaint and status enquiry without asserting a liability result.

**Escalation:** cf.t18 for a written regulated-actor determination; cf.t19 for eligible deficiency-in-service complaints.

**State/local dependency:** No — Police may characterize offences, but this gate addresses payment-complaint routing rather than criminal-law classification. (Verified)

**Claims:** `cf.c12`, `cf.c18`, `cf.c26`, `cf.c36`, `cf.c37`, `cf.c38`, `cf.c69`

**Fail closed:** User approval, actor authentication and legal authorisation are not assumed equivalent; disputed classification remains Action Required.

### `cf.t06` — Report and track: submit the complete NCRP financial-fraud complaint

**Goal:** Create the national portal complaint, upload usable evidence and obtain a trackable reference.  
**Classification:** TRANSACTION_SUBMISSION; secondary STATE_LOCAL_DEPENDENCY  
**Status:** Verified  
**Actors:** `cf.actor.i4c`, `cf.actor.state_lea`  
**Prerequisites:** `cf.t03`, `cf.t04`  
**Trigger:** After a 1930 call or directly when online filing is the fastest available path.  
**Channel:** official_portal  
**Portal journeys:** `cf.portal.ncrp`  
**Required inputs:** `cf.in01`, `cf.in02`, `cf.in03`, `cf.in04`, `cf.in05`, `cf.in06`, `cf.in07`

Steps:

1. Open https://cybercrime.gov.in using a trusted device and select the financial-fraud/other-cybercrime report-and-track route shown by the live portal.
2. Register/login with the victim's valid Indian mobile and OTP, select the victim's State/UT accurately, and enter the incident chronology.
3. Enter each bank/wallet/merchant, transaction ID/UTR, date and amount; upload the required identity and relevant evidence within current form limits.
4. Submit, save the on-screen confirmation, complaint reference, SMS/email and any evidence hash values.

Fees/duties:

- None verified or applicable.

Timelines:

- **OTP validity:** 30 minutes — Verified. Applies: NCRP citizen registration/login. Claims: `cf.c02`

**Completion proofs:** `cf.proof06`, `cf.proof07`

**Tracking:** Log in and use Check Status with the acknowledgement number; preserve status snapshots and communications.

**Rejection/return handling:** Correct incomplete/invalid fields, retain rejected files, and use the portal's State/UT nodal/grievance contacts when response is not appropriate.

**Escalation:** cf.t16 and cf.t17; an NCRP complaint is not itself proof of FIR conversion.

**State/local dependency:** Yes — The selected State/UT police handles the complaint, FIR conversion and subsequent action under law. (Verified)

**Claims:** `cf.c02`, `cf.c03`, `cf.c04`, `cf.c05`, `cf.c06`, `cf.c07`, `cf.c08`

**Fail closed:** The reference proves submission, not that a bank hold, FIR or investigation outcome exists.

### `cf.t07` — Branch: pursue an unauthorised bank/card electronic-transaction claim

**Goal:** Have the covered bank determine liability under the applicable RBI framework and produce a reasoned written outcome.  
**Classification:** CLAIM_RECOVERY; secondary REGULATED_PRIVATE_DEPENDENCY, ELIGIBILITY_ASSESSMENT  
**Status:** Verified  
**Actors:** `cf.actor.bank`, `cf.actor.card_issuer`, `cf.actor.rbi`  
**Prerequisites:** `cf.t02`, `cf.t05`  
**Trigger:** The user did not approve the electronic bank/card transaction, subject to the covered institution and facts.  
**Channel:** regulated_actor  
**Portal journeys:** —  
**Required inputs:** `cf.in02`, `cf.in03`, `cf.in04`, `cf.in08`, `cf.in16`

Steps:

1. Submit the unauthorised-transaction complaint using the bank's official 24x7 route and preserve the exact notification timestamp.
2. State whether credentials were shared and attach the transaction alert/statement without conceding liability beyond known facts.
3. Request the bank's classification, Board-approved customer-liability policy, provisional credit decision and final reasoned determination.
4. For a lost card, demand immediate block and retain the blocking confirmation.

Fees/duties:

- None verified or applicable.

Timelines:

- **Third-party breach notice:** Within 3 working days of bank communication: zero liability; 4-7 working days: capped liability; beyond 7: bank Board policy — Verified. Applies: Only third-party breach where deficiency lies neither with bank nor customer; working days follow home-branch schedule and exclude communication date. Claims: `cf.c14`, `cf.c16`, `cf.c17`
- **Shadow reversal:** Within 10 working days of customer notification — Verified. Applies: Unauthorised transaction under the applicable bank circular; provisional/value-dated credit is not a final liability finding. Claims: `cf.c18`
- **Liability resolution:** Bank Board policy, not exceeding 90 days from complaint — Verified. Applies: Applicable covered unauthorised bank transaction. Claims: `cf.c19`

**Completion proofs:** `cf.proof02`, `cf.proof03`, `cf.proof13`

**Tracking:** Track the 10-working-day provisional-credit and 90-day outer resolution clocks from the bank's acknowledged notification/complaint date.

**Rejection/return handling:** Challenge unsupported customer-negligence or authorisation findings through the bank's grievance/nodal route with evidence; the bank bears the burden of proving customer liability under the cited framework.

**Escalation:** cf.t18 and cf.t19 when eligible.

**State/local dependency:** No — Bank liability assessment is separate from State/UT criminal investigation, although the bank may request police/NCRP records under its current policy. (Verified)

**Claims:** `cf.c12`, `cf.c13`, `cf.c14`, `cf.c15`, `cf.c16`, `cf.c17`, `cf.c18`, `cf.c19`, `cf.c20`, `cf.c30`

**Fail closed:** Zero liability depends on the transaction being unauthorised and the applicable fault/reporting facts; it is never inferred solely from the word fraud.

### `cf.t08` — Branch: pursue an unauthorised non-bank PPI/wallet claim

**Goal:** Use the PPI issuer's mandated fraud-reporting and liability process for an unauthorised wallet/PPI debit.  
**Classification:** CLAIM_RECOVERY; secondary REGULATED_PRIVATE_DEPENDENCY, ELIGIBILITY_ASSESSMENT  
**Status:** Verified  
**Actors:** `cf.actor.ppi_issuer`, `cf.actor.rbi`  
**Prerequisites:** `cf.t02`, `cf.t05`  
**Trigger:** An unauthorised debit from a non-bank-issued PPI, subject to PPI type and exclusions.  
**Channel:** regulated_actor  
**Portal journeys:** —  
**Required inputs:** `cf.in02`, `cf.in04`, `cf.in08`, `cf.in16`

Steps:

1. Use the direct unauthorised-transaction option on the issuer's official app/homepage or its 24x7 website/SMS/email/dedicated toll-free route.
2. Obtain the immediate complaint number and confirmation of action to prevent further PPI transactions.
3. Request the issuer's Board policy, liability classification, notional-credit decision and final reasoned outcome.

Fees/duties:

- None verified or applicable.

Timelines:

- **Third-party breach notice:** Within 3 days: zero; 4-7 days: transaction value or Rs 10,000, whichever lower; beyond 7: issuer Board policy — Verified. Applies: Covered non-bank PPI third-party breach, excluding the date the issuer's communication was received. Claims: `cf.c24`
- **Notional reversal:** Within 10 days of notification — Verified. Applies: Covered unauthorised PPI transaction; not a final liability determination. Claims: `cf.c25`
- **Resolution:** Not more than 90 days — Verified. Applies: Covered unauthorised non-bank PPI complaint. Claims: `cf.c26`

**Completion proofs:** `cf.proof02`, `cf.proof03`, `cf.proof13`

**Tracking:** The PPI issuer must provide specific complaint numbers and status tracking; preserve the issuer's published escalation matrix.

**Rejection/return handling:** Check whether the instrument is a bank-issued PPI or excluded PPI-MTS; route bank-issued PPI to cf.t07 and unresolved covered non-bank PPI service deficiency to cf.t19 when eligible.

**Escalation:** cf.t18 and cf.t19.

**State/local dependency:** No — PPI liability is a regulated-actor determination distinct from police recovery. (Verified)

**Claims:** `cf.c21`, `cf.c22`, `cf.c23`, `cf.c24`, `cf.c25`, `cf.c26`, `cf.c27`

**Fail closed:** Confirm issuer and PPI category; excluded PPI-MTS and victim-authorised transfers cannot inherit these protections automatically.

### `cf.t09` — Branch: request recovery action for a successful victim-authorised scam transfer

**Goal:** Seek a hold, recall, beneficiary-bank coordination or fraud review without claiming a stop-payment or zero-liability right.  
**Classification:** CLAIM_RECOVERY; secondary REGULATED_PRIVATE_DEPENDENCY, GRIEVANCE_ESCALATION  
**Status:** Candidate  
**Actors:** `cf.actor.bank`, `cf.actor.upi_psp`, `cf.actor.ppi_issuer`, `cf.actor.beneficiary_bank`, `cf.actor.state_lea`  
**Prerequisites:** `cf.t02`, `cf.t03`, `cf.t05`  
**Trigger:** The user approved a successful transfer because of impersonation, deception, coercion or a fraudulent collect request.  
**Channel:** hybrid  
**Portal journeys:** `cf.portal.ncrp`, `cf.portal.sbi`  
**Required inputs:** `cf.in02`, `cf.in04`, `cf.in05`, `cf.in08`, `cf.in09`, `cf.in16`

Steps:

1. Tell the bank/PSP exactly that the payment was approved because of deception; do not misstate it as no-user-approval.
2. Request the actor's available fraud hold, recall, beneficiary-bank contact, account restriction and written investigation process.
3. Give the regulated actor the NCRP/1930 reference when available and ask what additional police document it requires.
4. Continue the State/UT police and actor grievance tracks even if the payment system shows success.

Fees/duties:

- None verified or applicable.

Timelines:

- **Guaranteed reversal or recall:** not stated — Unavailable. Applies: No universal current primary rule in this pack guarantees recovery of a successful victim-authorised scam transfer. Claims: `cf.c36`, `cf.c38`

**Completion proofs:** `cf.proof02`, `cf.proof06`, `cf.proof13`, `cf.proof14`

**Tracking:** Track actor and NCRP references separately; require written status instead of relying on verbal 'funds frozen' statements.

**Rejection/return handling:** If the actor rejects because the transaction was authenticated, request a reasoned written response addressing the fraud report and any available recovery action; do not convert this into a zero-liability claim without evidence.

**Escalation:** cf.t16, cf.t18 and, for deficiency in service by a covered regulated entity, cf.t19 when eligible.

**State/local dependency:** Yes — Tracing, criminal process and any legal release/restoration dependency are State/UT and case-specific. (Verified)

**Claims:** `cf.c07`, `cf.c08`, `cf.c09`, `cf.c36`, `cf.c37`, `cf.c38`, `cf.c51`, `cf.c66`, `cf.c69`

**Fail closed:** Fraudulent inducement is serious but does not itself prove an unauthorised electronic transaction, successful recall or fund availability.

### `cf.t10` — Branch: apply the RBI failed-transaction TAT only to a matching failure

**Goal:** Obtain the mandated auto-reversal/compensation for a domestic payment that failed for a reason not attributable to the customer.  
**Classification:** CLAIM_RECOVERY; secondary TRACKING_FOLLOW_UP, REGULATED_PRIVATE_DEPENDENCY  
**Status:** Conflict  
**Actors:** `cf.actor.bank`, `cf.actor.card_issuer`, `cf.actor.ppi_issuer`, `cf.actor.upi_psp`  
**Prerequisites:** `cf.t05`  
**Trigger:** Account/PPI debited but the transaction did not complete, and the exact RBI row applies.  
**Channel:** regulated_actor  
**Portal journeys:** `cf.portal.npci`  
**Required inputs:** `cf.in02`, `cf.in03`, `cf.in04`, `cf.in08`

Steps:

1. Obtain the bank/PSP's recorded final transaction status and identify the exact RBI Annex row.
2. Raise the complaint with the bank/PSP/app and quote transaction reference, date and failure condition.
3. Check for automatic principal reversal and suo-moto compensation after the applicable calendar-day deadline.
4. If the transaction was successful, leave this branch and use cf.t09 or the merchant/card dispute route.

Fees/duties:

- None verified or applicable.

Timelines:

- **UPI/IMPS funds transfer:** Auto-reversal latest T+1 calendar day; Rs 100/day beyond T+1 — Verified. Applies: Domestic debit to originator with beneficiary not credited. Claims: `cf.c33`
- **UPI merchant/card POS-CNP merchant confirmation failure:** Auto-reversal T+5 calendar days; Rs 100/day beyond T+5 — Verified. Applies: Domestic debit where merchant confirmation is not received; not a completed purchase dispute. Claims: `cf.c31`, `cf.c34`
- **ATM cash not dispensed:** Reversal within T+5 calendar days; Rs 100/day beyond T+5 — Verified. Applies: Account debited but cash not dispensed. Claims: `cf.c32`
- **PPI on-us failure:** Reversal within T+1 calendar day; Rs 100/day beyond T+1 — Verified. Applies: Beneficiary PPI not credited or merchant confirmation not received; off-us follows underlying rail. Claims: `cf.c35`

**Completion proofs:** `cf.proof09`, `cf.proof14`

**Tracking:** T is the calendar date of transaction; verify the reversal credit date and separate principal from compensation.

**Rejection/return handling:** If app status and bank ledger differ, raise both a status complaint and regulated-actor grievance; treat NPCI's general 48-hour pending FAQ as an apparent conflict, not a substitute for the binding row.

**Escalation:** cf.t18 and cf.t19 after the applicable higher guideline/30-day eligibility period under RB-IOS 2026.

**State/local dependency:** No — Failed-transaction TAT is a payment-system rule, not a police recovery route. (Verified)

**Claims:** `cf.c28`, `cf.c29`, `cf.c31`, `cf.c32`, `cf.c33`, `cf.c34`, `cf.c35`, `cf.c39`

**Fail closed:** A successful fraudulent transfer is not reclassified as failed to obtain a TAT remedy.

### `cf.t11` — Channel branch: use UPI app/bank/NPCI complaint routing correctly

**Goal:** Create a UPI dispute record with the customer-facing app and bank, using NPCI only for the functions its portal currently exposes.  
**Classification:** GRIEVANCE_ESCALATION; secondary REGULATED_PRIVATE_DEPENDENCY, TRACKING_FOLLOW_UP  
**Status:** Verified  
**Actors:** `cf.actor.upi_psp`, `cf.actor.bank`, `cf.actor.npci`  
**Prerequisites:** `cf.t02`, `cf.t05`  
**Trigger:** A UPI transaction is involved.  
**Channel:** hybrid  
**Portal journeys:** `cf.portal.npci`  
**Required inputs:** `cf.in02`, `cf.in04`, `cf.in08`

Steps:

1. Raise/check the transaction complaint in the participating UPI app when that app supports the scenario.
2. Also notify the account-holding/remitter bank; NPCI instructed member banks to acknowledge customer complaints irrespective of the PSP app used.
3. For fraudulent/unidentified/unauthorised transactions, follow the NPCI complaint page's direction to the respective bank.
4. Use NPCI's complaint portal only for a supported product/scenario; save the CRN and continue with the member institution that is responsible for resolution.

Fees/duties:

- None verified or applicable.

Timelines:

- None verified or applicable.

**Completion proofs:** `cf.proof09`

**Tracking:** Check the app/NPCI CRN and bank complaint separately; the NPCI portal says the member institution remains responsible for resolution.

**Rejection/return handling:** If one participant redirects the user, cite the bank's complaint acceptance duty and keep both refusal and complaint records.

**Escalation:** cf.t18; cf.t19 only after determining the applicable NPCI/RBI/card-network or 30-day eligibility period under the 2026 Scheme.

**State/local dependency:** No — UPI dispute routing is separate from NCRP/State police handling, though both may run concurrently. (Verified)

**Claims:** `cf.c37`, `cf.c40`, `cf.c41`, `cf.c42`, `cf.c43`

**Fail closed:** NPCI receipt is not a recovery decision, and its public complaint form is not the stated fraud-redress route.

### `cf.t12` — Channel branch: bank-transfer recall/status for RTGS, NEFT or IMPS

**Goal:** Have the remitting bank trace status and attempt any available bank-to-bank recovery without promising revocation.  
**Classification:** CLAIM_RECOVERY; secondary REGULATED_PRIVATE_DEPENDENCY, GRIEVANCE_ESCALATION  
**Status:** Candidate  
**Actors:** `cf.actor.bank`, `cf.actor.beneficiary_bank`  
**Prerequisites:** `cf.t02`, `cf.t05`  
**Trigger:** A credit-push bank transfer by RTGS, NEFT or IMPS is involved.  
**Channel:** regulated_actor  
**Portal journeys:** —  
**Required inputs:** `cf.in02`, `cf.in03`, `cf.in08`, `cf.in09`

Steps:

1. Ask the remitting bank for final status, beneficiary-bank details available to it, and an immediate fraud recall/hold request if its process permits.
2. For RTGS, recognize that the RBI FAQ describes payments as final and irrevocable; distinguish non-credit/failed status from successful credit.
3. Provide 1930/NCRP/police references when available and require a written bank disposition.

Fees/duties:

- None verified or applicable.

Timelines:

- **Successful fraud-transfer reversal:** not stated — Unavailable. Applies: RTGS is final and irrevocable; no universal successful NEFT/IMPS fraud-recall timeline was verified. Claims: `cf.c44`, `cf.c45`

**Completion proofs:** `cf.proof02`, `cf.proof13`, `cf.proof14`

**Tracking:** Use the UTR/reference and bank complaint number; request positive/final status rather than assuming non-credit.

**Rejection/return handling:** Escalate bank service failures internally; legal recovery from a credited beneficiary account remains case-specific.

**Escalation:** cf.t16, cf.t18 and cf.t19 when eligible.

**State/local dependency:** Yes — Police/legal process may be required after funds are credited; no national local-court release workflow is asserted. (Candidate)

**Claims:** `cf.c28`, `cf.c33`, `cf.c44`, `cf.c45`

**Fail closed:** A recall request is an attempt, not a right to reverse a completed credit-push transfer.

### `cf.t13` — Telecom branch: block a compromised SIM and review mobile connections

**Goal:** Stop telecom-account misuse and identify connections issued in the victim's name.  
**Classification:** INCIDENT_RESPONSE; secondary REGULATED_PRIVATE_DEPENDENCY  
**Status:** Candidate  
**Actors:** `cf.actor.tsp`, `cf.actor.dot`  
**Prerequisites:** `cf.t01`  
**Trigger:** Unexpected loss of service, SIM-swap/porting signs, unknown connections, or phone/SIM theft.  
**Channel:** hybrid  
**Portal journeys:** `cf.portal.tafcop`  
**Required inputs:** `cf.in10`, `cf.in11`

Steps:

1. Contact the actual telecom service provider through its official app/site/store and request immediate SIM block plus a fraud flag.
2. Ask for a complaint/reference number and the identity requirements for a replacement SIM.
3. Use Sanchar Saathi's Know Mobile Connections in Your Name service to review and report unknown connections.
4. After restoring control, re-check bank and email recovery numbers before re-enabling financial access.

Fees/duties:

- None verified or applicable.

Timelines:

- **TSP SIM block/reissue:** not stated — Candidate. Applies: Provider-specific first-party route and proof must be verified for the actual TSP. Claims: `cf.c48`

**Completion proofs:** `cf.proof10`

**Tracking:** Track TSP complaint and Sanchar Saathi report independently.

**Rejection/return handling:** Escalate through the identified TSP's current grievance route; do not invent a universal number or reissue timeline.

**Escalation:** cf.t14 if the handset is lost/stolen and cf.t16 if impersonation/theft requires police action.

**State/local dependency:** No — SIM service is provider-specific; police dependency arises for device theft or criminal investigation. (Candidate)

**Claims:** `cf.c47`, `cf.c48`, `cf.c80`

**Fail closed:** Sanchar Saathi review does not itself block the compromised SIM; confirm the TSP action in writing.

### `cf.t14` — Device-loss branch: block the lost/stolen handset through CEIR

**Goal:** Block the handset IMEI across Indian networks and retain a trackable CEIR request.  
**Classification:** TRANSACTION_SUBMISSION; secondary INCIDENT_RESPONSE, STATE_LOCAL_DEPENDENCY  
**Status:** Verified  
**Actors:** `cf.actor.dot`, `cf.actor.tsp`, `cf.actor.state_lea`  
**Prerequisites:** `cf.t13`  
**Trigger:** The mobile handset is lost or stolen.  
**Channel:** official_portal  
**Portal journeys:** `cf.portal.ceir`  
**Required inputs:** `cf.in11`, `cf.in12`

Steps:

1. File and retain the police report for the lost/stolen handset.
2. Obtain a duplicate SIM for the lost number from the TSP because CEIR sends OTP to the reissued primary number.
3. Submit IMEI/device, loss, police-report and identity details in the CEIR block form.
4. Save the Request ID and check status; unblock only after the found handset is back in the user's possession and police requirements are satisfied.

Fees/duties:

- None verified or applicable.

Timelines:

- **CEIR block after successful request:** Within 24 hours — Verified. Applies: Successfully submitted lost/stolen handset block request; it does not guarantee recovery. Claims: `cf.c46`
- **SMS availability on a re-issued SIM:** After 24 hours of SIM activation — Verified. Applies: CEIR FAQ statement attributed to TRAI regulation; relevant because the CEIR OTP is sent to the re-issued primary number, not a universal TSP reissue SLA. Claims: `cf.c68`

**Completion proofs:** `cf.proof10`, `cf.proof11`

**Tracking:** Use CEIR Request ID or supported police complaint number on the CEIR status page.

**Rejection/return handling:** Correct missing IMEI/police/identity data; for a new lost phone never used with a SIM, contact the CEIR district nodal police officer as the form directs.

**Escalation:** CEIR helpdesk and State/UT police; tracing/recovery is not guaranteed.

**State/local dependency:** Yes — A police report is required and device recovery is handled with State/UT police. (Verified)

**Claims:** `cf.c46`, `cf.c68`

**Fail closed:** IMEI blocking prevents network use after processing; it does not erase data, block financial accounts or guarantee device recovery.

### `cf.t15` — Account/device branch: secure compromised digital access from a trusted environment

**Goal:** Remove persistence that could cause further fraud while preserving material needed for investigation.  
**Classification:** INCIDENT_RESPONSE; secondary PRIVATE_COMMERCIAL_STEP  
**Status:** Candidate  
**Actors:** `cf.actor.user`, `cf.actor.private_provider`  
**Prerequisites:** `cf.t02`, `cf.t04`  
**Trigger:** Credential sharing, remote-access installation, suspicious sessions, email takeover or device compromise.  
**Channel:** private  
**Portal journeys:** —  
**Required inputs:** `cf.in05`, `cf.in10`

Steps:

1. From a trusted device, use each provider's official account-recovery route to change unique passwords and revoke unknown sessions/recovery methods.
2. Remove bank access and payment permissions before re-enabling ordinary use; follow the bank's instructions for re-registration.
3. Preserve evidence before deleting apps, messages or resetting the device; if forensic examination may be required, ask the investigating officer or qualified responder first.
4. Do not pay an unsolicited recovery agent or install another remote-access tool.

Fees/duties:

- None verified or applicable.

Timelines:

- None verified or applicable.

**Completion proofs:** `cf.proof12`

**Tracking:** Keep official provider confirmation emails and a list of revoked sessions/recovery changes.

**Rejection/return handling:** Use the actual provider's official recovery escalation; no universal private-platform procedure is asserted.

**Escalation:** cf.t16 for criminal evidence and provider-specific support for access recovery.

**State/local dependency:** No — Forensic seizure or examination, if any, is a police/legal dependency and must be separately instructed. (Candidate)

**Claims:** `cf.c03`, `cf.c05`, `cf.c48`

**Fail closed:** Generic hardening cannot replace the actual provider's recovery instructions or a forensic preservation decision.

### `cf.t16` — Police dependency: cooperate with the assigned State/UT law-enforcement authority

**Goal:** Provide complete records, obtain police references when issued, and follow lawful case-specific instructions.  
**Classification:** STATE_LOCAL_DEPENDENCY; secondary INSPECTION_VERIFICATION, TRACKING_FOLLOW_UP  
**Status:** Candidate  
**Actors:** `cf.actor.state_lea`  
**Prerequisites:** `cf.t06`  
**Trigger:** NCRP assignment, police contact, local complaint/FIR need, device theft, or bank request for police documentation.  
**Channel:** state_local  
**Portal journeys:** `cf.portal.ncrp`  
**Required inputs:** `cf.in01`, `cf.in02`, `cf.in03`, `cf.in04`, `cf.in05`, `cf.in06`, `cf.in09`

Steps:

1. Respond to the assigned State/UT police request with the NCRP reference and indexed evidence.
2. Ask what acknowledgement, diary number, FIR copy or statement record will be issued and retain what is actually provided.
3. Give devices/original evidence only against an appropriate receipt or documented instruction.
4. Ask for the investigating contact and the lawful process, if any, for restoration of held funds; do not assume a hold can be released directly by the bank.

Fees/duties:

- None verified or applicable.

Timelines:

- **FIR conversion/investigation/restoration:** not stated — Unavailable. Applies: State/UT and case-specific; no national completion timeline is verified. Claims: `cf.c08`, `cf.c09`, `cf.c52`

**Completion proofs:** `cf.proof06`, `cf.proof15`

**Tracking:** Use the NCRP status plus police-issued references; record all requests and submissions.

**Rejection/return handling:** Use the NCRP State/UT nodal/grievance contact when portal response is not appropriate; local procedural remedies require local verification.

**Escalation:** cf.t17; any court/legal remedy is outside this pack and requires qualified local advice.

**State/local dependency:** Yes — Police and public order are State subjects; State/UT LEAs handle FIR conversion, investigation, chargesheets, arrest and complaint resolution. (Verified)

**Claims:** `cf.c07`, `cf.c08`, `cf.c09`, `cf.c52`

**Fail closed:** NCRP submission cannot be represented as an FIR, and no police action or timeline is promised.

### `cf.t17` — Track NCRP and escalate an inadequate portal response to the listed State/UT contact

**Goal:** Maintain a current status record and use the portal's official grievance route without inventing jurisdiction.  
**Classification:** TRACKING_FOLLOW_UP; secondary GRIEVANCE_ESCALATION, STATE_LOCAL_DEPENDENCY  
**Status:** Verified  
**Actors:** `cf.actor.i4c`, `cf.actor.state_lea`  
**Prerequisites:** `cf.t06`  
**Trigger:** A trackable NCRP complaint exists and status is unclear, stale or inadequate.  
**Channel:** official_portal  
**Portal journeys:** `cf.portal.ncrp`  
**Required inputs:** `cf.in09`, `cf.in11`

Steps:

1. Check status in NCRP using the acknowledgement/reference.
2. Save each material status change and any assigned police contact.
3. If response is not appropriate, use the current State/UT nodal/grievance contact listed by NCRP and include the reference and concise issue.

Fees/duties:

- None verified or applicable.

Timelines:

- None verified or applicable.

**Completion proofs:** `cf.proof06`, `cf.proof16`

**Tracking:** NCRP Check Status and the State/UT grievance correspondence.

**Rejection/return handling:** Verify the live nodal page before use because named officials can change; preserve bounced-email or failed-call evidence.

**Escalation:** State/UT authority shown on the live NCRP page; no central override is inferred.

**State/local dependency:** Yes — The portal provides state-specific nodal/grievance contacts for inappropriate response. (Verified)

**Claims:** `cf.c06`, `cf.c08`, `cf.c09`, `cf.c62`

**Fail closed:** A portal status or grievance email does not prove fund availability or restoration.

### `cf.t18` — Complaint escalation: obtain the regulated actor's written final position

**Goal:** Convert calls and verbal assurances into a complete complaint record suitable for RBI CMS or documented closure.  
**Classification:** GRIEVANCE_ESCALATION; secondary TRACKING_FOLLOW_UP, REGULATED_PRIVATE_DEPENDENCY  
**Status:** Verified  
**Actors:** `cf.actor.bank`, `cf.actor.card_issuer`, `cf.actor.ppi_issuer`, `cf.actor.upi_psp`  
**Prerequisites:** `cf.t02`  
**Trigger:** Initial complaint exists, documents are requested, status is unclear, or the user disputes the actor's response.  
**Channel:** regulated_actor  
**Portal journeys:** `cf.portal.sbi`  
**Required inputs:** `cf.in08`, `cf.in09`, `cf.in13`, `cf.in14`

Steps:

1. Submit all requested non-secret supporting documents through the actor's official route and record delivery.
2. Escalate through the published grievance/nodal officer levels, retaining every acknowledgement and reply.
3. Request a written statement of final transaction status, liability/recovery decision, amount credited/held if any, reasons, and further appeal route.
4. For a covered regulated entity's partly or wholly rejected complaint, do not contact the Internal Ombudsman directly: check that the final response says the Internal Ombudsman examined the complaint, gives reasons, and advises the RBI Ombudsman/CMS/CRPC route.
5. Record the applicable RBI/NPCI/card-network complaint timeline because RB-IOS 2026 uses the higher applicable period or 30 days.

Fees/duties:

- None verified or applicable.

Timelines:

- **PPI ordinary grievance resolution:** Preferably within 48 hours and not later than 30 days — Verified. Applies: PPI issuer customer complaints under the PPI Master Direction; unauthorised-PPI liability has its separate 90-day outer framework. Claims: `cf.c21`
- **Covered regulated entity internal review:** All partly or wholly rejected complaints auto-escalated to the Internal Ombudsman within 20 days of receipt; final decision communicated within 30 days of receipt — Verified. Applies: Only regulated entities covered by the RBI Internal Ombudsman Directions, 2023; the customer does not complain directly to the Internal Ombudsman. Claims: `cf.c70`, `cf.c71`

**Completion proofs:** `cf.proof13`

**Tracking:** Use the actor complaint reference and published escalation matrix; for a covered regulated entity, track the 20-day Internal Ombudsman auto-escalation and 30-day final-communication clocks from the regulated entity's receipt, not an assumed date.

**Rejection/return handling:** If a document or complaint is returned, cure the stated defect and preserve both versions. A customer should not contact the Internal Ombudsman directly; if the covered entity's rejection omits the Internal Ombudsman examination statement, reasons or RBI Ombudsman/CMS/CRPC advice, preserve the omission and assess cf.t19 promptly.

**Escalation:** cf.t19 for covered RBI regulated entities when maintainable; State/UT police continues independently.

**State/local dependency:** No — This is the regulated actor's internal grievance track. (Verified)

**Claims:** `cf.c13`, `cf.c20`, `cf.c21`, `cf.c23`, `cf.c27`, `cf.c42`, `cf.c49`, `cf.c51`, `cf.c70`, `cf.c71`, `cf.c72`, `cf.c73`, `cf.c74`

**Fail closed:** Internal escalation does not extend the 90-day RBI Ombudsman filing window; calculate that window separately.

### `cf.t19` — RBI escalation: assess and file under RB-IOS 2026 through CMS

**Goal:** File a maintainable deficiency-in-service complaint against a covered RBI regulated entity within the current 2026 window.  
**Classification:** GRIEVANCE_ESCALATION; secondary TRANSACTION_SUBMISSION, TRACKING_FOLLOW_UP  
**Status:** Verified  
**Actors:** `cf.actor.rbi`, `cf.actor.bank`, `cf.actor.ppi_issuer`, `cf.actor.card_issuer`  
**Prerequisites:** `cf.t18`  
**Trigger:** The regulated entity gave an unsatisfactory reply/resolution, or gave no reply by 30 days or the longer applicable RBI/NPCI/card-network timeline.  
**Channel:** official_portal  
**Portal journeys:** `cf.portal.rbi_cms`  
**Required inputs:** `cf.in08`, `cf.in13`, `cf.in14`, `cf.in15`

Steps:

1. Confirm the respondent is covered by RB-IOS 2026 and the complaint alleges deficiency in service rather than only demanding police recovery; a suggestion, request for guidance or dispute showing no deficiency is not maintainable under the Scheme.
2. Check duplicate-forum maintainability: the same grievance pending before or decided by a court, tribunal, arbitrator or other judicial/quasi-judicial forum is excluded, but a criminal proceeding or police investigation is not treated as the same grievance for this exclusion.
3. Confirm proof of prior complaint, applicable higher timeline, latest reply date and the 90-day filing deadline.
4. File at https://cms.rbi.org.in, email crpc@rbi.org.in, or send the signed complaint/supporting documents to CRPC, RBI, Central Vista, Sector 17, Chandigarh 160017.
5. Save the RBI complaint number, track in CMS, respond to requests, and preserve the final communication.
6. If an Award is issued, decide acceptance/appeal within the stated period; do not promise an appeal from a non-appealable rejection.

Fees/duties:

- **RB-IOS filing/resolution fee:** No fee — Verified. Applies: Complaints under RB-IOS 2026. Claims: `cf.c57`

Timelines:

- **Earliest no-reply filing point:** After 30 days or the applicable longer RBI/NPCI/card-network timeline, whichever is higher — Verified. Applies: No reply; an unsatisfactory reply/resolution can enable filing without waiting for expiry, subject to the Scheme. Claims: `cf.c55`
- **Ombudsman filing window:** Within 90 days after that timeline expires or the last regulated-entity communication, whichever is later — Verified. Applies: Complaint to the regulated entity must also have been made within the Limitation Act period. Claims: `cf.c56`
- **Appeal:** Only against an Award; 30 days from receipt, with possible further period up to 30 days for sufficient cause — Verified. Applies: RB-IOS 2026 award appeal, not a general appeal from every closure/rejection. Claims: `cf.c60`

**Completion proofs:** `cf.proof17`, `cf.proof18`

**Tracking:** CMS complaint number plus mobile number; Contact Centre 14448 provides guidance/status assistance but is not a filing channel.

**Rejection/return handling:** Cure incomplete data only if still within time; use the reasoned closure to identify other lawful remedies. A pending police investigation does not itself create the duplicate-forum bar, but it also does not prove deficiency in service.

**Escalation:** Award appeal only when the 2026 Scheme permits; other legal remedies are outside this pack.

**State/local dependency:** No — RB-IOS is jurisdiction-neutral; police investigation remains a separate State/UT track. (Verified)

**Claims:** `cf.c54`, `cf.c55`, `cf.c56`, `cf.c57`, `cf.c58`, `cf.c59`, `cf.c60`, `cf.c61`, `cf.c75`, `cf.c76`, `cf.c77`

**Fail closed:** RBI CMS addresses deficiency in service by covered entities; it is not a police fund-recovery portal and does not guarantee compensation or reversal.

### `cf.t20` — Outcome: prove restoration/reversal or preserve documented closure

**Goal:** End the journey with verifiable money movement and written dispositions, or a clear unresolved/closed record for further advice.  
**Classification:** TRACKING_FOLLOW_UP; secondary CLAIM_RECOVERY, DOCUMENT_PREPARATION  
**Status:** Candidate  
**Actors:** `cf.actor.user`, `cf.actor.bank`, `cf.actor.ppi_issuer`, `cf.actor.state_lea`, `cf.actor.rbi`  
**Prerequisites:** `cf.t17`, `cf.t18`  
**Trigger:** Any actor reports a hold, reversal, restoration, rejection, settlement, award or closure.  
**Channel:** hybrid  
**Portal journeys:** —  
**Required inputs:** `cf.in09`, `cf.in13`, `cf.in14`

Steps:

1. Reconcile every claimed credit to the actual bank/PPI statement and original transaction reference.
2. Obtain the bank/issuer's final liability and complaint disposition, police/NCRP status, and RBI final communication where applicable.
3. Do not treat lien/hold, provisional shadow/notional credit, or verbal assurance as final restored funds.
4. Prepare a closure ledger listing recovered, provisionally credited, held, rejected and unresolved amounts plus remaining legal/action gates.

Fees/duties:

- None verified or applicable.

Timelines:

- **CFCFRMS restoration/lien-removal citizen timeline:** not stated — Unavailable. Applies: The 2026 SOP/MRM/GRM exists, but a public universal citizen workflow and completion time were not verified. Claims: `cf.c52`, `cf.c53`

**Completion proofs:** `cf.proof13`, `cf.proof14`, `cf.proof15`, `cf.proof18`, `cf.proof19`

**Tracking:** Retain statements and written dispositions for the limitation period or longer if proceedings continue; exact retention is case-specific.

**Rejection/return handling:** If actors disagree, keep the case open as Conflict and seek qualified legal/local advice rather than reporting a false completion.

**Escalation:** Any further court, consumer, civil, insurance or professional recovery route is outside this pack and requires fact-specific advice.

**State/local dependency:** Yes — Held-fund restoration may depend on State/UT police and legal process under the 2026 SOP. (Candidate)

**Claims:** `cf.c18`, `cf.c25`, `cf.c38`, `cf.c52`, `cf.c53`, `cf.c66`

**Fail closed:** Completion requires a matching statement credit and written disposition, or documented closure; partial hold and pending status remain Action Required.

### `cf.t21` — Conditional device branch: contain a suspected malicious Android APK

**Goal:** Stop a currently suspected malicious Android app from communicating while preserving available incident evidence and reporting financial activity.  
**Classification:** INCIDENT_RESPONSE; secondary DOCUMENT_PREPARATION, REGULATED_PRIVATE_DEPENDENCY  
**Status:** Verified  
**Actors:** `cf.actor.user`, `cf.actor.certin`, `cf.actor.bank`, `cf.actor.i4c`  
**Prerequisites:** —  
**Trigger:** The victim installed a suspected malicious RTO/eChallan-themed or materially similar Android APK associated with the incident.  
**Channel:** hybrid  
**Portal journeys:** `cf.portal.ncrp`  
**Required inputs:** `cf.in01`, `cf.in03`, `cf.in05`, `cf.in16`

Steps:

1. If safe and it will not delay active containment, preserve the message, URL, APK/app name, permissions, screenshots and timestamps; do not interact further with the sender.
2. Disconnect the affected phone from mobile data and Wi-Fi, uninstall the suspicious app and scan with a trusted antivirus product.
3. From a trusted environment where practicable, change relevant passwords and UPI PIN, check bank statements and report unusual account activity through the bank's official channel.
4. Report the incident through 1930/NCRP and retain the bank and NCRP references.

Fees/duties:

- None verified or applicable.

Timelines:

- None verified or applicable.

**Completion proofs:** `cf.proof05`, `cf.proof20`

**Tracking:** Record containment, uninstall, scan, credential-change and bank/NCRP report timestamps; keep any scan finding and official acknowledgement.

**Rejection/return handling:** If the app cannot be removed, the device remains abnormal or evidence/police preservation needs are unclear, keep it disconnected and seek qualified device incident-response or investigating-officer direction; do not improvise a destructive reset.

**Escalation:** cf.t02 for financial containment, cf.t06 for NCRP filing, cf.t16 for assigned State/UT police procedure and cf.t20 for documented outcome.

**State/local dependency:** No — CERT-In supplies a national technical containment baseline; forensic seizure or criminal investigation remains case-specific and State/UT dependent. (Verified)

**Claims:** `cf.c03`, `cf.c78`, `cf.c79`

**Fail closed:** This branch is verified only for the cited malicious-APK fact pattern; these steps do not prove the device forensically clean, attribution, a bank hold or recovery. Evidence capture must not delay disconnecting an actively harmful device.

## Dependency edges

| ID | From | Relation | To | Condition |
|---|---|---|---|---|
| `cf.e01` | `cf.t01` | enables | `cf.t05` | The incident log supplies authorisation and timing facts. |
| `cf.e02` | `cf.t02` | enables | `cf.t05` | Regulated actor supplies status and acknowledgement. |
| `cf.e03` | `cf.t03` | enables | `cf.t06` | Use any 1930 acknowledgement/instruction in online filing. |
| `cf.e04` | `cf.t04` | evidence_for | `cf.t06` | Evidence bundle supports NCRP submission. |
| `cf.e05` | `cf.t05` | conditional_on | `cf.t07` | Covered bank/card transaction not approved by user. |
| `cf.e06` | `cf.t05` | conditional_on | `cf.t08` | Covered non-bank PPI transaction not approved by user. |
| `cf.e07` | `cf.t05` | conditional_on | `cf.t09` | Successful transfer approved because of deception/coercion. |
| `cf.e08` | `cf.t05` | conditional_on | `cf.t10` | RBI failed-transaction definition and a specific Annex row match. |
| `cf.e09` | `cf.t05` | conditional_on | `cf.t11` | UPI is involved. |
| `cf.e10` | `cf.t05` | conditional_on | `cf.t12` | RTGS, NEFT or IMPS credit-push transfer is involved. |
| `cf.e11` | `cf.t13` | conditional_on | `cf.t14` | Handset is lost/stolen and CEIR prerequisites can be met. |
| `cf.e12` | `cf.t04` | requires | `cf.t15` | Preserve evidence before destructive remediation when safe. |
| `cf.e13` | `cf.t06` | enables | `cf.t16` | NCRP reference supports State/UT police liaison. |
| `cf.e14` | `cf.t06` | enables | `cf.t17` | Trackable NCRP complaint exists. |
| `cf.e15` | `cf.t02` | enables | `cf.t18` | Initial regulated-actor complaint exists. |
| `cf.e16` | `cf.t18` | requires | `cf.t19` | Proof of prior regulated-entity complaint and 2026 timing eligibility. |
| `cf.e17` | `cf.t17` | evidence_for | `cf.t20` | NCRP/police status contributes to closure. |
| `cf.e18` | `cf.t18` | evidence_for | `cf.t20` | Regulated-actor final position contributes to closure. |
| `cf.e19` | `cf.t19` | evidence_for | `cf.t20` | RBI final communication or award contributes to closure. |
| `cf.e20` | `cf.t07` | alternative_to | `cf.t09` | Do not use both liability characterisations for the same transaction unless facts are genuinely disputed and marked Conflict. |
| `cf.e21` | `cf.t04` | evidence_for | `cf.t21` | Preserve available message/app evidence when safe, but evidence capture must not delay disconnecting an actively harmful device. |
| `cf.e22` | `cf.t21` | evidence_for | `cf.t20` | The device-remediation and reporting log contributes to the documented case outcome; it does not prove forensic cleanliness or fund recovery. |

## Authorities and actors

| ID | Actor | Type | Role | Jurisdiction | Exact/bounded channel | Claim IDs |
|---|---|---|---|---|---|---|
| `cf.actor.user` | Victim/complainant | user | Supplies private facts, makes urgent reports, preserves evidence and validates actual credits/communications. | User's own case | Official actor channels only; never share credential secrets. | — |
| `cf.actor.i4c` | Indian Cyber Crime Coordination Centre / NCRP / CFCFRMS | central_government | Operates national cybercrime reporting infrastructure and CFCFRMS coordination framework. | India-wide national platform | 1930 and https://cybercrime.gov.in | `cf.c01`, `cf.c07`, `cf.c09`, `cf.c63`, `cf.c64`, `cf.c66`, `cf.c79` |
| `cf.actor.state_lea` | Concerned State/UT Police / Law-Enforcement Agency | state_local | Handles NCRP complaint, FIR conversion, investigation and subsequent action under law. | Selected/competent State or UT | NCRP assignment, local police and current NCRP nodal/grievance listing. | `cf.c08`, `cf.c09`, `cf.c62` |
| `cf.actor.rbi` | Reserve Bank of India / RBI Ombudsman / CRPC | statutory_regulator | Sets payment customer-protection rules, requires internal review of covered regulated-entity rejections, and provides alternate grievance redress. | India; covered entities under the RBI Internal Ombudsman Directions and RB-IOS 2026 | Customer uses the regulated entity's complaint channel for Internal Ombudsman review; https://cms.rbi.org.in, crpc@rbi.org.in, CRPC Chandigarh, and 14448 assistance for RB-IOS. | `cf.c54`, `cf.c55`, `cf.c56`, `cf.c58`, `cf.c70`, `cf.c71`, `cf.c72`, `cf.c73`, `cf.c74`, `cf.c75`, `cf.c76`, `cf.c77` |
| `cf.actor.npci` | National Payments Corporation of India | regulated_private | Operates UPI and other retail payment systems and exposes supported complaint/status routing to member institutions. | NPCI-operated payment systems | Participating UPI app and https://www.npci.org.in/register-a-complaint | `cf.c40`, `cf.c41`, `cf.c42`, `cf.c43`, `cf.c69` |
| `cf.actor.bank` | Victim's bank/remitter bank | regulated_private | Contains bank access, accepts complaints, determines covered unauthorised-transaction liability and coordinates payment-system action. | The user's account and applicable payment rail | Bank's official 24x7 fraud route, app/site, transaction alert, phone banking or branch. | `cf.c12`, `cf.c13`, `cf.c20`, `cf.c79` |
| `cf.actor.beneficiary_bank` | Beneficiary/receiving bank or institution | regulated_private | May receive CFCFRMS/bank/police requests and handle funds in the recipient account subject to law and system rules. | Recipient account/payment leg | Bank-to-bank, CFCFRMS and law-enforcement channels; not an assumed direct consumer route. | `cf.c09`, `cf.c43` |
| `cf.actor.card_issuer` | Credit/debit card issuer | regulated_private | Blocks lost cards, accepts unauthorised-use reports and processes card disputes under applicable issuer/network rules. | Issued card/account | Issuer's official 24x7 helpline/SMS/email/site/app/internet banking. | `cf.c30` |
| `cf.actor.ppi_issuer` | Bank or non-bank PPI/wallet issuer | regulated_private | Blocks PPI access, accepts unauthorised-PPI complaints and provides grievance tracking. | Issued PPI/wallet | Issuer's official app/homepage and 24x7 fraud channels. | `cf.c21`, `cf.c22`, `cf.c23` |
| `cf.actor.upi_psp` | UPI app / PSP / TPAP-facing support | regulated_private | Provides customer-facing UPI transaction status and supported dispute initiation while the account-holding bank remains essential. | UPI app and PSP relationship | In-app transaction history/report issue and official support. | `cf.c40`, `cf.c42`, `cf.c43` |
| `cf.actor.dot` | Department of Telecommunications / Sanchar Saathi / CEIR | central_government | Provides mobile-connection review, suspect-communication reporting and lost/stolen handset IMEI blocking/status tools. | India-wide telecom citizen services | https://sancharsaathi.gov.in and https://ceir.sancharsaathi.gov.in | `cf.c46`, `cf.c47`, `cf.c68`, `cf.c80` |
| `cf.actor.tsp` | Victim's telecom service provider | regulated_private | Blocks/reissues the actual SIM and records suspected SIM/account compromise. | The user's mobile connection | Provider's official app/site/store/grievance route, resolved for the actual provider. | `cf.c46`, `cf.c48` |
| `cf.actor.private_provider` | Email/cloud/social/device platform provider | private | Provides provider-specific account recovery, session revocation and security controls. | Provider account/device ecosystem | Only the provider's official recovery and security pages. | `cf.c48` |
| `cf.actor.certin` | Indian Computer Emergency Response Team (CERT-In) | central_government | Publishes competent national technical advisories for identified cyber threats; it does not determine bank liability or police recovery. | India; cited Android-malware threat guidance | https://www.cert-in.org.in | `cf.c78`, `cf.c79` |
| `cf.actor.sbi` | State Bank of India | regulated_private | Bounded demo bank and example of an exact first-party containment/complaint route. | SBI customer accounts | 1800 1111 09 for unauthorised transaction reporting; 1800 1234 IVR for card/INB/UPI block; https://crcf.sbi.co.in/ccf/ for grievance. | `cf.c49`, `cf.c50`, `cf.c51` |

## Portal journeys

### `cf.portal.ncrp` — National Cyber Crime Reporting Portal - financial/other cybercrime report and track

**Actor:** `cf.actor.i4c`  
**Official URL:** [https://cybercrime.gov.in/](https://cybercrime.gov.in/)  
**Authentication:** Name and valid Indian mobile number; OTP valid for 30 minutes; captcha. A compromised/lost registered phone may require telecom recovery first, but 1930 and bank calls should continue.

**Navigation:** Live portal menu: Register a Complaint -> Financial Fraud or Report Other Cybercrime/Report and Track as presented; login and select appropriate category/subcategory and State/UT.

**Inputs/uploads:**

- Incident date/time and at least the live form's required incident narrative
- Bank/wallet/merchant name
- 12-digit transaction ID/UTR where applicable
- Transaction date and fraud amount
- National ID image in the currently stated format/size
- Relevant evidence files within the currently stated limits
- Optional suspect mobile/email/account/URL/photograph details

**Submission proof:** On-screen confirmation plus SMS/email complaint reference for Report and Track/Other Cybercrime; preserve any file hash values.

**Tracking:** Log in, choose Check Status/Track Complaint and use the acknowledgement/reference number.

**Exception:** Use 1930 for immediate financial fraud; if portal response is not appropriate, use the current State/UT nodal/grievance contact at https://www.cybercrime.gov.in/webform/Crime_NodalGrivanceList.aspx.

**Access limitation:** OTP/captcha and dynamic form; public pages have internally inconsistent legacy copy, so confirm the live financial-fraud route. No current nationwide 24-hour helpline-to-portal deadline was verified.

**Claims:** `cf.c01`, `cf.c02`, `cf.c03`, `cf.c04`, `cf.c05`, `cf.c06`, `cf.c07`, `cf.c08`, `cf.c62`, `cf.c63`, `cf.c79`

### `cf.portal.npci` — NPCI complaint/status portal

**Actor:** `cf.actor.npci`  
**Official URL:** [https://www.npci.org.in/register-a-complaint](https://www.npci.org.in/register-a-complaint)  
**Authentication:** Product-specific form plus captcha; required fields vary by selected product/transaction type.

**Navigation:** Select product and transaction type, complete the displayed transaction/member fields, save and proceed; use Check Complaint Status for an existing CRN.

**Inputs/uploads:**

- Member/bank
- Transaction date
- Transaction/RRN
- Account/card fields as dynamically requested
- Transaction amount
- Captcha

**Submission proof:** Complaint Reference Number (CRN) when the portal accepts the supported complaint.

**Tracking:** Click Check Complaint Status and use the CRN/transaction details; verify final status with the member bank/institution.

**Exception:** The portal explicitly directs fraudulent/unidentified/unauthorised transactions to the respective bank for redressal.

**Access limitation:** NPCI facilitates routing to the relevant member; the member remains responsible for resolution. Do not infer support for every fraud scenario or a recovery promise.

**Claims:** `cf.c41`, `cf.c42`, `cf.c43`

### `cf.portal.rbi_cms` — RBI Complaint Management System under RB-IOS 2026

**Actor:** `cf.actor.rbi`  
**Official URL:** [https://cms.rbi.org.in/](https://cms.rbi.org.in/)  
**Authentication:** Dynamic CMS complaint form; provide a reachable mobile and the complaint/identity/contact details required by the current form. The public landing page is accessible; filing fields require live interaction.

**Navigation:** File a Complaint -> identify regulated entity and complaint -> provide prior regulated-entity complaint and facts -> upload supporting documents -> submit.

**Inputs/uploads:**

- Complainant contact/postal details
- Covered regulated entity and branch/location
- Prior complaint number/date and copy
- Account/card/transaction details
- Regulated entity reply, if any
- Facts, loss/inconvenience and relief sought
- Supporting documents

**Submission proof:** RBI CMS complaint number/acknowledgement.

**Tracking:** CMS Track a Complaint using complaint number and mobile; 14448 offers status/procedure assistance but does not file complaints.

**Exception:** Email crpc@rbi.org.in or send the signed complaint with supporting documents to CRPC, RBI, Central Vista, Sector 17, Chandigarh 160017.

**Access limitation:** Maintainability requires prior regulated-entity complaint and current 2026 timing/coverage rules. The RBI Scheme PDF was anti-bot blocked during verification; current RBI CMS and an accessible regulated-bank publication corroborated the scheme details.

**Claims:** `cf.c54`, `cf.c55`, `cf.c56`, `cf.c57`, `cf.c58`, `cf.c59`, `cf.c60`, `cf.c61`, `cf.c75`, `cf.c76`, `cf.c77`

### `cf.portal.sbi` — SBI complaint and containment route - bounded example

**Actor:** `cf.actor.sbi`  
**Official URL:** [https://crcf.sbi.co.in/ccf/](https://crcf.sbi.co.in/ccf/)  
**Authentication:** Dynamic SBI grievance portal; live authentication fields were not publicly rendered during verification. The official SBI site and policy point to this route.

**Navigation:** For containment call 1800 1111 09 or 1800 1234 -> 0 -> 1 card / 2 internet banking / 3 UPI; for written complaint use SBI grievance portal or branch.

**Inputs/uploads:**

- SBI account/transaction identifiers requested by official IVR/form
- Transaction facts and fraud narrative
- Supporting documents requested by SBI
- NCRP/police record if required under the applicable SBI policy/facts

**Submission proof:** Block-confirmation SMS and SBI complaint/ticket reference.

**Tracking:** SBI complaint status/contact-centre route tied to the ticket reference.

**Exception:** Nearest SBI branch and SBI's published grievance/nodal escalation.

**Access limitation:** SBI is a demo actor, not a universal bank route. The demo is victim-authorised, so no SBI/RBI zero-liability outcome is assumed.

**Claims:** `cf.c49`, `cf.c50`, `cf.c51`

### `cf.portal.ceir` — CEIR lost/stolen mobile block and status

**Actor:** `cf.actor.dot`  
**Official URL:** [https://ceir.sancharsaathi.gov.in/Request/CeirUserBlockRequestDirect.jsp](https://ceir.sancharsaathi.gov.in/Request/CeirUserBlockRequestDirect.jsp)  
**Authentication:** OTP to Mobile Number 1 after it has been reissued by the TSP; captcha and self-declaration.

**Navigation:** Block Stolen/Lost Mobile -> complete device, loss and owner sections -> OTP/captcha -> submit; then Check Request Status.

**Inputs/uploads:**

- Mobile numbers and IMEI(s)
- Device brand/model and price
- Loss place/date/State/UT/district/police station
- Police complaint number and copy
- Owner name/address/identity and masked Aadhaar where used
- Purchase invoice where requested/available

**Submission proof:** CEIR Request ID.

**Tracking:** https://ceir.sancharsaathi.gov.in/Request/CeirRequestStatus.jsp with Request ID or supported police complaint number.

**Exception:** For a new lost/stolen handset never used with a SIM, contact the CEIR district nodal police officer with FIR/police complaint containing the IMEI; CEIR helpdesk help-sancharsaathi@gov.in.

**Access limitation:** Police report and reissued primary SIM are prerequisites for the ordinary user flow; blocking does not guarantee tracing/recovery.

**Claims:** `cf.c46`, `cf.c68`

### `cf.portal.tafcop` — Sanchar Saathi - Know Mobile Connections in Your Name

**Actor:** `cf.actor.dot`  
**Official URL:** [https://tafcop.sancharsaathi.gov.in/telecomUser/](https://tafcop.sancharsaathi.gov.in/telecomUser/)  
**Authentication:** Mobile/OTP flow is expected from the official service but could not be live-verified because the direct page returned 403 to the research client.

**Navigation:** Sanchar Saathi web portal or official mobile app -> Know Mobile Connections in Your Name -> review/manage connections.

**Inputs/uploads:**

- Mobile/identity verification requested by the live service
- Selection of unknown or unnecessary connections

**Submission proof:** Service acknowledgement/status if issued by the live route.

**Tracking:** Use the live Sanchar Saathi service/app status route.

**Exception:** Contact the actual TSP through its official grievance route for SIM blocking/reissue.

**Access limitation:** Direct portal was access-blocked; exact current citizen steps and TSP action timing remain Candidate.

**Claims:** `cf.c47`, `cf.c48`, `cf.c80`

### `cf.portal.cfcfrms_grm` — CFCFRMS Grievance Redressal / Money Restoration modules - restricted interface

**Actor:** `cf.actor.i4c`  
**Official URL:** [https://ncrp-grievanceredressal.mha.gov.in/](https://ncrp-grievanceredressal.mha.gov.in/)  
**Authentication:** Credentialed I4C/alternate/bank-FI login; no verified public citizen login.

**Navigation:** Not a verified citizen journey; use NCRP/1930, assigned police and bank channels instead.

**Inputs/uploads:**

- Not publicly verified for citizen submission

**Submission proof:** No public citizen-facing artifact verified.

**Tracking:** Track through NCRP, State/UT police and regulated actor unless an authorised official gives a case-specific route.

**Exception:** NCRP State/UT nodal/grievance contact and the bank complaint route.

**Access limitation:** Login required; MHA confirms MRM/GRM functionality but no universal public citizen workflow/timeline was found.

**Claims:** `cf.c52`, `cf.c53`

## Required inputs

| ID | Input | Issuer/provider | Supplied by | When required | Format/validity | Tasks | Sensitivity | Claims |
|---|---|---|---|---|---|---|---|---|
| `cf.in01` | Timestamped incident chronology | Victim/complainant | Victim or trusted helper | From first discovery through closure | Contemporaneous text log; distinguish observed facts, recollection and actor statements. | `cf.t01`, `cf.t03`, `cf.t04`, `cf.t06`, `cf.t16`, `cf.t21` | sensitive_personal | `cf.c03` |
| `cf.in02` | Per-transaction identifiers and amounts | Bank/PSP/card/PPI statement or alert | Victim and regulated actor | Urgent bank/1930 report and every dispute | Transaction date/time, amount, status, UTR/RRN/transaction ID, bank/wallet/merchant; do not invent missing digits. | `cf.t01`, `cf.t02`, `cf.t03`, `cf.t05`, `cf.t06`, `cf.t07`, `cf.t08`, `cf.t09`, `cf.t10`, `cf.t11`, `cf.t12` | financial | `cf.c03`, `cf.c04` |
| `cf.in03` | Bank/card/PPI statement | Regulated actor | Victim downloads or actor issues | NCRP, liability claim, failed-transaction proof, police and closure | Original PDF/image or official statement; preserve full date range and source. | `cf.t04`, `cf.t06`, `cf.t07`, `cf.t10`, `cf.t12`, `cf.t16`, `cf.t21` | financial | `cf.c03` |
| `cf.in04` | Transaction alerts and receipts | Bank/PSP/card/PPI/merchant | Victim | Classification, portal report and dispute | Original SMS/email/app receipt/screenshot with timestamp and reference; never disclose OTP/PIN/CVV. | `cf.t04`, `cf.t05`, `cf.t06`, `cf.t07`, `cf.t08`, `cf.t09`, `cf.t10`, `cf.t11`, `cf.t16` | financial | `cf.c03`, `cf.c04` |
| `cf.in05` | Fraud communications and URLs | Fraud communication platform/device | Victim | Evidence preservation, NCRP and police | Copies of email, chats, full URLs, call logs, audio/video/images where lawfully held; retain originals. | `cf.t04`, `cf.t06`, `cf.t09`, `cf.t15`, `cf.t16`, `cf.t21` | sensitive_personal | `cf.c03` |
| `cf.in06` | Suspect identifiers | Victim observation and transaction records | Victim | 1930/NCRP/police | Mobile, email, bank account, UPI ID, URL, social handle, address/photo if known; label unverified identity claims. | `cf.t03`, `cf.t04`, `cf.t06`, `cf.t16` | sensitive_personal | `cf.c04` |
| `cf.in07` | Complainant national ID copy | Competent government issuer | Victim | NCRP portal | Current portal lists Voter ID, driving licence, passport, PAN or Aadhaar image in JPEG/JPG/PNG up to 5 MB; use masked Aadhaar where a portal specifically instructs. | `cf.t04`, `cf.t06` | sensitive_personal | `cf.c04` |
| `cf.in08` | Regulated-actor complaint proof | Bank/PSP/card/PPI issuer | Regulated actor and victim | Internal escalation and RBI CMS | Complaint/reference number, filing timestamp, complaint copy and delivery/acknowledgement. | `cf.t07`, `cf.t08`, `cf.t09`, `cf.t10`, `cf.t11`, `cf.t12`, `cf.t18`, `cf.t19` | financial | `cf.c13`, `cf.c23`, `cf.c55` |
| `cf.in09` | 1930/NCRP complaint reference | I4C/NCRP/State call centre | Official system/operator | Bank follow-up, police, tracking and closure | Preserve exact acknowledgement/reference and issuance channel; do not treat call log alone as portal submission. | `cf.t09`, `cf.t12`, `cf.t16`, `cf.t17`, `cf.t20` | sensitive_personal | `cf.c06` |
| `cf.in10` | Affected account/card/UPI/wallet/SIM identifiers | Relevant actor | Victim | Containment and telecom/account recovery | Use masked identifiers in working notes; disclose full identifiers only in the official authenticated route when required. | `cf.t02`, `cf.t13`, `cf.t15` | financial | — |
| `cf.in11` | Police complaint/FIR/diary record if issued | State/UT police | Police and victim | CEIR, bank policy if applicable, police tracking and restoration | Official reference/copy; distinguish complaint/diary from FIR. | `cf.t13`, `cf.t14`, `cf.t17` | sensitive_personal | `cf.c08`, `cf.c46` |
| `cf.in12` | CEIR device/loss/owner package | Device invoice, TSP, police and government ID issuer | Victim | Lost/stolen handset CEIR block | Mobile/IMEI, device details, loss place/date, police complaint, ID and reissued SIM/OTP as the live form requires. | `cf.t14` | sensitive_personal | `cf.c46` |
| `cf.in13` | Actor status and interim-action records | Bank/PSP/PPI/police/NCRP/RBI | Official actor and victim | Tracking, escalation and closure | Written status, hold/lien/provisional credit details, requested documents and dates; label verbal statements as unverified. | `cf.t18`, `cf.t19`, `cf.t20` | financial | `cf.c52`, `cf.c53` |
| `cf.in14` | Regulated-entity final reply | Covered regulated entity | Regulated entity | RBI CMS and closure | Complete reasoned reply with date, complaint reference, decision and further route. | `cf.t18`, `cf.t19`, `cf.t20` | financial | `cf.c55`, `cf.c56` |
| `cf.in15` | RBI CMS complaint data | Complainant and regulated entity | Complainant | RB-IOS 2026 filing | Contact/postal details, respondent, prior complaint proof, transaction, facts, loss/inconvenience, relief and supporting documents. | `cf.t19` | sensitive_personal | `cf.c58` |
| `cf.in16` | Authorisation and credential-use facts | Victim recollection plus actor authentication records | Victim and regulated actor | Classification and liability review | Record whether/when UPI PIN, OTP, password, card authentication or device approval was entered/shared; never include the secret value. | `cf.t01`, `cf.t02`, `cf.t05`, `cf.t07`, `cf.t08`, `cf.t09`, `cf.t21` | credential_secret | `cf.c15`, `cf.c36`, `cf.c78` |

## Completion proofs

| ID | Proof | Issuer | Artifact/reference | Validate | Tasks | Retention/use | Claims |
|---|---|---|---|---|---|---|---|
| `cf.proof01` | Timestamped incident/classification log | `cf.actor.user` | Dated chronology with per-transaction authorisation/status labels | Cross-check timestamps/references against actor alerts and acknowledgements. | `cf.t01`, `cf.t05` | Supports consistent reports; not independent proof of third-party conduct. | — |
| `cf.proof02` | Regulated-actor fraud complaint acknowledgement | `cf.actor.bank` | Complaint/ticket number with report timestamp | Confirm through the actor's official status channel. | `cf.t02`, `cf.t07`, `cf.t08`, `cf.t09`, `cf.t12` | Starts actor tracking and supports RBI CMS prior-complaint proof. | `cf.c13`, `cf.c23` |
| `cf.proof03` | Channel/card block confirmation | `cf.actor.bank` | SMS/email/app confirmation identifying the blocked instrument/channel | Verify through official app/phone banking without re-enabling the channel. | `cf.t02`, `cf.t07`, `cf.t08` | Proves containment request/result, not a fund hold. | `cf.c13`, `cf.c30`, `cf.c50` |
| `cf.proof04` | 1930 call record and acknowledgement if issued | `cf.actor.state_lea` | Call log plus exact operator acknowledgement/login/reference number if provided | Use the number in the NCRP flow or confirm with the assigned authority; call log alone is not portal submission proof. | `cf.t03` | Documents prompt reporting and instructions received. | `cf.c01` |
| `cf.proof05` | Indexed evidence bundle | `cf.actor.user` | Original/copy inventory of statements, receipts, messages, URLs and media | Compare file metadata and NCRP hash values where generated; preserve source context. | `cf.t04`, `cf.t21` | Supports bank, NCRP and police review. | `cf.c03`, `cf.c05` |
| `cf.proof06` | NCRP complaint reference | `cf.actor.i4c` | On-screen confirmation and SMS/email complaint reference | Log in and retrieve the complaint through Check Status. | `cf.t06`, `cf.t09`, `cf.t16`, `cf.t17` | National portal submission/tracking proof; not FIR proof. | `cf.c06` |
| `cf.proof07` | NCRP evidence hash values | `cf.actor.i4c` | Hash value generated for uploaded digital evidence where provided | Match the portal hash to the retained uploaded file. | `cf.t06` | Supports integrity checking of the uploaded evidence. | `cf.c05` |
| `cf.proof09` | UPI/NPCI/bank dispute reference | `cf.actor.npci` | In-app complaint ID, bank complaint or NPCI CRN as applicable | Check status in the issuing app/portal and verify final result with the member bank. | `cf.t10`, `cf.t11` | Tracks supported UPI/payment-system dispute; not recovery proof. | `cf.c41`, `cf.c42`, `cf.c43` |
| `cf.proof10` | SIM block/reissue confirmation | `cf.actor.tsp` | TSP complaint number and block/reissue receipt | Confirm through the TSP's official account/store and test restored service safely. | `cf.t13`, `cf.t14` | Proves telecom action and supports CEIR OTP route. | `cf.c46`, `cf.c48` |
| `cf.proof11` | CEIR Request ID/status | `cf.actor.dot` | CEIR Request ID and current status result | Check through the official CEIR Request Status page. | `cf.t14` | Tracks IMEI block/unblock; retain for recovered-device process. | `cf.c46` |
| `cf.proof12` | Provider account-recovery confirmations | `cf.actor.private_provider` | Official security emails/session-revocation/recovery confirmations | Review official account security/activity page from a trusted device. | `cf.t15` | Documents remediation; not proof the device is forensically clean. | `cf.c48` |
| `cf.proof13` | Regulated actor written determination | `cf.actor.bank` | Reasoned final reply stating status, liability/recovery result, amounts and dates | Match complaint number, transaction reference and statement entries. | `cf.t07`, `cf.t08`, `cf.t09`, `cf.t12`, `cf.t18`, `cf.t20` | Supports CMS, closure and further advice. | `cf.c19`, `cf.c26`, `cf.c55` |
| `cf.proof14` | Actual reversal/restoration credit | `cf.actor.bank` | Account/card/PPI statement credit tied to the disputed transaction | Reconcile amount, value date and reference; distinguish provisional shadow/notional credit from final restoration. | `cf.t09`, `cf.t10`, `cf.t12`, `cf.t20` | Primary proof of money returned. | `cf.c18`, `cf.c25`, `cf.c31`, `cf.c32`, `cf.c33`, `cf.c34`, `cf.c35` |
| `cf.proof15` | Police-issued complaint/diary/FIR/restoration record | `cf.actor.state_lea` | The specific record actually issued by the competent State/UT authority | Verify reference with the issuing police unit; do not label a complaint as FIR. | `cf.t16`, `cf.t20` | Case tracking, bank/CEIR requirements and lawful restoration process. | `cf.c08`, `cf.c09` |
| `cf.proof16` | NCRP status/grievance record | `cf.actor.i4c` | Check Status result and State/UT nodal grievance correspondence | Retrieve from official portal/official contact and match complaint reference. | `cf.t17` | Documents follow-up and escalation. | `cf.c06`, `cf.c08` |
| `cf.proof17` | RBI CMS complaint number | `cf.actor.rbi` | CMS acknowledgement/complaint number | Track in CMS with complaint number and mobile. | `cf.t19` | Proof of RB-IOS 2026 filing and tracking. | `cf.c58`, `cf.c59` |
| `cf.proof18` | RBI Ombudsman final communication or Award | `cf.actor.rbi` | Settlement/closure/rejection/Award communication and appeal record if applicable | Retrieve through CMS/official communication and check dates/conditions. | `cf.t19`, `cf.t20` | Final RBI grievance disposition; does not replace statement proof of payment. | `cf.c60` |
| `cf.proof19` | Case closure ledger | `cf.actor.user` | Reconciled list of disputed, recovered, provisionally credited, held, rejected and unresolved amounts | Every entry links to statement and written actor proof; unresolved entries remain open. | `cf.t20` | Handoff for legal/advisory follow-through and prevents double-counting recovery. | — |
| `cf.proof20` | Malicious-APK containment and reporting log | `cf.actor.user` | Timestamped record of network disconnect, suspicious app name/removal, scan result, credential/UPI-PIN changes and bank/NCRP reports | Cross-check with device/app records, official bank acknowledgement and NCRP reference where issued; it is not a forensic-cleanliness certificate. | `cf.t21` | Supports follow-up on a cited malicious-APK incident and identifies incomplete remediation. | `cf.c78`, `cf.c79` |

## Atomic claims

Only **Verified** claims may drive an ungated happy-path action. Candidate, Conflict, Stale and Unavailable rows create an Action Required gate.

| ID | Status | Atomic proposition | Subject / jurisdiction | Applicability | Sources | Exact locator | Conflicts | Freshness | Tasks |
|---|---|---|---|---|---|---|---|---|---|
| `cf.c01` | Verified | The NCRP identifies 1930 as the 24x7 number for immediate reporting of cyber financial fraud. | 1930 immediate reporting / India | Cyber financial fraud | `cf.s01` | Landing page banner: 'For immediate reporting, Call 1930 (24*7)' | — | medium | `cf.t01`, `cf.t03` |
| `cf.c02` | Verified | NCRP Report Other Cybercrime registration uses a valid Indian mobile number and an OTP valid for 30 minutes. | NCRP authentication / India | Tracked other-cybercrime/financial-fraud report | `cf.s02` | FAQ: What kind of information should I provide / How can I file other cybercrimes | — | medium | `cf.t01`, `cf.t06` |
| `cf.c03` | Verified | NCRP says evidence may include bank statements, online-transfer receipts, email copies, URLs, chat transcripts, suspect-number screenshots, videos, images and other documents. | NCRP evidence types / India | Cybercrime complaint | `cf.s02` | FAQ: What type of information would be considered as evidence | — | low | `cf.t04`, `cf.t06`, `cf.t15`, `cf.t21` |
| `cf.c04` | Verified | The current NCRP login checklist asks financial-fraud complainants to keep the bank/wallet/merchant, transaction ID/UTR, transaction date and fraud amount ready. | NCRP financial inputs / India | Financial-fraud complaint | `cf.s03` | Check list for Complainant, Mandatory Information item 4 | — | medium | `cf.t04`, `cf.t06` |
| `cf.c05` | Verified | NCRP states that a hash value generated for uploaded digital evidence can be used to ensure its integrity. | NCRP evidence hash / India | Digital evidence uploaded to NCRP where hash is generated | `cf.s02` | FAQ: What is Hash value and what is its purpose | — | low | `cf.t04`, `cf.t06` |
| `cf.c06` | Verified | A tracked NCRP complaint receives a complaint reference and can be checked through the portal's status function. | NCRP proof and tracking / India | Report and Track/Report Other Cybercrime submission | `cf.s02` | FAQ: submission confirmation and check status | — | medium | `cf.t04`, `cf.t06`, `cf.t17` |
| `cf.c07` | Verified | NCRP accepts complaints about online financial fraud and other cybercrimes. | NCRP scope / India | Cybercrime complaints | `cf.s02` | FAQ: purpose and reportable cybercrimes | `cf.conflict03` | medium | `cf.t03`, `cf.t06`, `cf.t09`, `cf.t16` |
| `cf.c08` | Verified | NCRP complaints are handled by the concerned State/UT police based on the selected State/UT. | NCRP police routing / India with State/UT execution | Submitted NCRP complaint | `cf.s02`, `cf.s04` | NCRP FAQ: What happens once I report; MHA PIB 28 July 2026 paragraph on State/UT LEAs | — | medium | `cf.t03`, `cf.t06`, `cf.t09`, `cf.t16`, `cf.t17` |
| `cf.c09` | Verified | MHA says FIR conversion, chargesheets, arrest and resolution of NCRP incidents are handled by the concerned State/UT LEAs under law. | Police outcome dependency / India with State/UT execution | NCRP incidents | `cf.s04` | PIB 28 July 2026, paragraph beginning 'Cyber crime incidents reported' | — | medium | `cf.t03`, `cf.t06`, `cf.t09`, `cf.t16` |
| `cf.c10` | Stale | A legacy Delhi-only CFCFRMS instruction says a 1930 acknowledgement complaint must be completed on NCRP within 24 hours. | 1930-to-NCRP deadline / Delhi only in source | Legacy Delhi instruction | `cf.s23` | Instruction item iv; document title says For Delhi Only | `cf.conflict01` | high | — |
| `cf.c11` | Unavailable | A current nationwide mandatory deadline for completing an NCRP complaint after calling 1930 was not found in the current public national pages reviewed. | Current nationwide completion deadline / India | 1930-originated complaint | `cf.s01`, `cf.s02`, `cf.s03`, `cf.s04`, `cf.s27` | Current landing page, FAQ, checklist and June/July 2026 MHA releases reviewed; no national deadline stated | `cf.conflict01` | high | — |
| `cf.c12` | Verified | Covered banks must provide 24x7 multiple channels for reporting unauthorised electronic transactions and take immediate steps to prevent further unauthorised transactions after a report. | Bank fraud reporting and containment / India | Scheduled commercial banks including RRBs, small finance banks and payments banks under the cited circular; co-operative banks use the parallel cited circular | `cf.s06`, `cf.s07` | 2017 circular paragraph 5; co-operative bank circular paragraph 5 | — | medium | `cf.t01`, `cf.t02`, `cf.t05`, `cf.t07` |
| `cf.c13` | Verified | A covered bank's fraud-reporting system must send an immediate acknowledgement with the registered complaint number. | Bank complaint proof / India | Unauthorised electronic transaction report under cited bank circulars | `cf.s06`, `cf.s07` | Paragraph 5, acknowledgement requirement | — | medium | `cf.t02`, `cf.t07`, `cf.t18` |
| `cf.c14` | Verified | For an unauthorised third-party breach where neither bank nor customer is at fault, reporting within three working days of bank communication gives zero customer liability. | Bank zero liability - third-party breach / India | Covered bank and qualifying unauthorised third-party breach | `cf.s06`, `cf.s07` | Paragraph 6(ii) and Table 2 | — | medium | `cf.t07` |
| `cf.c15` | Verified | Where loss from an unauthorised bank transaction is due to customer negligence such as sharing payment credentials, the customer bears loss until reporting; subsequent loss is borne by the bank. | Bank customer-negligence liability / India | Covered unauthorised bank transaction | `cf.s06`, `cf.s07` | Paragraph 7(i) | — | medium | `cf.t07` |
| `cf.c16` | Verified | For that qualifying third-party-breach scenario, notice in four to seven working days limits liability to the transaction value or applicable table cap, whichever is lower. | Bank limited liability / India | Covered unauthorised bank third-party breach | `cf.s06`, `cf.s07` | Paragraph 7(ii), Table 1 and Table 2 | — | medium | `cf.t07` |
| `cf.c17` | Verified | For notice beyond seven working days, customer liability is governed by the bank's Board-approved policy. | Late bank fraud notice / India | Covered unauthorised bank transaction | `cf.s06`, `cf.s07` | Paragraph 7 and Table 2 | — | medium | `cf.t07` |
| `cf.c18` | Verified | On notice of a covered unauthorised bank transaction, the bank must make a value-dated shadow credit within 10 working days without waiting for an insurance claim. | Bank shadow reversal / India | Covered unauthorised bank transaction | `cf.s06`, `cf.s07` | Paragraph 9 | — | medium | `cf.t05`, `cf.t07`, `cf.t20` |
| `cf.c19` | Verified | The bank must resolve the covered unauthorised-transaction complaint and establish liability within its Board policy period, not exceeding 90 days. | Bank liability resolution / India | Covered unauthorised bank transaction | `cf.s06`, `cf.s07` | Paragraph 10 | — | medium | `cf.t07` |
| `cf.c20` | Verified | The bank bears the burden of proving customer liability in a covered unauthorised electronic banking transaction. | Bank burden of proof / India | Covered unauthorised bank transaction | `cf.s06`, `cf.s07` | Paragraph 12 | — | low | `cf.t07`, `cf.t18` |
| `cf.c21` | Verified | PPI issuers must provide specific complaint numbers with status tracking and resolve ordinary customer complaints no later than 30 days, preferably initiating action within 48 hours. | PPI grievance tracking / India | PPI issuer grievance framework | `cf.s08` | Master Direction paragraphs 16.2(d)-(e) | — | medium | `cf.t08`, `cf.t18` |
| `cf.c22` | Verified | Non-bank PPI issuers must provide 24x7 website/SMS/email/dedicated toll-free reporting for unauthorised transactions or loss/theft and a direct complaint link. | PPI fraud reporting / India | Authorised non-bank PPI issuer | `cf.s08` | Paragraph 16.4.5(d)-(e) | — | medium | `cf.t02`, `cf.t08` |
| `cf.c23` | Verified | The non-bank PPI fraud-reporting system must send an immediate acknowledgement with complaint number and take immediate action to prevent further unauthorised PPI transactions. | PPI complaint proof and containment / India | Authorised non-bank PPI issuer | `cf.s08` | Paragraph 16.4.5(f) and following sentence | — | medium | `cf.t08`, `cf.t18` |
| `cf.c24` | Verified | For a qualifying non-bank PPI third-party breach, customer liability is zero within three days, capped at transaction value or Rs 10,000 in four to seven days, and follows issuer policy beyond seven days. | Non-bank PPI liability windows / India | Covered non-bank PPI third-party breach; date of communication excluded | `cf.s08` | Paragraph 16.4.6(b) and footnote | — | medium | `cf.t08` |
| `cf.c25` | Verified | A covered non-bank PPI issuer must make a value-dated notional credit within 10 days of notification without waiting for insurance settlement. | PPI notional reversal / India | Covered unauthorised non-bank PPI transaction | `cf.s08` | Paragraph 16.4.7 | — | medium | `cf.t08`, `cf.t20` |
| `cf.c26` | Verified | A covered non-bank PPI issuer must resolve and establish liability within its policy period, not exceeding 90 days. | PPI liability resolution / India | Covered unauthorised non-bank PPI transaction | `cf.s08` | Paragraph 16.4.8 | — | medium | `cf.t05`, `cf.t08` |
| `cf.c27` | Verified | The non-bank PPI issuer bears the burden of proving customer liability for a covered unauthorised electronic PPI transaction. | PPI burden of proof / India | Covered unauthorised non-bank PPI transaction | `cf.s08` | Paragraph 16.4.10 | — | low | `cf.t08`, `cf.t18` |
| `cf.c28` | Verified | RBI defines a failed transaction as one not fully completed for a reason not attributable to the customer and limits its TAT framework to domestic transactions. | Failed-transaction scope / India | Domestic authorised payment systems | `cf.s09` | Annex General Instructions paragraphs 2 and 7 | — | medium | `cf.t10`, `cf.t12` |
| `cf.c29` | Verified | Compensation under the RBI failed-transaction framework must be credited suo moto without waiting for a complaint. | Failed-transaction compensation / India | Matching failed transaction beyond the applicable TAT | `cf.s09` | Circular paragraph 5 | — | medium | `cf.t10` |
| `cf.c30` | Verified | Card issuers must block a lost card immediately on being informed, provide 24x7 unauthorised-use reporting channels, and immediately confirm the block. | Lost card containment / India | Card issuers covered by the Master Direction | `cf.s10` | Master Direction paragraph 23(e)-(g) | — | medium | `cf.t02`, `cf.t07` |
| `cf.c31` | Verified | For a domestic card POS or card-not-present merchant-confirmation failure, RBI prescribes auto-reversal within T+5 calendar days and Rs 100 per day beyond T+5. | Failed card merchant transaction / India | Account debited but merchant confirmation not received | `cf.s09` | Annex row 2(b)-(c) | — | medium | `cf.t10` |
| `cf.c32` | Verified | For an ATM debit with cash not dispensed, RBI prescribes reversal within T+5 calendar days and Rs 100 per day beyond T+5. | Failed ATM withdrawal / India | ATM/micro-ATM account debit with no cash | `cf.s09` | Annex row 1(a) | — | medium | `cf.t10` |
| `cf.c33` | Verified | For domestic UPI/IMPS funds transfer where the originator is debited but the beneficiary is not credited, RBI prescribes auto-reversal by T+1 calendar day and Rs 100 per day beyond T+1. | Failed UPI/IMPS transfer / India | Matching domestic non-credit failure | `cf.s09` | Annex rows 3(a) and 4(a) | `cf.conflict02` | medium | `cf.t10`, `cf.t12` |
| `cf.c34` | Verified | For a domestic UPI merchant payment where confirmation is not received at the merchant, RBI prescribes auto-reversal within T+5 calendar days and Rs 100 per day beyond T+5. | Failed UPI merchant payment / India | Matching merchant-confirmation failure | `cf.s09` | Annex row 4(b) | — | medium | `cf.t10` |
| `cf.c35` | Verified | For a PPI on-us beneficiary non-credit or merchant-confirmation failure, RBI prescribes reversal within T+1 calendar day and Rs 100 per day beyond T+1; off-us follows the underlying rail. | Failed PPI transaction / India | Matching PPI failure | `cf.s09` | Annex row 8(a)-(b) | — | medium | `cf.t10` |
| `cf.c36` | Candidate | No current primary source in this pack establishes that every transfer personally approved because of deception qualifies as an unauthorised electronic transaction under the RBI liability frameworks. | Victim-authorised scam liability / India | User entered the authorising factor despite deception | `cf.s06`, `cf.s08`, `cf.s21` | RBI frameworks repeatedly require an unauthorised transaction; SBI awareness page includes fraudulent collect requests but does not resolve regulatory liability | `cf.conflict04` | high | `cf.t05`, `cf.t09` |
| `cf.c37` | Verified | NPCI's UPI FAQ says a UPI payment cannot be stopped once initiated. | UPI stop payment / India | Initiated UPI payment | `cf.s11` | UPI FAQ: Can I put a stop payment request | — | medium | `cf.t05`, `cf.t09`, `cf.t11` |
| `cf.c38` | Unavailable | No universal guaranteed hold, recall, reversal timeline or recovery probability for a successful victim-authorised scam transfer was verified. | Successful scam recovery / India | Successful victim-authorised transfer | `cf.s04`, `cf.s11`, `cf.s22`, `cf.s27` | MHA describes increased possibility/coordination; NPCI says initiated UPI cannot be stopped; RTGS FAQ says final and irrevocable | — | high | `cf.t05`, `cf.t09`, `cf.t20` |
| `cf.c39` | Conflict | NPCI's public UPI FAQ says a pending debit may reach the beneficiary in 48 hours, while the binding RBI failed-transaction circular prescribes T+1 for the matching debit/non-credit failure. | UPI pending/non-credit timing / India | Status classification differs; bank must identify whether the RBI failed row applies | `cf.s09`, `cf.s11` | RBI Annex row 4(a); NPCI FAQ: transaction showing Pending | `cf.conflict02` | high | `cf.t10` |
| `cf.c40` | Verified | NPCI says UPI grievances/status can be raised through the participating bank's UPI app. | UPI in-app complaint / India | Supported UPI transaction complaint | `cf.s11` | UPI FAQ: Where do I register a complaint | — | medium | `cf.t11` |
| `cf.c41` | Verified | NPCI's complaint portal directs fraudulent, unidentified or unauthorised transaction complaints to the respective bank. | NPCI fraud routing / India | Fraudulent/unidentified/unauthorised transaction | `cf.s12` | Register a Complaint page note above form | — | medium | `cf.t11` |
| `cf.c42` | Verified | NPCI's complaint portal forwards supported complaints to the relevant member institution, which remains responsible for resolution. | NPCI member responsibility / India | Supported NPCI portal complaint | `cf.s12` | Register a Complaint disclaimer | — | medium | `cf.t11`, `cf.t18` |
| `cf.c43` | Verified | NPCI instructed UPI member banks to acknowledge customer complaints irrespective of the PSP app used and take necessary steps to address them. | UPI bank complaint acceptance / India | UPI customer complaint to remitter/beneficiary bank | `cf.s13` | UPI OC 40, paragraph beginning 'Please note that in case of any issue/complaint' | — | medium | `cf.t11` |
| `cf.c44` | Verified | RBI's RTGS FAQ describes RTGS payments as final and irrevocable. | RTGS finality / India | Successful RTGS payment | `cf.s22` | RTGS FAQ question 2 | — | medium | `cf.t12` |
| `cf.c45` | Verified | RBI's RTGS FAQ directs a customer with an RTGS dispute to the bank's grievance cell. | RTGS complaint route / India | RTGS dispute | `cf.s22` | RTGS FAQ question 22; 2021 Ombudsman reference in that FAQ is superseded for post-1 July 2026 complaints | — | medium | `cf.t12` |
| `cf.c46` | Verified | The CEIR lost/stolen handset flow requires a police report, reissued primary SIM for OTP, device/IMEI and identity details; after successful submission the phone is blocked within 24 hours and a Request ID supports tracking. | CEIR handset block / India | Lost/stolen handset ordinary user flow | `cf.s16`, `cf.s17` | CEIR FAQ 'How to block' and 'What happens after'; block form mandatory fields | — | medium | `cf.t14` |
| `cf.c47` | Verified | DoT describes Sanchar Saathi as providing Know Mobile Connections in Your Name and lost/stolen handset blocking services. | Sanchar Saathi telecom tools / India | Mobile subscriber safety | `cf.s18` | Key Features of Sanchar Saathi initiative | — | medium | `cf.t13` |
| `cf.c48` | Candidate | The exact current SIM-block/reissue route, proof and timing must be verified with the victim's actual telecom service provider; no universal TSP procedure was verified in this pack. | SIM compromise response / India | SIM compromise/loss | `cf.s16`, `cf.s18` | CEIR requires a TSP reissued SIM; Sanchar Saathi provides connection review, but no universal TSP block route is stated | — | high | `cf.t13`, `cf.t15` |
| `cf.c49` | Verified | SBI publishes 1800 1111 09 as its dedicated unauthorised-transaction reporting number. | SBI fraud reporting / India | SBI customer | `cf.s19`, `cf.s20` | SBI Contact Centre dedicated numbers; policy page 17 | — | high | `cf.t02`, `cf.t18` |
| `cf.c50` | Verified | SBI's 1800 1234 IVR offers card, internet-banking and UPI blocking under option 0, sub-options 1, 2 and 3 respectively. | SBI channel blocking / India | SBI customer | `cf.s19` | SBI Contact Centre step-by-step sections 0.1-0.3 | — | high | `cf.t02` |
| `cf.c51` | Verified | SBI points customers to https://crcf.sbi.co.in/ccf/ or a branch for a written fraud complaint after urgent containment. | SBI grievance route / India | SBI customer | `cf.s21` | Things To Do In Case of Frauds, step 3 | — | high | `cf.t09`, `cf.t18` |
| `cf.c52` | Verified | MHA says the 2026 NCRP-CFCFRMS SOP standardises complaint processing, bank coordination, grievance redress, lien removal and restoration of defrauded funds. | CFCFRMS restoration framework / India with State/UT execution | NCRP/CFCFRMS complaints under the SOP | `cf.s04` | PIB 28 July 2026 paragraphs on SOP and MRM/GRM | — | high | `cf.t16`, `cf.t20` |
| `cf.c53` | Unavailable | The public CFCFRMS grievance/restoration portals expose credentialed I4C/bank-FI logins, and no universal citizen-facing workflow or restoration timeline was verified. | CFCFRMS citizen restoration access / India | Citizen seeking lien/restoration status | `cf.s04`, `cf.s25` | MHA confirms modules; GRM page shows credentialed I4C/Alternate/Bank-FI login only | — | high | `cf.t20` |
| `cf.c54` | Verified | RB-IOS 2026 took effect on 1 July 2026 and replaced RB-IOS 2021 for new complaints. | Current RBI Ombudsman scheme / India | Complaints received on/after 1 July 2026 | `cf.s14`, `cf.s15`, `cf.s26` | RBI FAQ Q1; Standard Chartered salient features; RBI CMS welcome banner | — | high | `cf.t19` |
| `cf.c55` | Verified | Under RB-IOS 2026 the complainant must first complain to the regulated entity; absent a satisfactory reply, the no-reply gate is 30 days or the longer applicable RBI/NPCI/card-network timeline. | RB-IOS prior complaint and earliest filing / India | Complaint against a covered regulated entity | `cf.s14`, `cf.s15` | RBI FAQ Q16-Q17; Standard Chartered Time limits lines 369-373 | — | high | `cf.t19` |
| `cf.c56` | Verified | RB-IOS 2026 requires filing with the RBI Ombudsman within 90 days after the applicable timeline expires or the last regulated-entity communication, whichever is later. | RB-IOS filing deadline / India | Maintainable complaint against covered regulated entity | `cf.s14`, `cf.s15` | RBI FAQ Q16-Q17; Standard Chartered Time limits lines 369-373 | — | high | `cf.t19` |
| `cf.c57` | Verified | Filing and resolving a complaint under RB-IOS 2026 is free of charge. | RB-IOS fee / India | RB-IOS 2026 complaint | `cf.s14` | RBI FAQ Q21 | — | medium | `cf.t19` |
| `cf.c58` | Verified | RB-IOS 2026 complaints can be filed through CMS, by email to crpc@rbi.org.in, or by signed physical complaint to CRPC in Chandigarh. | RB-IOS filing channels / India | RB-IOS 2026 complaint | `cf.s14`, `cf.s15` | RBI FAQ Q9; Standard Chartered Procedure for Filing | — | high | `cf.t19` |
| `cf.c59` | Verified | RBI CMS provides a complaint number and status tracking; 14448 provides procedure/status assistance but is not itself a complaint-filing channel. | RBI CMS tracking and assistance / India | RB-IOS 2026 | `cf.s14`, `cf.s26` | RBI FAQ Q10-Q11 and Q19; CMS banner | — | high | `cf.t19` |
| `cf.c60` | Verified | Under RB-IOS 2026 a complainant appeal is available only against an Award and must normally be filed within 30 days of receiving it; a further period up to 30 days may be allowed for sufficient cause. | RB-IOS appeal / India | Award under RB-IOS 2026 | `cf.s14` | RBI FAQ Q31-Q32 | — | high | `cf.t19` |
| `cf.c61` | Verified | RB-IOS 2026 covers specified categories including banks, certain NBFCs, non-bank PPI issuers and credit information companies; entity coverage must be checked before filing. | RB-IOS covered entities / India | Potential RBI Ombudsman respondent | `cf.s14`, `cf.s15` | RBI FAQ Q13-Q14; Standard Chartered Key Definitions | — | high | `cf.t19` |
| `cf.c62` | Verified | NCRP publishes a State/UT Nodal Officer and Grievance Officer list for a complainant whose response is not appropriate. | NCRP State/UT grievance escalation / India with State/UT contacts | Report and Track complainant seeking escalation of an inappropriate response | `cf.s05` | Page note above the State/UT Nodal Officer and Grievance Officer table | — | high | `cf.t17` |
| `cf.c63` | Verified | MHA reported that 1930 call centres operate across States and Union Territories. | 1930 operating model / India with State/UT call centres | 1930 national cybercrime helpline operations described on 17 June 2026 | `cf.s27` | PIB 17 June 2026, paragraph on 1930 Call Centres operating across States and Union Territories | — | high | `cf.t03` |
| `cf.c64` | Verified | On 17 June 2026 the Union Home Minister directed establishment of a National-Level 1930 Call Centre to handle calls unanswered at State level. | Directed national 1930 fallback / India | Direction reported on 17 June 2026; it is not evidence that the national fallback call centre was already operational | `cf.s27` | PIB 17 June 2026, paragraph beginning 'With the objective of further strengthening' | — | high | `cf.t03` |
| `cf.c65` | Unavailable | A current public nationwide standardized caller acknowledgement artifact for a 1930 financial-fraud call was not verified in the national sources reviewed. | 1930 caller acknowledgement artifact / India | Citizen calling 1930 for cyber-financial fraud | `cf.s01`, `cf.s02`, `cf.s03`, `cf.s04`, `cf.s27` | Current NCRP landing/FAQ/checklist and MHA June/July 2026 releases reviewed; no universal caller acknowledgement artifact stated | `cf.conflict01` | high | — |
| `cf.c66` | Verified | MHA describes CFCFRMS as helping to promptly block fraudulent financial transactions through the banking network, thereby increasing the possibility of securing and restoring funds to victims. | CFCFRMS recovery possibility / India | CFCFRMS coordination; this is an increased possibility, not a guarantee of hold, restoration or timing | `cf.s27` | PIB 17 June 2026, CFCFRMS paragraph beginning 'The meeting also reviewed' | — | high | `cf.t03`, `cf.t09`, `cf.t20` |
| `cf.c68` | Verified | The CEIR FAQ states that SMS on a re-issued SIM is enabled after 24 hours of SIM activation. | CEIR OTP prerequisite timing / India | Lost/stolen handset CEIR request after duplicate SIM; CEIR attributes the rule to TRAI and it is not a TSP SIM-reissue SLA | `cf.s16` | FAQ 'How to block a lost/stolen phone?', step 2 note | — | medium | `cf.t14` |
| `cf.c69` | Verified | In the ordinary UPI payment-request flow described by NPCI, payment requires the user to click Pay and authorise it with the UPI PIN. | UPI technical authorisation action / India | Ordinary UPI payment/collect-request flow; this technical fact does not itself settle legal authorisation, fault, liability or deception-based recovery | `cf.s11`, `cf.s29` | UPI FAQ definitions/payment-request flow; NPCI 13 January 2025 clarification, transaction-authorisation paragraph | — | medium | `cf.t05`, `cf.t09` |
| `cf.c70` | Verified | A regulated entity covered by the RBI Internal Ombudsman Directions must auto-escalate all partly or wholly rejected complaints to the Internal Ombudsman within 20 days of receipt. | Internal Ombudsman auto-escalation / India | Regulated entities meeting clause 4 coverage thresholds | `cf.s28` | Clause 13(1) | — | medium | `cf.t18` |
| `cf.c71` | Verified | The Internal Ombudsman and covered regulated entity must communicate the final decision within 30 days from the regulated entity's receipt of the complaint. | Internal Ombudsman final-decision timeline / India | Complaint covered by the RBI Internal Ombudsman Directions | `cf.s28` | Clause 13(2) | — | medium | `cf.t18` |
| `cf.c72` | Verified | The Internal Ombudsman does not handle complaints directly from customers or the public and its contact details must not be made public. | No direct customer Internal Ombudsman route / India | Complaint within the Internal Ombudsman framework | `cf.s28` | Clauses 11(1) and 13(15) | — | medium | `cf.t18` |
| `cf.c73` | Verified | When the Internal Ombudsman upholds a regulated entity's rejection or partial rejection, the reply must state that the Internal Ombudsman examined the complaint and give the reasons for upholding the decision. | Internal Ombudsman rejection communication / India | Complaint rejection upheld after Internal Ombudsman review | `cf.s28` | Clause 13(7) | — | medium | `cf.t18` |
| `cf.c74` | Verified | A complaint still fully or partly rejected after Internal Ombudsman examination must advise the complainant of the RBI Ombudsman route and give the CRPC physical address and RBI CMS portal address, subject to Scheme coverage. | Post-Internal-Ombudsman escalation notice / India | Covered regulated-entity complaint remaining fully or partly rejected; current RB-IOS 2026 maintainability must be assessed separately | `cf.s28` | Clause 13(9), including the continuing sentence that specifies CRPC and CMS addresses | — | high | `cf.t18` |
| `cf.c75` | Verified | Under RB-IOS 2026, the same grievance pending before or settled or decided on merits by a court, tribunal, arbitrator or other judicial or quasi-judicial forum is non-maintainable. | RB-IOS duplicate-forum bar / India | RBI Ombudsman complaint under RB-IOS 2026 | `cf.s14` | FAQ Q16, same-grievance court/tribunal/arbitrator exclusion | — | high | `cf.t19` |
| `cf.c76` | Verified | RB-IOS 2026 does not treat a criminal proceeding before a court or tribunal, or a police investigation initiated in a criminal offence, as the same grievance for the duplicate-forum exclusion. | Police and criminal-proceeding maintainability distinction / India | RB-IOS 2026 duplicate-forum assessment; other maintainability requirements still apply | `cf.s14` | FAQ Q16, note following same-grievance forum exclusion | — | high | `cf.t19` |
| `cf.c77` | Verified | RB-IOS 2026 is for complaints alleging deficiency in service, and a complaint that identifies no deficiency and is only a suggestion, query or similar request may be rejected. | RB-IOS deficiency-in-service gate / India | Potential RBI Ombudsman complaint | `cf.s14` | FAQ Q15, Q24, Q26 and Q27 | — | high | `cf.t19` |
| `cf.c78` | Verified | For a user who installed the cited malicious Android APK, CERT-In recommends disconnecting mobile data and Wi-Fi, uninstalling the suspicious application, running a trusted mobile-antivirus scan, changing passwords and UPI PIN, and checking bank statements. | Malicious Android APK containment / India | CERT-In's RTO/eChallan-themed Android malware campaign or a materially matching installed malicious APK fact pattern | `cf.s30` | Recommendations, 'If you already installed the malicious APK' bullets | — | medium | `cf.t21` |
| `cf.c79` | Verified | CERT-In recommends immediately reporting unusual account activity to the respective bank and says cybercrime or financial fraud may be reported through NCRP or 1930. | Malware-linked financial reporting / India | Suspicious activity associated with the cited Android-malware campaign | `cf.s30` | Recommendations, final bank-reporting and NCRP/1930 bullets | — | medium | `cf.t21` |
| `cf.c80` | Verified | DoT's eServices portal says the TAFCOP service lets users check mobile connections issued in their name to help prevent fraud and support consumer protection. | TAFCOP mobile-connection review / India | Citizen reviewing mobile connections issued in their name | `cf.s31` | Citizen Services, 'Know Mobile Connections in Your Name' | — | medium | `cf.t13` |

## Sources

| ID | Issuer and title | Tier | Dates | Official URL | Exact locator | Access | Supersession note | Freshness |
|---|---|---|---|---|---|---|---|---|
| `cf.s01` | Ministry of Home Affairs / I4C — National Cyber Crime Reporting Portal landing/acceptance page | T1_PORTAL | pub —; notified —; effective —; updated 2024-02-02 | [https://www.cybercrime.gov.in/Accept.aspx](https://www.cybercrime.gov.in/Accept.aspx) | Financial fraud 1930 24x7 banner and report-and-track entry | accessible; verified 2026-08-28 | Current live portal page; some lower landing copy is legacy/inconsistent with current FAQ. | medium |
| `cf.s02` | Ministry of Home Affairs / I4C — National Cyber Crime Reporting Portal FAQ | T1_PORTAL | pub —; notified —; effective —; updated 2024-02-02 | [https://cybercrime.gov.in/Webform/FAQ.aspx](https://cybercrime.gov.in/Webform/FAQ.aspx) | Purpose, reportable crimes, registration, evidence, routing, confirmation, status and hash FAQs | accessible; verified 2026-08-28 | Current public FAQ despite displayed 2024 update date. | medium |
| `cf.s03` | Ministry of Home Affairs / I4C — NCRP citizen login checklist | T1_PORTAL | pub —; notified —; effective —; updated 2024-02-02 | [https://cybercrime.gov.in/Webform/Crime_AuthoLogin.aspx](https://cybercrime.gov.in/Webform/Crime_AuthoLogin.aspx) | Check list for Complainant | accessible; verified 2026-08-28 | Dynamic portal fields may change; verify live form. | medium |
| `cf.s04` | Ministry of Home Affairs via Press Information Bureau — CFCFRMS 2.0 Platform | T1_AUTHORITY | pub 2026-07-28; notified —; effective —; updated — | [https://www.pib.gov.in/PressReleasePage.aspx?PRID=2290377&lang=1&reg=3](https://www.pib.gov.in/PressReleasePage.aspx?PRID=2290377&lang=1&reg=3) | SOP, MRM/GRM, State/UT LEA handling and 1930 paragraphs | accessible; verified 2026-08-28 | Most current MHA status source found. | high |
| `cf.s05` | Ministry of Home Affairs / I4C — NCRP State/UT Nodal Officer and Grievance Officer list | T1_PORTAL | pub —; notified —; effective —; updated 2024-02-02 | [https://www.cybercrime.gov.in/webform/Crime_NodalGrivanceList.aspx](https://www.cybercrime.gov.in/webform/Crime_NodalGrivanceList.aspx) | Note for Report and Track complainants and State/UT table | accessible; verified 2026-08-28 | Named officers are volatile; verify the live page before use. | high |
| `cf.s06` | Reserve Bank of India — Customer Protection - Limiting Liability of Customers in Unauthorised Electronic Banking Transactions | T1_LAW | pub 2017-07-06; notified 2017-07-06; effective —; updated — | [https://www.rbi.org.in/Scripts/NotificationUser.aspx?Id=11040&Mode=0](https://www.rbi.org.in/Scripts/NotificationUser.aspx?Id=11040&Mode=0) | DBR.No.Leg.BC.78/09.07.005/2017-18, paragraphs 5-12 and Tables 1-2 | accessible; verified 2026-08-28 | Commercial-bank circular; institution scope must be checked. Live URL returned HTTP 200 on 2026-08-28. | medium |
| `cf.s07` | Reserve Bank of India — Customer Protection - Limiting Liability of Customers of Co-operative Banks in Unauthorised Electronic Banking Transactions | T1_LAW | pub 2017-12-14; notified 2017-12-14; effective —; updated — | [https://www.rbi.org.in/commonman/English/scripts/Notification.aspx?Id=2623](https://www.rbi.org.in/commonman/English/scripts/Notification.aspx?Id=2623) | Paragraphs 5-12 | accessible; verified 2026-08-28 | Applies to listed co-operative banks; confirm institution coverage. | medium |
| `cf.s08` | Reserve Bank of India — Master Direction on Issuance and Operation of Prepaid Payment Instruments | T1_LAW | pub —; notified —; effective —; updated — | [https://rbi.org.in/Scripts/BS_ViewMasDirections.aspx?id=11142](https://rbi.org.in/Scripts/BS_ViewMasDirections.aspx?id=11142) | Paragraphs 16.2-16.4.10 | accessible; verified 2026-08-28 | Current master-direction page reviewed; bank and non-bank PPI rules differ. | medium |
| `cf.s09` | Reserve Bank of India — Harmonisation of Turn Around Time and customer compensation for failed transactions using authorised Payment Systems | T1_LAW | pub 2019-09-20; notified 2019-09-20; effective 2019-10-15; updated — | [https://m.rbi.org.in/commonman/English/Scripts/Notification.aspx?Id=3074](https://m.rbi.org.in/commonman/English/Scripts/Notification.aspx?Id=3074) | Circular paragraphs 4-7 and Annex rows 1-8 | accessible; verified 2026-08-28 | The temporary 2021 working-day relaxation ended 30 September 2021; original calendar-day T applies. | medium |
| `cf.s10` | Reserve Bank of India — Master Direction - Credit Card and Debit Card - Issuance and Conduct Directions, 2022 | T1_LAW | pub 2022-04-21; notified 2022-04-21; effective 2022-07-01; updated 2024-03-07 | [https://systemhealth.rbi.org.in/Scripts/BS_ViewMasDirections.aspx_id%3D12300.html](https://systemhealth.rbi.org.in/Scripts/BS_ViewMasDirections.aspx_id%3D12300.html) | Paragraph 23(e)-(g) | accessible; verified 2026-08-28 | Current page states updated through 7 March 2024. | medium |
| `cf.s11` | National Payments Corporation of India — UPI Frequently Asked Questions | T1_REGULATED_ACTOR | pub —; notified —; effective —; updated — | [https://www.npci.org.in/what-we-do/upi/faqs](https://www.npci.org.in/what-we-do/upi/faqs) | Customer FAQs on stop payment, complaint route, failed and pending transactions | accessible; verified 2026-08-28 | Pending-transaction 48-hour statement appears inconsistent with RBI T+1 for the matching failure; bank must classify status. | high |
| `cf.s12` | National Payments Corporation of India — Register a Complaint | T1_REGULATED_ACTOR | pub —; notified —; effective —; updated — | [https://www.npci.org.in/register-a-complaint](https://www.npci.org.in/register-a-complaint) | Fraud note, complaint form and disclaimer | accessible; verified 2026-08-28 | Form is dynamic and product-specific; member remains responsible. | high |
| `cf.s13` | National Payments Corporation of India — UPI OC 40/2017-18 - Complaints Handling Process | T1_REGULATED_ACTOR | pub 2017-11-23; notified —; effective —; updated — | [https://www.npci.org.in/PDF/npci/upi/circular/2017/UPI%20OC%2040.pdf](https://www.npci.org.in/PDF/npci/upi/circular/2017/UPI%20OC%2040.pdf) | Complaint acceptance paragraph and T+1 app status paragraph | accessible; verified 2026-08-28 | Older operational circular still available; used only for complaint acceptance duty, not universal final resolution TAT. | medium |
| `cf.s14` | Reserve Bank of India — FAQ - Reserve Bank Integrated Ombudsman Scheme, 2026 | T1_AUTHORITY | pub 2026-07-01; notified —; effective 2026-07-01; updated 2026-07-01 | [https://old.rbi.org.in/commonman/english/scripts/faqs.aspx?id=3407](https://old.rbi.org.in/commonman/english/scripts/faqs.aspx?id=3407) | Questions 1, 9-27 and 31-35 | partially_accessible; verified 2026-08-28 | Search index exposed the current official FAQ, but direct opening triggered RBI anti-bot challenge; corroborated by current RBI CMS and Standard Chartered's first-party scheme publication. | high |
| `cf.s15` | Standard Chartered Bank India — The Reserve Bank - Integrated Ombudsman Scheme, 2026 | T1_REGULATED_ACTOR | pub —; notified —; effective 2026-07-01; updated — | [https://www.sc.bank.in/important-information/client-experience/banking-ombudsman/](https://www.sc.bank.in/important-information/client-experience/banking-ombudsman/) | Procedure for Filing, Time limits, exclusions and rejection sections | accessible; verified 2026-08-28 | Accessible first-party regulated-bank publication reproducing current Scheme features and links to RBI CMS/Scheme. | high |
| `cf.s16` | Department of Telecommunications / C-DOT — CEIR home and FAQ | T1_PORTAL | pub —; notified —; effective —; updated 2026-08-27 | [https://ceir.sancharsaathi.gov.in/Home/index.jsp](https://ceir.sancharsaathi.gov.in/Home/index.jsp) | How/when to block, what happens after block, status and complaint FAQs | accessible; verified 2026-08-28 | Current CEIR portal; rotating CSRF query omitted from canonical URL. | medium |
| `cf.s17` | Department of Telecommunications / C-DOT — CEIR Request for blocking lost/stolen mobile | T1_PORTAL | pub —; notified —; effective —; updated — | [https://ceir.sancharsaathi.gov.in/Request/CeirUserBlockRequestDirect.jsp](https://ceir.sancharsaathi.gov.in/Request/CeirUserBlockRequestDirect.jsp) | Mandatory device, loss, owner, police, identity and OTP fields | accessible; verified 2026-08-28 | Dynamic validation and state launch checks apply. | high |
| `cf.s18` | Department of Telecommunications — Sanchar Saathi initiative and Financial Fraud Risk Indicator | T1_AUTHORITY | pub —; notified —; effective —; updated — | [https://www.dot.gov.in/static/uploads/2026/02/1994430b3740f7f61b7d7fd8b7f5120d.pdf](https://www.dot.gov.in/static/uploads/2026/02/1994430b3740f7f61b7d7fd8b7f5120d.pdf) | About Sanchar Saathi Initiative - Key Features | accessible; verified 2026-08-28 | Current 2026 DoT release found; exact publication day not visible in extracted material. | medium |
| `cf.s19` | State Bank of India — Contact Centre - Customer Care | T1_REGULATED_ACTOR | pub —; notified —; effective —; updated — | [https://sbi.bank.in/web/customer-care/contact-centre](https://sbi.bank.in/web/customer-care/contact-centre) | Sections 0.1-0.3 and dedicated toll-free numbers | accessible; verified 2026-08-28 | Exact demo channel; high freshness risk for phone/IVR changes. | high |
| `cf.s20` | State Bank of India — Customer Rights, Grievance Redressal and Compensation Policy 2024, Version 5 | T1_REGULATED_ACTOR | pub 2024; notified —; effective —; updated 2025-03-05 | [https://sbi.bank.in/documents/53471/263971/Customer%2BRights%2BGrievance%2BRedressal%2Band%2BCompensation%2BPolicy%2B2024%28Version%2B5%29.pdf/0200f401-cbc8-68d2-d1a7-a74d305d5332?t=1745317199634](https://sbi.bank.in/documents/53471/263971/Customer%2BRights%2BGrievance%2BRedressal%2Band%2BCompensation%2BPolicy%2B2024%28Version%2B5%29.pdf/0200f401-cbc8-68d2-d1a7-a74d305d5332?t=1745317199634) | Pages 17-20 and 29-31 | accessible; verified 2026-08-28 | Current policy link found; used only for SBI-specific route/policy. | high |
| `cf.s21` | State Bank of India — Tackling Unauthorised Transactions Together | T1_REGULATED_ACTOR | pub —; notified —; effective —; updated — | [https://sbi.bank.in/web/yono/blog/tackling-unauthorised-transactions-together](https://sbi.bank.in/web/yono/blog/tackling-unauthorised-transactions-together) | Things To Do In Case of Frauds | accessible; verified 2026-08-28 | Used for SBI route only; its broad treatment of fraudulent UPI requests does not establish regulatory liability. | high |
| `cf.s22` | Reserve Bank of India — RTGS System Frequently Asked Questions | T1_AUTHORITY | pub —; notified —; effective —; updated 2022-10-31 | [https://www.rbi.org.in/scripts/FS_FAQs.aspx?Id=65](https://www.rbi.org.in/scripts/FS_FAQs.aspx?Id=65) | Questions 2, 16-23 | accessible; verified 2026-08-28 | Its Ombudsman references still name the superseded 2021 Scheme; only RTGS finality/status/bank complaint claims are used. | medium |
| `cf.s23` | Ministry of Home Affairs / NCRP — Citizen Financial Cyber Frauds Reporting and Management System - For Delhi Only | T1_PORTAL | pub —; notified —; effective —; updated — | [https://cybercrime.gov.in/uploadmedia/instructions_citizenreportingcyberfrauds.pdf](https://cybercrime.gov.in/uploadmedia/instructions_citizenreportingcyberfrauds.pdf) | Item iv - 24-hour completion instruction | accessible; verified 2026-08-28 | Stale/limited for national timing; title expressly limits it to Delhi and current national pages do not restate the deadline. | high |
| `cf.s25` | Ministry of Home Affairs / I4C — CFCFRMS Grievance Redressal Portal | T1_PORTAL | pub —; notified —; effective —; updated — | [https://ncrp-grievanceredressal.mha.gov.in/](https://ncrp-grievanceredressal.mha.gov.in/) | Credentialed I4C, alternate and Bank/FI login page | login_required; verified 2026-08-28 | No public citizen login or workflow verified. | high |
| `cf.s26` | Reserve Bank of India — RBI Complaint Management System landing page | T1_PORTAL | pub —; notified —; effective 2026-07-01; updated — | [https://cms.rbi.org.in/](https://cms.rbi.org.in/) | Welcome to RB-IOS 2026; filing/tracking/appeal assistance; 14448 banner | accessible; verified 2026-08-28 | Current portal explicitly names RB-IOS 2026. | high |
| `cf.s27` | Ministry of Home Affairs via Press Information Bureau — Union Home Minister reviews National Cyber Crime Helpline 1930 and CFCFRMS | T1_AUTHORITY | pub 2026-06-17; notified —; effective —; updated — | [https://www.pib.gov.in/PressReleasePage.aspx?PRID=2274249&lang=2&reg=48](https://www.pib.gov.in/PressReleasePage.aspx?PRID=2274249&lang=2&reg=48) | Paragraphs on State/UT 1930 centres, directed national fallback, CFCFRMS recovery possibility, January 2026 SOP and MRM/GRM review | accessible; verified 2026-08-28 | Current MHA status source; directions to establish or strengthen a service are not treated as proof of completed implementation. | high |
| `cf.s28` | Reserve Bank of India — Master Direction - Reserve Bank of India (Internal Ombudsman for Regulated Entities) Directions, 2023 | T1_LAW | pub 2023-12-29; notified 2023-12-29; effective 2023-12-29; updated — | [https://www.rbi.org.in/Scripts/BS_ViewMasDirections.aspx?id=12586](https://www.rbi.org.in/Scripts/BS_ViewMasDirections.aspx?id=12586) | Clauses 4, 11 and 13 | accessible; verified 2026-08-28 | Current Master Direction page reviewed; its clause 13 text names the older RB-IOS 2021, so this pack applies the separate current RB-IOS 2026 maintainability rules for external filing. | medium |
| `cf.s29` | National Payments Corporation of India — Clarification on the Jumped Deposit Scam | T1_REGULATED_ACTOR | pub 2025-01-13; notified —; effective —; updated — | [https://www.npci.org.in/PDF/npci/press-releases/2025/NPCI-Press-Release-Clarification-on-the-Jumped-Deposit-Scam-dated-13-January-2025.pdf](https://www.npci.org.in/PDF/npci/press-releases/2025/NPCI-Press-Release-Clarification-on-the-Jumped-Deposit-Scam-dated-13-January-2025.pdf) | Paragraph describing explicit Pay action and UPI-PIN authorisation | partially_accessible; verified 2026-08-28 | The official search index exposed the precise paragraph while direct opening triggered NPCI's JavaScript challenge; used only to establish the ordinary technical authorisation action, not legal liability or recovery. | medium |
| `cf.s30` | Indian Computer Emergency Response Team (CERT-In) — Sophisticated RTO/eChallan themed Android Malware Campaign targeting Sensitive Information | T1_AUTHORITY | pub 2026-03-17; notified —; effective —; updated 2026-08-28 | [https://www.cert-in.org.in/s2cMainServlet?CACODE=CICA-2026-3492&pageid=PUBADV01](https://www.cert-in.org.in/s2cMainServlet?CACODE=CICA-2026-3492&pageid=PUBADV01) | Recommendations, installed-malicious-APK and reporting bullets | accessible; verified 2026-08-28 | Threat-specific technical guidance; not generalized to every compromised device and not evidence of forensic cleanliness. | medium |
| `cf.s31` | Department of Telecommunications — Department of Telecom eServices Portal - All Services | T1_AUTHORITY | pub —; notified —; effective —; updated — | [https://www.eservices.dot.gov.in/service-list](https://www.eservices.dot.gov.in/service-list) | Citizen Services, 'Know Mobile Connections in Your Name' (TAFCOP) | accessible; verified 2026-08-28 | Confirms service purpose; the linked TAFCOP transactional route remained access-blocked to the research client. | medium |

## Conflicts

### `cf.conflict01` — open

**Claims:** `cf.c10`, `cf.c11`, `cf.c65`; **sources:** `cf.s01`, `cf.s02`, `cf.s03`, `cf.s04`, `cf.s23`, `cf.s27`

A Delhi-only legacy manual states a mandatory 24-hour completion rule after a helpline acknowledgement; current nationwide public pages reviewed do not restate that deadline or define a universal caller acknowledgement artifact.

**Safe treatment:** Complete NCRP filing promptly, preferably in the same urgent session; ask the operator for any reference actually issued and record the call, but do not present 24 hours or a standardized acknowledgement as verified nationwide rules.

**Resolution owner/action:** I4C/MHA should publish a current nationwide citizen manual defining the helpline acknowledgement and helpline-to-portal deadline, if any.

### `cf.conflict02` — open

**Claims:** `cf.c33`, `cf.c39`; **sources:** `cf.s09`, `cf.s11`

NPCI's general public FAQ says a pending debit may reach the beneficiary within 48 hours, while RBI's binding TAT says T+1 for the matching debit/non-credit failure.

**Safe treatment:** Require the bank/PSP to classify the final status and apply the RBI row only when its facts match; do not rely on the 48-hour statement as a universal reversal rule.

**Resolution owner/action:** NPCI/RBI should align public pending-status wording with the binding TAT and define when a pending status becomes a failed transaction.

### `cf.conflict03` — open

**Claims:** `cf.c07`; **sources:** `cf.s01`, `cf.s02`

Lower copy on the NCRP acceptance page still describes a narrower women/child-content scope while the current FAQ/menu states that all cybercrimes including financial fraud are reportable.

**Safe treatment:** Use the live Financial Fraud/Other Cybercrime menu and 1930; if the form does not expose the expected route, preserve the failure and use 1930/state contact.

**Resolution owner/action:** I4C should remove the legacy narrow-scope copy from the landing page.

### `cf.conflict04` — open

**Claims:** `cf.c36`; **sources:** `cf.s06`, `cf.s08`, `cf.s21`

SBI awareness content lists approving a fraudulent UPI request under unauthorised transactions, but the RBI liability sources do not expressly resolve every victim-authorised scam fact pattern.

**Safe treatment:** Report the fraud accurately, request a reasoned actor decision, and withhold any zero-liability conclusion until authorisation/fault is determined under the applicable framework.

**Resolution owner/action:** The regulated actor/RBI must determine the specific transaction; clearer regulator guidance on authorised-push-payment scams would resolve the class-wide gap.

## Coverage gaps (7)

### `cf.gap01` — Nationwide 1930 acknowledgement and helpline-to-NCRP handoff timing (Conflict)

**Affected tasks:** `cf.t03`, `cf.t06`

**Missing evidence:** Current MHA/I4C nationwide citizen instruction defining the acknowledgement/reference artifact, if any, and whether and when a 1930-originated report must be completed online.

**Safe treatment:** Ask the operator for any reference actually issued, record call time, and file promptly/same session where possible; call log alone is not NCRP proof and the Delhi-only 24-hour rule is not nationalized.

**Resolution path:** Obtain a current I4C citizen manual or national SOP extract intended for the public.

### `cf.gap02` — Citizen access to CFCFRMS Money Restoration and Grievance Redressal Modules (Unavailable)

**Affected tasks:** `cf.t17`, `cf.t20`

**Missing evidence:** Public citizen eligibility, inputs, status route and timing for MRM/GRM; MHA confirms the modules and State-level monitoring, but the public grievance portal exposes only institutional logins.

**Safe treatment:** Track through NCRP, assigned State/UT police and bank; do not attempt staff/bank login or promise restoration.

**Resolution path:** MHA/I4C public manual or case-specific written instruction from assigned police/bank.

### `cf.gap03` — Successful victim-authorised scam liability and recovery (Candidate)

**Affected tasks:** `cf.t05`, `cf.t09`, `cf.t11`, `cf.t12`, `cf.t20`

**Missing evidence:** NPCI confirms the ordinary explicit Pay-plus-UPI-PIN technical action, but no binding regulator rule found establishes class-wide legal authorisation, liability, universal recall/hold duties, deadlines or recovery probability for successful deception-induced transfers.

**Safe treatment:** Report the approval/deception facts accurately and seek actor recovery action, but withhold zero-liability, reversal and recovery claims.

**Resolution path:** Reasoned regulated-actor determination and any future RBI/NPCI binding guidance.

### `cf.gap04` — Provider/card-network-specific dispute codes and higher guideline timelines (Candidate)

**Affected tasks:** `cf.t07`, `cf.t09`, `cf.t11`, `cf.t18`, `cf.t19`

**Missing evidence:** The RBI Internal Ombudsman rejection route is verified for covered entities, but the actual issuer/PSP/card-network published dispute category, evidence rules and higher guideline timeline still depend on the identified transaction channel.

**Safe treatment:** Resolve the actual actor/network and use its current first-party policy; calculate RB-IOS timing with the higher applicable period and use the covered entity's automatic Internal Ombudsman review rather than contacting that officer directly.

**Resolution path:** Fetch current issuer/PSP/network rules after channel identification.

### `cf.gap05` — Telecom-provider SIM compromise route (Candidate)

**Affected tasks:** `cf.t13`, `cf.t15`

**Missing evidence:** TAFCOP connection review and the CEIR re-issued-SIM SMS boundary are verified, but the actual TSP's block/reissue channel, identity requirements, proof and SLA are not national uniform facts.

**Safe treatment:** Use only the identified TSP's official app/site/store; retain reference; do not publish a universal number or reissue timeline.

**Resolution path:** Verify the user's actual TSP first-party support/grievance page live.

### `cf.gap06` — State/UT police, FIR, jurisdiction and held-fund release/restoration procedure (Unavailable)

**Affected tasks:** `cf.t16`, `cf.t17`, `cf.t20`

**Missing evidence:** MHA confirms the January 2026 SOP, State/UT handling and State-level MRM/GRM monitoring, but the State/UT and case-specific complaint-to-FIR, court, lien-release/restoration steps and timing are not published as one national citizen procedure.

**Safe treatment:** Use NCRP routing and current State/UT nodal contact; distinguish complaint, FIR, hold, potential restoration and actual statement credit.

**Resolution path:** Written direction from competent State/UT LEA and qualified local legal advice where needed.

### `cf.gap07` — Private account/device compromise remediation and forensic preservation (Candidate)

**Affected tasks:** `cf.t15`, `cf.t21`

**Missing evidence:** CERT-In provides a verified containment sequence for the cited malicious Android APK pattern, but the actual provider/device recovery path, forensic-cleanliness determination and case-specific police preservation instruction remain unresolved.

**Safe treatment:** Use cf.t21 only for the matching malicious-APK facts; otherwise use official provider recovery from a trusted device, preserve evidence when safe, and avoid a destructive reset if police examination may be required.

**Resolution path:** Provider-specific primary guidance plus case-specific investigating-officer or qualified incident-response advice.

## Closure standard

Keep a reconciled case ledger by transaction. Mark each amount as unresolved, held/liened, provisionally credited, finally restored/reversed, rejected or closed with reason. Completion requires statement evidence plus the actor written disposition, or documented closure with remaining remedies/dependencies. A complaint reference, hold, police record or RBI communication alone is not proof that money returned.
