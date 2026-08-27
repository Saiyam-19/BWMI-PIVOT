import type { KnowledgePackV1 } from "../src/index.js";

const centralJurisdiction = {
  countryCode: "IN",
  level: "central",
} as const;

export function createAdmittedPack(
  overrides: Partial<KnowledgePackV1> = {},
): KnowledgePackV1 {
  const sources: KnowledgePackV1["sources"] = [
    {
      id: "test.source.portal",
      title: "Official test service guide",
      issuer: "Test Central Authority",
      url: "https://example.gov.in/test-service",
      official: true,
      tier: "service-owner",
      jurisdiction: centralJurisdiction,
      retrievedOn: "2026-08-20",
    },
  ];
  const claims: KnowledgePackV1["claims"] = [
    {
      id: "test.claim.start",
      kind: "portal-instruction",
      statement: "The official test journey starts on the service page.",
      status: "verified",
      sourceIds: ["test.source.portal"],
      jurisdiction: centralJurisdiction,
      verifiedOn: "2026-08-20",
      reviewDueOn: "2026-12-31",
    },
    {
      id: "test.claim.step",
      kind: "portal-instruction",
      statement: "The test journey accepts an online submission.",
      status: "verified",
      sourceIds: ["test.source.portal"],
      jurisdiction: centralJurisdiction,
      verifiedOn: "2026-08-20",
      reviewDueOn: "2026-12-31",
    },
    {
      id: "test.claim.proof",
      kind: "completion-proof",
      statement: "The service issues a submission reference number.",
      status: "verified",
      sourceIds: ["test.source.portal"],
      jurisdiction: centralJurisdiction,
      verifiedOn: "2026-08-20",
      reviewDueOn: "2026-12-31",
    },
  ];
  const journeys: KnowledgePackV1["journeys"] = [
    {
      id: "test.journey.submit",
      channel: "portal",
      portalName: "Official test service",
      officialUrl: "https://example.gov.in/test-service",
      startClaimIds: ["test.claim.start"],
      instructions: [
        {
          id: "test.step.submit",
          instruction: "Submit the approved test request.",
          claimIds: ["test.claim.step"],
        },
      ],
      completionProof: {
        description: "Submission reference number",
        claimIds: ["test.claim.proof"],
      },
    },
  ];
  const questions: KnowledgePackV1["questions"] = [
    {
      id: "test.question.owns-item",
      factKey: "ownsItem",
      prompt: "Do you own the test item?",
      reason: "Ownership changes this roadmap.",
    },
  ];
  const tasks: KnowledgePackV1["tasks"] = [
    {
      id: "test.task.prepare",
      title: "Prepare the test request",
      action: "Prepare and submit the test request.",
      reason: "The selected outcome requires a request.",
      authority: { name: "Test Central Authority", type: "central" },
      classification: "required",
      appliesWhen: { field: "ownsItem", operator: "equals", value: true },
      requiredAnswers: ["ownsItem"],
      requiredInformation: ["Approved test identifier"],
      requiredDocuments: [],
      requiredClaimIds: [
        "test.claim.start",
        "test.claim.step",
        "test.claim.proof",
      ],
      journeyId: "test.journey.submit",
    },
    {
      id: "test.task.finish",
      title: "Finish the test outcome",
      action: "Submit the final test request.",
      reason: "The outcome finishes after preparation.",
      authority: { name: "Test Central Authority", type: "central" },
      classification: "required",
      dependencies: ["test.task.prepare"],
      appliesWhen: { field: "ownsItem", operator: "equals", value: true },
      requiredAnswers: ["ownsItem"],
      requiredInformation: ["Approved test identifier"],
      requiredDocuments: [],
      requiredClaimIds: [
        "test.claim.start",
        "test.claim.step",
        "test.claim.proof",
      ],
      journeyId: "test.journey.submit",
    },
  ];
  const outcomes: KnowledgePackV1["outcomes"] = [
    {
      id: "test-outcome",
      version: "1.0.0",
      title: "Complete a test outcome",
      description: "A bounded admitted outcome used at the public test seam.",
      domains: ["business-employment-compliance"],
      intentPhrases: ["complete a test outcome", "test request"],
      questionIds: ["test.question.owns-item"],
      taskIds: ["test.task.prepare", "test.task.finish"],
    },
  ];

  return {
    schemaVersion: "1.0.0",
    id: "test-pack",
    version: "1.0.0",
    lifecycle: "admitted",
    sources,
    claims,
    journeys,
    questions,
    tasks,
    outcomes,
    ...overrides,
  };
}
