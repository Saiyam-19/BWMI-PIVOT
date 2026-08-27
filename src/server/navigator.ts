import "server-only";

import { randomUUID } from "node:crypto";
import { join } from "node:path";

import {
  createNavigatorApplication,
  type NavigatorApplication,
} from "../application.js";
import type { OutcomeDefinition } from "../domain.js";
import { deterministicIntentProvider } from "../intent.js";
import { FileRoadmapRepository } from "../persistence.js";
import { builtInRegistry } from "../registry.js";

export interface PublicOutcomeSummary {
  readonly id: string;
  readonly version: string;
  readonly title: string;
  readonly description: string;
  readonly domains: readonly string[];
}

let cachedApplication: NavigatorApplication | undefined;

function toPublicOutcomeSummary(
  outcome: OutcomeDefinition,
): PublicOutcomeSummary {
  return {
    id: outcome.id,
    version: outcome.version,
    title: outcome.title,
    description: outcome.description,
    domains: outcome.domains,
  };
}

export function getNavigatorApplication(): NavigatorApplication {
  cachedApplication ??= createNavigatorApplication({
    registry: builtInRegistry,
    intentProvider: deterministicIntentProvider,
    repository: new FileRoadmapRepository(
      join(process.cwd(), ".data", "roadmaps"),
    ),
    idFactory: randomUUID,
  });
  return cachedApplication;
}

export function getPublicOutcomes(
  domain?: string,
): readonly PublicOutcomeSummary[] {
  return builtInRegistry.listOutcomes(domain).map(toPublicOutcomeSummary);
}
