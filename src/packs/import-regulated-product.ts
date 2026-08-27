import {
  REGISTRY_SCHEMA_VERSION,
  type KnowledgePackV1,
  type Rule,
  type TaskDefinition,
} from "../domain.js";
import { importQuestions } from "./import/questions.js";

const central = (name: string) => ({ name, type: "central" as const });
const regulator = (name: string) => ({
  name,
  type: "national-regulator" as const,
});

const task = (
  definition: Pick<
    TaskDefinition,
    "id" | "title" | "action" | "reason" | "authority" | "classification"
  > &
    Partial<
      Pick<
        TaskDefinition,
        | "dependencies"
        | "appliesWhen"
        | "requiredAnswers"
        | "requiredInformation"
        | "requiredDocuments"
        | "blockers"
      >
    >,
): TaskDefinition => ({
  ...definition,
  requiredInformation: definition.requiredInformation ?? [],
  requiredDocuments: definition.requiredDocuments ?? [],
  requiredClaimIds: [],
});

const equals = (field: string, value: string | boolean): Rule => ({
  field,
  operator: "equals",
  value,
});

const importTasks: readonly TaskDefinition[] = [
  task({
    id: "confirm-importer-readiness",
    title: "Confirm importer readiness",
    action: "Resolve the importing entity's basic readiness.",
    reason: "Importer identity and registrations change downstream branches.",
    authority: central("Government and regulated institutions"),
    classification: "required",
    requiredAnswers: ["commercialPurpose", "entityType", "hasGstRegistration"],
  }),
  task({
    id: "obtain-iec",
    title: "Obtain an Importer Exporter Code",
    action: "Resolve the IEC prerequisite.",
    reason: "The user said the importer does not yet have an IEC.",
    authority: central("Directorate General of Foreign Trade"),
    classification: "required",
    dependencies: ["confirm-importer-readiness"],
    appliesWhen: equals("hasIec", false),
    requiredAnswers: ["hasIec"],
  }),
  task({
    id: "validate-existing-iec",
    title: "Validate the existing IEC",
    action: "Confirm the existing IEC is usable for this roadmap.",
    reason: "An existing code replaces the application branch, but readiness remains relevant.",
    authority: central("Directorate General of Foreign Trade"),
    classification: "required",
    dependencies: ["confirm-importer-readiness"],
    appliesWhen: equals("hasIec", true),
    requiredAnswers: ["hasIec"],
  }),
  task({
    id: "prepare-customs-filing-route",
    title: "Prepare the customs filing route",
    action: "Resolve customs-system and operational readiness.",
    reason: "The filing route changes with current registration and transport mode.",
    authority: central("Indian Customs Electronic Gateway"),
    classification: "required",
    dependencies: ["obtain-iec", "validate-existing-iec"],
    requiredAnswers: ["hasIcegateRegistration", "transportMode"],
  }),
  task({
    id: "classify-product",
    title: "Establish the exact Indian product classification",
    action: "Resolve the product dossier and Indian classification.",
    reason: "Policy, duty and regulator branches depend on exact product facts.",
    authority: central("Indian Customs"),
    classification: "required",
    requiredAnswers: [
      "productCategory",
      "intendedUse",
      "condition",
      "originCountry",
    ],
  }),
  task({
    id: "verify-import-policy",
    title: "Verify import policy and regulator gates",
    action: "Resolve import-policy and regulator applicability.",
    reason: "Clearance cannot be predicted before applicable gates are known.",
    authority: central("Directorate General of Foreign Trade and Indian Customs"),
    classification: "required",
    dependencies: ["classify-product"],
    requiredAnswers: ["confirmedItcHsCode", "condition", "intendedUse"],
  }),
  task({
    id: "determine-customs-duty",
    title: "Determine the supported customs-duty position",
    action: "Resolve duty only after classification is confirmed.",
    reason: "A duty conclusion changes with classification, origin and shipment facts.",
    authority: central("Indian Customs"),
    classification: "needs-information",
    dependencies: ["classify-product"],
    requiredAnswers: ["confirmedItcHsCode", "originCountry", "transportMode"],
  }),
  task({
    id: "verify-bis-crs",
    title: "Resolve BIS product-certification applicability",
    action: "Determine whether the selected product needs a BIS branch.",
    reason: "The declared product category activates a certification review.",
    authority: regulator("Bureau of Indian Standards"),
    classification: "conditional",
    dependencies: ["classify-product"],
    appliesWhen: equals("productCategory", "wireless-headphones"),
    requiredAnswers: ["productCategory"],
  }),
  task({
    id: "obtain-wpc-eta",
    title: "Resolve wireless-equipment authorisation",
    action: "Determine the applicable radio-equipment branch.",
    reason: "The user declared a radio transmitter in the product.",
    authority: regulator("Wireless Planning and Coordination Wing"),
    classification: "conditional",
    dependencies: ["classify-product"],
    appliesWhen: equals("containsBluetooth", true),
    requiredAnswers: ["containsBluetooth"],
  }),
  task({
    id: "register-battery-epr",
    title: "Resolve battery waste obligations",
    action: "Determine the battery-waste branch before market placement.",
    reason: "The user declared a battery in the product or package.",
    authority: regulator("Central Pollution Control Board"),
    classification: "conditional",
    dependencies: ["classify-product"],
    appliesWhen: equals("containsBattery", true),
    requiredAnswers: ["containsBattery"],
  }),
  task({
    id: "register-ewaste-epr",
    title: "Resolve electronic-waste obligations",
    action: "Determine the electronic-waste branch before market placement.",
    reason: "Covered electronic equipment can create producer obligations.",
    authority: regulator("Central Pollution Control Board"),
    classification: "conditional",
    dependencies: ["classify-product"],
    appliesWhen: {
      all: [
        equals("productCategory", "wireless-headphones"),
        { field: "udyamClassification", operator: "not-equals", value: "micro" },
      ],
    },
    requiredAnswers: ["productCategory", "udyamClassification"],
  }),
  task({
    id: "complete-legal-metrology",
    title: "Resolve retail-package declarations",
    action: "Determine the retail-packaging branch before sale.",
    reason: "The user said the goods will arrive retail packaged.",
    authority: central("Department of Consumer Affairs"),
    classification: "conditional",
    dependencies: ["classify-product"],
    appliesWhen: equals("retailPackaged", true),
    requiredAnswers: ["retailPackaged"],
  }),
  task({
    id: "register-plastic-epr",
    title: "Resolve plastic-packaging obligations",
    action: "Determine the plastic-packaging branch before market placement.",
    reason: "The declared packaging facts can create an importer or brand-owner branch.",
    authority: regulator("Central Pollution Control Board"),
    classification: "conditional",
    dependencies: ["classify-product"],
    appliesWhen: {
      any: [equals("plasticPackaging", true), equals("brandedByImporter", true)],
    },
    requiredAnswers: ["plasticPackaging", "brandedByImporter"],
  }),
  task({
    id: "prepare-shipment-evidence",
    title: "Prepare shipment evidence",
    action: "Resolve the evidence worklist for the shipment stage and mode.",
    reason: "Customs and other actors depend on a consistent shipment dossier.",
    authority: { name: "Importer and operational providers", type: "private-operational" },
    classification: "required",
    dependencies: ["verify-import-policy"],
    requiredAnswers: ["shipmentStage", "transportMode"],
  }),
  task({
    id: "complete-customs-clearance",
    title: "Complete customs and regulator clearance",
    action: "Complete the supported clearance worklist.",
    reason: "The shipment cannot enter commerce until the applicable gates are resolved.",
    authority: central("Indian Customs and participating government agencies"),
    classification: "required",
    dependencies: [
      "prepare-customs-filing-route",
      "verify-import-policy",
      "prepare-shipment-evidence",
      "verify-bis-crs",
      "obtain-wpc-eta",
      "register-battery-epr",
      "register-ewaste-epr",
      "complete-legal-metrology",
      "register-plastic-epr",
    ],
  }),
];

export const importRegulatedProductPack: KnowledgePackV1 = {
  schemaVersion: REGISTRY_SCHEMA_VERSION,
  id: "fixture.import-regulated-product",
  version: "1.0.0",
  lifecycle: "fixture",
  sources: [],
  claims: [],
  journeys: [],
  questions: importQuestions,
  tasks: importTasks,
  outcomes: [
    {
      id: "import-regulated-product",
      version: "1.0.0",
      title: "Import and legally sell a regulated product",
      description:
        "Prepare, clear and complete the post-import obligations for a commercial product shipment into India.",
      domains: ["business-employment-compliance"],
      intentPhrases: [
        "import",
        "shipment",
        "customs clearance",
        "bring goods into india",
        "buy products from china",
      ],
      questionIds: importQuestions.map((question) => question.id),
      taskIds: importTasks.map((item) => item.id),
    },
  ],
};
