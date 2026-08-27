import type { KnowledgePackV1 } from "../domain.js";
import { researchKnowledgePacks } from "./research/index.js";

export const builtInKnowledgePacks: readonly KnowledgePackV1[] = [
  ...researchKnowledgePacks,
];
