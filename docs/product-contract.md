# Government Outcome Navigator — Product Contract

Status: locked for the first functional build on 2026-08-28.

## Product promise

The product converts a citizen's or small business owner's desired outcome into a personalised, dependency-aware roadmap across Indian government portals and other institutions that are necessary to complete the outcome.

It is a **roadmap of roadmaps**:

```text
user outcome
→ consequential tasks created by that outcome
→ exact portal or offline journey for each task
→ expected proof of completion
```

It provides guidance, not legal clearance. It must not claim that a user is compliant, eligible, approved, or finished unless the underlying evidence and the user's completion proof support that claim.

## Entry and navigation

Both entry methods use the same intent and roadmap engine:

1. Natural-language outcome, such as “I want to import wireless headphones and sell them in India.”
2. Browsing through a citizen domain, topic and desired action.

The browse hierarchy is:

```text
domain → topic or object → desired outcome → qualifying questions → roadmap
```

Ministries and departments are authority labels and optional filters, not required starting knowledge.

### Citizen domains

1. Identity, certificates and documents
2. Money, tax, PF and benefits
3. Business, employment and compliance
4. Vehicles, driving and transport
5. Home, property and local services
6. Family, health and education
7. Safety, legal help and complaints
8. Agriculture and rural services

A canonical intent may appear under several domains without duplicating its underlying content.

## Central-oriented V1 boundary

- Central authorities, national regulators and nationwide portals receive fully verified instructions.
- Banks, insurers, employers, testing laboratories, customs brokers, carriers and other necessary actors remain in the roadmap with an explicit authority type.
- Genuine state or local dependencies remain visible. Their detailed journey is withheld and labelled `State-specific instructions not supported in V1`.
- The engine may never silently omit a known state dependency or present one state's process as nationally applicable.

## Launch outcomes

The first content portfolio is:

1. Import and legally sell the first regulated product shipment.
2. Export the first commercial order and complete payment realisation.
3. Incorporate a company, hire the first employee and complete initial compliance.
4. Become eligible for Central Government procurement and submit the first valid bid.
5. Discover and claim a deceased person's central and regulated financial assets.

Cyber-fraud recovery is an urgent supporting roadmap. Voluntary company closure is the first expansion.

Aadhaar, PAN, passport, IEC, GST registration, EPF and similar procedures are reusable task journeys. They remain directly searchable but are not the headline proposition.

## First verified knowledge packs

The first functional build proves the content model with two bounded packs:

### Regulated import

Scenario: a GST-registered, Udyam-small Indian proprietorship plans to import new, retail-packaged, Bluetooth-only wireless headphones with integrated rechargeable batteries from China by sea for resale in India.

The graph may include business readiness, IEC, ICEGATE and banking readiness, product classification, import-policy checks, conditional BIS/WPC/Legal Metrology/EPR tasks, shipment documents, customs clearance and post-import obligations.

Classification, duty, exemption and clearance claims fail closed when the facts or current official evidence are insufficient.

### Post-death regulated assets

Scenario: the user already has a death certificate and needs to discover and claim a deceased parent's regulated financial assets.

The graph may include asset discovery, Income Tax legal-heir registration, EPF/EPS/EDLI claims, NPS, bank deposits, insurance, securities and IEPF. State-issued succession or heirship documents remain visible dependencies when applicable, without invented state instructions.

## Roadmap behaviour

1. Generate a comprehensive candidate worklist from the selected outcome.
2. Ask only unanswered questions that can change applicability, ordering or readiness.
3. Add, remove, reclassify or reorder tasks when an answer changes.
4. Represent dependencies as a graph rather than a forced linear checklist.
5. Show the personalised applicable path by default while retaining reasons for excluded tasks.
6. Permit the AI to discover candidate tasks, but only approved registry content may become actionable.
7. Require the user to confirm the expected completion proof before marking a task completed.

### Task classifications

- Required
- Conditional
- Recommended
- Optional
- Urgent
- Needs information
- Not applicable
- Outside scope

### Progress statuses

- Needs information
- Not started
- Ready
- Blocked
- In progress
- Awaiting authority
- Completed
- Not applicable

## Actionable task contract

Every actionable task must provide:

- plain-language action and reason it applies;
- responsible actor and authority type;
- prerequisites and dependency tasks;
- required information and documents;
- exact portal, starting page or office and official link;
- ordered portal or offline instructions;
- authoritative fee, deadline, processing time or validity only when verified;
- expected reference number, acknowledgement or final proof;
- tracking, correction, rejection, help and escalation routes when available;
- claim-level sources and last-verification metadata;
- the next available action.

## Evidence and AI safety

Claims are atomic: legal obligation, eligibility, document, fee, deadline, processing time, portal instruction and completion proof are stored independently.

Claim states are:

- Candidate
- Under review
- Verified
- Unavailable
- Conflict
- Stale
- Superseded

Only `Verified` claims that match the user's jurisdiction and facts may produce actionable instructions. Unknown or conflicting facts must produce `Needs information`, `Blocked`, `Outside scope`, or an explicit official-clarification task.

The evidence hierarchy is:

1. Acts, rules, regulations, Gazette publications and India Code.
2. Competent-authority notifications, orders, circulars, guidelines and forms.
3. Current service-owner manuals, FAQs, portal flows and citizen charters.
4. Official aggregators and government APIs for discovery or corroboration.
5. Written official clarification, grievance tickets or RTI-supplied existing records.
6. Archived or third-party material for historical discovery only.

When law and the live portal differ, the product shows separate `Official requirement` and `Portal currently requests` claims instead of choosing silently.

The AI may interpret intent, ask questions, explain content and select verified graph nodes. It may not invent portals, fees, deadlines, eligibility, classification, duties, approvals or completion.

## Privacy and persistence

- No permanent storage of uploaded identity or evidentiary documents in the hackathon version.
- Roadmap progress may be stored locally or in an expiring encrypted session.
- Shared links and exports must omit personal identifiers, uploaded proofs and free-text answers by default.
- One roadmap represents one user goal; facts cannot leak between roadmaps.

## Explicit V1 non-goals

- No application submission, browser automation, auto-fill or credential handling.
- No nationwide state/local procedural coverage.
- No generic promise to support every imported product.
- No legal opinion, approval guarantee, duty quote or landed-cost estimate without admitted evidence.
- No visual-design optimisation in this build phase.

## Functional acceptance seams

1. Natural-language and browse selection resolve into the same outcome definition.
2. Qualifying answers materially change the applicable dependency graph.
3. An unverified claim can never produce an actionable instruction.
4. Missing classification-changing information fails closed.
5. Every actionable task exposes its official evidence and expected completion proof.
6. A task cannot become completed until the user confirms the expected proof.
7. Known state/local dependencies remain visible but do not expose fabricated instructions.
