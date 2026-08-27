import type { Answers, Rule } from "./domain.js";

export interface RuleEvaluation {
  readonly result: true | false | "unknown";
  readonly missingFields: readonly string[];
}

const unique = (values: readonly string[]): readonly string[] => [
  ...new Set(values),
];

export function evaluateRule(rule: Rule, answers: Answers): RuleEvaluation {
  if ("field" in rule) {
    const answer = answers[rule.field];
    if (answer === undefined || answer === null) {
      return { result: "unknown", missingFields: [rule.field] };
    }

    if (!("values" in rule) && rule.operator === "equals") {
      return { result: answer === rule.value, missingFields: [] };
    }
    if (!("values" in rule) && rule.operator === "not-equals") {
      return { result: answer !== rule.value, missingFields: [] };
    }
    return {
      result: "values" in rule && rule.values.includes(answer),
      missingFields: [],
    };
  }

  if ("not" in rule) {
    const inner = evaluateRule(rule.not, answers);
    if (inner.result === "unknown") {
      return inner;
    }
    return { result: !inner.result, missingFields: [] };
  }

  const evaluations = ("all" in rule ? rule.all : rule.any).map((child) =>
    evaluateRule(child, answers),
  );
  const missingFields = unique(
    evaluations.flatMap((evaluation) => evaluation.missingFields),
  );

  if ("all" in rule) {
    if (evaluations.some((evaluation) => evaluation.result === false)) {
      return { result: false, missingFields: [] };
    }
    if (evaluations.some((evaluation) => evaluation.result === "unknown")) {
      return { result: "unknown", missingFields };
    }
    return { result: true, missingFields: [] };
  }

  if (evaluations.some((evaluation) => evaluation.result === true)) {
    return { result: true, missingFields: [] };
  }
  if (evaluations.some((evaluation) => evaluation.result === "unknown")) {
    return { result: "unknown", missingFields };
  }
  return { result: false, missingFields: [] };
}
