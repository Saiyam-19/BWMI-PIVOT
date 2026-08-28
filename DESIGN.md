---
name: "Government Outcome Navigator"
description: "A calm, evidence-led Indian government service workspace that makes dependencies and safe next actions legible."
colors:
  government-navy: "#101a2e"
  ink: "#172033"
  ink-hover: "#26344f"
  service-blue: "#2454a6"
  service-link: "#1d4f91"
  dependency-blue: "#2f6fd2"
  government-gold: "#f5c84b"
  page-slate: "#eef1f5"
  canvas-paper: "#f8f9fb"
  white: "#ffffff"
  border-slate: "#cbd5e1"
  muted-text: "#475569"
  state-ready: "#fff36a"
  state-future: "#eceeef"
  state-completed: "#d9f2dd"
  state-action-required: "#fde8e7"
  state-awaiting: "#e6f0ff"
typography:
  display:
    fontFamily: "ui-sans-serif, system-ui, sans-serif"
    fontSize: "2.25rem"
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.875rem"
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "-0.03em"
  title:
    fontFamily: "ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 600
    lineHeight: 1.5
    letterSpacing: "-0.01em"
  body:
    fontFamily: "ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
  label:
    fontFamily: "ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: 1.25
    letterSpacing: "0.07em"
rounded:
  none: "0px"
  sm: "0.375rem"
  md: "0.5rem"
  lg: "0.625rem"
  xl: "0.875rem"
  full: "9999px"
spacing:
  2xs: "0.25rem"
  xs: "0.5rem"
  sm: "0.75rem"
  md: "1rem"
  lg: "1.5rem"
  xl: "1.75rem"
  2xl: "2rem"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.white}"
    rounded: "{rounded.md}"
    padding: "0.75rem 1rem"
    height: "2.75rem"
  button-primary-hover:
    backgroundColor: "{colors.ink-hover}"
    textColor: "{colors.white}"
    rounded: "{rounded.md}"
    padding: "0.75rem 1rem"
    height: "2.75rem"
  button-outline:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "0.5rem 1rem"
    height: "2.75rem"
  input:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "0.25rem 0.75rem"
    height: "2.25rem"
  badge-outline:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.full}"
    padding: "0.125rem 0.5rem"
  card:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.xl}"
    padding: "1.5rem"
  roadmap-task-ready:
    backgroundColor: "{colors.state-ready}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "0.5rem 0.75rem"
---

# Design System: Government Outcome Navigator

## Overview

**Creative North Star: "The Verified Civic Ledger"**

The system should feel like a trustworthy public-service document brought to life: calm, exact, and easy to audit. A dark navy civic frame establishes authority; white and pale-slate working surfaces keep dense guidance readable; service blue marks focus, links, and dependency. Ornament stays subordinate to evidence and action.

Generated roadmap and journey workspaces have one deliberate exception to the shell's restrained shadcn grammar. They borrow the pinned roadmap.sh Software Architect reference's document-canvas density, compact square nodes, branching blue paths, clear state hierarchy, navigation, and substantial right-side detail interaction. That grammar is scoped to generated roadmaps only; it must not become the visual language of discovery, intake, the site header, or unrelated government-service surfaces, and it never carries roadmap.sh branding or content.

**Key Characteristics:**

- Purpose-built Indian government-service shell with a navy utility header and a small gold civic marker.
- White and pale-slate document surfaces, quiet borders, and restrained controls.
- Service-blue focus, links, icons, and dependency connectors.
- Dense but readable operational hierarchy with explicit uncertainty and proof.
- Square graph geometry only inside generated roadmap and journey workspaces.

## Colors

The palette combines civic navy and service blue with paper-like neutrals; state fills are intentionally pale so labels, borders, and icons carry equal semantic weight.

### Primary

- **Government Navy** (`colors.government-navy`): The durable site-header field and strongest institutional anchor.
- **Service Blue** (`colors.service-blue`): Visible focus, section icons, and high-confidence interactive emphasis.
- **Service Link Blue** (`colors.service-link`): Official links and navigational text where underlines or hover treatment reinforce affordance.

### Secondary

- **Government Gold** (`colors.government-gold`): A small civic identifier in the global header; keep it rare.
- **Dependency Blue** (`colors.dependency-blue`): Generated-roadmap connectors and their accessible linear equivalent, not a general decorative accent.

