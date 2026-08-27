import { dataResponse } from "@/lib/api";
import { getPublicOutcomes } from "@/server/navigator";

export function GET(request: Request): Response {
  const domain = new URL(request.url).searchParams.get("domain")?.trim();
  const outcomes = getPublicOutcomes(domain || undefined);
  const domains = [
    ...new Set(getPublicOutcomes().flatMap((outcome) => outcome.domains)),
  ].sort();
  return dataResponse({ outcomes, domains });
}
