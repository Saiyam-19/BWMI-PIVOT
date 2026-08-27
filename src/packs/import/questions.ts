import type { QuestionDefinition } from "../../domain.js";

const importQuestionDrafts: readonly Omit<QuestionDefinition, "factKey">[] = [
  {
    id: "commercialPurpose",
    prompt: "Is this shipment connected with trade, manufacture or commercial resale?",
    reason: "Commercial purpose changes IEC and import-policy applicability.",
  },
  {
    id: "entityType",
    prompt: "Which Indian person or entity will act as importer?",
    reason: "Importer identity controls IEC, GST, banking and portal registration.",
  },
  {
    id: "hasGstRegistration",
    prompt: "Does the importer already have an active GST registration?",
    reason: "This changes tax readiness and post-import credit tasks.",
  },
  {
    id: "hasIec",
    prompt: "Does the importer already have an active IEC?",
    reason: "An existing IEC removes the application task but still needs validation.",
  },
  {
    id: "hasIcegateRegistration",
    prompt: "Is the IEC already registered for the intended customs filing route?",
    reason: "This determines customs portal readiness.",
  },
  {
    id: "shipmentStage",
    prompt: "Is the shipment being planned, ordered, dispatched, arrived or held by customs?",
    reason: "The safe next action and urgency depend on the shipment stage.",
  },
  {
    id: "productCategory",
    prompt: "What exactly is the product and model?",
    reason: "Product identity changes classification, policy, duty and regulator branches.",
  },
  {
    id: "intendedUse",
    prompt: "Will the goods be resold, used in manufacturing, used for R&D or kept for personal use?",
    reason: "Intended use can change exemptions and regulatory obligations.",
  },
  {
    id: "condition",
    prompt: "Are the goods new, used, refurbished, a sample, a repair return or waste?",
    reason: "Condition can change import policy and approvals.",
  },
  {
    id: "containsBluetooth",
    prompt: "Does the product contain Bluetooth, Wi-Fi or another radio transmitter?",
    reason: "Radio equipment can activate WPC or telecom-approval branches.",
  },
  {
    id: "containsBattery",
    prompt: "Does the product or its package contain a battery?",
    reason: "Battery content can activate battery EPR and transport-document tasks.",
  },
  {
    id: "includesMainsPowerAdapter",
    prompt: "Is a mains-powered charger or power adaptor included?",
    reason: "An included adaptor can require separate classification and certification review.",
  },
  {
    id: "retailPackaged",
    prompt: "Will the imported item arrive in a package intended for retail sale?",
    reason: "Retail packaging can activate Legal Metrology requirements.",
  },
  {
    id: "plasticPackaging",
    prompt: "Will the importer introduce plastic packaging into the Indian market?",
    reason: "Plastic packaging can activate CPCB EPR obligations.",
  },
  {
    id: "brandedByImporter",
    prompt: "Will the goods be sold under the importer's own brand?",
    reason: "Brand ownership is relevant to producer and packaging obligations.",
  },
  {
    id: "udyamClassification",
    prompt: "Is the importer micro, small, medium or not registered under Udyam?",
    reason: "Enterprise class can change an E-Waste applicability branch.",
  },
  {
    id: "originCountry",
    prompt: "What is the country of origin and the manufacturer's country?",
    reason: "Origin affects policy, preference, trade-remedy and manufacturer checks.",
  },
  {
    id: "transportMode",
    prompt: "Will the shipment arrive by sea, air, courier, post, land or baggage?",
    reason: "Mode changes the customs filing and logistics journey.",
  },
  {
    id: "confirmedItcHsCode",
    prompt: "Has the exact Indian eight-digit ITC-HS code been confirmed against the product dossier?",
    reason: "Duty and clearance conclusions are withheld until classification is confirmed.",
  },
];

export const importQuestions: readonly QuestionDefinition[] =
  importQuestionDrafts.map((question) => ({
    ...question,
    factKey: question.id,
  }));
