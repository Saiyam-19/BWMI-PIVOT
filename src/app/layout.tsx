import type { Metadata } from "next";
import type { ReactNode } from "react";

import { TooltipProvider } from "@/components/ui/tooltip";

import "./globals.css";

const directionContract = `
THESIS: Outcome discovery starts from the result a person needs; this surface refuses the ministry directory and generic chatbot prompt.
OWN-WORLD: Clear Indian government-service baseline: white and pale-slate surfaces, navy utility and primary controls, service blue for focus and links, and restrained shadcn fields with explicit states.
STORY: State the outcome, see supported paths, answer only graph-changing questions, and enter a private evidence-linked roadmap without hidden certainty.
FIRST VIEWPORT: Navy utility header above a generous service page; the mechanism headline and natural-language field dominate, with the primary action beside the field and supported outcomes immediately below.
FORM: Purpose-built government-service discovery and intake; seed key government-outcome-discovery. The roadmap.sh reference is reserved for the generated roadmap workspace canvas, dependency layout, nodes, connectors, navigation, and node-detail interaction.
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
