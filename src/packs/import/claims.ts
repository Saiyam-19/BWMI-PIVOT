import type { ClaimDefinition, EvidenceSourceDefinition } from "../../domain.js";
import { importSources as sources } from "./sources.js";

const draftClaim = (
  id: string,
  statement: string,
  supportingSources: readonly EvidenceSourceDefinition[],
): ClaimDefinition => ({
  id,
  kind: "legal-obligation",
  statement,
  status: "under-review",
  sourceIds: supportingSources.map((source) => source.id),
  jurisdiction: { countryCode: "IN", level: "central" },
});

export const importClaims: readonly ClaimDefinition[] = [
  draftClaim(
    "commercial-goods-usually-require-iec",
    "An Importer Exporter Code is generally mandatory for importing or exporting goods, subject to the exemptions in the Foreign Trade Policy.",
    [sources.foreignTradePolicy],
  ),
  draftClaim(
    "iec-has-official-online-application",
    "DGFT provides an online IEC application and profile-management journey with identity, entity, bank, signing and submission steps.",
    [sources.iecManual],
  ),
  draftClaim(
    "icegate-has-iec-registration-route",
    "ICEGATE provides an IEC-holder registration route for customs services.",
    [sources.icegateRegistration],
  ),
  draftClaim(
    "import-policy-depends-on-eight-digit-classification",
    "Import policy, duty and participating-government-agency requirements must be checked against the product's Indian tariff classification and facts.",
    [sources.importTradeGuide],
  ),
  draftClaim(
    "wireless-headphones-appear-in-bis-crs-list",
    "Wireless headphones and earphones appear in the BIS Scheme II compulsory-registration product list.",
    [sources.bisCrs],
  ),
  draftClaim(
    "eligible-wireless-products-use-wpc-eta",
    "Eligible finished wireless products operating in de-licensed bands use the WPC Equipment Type Approval route; applicability depends on the equipment and radio characteristics.",
    [sources.wpcEta],
  ),
  draftClaim(
    "battery-equipment-importer-can-be-producer",
    "The Battery Waste Management Rules include importers of equipment containing batteries within the producer framework.",
    [sources.batteryRules],
  ),
  draftClaim(
    "electronic-equipment-importer-can-have-ewaste-obligations",
    "An importer placing covered electrical or electronic equipment on the Indian market can have producer registration, EPR and RoHS obligations.",
    [sources.eWasteFaq],
  ),
  draftClaim(
    "ewaste-framework-has-micro-enterprise-branch",
    "The E-Waste framework contains an applicability branch for micro enterprises that must be evaluated from the current enterprise classification.",
    [sources.eWasteFaq],
  ),
  draftClaim(
    "plastic-packaging-importer-has-epr-route",
    "Importers introducing covered plastic packaging use the CPCB producer, importer and brand-owner EPR system when the rules apply.",
    [sources.plasticEpr],
  ),
  draftClaim(
    "retail-packaged-imports-have-legal-metrology-obligations",
    "Retail-prepackaged imported commodities can trigger importer registration and mandatory package declarations under the Legal Metrology framework.",
    [sources.legalMetrologyRules],
  ),
  draftClaim(
    "import-payment-runs-through-ad-bank-controls",
    "Import remittance and evidence matching are handled through an authorised dealer bank under RBI's import directions.",
    [sources.rbiImportDirection],
  ),
  draftClaim(
    "esanchit-carries-supporting-customs-documents",
    "e-Sanchit is the official customs channel for uploading supporting documents referenced in the import declaration.",
    [sources.eSanchit],
  ),
  draftClaim(
    "customs-single-window-requires-pga-dispositions",
    "A customs Out of Charge decision depends on customs assessment and the applicable participating-government-agency dispositions.",
    [sources.customsSingleWindow],
  ),
  draftClaim(
    "bill-of-entry-supports-import-igst-credit",
    "A Bill of Entry is a recognised document for eligible input-tax-credit claims on imported goods.",
    [sources.gstInputCredit],
  ),
];
