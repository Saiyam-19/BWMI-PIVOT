import { OutcomeExplorer } from "@/components/outcome-explorer";
import { SiteHeader } from "@/components/site-header";

export default function HomePage() {
  return (
    <div className="min-h-svh bg-[#f4f6f8]">
      <SiteHeader />
      <OutcomeExplorer />
    </div>
  );
}
