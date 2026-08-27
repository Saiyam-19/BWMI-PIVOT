import type { KnowledgePackV1 } from "../domain.js";
import { importRegulatedProductPack } from "./import-regulated-product.js";
import { researchKnowledgePacks } from "./research/index.js";

export const builtInKnowledgePacks: readonly KnowledgePackV1[] = [
  importRegulatedProductPack,
  ...researchKnowledgePacks,
];