### Tertiary

- **Ready Yellow** (`colors.state-ready`): Ready and in-progress roadmap tasks.
- **Future Grey** (`colors.state-future`): Not-started and not-applicable roadmap tasks.
- **Completed Green** (`colors.state-completed`): Confirmed completion state.
- **Action-Required Rose** (`colors.state-action-required`): Missing information, blockers, and fail-closed tasks.
- **Awaiting Blue** (`colors.state-awaiting`): Waiting on an authority after the user's action.

### Neutral

- **Document Ink** (`colors.ink`): Primary copy, titles, strong buttons, and exact-step markers.
- **Document Ink Hover** (`colors.ink-hover`): The controlled hover state for dark actions.
- **Page Slate** (`colors.page-slate`): Application background behind white documents.
- **Canvas Paper** (`colors.canvas-paper`): The generated-roadmap working canvas.
- **White Document** (`colors.white`): Cards, headers, sheets, and formal content surfaces.
- **Border Slate** (`colors.border-slate`): Dividers and structural borders.
- **Muted Text** (`colors.muted-text`): Supporting descriptions and metadata.

### Named Rules

**The Evidence Before Color Rule.** Never communicate task state by fill alone; pair it with a label and, where useful, an icon or lock.

**The Gold Is a Seal Rule.** Government gold identifies the service in the shell; it is not a general call-to-action color.

## Typography

**Display Font:** ui-sans-serif (with system-ui, sans-serif)

**Body Font:** ui-sans-serif (with system-ui, sans-serif)

**Character:** A single native sans stack keeps the product immediate and familiar across common Indian devices. Weight, line-height, and restrained negative tracking create hierarchy without introducing editorial flourish or legalistic formality.

### Hierarchy

- **Display** (700, `typography.display.fontSize`, 1.25): Outcome titles; on narrow screens the shipped implementation steps down to 1.35rem before returning to the desktop role.
- **Headline** (600, `typography.headline.fontSize`, 1.25): Task-sheet titles and major operational headings.
- **Title** (600, `typography.title.fontSize`, 1.5): Section headings, node titles, and high-priority labels.
- **Body** (400, `typography.body.fontSize`, 1.5): Instructions, rationale, requirements, and evidence; descriptive paragraphs generally stop near 65–70 characters.
- **Label** (500, `typography.label.fontSize`, `typography.label.letterSpacing`, uppercase): Compact roadmap state, legend, and channel metadata only.

### Named Rules

**The Plain-Language Hierarchy Rule.** Earn emphasis through position, weight, and spacing; avoid ornate type, all-caps paragraphs, or oversized institutional display text.

## Layout

The durable shell uses centered, responsive page containers with 1rem mobile gutters, 1.5rem small-screen gutters, and 2rem large-screen gutters. White documents sit on page slate, and content moves from stacked mobile flow to measured columns only when the secondary column has a clear operational role. Body copy stays narrow enough to scan even when the enclosing workspace is wide.

Generated roadmap pages may expand to a 96rem working width and use a tall viewport-relative canvas with a minimum usable height. Their dependency graph centers a dominant vertical spine, gives lateral branches generous separation, and preserves the full graph rather than cropping consequences. On small screens the canvas remains navigable, the legend can scroll, the task sheet becomes full-width, and the linear view provides the complete non-drag alternative.

**The Shell and Workspace Rule.** Global surfaces remain calm government documents; only generated roadmap and journey workspaces use the dense node-and-connector composition.

**The Reachable Action Rule.** Important links, tabs, controls, and confirmations use a minimum 44px target on touch layouts.

## Elevation & Depth

The system is flat and document-led by default. Borders and tonal changes establish structure; restrained cool shadows lift only major documents, floating canvas tools, hovered roadmap nodes, and modal sheets. There are no decorative glows, glass layers, or stacked-card theatrics.

### Shadow Vocabulary

- **Document Lift** (`0 10px 28px rgba(15, 23, 42, 0.06)`): A quiet separation for the roadmap summary document.
- **Floating Tool Lift** (`0 8px 24px rgba(15, 23, 42, 0.08)`): Canvas legend and controls over the working plane.
- **Node Hover Lift** (`0 5px 12px rgba(15, 23, 42, 0.16)`): Short-lived confirmation that a roadmap task is interactive.

