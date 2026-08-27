# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Delegated: extend the existing TypeScript project with the current stable Next.js App Router and React, Tailwind CSS, shadcn/ui source components, React Flow, and Dagre. Keep the verified outcome engine server-only. Use pnpm and preserve Vitest for domain and application tests.

## Users

The primary user is an Indian citizen, founder, small-business owner, exporter, importer, bidder, or family member who knows the outcome they need but not which authorities, portals, dependencies, and proofs are involved.

They may begin in plain language or by browsing a familiar life/business domain. They should not need to know the responsible ministry before starting.

## Product Purpose

Government Outcome Navigator converts a real-world goal into a personalised, dependency-aware roadmap across Indian government portals and necessary regulated or operational institutions. It is a roadmap of roadmaps: the outcome expands into consequential tasks, and every task expands into the exact verified journey, official starting point, requirements, and expected completion proof.

Success means a user can identify a supported outcome, answer only questions that materially affect it, understand what to do next, open the correct official service, and safely track progress without the product inventing certainty.

## Positioning

Unlike a ministry directory, generic checklist, or chatbot answer, the product maps one outcome across authorities as a living dependency graph. It combines admitted claim-level government research with user facts, recalculates applicability and readiness, and withholds instructions when evidence or necessary information is missing.

## Operating Context

- Entry by natural-language outcome or by citizen/business domain.
- Qualifying questions appear only when their answers can change applicability, order, or readiness.
- The roadmap is the main working surface; users pan or zoom, open a task, follow its portal/offline journey, confirm the expected proof, and continue to the next ready task.
- Official portals open in a new browser context. The product guides but does not submit applications, handle credentials, or automate a government website.
- One roadmap represents one user goal. Progress may persist on the local hackathon server, and shared output must redact user answers and proof confirmations.

## Capabilities and Constraints

- Ship all seven admitted central-oriented outcome packs already present in the registry, including regulated import, first export, company setup and first hire, government procurement, post-death financial-asset claims, cyber-fraud recovery, and company closure.
- Keep Aadhaar, PAN, GST, IEC, EPF, passport, and similar procedures available when they are tasks within a supported outcome; they are not the product's headline categories.
- Preserve the existing fail-closed engine. Only verified, jurisdiction-matching claims may produce actionable instructions.
- Show known state/local dependencies, but label their detailed journey unsupported where the registry cannot verify it.
- Natural-language interpretation is deterministic in this release. The AI seam remains provider-compatible, but no live model is required for the app to work.
- Store roadmap JSON locally for the hackathon demo with private file permissions. Do not add Convex, accounts, document uploads, credentials, application submission, browser automation, or an admin CMS in this cut.
- Completion requires explicit confirmation of the expected proof.
- Use shadcn/ui components for standard buttons, fields, dialogs, sheets, badges, tabs, scrolling, progress, alerts, and skeleton states. Do not hand-build substitute primitives.

## Brand Commitments

The user explicitly pinned the generated roadmap/journey workspace to the Software Architect roadmap on roadmap.sh. Match that workspace's information architecture and working grammar at high fidelity: a centered document-like canvas, compact outlined nodes, a strong vertical dependency spine with branches, clear state colors, pan/zoom, and a substantial task-detail sheet. This reference does not govern the landing page, site header, discovery, intake, or other surrounding product surfaces; those must be purpose-built for the government navigator. Do not copy roadmap.sh branding, copy, ads, account prompts, or community features.

The product voice is plain, direct, calm, and specific. Explain uncertainty rather than hiding it. Avoid legalistic performance and celebratory gamification.

## Evidence on Hand

- The locked product contract is in `docs/product-contract.md`.
- The domain vocabulary is in `docs/domain-language.md`.
- The admitted research integration record is in `docs/research-integration-2026-08-28.md`.
- Seven final research packs live under `src/packs/research/published/final-v3-deepened/` and are loaded by `src/packs/research/index.ts`.
- The tested roadmap engine, application boundary, intent provider, registry, privacy checks, file repository, and share-redaction helper live in `src/`.
- No testimonials, user counts, approval rates, processing guarantees, or commercial claims are available; future work must not fabricate them.

## Product Principles

1. Start from the user's outcome, not the government's organisation chart.
2. Show the whole consequence graph, then make the next safe action unmistakable.
3. Verified evidence earns instructions; uncertainty earns a visible stop or question.
4. Every task must lead to a place, a sequence, and an expected proof.
5. Personalisation may remove noise, but it may not hide known dependencies or leak facts between roadmaps.

## Accessibility & Inclusion

The web app must support keyboard navigation, visible focus, screen-reader labels and state announcements, 44px touch targets, reduced motion, sufficient contrast, and responsive use on common Indian mobile devices. Official links and important instructions must remain usable without drag gestures; the roadmap also needs a linear accessible representation.
