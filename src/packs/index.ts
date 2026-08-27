import type { KnowledgePackV1 } from "../domain.js";
import { importRegulatedProductPack } from "./import-regulated-product.js";
import { postDeathRegulatedAssetsPack } from "./post-death-regulated-assets.js";

export const builtInKnowledgePacks: readonly KnowledgePackV1[] = [
  importRegulatedProductPack,
  postDeathRegulatedAssetsPack,
];