### Named Rules

**The Flat Until Useful Rule.** Add depth only when it clarifies document level, overlay ownership, or interactive state.

## Shapes

Standard shadcn controls use gently curved corners from the extracted radius scale, with pill rounding reserved for compact status badges. Formal document panels may be square or only subtly rounded. Generated roadmap nodes, legend swatches, step boxes, and graph frames are intentionally square with firm black outlines; this geometry is a workspace-specific interaction cue, not a global component reset.

**The Square Graph Rule.** Inside generated roadmaps, preserve zero-radius nodes and black structural borders so the dependency map reads as a diagram rather than a card gallery.

## Components

### Buttons

- **Shape:** Gently curved, restrained controls (`rounded.md`), with a 44px touch height for important actions.
- **Primary:** Document ink on white text (`components.button-primary`); use for the exact safe next action, official-service launch, or proof-confirmed transition.
- **Hover / Focus:** Dark actions shift only to Document Ink Hover; keyboard focus uses a visible service-blue ring rather than a decorative animation.
- **Secondary / Outline:** White with a slate border and document ink (`components.button-outline`); use for reversible progress transitions and canvas controls.

### Chips

- **Style:** Compact outlined pills (`components.badge-outline`) for status, classification, and evidence currency.
- **State:** Use semantic border, fill, text, and icon together. A badge may summarize state but never replace the explanatory alert or task copy.

### Cards / Containers

- **Corner Style:** Standard cards use gently rounded corners (`rounded.xl`); formal roadmap documents and canvas tools may be square.
- **Background:** White on page slate for document contrast.
- **Shadow Strategy:** Flat at rest unless the panel floats above a canvas or owns the current task.
- **Border:** Cool slate borders separate evidence, controls, and document regions.
- **Internal Padding:** 1rem on compact mobile documents, increasing to 1.5–1.75rem where viewport space permits.

### Inputs / Fields

- **Style:** Transparent or white field, quiet slate border, system body text, and gently curved corners (`components.input`).
- **Focus:** Border shift plus a 3px service-blue-derived ring; never remove the focus indicator.
- **Error / Disabled:** Destructive border and ring for invalid input; disabled controls retain their shape and become visibly muted and non-interactive.

### Navigation

- **Style:** The global header is a compact Government Navy utility bar with a Government Gold civic mark, white product name, and muted assurance copy. Links are calm and underlined on hover; line-style tabs use a dark two-pixel active indicator.
- **Mobile:** Keep the product identity and hide only secondary assurance copy when horizontal room is constrained.

### Generated Roadmap Node

Compact, black-outlined, zero-radius task nodes use pale state fills, a two-line task title, uppercase state label, and icon. Hover lifts the node by two pixels; focus and selection use a broad service-blue ring. This signature component belongs only to generated roadmap and journey workspaces.

### Journey Detail Sheet

The right-side sheet is a substantial evidence document: full-width on mobile, up to 42rem on large screens, with a fixed header, scrollable evidence body, and action footer. It leads with actionability, keeps withheld instructions visibly fail-closed, groups exact steps by authority and requirement, and places proof confirmation before completion controls.

## Do's and Don'ts

### Do:

- **Do** keep the global shell recognizably Indian public-service in tone: navy utility, white documents, pale slate page, service-blue interaction, and a rare gold civic marker.
- **Do** scope the pinned roadmap.sh-derived grammar to generated roadmap and journey workspaces.
- **Do** preserve visible focus, 44px touch targets, reduced-motion behavior, and a complete linear roadmap alternative.
- **Do** keep uncertainty, withheld instructions, official evidence, and expected proof visually adjacent to the action they govern.
- **Do** preserve the whole dependency graph and make the next safe action visually obvious without implying unsupported certainty.

### Don't:

- **Don't** transplant roadmap.sh branding, copy, account patterns, ads, or square graph styling into discovery, intake, the global header, or unrelated screens.
- **Don't** turn the interface into a generic SaaS dashboard, card mosaic, or celebratory progress experience.
- **Don't** use gradients, glass effects, decorative glows, or excessive rounding to manufacture authority.
- **Don't** encode state with color alone or hide important instructions behind hover, drag, or canvas-only interaction.
- **Don't** present completion as available until the expected proof can be identified and confirmed.
