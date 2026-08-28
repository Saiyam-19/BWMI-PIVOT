import type { Metadata } from "next";
import type { ReactNode } from "react";

import { TooltipProvider } from "@/components/ui/tooltip";

import "./globals.css";

const directionContract = `
THESIS: Start from the citizen or business outcome, then make every truthful dependency and the next safe government action visible without invented certainty.
OWN-WORLD: Preserve the purpose-built Indian government-service shell: navy utility, white and pale-slate documents, service-blue focus and links, and restrained shadcn controls. Inside generated roadmaps only, use the pinned roadmap.sh interaction grammar with a tall centered canvas, compact black-outlined state nodes, blue connectors, and a substantial right-side journey sheet.
STORY: Discover an outcome, answer only graph-changing questions, scan the whole consequence graph, open a task for exact verified portal or offline steps, confirm its completion proof, and continue along newly ready dependencies.
FIRST VIEWPORT: The existing navy government-service header leads into a concise roadmap title and truthful progress summary; canvas and linear tabs immediately reveal the vertical dependency spine while fail-closed nodes remain conspicuous.
FORM: Operate mode. The site shell remains government-specific; the generated roadmap workspace alone adopts the Software Architect reference's document-canvas density, branches, navigation, node selection, state hierarchy, and right-side detail interaction without its branding or content. Seed key: brief-pinned-reference (no concept roll; the user's explicit reference pin is the selection authority).
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, and DESIGN.md
`.trim();

export const metadata: Metadata = {
  title: "Government Outcome Navigator",
  description: "Dependency-aware guidance across verified Indian government journeys.",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <script
          dangerouslySetInnerHTML={{
            __html: `document.body.insertBefore(document.createComment(${JSON.stringify(directionContract)}), document.body.firstChild);`,
          }}
        />
        <TooltipProvider>{children}</TooltipProvider>
      </body>
    </html>
  );
}
