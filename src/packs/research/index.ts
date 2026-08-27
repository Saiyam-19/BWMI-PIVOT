import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";

import type { KnowledgePackV1 } from "../../domain.js";
import {
  ResearchPackValidationError,
  normalizeResearchPack,
  type ResearchIntegrationReport,
  type ResearchPackProfile,
} from "./normalize.js";

interface PublishedPack {
  readonly fileName: string;
  readonly profile: ResearchPackProfile;
}

interface AdmissionManifestPack {
  readonly files: Readonly<{ json: string }>;
  readonly sha256: Readonly<{ json: string }>;
  readonly schema_valid: boolean;
}

interface AdmissionManifest {
  readonly manifest_version: string;
  readonly publication_state: string;
  readonly portfolio_status: string;
  readonly independent_review: Readonly<{ status: string }>;
  readonly packs: readonly AdmissionManifestPack[];
}

const MANIFEST_SHA256 = "d82912cc127b13fb92033d38e64ff47d8f10a2087682175184ff6b64e0cb45ef";

const publishedPacks: readonly PublishedPack[] = [
  {
    fileName: "04-central-procurement-first-bid.json",
    profile: {
      packId: "research.central-procurement-first-bid",
      outcomeId: "central-procurement-first-bid",
      domains: ["business-employment-compliance"],
      intentPhrases: [
        "central government procurement",
        "submit my first government bid",
        "first valid bid",
        "become eligible for government procurement",
      ],
      sourceArtifact: "outputs/packs/04-central-procurement-first-bid.json",
      sourceSha256: "efa6d5ff30b1d66f61f7849a081d6c0355d8c9f3eae41dcceadcb52753a318a3",
    },
  },
  {
    fileName: "05-deceased-assets.json",
    profile: {
      packId: "research.deceased-assets",
      outcomeId: "post-death-regulated-assets",
      domains: ["money-tax-pf-benefits", "family-health-education"],
      intentPhrases: [
        "claim deceased assets",
        "find parent's financial assets",
        "death claim",
        "legal heir assets",
      ],
      sourceArtifact: "outputs/packs/05-deceased-assets.json",
      sourceSha256: "0b1bf717db125308a2a1bd7ed3a0d76d29a9b8129ddda4fa06a12b85ec15940e",
    },
  },
  {
    fileName: "07-reusable-foundations.json",
    profile: {
      packId: "research.reusable-foundations",
      outcomeId: "reusable-central-foundations",
      domains: ["identity-certificates-documents", "business-employment-compliance"],
      intentPhrases: [
        "reusable government registrations",
        "pan gst iec registrations",
        "central identity and registration foundations",
        "set up government portal identities",
      ],
      sourceArtifact: "outputs/packs/07-reusable-foundations.json",
      sourceSha256: "a3560953519f866f4c3b86bab9d9f9c8de0a632b23486ab0e98e8941c2ff10d3",
    },
  },
];

function readPublishedArtifact(
  fileName: string,
  expectedSha256: string | undefined,
): unknown {
  const contents = readFileSync(
    new URL(`./published/${fileName}`, import.meta.url),
    "utf8",
  );
  const actualSha256 = createHash("sha256").update(contents).digest("hex");
  if (expectedSha256 && actualSha256 !== expectedSha256) {
    throw new ResearchPackValidationError([{
      path: `published.${fileName}`,
      message: `${fileName} hash ${actualSha256} does not match the approved artifact ${expectedSha256}.`,
    }]);
  }
  return JSON.parse(contents) as unknown;
}

const manifestInput = readPublishedArtifact(
  "admission-manifest.json",
  MANIFEST_SHA256,
);

function parseManifest(input: unknown): AdmissionManifest {
  if (
    typeof input !== "object" || input === null ||
    !("manifest_version" in input) || input.manifest_version !== "1.0.0" ||
    !("publication_state" in input) || typeof input.publication_state !== "string" ||
    !("portfolio_status" in input) || input.portfolio_status !== "STRUCTURALLY_VALID" ||
    !("independent_review" in input) ||
    typeof input.independent_review !== "object" || input.independent_review === null ||
    !("status" in input.independent_review) || typeof input.independent_review.status !== "string" ||
    !("packs" in input) || !Array.isArray(input.packs)
  ) {
    throw new ResearchPackValidationError([{
      path: "published.admission-manifest.json",
      message: "The pinned admission manifest is structurally invalid or does not declare a structurally valid portfolio.",
    }]);
  }
  return input as unknown as AdmissionManifest;
}

export const researchAdmissionManifest = parseManifest(manifestInput);

function assertManifestAdmission(fileName: string, expectedSha256: string | undefined): void {
  const relativePath = `packs/${fileName}`;
  const entry = researchAdmissionManifest.packs.find(
    (candidate) => candidate.files?.json === relativePath,
  );
  if (!entry || !entry.schema_valid || !expectedSha256 || entry.sha256?.json !== expectedSha256) {
    throw new ResearchPackValidationError([{
      path: `published.admission-manifest.json:${relativePath}`,
      message: `${relativePath} is not schema-valid and hash-matched in the pinned admission manifest.`,
    }]);
  }
}

const normalized = publishedPacks.map(({ fileName, profile }) => {
  assertManifestAdmission(fileName, profile.sourceSha256);
  return normalizeResearchPack(
    readPublishedArtifact(fileName, profile.sourceSha256),
    profile,
  );
});

export const researchKnowledgePacks: readonly KnowledgePackV1[] = normalized.map(
  (result) => result.pack,
);

export const researchIntegrationReports: readonly ResearchIntegrationReport[] =
  normalized.map((result) => result.report);

export {
  ResearchPackValidationError,
  normalizeResearchPack,
} from "./normalize.js";
export type {
  ResearchClaimProvenance,
  ResearchImportIssue,
  ResearchIntegrationReport,
  ResearchPackImportResult,
  ResearchPackProfile,
  ResearchPackValidationIssue,
  ResearchSourceProvenance,
} from "./normalize.js";
