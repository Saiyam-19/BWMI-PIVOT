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
  readonly independent_review: Readonly<{
    status: string;
    overall_verdict: string | null;
  }>;
  readonly totals: Readonly<{
    packs: number;
    tasks: number;
    dependency_edges: number;
    claims: number;
    sources: number;
    coverage_gaps: number;
  }>;
  readonly packs: readonly AdmissionManifestPack[];
}

const RELEASE_DIRECTORY = "final-v3-deepened";
const MANIFEST_SHA256 = "2b017d9be6e618c91f13a35484c2aafb5408541928a31a4aa203d7bd9e8ba2cd";

const publishedPacks: readonly PublishedPack[] = [
  {
    fileName: "01-import-regulated-product.json",
    profile: {
      packId: "research.import-regulated-product",
      outcomeId: "import-regulated-product",
      domains: ["business-employment-compliance"],
      intentPhrases: [
        "import and legally sell a regulated product",
        "first regulated product shipment",
        "import bluetooth headphones from china and sell them in india",
        "import bluetooth headphones to india",
        "clear customs and sell imported goods",
      ],
      sourceArtifact: "outputs/packs/01-import-regulated-product.json",
      sourceSha256: "975ea1cc5a2031f474bb3bb3502a33ee05dbb2c044bc60860b0a26474c61c4b4",
    },
  },
  {
    fileName: "02-export-first-order.json",
    profile: {
      packId: "research.export-first-commercial-order",
      outcomeId: "export-first-commercial-order",
      domains: ["business-employment-compliance", "money-tax-pf-benefits"],
      intentPhrases: [
        "export my first commercial order",
        "ship goods abroad and receive payment",
        "complete export payment realisation",
        "first goods export from india",
      ],
      sourceArtifact: "outputs/packs/02-export-first-order.json",
      sourceSha256: "03a251410b27e2065a721aac39cc08ca1bf48dc344bceb7416502370c2fb2cff",
    },
  },
  {
    fileName: "03-incorporate-and-hire.json",
    profile: {
      packId: "research.incorporate-company-first-hire",
      outcomeId: "incorporate-company-first-hire",
      domains: ["business-employment-compliance"],
      intentPhrases: [
        "incorporate a company and hire my first employee",
        "register a private limited company",
        "start a company and complete first employee compliance",
        "company incorporation epfo esic first hire",
      ],
      sourceArtifact: "outputs/packs/03-incorporate-and-hire.json",
      sourceSha256: "b5d6f859a38e3f599a08a31924c13dc4e82b66002fade399db0e70d4cbc2870f",
    },
  },
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
      sourceSha256: "40cc8c8bc8c1f8d41ea1c915157b399303f0d6ab8c1f6954f1510746ea822760",
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
      sourceSha256: "25ae2f6b3ab9de21138d59f68d969478dba8d2dd3ce4dfff4be56fc496db645b",
    },
  },
  {
    fileName: "06-cyber-financial-fraud.json",
    profile: {
      packId: "research.urgent-cyber-financial-fraud",
      outcomeId: "urgent-cyber-financial-fraud",
      domains: ["safety-legal-help-complaints", "money-tax-pf-benefits"],
      intentPhrases: [
        "report cyber financial fraud urgently",
        "money stolen through online scam",
        "upi fraud recovery",
        "call 1930 and report cyber fraud",
      ],
      sourceArtifact: "outputs/packs/06-cyber-financial-fraud.json",
      sourceSha256: "f51f0528345e1c95c27e9fceba8a1d46e45c069375d3a0efb2280bd94f80efaa",
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
      sourceSha256: "087187ff1363eb2aa476377f703636b5c9b6f79d039c540da5219166850f369d",
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
  `${RELEASE_DIRECTORY}/admission-manifest.json`,
  MANIFEST_SHA256,
);

function parseManifest(input: unknown): AdmissionManifest {
  if (
    typeof input !== "object" || input === null ||
    !("manifest_version" in input) || input.manifest_version !== "1.0.0" ||
    !("publication_state" in input) || input.publication_state !== "final" ||
    !("portfolio_status" in input) || input.portfolio_status !== "STRUCTURALLY_VALID" ||
    !("independent_review" in input) ||
    typeof input.independent_review !== "object" || input.independent_review === null ||
    !("status" in input.independent_review) || input.independent_review.status !== "complete" ||
    !("overall_verdict" in input.independent_review) ||
    !["PASS", "CONDITIONAL_PASS"].includes(String(input.independent_review.overall_verdict)) ||
    !("totals" in input) || typeof input.totals !== "object" || input.totals === null ||
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

if (researchAdmissionManifest.packs.length !== publishedPacks.length) {
  throw new ResearchPackValidationError([{
    path: "published.admission-manifest.json:packs",
    message: "Every pack in the pinned final release must have an explicit runtime profile.",
  }]);
}

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
    readPublishedArtifact(
      `${RELEASE_DIRECTORY}/packs/${fileName}`,
      profile.sourceSha256,
    ),
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
